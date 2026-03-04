'use client';

import { X, MapPin, Star, Heart, Clock, CheckCircle, Zap, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import InterventionMap, { CITY_COORDINATES } from './InterventionMap';

interface Review {
  id: number;
  author: string;
  avatar: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  service: string;
}

interface Provider {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  tags: string[];
  isTop: boolean;
  emoji: string;
  experience?: string;
  about?: string;
  commitments?: string[];
  equipment?: string[];
  zone?: string;
  city?: string;
  verified?: boolean;
  verified_phone?: boolean;
  evaluations?: number;
  note?: number;
  workPhotos?: string[];
  clientReviews?: Review[];
}

interface ProviderProfileModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onChat?: (providerId: number, providerName: string) => void;
}

export default function ProviderProfileModal({ provider, isOpen, onClose, onChat }: ProviderProfileModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!isOpen || !provider) return null;

  const ratingDistribution = provider.clientReviews ? {
    5: provider.clientReviews.filter(r => r.rating === 5).length,
    4: provider.clientReviews.filter(r => r.rating === 4).length,
    3: provider.clientReviews.filter(r => r.rating === 3).length,
    2: provider.clientReviews.filter(r => r.rating === 2).length,
    1: provider.clientReviews.filter(r => r.rating === 1).length,
  } : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  const nextPhoto = () => {
    if (provider?.workPhotos && provider.workPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % provider.workPhotos!.length);
    }
  };

  const prevPhoto = () => {
    if (provider?.workPhotos && provider.workPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + provider.workPhotos!.length) % provider.workPhotos!.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 xs2:p-3 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-500/30 rounded-lg xs2:rounded-xl sm:rounded-2xl max-w-3xl w-full max-h-[95vh] xs:max-h-[90vh] overflow-y-auto">
        {/* Header avec fermeture */}
        <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/50 border-b border-cyan-500/20 p-2 xs2:p-3 sm:p-4 md:p-6 flex items-center justify-between z-10">
          <h2 className="text-sm xs2:text-base sm:text-lg md:text-2xl font-bold text-white">Profil prestataire</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white flex-shrink-0"
          >
            <X size={18} className="xs2:w-5 xs2:h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-2 xs2:p-3 sm:p-4 md:p-6 space-y-4 xs2:space-y-5 sm:space-y-6 md:space-y-8">
          {/* Section principale - Info du prestataire */}
          <div className="flex flex-col xs2:flex-col sm:grid sm:grid-cols-3 gap-3 xs2:gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center sm:col-span-1">
              <div className="w-20 xs2:w-24 sm:w-28 md:w-32 h-20 xs2:h-24 sm:h-28 md:h-32 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl xs2:rounded-2xl flex items-center justify-center text-3xl xs2:text-4xl sm:text-5xl md:text-6xl border border-cyan-500/30 mb-2 xs2:mb-3">
                {provider.emoji}
              </div>
              {provider.isTop && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-2 py-0.5 xs2:px-3 xs2:py-1 rounded-full text-xs font-bold mb-2">
                  🏆 Top
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="sm:col-span-2 text-center sm:text-left">
              <div className="mb-2 xs2:mb-3 sm:mb-4">
                <h3 className="text-lg xs2:text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 xs2:mb-1">{provider.name}</h3>
                <p className="text-cyan-400 font-medium text-xs xs2:text-sm">{provider.category}</p>
              </div>

              {/* Prix et rating */}
              <div className="flex flex-col xs2:flex-row items-center sm:items-start gap-2 xs2:gap-4 sm:gap-6 mb-3 xs2:mb-4 sm:mb-6">
                <div>
                  <p className="text-gray-400 text-xs">Tarif horaire</p>
                  <p className="text-lg xs2:text-xl sm:text-2xl font-bold text-white">{provider.price}€/h</p>
                </div>
                <div>
                  <div className="flex items-center gap-0.5 justify-center sm:justify-start mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} xs2:w-4 xs2:h-4 sm:w-4 sm:h-4`}
                      />
                    ))}
                  </div>
                  <p className="text-xs xs2:text-sm text-gray-400">
                    <span className="text-white font-bold">{provider.rating.toFixed(2)}</span> ({provider.reviews} avis)
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 xs2:gap-2 justify-center sm:justify-start">
                {(provider.tags || []).map((tag, idx) => (
                  <span key={idx} className="px-2 xs2:px-3 py-0.5 xs2:py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium rounded-full">
                    • {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0"></div>

          {/* Galerie de travaux - Affichée uniquement si des photos existent */}
          {provider?.workPhotos && Array.isArray(provider.workPhotos) && provider.workPhotos.length > 0 && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base md:text-lg font-bold text-white mb-2 xs2:mb-3 sm:mb-4">Galerie de travaux</h4>
              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg xs2:rounded-xl overflow-hidden border border-gray-700 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl xs2:text-3xl mb-1 xs2:mb-2">🖼️</div>
                        <p className="text-xs xs2:text-sm">Photo {currentPhotoIndex + 1} de {provider.workPhotos.length}</p>
                        <p className="text-xs mt-1 xs2:mt-2">{provider.workPhotos[currentPhotoIndex]}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {provider.workPhotos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-1 xs2:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1 xs2:p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-1 xs2:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1 xs2:p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              <div className="flex gap-1.5 xs2:gap-2 mt-2 xs2:mt-3 sm:mt-4 overflow-x-auto pb-1.5">
                {provider.workPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`flex-shrink-0 w-12 xs2:w-14 sm:w-16 h-12 xs2:h-14 sm:h-16 rounded-lg border-2 transition ${
                      idx === currentPhotoIndex ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-center h-full text-lg xs2:text-xl">{idx + 1}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0"></div>

          {/* Expérience */}
          {provider.experience && (
            <div>
              <div className="flex items-center gap-2 mb-2 xs2:mb-3">
                <Clock size={16} className="xs2:w-5 xs2:h-5 text-cyan-400" />
                <h4 className="text-xs2 xs2:text-sm sm:text-base font-bold text-white">Expérience</h4>
              </div>
              <p className="text-xs xs2:text-sm text-gray-400">{provider.experience}</p>
            </div>
          )}

          {/* À propos */}
          {provider.about && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base font-bold text-white mb-2 xs2:mb-3">À propos</h4>
              <p className="text-xs xs2:text-sm text-gray-300 leading-relaxed">{provider.about}</p>
            </div>
          )}

          {/* Engagements clients */}
          {provider.commitments && provider.commitments.length > 0 && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base font-bold text-white mb-2 xs2:mb-3">Engagements clients</h4>
              <div className="flex flex-wrap gap-1.5 xs2:gap-2">
                {provider.commitments.map((commitment, idx) => (
                  <span key={idx} className="px-2 xs2:px-3 py-1 xs2:py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs xs2:text-sm rounded-lg">
                    {commitment}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Équipements */}
          {provider.equipment && provider.equipment.length > 0 && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base font-bold text-white mb-2 xs2:mb-3">Équipements</h4>
              <div className="flex flex-wrap gap-1.5 xs2:gap-2">
                {provider.equipment.map((item, idx) => (
                  <span key={idx} className="px-2 xs2:px-3 py-0.5 xs2:py-1 bg-gray-800/50 border border-gray-700 text-gray-300 text-xs xs2:text-sm rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Zone d'intervention avec Carte */}
          {provider.zone && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base md:text-lg font-bold text-white mb-2 xs2:mb-3 flex items-center gap-2">
                <MapPin size={16} className="xs2:w-5 xs2:h-5 text-cyan-400" />
                Zone d'intervention
              </h4>
              
              {/* Carte Interactive */}
              {provider.city && CITY_COORDINATES[provider.city] && (
                <div className="mb-3 xs2:mb-4">
                  <InterventionMap
                    zone={provider.zone}
                    providerName={provider.name}
                    lat={CITY_COORDINATES[provider.city].lat}
                    lng={CITY_COORDINATES[provider.city].lng}
                    radius={25000}
                  />
                </div>
              )}
              
              <p className="text-xs xs2:text-sm text-gray-400">{provider.zone}</p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0"></div>

          {/* Section Avis Détaillée */}
          {provider.clientReviews && provider.clientReviews.length > 0 && (
            <div>
              <h4 className="text-xs2 xs2:text-sm sm:text-base md:text-lg font-bold text-white mb-4 xs2:mb-5 sm:mb-6">Avis clients ({totalReviews})</h4>

              {/* Résumé des notes */}
              <div className="grid grid-cols-1 xs2:grid-cols-3 gap-4 xs2:gap-6 mb-6 xs2:mb-8">
                <div className="xs2:col-span-1">
                  <div className="text-center">
                    <p className="text-2xl xs2:text-3xl sm:text-4xl font-bold text-white mb-1">{provider.rating.toFixed(2)}</p>
                    <div className="flex items-center justify-center gap-0.5 mb-1.5 xs2:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} xs2:w-3.5 xs2:h-3.5 sm:w-4 sm:h-4`}
                        />
                      ))}
                    </div>
                    <p className="text-xs xs2:text-sm text-gray-400">{totalReviews} avis</p>
                  </div>
                </div>

                {/* Distribution des notes */}
                <div className="xs2:col-span-2 space-y-1.5 xs2:space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 xs2:gap-3">
                      <span className="text-xs xs2:text-sm text-gray-400 w-10 xs2:w-12">{rating} ★</span>
                      <div className="flex-1 h-1.5 xs2:h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                          style={{
                            width: totalReviews > 0 ? `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%` : '0%',
                          }}
                        ></div>
                      </div>
                      <span className="text-xs xs2:text-sm text-gray-400 w-6 xs2:w-7 text-right">
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avis individuels */}
              <div className="space-y-2.5 xs2:space-y-3 sm:space-y-4">
                {provider.clientReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-gray-800/30 border border-gray-700/50 rounded-lg xs2:rounded-xl p-2.5 xs2:p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 xs2:gap-3 mb-2 xs2:mb-3">
                      <div className="flex items-start gap-2 xs2:gap-3 flex-1">
                        <div className="w-8 xs2:w-10 h-8 xs2:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs xs2:text-sm font-bold flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs xs2:text-sm">{review.author}</p>
                          <p className="text-xs text-gray-400">{review.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} xs2:w-3 xs2:h-3 sm:w-4 sm:h-4`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>

                    <p className="text-xs xs2:text-sm font-medium text-cyan-400 mb-1.5 xs2:mb-2">Service : {review.service}</p>
                    <p className="text-gray-300 text-xs xs2:text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Bouton voir tous les avis */}
              {provider.clientReviews.length > 3 && (
                <button className="w-full mt-4 xs2:mt-5 sm:mt-6 py-2 xs2:py-2.5 sm:py-3 border border-cyan-500/30 text-cyan-400 font-medium rounded-lg xs2:rounded-xl hover:bg-cyan-500/10 transition flex items-center justify-center gap-2 text-xs xs2:text-sm">
                  Voir tous les avis ({provider.clientReviews.length})
                  <ChevronRight size={14} className="xs2:w-4 xs2:h-4" />
                </button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0"></div>

          {/* Informations vérifiées */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg xs2:rounded-xl p-2.5 xs2:p-3 sm:p-4 space-y-1.5 xs2:space-y-2">
            <h4 className="font-bold text-white mb-2 xs2:mb-2.5 flex items-center gap-2 text-xs2 xs2:text-sm sm:text-base">
              <CheckCircle size={16} className="xs2:w-5 xs2:h-5 text-green-400" />
              Informations vérifiées
            </h4>
            {provider.verified && (
              <div className="flex items-center gap-2 text-xs xs2:text-sm text-gray-300">
                <CheckCircle size={14} className="xs2:w-4 xs2:h-4 text-green-400" />
                Identité vérifiée
              </div>
            )}
            {provider.verified_phone && (
              <div className="flex items-center gap-2 text-xs xs2:text-sm text-gray-300">
                <CheckCircle size={14} className="xs2:w-4 xs2:h-4 text-green-400" />
                Numéro de téléphone vérifié
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-2 gap-2 xs2:gap-3 sm:gap-4">
            <button 
              onClick={() => {
                if (onChat && provider) {
                  onChat(provider.id, provider.name);
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 xs2:py-2.5 sm:py-3 px-3 xs2:px-4 sm:px-6 rounded-lg xs2:rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-1 xs2:gap-2 text-xs xs2:text-sm sm:text-base"
            >
              💬 Discuter
            </button>
            <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-2 xs2:py-2.5 sm:py-3 px-3 xs2:px-4 sm:px-6 rounded-lg xs2:rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-1 xs2:gap-2 text-xs xs2:text-sm sm:text-base">
              <Zap size={16} className="xs2:w-5 xs2:h-5" />
              Demander
            </button>
          </div>

          {/* Conditions de sécurité */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-lg xs2:rounded-xl p-2.5 xs2:p-3 sm:p-4 text-center text-xs xs2:text-xs2 sm:text-sm text-gray-400">
            Pour protéger vos intérêts, ne payez pas vos services en dehors du site ou de l'application Kyndex.
          </div>
        </div>
      </div>
    </div>
  );
}
