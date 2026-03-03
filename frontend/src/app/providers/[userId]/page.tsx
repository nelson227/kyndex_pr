'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import PublicLayout from '@/app/public-layout';
import { createApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { CreateServiceRequestModal } from '@/components/CreateServiceRequestModal';
import ProviderProfileModal from '@/components/ProviderProfileModal';

interface UserBadge {
  id: string;
  badge: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  priceType: string;
  tags: string[];
  location: string;
  onsite: boolean;
  remote: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface Review {
  id: string;
  overallRating: number;
  quality?: number;
  professionalism?: number;
  punctuality?: number;
  communication?: number;
  comment: string;
  createdAt: string;
  fromUser: {
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  };
}

interface ProviderProfile {
  id: string;
  email: string;
  phone?: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    bio: string;
    city: string;
    hourlyRate?: number;
    responseTime: number;
    averageRating: number;
    totalReviews: number;
  };
  badges?: UserBadge[];
}

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params.userId as string;

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/${userId}`);
      setProvider(res.data);

      const servicesRes = await apiClient.get(`/users/${userId}/services`);
      setServices(servicesRes.data || []);

      const reviewsRes = await apiClient.get(`/users/${userId}/reviews`);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error loading provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler pour le bouton "Contacter" - affiche le profil modal
  const handleContactProvider = () => {
    setIsProfileModalOpen(true);
  };

  // Handler pour le bouton "Demander un service" dans le modal
  const handleDemandService = () => {
    if (!user) {
      // Non connecté → afficher modal auth
      setIsAuthModalOpen(true);
    } else {
      // Connecté → fermer profil modal et ouvrir CreateServiceRequestModal
      setIsProfileModalOpen(false);
      setIsCreateRequestModalOpen(true);
    }
  };

  // Transform ProviderProfile à Provider pour ProviderProfileModal
  const providerForModal = provider ? {
    id: Math.random(),
    name: `${provider.profile.firstName} ${provider.profile.lastName}`,
    category: 'Service',
    price: services[0]?.basePrice ? `${services[0].basePrice} ${services[0].currency}` : 'Devis',
    rating: provider.profile.averageRating,
    reviews: provider.profile.totalReviews,
    tags: services.map(s => s.title).slice(0, 3),
    isTop: (provider.badges && provider.badges.length > 0) || false,
    emoji: '👤',
    experience: `${provider.profile.totalReviews} avis clients`,
    about: provider.profile.bio,
    zone: provider.profile.city,
    city: provider.profile.city,
    verified: true,
    verified_phone: !!provider.phone,
    evaluations: provider.profile.totalReviews,
    note: provider.profile.averageRating,
  } : null;

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!provider) {
    return (
      <PublicLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Profil non trouvé</h1>
        </div>
      </PublicLayout>
    );
  }

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length) : provider.profile.averageRating;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          {/* Avatar */}
          <div className="mb-6">
            {provider.profile.avatarUrl ? (
              <img
                src={`http://localhost:3001${provider.profile.avatarUrl}`}
                alt={provider.profile.firstName}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto shadow-lg border-4 border-cyan-500/30"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center text-6xl sm:text-8xl mx-auto border-4 border-cyan-500/30">
                👤
              </div>
            )}
          </div>

          {/* Provider Info */}
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
            {provider.profile.firstName} {provider.profile.lastName}
          </h1>
          <p className="text-lg text-cyan-400 mb-4">📍 {provider.profile.city}</p>
          <p className="text-gray-400 text-base sm:text-lg mb-6 leading-relaxed">
            {provider.profile.bio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{provider.profile.averageRating.toFixed(1)}</div>
              <div className="text-xs sm:text-sm text-gray-400">⭐ Évaluation</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">{reviews.length}</div>
              <div className="text-xs sm:text-sm text-gray-400">💬 Avis</div>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400">{services.length}</div>
              <div className="text-xs sm:text-sm text-gray-400">📋 Services</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleContactProvider}
            className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition transform hover:scale-105 text-base sm:text-lg"
          >
            📞 Contacter ce prestataire
          </button>
        </div>
      </div>

      {/* Provider Profile Modal */}
      {providerForModal && (
        <ProviderProfileModal
          provider={providerForModal}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onDemandService={handleDemandService}
        />
      )}

      {/* Auth Modal - Login/Signup */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-400/30 rounded-2xl p-6 sm:p-8 max-w-md w-full">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg font-bold transition text-sm sm:text-base ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                    : 'text-cyan-300 hover:text-cyan-200'
                }`}
              >
                Se connecter
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-lg font-bold transition text-sm sm:text-base ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'text-cyan-300 hover:text-cyan-200'
                }`}
              >
                S'inscrire
              </button>
            </div>

            {authMode === 'login' ? (
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base"
                >
                  Se connecter
                </button>
              </form>
            ) : (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    className="bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                />
                <input
                  type="text"
                  placeholder="Localisation"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full bg-gray-800/50 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                >
                  S'inscrire
                </button>
              </form>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="mt-6 w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Create Service Request Modal */}
      {user && (
        <CreateServiceRequestModal
          isOpen={isCreateRequestModalOpen}
          onClose={() => setIsCreateRequestModalOpen(false)}
          onSuccess={() => {
            setIsCreateRequestModalOpen(false);
            loadProviderData();
          }}
        />
      )}
    </PublicLayout>
  );
}
