'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Sparkles, X, Eye, EyeOff } from 'lucide-react';
import { getUserStorage, setUserStorage } from '@/lib/user-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { createApiClient } from '@/lib/api-client';
import dynamic from 'next/dynamic';

/**
 * Gère le sessionId pour les utilisateurs non connectés
 * Génère un ID temporaire pour isoler les données entre sessions
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('kyndex_sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('kyndex_sessionId', sessionId);
  }
  return sessionId;
};

/**
 * Sauvegarde les données de demande (brief, services, need)
 * Utilise userId si connecté, sinon sessionId temporaire
 */
const saveDraftData = (dataKey: string, data: any): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Essayer de sauvegarder avec userId (utilisateur connecté)
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      const user = JSON.parse(kyndexUser);
      const userId = user.id?.toString() || user.email;
      return setUserStorage(dataKey, data, userId);
    }

    // Fallback: utiliser sessionId pour utilisateurs non connectés
    const sessionId = getSessionId();
    const storageKey = `session_${sessionId}_${dataKey}`;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`✓ Saved draft data with sessionId: ${sessionId}`);
    return true;
  } catch (e) {
    console.error('Failed to save draft data', e);
    return false;
  }
};

/**
 * Charge les données de demande
 * Cherche d'abord avec userId, puis avec sessionId
 */
const loadDraftData = (dataKey: string): any => {
  if (typeof window === 'undefined') return null;

  try {
    // Essayer de charger avec userId (utilisateur connecté)
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      const user = JSON.parse(kyndexUser);
      const userId = user.id?.toString() || user.email;
      const data = getUserStorage(dataKey, userId);
      if (data) {
        console.log(`✓ Loaded draft data with userId: ${userId}`);
        return data;
      }
    }

    // Fallback: charger depuis sessionId
    const sessionId = sessionStorage.getItem('kyndex_sessionId');
    if (sessionId) {
      const storageKey = `session_${sessionId}_${dataKey}`;
      const data = sessionStorage.getItem(storageKey);
      if (data) {
        console.log(`✓ Loaded draft data with sessionId: ${sessionId}`);
        return JSON.parse(data);
      }
    }

    return null;
  } catch (e) {
    console.error('Failed to load draft data', e);
    return null;
  }
};

// ============================================================
// ADVANCED AI ENGINE WITH SEMANTIC UNDERSTANDING
// ============================================================

interface ServiceDomain {
  name: string;
  keywords: string[];
  services: string[];
  description: string;
}

