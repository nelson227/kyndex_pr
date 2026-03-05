'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserMode } from '@/hooks/useUserMode';
import {
  Search,
  Filter,
  Star,
  Heart,
  MessageCircle,
  ChevronDown,
  MapPin,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    responseTime: string;
    isOnline?: boolean;
  };
  price: string;
  priceType: 'fixed' | 'hourly';
  image: string;
  badges: string[];
  description: string;
  deliveryDays: number;
  category: string;
  isFavorite: boolean;
}

export default function BrowseServices() {
  const { user, isInitialized } = useAuth();
  const { isClient } = useUserMode();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'Tous',
    'Design',
    'Développement',
    'Marketing',
    'Contenu',
    'Graphisme',
    'Video',
    'Musique',
  ];

  useEffect(() => {
    // Mock data pour les services
    setServices([
      {
        id: '1',
        title: 'Design de Logo Professionnel',
        provider: {
          name: 'Sarah Designer',
          avatar: 'S',
          rating: 4.9,
          reviews: 156,
          responseTime: '2h',
          isOnline: true,
        },
        price: '150',
        priceType: 'fixed',
        image: '🎨',
        badges: ['TL', 'Certifié'],
        description: 'Créateur de logos minimalistes et mémorables',
        deliveryDays: 5,
        category: 'Design',
        isFavorite: false,
      },
      {
        id: '2',
        title: 'Développement Site Next.js',
        provider: {
          name: 'Alex Developer',
          avatar: 'A',
          rating: 4.8,
          reviews: 203,
          responseTime: '1h',
          isOnline: true,
        },
        price: '85',
        priceType: 'hourly',
        image: '💻',
        badges: ['TL', 'Rapide'],
        description: 'Sites React/Next.js modernes et performants',
        deliveryDays: 14,
        category: 'Développement',
        isFavorite: false,
      },
      {
        id: '3',
        title: 'Stratégie Marketing Digital',
        provider: {
          name: 'Marie Marketer',
          avatar: 'M',
          rating: 4.7,
          reviews: 89,
          responseTime: '3h',
          isOnline: false,
        },
        price: '250',
        priceType: 'fixed',
        image: '📊',
        badges: ['Expert'],
        description: 'Plans marketing complets pour votre croissance',
        deliveryDays: 7,
        category: 'Marketing',
        isFavorite: false,
      },
      {
        id: '4',
        title: 'Rédaction Articles SEO',
        provider: {
          name: 'Thomas Writer',
          avatar: 'T',
          rating: 4.6,
          reviews: 234,
          responseTime: '30min',
          isOnline: true,
        },
        price: '45',
        priceType: 'hourly',
        image: '✍️',
        badges: ['TL', 'Productif'],
        description: 'Articles optimisés pour Google et conversion',
        deliveryDays: 3,
        category: 'Contenu',
        isFavorite: false,
      },
      {
        id: '5',
        title: 'Video Marketing 30s',
        provider: {
          name: 'Lisa VideoMaker',
          avatar: 'L',
          rating: 5.0,
          reviews: 127,
          responseTime: '4h',
          isOnline: true,
        },
        price: '500',
        priceType: 'fixed',
        image: '🎬',
        badges: ['Expert', 'Certifié'],
        description: 'Vidéos marketing virales et captivantes',
        deliveryDays: 10,
        category: 'Video',
        isFavorite: false,
      },
      {
        id: '6',
        title: 'Graphic Design Avancé',
        provider: {
          name: 'James Graphics',
          avatar: 'J',
          rating: 4.8,
          reviews: 145,
          responseTime: '2h',
          isOnline: false,
        },
        price: '120',
        priceType: 'hourly',
        image: '🖼️',
        badges: ['TL'],
        description: 'Design graphique pour tous vos besoins visuels',
        deliveryDays: 5,
        category: 'Graphisme',
        isFavorite: false,
      },
      {
        id: '7',
        title: 'Social Media Management',
        provider: {
          name: 'Emma Social',
          avatar: 'E',
          rating: 4.9,
          reviews: 178,
          responseTime: '1h',
          isOnline: true,
        },
        price: '800',
        priceType: 'fixed',
        image: '📱',
        badges: ['TL', 'Populaire'],
        description: 'Gestion complète de vos réseaux sociaux',
        deliveryDays: 30,
        category: 'Marketing',
        isFavorite: false,
      },
      {
        id: '8',
        title: 'Music Production & Mixing',
        provider: {
          name: 'Producer Mike',
          avatar: 'P',
          rating: 4.7,
          reviews: 98,
          responseTime: '5h',
          isOnline: true,
        },
        price: '200',
        priceType: 'hourly',
        image: '🎵',
        badges: ['Expérience'],
        description: 'Production musicale professionnelle',
        deliveryDays: 7,
        category: 'Musique',
        isFavorite: false,
      },
    ]);

    setIsLoading(false);
  }, []);

  const filteredServices = services.filter((service) => {
    // Filter by search term
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'Tous' ||
      service.category === selectedCategory;

    // Filter by price (fixed prices only for this comparison)
    const servicePrice =
      service.priceType === 'fixed' ? parseInt(service.price) : 0;
    const matchesPrice = servicePrice === 0 || servicePrice <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleToggleFavorite = (id: string) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Découvrez les Services 🔍
        </h1>
        <p className="text-gray-400">
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} trouvé
          {filteredServices.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un service ou un prestataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-950/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition"
        >
          <Filter className="w-4 h-4" />
          Filtres
          <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-950/50 border border-cyan-500/20 rounded-xl">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-bold text-white mb-3">Catégories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'Tous' ? null : cat)}
                    className={`px-3 py-2 rounded-lg font-medium transition ${
                      (selectedCategory === null && cat === 'Tous') ||
                      selectedCategory === cat
                        ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                        : 'bg-gray-900/50 text-gray-300 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <p className="text-sm font-bold text-white mb-3">
                Budget max: {priceRange}€
              </p>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                <span>0€</span>
                <span>5000€</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition"
            >
              {/* Service Image */}
              <div className="relative w-full h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-6xl border-b border-cyan-500/20 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition">
                {service.image}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(service.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-lg transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      service.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>

                {/* Badges */}
                {service.badges.length > 0 && (
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {service.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/50"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <p className="text-xs text-cyan-400 font-semibold mb-2">
                  {service.category}
                </p>

                {/* Title */}
                <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {service.description}
                </p>

                {/* Provider Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {service.provider.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {service.provider.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-bold text-white">
                        {service.provider.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({service.provider.reviews})
                      </span>
                    </div>
                  </div>
                  {service.provider.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>

                {/* Price & Delivery */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-cyan-400">{service.price}€</p>
                    <p className="text-xs text-gray-500">
                      {service.priceType === 'fixed' ? 'Fixe' : 'Par heure'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p className="font-medium">{service.deliveryDays}j</p>
                    <p>Livraison</p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30">
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400 mb-4">Aucun service ne correspond à vos critères</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
              setPriceRange(5000);
            }}
            className="inline-flex px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-xl transition border border-cyan-500/30"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
