// import React from 'react';
import {
  CheckCircle2, XCircle, Clock, Activity, Database, Cloud,
  Map, Zap, Network, FileText, Cpu, Satellite, Globe
} from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'api_ign_cadastre',
    name: 'API IGN Cadastre',
    category: 'Cartographie & Cadastre',
    description: 'Récupération données cadastrales, références parcellaires, surfaces précises',
    icon: Map,
    status: 'active',
    color: 'from-blue-400 to-blue-500',
    usage: '1,247 appels / mois',
    lastSync: '2024-12-01T07:30:00',
    endpoint: 'https://apicarto.ign.fr/api/cadastre',
    usedIn: ['SOURCING', 'FONCIER']
  },
  {
    id: 'api_gpu',
    name: 'API Géoportail Urbanisme',
    description: 'Extraction automatique des PLU, zones constructibles, servitudes',
    icon: FileText,
    category: 'Urbanisme & Réglementation',
    status: 'active',
    color: 'from-green-400 to-green-500',
    usage: '892 appels / mois',
    lastSync: '2024-12-01T06:15:00',
    endpoint: 'https://www.geoportail-urbanisme.gouv.fr/api',
    usedIn: ['REGULATORY_ANALYSIS']
  },
  {
    id: 'api_georisques',
    name: 'API Géorisques',
    description: 'Analyse risques naturels, PPR, zones inondables, sismicité',
    icon: Activity,
    category: 'Risques & Environnement',
    status: 'active',
    color: 'from-orange-400 to-orange-500',
    usage: '567 appels / mois',
    lastSync: '2024-12-01T05:45:00',
    endpoint: 'https://www.georisques.gouv.fr/api',
    usedIn: ['REGULATORY_ANALYSIS']
  },
  {
    id: 'api_inpn',
    name: 'API INPN (Natura 2000)',
    description: 'Vérification zones protégées, ZNIEFF, Natura 2000, espèces protégées',
    icon: Globe,
    category: 'Environnement & Biodiversité',
    status: 'active',
    color: 'from-emerald-400 to-emerald-500',
    usage: '423 appels / mois',
    lastSync: '2024-12-01T04:20:00',
    endpoint: 'https://inpn.mnhn.fr/api',
    usedIn: ['REGULATORY_ANALYSIS']
  },
  {
    id: 'api_pvgis',
    name: 'API PVGIS (EU JRC)',
    description: 'Calcul irradiation solaire (GHI), production photovoltaïque estimée',
    icon: Zap,
    category: 'Données Solaires',
    status: 'active',
    color: 'from-yellow-400 to-yellow-500',
    usage: '1,045 appels / mois',
    lastSync: '2024-12-01T07:00:00',
    endpoint: 'https://re.jrc.ec.europa.eu/api/pvgis',
    usedIn: ['TECHNICAL_STUDY']
  },
  {
    id: 'api_enedis',
    name: 'API Enedis (Open Data)',
    description: 'Données réseau électrique, postes sources, capacités d\'injection',
    icon: Network,
    category: 'Réseau Électrique',
    status: 'active',
    color: 'from-indigo-400 to-indigo-500',
    usage: '678 appels / mois',
    lastSync: '2024-12-01T06:30:00',
    endpoint: 'https://data.enedis.fr/api',
    usedIn: ['NETWORK_STUDY']
  },
  {
    id: 'api_rte',
    name: 'API RTE (éCO2mix)',
    description: 'Données production électrique, capacités réseau HTB',
    icon: Activity,
    category: 'Réseau Électrique',
    status: 'active',
    color: 'from-purple-400 to-purple-500',
    usage: '234 appels / mois',
    lastSync: '2024-12-01T03:00:00',
    endpoint: 'https://digital.iservices.rte-france.com/api',
    usedIn: ['NETWORK_STUDY']
  },
  {
    id: 'ai_satellite_analysis',
    name: 'IA - Analyse Satellite',
    description: 'Détection automatique terrains via imagerie satellite, calcul surfaces',
    icon: Satellite,
    category: 'Intelligence Artificielle',
    status: 'active',
    color: 'from-[#594FF4] to-[#4840C9]',
    usage: '2,134 analyses / mois',
    lastSync: '2024-12-01T07:45:00',
    endpoint: 'Internal AI Model',
    usedIn: ['SOURCING']
  },
  {
    id: 'ai_document_analysis',
    name: 'IA - Analyse Documents',
    description: 'Extraction automatique données PLU, études techniques, rapports',
    icon: FileText,
    category: 'Intelligence Artificielle',
    status: 'active',
    color: 'from-[#594FF4] to-[#4840C9]',
    usage: '1,567 documents / mois',
    lastSync: '2024-12-01T07:20:00',
    endpoint: 'Internal AI Model',
    usedIn: ['REGULATORY_ANALYSIS', 'TECHNICAL_STUDY']
  },
  {
    id: 'ai_economic_model',
    name: 'IA - Modèle Économique',
    description: 'Calcul automatique TRI, VAN, LCOE, optimisation financière',
    icon: Cpu,
    category: 'Intelligence Artificielle',
    status: 'active',
    color: 'from-[#594FF4] to-[#4840C9]',
    usage: '892 calculs / mois',
    lastSync: '2024-12-01T06:50:00',
    endpoint: 'Internal AI Model',
    usedIn: ['ECONOMIC_MODEL']
  },
  {
    id: 'api_insee',
    name: 'API INSEE',
    description: 'Données démographiques, économiques des communes',
    icon: Database,
    category: 'Données Publiques',
    status: 'active',
    color: 'from-gray-400 to-gray-500',
    usage: '345 appels / mois',
    lastSync: '2024-12-01T02:00:00',
    endpoint: 'https://api.insee.fr',
    usedIn: ['SOURCING']
  },
  {
    id: 'api_meteo_france',
    name: 'API Météo France',
    description: 'Données météorologiques, vitesse vent, température, pluviométrie',
    icon: Cloud,
    category: 'Météo & Climat',
    status: 'maintenance',
    color: 'from-cyan-400 to-cyan-500',
    usage: '156 appels / mois',
    lastSync: '2024-11-28T14:00:00',
    endpoint: 'https://portail-api.meteofrance.fr',
    usedIn: ['TECHNICAL_STUDY']
  }
];