// Comprehensive Service Domains Database
const SERVICE_DOMAINS: ServiceDomain[] = [
  {
    name: 'Travaux & Rénovation',
    keywords: [
      'plombarie', 'plomb', 'électricité', 'électrique', 'peintur',
      'renov', 'construir', 'carrel', 'parquet', 'toitur', 'fenêtr',
      'menuiser', 'menuiserie', 'maçon', 'isolation', 'chauffag',
      'climatisation', 'salle de bain', 'cuisine', 'sol', 'mur',
      'portes', 'escalier', 'balcon', 'terrasse', 'façade',
      'gouttière', 'charpente', 'serrurerie', 'vitrerie',
      'joint', 'ciment', 'béton', 'pierre', 'brique', 'carrelage'
    ],
    services: [
      'Plomberie',
      'Électricité',
      'Peinture & Décoration',
      'Menuiserie',
      'Carrelage',
      'Chauffage & Climatisation',
      'Isolation thermique',
      'Rénovation générale',
      'Maçonnerie',
      'Serrurerie',
      'Couverture & Toiture',
      'Vitrerie'
    ],
    description: 'Services de construction, rénovation et travaux'
  },
  {
    name: 'Design & Créativité',
    keywords: [
      'design', 'branding', 'logo', 'creatif', 'créatif', 'mock',
      'ui', 'ux', 'interface', 'visuel', 'identit', 'couleur',
      'typograph', 'landing page', 'website', 'site web',
      'graphique', 'illustration', 'motion', 'animation',
      'bannière', 'flyer', 'affiche', 'packaging', 'lookbook',
      'infographie', 'webdesign', 'appdesign', 'wireframe',
      'prototype', 'photomontage', 'retouche', 'composition'
    ],
    services: [
      'Design UI/UX',
      'Branding & Identité visuelle',
      'Création Logo',
      'Design graphique',
      'Web Design',
      'Illustration',
      'Motion Design',
      'Design System',
      'Packaging',
      'Affiche & Flyer',
      'Infographie'
    ],
    description: 'Design visuel et créatif'
  },
  {
    name: 'Développement Web & Mobile',
    keywords: [
      'développ', 'dev', 'code', 'coding', 'projet', 'app',
      'application', 'site web', 'website', 'platform',
      'backend', 'frontend', 'javascript', 'react', 'vue',
      'node', 'database', 'sql', 'api', 'full stack',
      'mobile', 'ios', 'android', 'web app', 'progressive',
      'typescript', 'python', 'php', 'java', 'c#', '.net',
      'django', 'flask', 'express', 'rails', 'laravel',
      'docker', 'kubernetes', 'testing', 'qa', 'seo',
      'performance', 'scalability', 'architecture',
      'microservices', 'cloud', 'aws', 'firebase', 'heroku'
    ],
    services: [
      'Développement Web',
      'Développement Mobile',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'API Development',
      'Database Design',
      'DevOps',
      'Testing & QA',
      'Cloud Architecture',
      'Performance Optimization',
      'Web Scraping'
    ],
    description: 'Développement logiciel et applications'
  },
  {
    name: 'Marketing & Acquisition',
    keywords: [
      'marketing', 'seo', 'sem', 'contenu', 'social',
      'acquisition', 'stratégi', 'campagne', 'audience',
      'growth', 'analytics', 'email', 'funnel', 'conversion',
      'inbound', 'outbound', 'facebook', 'instagram',
      'linkedin', 'twitter', 'tiktok', 'youtube',
      'google ads', 'facebook ads', 'retargeting',
      'affilitation', 'affiliate', 'partnership',
      'branding', 'communication', 'pr', 'relations publiques',
      'influenceur', 'ambassador', 'brand awareness',
      'lead generation', 'lead nurturing', 'customer retention'
    ],
    services: [
      'Marketing Digital',
      'SEO/SEM',
      'Content Marketing',
      'Social Media Management',
      'Growth Hacking',
      'Analytics & Reporting',
      'Email Marketing',
      'Stratégie digitale',
      'Publicité Digitale',
      'Influencer Marketing',
      'Relations Publiques'
    ],
    description: 'Marketing et acquisition client'
  },
  {
    name: 'Coaching & Apprentissage',
    keywords: [
      'coaching', 'conseil', 'mentor', 'mentorat', 'formation',
      'apprentissage', 'apprendre', 'compétence', 'skill',
      'carrière', 'leadership', 'business', 'stratégi',
      'améliorer', 'progress', 'développement', 'personnel',
      'professionnel', 'cv', 'entretien', 'interview',
      'réseau', 'networking', 'transition', 'reconversion',
      'management', 'équipe', 'communication', 'négociation',
      'cours', 'tutoring', 'leçon', 'master', 'certification',
      'math', 'maths', 'français', 'anglais', 'langue',
      'informatique', 'piano', 'guitare', 'fitness',
      'yoga', 'natation', 'nager', 'sport', 'danse'
    ],
    services: [
      'Coaching Carrière',
      'Coaching Vie & Bien-être',
      'Executive Coaching',
      'Business Consulting',
      'Formation & Certification',
      'Mentoring',
      'Leadership Development',
      'Stratégie d\'entreprise',
      'Tutoring Académique',
      'Coaching Sportif',
      'Cours particuliers',
      'Préparation Concours'
    ],
    description: 'Coaching, formation et développement personnel'
  },
  {
    name: 'Contenu & Copywriting',
    keywords: [
      'écri', 'content', 'contenu', 'article', 'blog',
      'copy', 'copywriting', 'texte', 'description', 'rédact',
      'storytelling', 'narrative', 'storia', 'script',
      'newsletter', 'email', 'landing page copy',
      'produit description', 'catalogue', 'brochure',
      'texte marketing', 'persuasive', 'persuasion',
      'journalisme', 'journaliste', 'rédacteur',
      'traduction', 'transcription', 'proofreading',
      'édition', 'correction', 'relecture'
    ],
    services: [
      'Copywriting',
      'Content Writing',
      'Articles Blog',
      'Rédaction SEO',
      'Storytelling',
      'Description produits',
      'Newsletter',
      'Scripts vidéo',
      'Transcription',
      'Traduction',
      'Correction & Relecture'
    ],
    description: 'Création et rédaction de contenu'
  },
  {
    name: 'Photographie & Vidéo',
    keywords: [
      'photo', 'photographie', 'vidéo', 'film', 'vidéographie',
      'shooting', 'portrait', 'produit', 'événement',
      'mariage', 'corporate', 'immobilier', 'food',
      'montage', 'édition', 'editing', 'post-production',
      'drone', 'cinématographie', 'color grading',
      'animation', '3d', 'cgi', 'special effects',
      'vfx', 'live streaming', 'streaming', 'webinaire'
    ],
    services: [
      'Photographie',
      'Photographie Produit',
      'Photographie Portrait',
      'Vidéographie',
      'Montage Vidéo',
      'Production Vidéo',
      'Animation 3D',
      'Motion Graphics',
      'Color Grading',
      'Post-Production'
    ],
    description: 'Photographie et vidéographie'
  },
  {
    name: 'Consulting & Expertise',
    keywords: [
      'consulting', 'consultant', 'expert', 'expertise',
      'audit', 'analyse', 'study', 'research',
      'données', 'data analysis', 'analytics',
      'bi', 'business intelligence', 'reporting',
      'stratégie', 'planification', 'roadmap',
      'financier', 'comptable', 'fiscal', 'impôt',
      'legal', 'juridique', 'droit', 'contrat',
      'hr', 'rhh', 'recrutement', 'ressources humaines',
      'organisationnel', 'processus', 'optimisation'
    ],
    services: [
      'Business Consulting',
      'Data Analysis',
      'Financial Consulting',
      'Legal Consulting',
      'HR Consulting',
      'Process Optimization',
      'Market Research',
      'Strategic Planning',
      'Audit & Compliance'
    ],
    description: 'Consulting et services professionnels spécialisés'
  }
];

