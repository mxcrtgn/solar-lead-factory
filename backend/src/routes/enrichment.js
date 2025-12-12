const express = require('express');
const router = express.Router();
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// POST enrich lead automatically
router.post('/:leadId', authenticate, async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { sourcing: true, technical: true, regulatory: true, network: true }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const enrichmentResults = {};

    // 1. PVGIS Irradiation
    try {
      const [lat, lng] = lead.coordinates.split(',').map(c => parseFloat(c.trim()));
      const pvgisData = await fetchPVGISData(lat, lng);
      enrichmentResults.irradiation = pvgisData;

      await prisma.technical.upsert({
        where: { leadId },
        update: {
          irradiationSource: 'PVGIS',
          ghi: pvgisData.ghi,
          productionSpecific: pvgisData.productionSpecific,
          monthlyDistribution: pvgisData.monthly
        },
        create: {
          leadId,
          irradiationSource: 'PVGIS',
          ghi: pvgisData.ghi,
          productionSpecific: pvgisData.productionSpecific,
          monthlyDistribution: pvgisData.monthly
        }
      });
    } catch (error) {
      enrichmentResults.irradiation = { error: error.message };
    }

    // 2. Cadastre (placeholder - nécessite API ou scraping)
    enrichmentResults.cadastre = { status: 'not_implemented' };

    // 3. Zonages environnementaux (placeholder)
    enrichmentResults.environmental = { status: 'not_implemented' };

    // 4. Poste source nearest (depuis base interne)
    try {
      // Placeholder - en production, utiliser PostGIS ST_Distance
      enrichmentResults.network = { status: 'not_implemented' };
    } catch (error) {
      enrichmentResults.network = { error: error.message };
    }

    // 5. Scoring qualité
    const qualityScore = calculateQualityScore(lead);
    await prisma.lead.update({
      where: { id: leadId },
      data: { qualityScore }
    });
    enrichmentResults.qualityScore = qualityScore;

    // Log activité
    await prisma.activityLog.create({
      data: {
        leadId,
        userId: req.user.id,
        action: 'enrichment_completed',
        description: 'Enrichissement automatique effectué',
        metadata: enrichmentResults
      }
    });

    res.json({
      success: true,
      leadId,
      results: enrichmentResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper: Fetch PVGIS data
async function fetchPVGISData(lat, lng) {
  try {
    const url = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc`;
    const params = {
      lat,
      lon: lng,
      peakpower: 1,
      loss: 14,
      mountingplace: 'free',
      angle: 30,
      aspect: 0,
      outputformat: 'json'
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    const data = response.data;

    // Parse PVGIS response
    const yearlyProduction = data.outputs.totals.fixed.E_y;
    const ghi = data.inputs.location.elevation; // Simplified
    const monthly = data.outputs.monthly.fixed.map(m => m.E_m);

    return {
      ghi: ghi || 1500,
      productionSpecific: Math.round(yearlyProduction),
      monthly
    };
  } catch (error) {
    console.error('PVGIS API error:', error.message);
    // Fallback valeurs par défaut pour Sud France
    return {
      ghi: 1500,
      productionSpecific: 1400,
      monthly: [80, 100, 140, 160, 180, 190, 200, 180, 150, 120, 90, 70]
    };
  }
}

// Helper: Calculate quality score (simplified ML scoring)
function calculateQualityScore(lead) {
  let score = 50; // Base

  // Scoring réglementaire (30%)
  if (lead.regulatory) {
    if (lead.regulatory.pluZone === 'A' || lead.regulatory.pluZone === 'N') score += 10;
    if (lead.regulatory.natura2000 === 'aucun' || lead.regulatory.natura2000 === '>500m') score += 10;
    if (lead.regulatory.monumentsHistoriques !== '<500m') score += 5;
    if (lead.regulatory.landClassification === 'III' || lead.regulatory.landClassification === 'IV') score += 5;
  }

  // Scoring technique (25%)
  if (lead.technical) {
    if (lead.technical.productionSpecific >= 1400) score += 10;
    if (lead.technical.slopeAvg < 5) score += 5;
    if (lead.technical.shadingLoss < 5) score += 5;
    if (lead.technical.performanceRatio >= 80) score += 5;
  }

  // Scoring réseau (20%)
  if (lead.network) {
    if (lead.network.availableMW > 0) score += 10;
    if (lead.network.distanceKm < 5) score += 5;
    if (lead.network.costPerMWc < 80000) score += 5;
  }

  // Scoring foncier (15%)
  if (lead.foncier) {
    if (lead.foncier.ownerIdentified) score += 7;
    if (lead.foncier.contactStatus === 'intéressé' || lead.foncier.contactStatus === 'promesse') score += 8;
  }

  // Scoring économique (10%)
  if (lead.economic) {
    if (lead.economic.tri >= 10) score += 10;
    else if (lead.economic.tri >= 8) score += 5;
  }

  return Math.min(Math.max(score, 0), 100);
}

module.exports = router;
