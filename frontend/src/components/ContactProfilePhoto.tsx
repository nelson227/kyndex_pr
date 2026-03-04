'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface ContactProfilePhotoProps {
  contactId: string;
  contactName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ContactProfilePhoto = ({ contactId, contactName, size = 'sm' }: ContactProfilePhotoProps) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Charger la photo de profil du contact depuis localStorage
  useEffect(() => {
    // Clé pour stocker les photos des contacts
    const photoKey = `contactProfilePhoto_${contactId}`;
    const savedPhoto = localStorage.getItem(photoKey);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [contactId]);

  const sizeClasses = {
    sm: 'w-8 h-8 xs2:w-10 xs2:h-10',
    md: 'w-12 h-12 xs2:w-14 xs2:h-14',
    lg: 'w-16 h-16 xs2:w-20 xs2:h-20 sm:w-24 sm:h-24'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorByName = (name: string) => {
    const colors = [
      'from-red-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-purple-400 to-pink-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-blue-500',
      'from-rose-400 to-red-500',
      'from-teal-400 to-cyan-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative inline-block">
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={contactName}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-cyan-500/30`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getColorByName(contactName)} flex items-center justify-center border-2 border-cyan-500/30 text-white font-semibold text-xs sm:text-sm`}
        >
          {getInitials(contactName)}
        </div>
      )}
    </div>
  );
};

export default ContactProfilePhoto;