const PIPELINE_STAGES_MAP: Record<string, string> = {
  SOURCING: 'Sourcing',
  REGULATORY_ANALYSIS: 'Analyse Réglementaire',
  TECHNICAL_STUDY: 'Étude Technique',
  NETWORK_STUDY: 'Étude Réseau',
  FONCIER: 'Foncier',
  ECONOMIC_MODEL: 'Modèle Économique',
  QA_REVIEW: 'Revue QA'
};

export default function IntegrationsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-700">Actif</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">Maintenance</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-lg">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-bold text-red-700">Erreur</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const categories = [...new Set(INTEGRATIONS.map(i => i.category))];
  const activeCount = INTEGRATIONS.filter(i => i.status === 'active').length;
  const totalUsage = INTEGRATIONS.reduce((sum, i) => {
    const match = i.usage.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(',', '')) : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#211F1B] mb-2">
          Intégrations & APIs
        </h1>
        <p className="text-gray-600 font-medium">
          Sources de données et services connectés à la plateforme
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#594FF4] to-[#4840C9] rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Total Intégrations</h3>
          </div>
          <p className="text-4xl font-bold text-white">{INTEGRATIONS.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Services Actifs</h3>
          </div>
          <p className="text-4xl font-bold text-white">{activeCount}</p>
        </div>

        <div className="bg-gradient-to-br from-[#FFDE00] to-[#FFA500] rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Usage Mensuel</h3>
          </div>
          <p className="text-4xl font-bold text-white">{totalUsage.toLocaleString()}</p>
        </div>
      </div>

      {/* Integrations by Category */}
      {categories.map(category => {
        const categoryIntegrations = INTEGRATIONS.filter(i => i.category === category);

        return (
          <div key={category} className="mb-6">
            <h2 className="text-2xl font-bold text-[#211F1B] mb-4 flex items-center gap-2">
              {category}
              <span className="text-sm font-normal text-gray-500">({categoryIntegrations.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryIntegrations.map(integration => {
                const IconComponent = integration.icon;

                return (
                  <div
                    key={integration.id}
                    className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${integration.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#211F1B] mb-1">
                            {integration.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">{integration.usage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          Dernière sync: {getTimeAgo(integration.lastSync)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 font-mono text-xs truncate">
                          {integration.endpoint}
                        </span>
                      </div>
                    </div>

                    {/* Used In Stages */}
                    <div className="pt-4 border-t-2 border-gray-100">
                      <p className="text-xs text-gray-500 font-bold mb-2">UTILISÉ DANS:</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.usedIn.map(stage => (
                          <span
                            key={stage}
                            className="bg-[#594FF4]/10 text-[#594FF4] text-xs font-bold px-2 py-1 rounded-lg"
                          >
                            {PIPELINE_STAGES_MAP[stage]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
