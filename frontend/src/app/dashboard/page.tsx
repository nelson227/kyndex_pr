'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import ProviderProfileModal from '@/components/ProviderProfileModal';
import ServiceRequestsListModal from '@/components/ServiceRequestsListModal';
import { CreateServiceRequestModal } from '@/components/CreateServiceRequestModal';
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';

// Mock data pour les stats du dashboard
const getStatsCards = (unreadMessages: number, calendarNotes: number): any[] => [
  {
    id: 1,
    title: 'Nouvelles demandes',
    count: 0,
    description: 'Demandes non vues',
    badge: 'À traiter',
    badgeColor: 'red'
  },
  {
    id: 2,
    title: 'Missions en cours',
    count: 0,
    description: 'Livrables & échanges en cours',
    badge: 'Actives',
    badgeColor: 'cyan'
  },
  {
    id: 3,
    title: 'Messages non lus',
    count: unreadMessages,
    description: 'Conversations à relancer',
    badge: 'Urgent',
    badgeColor: 'red'
  },
  {
    id: 4,
    title: 'Cette semaine',
    count: calendarNotes,
    description: 'Événements planifiés',
    badge: 'Calendrier',
    badgeColor: 'cyan'
  }
];

// Mock data pour prestataires (qui vont défiler)
const MOCK_FREELANCERS = [
  {
    id: 1,
    name: 'Guylain',
    category: 'Bricoleur',
    price: '18',
    rating: 4.83,
    reviews: 847,
    tags: ['Rapide', 'Discret'],
    isTop: true,
    emoji: '🔨',
    experience: '8 à 10 ans d\'expérience',
    about: 'Bonjour, je suis une personne sérieuse, motivée et ponctuelle. Je réalise tous types de petits travaux. Je suis très réactif et disponible rapidement.',
    commitments: ['Travail soigné', 'Résultat impeccable', 'Résultat garanti'],
    equipment: ['Marteau', 'Tournevis', 'Niveau', 'Clés'],
    zone: '20 km autour de Créteil (94000)',
    city: 'Créteil',
    verified: true,
    verified_phone: true,
    evaluations: 847,
    note: 4.83,
    workPhotos: ['Etagère murale fixée', 'Cadre accroché au mur', 'Tableau installé', 'Étagere de rangement'],
    clientReviews: [
      {
        id: 1,
        author: 'Sophie',
        avatar: 'S',
        city: 'Créteil (94000)',
        rating: 5,
        date: 'il y a 4 jours',
        comment: 'Guylain est très gentil, ponctuel et professionnel. Il a accroché ma TV au mur impeccablement. Je recommande sans hésiter !',
        service: 'Accrochage de TV'
      },
      {
        id: 2,
        author: 'Mohamed',
        avatar: 'M',
        city: 'Paris (75012)',
        rating: 5,
        date: 'il y a 4 jours',
        comment: 'Prestation impeccable, travail propre. Je ferais appel à lui sans hésiter pour mes prochaines réparations.',
        service: 'Assemblage de meubles'
      },
      {
        id: 3,
        author: 'Raphaë',
        avatar: 'R',
        city: 'Saint-Maur-des-Fossés (94000)',
        rating: 5,
        date: 'il y a 10 jours',
        comment: 'Super efficace ! Travail impeccable et rapport qualité-prix imbattable. À recommander.',
        service: 'Assemblage de meubles'
      }
    ]
  },
  {
    id: 2,
    name: 'Aissa',
    category: 'Bricoleur',
    price: '21',
    rating: 4.96,
    reviews: 562,
    tags: ['Soigné', 'Réactif'],
    isTop: true,
    emoji: '🔧',
    experience: '10+ ans d\'expérience',
    about: 'Expert en bricolage avec une passion pour la qualité. Je prends soin de chaque détail et assure une satisfaction client à 100%.',
    commitments: ['Travail soigné', 'Ponctuellement', 'Transparent'],
    equipment: ['Tournevis électrique', 'Perceuse', 'Scie', 'Serre-joints'],
    zone: '15 km autour de Paris (75000)',
    city: 'Paris',
    verified: true,
    verified_phone: true,
    evaluations: 562,
    note: 4.96,
    workPhotos: ['Étagère en bois installée', 'Porte réparée', 'Applique murale fixée', 'Plan de travail renforcé'],
    clientReviews: [
      {
        id: 1,
        author: 'Jean',
        avatar: 'J',
        city: 'Paris (75010)',
        rating: 5,
        date: 'il y a 2 jours',
        comment: 'Aissa est un vrai professionnel. Son travail est soigné et il respecte les délais. Équipe très réactive !',
        service: 'Pose de domotique'
      },
      {
        id: 2,
        author: 'Marianne',
        avatar: 'M',
        city: 'Boulogne-Billancourt (92100)',
        rating: 5,
        date: 'il y a 1 semaine',
        comment: 'Parfait ! Aissa a fait un travail excellent. Son savoir-faire est impressionnant.',
        service: 'Rénovation électrique'
      },
      {
        id: 3,
        author: 'Thomas',
        avatar: 'T',
        city: 'Neuilly-sur-Seine (92200)',
        rating: 5,
        date: 'il y a 10 jours',
        comment: 'Très satisfait de son travail. Je le recommande chaleureusement pour tous les travaux de bricolage.',
        service: 'Assemblage de meubles'
      }
    ]
  },
  {
    id: 3,
    name: 'Jean',
    category: 'Bricoleur',
    price: '20',
    rating: 4.85,
    reviews: 930,
    tags: ['Fiable', 'Rapide'],
    isTop: false,
    emoji: '🔨',
    experience: '5 à 10 ans d\'expérience',
    about: 'Spécialiste en travaux de maintenance et rénovation. Fiable et rapide, vous pouvez me faire confiance pour tous vos petits travaux.',
    commitments: ['Rapidité', 'Fiabilité', 'Tarifs justes'],
    equipment: ['Toolbox complet', 'Perceuse sans fil', 'Oscilloscope'],
    zone: '25 km autour de Lyon (69000)',
    city: 'Lyon',
    verified: true,
    verified_phone: true,
    evaluations: 930,
    note: 4.85,
    workPhotos: ['Tableau électrique réparé', 'Prises installées', 'Interrupteur changé', 'Chemin de câbles installé'],
    clientReviews: [
      {
        id: 1,
        author: 'Claudette',
        avatar: 'C',
        city: 'Lyon (69000)',
        rating: 5,
        date: 'il y a 3 jours',
        comment: 'Jean est rapide et efficace. Mon problème a été réglé en moins d\'une heure !',
        service: 'Installation électrique'
      },
      {
        id: 2,
        author: 'André',
        avatar: 'A',
        city: 'Villeurbanne (69100)',
        rating: 4,
        date: 'il y a 1 semaine',
        comment: 'Très compétent. Bon travail et prix raisonnable. Je refais appel à lui.',
        service: 'Réparation de luminaire'
      },
      {
        id: 3,
        author: 'Isabelle',
        avatar: 'I',
        city: 'Décines-Charpieu (69150)',
        rating: 5,
        date: 'il y a 15 jours',
        comment: 'Excellent ! Jean a remplacé tous les luminaires de ma maison. Travail propre et professionnel.',
        service: 'Changement de luminaires'
      }
    ]
  },
  {
    id: 4,
    name: 'Marie',
    category: 'Ménage',
    price: '22',
    rating: 4.92,
    reviews: 741,
    tags: ['Organisée', 'Courtoise'],
    isTop: true,
    emoji: '🧹',
    experience: '7 ans d\'expérience',
    about: 'Service de nettoyage professionnel et conscient. J\'apporte soin et attention à chaque coin de votre maison.',
    commitments: ['Qualité premium', 'Résultat irréprochable', 'Discrétion'],
    equipment: ['Aspirateur HEPA', 'Nettoyeur vapeur', 'Produits écologiques'],
    zone: '20 km autour de Marseille (13000)',
    city: 'Marseille',
    verified: true,
    verified_phone: true,
    evaluations: 741,
    note: 4.92,
    workPhotos: ['Salon nettoyé', 'Cuisine impeccable', 'Salle de bain brillante', 'Chambre époussetée'],
    clientReviews: [
      {
        id: 1,
        author: 'Valérie',
        avatar: 'V',
        city: 'Marseille (13000)',
        rating: 5,
        date: 'il y a 5 jours',
        comment: 'Marie est très rigoureuse et discrète. Mon appartement brille comme neuf !',
        service: 'Nettoyage complet'
      },
      {
        id: 2,
        author: 'François',
        avatar: 'F',
        city: 'Aix-en-Provence (13000)',
        rating: 5,
        date: 'il y a 2 semaines',
        comment: 'Très satisfait. Marie est fiable, ponctuelle et son travail est impeccable.',
        service: 'Nettoyage maison fermée'
      },
      {
        id: 3,
        author: 'Carole',
        avatar: 'C',
        city: 'La Ciotat (13600)',
        rating: 5,
        date: 'il y a 3 semaines',
        comment: 'Excellente ! Je recommande Marie chaleureusement pour tous les travaux de nettoyage.',
        service: 'Nettoyage post-rénovation'
      }
    ]
  },
  {
    id: 5,
    name: 'Sophie',
    category: 'Jardinière',
    price: '19',
    rating: 4.78,
    reviews: 612,
    tags: ['Créative', 'Efficace'],
    isTop: false,
    emoji: '🌿',
    experience: '6 ans d\'expérience',
    about: 'Paysagiste créative avec une approche écologique. Je transforme vos espaces verts en oasis de sérénité.',
    commitments: ['Design innovant', 'Durabilité', 'Respect de l\'environnement'],
    equipment: ['Tondeuse', 'Taille-haie', 'Binette', 'Arroseurs intelligents'],
    zone: '30 km autour de Bordeaux (33000)',
    city: 'Bordeaux',
    verified: true,
    verified_phone: false,
    evaluations: 612,
    note: 4.78,
    clientReviews: [
      {
        id: 1,
        author: 'Michèle',
        avatar: 'M',
        city: 'Bordeaux (33000)',
        rating: 5,
        date: 'il y a 1 semaine',
        comment: 'Sophie a transformé mon jardin ! Elle est créative et donne d\'excellents conseils en jardinage.',
        service: 'Aménagement jardin'
      },
      {
        id: 2,
        author: 'Olivier',
        avatar: 'O',
        city: 'Talence (33400)',
        rating: 4,
        date: 'il y a 2 semaines',
        comment: 'Très bonne expérience. Sophie est professionnelle et ses idées sont géniales.',
        service: 'Taille et élagage'
      },
      {
        id: 3,
        author: 'Béatrice',
        avatar: 'B',
        city: 'Villenave-d\'Ornon (33140)',
        rating: 5,
        date: 'il y a 1 mois',
        comment: 'Parfait ! Sophie a créé un vrai paradis dans mon jardin. À recommander vivement !',
        service: 'Création de massifs'
      }
    ]
  },
  {
    id: 6,
    name: 'Paul',
    category: 'Électricien',
    price: '25',
    rating: 4.91,
    reviews: 523,
    tags: ['Certifié', 'Discret'],
    isTop: true,
    emoji: '⚡',
    experience: '12+ ans d\'expérience',
    about: 'Électricien certifié et agréé. Tous les travaux d\'électricité générale et domotique. Sécurité garantie.',
    commitments: ['Normes respectées', 'Sécurité', 'Devis gratuit'],
    equipment: ['Multimètre', 'Détecteur de tension', 'Outil de crimpage', 'Testeur de circuit'],
    zone: '25 km autour de Toulouse (31000)',
    city: 'Toulouse',
    verified: true,
    verified_phone: true,
    evaluations: 523,
    note: 4.91,
    workPhotos: ['Tableau électrique remis aux normes', 'Installation domotique', 'Prises USB intégrées', 'Interphone installé'],
    clientReviews: [
      {
        id: 1,
        author: 'Laurent',
        avatar: 'L',
        city: 'Toulouse (31000)',
        rating: 5,
        date: 'il y a 3 jours',
        comment: 'Paul est un vrai pro. Très compétent, sérieux et transparent sur les devis. Je le recommande fortement !',
        service: 'Mise aux normes électrique'
      },
      {
        id: 2,
        author: 'Hélène',
        avatar: 'H',
        city: 'Blagnac (31700)',
        rating: 5,
        date: 'il y a 1 semaine',
        comment: 'Excellent ! Paul a installé ma domotique avec une grande expertise. Travail impeccable.',
        service: 'Installation domotique'
      },
      {
        id: 3,
        author: 'Gérard',
        avatar: 'G',
        city: 'Colomiers (31770)',
        rating: 5,
        date: 'il y a 2 semaines',
        comment: 'Super ! Paul est professionnel, courtois et fait un travail de haute qualité. À recommander.',
        service: 'Extension électrique'
      }
    ]
  },
];