// Calculate Levenshtein distance for string similarity
const levenshteinDistance = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
};

// Calculate similarity score (0-1)
const calculateSimilarity = (str1: string, str2: string): number => {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - distance / maxLen;
};

// Find best matching keyword in a domain
const findBestKeywordMatch = (text: string, keywords: string[]): number => {
  let bestScore = 0;

  // Split text into words
  const words = text.toLowerCase().split(/\s+/);

  for (const word of words) {
    for (const keyword of keywords) {
      const score = calculateSimilarity(word, keyword);
      if (score > bestScore) {
        bestScore = score;
      }
      // Also check if word contains keyword or keyword contains word
      if (word.includes(keyword) || keyword.includes(word)) {
        bestScore = Math.max(bestScore, 0.85);
      }
    }
  }

  return bestScore;
};

// Advanced AI Service Detection
const intelligentServiceDetection = (
  need: string
): { category: string; services: string[]; brief: string; confidence: number } => {
  let bestDomain: ServiceDomain | null = null;
  let bestScore = 0;

  // Calculate match score for each domain
  for (const domain of SERVICE_DOMAINS) {
    const score = findBestKeywordMatch(need, domain.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  // If no domain found with good confidence, use a generic one
  if (!bestDomain || bestScore < 0.3) {
    bestDomain = SERVICE_DOMAINS[SERVICE_DOMAINS.length - 1]; // Consulting
    bestScore = 0.5;
  }

  // Generate contextual brief
  const brief = `Brief: ${need.charAt(0).toUpperCase() + need.slice(1)}

Objectif: Réaliser le projet décrit

Contexte:
• Besoin identifié: ${need}
• Domaine: ${bestDomain.name}
• Résultat attendu: À clarifier

Spécifications:
• Approche: À discuter avec le prestataire
• Délai: À définir
• Budget: À négocier
• Livrables: À préciser

Attentes:
• Qualité: Premium
• Communication: Transparente
• Suivi: Régulier

Délai: À convenir
Budget: À définir`;

  return {
    category: bestDomain.name,
    services: bestDomain.services,
    brief,
    confidence: Math.min(bestScore, 1)
  };
};

// Rain Animation Component
const RainBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('rainCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const raindrops: Array<{ x: number; y: number; speed: number; opacity: number }> = [];

    // Create more raindrops for better effect
    for (let i = 0; i < 150; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      raindrops.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -5;
          drop.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + 20);
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

  return <canvas id="rainCanvas" className="fixed inset-0 pointer-events-none opacity-50" />;
};

// Freelancer Profile Card
interface Provider {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  price: string;
}

const ProviderCard = ({ provider, onContact }: { provider: Provider; onContact: (provider: Provider) => void }) => {
  const categories = ['Design', 'Développement', 'Marketing', 'Coaching', 'Writing'];
  const colors = [
    'from-cyan-500/20 to-cyan-600/20 border-cyan-400/50',
    'from-purple-500/20 to-purple-600/20 border-purple-400/50',
    'from-pink-500/20 to-pink-600/20 border-pink-400/50',
    'from-blue-500/20 to-blue-600/20 border-blue-400/50',
  ];

  const colorIndex = provider.id % colors.length;

  return (
    <div className={`backdrop-blur-md bg-gradient-to-br ${colors[colorIndex]} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300 group cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 opacity-80 group-hover:opacity-100 transition" />
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-400">⭐ {provider.rating}</span>
          </div>
          <p className="text-gray-400 text-xs">({provider.reviewCount} avis)</p>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-1">{provider.name}</h3>
      <p className="text-cyan-300 text-sm font-medium mb-3">{provider.role}</p>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{provider.description}</p>

      <div className="flex items-end justify-between">
        <span className="px-3 py-1 rounded-lg bg-black/40 text-cyan-300 text-xs font-medium border border-cyan-400/30">
          {provider.category}
        </span>
        <span className="text-white font-bold text-lg">{provider.price}</span>
      </div>

      <button 
        onClick={() => onContact(provider)}
        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm">
        Contacter <ArrowRight size={16} />
      </button>
    </div>
  );
};

// Brief Generator Assistant
const BriefGeneratorAssistant = ({ router }: { router: any }) => {
  const [need, setNeed] = useState('');
  const [generatedBrief, setGeneratedBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [error, setError] = useState('');

  const exampleNeed = "Je cherche un designer pour une landing page SaaS futuriste, avec copy orienté conversion, section pricing, FAQ, et intégration newsletter.";

  const generateBrief = async () => {
    if (!need.trim()) return;
    setLoading(true);
    setError('');

    try {
      const apiClient = createApiClient();
      const response = await apiClient.post(
        API_ENDPOINTS.GENERATE_HOMEPAGE_BRIEF,
        { description: need }
      );

      if (response.data.success && response.data.brief) {
        const brief = response.data.brief;
        // Format the brief for display
        const briefText = `Titre: ${brief.title}

Description: ${brief.description}

Compétences requises: ${brief.requiredSkills}

Budget estimé: ${brief.estimatedBudget} EUR

Durée: ${brief.estimatedDuration}

Localisation: ${brief.location || 'À déterminer'}`;

        setGeneratedBrief(briefText);
        setShowBrief(true);
      } else {
        setError('Erreur lors de la génération du brief. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Error generating brief:', err);
      const message = err.response?.data?.message || err.message || 'Erreur lors de la génération du brief';
      setError(`Erreur: ${message}. Veuillez réessayer.`);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setNeed(exampleNeed);
  };

  const copyBrief = () => {
    navigator.clipboard.writeText(generatedBrief);
    alert('Brief copié ! ✅');
  };

  const useBrief = () => {
    const success1 = saveDraftData('draft_generatedBrief', generatedBrief);
    const success2 = saveDraftData('draft_userNeed', need);
    
    if (success1 && success2) {
      router.push('/results');
    } else {
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input & Brief */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="backdrop-blur-md bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Assistant IA</h3>
                <p className="text-cyan-300 text-sm font-medium">Rapide, structuré, orienté livrables</p>
              </div>
              <span className="text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-400/50 bg-cyan-400/10">Prêt</span>
            </div>

            <p className="text-white font-semibold mb-4">Décris ton besoin</p>
            <textarea
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="Ex: Je cherche un designer pour une landing page SaaS futuriste, avec copy orienté conversion, section pricing, FAQ, et intégration newsletter."
              className="w-full h-40 bg-black/40 border border-cyan-400/30 rounded-xl p-4 text-white placeholder-gray-500 focus:border-cyan-300 focus:outline-none resize-none text-sm"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={generateBrief}
                disabled={loading || !need.trim()}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition"
              >
                {loading ? '⏳ Génération...' : 'Générer un brief'}
              </button>
              <button 
                onClick={loadExample}
                className="flex-1 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-bold py-3 px-6 rounded-xl transition"
              >
                Exemple
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Brief Display Section */}
          {showBrief && (
            <div className="backdrop-blur-md bg-black/40 border border-cyan-400/30 rounded-2xl p-8">
              <p className="text-white font-semibold mb-4">Brief généré</p>
              <div className="bg-black/60 border border-cyan-400/20 rounded-xl p-6 whitespace-pre-wrap text-gray-300 text-sm font-mono max-h-64 overflow-y-auto mb-6">
                {generatedBrief}
              </div>

              <div className="flex gap-3 justify-center">
                <button 
                  onClick={copyBrief}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  Copier
                </button>
                <button 
                  onClick={useBrief}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  Utiliser pour la démo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Why It Works */}
        <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/50 rounded-2xl p-8 h-fit">
          <h3 className="text-xl font-bold text-white mb-6">Pourquoi ça marche</h3>
          <p className="text-gray-400 text-sm mb-6">Moins d'aller-retours, plus de qualité</p>

          <div className="space-y-5">
            {[
              { num: 1, title: 'Scope clair', desc: "L'IA structure le besoin en objectifs, livrables, contraintes." },
              { num: 2, title: 'Brief prêt à publier', desc: 'avec livrables' },
              { num: 3, title: 'Tu choisis', desc: 'le meilleur match' },
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold text-sm">
                    {item.num}
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-purple-400/30">
            <div className="space-y-3">
              {[
                { icon: '✓', text: 'Scope clair' },
                { icon: '✓', text: 'Matching plus précis' },
                { icon: '✓', text: 'Expérience premium' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">{item.icon}</span>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Finder Assistant
const ServiceFinderAssistant = ({ router }: { router: any }) => {
  const [need, setNeed] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [error, setError] = useState('');

  const exampleNeed = "Je cherche un designer pour une landing page SaaS futuriste, avec copy orienté conversion, section pricing, FAQ, et intégration newsletter.";

  const generateServices = async () => {
    if (!need.trim()) return;
    setLoading(true);
    setError('');

    try {
      const apiClient = createApiClient();
      const response = await apiClient.post(
        API_ENDPOINTS.GENERATE_HOMEPAGE_SERVICES,
        { description: need }
      );

      if (response.data.success && response.data.services) {
        // Shuffle for variety
        const shuffled = [...response.data.services].sort(() => Math.random() - 0.5);
        setServices(shuffled);
        setSelectedServices(shuffled);
        setShowServices(true);
      } else {
        setError('Erreur lors de la génération des services. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Error generating services:', err);
      const message = err.response?.data?.message || err.message || 'Erreur lors de la génération des services';
      setError(`Erreur: ${message}. Veuillez réessayer.`);
    } finally {
      setLoading(false);
    }
  };

  const removeService = (serviceToRemove: string) => {
    setSelectedServices(selectedServices.filter(s => s !== serviceToRemove));
  };

  const loadExample = () => {
    setNeed(exampleNeed);
  };

  const validateServices = () => {
    if (selectedServices.length === 0) return;
    
    // Sauvegarder les données avec isolation utilisateur ou sessionId
    const success1 = saveDraftData('draft_selectedServices', selectedServices);
    const success2 = saveDraftData('draft_userNeed', need);
    
    if (success1 && success2) {
      console.log('✓ Draft data saved successfully');
      router.push('/results');
    } else {
      console.error('❌ Failed to save draft data');
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Assistant IA</h3>
                <p className="text-purple-300 text-sm font-medium">Rapide, structuré, orienté livrables</p>
              </div>
              <span className="text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-400/50 bg-purple-400/10">Prêt</span>
            </div>

            <p className="text-white font-semibold mb-4">Décris ton besoin</p>
            <textarea
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="Ex: Je cherche un designer pour une landing page SaaS futuriste, avec copy orienté conversion, section pricing, FAQ, et intégration newsletter."
              className="w-full h-40 bg-black/40 border border-purple-400/30 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-300 focus:outline-none resize-none text-sm"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={generateServices}
                disabled={loading || !need.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition"
              >
                {loading ? '⏳ Recherche...' : 'Lancer la recherche'}
              </button>
              <button 
                onClick={loadExample}
                className="flex-1 border border-purple-400/50 hover:border-purple-400 text-purple-300 font-bold py-3 px-6 rounded-xl transition"
              >
                Exemple
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Services Display Section */}
          {showServices && selectedServices.length > 0 && (
            <div className="backdrop-blur-md bg-black/40 border border-purple-400/30 rounded-2xl p-8">
              <p className="text-white font-semibold mb-4">Services générés</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {selectedServices.map((service, i) => (
                  <div key={i} className="group relative bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/50 text-purple-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-purple-600/30 cursor-pointer">
                    <Check size={16} className="text-green-400" /> {service}
                    <button
                      onClick={() => removeService(service)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Retirer ce service"
                    >
                      <X size={18} className="text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={validateServices}
                  disabled={selectedServices.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  Voir les prestataires <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Why It Works */}
        <div className="backdrop-blur-md bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/50 rounded-2xl p-8 h-fit">
          <h3 className="text-xl font-bold text-white mb-6">Pourquoi ça marche</h3>
          <p className="text-gray-400 text-sm mb-6">Moins d'aller-retours, plus de qualité</p>

          <div className="space-y-5">
            {[
              { num: 1, title: 'Scope clair', desc: "L'IA structure le besoin en objectifs, livrables, contraintes." },
              { num: 2, title: 'Services générés', desc: 'par catégories pertinentes' },
              { num: 3, title: 'Tu choisis', desc: 'le meilleur match' },
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold text-sm">
                    {item.num}
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-cyan-400/30">
            <div className="space-y-3">
              {[
                { icon: '✓', text: 'Scope clair' },
                { icon: '✓', text: 'Matching plus précis' },
                { icon: '✓', text: 'Expérience premium' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">{item.icon}</span>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterventionMap = ({ city }: { city?: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-48 bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-gray-500">Chargement de la carte...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden">
      {typeof window !== 'undefined' && (
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-0.533649,51.281896,0.224647,51.692342&layer=mapnik`}
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Provider Profile Modal Component
const ProviderProfileModal = ({ 
  isOpen, 
  onClose, 
  provider, 
  onRequestService 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  provider: Provider | null; 
  onRequestService: () => void;
}) => {
  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800/50 bg-black/80 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Profil du prestataire</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex gap-6">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-2">{provider.name}</h3>
              <p className="text-cyan-300 text-lg font-medium mb-4">{provider.role}</p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-bold text-lg">{provider.rating}</span>
                  <span className="text-gray-400 text-sm">({provider.reviewCount} avis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">⏱️</span>
                  <span className="text-gray-300">2h réponse</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-sm font-medium">
                  • {provider.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-sm font-medium">
                  • Efficace
                </span>
              </div>

              <p className="text-white text-2xl font-bold">{provider.price}</p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-bold text-lg mb-3">À propos</h4>
            <p className="text-gray-300 leading-relaxed">{provider.description}</p>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-400">⏱️</span>
              <h4 className="text-white font-bold text-lg">Expérience</h4>
            </div>
            <p className="text-gray-300">6 ans d'expérience</p>
          </div>

          {/* Client Commitments */}
          <div>
            <h4 className="text-white font-bold text-lg mb-3">Engagements clients</h4>
            <div className="flex flex-wrap gap-2">
              {['Design innovant', 'Durabilité', 'Respect de l\'environnement'].map((commitment, i) => (
                <span key={i} className="px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-400/50 text-purple-300 text-sm font-medium">
                  {commitment}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment Section */}
          <div>
            <h4 className="text-white font-bold text-lg mb-3">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {['Tondeuse', 'Taille-haie', 'Binette', 'Arroseurs intelligents'].map((equipment, i) => (
                <span key={i} className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50 text-gray-300 text-sm">
                  {equipment}
                </span>
              ))}
            </div>
          </div>

          {/* Intervention Zone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span>🗺️</span>
              <h4 className="text-white font-bold text-lg">Zone d'intervention</h4>
            </div>
            <InterventionMap city={provider.category} />
          </div>

          {/* Reviews Section */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Avis clients ({provider.reviewCount})</h4>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-semibold">Client {i}</p>
                        <span className="text-yellow-400">{'⭐'.repeat(Math.floor(4.8 + i * 0.1))}</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Excellent service, très professionnel et à l'écoute. Recommande vivement !
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onRequestService}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition mt-6"
          >
            Demander un service
          </button>
        </div>
      </div>
    </div>
  );
};

// Auth Modal Component
// ============================================================
// COUNTRY CODES & LOCATION DATA
// ============================================================

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+45', country: 'DK', flag: '🇩🇰' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+358', country: 'FI', flag: '🇫🇮' },
  { code: '+30', country: 'GR', flag: '🇬🇷' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+852', country: 'HK', flag: '🇭🇰' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+56', country: 'CL', flag: '🇨🇱' },
  { code: '+57', country: 'CO', flag: '🇨🇴' },
  { code: '+51', country: 'PE', flag: '🇵🇪' },
  { code: '+54', country: 'AR', flag: '🇦🇷' },
  { code: '+58', country: 'VE', flag: '🇻🇪' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
];

interface LocationSuggestion {
  name: string;
  address: string;
  lat: number;
  lon: number;
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: { isOpen: boolean; onClose: () => void; initialMode?: 'login' | 'signup' }) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const locationAbortController = useRef<AbortController | null>(null);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    // ✅ Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email invalide (format: email@exemple.com)');
      return;
    }

    setLoading(true);
    try {
      // ✅ PHASE 3: Appel API au backend pour la connexion
      const apiClient = createApiClient();
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      }, {
        validateStatus: () => true, // Accepte 4xx aussi
      });

      if (!response.data?.accessToken) { const users = JSON.parse(localStorage.getItem("kyndex_users") || "[]"); const found = users.find((u: any) => u.email === email); if (found) { localStorage.setItem("kyndex_currentUser", JSON.stringify(found)); setTimeout(() => { router.push("/dashboard"); onClose(); }, 300); return; } setError("Email ou mot de passe incorrect"); return; } const { accessToken, refreshToken, user } = response.data;

      // ✅ Sauvegarde les tokens JWT retournés par le backend
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('kyndex_currentUser', JSON.stringify(user));

      // ✅ Log de connexion réussie
      console.log('✅ Connexion réussie (API):', { email: user.email, id: user.id });

      // ✅ Redirection avec délai pour stabiliser l'UI
      setTimeout(() => {
        router.push('/dashboard');
        onClose();
      }, 300);
    } catch (err: any) {
      // ✅ Gestion d'erreur améliorée avec message du backend
      let message = err.response?.data?.message || err.message || 'Erreur lors de la connexion';
      
      // Fallback: Si l'API échoue, utiliser le localStorage pour les anciens users
      if (err.response?.status === 401 || err.response?.status === 404) {
        message = 'Email ou mot de passe incorrect';
      }
      
      console.error('❌ Erreur connexion API:', message);
      setError(message);
      setLoading(false);
    }
  };

  // ✅ Recherche de localisation - Robuste et directe
  const handleLocationChange = async (query: string) => {
    setLocation(query);
    setSelectedLocation(null);

    if (query.length < 1) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    // Annuler les requêtes précédentes
    if (locationAbortController.current) {
      locationAbortController.current.abort();
    }
    locationAbortController.current = new AbortController();

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'json',
            limit: 12,
            addressdetails: 1,
          },
          signal: locationAbortController.current.signal,
          timeout: 8000,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const suggestions = response.data.map((item: any) => ({
          name: item.name || item.display_name?.split(',')[0] || query,
          address: item.display_name || query,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));
        setLocationSuggestions(suggestions);
        setShowLocationSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(true);
      }
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        console.error('Erreur localisation:', err);
      }
    }
  };

  // ✅ Sélectionner une suggestion de localisation
  const selectLocationSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.address);
    setSelectedLocation(suggestion);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSignup = async () => {
    setError('');
    
    // ✅ Validation détaillée de chaque champ
    if (!firstname) {
      setError('Le prénom est requis');
      return;
    }
    if (!lastname) {
      setError('Le nom est requis');
      return;
    }
    if (!email) {
      setError('L\'email est requis');
      return;
    }
    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }

    // ✅ Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email invalide (format: email@exemple.com)');
      return;
    }

    // Construction du numéro de téléphone (optionnel)
    const fullPhone = phone ? `${countryCode}${phone.replace(/^[\+\d\s\-\(\)]/g, '').trim()}` : '';

    // ✅ Validation mot de passe fort (8+ chars, majuscule, minuscule, chiffre, symbole)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Mot de passe faible: 8+ caractères, 1 MAJUSCULE, 1 minuscule, 1 chiffre, 1 symbole (@$!%*?&)');
      return;
    }

    setLoading(true);
    try {
      // ✅ PHASE 3: Appel API au backend pour l'inscription
      const apiClient = createApiClient();
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
        firstName: firstname,
        lastName: lastname,
        email,
        password,
        phone: fullPhone,
        location: selectedLocation.address,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lon,
      });

      if (!response.data?.accessToken) { const users = JSON.parse(localStorage.getItem("kyndex_users") || "[]"); const found = users.find((u: any) => u.email === email); if (found) { localStorage.setItem("kyndex_currentUser", JSON.stringify(found)); setTimeout(() => { router.push("/dashboard"); onClose(); }, 300); return; } setError("Email ou mot de passe incorrect"); return; } const { accessToken, refreshToken, user } = response.data;

      // ✅ Sauvegarde les tokens JWT retournés par le backend
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('kyndex_currentUser', JSON.stringify(user));

      // ✅ Log de création pour debug
      console.log('✅ Nouveau compte créé (API):', { email: user.email, id: user.id, firstName: user.firstName });

      // ✅ Redirection avec délai pour stabiliser l'UI
      setTimeout(() => {
        router.push('/dashboard');
        onClose();
      }, 300);
    } catch (err: any) {
      // ✅ Gestion d'erreur améliorée avec message du backend
      const message = err.response?.data?.message || err.message || 'Erreur lors de la création du compte';
      console.error('❌ Erreur inscription API:', message);
      setError(message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Compte Kyndex</h2>
            <p className="text-gray-400 text-sm mt-1">Connecte-toi ou crée ton compte.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 font-bold py-2 px-4 rounded-xl transition ${
              mode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'border border-purple-400/50 text-purple-300 hover:text-purple-200'
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 font-bold py-2 px-4 rounded-xl transition ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'border border-purple-400/50 text-purple-300 hover:text-purple-200'
            }`}
          >
            S'inscrire
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-semibold block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amel@entreprise.com"
                className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-white text-sm font-semibold block mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-semibold block mb-2">Prénom</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Ex: Amel"
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold block mb-2">Nom</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Ex: Benali"
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-semibold block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amel@entreprise.com"
                className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            {/* ✅ Champ Téléphone avec sélecteur de code pays compact */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-white text-sm font-semibold block mb-2">Pays</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-2 py-3 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.country} value={cc.code}>
                      {cc.flag} {cc.country} {cc.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-white text-sm font-semibold block mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="6 12 34 56 78"
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* ✅ Champ Localisation - Robuste et efficace */}
            <div className="relative z-20">
              <label className="text-white text-sm font-semibold block mb-2">Localisation 📍</label>
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => {
                  if (location.length >= 1 && locationSuggestions.length > 0) {
                    setShowLocationSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowLocationSuggestions(false), 150);
                }}
                placeholder="Ex: 5360 Avenue West, Paris..."
                className={`w-full bg-gray-700/50 border ${
                  selectedLocation ? 'border-green-400/50' : 'border-cyan-400/30'
                } rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition`}
              />
              
              {selectedLocation && (
                <div className="text-green-400 text-xs mt-1">✅ Adresse sélectionnée</div>
              )}
              
              {/* ✅ Dropdown des suggestions - Simple et efficace */}
              {showLocationSuggestions && location.length >= 1 && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-cyan-400/50 rounded-xl mt-1 shadow-2xl max-h-72 overflow-y-auto z-50">
                  {locationSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectLocationSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-cyan-500/20 text-white border-b border-gray-700/30 last:border-0 transition-colors duration-75"
                    >
                      <div className="font-medium text-cyan-300 text-sm truncate">
                        {suggestion.name}
                      </div>
                      <div className="text-gray-400 text-xs truncate mt-0.5">
                        {suggestion.address}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-white text-sm font-semibold block mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 8 caractères"
                  className="w-full bg-gray-700/50 border border-cyan-400/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={mode === 'login' ? handleLogin : handleSignup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition mt-8"
        >
          {loading ? '⏳ Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const handleContactProvider = (provider: Provider) => {
    // Sauvegarder le prestataire pour l'ouvrir automatiquement après connexion
    localStorage.setItem('pendingProviderContact', JSON.stringify(provider));
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleRequestService = () => {
    setShowProviderModal(false);
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('kyndex_currentUser');
    setIsLoggedIn(!!currentUser);

    // Generate random provider data
    const mockProviders: Provider[] = [
      {
        id: 1,
        name: 'Sophie Martin',
        role: 'Designer UI/UX',
        category: 'Design',
        image: '👩‍💼',
        rating: 4.9,
        reviewCount: 312,
        description: 'Design + intégration responsive, optimisée conversion.',
        price: '950 $ CAD',
      },
      {
        id: 2,
        name: 'Lucas Dubois',
        role: 'Développeur Full Stack',
        category: 'Développement',
        image: '👨‍💻',
        rating: 4.8,
        reviewCount: 287,
        description: 'Features front/back, intégrations, performances.',
        price: '130 $ CAD/h',
      },
      {
        id: 3,
        name: 'Emma Chen',
        role: 'Expert Marketing Digital',
        category: 'Marketing',
        image: '👱‍♀️',
        rating: 4.9,
        reviewCount: 198,
        description: 'Positionnement, acquisition, funnel → plan 30 jours.',
        price: '425 $ CAD',
      },
      {
        id: 4,
        name: 'Antoine Moreau',
        role: 'Coach Carrière & Leadership',
        category: 'Coaching',
        image: '👨‍🏫',
        rating: 4.8,
        reviewCount: 156,
        description: 'Pitch, portfolio, pricing, process client → 1:1.',
        price: '175 $ CAD',
      },
      {
        id: 5,
        name: 'Chloé Laurent',
        role: 'Copywriter & Brand',
        category: 'Writing',
        image: '✍️',
        rating: 4.9,
        reviewCount: 234,
        description: 'Figma + HTML, SEO ready, Design System inclus.',
        price: '800 $ CAD',
      },
      {
        id: 6,
        name: 'Marc Lefevre',
        role: 'Architecte Solution',
        category: 'Consultation',
        image: '🏗️',
        rating: 4.7,
        reviewCount: 128,
        description: 'Architecture scalable, tech stack, roadmap produit.',
        price: '220 $ CAD/h',
      },
      {
        id: 7,
        name: 'Jade Wilson',
        role: 'Video Producer',
        category: 'Vidéo',
        image: '🎬',
        rating: 4.9,
        reviewCount: 89,
        description: 'Vidéos de présentation, motion, montage professionnel.',
        price: '1165 $ CAD',
      },
      {
        id: 8,
        name: 'Thomas Dupont',
        role: 'Data Analyst',
        category: 'Data',
        image: '📊',
        rating: 4.8,
        reviewCount: 95,
        description: 'Analyse, dashboards, insights actionables, rapports.',
        price: '160 $ CAD/h',
      },
    ];

    setProviders(mockProviders);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Rain Animation */}
      <RainBackground />

      {/* Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/30 to-purple-900/50 opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-20 backdrop-blur-md bg-black/50 border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-white font-bold text-xl">Kyndex</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/onboarding')}
                className="text-cyan-300 hover:text-cyan-200 font-semibold transition text-sm"
              >
                Devenir prestataire
              </button>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-bold transition text-sm"
              >
                Se connecter ou s'inscrire
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 text-sm font-medium">
              🚀 Peer-to-peer • Community-first • Matching IA
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trouve les talents<br />
            qu'il te faut.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Offre tes compétences
            </span>{' '}
            au monde.
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-2xl">
            Kyndex connecte clients et freelancers via un matching moderne, des profils clairs, et un assistant IA qui transforme ton
            besoin en brief prêt à publier.
          </p>
        </section>

        {/* Featured Providers Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/50 text-cyan-300 text-sm font-medium mb-6">
              ⭐ Profils populaires
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Découvre les meilleurs talents</h2>
            <p className="text-gray-400">Une sélection de prestataires vérifiés, notés et prêts à collaborer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.slice(0, 8).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onContact={handleContactProvider} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => router.push('/discover')}
              className="border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 font-bold py-3 px-8 rounded-xl transition"
            >
              Voir tous les prestataires
            </button>
          </div>
        </section>

        {/* Brief Generator Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/50 text-cyan-300 text-sm font-medium mb-6">
              📝 Créer une demande
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Décris ton besoin. L'IA génère un brief.</h2>
            <p className="text-gray-400">En quelques secondes, transforme ton idée en brief ultra clair, prêt à publier pour attirer les meilleurs talents</p>
          </div>

          <div className="flex justify-center">
            <BriefGeneratorAssistant router={router} />
          </div>
        </section>

        {/* Service Finder Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/50 text-purple-300 text-sm font-medium mb-6">
              🔍 Trouver des prestataires
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Recherche intelligente par services</h2>
            <p className="text-gray-400">Décris ce que tu cherches, l'IA classe les prestataires par catégories pertinentes</p>
          </div>

          <div className="flex justify-center">
            <ServiceFinderAssistant router={router} />
          </div>
        </section>

        {/* Why Kyndex Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Pourquoi Kyndex</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Matching+', desc: 'Catégories + compétences + critères d\'acceptation', icon: '🎯' },
              { title: 'Scope clair', desc: 'L\'IA structure le besoin en objectifs, livrables, contraintes', icon: '📋' },
              { title: 'Expérience premium', desc: 'Moins de friction pour les clients, plus de signal pour les talents', icon: '✨' },
              { title: 'Communauté vérifiée', desc: 'Signal, réputation, transparence, support direct', icon: '🤝' },
            ].map((item, i) => (
              <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '24', label: 'Catégories actives' },
              { num: '180+', label: 'Talents en vitrine' },
              { num: '4.9', label: 'Satisfaction moyenne' },
              { num: '100%', label: 'Paiements sécurisés' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
                  {stat.num}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Rejoins notre communauté</h2>
          <p className="text-gray-400 mb-8 text-lg">Que tu sois talent ou client, commence dès maintenant</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition flex-1"
            >
              Je suis un prestataire
            </button>
            <button 
              onClick={() => router.push('/discover')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition flex-1"
            >
              Je cherche des talents
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="text-gray-400 text-sm font-bold mb-4">Produit</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
                      Propositions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
                      Assistant IA
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold mb-4">Pour qui</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
                      Freelancers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
                      Clients
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold mb-4">Contact</p>
                <Link href="mailto:hello@kyndex.app" className="text-gray-500 hover:text-white text-sm transition">
                  hello@kyndex.app
                </Link>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold mb-4">Légal</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
                      Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800/50 pt-8">
              <p className="text-gray-500 text-sm">© 2026 Kyndex. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ProviderProfileModal 
        isOpen={showProviderModal} 
        onClose={() => setShowProviderModal(false)} 
        provider={selectedProvider}
        onRequestService={handleRequestService}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
    </div>
  );
}





