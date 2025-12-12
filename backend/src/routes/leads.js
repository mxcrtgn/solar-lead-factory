const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET all leads (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, assignedTo, minScore, region } = req.query;

    const where = {};
    if (status) where.status = status;
    if (assignedTo) where.assignedToId = assignedTo;
    if (minScore) where.qualityScore = { gte: parseInt(minScore) };
    if (region) where.region = region;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        sourcing: true,
        regulatory: true,
        technical: true,
        network: true,
        economic: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET checklist items for a lead
router.get('/:id/checklist', authenticate, async (req, res) => {
  try {
    const checklistItems = await prisma.checklistItem.findMany({
      where: { leadId: req.params.id },
      orderBy: [
        { stage: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group by stage
    const groupedByStage = checklistItems.reduce((acc, item) => {
      if (!acc[item.stage]) {
        acc[item.stage] = [];
      }
      acc[item.stage].push(item);
      return acc;
    }, {});

    res.json(groupedByStage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH checklist item completion
router.patch('/:leadId/checklist/:itemId', authenticate, async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedItem = await prisma.checklistItem.update({
      where: { id: req.params.itemId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
        completedBy: completed ? req.user.id : null
      }
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET lead by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: true,
        assignedTo: true,
        sourcing: true,
        regulatory: true,
        technical: true,
        network: true,
        foncier: true,
        economic: true,
        documents: true,
        comments: {
          include: { author: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        activityLogs: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new lead
router.post('/', authenticate, async (req, res) => {
  try {
    const { commune, department, region, coordinates, surfaceHa } = req.body;

    // Générer nom interne unique
    const count = await prisma.lead.count();
    const internalName = `${commune.substring(0, 3).toUpperCase()}-${region.substring(0, 3).toUpperCase()}-${String(count + 1).padStart(3, '0')}`;

    const lead = await prisma.lead.create({
      data: {
        internalName,
        commune,
        department,
        region,
        coordinates,
        surfaceHa: parseFloat(surfaceHa),
        cadastreRefs: req.body.cadastreRefs || [],
        createdById: req.user.id,
        assignedToId: req.user.id,
        sourcing: {
          create: {
            identifiedDate: new Date(),
            source: req.body.source || 'prospection'
          }
        }
      },
      include: {
        sourcing: true,
        createdBy: { select: { firstName: true, lastName: true } }
      }
    });

    // Log activité
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        userId: req.user.id,
        action: 'lead_created',
        description: `Lead ${internalName} créé`,
        metadata: { commune, region }
      }
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update lead
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Extraire updates nested (sourcing, regulatory, etc.)
    const nestedUpdates = {};
    const mainUpdates = {};

    Object.keys(updates).forEach(key => {
      if (['sourcing', 'regulatory', 'technical', 'network', 'foncier', 'economic'].includes(key)) {
        nestedUpdates[key] = updates[key];
      } else {
        mainUpdates[key] = updates[key];
      }
    });

    // Update lead principal
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...mainUpdates,
        updatedAt: new Date()
      }
    });

    // Update nested relations
    for (const [relation, data] of Object.entries(nestedUpdates)) {
      await prisma[relation].upsert({
        where: { leadId: id },
        update: data,
        create: { leadId: id, ...data }
      });
    }

    // Log activité
    await prisma.activityLog.create({
      data: {
        leadId: id,
        userId: req.user.id,
        action: 'lead_updated',
        description: `Lead mis à jour`,
        metadata: { fields: Object.keys(updates) }
      }
    });

    // Recalculer complétude
    await updateCompleteness(id);

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update lead status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { status, updatedAt: new Date() }
    });

    // Log activité
    await prisma.activityLog.create({
      data: {
        leadId: id,
        userId: req.user.id,
        action: 'status_changed',
        description: `Statut changé vers ${status}`,
        metadata: { newStatus: status }
      }
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST assign lead to user
router.post('/:id/assign', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId: userId }
    });

    // Créer notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'lead_assigned',
        title: 'Nouveau lead assigné',
        message: `Le lead ${lead.internalName} vous a été assigné`,
        linkUrl: `/leads/${id}`
      }
    });

    // Log activité
    await prisma.activityLog.create({
      data: {
        leadId: id,
        userId: req.user.id,
        action: 'lead_assigned',
        description: `Lead assigné à un utilisateur`,
        metadata: { userId }
      }
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper: Calculer % complétude
async function updateCompleteness(leadId) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      sourcing: true,
      regulatory: true,
      technical: true,
      network: true,
      foncier: true,
      economic: true
    }
  });

  let totalFields = 0;
  let filledFields = 0;

  // Compter champs remplis (logique simplifiée)
  const checkFields = (obj, fields) => {
    fields.forEach(field => {
      totalFields++;
      if (obj && obj[field] != null && obj[field] !== '') filledFields++;
    });
  };

  checkFields(lead, ['coordinates', 'surfaceHa', 'commune', 'department', 'region']);
  checkFields(lead.sourcing, ['slope', 'landUse', 'access']);
  checkFields(lead.regulatory, ['pluZone', 'natura2000', 'riskScore']);
  checkFields(lead.technical, ['ghi', 'productionSpecific', 'targetMWc']);
  checkFields(lead.network, ['substationName', 'availableMW', 'totalConnectionCost']);
  checkFields(lead.foncier, ['ownerIdentified', 'contactStatus', 'transactionType']);
  checkFields(lead.economic, ['totalCapex', 'totalOpexYear', 'tri']);

  const completeness = Math.round((filledFields / totalFields) * 100);

  await prisma.lead.update({
    where: { id: leadId },
    data: { completeness }
  });
}

module.exports = router;
