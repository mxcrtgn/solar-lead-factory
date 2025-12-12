// Mock data for demo mode

export const mockDashboardStats = {
  totalLeads: 127,
  activeLeads: 89,
  conversionRate: 24.5,
  totalRevenue: 45800000,
  averageDealSize: 4200000,
  revenueGrowth: 18.5,
  pipelineValue: 156000000,
  leadsByStatus: {
    SOURCING: 23,
    REGULATORY_ANALYSIS: 18,
    TECHNICAL_STUDY: 15,
    NETWORK_STUDY: 12,
    FONCIER: 9,
    ECONOMIC_MODEL: 6,
    QA_REVIEW: 4,
    VALIDATED: 28,
    REJECTED: 12,
  },
  recentActivity: [
    {
      id: '1',
      type: 'lead_created',
      leadName: 'Projet Salon-de-Provence 25MWc',
      userName: 'Guillaume Bougeard',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'status_changed',
      leadName: 'Projet Aix-en-Provence 18MWc',
      userName: 'Mathéo Degras',
      from: 'TECHNICAL_STUDY',
      to: 'NETWORK_STUDY',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'lead_validated',
      leadName: 'Projet Montpellier 12MWc',
      userName: 'Hortense Foillard',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  topPerformers: [
    { userId: '1', name: 'Guillaume Bougeard', leadsCreated: 24, revenue: 12500000 },
    { userId: '2', name: 'Mathéo Degras', leadsCreated: 21, revenue: 10800000 },
    { userId: '3', name: 'Lucas Lamquet', leadsCreated: 18, revenue: 9200000 },
  ],
  revenueGoals: [
    { month: 'Jan', revenueGoal: 30000000, revenueAchieved: 28500000 },
    { month: 'Fév', revenueGoal: 30000000, revenueAchieved: 31200000 },
    { month: 'Mar', revenueGoal: 35000000, revenueAchieved: 33800000 },
    { month: 'Avr', revenueGoal: 35000000, revenueAchieved: 36500000 },
    { month: 'Mai', revenueGoal: 40000000, revenueAchieved: 42100000 },
    { month: 'Juin', revenueGoal: 40000000, revenueAchieved: 39800000 },
  ],
};

export const mockLeads = [
  {
    id: '1',
    name: 'Projet Salon-de-Provence 25MWc',
    location: 'Salon-de-Provence (13)',
    coordinates: '43.6234,5.0981',
    surfaceArea: 25.5,
    capacityMWc: 25,
    status: 'TECHNICAL_STUDY',
    assignedToId: '1',
    assignedTo: { firstName: 'Guillaume', lastName: 'Bougeard' },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 5200000,
    qualityScore: 85,
  },
  {
    id: '2',
    name: 'Projet Aix-en-Provence 18MWc',
    location: 'Aix-en-Provence (13)',
    coordinates: '43.5297,5.4474',
    surfaceArea: 18.2,
    capacityMWc: 18,
    status: 'NETWORK_STUDY',
    assignedToId: '2',
    assignedTo: { firstName: 'Mathéo', lastName: 'Degras' },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 3800000,
    qualityScore: 78,
  },
  {
    id: '3',
    name: 'Projet Montpellier 12MWc',
    location: 'Montpellier (34)',
    coordinates: '43.6108,3.8767',
    surfaceArea: 12.8,
    capacityMWc: 12,
    status: 'VALIDATED',
    assignedToId: '3',
    assignedTo: { firstName: 'Lucas', lastName: 'Lamquet' },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRevenue: 2600000,
    qualityScore: 92,
  },
];

export const mockUsers = [
  { id: '1', firstName: 'Hortense', lastName: 'Foillard', email: 'hortense@lfs.fr', role: 'ADMIN' },
  { id: '2', firstName: 'Guillaume', lastName: 'Bougeard', email: 'guillaume@lfs.fr', role: 'OPS' },
  { id: '3', firstName: 'Mathéo', lastName: 'Degras', email: 'matheo@lfs.fr', role: 'OPS' },
  { id: '4', firstName: 'Lucas', lastName: 'Lamquet', email: 'lucas@lfs.fr', role: 'OPS' },
];

export const mockLeadDetails = (id: string) => {
  const lead = mockLeads.find(l => l.id === id) || mockLeads[0];
  return {
    ...lead,
    source: 'prospection',
    landUse: 'agricole',
    shading: 'faible',
    checklist: {
      SOURCING: [
        { id: 's1', label: 'Identification du terrain via satellite', completed: true, aiAssisted: true },
        { id: 's2', label: 'Vérification surface disponible', completed: true, aiAssisted: true },
        { id: 's3', label: 'Analyse topographique préliminaire', completed: true, aiAssisted: false },
      ],
      REGULATORY_ANALYSIS: [
        { id: 'r1', label: 'Extraction PLU automatique', completed: true, aiAssisted: true },
        { id: 'r2', label: 'Analyse compatibilité PLU', completed: true, aiAssisted: true },
        { id: 'r3', label: 'Vérification Natura 2000', completed: false, aiAssisted: true },
      ],
      TECHNICAL_STUDY: [
        { id: 't1', label: 'Données irradiation PVGIS', completed: false, aiAssisted: true },
        { id: 't2', label: 'Distribution mensuelle production', completed: false, aiAssisted: true },
      ],
    },
  };
};
