'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  Clock,
  Users,
  DollarSign,
} from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  category: string;
  price: string;
  priceType: 'fixed' | 'hourly';
  description: string;
  rating: number;
  orders: number;
  image: string;
  status: 'active' | 'inactive';
  views: number;
  deliveryDays?: number;
}

export default function MyServices() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { isClient } = useUserMode();
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Rediriger si en mode client
  useEffect(() => {
    if (isInitialized && isClient) {
      router.push('/dashboard');
    }
  }, [isClient, isInitialized, router]);

  useEffect(() => {
    // Mock data pour les services
    setServices([
      {
        id: '1',
        title: 'Design de Logo Professionnel',
        category: 'Design Graphique',
        price: '150',
        priceType: 'fixed',
        description: 'Création de logos modernes et mémorables pour votre marque',
        rating: 4.9,
        orders: 23,
        image: '🎨',
        status: 'active',
        views: 342,
        deliveryDays: 5,
      },
      {
        id: '2',
        title: 'Développement Application Web',
        category: 'Développement',
        price: '85',
        priceType: 'hourly',
        description: 'Applications React, Next.js et Node.js sur mesure',
        rating: 4.8,
        orders: 18,
        image: '💻',
        status: 'active',
        views: 521,
        deliveryDays: 14,
      },
      {
        id: '3',
        title: 'Stratégie Marketing Digital',
        category: 'Marketing',
        price: '250',
        priceType: 'fixed',
        description: 'Plans marketing personnalisés pour votre croissance',
        rating: 4.7,
        orders: 12,
        image: '📊',
        status: 'active',
        views: 298,
        deliveryDays: 7,
      },
      {
        id: '4',
        title: 'Rédaction de Contenu SEO',
        category: 'Contenu',
        price: '45',
        priceType: 'hourly',
        description: 'Articles optimisés pour les moteurs de recherche',
        rating: 4.6,
        orders: 31,
        image: '✍️',
        status: 'active',
        views: 456,
        deliveryDays: 3,
      },
      {
        id: '5',
        title: 'Brand Identity Design',
        category: 'Design Graphique',
        price: '500',
        priceType: 'fixed',
        description: 'Création d\'identité visuelle complète pour votre entreprise',
        rating: 5.0,
        orders: 8,
        image: '🏢',
        status: 'inactive',
        views: 124,
        deliveryDays: 21,
      },
    ]);

    setIsLoading(false);
  }, []);

  if (!isInitialized) {
    return null;
  }

  const filteredServices = services.filter((service) => {
    if (filterStatus === 'all') return true;
    return service.status === filterStatus;
  });

  const activeServicesCount = services.filter((s) => s.status === 'active').length;
  const totalViews = services.reduce((sum, s) => sum + s.views, 0);
  const totalOrders = services.reduce((sum, s) => sum + s.orders, 0);
  const avgRating =
    services.length > 0
      ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
      : 0;

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Mes Services 🎯
          </h1>
          <p className="text-gray-400">Gérez et optimisez vos offres de services</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-5 h-5" />
          Nouveau Service
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Services Actifs */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Services Actifs</p>
              <p className="text-3xl font-bold text-white">{activeServicesCount}</p>
              <p className="text-xs text-emerald-400 mt-2">En ligne</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              ✓
            </div>
          </div>
        </div>

        {/* Total Vues */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Vues Totales</p>
              <p className="text-3xl font-bold text-white">{totalViews}</p>
              <p className="text-xs text-blue-400 mt-2">Ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Commandes Totales */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Commandes</p>
              <p className="text-3xl font-bold text-white">{totalOrders}</p>
              <p className="text-xs text-purple-400 mt-2">
                Moyenne: {(totalOrders / services.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Note Moyenne */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Note Moyenne</p>
              <p className="text-3xl font-bold text-white">{avgRating}</p>
              <p className="text-xs text-yellow-400 mt-2">Excellent</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'active', 'inactive'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterStatus(filter)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === filter
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-gray-900/50 text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            {filter === 'all' && 'Tous'}
            {filter === 'active' && 'Actifs'}
            {filter === 'inactive' && 'Inactifs'}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition group"
            >
              {/* Service Image */}
              <div className="relative w-full h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-6xl border-b border-cyan-500/20 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition">
                {service.image}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      service.status === 'active'
                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600'
                    }`}
                  >
                    {service.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-xs text-cyan-400 font-semibold mb-1">{service.category}</p>
                  <h3 className="font-bold text-white mb-1 line-clamp-2">{service.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{service.description}</p>
                </div>

                {/* Rating & Orders */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800/50">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-white">{service.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({service.orders} commandes)</span>
                </div>

                {/* Price & Views */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-cyan-400">{service.price}€</span>
                    <span className="text-xs text-gray-500">
                      {service.priceType === 'fixed' ? '(fixe)' : '(heure)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{service.views}</span>
                  </div>
                </div>

                {/* Delivery Time */}
                {service.deliveryDays && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{service.deliveryDays} jours de livraison</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30 text-sm">
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleStatus(service.id)}
                    className={`flex-1 px-3 py-2 font-semibold rounded-lg transition border text-sm ${
                      service.status === 'active'
                        ? 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 border-gray-600'
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
                    }`}
                  >
                    {service.status === 'active' ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition border border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400 mb-4">Aucun service trouvé</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-xl transition border border-cyan-500/30"
          >
            <Plus className="w-5 h-5" />
            Créer un service
          </button>
        </div>
      )}
    </div>
  );
}
