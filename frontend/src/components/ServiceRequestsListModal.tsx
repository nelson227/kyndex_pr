'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/hooks/useAuth';
import ServiceRequestDetailsModal from './ServiceRequestDetailsModal';

interface ServiceRequest {
  id: string;
  title: string;
  description?: string;
  budget?: number;
  currency: string;
  location?: string;
  dueDate?: string;
  createdAt: string;
  customer: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      city?: string;
    };
  };
  bookings: any[];
  statusForProvider: 'NOUVEAU' | 'A_VALIDER' | 'EN_ATTENTE';
}

interface ServiceRequestsListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NOUVEAU':
      return 'bg-red-500/20 text-red-400 border border-red-500/50';
    case 'A_VALIDER':
      return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50';
    case 'EN_ATTENTE':
      return 'bg-green-500/20 text-green-400 border border-green-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'NOUVEAU':
      return 'Nouveau';
    case 'A_VALIDER':
      return 'À valider';
    case 'EN_ATTENTE':
      return 'En attente';
    default:
      return status;
  }
};

const ServiceRequestsListModal: React.FC<ServiceRequestsListModalProps> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const router = useRouter();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isOpen && user && !hasLoadedRef.current) {
      console.log('ServiceRequestsListModal: Opening modal, loading requests...');
      hasLoadedRef.current = true;
      loadRequests();
    } else if (!isOpen) {
      hasLoadedRef.current = false;
    }
  }, [isOpen, user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        console.log('ServiceRequestsListModal: No user, skipping load');
        setRequests([]);
        return;
      }

      console.log('ServiceRequestsListModal: Fetching requests from API...');
      console.log('API Endpoint:', API_ENDPOINTS.GET_SERVICE_REQUESTS);
      
      // Charger depuis localStorage d'abord
      const localRequests = JSON.parse(localStorage.getItem('userServiceRequests') || '[]');
      
      try {
        const response = await apiClient.get(API_ENDPOINTS.GET_SERVICE_REQUESTS);
        
        console.log('ServiceRequestsListModal: API Response received:', response.status);
        
        if (Array.isArray(response.data)) {
          console.log('ServiceRequestsListModal: Found', response.data.length, 'requests from API');
          setRequests([...localRequests, ...response.data]);
        } else {
          setRequests(localRequests);
        }
      } catch (apiError) {
        console.log('ServiceRequestsListModal: API error, using localStorage only');
        setRequests(localRequests);
      }
    } catch (error: any) {
      console.error('ServiceRequestsListModal: Error loading requests:', error);
      
      // Toujours afficher les demandes locales en cas d'erreur
      const localRequests = JSON.parse(localStorage.getItem('userServiceRequests') || '[]');
      setRequests(localRequests);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getCustomerName = (customer: any) => {
    if (customer.profile?.firstName || customer.profile?.lastName) {
      return `${customer.profile.firstName || ''} ${customer.profile.lastName || ''}`.trim();
    }
    return customer.email.split('@')[0];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs2:p-3 sm:p-4">
        <div className="bg-slate-900 rounded-lg xs2:rounded-xl sm:rounded-lg max-w-2xl w-full max-h-[95vh] xs:max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] flex flex-col border border-cyan-500/30">
          {/* Header */}
          <div className="flex items-center justify-between p-2 xs2:p-3 sm:p-4 md:p-6 border-b border-cyan-500/20">
            <h2 className="text-sm xs2:text-base sm:text-lg md:text-xl font-bold text-white">Demandes de service</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors flex-shrink-0"
            >
              <X size={18} className="xs2:w-5 xs2:h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-xs sm:text-sm">Chargement des demandes...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full p-3 xs2:p-4 sm:p-6">
                <div className="text-center text-gray-400 bg-red-500/10 border border-red-500/30 rounded p-3">
                  <p className="text-red-400 font-semibold text-xs sm:text-sm">Erreur: {error}</p>
                  <p className="text-xs mt-1 xs2:mt-2">Vérifiez la console pour plus de détails</p>
                </div>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <p className="text-xs sm:text-base">Aucune demande de service disponible</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 xs2:space-y-2.5 sm:space-y-3 p-2 xs2:p-3 sm:p-4 md:p-6">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleRequestClick(request)}
                    className="w-full text-left p-2 xs2:p-2.5 sm:p-3 md:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all group text-xs sm:text-sm"
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 xs2:gap-2 sm:gap-3 mb-1 xs2:mb-1.5 sm:mb-2">
                          <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors text-xs sm:text-base">
                            {request.title}
                          </h3>
                          <span
                            className={`px-1.5 xs2:px-2 py-0.5 sm:py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(
                              request.statusForProvider
                            )}`}
                          >
                            {getStatusLabel(request.statusForProvider)}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-1.5 xs2:mb-2">
                          {request.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 xs2:gap-2 sm:gap-3 text-xs sm:text-sm">
                          {request.location && (
                            <div className="flex items-center gap-0.5 xs2:gap-1 text-gray-400">
                              <MapPin size={11} className="xs2:w-3 xs2:h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">{request.location}</span>
                            </div>
                          )}

                          {request.budget && (
                            <div className="flex items-center gap-0.5 xs2:gap-1 text-gray-400">
                              <DollarSign size={11} className="xs2:w-3 xs2:h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">
                                {request.budget} {request.currency}
                              </span>
                            </div>
                          )}

                          {request.dueDate && (
                            <div className="flex items-center gap-0.5 xs2:gap-1 text-gray-400">
                              <Clock size={11} className="xs2:w-3 xs2:h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">Avant le {formatDate(request.dueDate)}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-1 xs2:mt-1.5 text-xs text-gray-500">
                          Demandeur: {getCustomerName(request.customer)}
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        className="xs2:w-5 xs2:h-5 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <ServiceRequestDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onSuccess={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
            loadRequests();
          }}
        />
      )}
    </>
  );
};

export default ServiceRequestsListModal;
