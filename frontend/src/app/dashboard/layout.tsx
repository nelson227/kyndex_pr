'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { useUserMode } from '@/hooks/useUserMode';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Home, Settings, BarChart3, ShoppingBag, Wallet, MessageSquare, Bell, Search, LogOut, Package } from 'lucide-react';

const getClientMenuItems = (unreadMessages: number): any[] => [
  { id: 'home', label: 'Accueil', icon: Home, href: '/dashboard', badge: null },
  { id: 'browse', label: 'Parcourir', icon: ShoppingBag, href: '/dashboard/browse', badge: null },
  { id: 'orders', label: 'Commandes', icon: Package, href: '/dashboard/orders', badge: null },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: unreadMessages > 0 ? unreadMessages : null },
  { id: 'account', label: 'Compte', icon: Settings, href: '/dashboard/account', badge: null },
];

const getProviderMenuItems = (): any[] => [
  { id: 'overview', label: 'Aperçu', icon: Home, href: '/dashboard/provider-overview', badge: null },
  { id: 'services', label: 'Services', icon: ShoppingBag, href: '/dashboard/my-services', badge: null },
  { id: 'orders', label: 'Commandes', icon: Package, href: '/dashboard/provider-orders', badge: null },
  { id: 'earnings', label: 'Revenus', icon: Wallet, href: '/dashboard/earnings', badge: null },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', badge: null },
  { id: 'account', label: 'Compte', icon: Settings, href: '/dashboard/account', badge: null },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, logout } = useAuth();
  const { unreadMessages } = useUnreadCount(user?.id);
  const { mode, toggleMode, isClient, isProvider, isLoading } = useUserMode();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mettre à jour les menu items selon le mode
  useEffect(() => {
    if (isClient) {
      setMenuItems(getClientMenuItems(unreadMessages));
    } else {
      setMenuItems(getProviderMenuItems());
    }
  }, [isClient, unreadMessages]);

  // Redirection si non authentifié
  if (isInitialized && !user) {
    router.push('/');
    return null;
  }

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <h1 className="text-lg font-bold text-white mt-4">Chargement...</h1>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* SIDEBAR */}
      <>
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col bg-gray-950/50 backdrop-blur border-r border-cyan-500/20 sticky top-0 h-screen overflow-y-auto">
          {/* Logo + Mode Toggle */}
          <div className="p-6 border-b border-cyan-500/20">
            <Link href="/dashboard" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Kyndex</div>
                <div className="text-xs text-cyan-400/70">Marketplace</div>
              </div>
            </Link>

            {/* Mode Toggle Button */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Mode</p>
              <button
                onClick={() => toggleMode(isClient ? 'provider' : 'client')}
                className="w-full px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm font-semibold rounded-lg transition border border-cyan-400/30"
              >
                {isClient ? '👨‍💼 Passer en Prestataire' : '🛍️ Passer en Client'}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition group ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Bottom */}
          <div className="p-4 border-t border-cyan-500/20 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-cyan-500/5 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-cyan-400/60">{isClient ? 'Client' : 'Prestataire'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition text-sm border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Déconnecter
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed left-0 top-0 h-screen w-64 bg-gray-950/50 backdrop-blur border-r border-cyan-500/20 z-50 lg:hidden transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-white font-bold">K</span>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => {
                toggleMode(isClient ? 'provider' : 'client');
                setSidebarOpen(false);
              }}
              className="w-full px-3 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded-lg mb-6"
            >
              {isClient ? '👨‍💼 Prestataire' : '🛍️ Client'}
            </button>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/30"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="border-b border-cyan-500/20 bg-gray-950/50 backdrop-blur sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            {/* Left: Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition text-gray-400"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Center: Search Bar (Hidden on Mobile) */}
            <div className="hidden sm:flex flex-1 mx-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={isClient ? 'Rechercher un service...' : 'Rechercher une commande...'}
                  className="w-full bg-gray-900 border border-cyan-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition">
                <Bell className="w-6 h-6" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Avatar */}
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition">
                {user?.firstName?.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
