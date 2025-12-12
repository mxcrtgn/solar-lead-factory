const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Communes françaises avec départements
const communes = [
  { name: 'Salon-de-Provence', dept: '13', region: 'PACA', coords: '43.6234,5.0981' },
  { name: 'Aix-en-Provence', dept: '13', region: 'PACA', coords: '43.5297,5.4474' },
  { name: 'Arles', dept: '13', region: 'PACA', coords: '43.6771,4.6309' },
  { name: 'Carpentras', dept: '84', region: 'PACA', coords: '44.0556,5.0481' },
  { name: 'Avignon', dept: '84', region: 'PACA', coords: '43.9493,4.8055' },
  { name: 'Montpellier', dept: '34', region: 'Occitanie', coords: '43.6108,3.8767' },
  { name: 'Nîmes', dept: '30', region: 'Occitanie', coords: '43.8367,4.3601' },
  { name: 'Béziers', dept: '34', region: 'Occitanie', coords: '43.3439,3.2150' },
  { name: 'Perpignan', dept: '66', region: 'Occitanie', coords: '42.6886,2.8948' },
  { name: 'Toulouse', dept: '31', region: 'Occitanie', coords: '43.6047,1.4442' },
  { name: 'Bordeaux', dept: '33', region: 'Nouvelle-Aquitaine', coords: '44.8378,-0.5792' },
  { name: 'La Rochelle', dept: '17', region: 'Nouvelle-Aquitaine', coords: '46.1591,-1.1520' },
  { name: 'Poitiers', dept: '86', region: 'Nouvelle-Aquitaine', coords: '46.5802,0.3404' },
  { name: 'Limoges', dept: '87', region: 'Nouvelle-Aquitaine', coords: '45.8336,1.2611' },
  { name: 'Lyon', dept: '69', region: 'Auvergne-Rhône-Alpes', coords: '45.7640,4.8357' },
  { name: 'Grenoble', dept: '38', region: 'Auvergne-Rhône-Alpes', coords: '45.1885,5.7245' },
  { name: 'Valence', dept: '26', region: 'Auvergne-Rhône-Alpes', coords: '44.9334,4.8924' },
  { name: 'Clermont-Ferrand', dept: '63', region: 'Auvergne-Rhône-Alpes', coords: '45.7772,3.0870' },
  { name: 'Tours', dept: '37', region: 'Centre-Val de Loire', coords: '47.3941,0.6848' },
  { name: 'Orléans', dept: '45', region: 'Centre-Val de Loire', coords: '47.9029,1.9093' },
];

const statuses = ['SOURCING', 'REGULATORY_ANALYSIS', 'TECHNICAL_STUDY', 'NETWORK_STUDY', 'FONCIER', 'ECONOMIC_MODEL', 'QA_REVIEW', 'VALIDATED', 'REJECTED'];

const sources = ['prospection', 'inbound', 'partenaire', 'appel_offre'];
const landUses = ['agricole', 'friche_industrielle', 'terrain_degrade', 'prairie'];
const shadings = ['faible', 'moyen', 'fort'];

