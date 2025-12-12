import React, { useState, DragEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods as api } from '../lib/api';
import { Plus, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const STATUSES = [
  { id: 'SOURCING', label: 'Sourcing', color: 'from-gray-400 to-gray-500', badge: 'bg-gray-500' },
  { id: 'REGULATORY_ANALYSIS', label: 'Analyse Réglementaire', color: 'from-blue-400 to-blue-500', badge: 'bg-blue-500' },
  { id: 'TECHNICAL_STUDY', label: 'Étude Technique', color: 'from-[#FFDE00] to-[#FFA500]', badge: 'bg-[#FFDE00]' },
  { id: 'NETWORK_STUDY', label: 'Étude Réseau', color: 'from-orange-400 to-orange-500', badge: 'bg-orange-500' },
  { id: 'FONCIER', label: 'Foncier', color: 'from-[#594FF4] to-[#4840C9]', badge: 'bg-[#594FF4]' },
  { id: 'ECONOMIC_MODEL', label: 'Modèle Économique', color: 'from-green-400 to-green-500', badge: 'bg-green-500' },
  { id: 'QA_REVIEW', label: 'Revue QA', color: 'from-pink-400 to-pink-500', badge: 'bg-pink-500' },
  { id: 'VALIDATED', label: 'Validé', color: 'from-emerald-400 to-emerald-500', badge: 'bg-emerald-500' },
  { id: 'REJECTED', label: 'Rejeté', color: 'from-red-400 to-red-500', badge: 'bg-red-500' },
];

export default function PipelinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draggedLead, setDraggedLead] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('all');

  // Fetch all users for filter
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.users.getAll();
      return response.data;
    },
  });

  // Fetch leads with optional filter
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads', selectedUserId],
    queryFn: async () => {
      const params = selectedUserId === 'all' ? {} : { assignedTo: selectedUserId };
      const response = await api.leads.getAll(params);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      return api.leads.updateStatus(leadId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const handleDragStart = (e: DragEvent, lead: any) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== newStatus) {
      updateStatusMutation.mutate({
        leadId: draggedLead.id,
        status: newStatus,
      });
    }
    setDraggedLead(null);
  };

  const getLeadsByStatus = (status: string) => {
    return leads?.filter((lead: any) => lead.status === status) || [];
  };

  const selectedUser = users?.find((u: any) => u.id === selectedUserId);
  const isAdminView = selectedUserId === 'all';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#594FF4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement du pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#211F1B]">
              Pipeline de Production
            </h1>
            <p className="text-gray-600 mt-2 font-medium">
              {isAdminView ? 'Vue d\'ensemble de tous les leads' : `Leads assignés à ${selectedUser?.firstName} ${selectedUser?.lastName}`}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-4 border-2 border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#594FF4]" />
              <span className="font-bold text-[#211F1B]">Filtrer par:</span>
            </div>

            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#594FF4] focus:border-[#594FF4] transition-all outline-none font-medium"
            >
              <option value="all">🌍 Tous les team members (Vue globale)</option>
              {users?.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.role === 'ADMIN' ? '👑' : '👤'} {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#594FF4]/10 px-4 py-2 rounded-xl">
                <BarChart3 className="w-4 h-4 text-[#594FF4]" />
                <span className="text-sm font-bold text-[#594FF4]">
                  {leads?.length || 0} leads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const statusLeads = getLeadsByStatus(status.id);

          return (
            <div
              key={status.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              <div className={`bg-gradient-to-r ${status.color} rounded-t-2xl px-4 py-3 shadow-md`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">
                    {status.label}
                  </h3>
                  <span className={`${status.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {statusLeads.length}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-b-2xl p-3 min-h-[600px] space-y-3 border-2 border-t-0 border-gray-100">
                {statusLeads.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                    Aucun lead
                  </div>
                ) : (
                  statusLeads.map((lead: any) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all border-2 border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-[#211F1B] text-sm flex-1">
                          {lead.internalName}
                        </h4>
                        {lead.qualityScore && (
                          <span className="bg-[#FFDE00]/20 text-[#211F1B] text-xs font-bold px-2 py-1 rounded-lg border border-[#FFDE00]">
                            {lead.qualityScore}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-3 font-medium">
                        📍 {lead.commune} ({lead.department})
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500 font-medium">
                            {lead.surfaceHa} ha
                          </span>
                          {lead.estimatedMWc && (
                            <span className="text-xs font-bold text-[#594FF4]">
                              {lead.estimatedMWc.toFixed(1)} MWc
                            </span>
                          )}
                        </div>

                        {lead.assignedTo && (
                          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                            <div className="w-2 h-2 bg-[#594FF4] rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">
                              {lead.assignedTo.firstName[0]}.{lead.assignedTo.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {lead.completeness !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 font-medium">Complétion</span>
                            <span className="text-xs font-bold text-[#594FF4]">{lead.completeness}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#594FF4] to-[#4840C9] h-2 rounded-full transition-all"
                              style={{ width: `${lead.completeness}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
