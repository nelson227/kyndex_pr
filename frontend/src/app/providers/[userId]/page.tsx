'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PublicLayout from '@/app/public-layout';
import { createApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { CreateServiceRequestModal } from '@/components/CreateServiceRequestModal';
import Link from 'next/link';
import { ReviewSection } from '@/components/ReviewSection';
import { Badge } from '@/components/UIElements';

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

  // Handler pour le bouton "Demander un service"
  const handleContactProvider = () => {
    if (!user) {
      // Non connecté → redirection vers login
      router.push('/auth/login');
    } else {
      // Connecté → ouvrir le modal
      setIsCreateRequestModalOpen(true);
    }
  };

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
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/services" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Retour aux services
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                {provider.profile.avatarUrl ? (
                  <img
                    src={`http://localhost:3001${provider.profile.avatarUrl}`}
                    alt={provider.profile.firstName}
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-6xl mb-4 shadow-lg">
                    👤
                  </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {provider.profile.firstName} {provider.profile.lastName}
                </h1>
                <p className="text-gray-600 text-lg mt-1">📍 {provider.profile.city}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">⭐ Note moyenne</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{reviews.length}</div>
                  <div className="text-sm text-gray-600">💬 Avis</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{services.length}</div>
                  <div className="text-sm text-gray-600">📋 Services</div>
                </div>
              </div>

              {/* Response Time & CTA */}
              <div className="space-y-4">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">⏱️ Temps de réponse</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {provider.profile.responseTime}h
                  </p>
                </div>
                <button 
                  onClick={handleContactProvider}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {user ? '💼 Demander un service' : '🔗 Se connecter pour demander'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {provider.profile.bio && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{provider.profile.bio}</p>
                </div>
              )}

              {/* Badges Section */}
              {provider.badges && provider.badges.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications & Badges</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {provider.badges.map((userBadge) => (
                      <Badge
                        key={userBadge.id}
                        icon={userBadge.badge.icon}
                        label={userBadge.badge.name}
                        color={userBadge.badge.color}
                        description={userBadge.badge.description}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Services Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services proposés ({services.length})</h2>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition group"
                      >
                        <div className="flex items-start gap-4">
                          <span
                            className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg text-white flex-shrink-0"
                            style={{ backgroundColor: service.category.color }}
                          >
                            {service.category.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{service.description}</p>

                            {/* Service Details */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {service.category.name}
                              </span>
                              {service.onsite && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Sur place
                                </span>
                              )}
                              {service.remote && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  À distance
                                </span>
                              )}
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {service.basePrice}€{service.priceType === 'HOURLY' ? '/h' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <span className="text-lg">⭐</span>
                              <span className="font-bold text-gray-900">{service.averageRating.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-gray-600">{service.totalReviews} avis</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">Aucun service proposé pour le moment</p>
                )}
              </div>

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <ReviewSection
                  reviews={reviews}
                  averageRating={averageRating}
                  totalReviews={reviews.length}
                />
              )}
            </div>

            {/* Right Column - Info Card */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-md sticky top-4 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Informations</h3>

                <div>
                  <p className="text-sm text-gray-600 mb-1">📧 Email</p>
                  <p className="font-semibold text-gray-900 break-all">{provider.email}</p>
                </div>

                {provider.phone && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">📱 Téléphone</p>
                    <p className="font-semibold text-gray-900">{provider.phone}</p>
                  </div>
                )}

                {provider.profile.hourlyRate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">💰 Tarif horaire</p>
                    <p className="text-xl font-bold text-blue-600">{provider.profile.hourlyRate}€/h</p>
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Envoyer un message
                </button>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-xs text-gray-600 mb-3">✓ Identité vérifiée</p>
                  <p className="text-xs text-gray-600 mb-3">✓ Paiement sécurisé</p>
                  <p className="text-xs text-gray-600">✓ Évaluations authentiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Service Request Modal */}
        <CreateServiceRequestModal
          isOpen={isCreateRequestModalOpen}
          onClose={() => setIsCreateRequestModalOpen(false)}
          onSuccess={() => {
            setIsCreateRequestModalOpen(false);
            loadProviderData();
          }}
        />
      </div>
    </PublicLayout>
  );
}
