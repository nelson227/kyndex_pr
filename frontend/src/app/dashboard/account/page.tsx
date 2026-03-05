'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, MapPin, Edit2, Lock, LogOut, Settings, Bell, Shield } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

export default function AccountPage() {
  const { user, isInitialized } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.firstName || 'Jean',
    lastName: user?.lastName || 'Dupont',
    email: user?.email || 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    bio: 'Passionate about design and innovation',
    avatar: user?.firstName?.[0] || 'J',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'settings'>(
    'profile'
  );

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || 'Jean',
        lastName: user.lastName || 'Dupont',
        email: user.email || 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        bio: 'Passionate about design and innovation',
        avatar: user.firstName?.[0] || 'J',
      });
    }
  }, [user]);

  if (!isInitialized) {
    return null;
  }

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Mon Compte 👤
        </h1>
        <p className="text-gray-400">Gérez votre profil et vos préférences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
              {profile.avatar}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-full transition">
              <Edit2 className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-400 mb-4">{profile.bio}</p>

            <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-cyan-400" />
                {profile.email}
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-cyan-400" />
                {profile.phone}
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {profile.location}
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditedProfile(profile);
                }}
                className="mt-6 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30 flex items-center gap-2 mx-auto md:mx-0"
              >
                <Edit2 className="w-4 h-4" />
                Modifier Profil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 overflow-x-auto">
        {(['profile', 'security', 'notifications', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 font-semibold transition border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-500'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            {tab === 'profile' && <span className="flex items-center gap-2"><User className="w-4 h-4" /> Profil</span>}
            {tab === 'security' && <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Sécurité</span>}
            {tab === 'notifications' && <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>}
            {tab === 'settings' && <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Paramètres</span>}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {isEditing ? (
            <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Éditer Profil</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        bio: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition border border-cyan-500/30"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 bg-gray-900/50 hover:bg-gray-900/70 text-gray-400 font-semibold rounded-lg transition border border-gray-800"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Informations Personnelles</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800/50">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium">{profile.email}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800/50">
                  <span className="text-gray-400">Téléphone</span>
                  <span className="text-white font-medium">{profile.phone}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800/50">
                  <span className="text-gray-400">Localisation</span>
                  <span className="text-white font-medium">{profile.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Biographie</span>
                  <span className="text-white font-medium">{profile.bio}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Sécurité du Compte</h3>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-white">Changer le mot de passe</p>
                    <p className="text-sm text-gray-400">Mettez à jour votre mot de passe régulièrement</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold text-white">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-400">Activez pour plus de sécurité</p>
                  </div>
                </div>
                <span className="text-purple-400">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Préférences de Notification</h3>

            <div className="space-y-4">
              {[
                { title: 'Nouvelles commandes', desc: 'Recevez une alerte quand vous recevez une nouvelle commande' },
                { title: 'Messages', desc: 'Notifications pour les nouveaux messages' },
                { title: 'Mises à jour compte', desc: 'Avis important concernant votre compte' },
                { title: 'Promotions', desc: 'Offres et promotions exclusives' },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
                  <div>
                    <p className="font-semibold text-white">{notif.title}</p>
                    <p className="text-sm text-gray-400">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-gray-950/50 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Paramètres</h3>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">Langue</span>
                </div>
                <span className="text-gray-400">Français</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">Thème</span>
                </div>
                <span className="text-gray-400">Sombre</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition text-left mt-6">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Se déconnecter</span>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Gérer mon compte</h1>
        </div>
        <div className="flex-shrink-0">
          <ProfilePhotoUpload size="md" />
        </div>
      </div>

      {/* Quick Stats - 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveModal('personal')}
          className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left w-full"
        >
          <div className="text-3xl mb-3">👤</div>
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
          <p className="text-sm text-gray-600 mt-2">Complétez et mettez à jour votre identité</p>
        </button>
        <button 
          onClick={() => setActiveModal('balance')}
          className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left w-full"
        >
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900">Mon solde</h3>
          <p className="text-sm text-gray-600 mt-2">($0.00)</p>
        </button>
        <button 
          onClick={() => setActiveModal('credit')}
          className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left w-full"
        >
          <div className="text-3xl mb-3">💳</div>
          <h3 className="font-semibold text-gray-900">Mon crédit Kyndex</h3>
          <p className="text-sm text-gray-600 mt-2">0 crédits disponibles</p>
        </button>
      </div>

      {/* Account Settings Grid - 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info */}
          <button 
            onClick={() => setActiveModal('personal')}
            className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left w-full"
          >
