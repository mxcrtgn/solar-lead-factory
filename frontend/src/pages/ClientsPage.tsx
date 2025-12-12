import React, { useState } from 'react';
import { Building2, TrendingUp, CheckCircle2, Clock, XCircle, Eye, Mail, Phone, MapPin, Zap } from 'lucide-react';

const CLIENTS = [
  {
    id: 'edf-en',
    name: 'EDF Énergies Nouvelles',
    logo: '🔵', // Would be actual logo
    type: 'Développeur majeur',
    color: 'from-blue-500 to-blue-600',
    totalLeadsProposed: 12,
    leadsInterested: 8,
    leadsEngaged: 3,
    leadsAcquired: 2,
    leadsRejected: 4,
    totalMWcSold: 24.5,
    totalRevenue: 367500,
    avgResponseTime: '2.3 jours',
    preferences: ['> 10 MWc', 'Sud France', 'Trackers'],
    contact: {
      name: 'Jean Dupont',
      email: 'jean.dupont@edf-en.com',
      phone: '+33 1 23 45 67 89'
    },
    recentActivity: [
      { date: '2024-11-28', action: 'Acquisition confirmée', lead: 'SAL-PAC-003', mwc: 12.3 },
      { date: '2024-11-20', action: 'En négociation', lead: 'AIX-PAC-007', mwc: 8.2 },
      { date: '2024-11-15', action: 'Lead proposé', lead: 'MON-OCC-012', mwc: 15.7 }
    ]
  },
  {
    id: 'iberdrola',
    name: 'Iberdrola',
    logo: '🟢',
    type: 'Développeur international',
    color: 'from-green-500 to-green-600',
    totalLeadsProposed: 9,
    leadsInterested: 6,
    leadsEngaged: 4,
    leadsAcquired: 3,
    leadsRejected: 2,
    totalMWcSold: 38.2,
    totalRevenue: 573000,
    avgResponseTime: '1.8 jours',
    preferences: ['> 15 MWc', 'Nouvelle-Aquitaine', 'Agrivoltaïsme'],
    contact: {
      name: 'Maria Garcia',
      email: 'maria.garcia@iberdrola.es',
      phone: '+34 91 234 56 78'
    },
    recentActivity: [
      { date: '2024-11-26', action: 'Acquisition confirmée', lead: 'BOR-NAQ-005', mwc: 18.5 },
      { date: '2024-11-24', action: 'En négociation', lead: 'POI-NAQ-008', mwc: 11.2 },
      { date: '2024-11-18', action: 'Lead proposé', lead: 'LIM-NAQ-014', mwc: 8.5 }
    ]
  },
  {
    id: 'engie',
    name: 'ENGIE Green',
    logo: '🔵',
    type: 'Développeur majeur',
    color: 'from-sky-500 to-sky-600',
    totalLeadsProposed: 10,
    leadsInterested: 7,
    leadsEngaged: 2,
    leadsAcquired: 1,
    leadsRejected: 3,
    totalMWcSold: 16.8,
    totalRevenue: 252000,
    avgResponseTime: '3.1 jours',
    preferences: ['10-20 MWc', 'Auvergne-Rhône-Alpes', 'Structures fixes'],
    contact: {
      name: 'Pierre Martin',
      email: 'pierre.martin@engie.com',
      phone: '+33 1 44 22 00 00'
    },
    recentActivity: [
      { date: '2024-11-29', action: 'En négociation', lead: 'LYO-ARA-009', mwc: 16.8 },
      { date: '2024-11-22', action: 'Lead proposé', lead: 'GRE-ARA-011', mwc: 14.3 },
      { date: '2024-11-16', action: 'Rejeté', lead: 'VAL-ARA-002', mwc: 7.2 }
    ]
  },
  {
    id: 'total-eren',
    name: 'TotalEnergies Renouvelables',
    logo: '🔴',
    type: 'Développeur majeur',
    color: 'from-red-500 to-red-600',
    totalLeadsProposed: 8,
    leadsInterested: 5,
    leadsEngaged: 3,
    leadsAcquired: 2,
    leadsRejected: 1,
    totalMWcSold: 29.4,
    totalRevenue: 441000,
    avgResponseTime: '2.7 jours',
    preferences: ['> 12 MWc', 'Occitanie', 'Bifacial'],
    contact: {
      name: 'Sophie Dubois',
      email: 'sophie.dubois@totalenergies.com',
      phone: '+33 1 47 44 45 46'
    },
    recentActivity: [
      { date: '2024-11-27', action: 'Acquisition confirmée', lead: 'TOU-OCC-006', mwc: 17.2 },
      { date: '2024-11-21', action: 'Intéressé', lead: 'MON-OCC-015', mwc: 12.2 },
      { date: '2024-11-17', action: 'Lead proposé', lead: 'PER-OCC-010', mwc: 9.8 }
    ]
  },
  {
    id: 'rwe',
    name: 'RWE Renewables',
    logo: '🟡',
    type: 'Développeur international',
    color: 'from-yellow-500 to-yellow-600',
    totalLeadsProposed: 6,
    leadsInterested: 4,
    leadsEngaged: 2,
    leadsAcquired: 1,
    leadsRejected: 2,
    totalMWcSold: 18.9,
    totalRevenue: 283500,
    avgResponseTime: '3.5 jours',
    preferences: ['> 15 MWc', 'Nord/Est France', 'Optimiseurs'],
    contact: {
      name: 'Klaus Schmidt',
      email: 'klaus.schmidt@rwe.com',
      phone: '+49 201 12 34 567'
    },
    recentActivity: [
      { date: '2024-11-25', action: 'En négociation', lead: 'ORL-CVL-004', mwc: 18.9 },
      { date: '2024-11-19', action: 'Intéressé', lead: 'TOU-CVL-013', mwc: 13.5 },
      { date: '2024-11-14', action: 'Rejeté', lead: 'CLE-ARA-001', mwc: 6.8 }
    ]
  },
  {
    id: 'voltalia',
    name: 'Voltalia',
    logo: '🟣',
    type: 'Développeur français',
    color: 'from-purple-500 to-purple-600',
    totalLeadsProposed: 7,
    leadsInterested: 5,
    leadsEngaged: 1,
    leadsAcquired: 1,
    leadsRejected: 2,
    totalMWcSold: 11.2,
    totalRevenue: 168000,
    avgResponseTime: '2.1 jours',
    preferences: ['5-15 MWc', 'Toutes régions', 'Agrivoltaïsme'],
    contact: {
      name: 'Hélène Leroy',
      email: 'helene.leroy@voltalia.com',
      phone: '+33 1 81 70 37 00'
    },
    recentActivity: [
      { date: '2024-11-30', action: 'Intéressé', lead: 'BEZ-OCC-016', mwc: 11.2 },
      { date: '2024-11-23', action: 'Lead proposé', lead: 'NIM-OCC-017', mwc: 9.4 },
      { date: '2024-11-20', action: 'Rejeté', lead: 'ARL-PAC-018', mwc: 5.3 }
    ]
  }
];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'engaged'>('all');

  const getStatusBadge = (status: string) => {
    const config = {
      'Acquisition confirmée': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      'En négociation': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      'Intéressé': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye },
      'Lead proposé': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Mail },
      'Rejeté': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Eye };

    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-1.5 ${config.bg} px-2 py-1 rounded-lg`}>
        <Icon className={`w-3 h-3 ${config.text}`} />
        <span className={`text-xs font-bold ${config.text}`}>{status}</span>
      </div>
    );
  };

  const totalRevenue = CLIENTS.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalMWc = CLIENTS.reduce((sum, c) => sum + c.totalMWcSold, 0);
  const totalAcquired = CLIENTS.reduce((sum, c) => sum + c.leadsAcquired, 0);
  const totalEngaged = CLIENTS.reduce((sum, c) => sum + c.leadsEngaged, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#211F1B] mb-2">
          Portfolio Clients
        </h1>
        <p className="text-gray-600 font-medium">
          Développeurs solaires et prospects actifs
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#FFDE00] to-[#FFA500] rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Clients Actifs</h3>
          </div>
          <p className="text-4xl font-bold text-white">{CLIENTS.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">Leads Acquis</h3>
          </div>
          <p className="text-4xl font-bold text-white">{totalAcquired}</p>
        </div>

        <div className="bg-gradient-to-br from-[#594FF4] to-[#4840C9] rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">MWc Vendus</h3>
          </div>
          <p className="text-4xl font-bold text-white">{totalMWc.toFixed(1)}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm">CA Total</h3>
          </div>
          <p className="text-4xl font-bold text-white">{(totalRevenue / 1000).toFixed(0)}k€</p>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CLIENTS.map(client => (
          <div
            key={client.id}
            className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-all"
          >
            {/* Client Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`text-4xl`}>{client.logo}</div>
                <div>
                  <h3 className="text-xl font-bold text-[#211F1B]">{client.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{client.type}</p>
                </div>
              </div>
              <div className={`bg-gradient-to-r ${client.color} px-3 py-1.5 rounded-lg`}>
                <span className="text-white text-xs font-bold">
                  {client.leadsAcquired} ACQUIS
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-1">Proposés</p>
                <p className="text-lg font-bold text-[#211F1B]">{client.totalLeadsProposed}</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">Intéressés</p>
                <p className="text-lg font-bold text-blue-700">{client.leadsInterested}</p>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-600 font-medium mb-1">Négoc.</p>
                <p className="text-lg font-bold text-yellow-700">{client.leadsEngaged}</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium mb-1">Acquis</p>
                <p className="text-lg font-bold text-green-700">{client.leadsAcquired}</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 font-medium mb-1">Rejetés</p>
                <p className="text-lg font-bold text-red-700">{client.leadsRejected}</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#FFDE00]/10 p-3 rounded-xl">
                <p className="text-xs text-gray-600 font-medium mb-1">MWc vendus</p>
                <p className="text-xl font-bold text-[#211F1B]">{client.totalMWcSold.toFixed(1)} MWc</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-gray-600 font-medium mb-1">CA généré</p>
                <p className="text-xl font-bold text-green-700">{(client.totalRevenue / 1000).toFixed(0)}k€</p>
              </div>
            </div>

            {/* Contact */}
            <div className="border-t-2 border-gray-100 pt-3 mb-3">
              <p className="text-xs text-gray-500 font-bold mb-2">CONTACT PRINCIPAL</p>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <p className="text-sm text-gray-700 font-medium">{client.contact.name}</p>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-600">{client.contact.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-600">{client.contact.phone}</p>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t-2 border-gray-100 pt-3 mb-3">
              <p className="text-xs text-gray-500 font-bold mb-2">PRÉFÉRENCES</p>
              <div className="flex flex-wrap gap-2">
                {client.preferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="bg-[#594FF4]/10 text-[#594FF4] text-xs font-bold px-2 py-1 rounded-lg"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t-2 border-gray-100 pt-3">
              <p className="text-xs text-gray-500 font-bold mb-2">ACTIVITÉ RÉCENTE</p>
              <div className="space-y-2">
                {client.recentActivity.slice(0, 2).map((activity, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(activity.action)}
                      </div>
                      <p className="text-gray-700 font-bold">{activity.lead} • {activity.mwc} MWc</p>
                      <p className="text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-3 pt-3 border-t-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Temps de réponse moyen</span>
                <span className="text-sm font-bold text-[#594FF4]">{client.avgResponseTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
