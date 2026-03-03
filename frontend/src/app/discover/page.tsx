'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Category data matching our SERVICE_DOMAINS
const CATEGORIES = [
  {
    id: 'travaux',
    name: 'Bricolage',
    description: 'Travaux & Rénovation',
    emoji: '🔨',
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-400/50'
  },
  {
    id: 'jardin',
    name: 'Jardinage',
    description: 'Espaces verts & Paysagisme',
    emoji: '🌿',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-400/50'
  },
  {
    id: 'demenagement',
    name: 'Déménagement',
    description: 'Logistique & Transport',
    emoji: '📦',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-400/50'
  },
  {
    id: 'menage',
    name: 'Ménage',
    description: 'Nettoyage & Entretien',
    emoji: '🧹',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-400/50'
  },
  {
    id: 'cuidado-enfants',
    name: 'Enfants',
    description: 'Garde & Activités',
    emoji: '👶',
    color: 'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-400/50'
  },
  {
    id: 'animaux',
    name: 'Animaux',
    description: 'Soins & Promenade',
    emoji: '🐕',
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-400/50'
  },
  {
    id: 'informatique',
    name: 'Informatique',
    description: 'Développement Web & Mobile',
    emoji: '💻',
    color: 'from-indigo-500 to-blue-500',
    borderColor: 'border-indigo-400/50'
  },
  {
    id: 'aide-domicile',
    name: 'Aide à domicile',
    description: 'Services à domicile',
    emoji: '🏠',
    color: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-400/50'
  },
  {
    id: 'coaching',
    name: 'Cours particuliers',
    description: 'Formation & Apprentissage',
    emoji: '📚',
    color: 'from-violet-500 to-purple-500',
    borderColor: 'border-violet-400/50'
  }
];

export default function DiscoverPage() {
  const router = useRouter();
  const { user, isInitialized, logout } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [raindrops, setRaindrops] = useState<Array<{ x: number; y: number; speed: number }>>([]);
  const [isAuthModal, setIsAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Initialize rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize raindrops
    const newRaindrops = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 3 + 2,
    }));
    setRaindrops(newRaindrops);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      newRaindrops.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -10;
          drop.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + 10);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    // Store selected category in localStorage for filtering
    localStorage.setItem('selected_category', categoryId);
    // Navigate to results page with category filter
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Rain Animation Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-30"
        style={{ pointerEvents: 'none' }}
      />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-purple-500/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => router.push(user ? '/dashboard' : '/')}
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 flex-shrink-0"
          >
            Kyndex
          </button>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto flex-shrink-0">
            {isInitialized && user ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 font-semibold transition whitespace-nowrap"
                >
                  ← Retour au Dashboard
                </button>
                <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-700 pl-2 sm:pl-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="text-gray-400 hover:text-red-400 font-semibold transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/onboarding')}
                  className="text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 font-semibold transition whitespace-nowrap hidden sm:block"
                >
                  Devenir prestataire
                </button>
                <button 
                  onClick={() => setIsAuthModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-1 sm:py-2 px-3 sm:px-6 rounded-lg transition text-xs sm:text-sm"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Explore les catégories
          </h1>
          <p className="text-gray-400 text-xl">
            Sélectionne une catégorie pour découvrir les meilleurs prestataires
          </p>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative backdrop-blur-md bg-black/40 border ${category.borderColor} rounded-2xl p-6 transition-all hover:scale-105 hover:bg-black/60 overflow-hidden`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-left">
                    <div className="text-5xl mb-4">{category.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className={`flex-shrink-0 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2`}>
                    <ArrowRight size={24} />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${category.color} w-0 group-hover:w-full transition-all duration-300`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="backdrop-blur-md bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tu recherches un service spécifique?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Utilise notre assistant IA pour décrire ton besoin en détail. L'IA analysera ta demande et te proposera les prestataires les plus adaptés.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Utiliser l'assistant IA
            </button>
          </div>
        </section>

        {/* Footer */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
          <div className="text-center text-gray-500">
            <p>© 2026 Kyndex. Tous les talents du Québec en un clique.</p>
          </div>
        </section>

        {/* Auth Modal */}
        {isAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full">
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-cyan-300 hover:text-cyan-200'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${
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
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition"
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
                      className="bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      className="bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Téléphone (ex: +1 514 123 4567)"
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Localisation (ex: Montréal)"
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full bg-gray-900 border border-cyan-400/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    S'inscrire
                  </button>
                </form>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsAuthModal(false)}
                className="mt-6 w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
