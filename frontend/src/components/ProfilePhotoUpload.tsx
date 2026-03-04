'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Plus, Camera } from 'lucide-react';

interface ProfilePhotoUploadProps {
  size?: 'sm' | 'md' | 'lg';
  onPhotoChange?: (photoUrl: string) => void;
}

export const ProfilePhotoUpload = ({ size = 'md', onPhotoChange }: ProfilePhotoUploadProps) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger la photo de profil depuis localStorage au montage
  useEffect(() => {
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const sizeClasses = {
    sm: 'w-12 h-12 xs2:w-14 xs2:h-14',
    md: 'w-20 h-20 xs2:w-24 xs2:h-24 sm:w-32 sm:h-32',
    lg: 'w-24 h-24 xs2:w-28 xs2:h-28 sm:w-32 sm:h-32'
  };

  const plusSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2 sm:p-2.5',
    lg: 'p-2.5 sm:p-3'
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valider que c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Valider la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsLoading(true);

    // Créer un URL local pour l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      setProfilePhoto(photoUrl);
      localStorage.setItem('userProfilePhoto', photoUrl);
      onPhotoChange?.(photoUrl);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative inline-block">
      {/* Avatar ou photo */}
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-2 border-cyan-500/30 flex items-center justify-center cursor-pointer hover:border-cyan-400/50 transition overflow-hidden ${!profilePhoto ? 'hover:from-cyan-500/30' : ''}`}
        onClick={handlePhotoClick}
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${plusSizeClasses[size]} text-cyan-400`} />
        )}
      </div>

      {/* Bouton + (visible seulement s'il n'y a pas de photo) */}
      {!profilePhoto && (
        <button
          onClick={handlePhotoClick}
          disabled={isLoading}
          className={`absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 transition shadow-lg hover:shadow-cyan-500/50 ${buttonSizeClasses[size]}`}
          title="Ajouter une photo de profil"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </button>
      )}

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
};

export default ProfilePhotoUpload;