// Checklists détaillées pour chaque étape du pipeline
const pipelineChecklists = {
  SOURCING: [
    { label: 'Identification du terrain via satellite', description: 'Analyse satellite avec IA pour détecter terrains potentiels', aiAssisted: true, dataSource: 'AI_SATELLITE_ANALYSIS' },
    { label: 'Vérification surface disponible', description: 'Mesure précise via API IGN Cadastre', aiAssisted: true, dataSource: 'API_IGN_CADASTRE' },
    { label: 'Analyse topographique préliminaire', description: 'Pente et orientation via données DEM', aiAssisted: true, dataSource: 'API_IGN_DEM' },
    { label: 'Vérification accessibilité terrain', description: 'Analyse des routes et accès via cartographie', aiAssisted: false, dataSource: 'MANUAL' },
    { label: 'Évaluation ombrage initial', description: 'IA détection obstacles (arbres, bâtiments)', aiAssisted: true, dataSource: 'AI_SATELLITE_ANALYSIS' },
    { label: 'Score de qualité initial calculé', description: 'Algorithme scoring multi-critères', aiAssisted: true, dataSource: 'AI_SCORING' },
  ],
  REGULATORY_ANALYSIS: [
    { label: 'Extraction PLU automatique', description: 'Récupération PLU via API Géoportail Urbanisme', aiAssisted: true, dataSource: 'API_GPU' },
    { label: 'Analyse compatibilité PLU', description: 'IA lecture documents PLU pour compatibilité PV', aiAssisted: true, dataSource: 'AI_DOCUMENT_ANALYSIS' },
    { label: 'Vérification Natura 2000', description: 'API INPN pour distance aux zones protégées', aiAssisted: true, dataSource: 'API_INPN' },
    { label: 'Monuments historiques 500m', description: 'Vérification périmètre Monuments Historiques', aiAssisted: true, dataSource: 'API_MERIMEE' },
    { label: 'Zones inondables PPRN', description: 'Consultation base Géorisques', aiAssisted: true, dataSource: 'API_GEORISQUES' },
    { label: 'Classification parcelle agricole', description: 'Vérification CDPENAF et qualité agronomique', aiAssisted: true, dataSource: 'API_RPG' },
    { label: 'Jurisprudence locale', description: 'IA recherche projets similaires et décisions', aiAssisted: true, dataSource: 'AI_JURISPRUDENCE' },
    { label: 'Score risque réglementaire', description: 'Algorithme scoring multi-critères réglementaires', aiAssisted: true, dataSource: 'AI_SCORING' },
  ],
  TECHNICAL_STUDY: [
    { label: 'Données irradiation PVGIS', description: 'Récupération GHI et production spécifique', aiAssisted: true, dataSource: 'API_PVGIS' },
    { label: 'Distribution mensuelle production', description: 'Calcul production P50/P75/P90', aiAssisted: true, dataSource: 'AI_ANALYSIS' },
    { label: 'Analyse topographique fine', description: 'Pentes, orientation, altitude précises', aiAssisted: true, dataSource: 'API_IGN_DEM' },
    { label: 'Étude ombrage détaillée', description: 'Simulation 3D pertes ombrage annuelles', aiAssisted: true, dataSource: 'AI_3D_SIMULATION' },
    { label: 'Analyse géotechnique préliminaire', description: 'Type de sol et risques via données BRGM', aiAssisted: true, dataSource: 'API_BRGM' },
    { label: 'Dimensionnement optimal', description: 'IA optimisation MWc vs surface disponible', aiAssisted: true, dataSource: 'AI_OPTIMIZATION' },
    { label: 'Choix technologie (fixe/tracker)', description: 'Comparaison TRI fixe vs tracker', aiAssisted: true, dataSource: 'AI_ANALYSIS' },
    { label: 'Plan implantation généré', description: 'IA génération layout optimal des panneaux', aiAssisted: true, dataSource: 'AI_LAYOUT_GENERATION' },
  ],
  NETWORK_STUDY: [
    { label: 'Identification poste source', description: 'Recherche poste le plus proche via Enedis/RTE', aiAssisted: true, dataSource: 'API_ENEDIS' },
    { label: 'Consultation S3REnR', description: 'Données capacité disponible au poste', aiAssisted: true, dataSource: 'API_S3RENR' },
    { label: 'Calcul distance raccordement', description: 'Trajet optimal via algorithme géographique', aiAssisted: true, dataSource: 'AI_ROUTING' },
    { label: 'Analyse file d\'attente', description: 'Projets en attente au poste source', aiAssisted: true, dataSource: 'API_S3RENR' },
    { label: 'Chiffrage coût raccordement', description: 'Estimation basée distance et puissance', aiAssisted: true, dataSource: 'AI_COST_ESTIMATION' },
    { label: 'Estimation délais PTF/ATR', description: 'ML prédiction délais selon zone', aiAssisted: true, dataSource: 'AI_DELAY_PREDICTION' },
    { label: 'Complexité technique évaluée', description: 'Score complexité travaux raccordement', aiAssisted: true, dataSource: 'AI_SCORING' },
  ],
  FONCIER: [
    { label: 'Identification propriétaire(s)', description: 'Extraction matrices cadastrales', aiAssisted: true, dataSource: 'API_CADASTRE' },
    { label: 'Recherche coordonnées propriétaire', description: 'Enrichissement base Infogreffe/Societe.com', aiAssisted: true, dataSource: 'API_SOCIETECOM' },
    { label: 'Premier contact propriétaire', description: 'Email/courrier automatisé personnalisé', aiAssisted: true, dataSource: 'AI_EMAIL_GENERATION' },
    { label: 'Relances propriétaire', description: 'Séquence relances automatiques', aiAssisted: true, dataSource: 'AI_EMAIL_SEQUENCE' },
    { label: 'Évaluation loyer marché', description: 'Benchmark loyers solaires dans la région', aiAssisted: true, dataSource: 'AI_MARKET_ANALYSIS' },
    { label: 'Vérification servitudes', description: 'Recherche servitudes hypothèque', aiAssisted: false, dataSource: 'MANUAL' },
    { label: 'Préparation promesse de bail', description: 'Génération contrat type personnalisé', aiAssisted: true, dataSource: 'AI_DOCUMENT_GENERATION' },
  ],
  ECONOMIC_MODEL: [
    { label: 'Estimation CAPEX panneaux', description: 'Prix marché selon technologie et volume', aiAssisted: true, dataSource: 'AI_MARKET_PRICING' },
    { label: 'Estimation CAPEX onduleurs', description: 'Prix selon architecture choisie', aiAssisted: true, dataSource: 'AI_MARKET_PRICING' },
    { label: 'Estimation structures/VRD', description: 'Coûts selon topographie et géotechnique', aiAssisted: true, dataSource: 'AI_COST_ESTIMATION' },
    { label: 'Intégration coût raccordement', description: 'Import depuis étude réseau', aiAssisted: true, dataSource: 'AUTO_IMPORT' },
    { label: 'OPEX optimisé calculé', description: 'O&M, assurances, loyer, taxes', aiAssisted: true, dataSource: 'AI_COST_ESTIMATION' },
    { label: 'Scénario revenus CRE/PPA', description: 'Simulation prix électricité et contrat', aiAssisted: true, dataSource: 'AI_REVENUE_MODELING' },
    { label: 'Calcul TRI/VAN/LCOE', description: 'Modèle financier DCF complet', aiAssisted: true, dataSource: 'AI_FINANCIAL_MODEL' },
    { label: 'Analyse sensibilité', description: 'Impact variations CAPEX, production, prix', aiAssisted: true, dataSource: 'AI_SENSITIVITY' },
  ],
  QA_REVIEW: [
    { label: 'Vérification cohérence données', description: 'IA détection incohérences entre sections', aiAssisted: true, dataSource: 'AI_QA_CHECK' },
    { label: 'Validation ratios techniques', description: 'MWc/ha, PR, GCR dans normes', aiAssisted: true, dataSource: 'AI_QA_CHECK' },
    { label: 'Revue économique', description: 'TRI et CAPEX/MWc cohérents marché', aiAssisted: true, dataSource: 'AI_QA_CHECK' },
    { label: 'Complétude documents', description: 'Check tous docs requis présents', aiAssisted: true, dataSource: 'AI_QA_CHECK' },
    { label: 'Revue comité interne', description: 'Présentation lead au comité', aiAssisted: false, dataSource: 'MANUAL' },
    { label: 'Décision GO/NO-GO', description: 'Validation finale pour développement', aiAssisted: false, dataSource: 'MANUAL' },
  ],
};

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.revenueGoal.deleteMany({});
  await prisma.checklistItem.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.economic.deleteMany({});
  await prisma.foncier.deleteMany({});
  await prisma.network.deleteMany({});
  await prisma.regulatory.deleteMany({});
  await prisma.technical.deleteMany({});
  await prisma.sourcing.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  console.log('👥 Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const opsPassword = await bcrypt.hash('ops123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'hortense@lfs.fr',
      password: adminPassword,
      firstName: 'Hortense',
      lastName: 'Foillard',
      role: 'ADMIN',
    },
  });

  const guillaume = await prisma.user.create({
    data: {
      email: 'guillaume@lfs.fr',
      password: opsPassword,
      firstName: 'Guillaume',
      lastName: 'Bougeard',
      role: 'OPS',
    },
  });

  const matheo = await prisma.user.create({
    data: {
      email: 'matheo@lfs.fr',
      password: opsPassword,
      firstName: 'Mathéo',
      lastName: 'Degras',
      role: 'OPS',
    },
  });

  const lucas = await prisma.user.create({
    data: {
      email: 'lucas@lfs.fr',
      password: opsPassword,
      firstName: 'Lucas',
      lastName: 'Lamquet',
      role: 'OPS',
    },
  });

  const romain = await prisma.user.create({
    data: {
      email: 'romain@lfs.fr',
      password: opsPassword,
      firstName: 'Romain',
      lastName: 'Denes',
      role: 'OPS',
    },
  });

  const elise = await prisma.user.create({
    data: {
      email: 'elise@lfs.fr',
      password: opsPassword,
      firstName: 'Élise',
      lastName: 'Carton',
      role: 'OPS',
    },
  });

  const diane = await prisma.user.create({
    data: {
      email: 'diane@lfs.fr',
      password: opsPassword,
      firstName: 'Diane',
      lastName: 'Gédon',
      role: 'OPS',
    },
  });

  const jalil = await prisma.user.create({
    data: {
      email: 'jalil@lfs.fr',
      password: opsPassword,
      firstName: 'Jalil',
      lastName: 'Hajjaj',
      role: 'OPS',
    },
  });

  const ops2 = await prisma.user.create({
    data: {
      email: 'julien@lfs.fr',
      password: opsPassword,
      firstName: 'Julien',
      lastName: 'Bernard',
      role: 'OPS',
    },
  });

  const ops3 = await prisma.user.create({
    data: {
      email: 'claire@lfs.fr',
      password: opsPassword,
      firstName: 'Claire',
      lastName: 'Rousseau',
      role: 'OPS',
    },
  });

  console.log(`✅ Created ${10} users\n`);

  const users = [guillaume, matheo, lucas, romain, elise, diane, jalil, ops2, ops3];

  // Create leads
  console.log('📋 Creating leads...');
  const leads = [];

  for (let i = 0; i < 25; i++) {
    const commune = communes[i % communes.length];
    const statusIndex = i % statuses.length;
    const status = statuses[statusIndex];
    const assignedUser = users[i % users.length];

    const surfaceHa = (Math.random() * 15 + 2).toFixed(1);
    const qualityScore = Math.floor(Math.random() * 30 + 60); // 60-90
    const estimatedMWc = (surfaceHa * 0.7).toFixed(1);
    const estimatedTRI = (Math.random() * 5 + 8).toFixed(1); // 8-13%

    const internalName = `${commune.name.substring(0, 3).toUpperCase()}-${commune.region.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`;

    const lead = await prisma.lead.create({
      data: {
        internalName,
        commune: commune.name,
        department: commune.dept,
        region: commune.region,
        coordinates: commune.coords,
        cadastreRefs: JSON.stringify([`${commune.dept} ${Math.floor(Math.random() * 999)}`, `${commune.dept} ${Math.floor(Math.random() * 999)}`]),
        surfaceHa: parseFloat(surfaceHa),
        qualityScore,
        completeness: statusIndex * 11, // 0, 11, 22, 33...
        estimatedMWc: parseFloat(estimatedMWc),
        estimatedTRI: parseFloat(estimatedTRI),
        createdById: admin.id,
        assignedToId: assignedUser.id,
        status,
        sourcing: {
          create: {
            source: sources[i % sources.length],
            slope: parseFloat((Math.random() * 8 + 1).toFixed(1)),
            landUse: landUses[i % landUses.length],
            access: Math.random() > 0.3,
            shading: shadings[i % shadings.length],
            notes: `Terrain identifié lors de la prospection ${new Date().toLocaleDateString('fr-FR')}`,
          },
        },
        technical: {
          create: {
            irradiationSource: 'PVGIS',
            ghi: Math.floor(Math.random() * 200 + 1500),
            productionSpecific: Math.floor(Math.random() * 200 + 1300),
            monthlyDistribution: JSON.stringify([
              Math.floor(Math.random() * 20 + 70),
              Math.floor(Math.random() * 20 + 90),
              Math.floor(Math.random() * 20 + 130),
              Math.floor(Math.random() * 20 + 150),
              Math.floor(Math.random() * 20 + 170),
              Math.floor(Math.random() * 20 + 180),
              Math.floor(Math.random() * 20 + 190),
              Math.floor(Math.random() * 20 + 170),
              Math.floor(Math.random() * 20 + 140),
              Math.floor(Math.random() * 20 + 110),
              Math.floor(Math.random() * 20 + 80),
              Math.floor(Math.random() * 20 + 60),
            ]),
            p50: parseFloat((parseFloat(estimatedMWc) * 1400).toFixed(0)),
            slopeAvg: parseFloat((Math.random() * 6 + 1).toFixed(1)),
            orientation: ['S', 'SE', 'SW'][i % 3],
            targetMWc: parseFloat(estimatedMWc),
            technology: ['fixe', 'tracker'][i % 2],
            annualProductionP50: parseFloat((parseFloat(estimatedMWc) * 1400).toFixed(0)),
            performanceRatio: parseFloat(Math.floor(Math.random() * 5 + 80).toFixed(0)),
          },
        },
        regulatory: {
          create: {
            pluZone: ['A', 'N', 'Nps'][i % 3],
            pluCompatible: Math.random() > 0.2,
            natura2000: ['>500m', '<500m', 'dans_périmètre'][i % 3],
            natura2000Distance: Math.floor(Math.random() * 15000 + 500),
            monumentsHistoriques: ['>500m', '<500m'][i % 2],
            floodZone: ['hors_zone', 'zone_inondable'][i % 2],
            landClassification: ['I', 'II', 'III', 'IV'][i % 4],
            cdpenafRisk: ['faible', 'moyen', 'fort'][i % 3],
            riskScore: Math.floor(Math.random() * 30 + 60),
            estimatedPermitMonths: Math.floor(Math.random() * 12 + 24),
          },
        },
        network: {
          create: {
            substationName: `${commune.name} ${['20kV', '63kV', '90kV'][i % 3]}`,
            operator: ['RTE', 'Enedis'][i % 2],
            voltage: ['20kV', '63kV', '90kV'][i % 3],
            distanceKm: parseFloat((Math.random() * 8 + 0.5).toFixed(1)),
            availableMW: parseFloat(Math.floor(Math.random() * 20 + 5).toFixed(0)),
            totalConnectionCost: parseFloat(Math.floor(Math.random() * 400000 + 200000).toFixed(0)),
            costPerMWc: parseFloat(Math.floor(Math.random() * 30000 + 40000).toFixed(0)),
            totalDelayMonths: Math.floor(Math.random() * 12 + 18),
          },
        },
      },
    });

    leads.push(lead);

    // Create checklists for this lead based on its current stage
    const stagesUpToCurrent = statuses.slice(0, statusIndex + 1);
    let checklistItemsCreated = 0;

    for (const stage of stagesUpToCurrent) {
      const checklist = pipelineChecklists[stage] || [];
      for (let j = 0; j < checklist.length; j++) {
        const item = checklist[j];
        // For previous stages, mark items as completed
        // For current stage, complete only some items randomly
        const isPreviousStage = stagesUpToCurrent.indexOf(stage) < stagesUpToCurrent.length - 1;
        const isCompleted = isPreviousStage || Math.random() > 0.4;

        await prisma.checklistItem.create({
          data: {
            leadId: lead.id,
            stage,
            label: item.label,
            description: item.description,
            order: j,
            completed: isCompleted,
            completedAt: isCompleted ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
            completedBy: isCompleted ? assignedUser.id : null,
            aiAssisted: item.aiAssisted,
            dataSource: item.dataSource,
          },
        });
        checklistItemsCreated++;
      }
    }

    // Create activity logs
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        userId: admin.id,
        action: 'lead_created',
        description: `Lead ${internalName} créé avec succès`,
        metadata: JSON.stringify({ source: 'seed' }),
      },
    });

    if (statusIndex > 0) {
      await prisma.activityLog.create({
        data: {
          leadId: lead.id,
          userId: assignedUser.id,
          action: 'status_changed',
          description: `Statut changé vers ${status}`,
          metadata: JSON.stringify({ oldStatus: 'SOURCING', newStatus: status }),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
        },
      });
    }

    // Add some comments for certain leads
    if (i % 3 === 0) {
      await prisma.comment.create({
        data: {
          leadId: lead.id,
          content: `Terrain très prometteur, bon ensoleillement et accès facile.`,
          section: 'sourcing',
          authorId: assignedUser.id,
        },
      });
    }

    if (i % 5 === 0) {
      await prisma.comment.create({
        data: {
          leadId: lead.id,
          content: `Attention : vérifier la proximité avec le monument historique avant de poursuivre.`,
          section: 'regulatory',
          authorId: admin.id,
          resolved: false,
        },
      });
    }
  }

  console.log(`✅ Created ${leads.length} leads with complete data\n`);

  // Marquer certains leads comme vendus avec prix
  console.log('💰 Adding revenue data...');
  const soldLeadsCount = Math.floor(leads.length * 0.4); // 40% des leads vendus
  const leadPricePerMWc = 15000; // 15k€ par MWc

  let totalRevenue = 0;
  const soldLeadsList = [];

  for (let i = 0; i < soldLeadsCount; i++) {
    const lead = leads[i];
    if (lead.estimatedMWc && lead.status === 'VALIDATED') {
      const salePrice = parseFloat((lead.estimatedMWc * leadPricePerMWc * (0.9 + Math.random() * 0.2)).toFixed(0));
      const soldAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Sold in last 60 days

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          salePrice,
          soldAt,
          soldTo: ['Engie Green', 'TotalEnergies', 'Voltalia', 'Neoen', 'Q Energy'][Math.floor(Math.random() * 5)]
        }
      });

      totalRevenue += salePrice;
      soldLeadsList.push({ ...lead, salePrice, soldAt });
    }
  }

  // Créer objectifs CA pour les 6 derniers mois
  console.log('🎯 Creating revenue goals...');
  const now = new Date();
  let totalRevenueGoal = 0;

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthGoal = 500000 + Math.random() * 200000; // Objectif entre 500k et 700k€
    const leadGoal = Math.floor(8 + Math.random() * 4); // 8-12 leads par mois

    // Calculer réalisé (80-120% de l'objectif pour les mois passés)
    const isCurrentMonth = i === 0;
    const monthRevenue = isCurrentMonth
      ? totalRevenue * 0.3 // Mois en cours = 30% du total
      : monthGoal * (0.8 + Math.random() * 0.4);
    const monthLeads = isCurrentMonth
      ? Math.floor(soldLeadsCount * 0.2)
      : Math.floor(leadGoal * (0.8 + Math.random() * 0.4));

    await prisma.revenueGoal.create({
      data: {
        year: targetDate.getFullYear(),
        month: targetDate.getMonth() + 1,
        leadGoal,
        revenueGoal: parseFloat(monthGoal.toFixed(0)),
        leadsAchieved: monthLeads,
        revenueAchieved: parseFloat(monthRevenue.toFixed(0))
      }
    });

    totalRevenueGoal += monthGoal;
  }

  console.log(`✅ Created ${soldLeadsCount} sold leads`);
  console.log(`✅ Created 6 months revenue goals\n`);

  // Summary
  console.log('📊 Database Summary:');
  console.log(`   - Users: 10 (1 admin, 9 ops)`);
  console.log(`   - Leads: ${leads.length}`);
  console.log(`   - Activity logs: ${leads.length * 2} (approx)`);
  console.log(`   - Comments: ${Math.floor(leads.length / 2)} (approx)`);

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📝 Login credentials:');
  console.log('   Admin:    hortense@lfs.fr / admin123 (Hortense Foillard)');
  console.log('   Ops:      guillaume@lfs.fr / ops123 (Guillaume Bougeard)');
  console.log('   Ops:      matheo@lfs.fr / ops123 (Mathéo Degras)');
  console.log('   Ops:      lucas@lfs.fr / ops123 (Lucas Lamquet)');
  console.log('   Ops:      romain@lfs.fr / ops123 (Romain Denes)');
  console.log('   Ops:      elise@lfs.fr / ops123 (Élise Carton)');
  console.log('   Ops:      diane@lfs.fr / ops123 (Diane Gédon)');
  console.log('   Ops:      jalil@lfs.fr / ops123 (Jalil Hajjaj)');
  console.log('   Ops:      julien@lfs.fr / ops123 (Julien Bernard)');
  console.log('   Ops:      claire@lfs.fr / ops123 (Claire Rousseau)');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
