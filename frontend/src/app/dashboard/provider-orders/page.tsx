'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import {
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Calendar,
} from 'lucide-react';

interface OrderDetails {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientRating?: number;
  serviceName: string;
  serviceDescription: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  createdDate: string;
  dueDate: string;
  deliveryDate?: string;
  progress: number;
  messages: number;
  requirements: string;
  notes?: string;
}

export default function ProviderOrders() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { isClient } = useUserMode();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  // Rediriger si en mode client
  useEffect(() => {
    if (isInitialized && isClient) {
      router.push('/dashboard');
    }
  }, [isClient, isInitialized, router]);

  useEffect(() => {
    // Mock data pour les commandes du prestataire
    setOrders([
      {
        id: 'ORD-001',
        clientName: 'Sophie Martin',
        clientAvatar: 'S',
        clientRating: 5,
        serviceName: 'Design Logo Professionnel',
        serviceDescription: 'Logo minimaliste pour startup tech',
        amount: 350,
        status: 'in-progress',
        createdDate: '2026-03-08',
        dueDate: '2026-03-15',
        progress: 65,
        messages: 2,
        requirements:
          'Logo minimaliste, couleurs: bleu et vert, format vectoriel (AI, PDF)',
        notes: 'Client très réactif, a donné des feeds constructifs',
      },
      {
        id: 'ORD-002',
        clientName: 'Jean Dupont',
        clientAvatar: 'J',
        clientRating: 4,
        serviceName: 'Développement API REST',
        serviceDescription: 'API pour gestion inventaire',
        amount: 850,
        status: 'in-progress',
        createdDate: '2026-03-01',
        dueDate: '2026-03-20',
        deliveryDate: '2026-03-22',
        progress: 45,
        messages: 8,
        requirements:
          'Node.js/Express, MongoDB, auth JWT, endpoints CRUD complets',
        notes: 'En cours de développement, quelques ajustements demandés',
      },
      {
        id: 'ORD-003',
        clientName: 'Marie Leblanc',
        clientAvatar: 'M',
        clientRating: 5,
        serviceName: 'Consultation Marketing',
        serviceDescription: 'Stratégie marketing pour PME',
        amount: 450,
        status: 'pending',
        createdDate: '2026-03-10',
        dueDate: '2026-03-17',
        progress: 0,
        messages: 0,
        requirements:
          'Audit complet, propositions stratégie, calendrier content',
        notes: 'En attente de démarrage',
      },
      {
        id: 'ORD-004',
        clientName: 'Pierre Bernard',
        clientAvatar: 'P',
        clientRating: 5,
        serviceName: 'Rédaction Web',
        serviceDescription: '10 articles blog',
        amount: 280,
        status: 'completed',
        createdDate: '2026-02-20',
        dueDate: '2026-03-05',
        deliveryDate: '2026-03-04',
        progress: 100,
        messages: 5,
        requirements: 'Articles SEO optimisés, 800 mots chacun',
        notes: 'Client satisfait, deuxième commande en préparation',
      },
      {
        id: 'ORD-005',
        clientName: 'Alice Rousseau',
        clientAvatar: 'A',
        clientRating: 4,
        serviceName: 'Design de Landing Page',
        serviceDescription: 'Landing page produit SaaS',
        amount: 600,
        status: 'review',
        createdDate: '2026-02-28',
        dueDate: '2026-03-14',
        deliveryDate: '2026-03-12',
        progress: 95,
        messages: 12,
        requirements: 'Mobile-first, conversion-focused, formulaire contact',
        notes: 'En révision, attente des retours clients',
      },
      {
        id: 'ORD-006',
        clientName: 'Thomas Moreau',
        clientAvatar: 'T',
        clientRating: 3,
        serviceName: 'Support Technique',
        serviceDescription: 'Audit et optimisation site',
        amount: 200,
        status: 'cancelled',
        createdDate: '2026-02-15',
        dueDate: '2026-02-25',
        progress: 30,
        messages: 3,
        requirements: 'Audit performance, recommandations SEO',
        notes: 'Annulé par client - manque de budget',
      },
    ]);

    setIsLoading(false);
  }, []);

  if (!isInitialized) {
    return null;
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5" />;
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'review':
        return <MessageCircle className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
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
    totalEarnings: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.amount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Mes Commandes 📦
        </h1>
        <p className="text-gray-400">Suivez et gérez toutes vos commandes en cours</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commandes En Attente */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">En Attente</p>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-yellow-400 mt-2">À commencer</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Commandes En Cours */}
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

        {/* Commandes Complétées */}
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

        {/* Revenus Complétés */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Revenus Complétés</p>
              <p className="text-3xl font-bold text-white">{stats.totalEarnings}€</p>
              <p className="text-xs text-emerald-400 mt-2">Versements</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              💚
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
              className="border border-cyan-500/20 rounded-2xl overflow-hidden h-full transition"
            >
              {/* Order Header - Click to expand */}
              <div
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                }
                className="bg-gradient-to-r from-gray-950/50 to-gray-900/50 backdrop-blur-sm p-6 cursor-pointer hover:from-gray-950/70 hover:to-gray-900/70 transition flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    {/* Client Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {order.clientAvatar}
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
                        Client: {order.clientName}
                        {order.clientRating && (
                          <span className="ml-3 text-yellow-400">
                            {'⭐'.repeat(order.clientRating)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{order.amount}€</p>
                    <p className="text-xs text-gray-500">Montant total</p>
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
                  {/* Dates & Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Date de création</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Date limite</p>
                      <p className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(order.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {order.deliveryDate && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">Date livraison</p>
                        <p className="text-sm font-bold text-green-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Full Progress Bar */}
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

                  {/* Requirements */}
                  <div>
                    <p className="text-sm font-bold text-white mb-2">Spécifications client</p>
                    <p className="text-sm text-gray-300 bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                      {order.requirements}
                    </p>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <p className="text-sm font-bold text-white mb-2">Notes internes</p>
                      <p className="text-sm text-gray-300 bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                        {order.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-800/50">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30">
                      <MessageCircle className="w-4 h-4" />
                      Discuter ({order.messages})
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold rounded-lg transition border border-purple-500/30">
                      Soumettre livrable
                    </button>
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
