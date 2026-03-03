'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/app/app-layout';
import { useAuth } from '@/hooks/useAuth';
import { createApiClient } from '@/lib/api-client';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  reputationScore: number;
  portfolioImages: Array<{ id: string; imageUrl: string }>;
  isProfileComplete: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const apiClient = useMemo(() => createApiClient(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/profile/me`);
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(
        `/profile/avatar`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setProfile(response.data.profile);
      alert('Avatar mis à jour!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleUploadPortfolioImages = async (files: FileList) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      const response = await apiClient.post(
        `/profile/portfolio`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      loadProfile();
      alert('Images ajoutées!');
    } catch (error) {
      console.error('Error uploading portfolio images:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleDeletePortfolioImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      await apiClient.delete(`/profile/portfolio/${imageId}`);
      loadProfile();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await apiClient.put(
        `/profile/me`,
        formData,
      );
      setProfile(response.data);
      setEditMode(false);
      alert('Profil mis à jour!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
          <div className="max-w-2xl mx-auto px-4 py-2 sm:py-4 flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mon Profil</h1>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            {/* Cover */}
            <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            {/* Avatar & Info */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex flex-col items-center -mt-12 sm:-mt-16 mb-4 sm:mb-6">
                {profile.avatarUrl ? (
                  <img
                    src={`http://localhost:3001${profile.avatarUrl}`}
                    alt="Avatar"
                    className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-3xl sm:text-5xl">
                    👤
                  </div>
                )}

                {/* Upload Avatar */}
                <label className="mt-2 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition">
                  📸 Changer avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleUploadAvatar(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name & Stats */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Utilisateur Kyndex</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-600">Compétences</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-600">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                    ⭐ {profile.reputationScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600">Note</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'profile', label: 'Profil' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'skills', label: 'Compétences' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 py-4 font-semibold transition border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {selectedTab === 'profile' && (
                <div className="space-y-4">
                  {editMode ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Localisation
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          ✓ Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex-1 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                          ✗ Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {user?.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Bio</p>
                        <p className="text-lg text-gray-900">
                          {profile.bio || 'Pas de bio'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Localisation</p>
                        <p className="text-lg text-gray-900">
                          {profile.location || 'Non définie'}
                        </p>
                      </div>

                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        ✏️ Éditer Profil
                      </button>
                    </>
                  )}
                </div>
              )}

              {selectedTab === 'portfolio' && (
                <div className="space-y-4">
                  {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.portfolioImages.map((image) => (
                          <div
                            key={image.id}
                            className="relative group rounded-lg overflow-hidden"
                          >
                            <img
                              src={`http://localhost:3001${image.imageUrl}`}
                              alt="Portfolio"
                              className="w-full h-40 object-cover"
                            />
                            <button
                              onClick={() => handleDeletePortfolioImage(image.id)}
                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-semibold"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      Aucune image dans le portfolio
                    </p>
                  )}

                  <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    📸 Ajouter des images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleUploadPortfolioImages(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {selectedTab === 'skills' && (
                <div className="space-y-4">
                  <p className="text-gray-600">Gestion des compétences à venir...</p>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                    ➕ Ajouter Compétence
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
