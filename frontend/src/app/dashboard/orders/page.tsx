'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Download,
  ChevronDown,
  Star,
} from 'lucide-react';

interface Order {
  id: string;
  serviceName: string;
  providerName: string;
  providerAvatar: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  createdDate: string;
  dueDate: string;
  deliveryDate?: string;
  progress: number;
  messages: number;
  deliverables: string[];
  rating?: number;
}

export default function OrdersPage() {
  const { user, isInitialized } = useAuth();
  const { isClient } = useUserMode();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>(
    'all'
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isInitialized && isClient === false) {
      // Redirect provider users
    }
  }, [isClient, isInitialized]);

  useEffect(() => {
    // Mock data
    setOrders([
      {
        id: 'CMD-2026-001',
        serviceName: 'Design de Landing Page',
        providerName: 'Sarah Designer',
        providerAvatar: 'S',
        amount: 450,
        status: 'in-progress',
        createdDate: '2026-03-01',
        dueDate: '2026-03-15',
        progress: 65,
        messages: 3,
        deliverables: ['Wireframes', 'Mockups', 'Final Design'],
        rating: 5,
      },
      {
        id: 'CMD-2026-002',
        serviceName: 'Développement API REST',
        providerName: 'Jean Developer',
        providerAvatar: 'J',
        amount: 850,
        status: 'in-progress',
        createdDate: '2026-02-15',
        dueDate: '2026-03-20',
        progress: 45,
        messages: 8,
        deliverables: ['Documentation', 'Code Source', 'Tests'],
      },
      {
        id: 'CMD-2026-003',
        serviceName: 'Stratégie Marketing',
        providerName: 'Marie Marketer',
        providerAvatar: 'M',
        amount: 250,
        status: 'pending',
        createdDate: '2026-03-08',
        dueDate: '2026-03-22',
        progress: 0,
        messages: 1,
        deliverables: ['Audit', 'Plan Stratégique', 'Calendrier'],
      },
      {
        id: 'CMD-2026-004',
        serviceName: 'Rédaction Articles Blog',
        providerName: 'Thomas Writer',
        providerAvatar: 'T',
        amount: 280,
        status: 'completed',
        createdDate: '2026-02-01',
        dueDate: '2026-02-28',
        deliveryDate: '2026-02-27',
        progress: 100,
        messages: 5,
        deliverables: ['10 Articles', 'Images', 'Meta Tags'],
        rating: 5,
      },
      {
        id: 'CMD-2026-005',
        serviceName: 'Community Management',
        providerName: 'Lisa Social',
        providerAvatar: 'L',
        amount: 600,
        status: 'review',
        createdDate: '2026-02-10',
        dueDate: '2026-03-15',
        progress: 85,
        messages: 12,
        deliverables: ['Posts Calendar', 'Content', 'Analytics Report'],
      },
    ]);

    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in-progress':
        return 'En cours';
      case 'review':
        return 'En révision';
      case 'completed':
        return 'Complété';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  const stats = {
    pending: orders.filter((o) => o.status === 'pending').length,
    inProgress: orders.filter((o) => o.status === 'in-progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, o) => sum + o.amount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Mes Commandes 📦
        </h1>
        <p className="text-gray-400">Suivi et gestion de toutes vos commandes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* En Attente */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">En Attente</p>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-yellow-400 mt-2">À démarrer</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* En Cours */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">En Cours</p>
              <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-blue-400 mt-2">En travail</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Complétées */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Complétées</p>
              <p className="text-3xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-green-400 mt-2">Finalisées</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Dépensé */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Dépensé</p>
              <p className="text-3xl font-bold text-white">{stats.totalSpent}€</p>
              <p className="text-xs text-purple-400 mt-2">Budget</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              💜
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedFilter === filter
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-gray-900/50 text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            {filter === 'all' && 'Toutes'}
            {filter === 'pending' && `En attente (${stats.pending})`}
            {filter === 'in-progress' && `En cours (${stats.inProgress})`}
            {filter === 'completed' && `Complétées (${stats.completed})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-cyan-500/20 rounded-2xl overflow-hidden transition"
            >
              {/* Order Header */}
              <div
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                }
                className="bg-gradient-to-r from-gray-950/50 to-gray-900/50 backdrop-blur-sm p-6 cursor-pointer hover:from-gray-950/70 hover:to-gray-900/70 transition flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    {/* Provider Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {order.providerAvatar}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-400">{order.id}</p>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">
                        {order.serviceName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Prestataire: {order.providerName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{order.amount}€</p>
                    <p className="text-xs text-gray-500">Montant</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-400 mb-2 w-24 text-right">
                      {order.progress}%
                    </p>
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transition ${
                      expandedOrderId === order.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrderId === order.id && (
                <div className="border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6 space-y-6">
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Créée le</p>
                      <p className="text-sm font-bold text-white">
                        {new Date(order.createdDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Limite</p>
                      <p className="text-sm font-bold text-yellow-400">
                        {new Date(order.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {order.deliveryDate && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">Livrée</p>
                        <p className="text-sm font-bold text-green-400">
                          {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-gray-300">Avancement</p>
                      <p className="text-sm font-bold text-cyan-400">{order.progress}%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <p className="text-sm font-bold text-white mb-3">Livrables attendus</p>
                    <div className="flex flex-wrap gap-2">
                      {order.deliverables.map((deliverable, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating (if completed) */}
                  {order.status === 'completed' && order.rating && (
                    <div>
                      <p className="text-sm font-bold text-white mb-2">Votre note</p>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < order.rating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">
                          {order.rating}/5
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-800/50">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30">
                      <MessageCircle className="w-4 h-4" />
                      Messages ({order.messages})
                    </button>
                    {order.status === 'review' && (
                      <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold rounded-lg transition border border-green-500/30">
                        Approuver
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold rounded-lg transition border border-purple-500/30">
                        <Download className="w-4 h-4" />
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-400">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
