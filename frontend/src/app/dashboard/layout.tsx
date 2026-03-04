'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const getMenuItems = (unreadMessages: number, calendarNotes: number): any[] => [
  { id: 'home', label: 'Accueil', icon: '🏠', href: '/dashboard', badge: null },
  { id: 'requests', label: 'Demandes', icon: '📋', href: '/dashboard/requests', badge: null },
  { id: 'missions', label: 'Missions', icon: '🎯', href: '/dashboard/missions', badge: null },
  { id: 'messages', label: 'Messagerie', icon: '💬', href: '/dashboard/messages', badge: unreadMessages > 0 ? unreadMessages : null },
  { id: 'calendar', label: 'Calendrier', icon: '📅', href: '/dashboard/calendar', badge: calendarNotes > 0 ? calendarNotes : null },
  { id: 'account', label: 'Compte', icon: '👤', href: '/dashboard/account', badge: null },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, logout } = useAuth();
  const { unreadMessages, calendarNotes } = useUnreadCount(user?.id);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Mettre à jour les menu items quand les compteurs changent
  useEffect(() => {
    setMenuItems(getMenuItems(unreadMessages, calendarNotes));
  }, [unreadMessages, calendarNotes]);

  // Redirection si non authentifié
  if (isInitialized && !user) {
    router.push('/');
    return null;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Chargement...</h1>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Sidebar - DESKTOP ONLY */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-gray-950 border-r border-gray-800 fixed md:relative h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Kyndex</span>
              <span className="text-xs text-gray-400">Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition relative ${
                  isActive
                    ? 'bg-cyan-500/20 text-white border-l-4 border-cyan-500'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 px-4">
          <div className="h-px bg-gray-800"></div>
        </div>

        {/* Section Inviter des amis */}
        <div className="p-4 mx-4 border-t border-gray-800 mt-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 p-4 rounded-xl">
            <p className="text-sm font-semibold text-white mb-2">🎁 Inviter des amis</p>
            <p className="text-xs text-gray-400 mb-3">
              Gagnez 5% du montant dépensé par vos amis, à vie.
            </p>
            <button className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 transition">
              Inviter →
            </button>
          </div>
        </div>

        {/* Support Links */}
        <div className="p-4 space-y-2">
          <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-gray-300 text-sm transition flex items-center gap-2">
            <span>📞</span> Demandes d'assistance
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-gray-300 text-sm transition flex items-center gap-2">
            <span>❓</span> Centre d'aide
          </button>
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-gray-800 mt-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">Client • Professionnel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg font-medium transition text-sm border border-gray-800"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0 bg-black overflow-hidden">
        {/* Top Header - DESKTOP */}
        <div className="hidden md:block border-b border-gray-800 sticky top-0 z-40 bg-black/80 backdrop-blur">
          <div className="px-8 py-4 flex justify-between items-center">
            <div></div>
            <div className="flex-1 mx-8">
              <input
                type="text"
                placeholder="Rechercher une demande, mission, message..."
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>
            <button className="ml-4 relative text-gray-400 hover:text-gray-300">
              <span className="text-2xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-8 px-4 xs2:px-6 sm:px-8 md:p-8">
          {children}
        </div>
      </div>

      {/* Bottom Navigation - MOBILE ONLY */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-20">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-20 transition relative ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-gray-400'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
