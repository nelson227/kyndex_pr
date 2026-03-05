'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import { Star, MessageCircle, Heart, MapPin, TrendingUp } from 'lucide-react';

interface ActiveOrder {
  id: string;
  serviceName: string;
  providerName: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliveryDate: string;
  price: number;
}

interface RecommendedService {
  id: string;
  title: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  price: string;
  image: string;
  isOnline?: boolean;
}

export default function DashboardHome() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { isClient, mode } = useUserMode();
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<RecommendedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Rediriger si en mode provider
  useEffect(() => {
    if (isInitialized && !isClient) {
      router.push('/dashboard/provider-overview');
    }
    setIsLoading(false);
  }, [isClient, isInitialized, router]);

  useEffect(() => {
    // Mock data - remplacer par des appels API
    setActiveOrders([
      {
        id: '1',
        serviceName: 'Design de Landing Page',
        providerName: 'Sarah Design',
        status: 'in-progress',
        deliveryDate: '2026-03-12',
        price: 450,
      },
      {
        id: '2',
        serviceName: 'Audit SEO Site Web',
        providerName: 'Jean SEO Expert',
        status: 'pending',
        deliveryDate: '2026-03-15',
        price: 299,
      },
    ]);

    setRecommendedServices([
      {
        id: '1',
        title: 'Développement API REST',
        provider: {
          name: 'Alex Dev',
          avatar: 'A',
          rating: 4.9,
          reviews: 156,
        },
        price: '75€/h',
        image: '💻',
        isOnline: true,
      },
      {
        id: '2',
        title: 'Community Management',
        provider: {
          name: 'Marie Social',
          avatar: 'M',
          rating: 4.8,
          reviews: 98,
        },
        price: '35€/h',
        image: '📱',
        isOnline: true,
      },
      {
        id: '3',
        title: 'Copywriting & Content',
        provider: {
          name: 'Thomas Copy',
          avatar: 'T',
          rating: 4.7,
          reviews: 203,
        },
        price: '45€/h',
        image: '✍️',
        isOnline: false,
      },
      {
        id: '4',
        title: 'Stratégie Marketing',
        provider: {
          name: 'Lisa Strategy',
          avatar: 'L',
          rating: 4.9,
          reviews: 124,
        },
        price: '85€/h',
        image: '📊',
        isOnline: true,
      },
    ]);

    setLoading(false);
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
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Bienvenue, {user?.firstName} 👋
        </h1>
        <p className="text-gray-400">Gérez vos commandes et découvrez les meilleurs services</p>
      </div>

      {/* Bento Grid - Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders Card */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Commandes Actives</p>
              <p className="text-3xl font-bold text-white">{activeOrders.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Total Spending Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Dépenses ce mois</p>
              <p className="text-3xl font-bold text-white">749€</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              💳
            </div>
          </div>
        </div>

        {/* Favorite Services */}
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Favoris</p>
              <p className="text-3xl font-bold text-white">12</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Messages</p>
              <p className="text-3xl font-bold text-white">3</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders - Takes 2 columns on lg */}
        <div className="lg:col-span-2">
          <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Commandes Actives</h2>

            <div className="space-y-4">
              {activeOrders.length > 0 ? (
                activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 hover:border-cyan-500/30 transition group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition">
                          {order.serviceName}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Par {order.providerName}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="font-semibold text-cyan-400">{order.price}€</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">Aucune commande active</p>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Services Widget */}
        <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Recommandés</h2>

          <div className="space-y-3">
            {recommendedServices.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-3 hover:border-cyan-500/30 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {service.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {service.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        {service.provider.rating}
                      </span>
                      <span className="text-xs text-gray-500">({service.provider.reviews})</span>
                    </div>
                  </div>
                  {service.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30">
            Parcourir tous
          </button>
        </div>
      </div>

      {/* Recommended Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Services Recommandés</h2>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-2">
            Voir plus →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedServices.map((service) => (
            <div
              key={service.id}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition">
                {/* Service Image */}
                <div className="w-full h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-6xl border-b border-cyan-500/20 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition">
                  {service.image}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {service.title}
                  </h3>

                  {/* Provider Info */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {service.provider.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {service.provider.rating}
                        <span className="text-gray-600">({service.provider.reviews})</span>
                      </p>
                    </div>
                    {service.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{service.price}</span>
                    <button className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-lg transition border border-cyan-500/30">
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
