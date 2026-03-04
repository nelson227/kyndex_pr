'use client';

import { useState, useRef } from 'react';
import { X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/endpoints';

interface GeneratedBrief {
  title: string;
  description: string;
  requiredSkills: string;
  estimatedBudget: number;
  estimatedDuration: string;
  location?: string;
}

interface CreateServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateServiceRequestModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateServiceRequestModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'input' | 'brief' | 'publish'>('input');
  const [userDescription, setUserDescription] = useState('');
  const [brief, setBrief] = useState<GeneratedBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleGenerateBrief = async () => {
    if (!userDescription.trim()) {
      setError('Veuillez décrivez votre besoin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.GENERATE_BRIEF,
        {
          description: userDescription,
          language: 'fr',
        }
      );

      if (response.data.success && response.data.brief) {
        setBrief(response.data.brief);
        setStep('brief');
      } else {
        setError(response.data.error || 'Erreur lors de la génération du brief');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Erreur lors de la génération'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefineBrief = async () => {
    if (!feedback.trim() || !brief) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.REFINE_BRIEF,
        {
          brief,
          feedback,
          language: 'fr',
        }
      );

      if (response.data.success && response.data.brief) {
        setBrief(response.data.brief);
        setFeedback('');
      } else {
        setError(response.data.error || 'Erreur lors du raffinement');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Erreur lors du raffinement'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!brief) return;

    setLoading(true);
    setError('');

    try {
      const newRequest = {
        id: Date.now().toString(),
        title: brief.title,
        description: brief.description,
        requiredSkills: brief.requiredSkills,
        budget: brief.estimatedBudget,
        currency: 'EUR',
        location: brief.location || '',
        dueDate: new Date(
          Date.now() + parseInt(brief.estimatedDuration) * 24 * 60 * 60 * 1000
        ).toISOString(),
        createdAt: new Date().toISOString(),
        customer: {
          id: user?.id || 'unknown',
          email: user?.email || 'unknown@example.com',
          profile: {
            firstName: user?.firstName || 'User',
            lastName: user?.lastName || '',
          }
        },
        bookings: [],
        statusForProvider: 'NOUVEAU'
      };

      // Sauvegarder dans localStorage
      const existingRequests = JSON.parse(localStorage.getItem('userServiceRequests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('userServiceRequests', JSON.stringify(existingRequests));

      // Essayer aussi l'API si disponible
      try {
        await apiClient.post(
          API_ENDPOINTS.CREATE_SERVICE_REQUEST,
          {
            title: brief.title,
            description: brief.description,
            requiredSkills: brief.requiredSkills,
            budget: brief.estimatedBudget,
            currency: 'EUR',
            location: brief.location || '',
            dueDate: newRequest.dueDate,
          }
        );
      } catch (apiErr) {
        console.log('API not available, using localStorage only');
      }

      // Reset et fermer
      setStep('input');
      setUserDescription('');
      setBrief(null);
      setFeedback('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.message ||
          'Erreur lors de la publication'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs2:p-3 sm:p-4">
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg xs2:rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] xs:max-h-[90vh] overflow-hidden flex flex-col border border-cyan-900/30">
          {/* Header */}
          <div className="flex items-center justify-between p-2 xs2:p-3 sm:p-4 md:p-6 border-b border-cyan-900/20 bg-slate-900/50">
            <div className="flex items-center gap-1.5 xs2:gap-2 sm:gap-3">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
              <h2 className="text-sm xs2:text-base sm:text-lg md:text-xl font-bold text-white">
                Créer une demande
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-2 xs2:p-3 sm:p-4 md:p-6 space-y-2 xs2:space-y-3 sm:space-y-4"
          >
            {/* Step 1: User Input */}
            {step === 'input' && (
              <div className="space-y-2 xs2:space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cyan-400 mb-1.5 xs2:mb-2 sm:mb-3">
                    Décrivez votre besoin
                  </label>
                  <textarea
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Ex: Je cherche un designer pour créer une landing page SaaS..."
                    className="w-full px-2.5 xs2:px-3 sm:px-4 py-2 xs2:py-2.5 sm:py-3 bg-slate-800 border border-cyan-900/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none text-xs sm:text-sm"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-2 xs2:p-2.5 sm:p-3 text-red-300 text-xs sm:text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleGenerateBrief}
                  disabled={loading || !userDescription.trim()}
                  className="w-full py-2 xs2:py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Générer un brief avec l'IA
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Brief Review & Refinement */}
            {step === 'brief' && brief && (
              <div className="space-y-3 xs2:space-y-3.5 sm:space-y-4">
                {/* Brief Preview Card */}
                <div className="bg-slate-800/50 border border-cyan-900/30 rounded-lg p-2.5 xs2:p-3 sm:p-4 space-y-2 xs2:space-y-2.5 sm:space-y-3">
                  <div>
                    <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                      Titre
                    </label>
                    <p className="text-white font-semibold text-sm xs2:text-base">{brief.title}</p>
                  </div>

                  <div>
                    <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-gray-300 text-xs xs2:text-sm">{brief.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 xs2:gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                        Budget estimé
                      </label>
                      <p className="text-white font-semibold text-sm xs2:text-base">
                        €{brief.estimatedBudget}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                        Durée
                      </label>
                      <p className="text-white font-semibold text-sm xs2:text-base">
                        {brief.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                      Compétences requises
                    </label>
                    <div className="flex flex-wrap gap-1.5 xs2:gap-2 mt-1.5 xs2:mt-2">
                      {brief.requiredSkills.split(',').map((skill) => (
                        <span
                          key={skill.trim()}
                          className="px-2 py-0.5 xs2:py-1 bg-cyan-900/30 border border-cyan-700/50 rounded text-cyan-300 text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {brief.location && (
                    <div>
                      <label className="text-xs xs2:text-xs2 text-gray-400 uppercase tracking-wide">
                        Localisation
                      </label>
                      <p className="text-white text-xs xs2:text-sm">{brief.location}</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-2 xs2:p-2.5 sm:p-3 text-red-300 text-xs sm:text-sm">
                    ⚠️ {error}
                  </div>
                )}

                {/* Feedback Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cyan-400 mb-1.5 xs2:mb-2">
                    Qu'allez-vous changer ? (optionnel)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Ex: Augmenter le budget à 7000€, ajouter React comme skill..."
                    className="w-full px-2.5 xs2:px-3 sm:px-4 py-2 xs2:py-2.5 sm:py-3 bg-slate-800 border border-cyan-900/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none text-xs sm:text-sm"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 xs2:gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setFeedback('')}
                    className="flex-1 py-1.5 xs2:py-2 sm:py-2.5 px-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-slate-800 transition text-xs sm:text-sm"
                  >
                    Annuler
                  </button>

                  {feedback.trim() ? (
                    <button
                      onClick={handleRefineBrief}
                      disabled={loading}
                      className="flex-1 py-1.5 xs2:py-2 sm:py-2.5 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      {loading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Raffinage...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3 h-3" />
                          Raffiner
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handlePublish}
                      disabled={loading}
                      className="flex-1 py-1.5 xs2:py-2 sm:py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 transition text-xs sm:text-sm font-medium"
                    >
                      {loading ? 'Publication...' : '✓ Publier'}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setStep('input');
                    setUserDescription('');
                    setBrief(null);
                    setFeedback('');
                  }}
                  className="w-full py-1.5 xs2:py-2 sm:py-2.5 text-gray-400 hover:text-gray-300 text-xs sm:text-sm"
                >
                  ← Recommencer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateServiceRequestModal;
