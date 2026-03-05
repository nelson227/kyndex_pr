'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface ProviderStats {
  totalEarnings: number;
  monthlyEarnings: number;
  completedOrders: number;
  activeOrders: number;
  averageRating: number;
  totalReviews: number;
  responseTime: string;
  completionRate: number;
}

interface EarningData {
  month: string;
  amount: number;
}

interface RecentOrder {
  id: string;
  clientName: string;
  serviceName: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  clientAvatar: string;
}

export default function ProviderOverview() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { isClient, mode } = useUserMode();
  const [stats, setStats] = useState<ProviderStats>({
    totalEarnings: 12450,
    monthlyEarnings: 2890,
    completedOrders: 47,
    activeOrders: 5,
    averageRating: 4.85,
    totalReviews: 142,
    responseTime: '2h',
    completionRate: 98,
  });
  const [earningData, setEarningData] = useState<EarningData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Rediriger si en mode client
  useEffect(() => {
    if (isInitialized && isClient) {
      router.push('/dashboard');
    }
  }, [isClient, isInitialized, router]);

  useEffect(() => {
    // Mock data pour les revenus mensuels
    setEarningData([
      { month: 'Jan', amount: 2100 },
      { month: 'Fév', amount: 2450 },
      { month: 'Mar', amount: 1890 },
      { month: 'Avr', amount: 2650 },
      { month: 'Mai', amount: 2200 },
      { month: 'Juin', amount: 2890 },
    ]);

    // Mock data pour les commandes récentes
    setRecentOrders([
      {
        id: '1',
        clientName: 'Sophie Martin',
        serviceName: 'Design Logo',
        amount: 350,
        status: 'completed',
        date: '2026-03-10',
        clientAvatar: 'S',
      },
      {
        id: '2',
        clientName: 'Jean Dupont',
        serviceName: 'Développement API',
        amount: 850,
        status: 'in-progress',
        date: '2026-03-08',
        clientAvatar: 'J',
      },
      {
        id: '3',
        clientName: 'Marie Leblanc',
        serviceName: 'Consultation Marketing',
        amount: 450,
        status: 'pending',
        date: '2026-03-06',
        clientAvatar: 'M',
      },
      {
        id: '4',
        clientName: 'Pierre Bernard',
        serviceName: 'Rédaction Web',
        amount: 280,
        status: 'completed',
        date: '2026-03-04',
        clientAvatar: 'P',
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
      case 'completed':
        return 'Complété';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const maxEarning = Math.max(...earningData.map((d) => d.amount));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Aperçu des activités 📊
        </h1>
        <p className="text-gray-400">
          Gérez vos services, commandes et suivez vos revenus
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Revenus Totaux</p>
              <p className="text-3xl font-bold text-white">{stats.totalEarnings}€</p>
              <p className="text-xs text-emerald-400 mt-2">+{stats.monthlyEarnings}€ ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Commandes Actives</p>
              <p className="text-3xl font-bold text-white">{stats.activeOrders}</p>
              <p className="text-xs text-blue-400 mt-2">
                {stats.completedOrders} réalisées
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Taux de Réalisation</p>
              <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
              <p className="text-xs text-purple-400 mt-2">Très fiable ✓</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Note Moyenne</p>
              <p className="text-3xl font-bold text-white">{stats.averageRating}</p>
              <p className="text-xs text-yellow-400 mt-2">({stats.totalReviews} avis)</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Revenus des 6 derniers mois</h2>

            <div className="space-y-4">
              {/* Chart Bars */}
              <div className="flex items-end gap-2 h-48 justify-between">
                {earningData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-500/30 rounded-t-lg relative group"
                      style={{
                        height: `${(data.amount / maxEarning) * 180}px`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-cyan-500/30 rounded px-2 py-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {data.amount}€
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>

              {/* Stats Line */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                <div>
                  <p className="text-sm text-gray-400">Total 6 mois</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {earningData.reduce((sum, d) => sum + d.amount, 0)}€
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Moyenne/mois</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Math.round(earningData.reduce((sum, d) => sum + d.amount, 0) / 6)}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Performance</h2>

          <div className="space-y-4">
            {/* Response Time */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Temps de réponse</span>
                <span className="text-sm font-bold text-cyan-400">{stats.responseTime}</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  style={{ width: '95%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Excellente réactivité</p>
            </div>

            {/* Completion Rate Progress */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Taux réalisation</span>
                <span className="text-sm font-bold text-cyan-400">{stats.completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Très fiable</p>
            </div>

            {/* Rating Progress */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Satisfaction</span>
                <span className="text-sm font-bold text-yellow-400">
                  {stats.averageRating}/5.0
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Excellent niveau</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-6">
            <button className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30">
              Voir mes services
            </button>
            <button className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold rounded-lg transition border border-purple-500/30">
              Gérer les avis
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Commandes Récentes</h2>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
            Toutes les commandes →
          </button>
        </div>

        <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-900/50 transition cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {order.clientAvatar}
                        </div>
                        <span className="text-sm text-white font-medium group-hover:text-cyan-400 transition">
                          {order.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{order.serviceName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-cyan-400">{order.amount}€</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
