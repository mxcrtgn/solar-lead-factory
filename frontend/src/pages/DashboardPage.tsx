import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiMethods as api } from '../lib/api';
import { BarChart3, TrendingUp, Clock, CheckCircle, Zap, Target, Cpu, MapPin, Award, Sun, DollarSign, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.analytics.getDashboard();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#594FF4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const mainCards = [
    {
      title: 'Leads Totaux',
      value: stats?.totalLeads || 0,
      icon: BarChart3,
      bgColor: 'bg-[#594FF4]/10',
      iconColor: 'text-[#594FF4]',
      subtitle: `${stats?.leadsThisMonth || 0} ce mois`,
    },
    {
      title: 'Score Qualité Moyen',
      value: stats?.avgScore ? `${Math.round(stats.avgScore)}/100` : 'N/A',
      icon: Target,
      bgColor: 'bg-[#FFDE00]/10',
      iconColor: 'text-[#FFDE00]',
      subtitle: 'Multi-critères',
    },
    {
      title: 'Leads Validés',
      value: stats?.leadsValidated || 0,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      subtitle: 'Prêts pour développement',
    },
    {
      title: 'Pipeline MWc Total',
      value: stats?.totalMWc ? `${Math.round(stats.totalMWc)} MWc` : 'N/A',
      icon: Sun,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      subtitle: 'Puissance totale',
    },
  ];

  const aiCards = [
    {
      title: 'Efficacité IA',
      value: `${stats?.aiEfficiency || 0}%`,
      subtitle: `${stats?.aiAssistedCompleted || 0} tâches IA vs ${stats?.manualCompleted || 0} manuelles`,
      icon: Cpu,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'TRI Moyen',
      value: stats?.avgTRI ? `${stats.avgTRI.toFixed(1)}%` : 'N/A',
      subtitle: 'Rentabilité projets',
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Complétion Moyenne',
      value: `${Math.round(stats?.avgCompleteness || 0)}%`,
      subtitle: `${stats?.totalChecklistItems || 0} items checklist`,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  const leadsByStatus = Array.isArray(stats?.leadsByStatus) ? stats.leadsByStatus : [];
  const leadsByRegion = Array.isArray(stats?.leadsByRegion) ? stats.leadsByRegion : [];
  const recentActivity = Array.isArray(stats?.recentActivity) ? stats.recentActivity : [];
  const topPerformers = Array.isArray(stats?.topPerformers) ? stats.topPerformers : [];
  const revenueGoals = Array.isArray(stats?.revenueGoals) ? stats.revenueGoals : [];

  // Calculate CA embarqué vs objectif
  const currentMonthGoal = stats?.currentMonthGoal;
  const totalGoalRevenue = revenueGoals.reduce((sum: number, g: any) => sum + (g.revenueGoal || 0), 0);
  const totalAchievedRevenue = revenueGoals.reduce((sum: number, g: any) => sum + (g.revenueAchieved || 0), 0);
  const achievementRate = totalGoalRevenue > 0 ? ((totalAchievedRevenue / totalGoalRevenue) * 100) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#211F1B]">
          Dashboard Lead Factory
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Vue d'ensemble de votre activité de production de leads solaires</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {mainCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1 font-bold">{card.title}</p>
            <p className="text-4xl font-bold text-[#211F1B] mb-2">{card.value}</p>
            <p className="text-xs text-gray-500 font-medium">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* AI & Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {aiCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <h3 className="text-sm font-bold text-[#211F1B]">{card.title}</h3>
            </div>
            <p className="text-3xl font-bold text-[#211F1B] mb-1">{card.value}</p>
            <p className="text-xs text-gray-600 font-medium">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* CA Embarqué Section */}
      <div className="bg-gradient-to-br from-[#594FF4] to-[#4840C9] rounded-2xl shadow-xl p-6 mb-6 border-2 border-[#594FF4]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">CA Embarqué</h2>
              <p className="text-white/80 text-sm font-medium">Performance commerciale sur 6 mois</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{achievementRate.toFixed(0)}%</p>
            <p className="text-white/80 text-sm font-medium">Taux de réalisation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/80 text-xs font-bold mb-1">CA Objectif (6 mois)</p>
            <p className="text-2xl font-bold text-white">
              {(totalGoalRevenue / 1000000).toFixed(2)}M€
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/80 text-xs font-bold mb-1">CA Réalisé (6 mois)</p>
            <p className="text-2xl font-bold text-white">
              {(totalAchievedRevenue / 1000000).toFixed(2)}M€
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/80 text-xs font-bold mb-1">Leads Vendus</p>
            <p className="text-2xl font-bold text-white">
              {stats?.soldLeadsCount || 0}
            </p>
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="space-y-2">
          {revenueGoals.slice().reverse().map((goal: any, index: number) => {
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const monthName = monthNames[goal.month - 1];
            const achievedPct = goal.revenueGoal > 0 ? (goal.revenueAchieved / goal.revenueGoal) * 100 : 0;
            const isOverTarget = achievedPct >= 100;

            return (
              <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-sm min-w-[40px]">{monthName} {goal.year}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 text-xs">
                        {(goal.revenueAchieved / 1000).toFixed(0)}k€
                      </span>
                      <span className="text-white/60 text-xs">
                        / {(goal.revenueGoal / 1000).toFixed(0)}k€
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isOverTarget ? 'text-[#FFDE00]' : 'text-white/80'}`}>
                      {achievedPct.toFixed(0)}%
                    </span>
                    {isOverTarget ? (
                      <TrendingUp className="w-4 h-4 text-[#FFDE00]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${isOverTarget ? 'bg-[#FFDE00]' : 'bg-white/60'}`}
                    style={{ width: `${Math.min(achievedPct, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leads par Statut */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#594FF4]/10 rounded-lg">
              <Zap className="w-5 h-5 text-[#594FF4]" />
            </div>
            <h2 className="text-xl font-bold text-[#211F1B]">Pipeline par Statut</h2>
          </div>

          <div className="space-y-3">
            {leadsByStatus.length > 0 ? (
              leadsByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#FFDE00] rounded-full"></div>
                    <span className="text-sm font-bold text-[#211F1B]">{item.status}</span>
                  </div>
                  <span className="text-lg font-bold text-[#594FF4] bg-white px-4 py-2 rounded-lg border-2 border-[#594FF4]/20">
                    {item._count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Leads par Région */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FFDE00]/10 rounded-lg">
              <MapPin className="w-5 h-5 text-[#FFDE00]" />
            </div>
            <h2 className="text-xl font-bold text-[#211F1B]">Leads par Région</h2>
          </div>

          <div className="space-y-3">
            {leadsByRegion.length > 0 ? (
              leadsByRegion.slice(0, 5).map((item: any) => (
                <div key={item.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 bg-[#594FF4] rounded-full"></div>
                      <span className="text-sm font-bold text-[#211F1B]">{item.region}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium ml-5">
                      {item._sum?.estimatedMWc ? `${Math.round(item._sum.estimatedMWc)} MWc` : 'N/A'}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#594FF4] bg-white px-4 py-2 rounded-lg border-2 border-[#594FF4]/20">
                    {item._count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité Récente */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#211F1B]">Activité Récente</h2>
          </div>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 6).map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex-shrink-0 w-3 h-3 bg-[#594FF4] rounded-full mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#211F1B] font-bold">{activity.description}</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {activity.lead?.internalName} • {activity.user?.firstName} {activity.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-gray-500 font-medium">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-[#211F1B]">Top Contributeurs</h2>
          </div>

          <div className="space-y-3">
            {topPerformers.length > 0 ? (
              topPerformers.map((performer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-[#FFDE00] text-[#211F1B]' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#211F1B]">{performer.user}</p>
                      <p className="text-xs text-gray-600">{performer.email}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#594FF4] bg-white px-4 py-2 rounded-lg border-2 border-[#594FF4]/20">
                    {performer.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
