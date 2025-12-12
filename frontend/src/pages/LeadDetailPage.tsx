import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods as api } from '../lib/api';
import {
  ArrowLeft, CheckCircle2, Circle, Cpu, MapPin, BarChart3,
  Network, Building2, DollarSign,
  Shield, Zap, Target, User
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'SOURCING', label: 'Sourcing', icon: MapPin, color: 'from-gray-400 to-gray-500' },
  { id: 'REGULATORY_ANALYSIS', label: 'Analyse Réglementaire', icon: Shield, color: 'from-blue-400 to-blue-500' },
  { id: 'TECHNICAL_STUDY', label: 'Étude Technique', icon: Zap, color: 'from-[#FFDE00] to-[#FFA500]' },
  { id: 'NETWORK_STUDY', label: 'Étude Réseau', icon: Network, color: 'from-orange-400 to-orange-500' },
  { id: 'FONCIER', label: 'Foncier', icon: Building2, color: 'from-[#594FF4] to-[#4840C9]' },
  { id: 'ECONOMIC_MODEL', label: 'Modèle Économique', icon: DollarSign, color: 'from-green-400 to-green-500' },
  { id: 'QA_REVIEW', label: 'Revue QA', icon: Target, color: 'from-pink-400 to-pink-500' },
];

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await api.leads.getById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: checklist, isLoading: checklistLoading } = useQuery({
    queryKey: ['checklist', id],
    queryFn: async () => {
      const response = await api.leads.getChecklist(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      return api.leads.updateChecklistItem(id!, itemId, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', id] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
    },
  });

  if (leadLoading || checklistLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#594FF4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement du lead...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">Lead non trouvé</p>
        <button
          onClick={() => navigate('/pipeline')}
          className="text-[#594FF4] hover:underline"
        >
          Retour au pipeline
        </button>
      </div>
    );
  }

  const getCurrentStageIndex = () => {
    return PIPELINE_STAGES.findIndex(s => s.id === lead.status);
  };

  const handleChecklistToggle = (itemId: string, currentlyCompleted: boolean) => {
    toggleChecklistMutation.mutate({ itemId, completed: !currentlyCompleted });
  };

  const getStageStats = (stageId: string) => {
    const items = checklist?.[stageId] || [];
    const completed = items.filter((item: any) => item.completed).length;
    const total = items.length;
    const aiAssisted = items.filter((item: any) => item.aiAssisted).length;
    return { completed, total, aiAssisted, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/pipeline')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#594FF4] mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au pipeline
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#211F1B] mb-2">
                {lead.internalName}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{lead.commune}, {lead.department}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">{lead.surfaceHa} ha</span>
                </div>
                {lead.estimatedMWc && (
                  <div className="flex items-center gap-1 text-[#594FF4] font-bold">
                    <Zap className="w-4 h-4" />
                    <span>{lead.estimatedMWc.toFixed(1)} MWc</span>
                  </div>
                )}
                {lead.qualityScore && (
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-[#FFDE00]" />
                    <span className="font-bold text-[#211F1B]">Score: {lead.qualityScore}/100</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {lead.assignedTo && (
                <div className="flex items-center gap-2 bg-[#594FF4]/10 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-[#594FF4]" />
                  <span className="font-bold text-[#594FF4] text-sm">
                    {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-xs text-gray-600 font-medium">Complétion globale</div>
                <div className="text-2xl font-bold text-[#594FF4]">{lead.completeness}%</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#594FF4] to-[#4840C9] h-3 rounded-full transition-all"
                style={{ width: `${lead.completeness}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages with Checklists */}
      <div className="space-y-4">
        {PIPELINE_STAGES.map((stage, index) => {
          const stats = getStageStats(stage.id);
          const isCurrentStage = index === currentStageIndex;
          const isPastStage = index < currentStageIndex;
          // const isFutureStage = index > currentStageIndex;
          const isExpanded = activeStage === stage.id;
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`bg-white rounded-2xl shadow-md border-2 transition-all ${
                isCurrentStage ? 'border-[#594FF4] shadow-lg' : 'border-gray-100'
              }`}
            >
              {/* Stage Header */}
              <button
                onClick={() => setActiveStage(isExpanded ? null : stage.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stage.color}`}>
                    <StageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-[#211F1B] flex items-center gap-2">
                      {stage.label}
                      {isCurrentStage && (
                        <span className="bg-[#FFDE00] text-[#211F1B] text-xs font-bold px-2 py-1 rounded">
                          EN COURS
                        </span>
                      )}
                      {isPastStage && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium">
                      {stats.completed}/{stats.total} items complétés • {stats.aiAssisted} assistés par IA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#594FF4]">{Math.round(stats.percentage)}%</div>
                    <div className="text-xs text-gray-600">Complétion</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${stage.color} h-2 rounded-full transition-all`}
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </button>

              {/* Checklist Items */}
              {isExpanded && checklist?.[stage.id] && (
                <div className="px-6 pb-6 pt-2 border-t-2 border-gray-100">
                  <div className="space-y-2">
                    {checklist[stage.id].map((item: any) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                          item.completed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:border-[#594FF4]'
                        }`}
                      >
                        <button
                          onClick={() => handleChecklistToggle(item.id, item.completed)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-[#594FF4] transition-colors" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-bold text-sm ${
                              item.completed ? 'text-green-900 line-through' : 'text-[#211F1B]'
                            }`}>
                              {item.label}
                            </h4>
                            {item.aiAssisted && (
                              <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-lg">
                                <Cpu className="w-3 h-3 text-purple-600" />
                                <span className="text-xs font-bold text-purple-600">IA</span>
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1 font-medium">
                              {item.description}
                            </p>
                          )}
                          {item.dataSource && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                                📡 {item.dataSource.replace(/_/g, ' ')}
                              </span>
                            </div>
                          )}
                          {item.completed && item.completedAt && (
                            <div className="mt-2 text-xs text-gray-500">
                              ✓ Complété le {new Date(item.completedAt).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stage Summary */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#594FF4]/10 to-[#4840C9]/10 rounded-xl border-2 border-[#594FF4]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#594FF4]">
                          🚀 Gain de temps grâce à l'IA
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {stats.aiAssisted} tâches sur {stats.total} automatisées ({Math.round((stats.aiAssisted / stats.total) * 100)}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#594FF4]">
                          {Math.round((stats.aiAssisted / stats.total) * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">Automatisation</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
