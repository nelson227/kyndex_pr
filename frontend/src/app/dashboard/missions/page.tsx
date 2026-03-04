'use client';

import { useState } from 'react';
import { CheckCircle, Clock, Calendar, ChevronRight } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  contact: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  budget?: string;
  progress?: number;
}

const mockMissions: Mission[] = [
  // Missions en cours
  {
    id: '1',
    title: 'Design de landing page',
    contact: 'Emma Chen',
    description: 'Création du design UI/UX pour une landing page e-commerce',
    startDate: '2026-02-15',
    endDate: '2026-03-15',
    status: 'in-progress',
    budget: '500€',
    progress: 65,
  },
  {
    id: '2',
    title: 'Développement API REST',
    contact: 'Jean Dupont',
    description: 'Développement d\'une API REST avec Node.js et MongoDB',
    startDate: '2026-02-20',
    endDate: '2026-04-20',
    status: 'in-progress',
    budget: '1200€',
    progress: 40,
  },

  // Missions à venir
  {
    id: '3',
    title: 'Audit de sécurité',
    contact: 'Marie Leclerc',
    description: 'Audit de sécurité complète d\'une application web',
    startDate: '2026-03-10',
    endDate: '2026-03-20',
    status: 'upcoming',
    budget: '800€',
  },
  {
    id: '4',
    title: 'Intégration Firebase',
    contact: 'Thomas Martin',
    description: 'Intégration de Firebase pour authentication et database',
    startDate: '2026-03-15',
    endDate: '2026-03-30',
    status: 'upcoming',
    budget: '600€',
  },

  // Historique (missions complétées)
  {
    id: '5',
    title: 'Refonte site web',
    contact: 'Sophie Bernard',
    description: 'Refonte complète du site web d\'une startup',
    startDate: '2026-01-10',
    endDate: '2026-02-10',
    status: 'completed',
    budget: '2000€',
  },
  {
    id: '6',
    title: 'Formation React',
    contact: 'Pierre Moreau',
    description: 'Formation React pour une équipe de 5 développeurs',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    status: 'completed',
    budget: '900€',
  },
];

type TabType = 'in-progress' | 'upcoming' | 'completed';

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('in-progress');

  const getMissionsByStatus = (status: TabType) => {
    return mockMissions.filter(m => m.status === status);
  };

  const currentMissions = getMissionsByStatus(activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'upcoming':
        return <Calendar className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'in-progress':
        return 'En cours';
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Historique';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mes missions</h1>
        <div className="text-sm text-gray-500">
          Total: {mockMissions.length} missions
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['in-progress', 'upcoming', 'completed'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-cyan-300'
            }`}
          >
            {getTabIcon(tab)}
            {getTabLabel(tab)}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab
                ? 'bg-white/30'
                : 'bg-gray-100'
            }`}>
              {getMissionsByStatus(tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentMissions.length > 0 ? (
          currentMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              formatDate={formatDate}
              getDaysLeft={getDaysLeft}
            />
          ))
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'in-progress' && 'Aucune mission en cours'}
              {activeTab === 'upcoming' && 'Aucune mission à venir'}
              {activeTab === 'completed' && 'Aucune mission complétée'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'in-progress' && 'Commencez une nouvelle mission'}
              {activeTab === 'upcoming' && 'Aucune mission programmée pour le moment'}
              {activeTab === 'completed' && 'Vous n\'avez pas encore complété de mission'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
  formatDate: (dateString: string) => string;
  getDaysLeft: (endDate: string) => number;
}

function MissionCard({ mission, formatDate, getDaysLeft }: MissionCardProps) {
  const daysLeft = mission.status !== 'completed' ? getDaysLeft(mission.endDate) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return '🔄 En cours';
      case 'upcoming':
        return '⏱️ À venir';
      case 'completed':
        return '✅ Complétée';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 flex-1">{mission.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(mission.status)}`}>
            {getStatusLabel(mission.status)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{mission.contact}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-gray-700 text-sm line-clamp-2">{mission.description}</p>

        {/* Progress bar (if in progress) */}
        {mission.status === 'in-progress' && mission.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Progression</span>
              <span className="font-semibold text-gray-900">{mission.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline and Details */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Durée</span>
            <span className="font-medium text-gray-900">
              {formatDate(mission.startDate)} → {formatDate(mission.endDate)}
            </span>
          </div>

          {mission.budget && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget</span>
              <span className="font-semibold text-cyan-600">{mission.budget}</span>
            </div>
          )}

          {daysLeft !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Temps restant</span>
              <span className={`font-medium ${
                daysLeft <= 7 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {daysLeft} jour{daysLeft > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Action */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-end hover:bg-gray-100 transition cursor-pointer group">
        <span className="text-sm font-medium text-gray-700 group-hover:text-cyan-600">
          Voir détails
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 ml-1 transition" />
      </div>
    </div>
  );
}