// Mock data pour "Aperçu rapide"
const QUICK_OVERVIEW = [
  {
    type: 'Demande',
    title: 'Landing page SaaS + copy',
    status: 'Nouveau',
    date: 'il y a 23 min',
    statusColor: 'red'
  },
  {
    type: 'Mission',
    title: 'Design system (Figma)',
    status: 'En cours',
    date: 'il y a 1 h',
    statusColor: 'cyan'
  },
  {
    type: 'Message',
    title: 'De: Studio M. — Questions livrables',
    status: 'Non lu',
    date: 'il y a 9 min',
    statusColor: 'red'
  },
  {
    type: 'Calendrier',
    title: 'Call de cadrage — 30 min',
    status: 'Cette semaine',
    date: 'il y a 10 h',
    statusColor: 'green'
  },
  {
    type: 'Demande',
    title: 'Montage vidéo UGC (3 versions)',
    status: 'À valider',
    date: 'il y a 3 h',
    statusColor: 'cyan'
  }
];

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [shuffledFreelancers, setShuffledFreelancers] = useState<typeof MOCK_FREELANCERS>([]);
  const [statsCards, setStatsCards] = useState<any[]>([]);
  const { unreadMessages, calendarNotes } = useUnreadCount(user?.id);
  const [selectedProvider, setSelectedProvider] = useState<typeof MOCK_FREELANCERS[0] | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isServiceRequestsModalOpen, setIsServiceRequestsModalOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);

  useEffect(() => {
    // Mélanger les prestataires et en prendre une sélection
    const shuffled = [...MOCK_FREELANCERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    setShuffledFreelancers(shuffled);

    // Vérifier s'il y a un prestataire en attente de contact
    const pendingProvider = localStorage.getItem('pendingProviderContact');
    if (pendingProvider) {
      try {
        const provider = JSON.parse(pendingProvider);
        // Chercher le prestataire dans les futures données ou utiliser les données mockées
        // Pour l'instant, créer une entrée avec les données sauvegardées
        const providerData = {
          id: provider.id,
          name: provider.name,
          category: provider.category,
          price: provider.price,
          rating: provider.rating,
          reviews: provider.reviewCount,
          tags: [],
          isTop: false,
          emoji: '⭐',
          experience: '5 ans d\'expérience',
          about: provider.description,
          commitments: ['Créatif', 'Efficace', 'Fiable'],
          equipment: ['Tondeuse', 'Taille-haie', 'Binette'],
          zone: '30 km autour de Paris',
          city: 'Paris', // Utiliser une ville valide
          verified: true,
          verified_phone: true,
          evaluations: provider.reviewCount,
          note: provider.rating,
          workPhotos: [],
          clientReviews: []
        };
        setSelectedProvider(providerData);
        setIsProfileModalOpen(true);
        // Nettoyer après l'utilisation
        localStorage.removeItem('pendingProviderContact');
      } catch (error) {
        console.error('Erreur lors du chargement du prestataire en attente:', error);
      }
    }
  }, []);

  // Mettre à jour les stats cards quand les compteurs changent
  useEffect(() => {
    setStatsCards(getStatsCards(unreadMessages, calendarNotes));
  }, [unreadMessages, calendarNotes]);

  const handleViewProfile = (provider: typeof MOCK_FREELANCERS[0]) => {
    setSelectedProvider(provider);
    setIsProfileModalOpen(true);
  };

  const handleChatWithProvider = (providerId: number, providerName: string) => {
    // Sauvegarder les infos de la conversation
    const conversationData = {
      providerId,
      providerName,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('activeConversation', JSON.stringify(conversationData));
    
    // Fermer le modal et rediriger
    setIsProfileModalOpen(false);
    router.push('/dashboard/messages');
  };

  const handleViewAllProviders = () => {
    localStorage.setItem('selected_category', 'all');
    router.push('/discover');
  };

  return (
    <div className="space-y-3 xs2:space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header - Bienvenue avec Photo de Profil */}
      <div className="px-2 xs2:px-3 sm:px-4 md:px-0">
        <div className="flex items-start justify-between gap-3 xs2:gap-4">
          <div className="flex-1">
            <p className="text-gray-400 text-xs md:text-sm mb-0.5 xs2:mb-1">Bienvenue</p>
            <h1 className="text-lg xs2:text-xl sm:text-2xl md:text-4xl font-bold text-white">Acceuil</h1>
            <p className="text-gray-400 text-xs xs2:text-xs2 sm:text-sm md:text-base mt-1 xs2:mt-1.5 sm:mt-2">Suivez l'activité, vos missions et vos échanges en un coup d'oeil.</p>
          </div>
          
          {/* Photo de Profil */}
          <div className="flex-shrink-0 pt-1">
            <ProfilePhotoUpload size="sm" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-2 xs2:px-3 sm:px-4 md:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 xs2:gap-2 sm:gap-3 md:gap-4">
          {statsCards.map((card) => (
            <div
              key={card.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-2 xs2:p-2.5 sm:p-4 md:p-6 hover:border-cyan-500/30 transition cursor-pointer group"
            >
              <div className="flex flex-col items-start justify-between gap-1.5 xs2:gap-2 sm:gap-3 md:gap-4">
                <div className="w-full">
                  <p className="text-gray-400 text-xs xs2:text-xs2 sm:text-sm md:text-base font-medium truncate">{card.title}</p>
                  {card.count > 0 && (
                    <h3 className="text-lg xs2:text-xl sm:text-2xl md:text-4xl font-bold text-white mt-1 xs2:mt-1.5 sm:mt-2">{card.count}</h3>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 xs2:px-2.5 py-0.5 xs2:py-1 rounded-full ${
                  card.badgeColor === 'red' ? 'bg-red-500/20 text-red-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {card.badge}
                </span>
              </div>
              <p className="text-gray-400 text-xs xs2:text-xs2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations - Prestataires qui défilent */}
      <div className="px-2 xs2:px-3 sm:px-4 md:px-0">
        <h2 className="text-sm xs2:text-base sm:text-lg md:text-xl font-bold text-white mb-2 xs2:mb-2.5 sm:mb-4">Recommandations</h2>
        
        {/* Conteneur avec animation de scroll continu */}
        <style>{`
          @keyframes scroll-continuous {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .carousel-scroll {
            animation: scroll-continuous 30s linear infinite;
          }
          
          .carousel-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="overflow-hidden relative">
          <div
            className="flex gap-1.5 xs2:gap-2 sm:gap-3 md:gap-4 carousel-scroll"
            style={{ width: 'fit-content' }}
          >
            {/* Afficher les profils 2 fois pour l'effet de boucle infinie */}
            {[...shuffledFreelancers, ...shuffledFreelancers].map((freelancer, idx) => (
              <div
                key={`${freelancer.id}-${idx}`}
                className="flex-shrink-0 w-36 xs2:w-44 sm:w-56 md:w-80 bg-gray-900 border border-gray-800 rounded-lg sm:rounded-xl overflow-hidden hover:border-cyan-500/50 transition cursor-pointer group"
              >
                {/* Avatar Area */}
                <div className="h-20 xs2:h-24 sm:h-28 md:h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl xs2:text-2xl sm:text-4xl md:text-6xl relative">
                  {freelancer.emoji}
                  {freelancer.isTop && (
                    <div className="absolute top-1 xs2:top-1.5 sm:top-2 md:top-3 right-1 xs2:right-1.5 sm:right-2 md:right-3 bg-yellow-500 text-black px-1 xs2:px-1.5 sm:px-2 py-0.5 rounded text-xs font-bold">
                      🏆 Top
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 xs2:p-2.5 sm:p-3 md:p-4">
                  <h3 className="text-white font-bold text-xs xs2:text-sm sm:text-base md:text-lg">{freelancer.name}</h3>
                  <p className="text-gray-400 text-xs xs2:text-xs2 sm:text-sm">{freelancer.category}</p>
                  <p className="text-cyan-400 font-semibold mt-1 xs2:mt-1.5 sm:mt-2 text-xs xs2:text-xs2 sm:text-sm">{freelancer.price} $/h</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 xs2:mt-1.5 sm:mt-2 mb-1.5 sm:mb-2 text-xs xs2:text-xs2 sm:text-sm">
                    <span className="text-yellow-400">⭐{freelancer.rating.toFixed(2)}</span>
                    <span className="text-gray-500 text-xs">({freelancer.reviews})</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-0.5 xs2:gap-1 mb-2">
                    {freelancer.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded-full"
                      >
                        • {tag}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => handleViewProfile(freelancer)}
                    className="w-full py-1 xs2:py-1.5 sm:py-2 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition text-xs sm:text-sm"
                  >
                    Voir le profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voir tous les prestataires */}
      <div className="text-center px-2 xs2:px-3 sm:px-4 md:px-0">
        <button
          onClick={handleViewAllProviders}
          className="px-3 xs2:px-4 sm:px-6 md:px-8 py-2 xs2:py-2.5 sm:py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition text-xs sm:text-sm md:text-base"
        >
          Voir tous les prestataires
        </button>
      </div>

      {/* Quick Access Buttons */}
      <div className="px-2 xs2:px-3 sm:px-4 md:px-0">
        <div className="flex gap-1 xs2:gap-1.5 sm:gap-2 justify-center flex-wrap">
          <button 
            onClick={() => setIsCreateRequestModalOpen(true)}
            className="px-2 xs2:px-3 sm:px-4 md:px-6 py-1.5 xs2:py-1.75 sm:py-2 md:py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition text-xs sm:text-sm md:text-base font-semibold flex items-center gap-1 xs2:gap-1.5 whitespace-nowrap"
          >
            <span className="hidden xs:inline">📝</span> 
            <span className="hidden sm:inline">Créer une demande</span>
            <span className="inline sm:hidden">Créer</span>
          </button>
          <button 
            onClick={() => setIsServiceRequestsModalOpen(true)}
            className="px-2 xs2:px-3 sm:px-4 md:px-6 py-1.5 xs2:py-1.75 sm:py-2 md:py-2.5 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap"
          >
            <span className="hidden sm:inline">Voir demandes</span>
            <span className="inline sm:hidden">Demandes</span>
          </button>
          <button className="px-2 xs2:px-3 sm:px-4 md:px-6 py-1.5 xs2:py-1.75 sm:py-2 md:py-2.5 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
            <span className="hidden sm:inline">Voir missions</span>
            <span className="inline sm:hidden">Missions</span>
          </button>
          <button className="px-2 xs2:px-3 sm:px-4 md:px-6 py-1.5 xs2:py-1.75 sm:py-2 md:py-2.5 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
            <span className="hidden sm:inline">Voir messagerie</span>
            <span className="inline sm:hidden">Messages</span>
          </button>
          <button className="px-2 xs2:px-3 sm:px-4 md:px-6 py-1.5 xs2:py-1.75 sm:py-2 md:py-2.5 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
            <span className="hidden sm:inline">Voir calendrier</span>
            <span className="inline sm:hidden">Calendrier</span>
          </button>
        </div>
      </div>

      {/* Aperçu rapide */}
      <div className="px-2 xs2:px-3 sm:px-4 md:px-0">
        <h2 className="text-sm xs2:text-base sm:text-lg md:text-xl font-bold text-white mb-2 xs2:mb-2.5 sm:mb-4">Aperçu rapide</h2>
        <div className="border border-gray-800 rounded-lg sm:rounded-xl overflow-x-auto">
          <table className="w-full min-w-max sm:min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-400 font-semibold text-xs sm:text-sm">Type</th>
                <th className="text-left px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-400 font-semibold text-xs sm:text-sm">Titre</th>
                <th className="text-left px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-400 font-semibold text-xs sm:text-sm">Statut</th>
                <th className="text-left px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-400 font-semibold text-xs sm:text-sm hidden sm:table-cell">Mis à jour</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_OVERVIEW.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-800 hover:bg-gray-900/50 transition cursor-pointer"
                >
                  <td className="px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-white font-semibold text-xs sm:text-sm">{item.type}</td>
                  <td className="px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-300 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2">{item.title}</td>
                  <td className="px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3">
                    <span className={`text-xs font-bold px-1.5 xs2:px-2 sm:px-3 py-0.5 sm:py-1 rounded-full inline-block ${
                      item.statusColor === 'red' ? 'bg-red-500/20 text-red-400' :
                      item.statusColor === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      🔴 {item.status}
                    </span>
                  </td>
                  <td className="px-2 xs2:px-3 sm:px-4 md:px-6 py-2 xs2:py-2.5 sm:py-3 text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Profile Modal */}
      <ProviderProfileModal 
        provider={selectedProvider}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onChat={handleChatWithProvider}
      />

      {/* Service Requests Modal */}
      <ServiceRequestsListModal 
        isOpen={isServiceRequestsModalOpen}
        onClose={() => setIsServiceRequestsModalOpen(false)}
      />

      {/* Create Service Request Modal */}
      <CreateServiceRequestModal 
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
        onSuccess={() => {
          // Juste fermer le modal, ne pas ouvrir le list modal
          setIsCreateRequestModalOpen(false);
        }}
      />
    </div>
  );
}
