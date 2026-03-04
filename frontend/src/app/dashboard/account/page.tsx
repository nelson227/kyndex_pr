'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';

type ModalType = 'personal' | 'balance' | 'credit' | 'balance-detail' | 'documents' | 'notifications' | 'security' | 'payment' | null;

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gérer mon compte</h1>
          <p className="text-gray-600 mt-2">{user?.email}</p>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveModal('personal')}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
        >
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
          <p className="text-sm text-gray-600 mt-2">Complétez et mettez à jour votre identité</p>
        </button>
        <button 
          onClick={() => setActiveModal('balance')}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
        >
          <div className="text-2xl mb-2">💰</div>
          <h3 className="font-semibold text-gray-900">Mon solde</h3>
          <p className="text-sm text-gray-600 mt-2">($0.00)</p>
        </button>
        <button 
          onClick={() => setActiveModal('credit')}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
        >
          <div className="text-2xl mb-2">💳</div>
          <h3 className="font-semibold text-gray-900">Mon crédit Kyndex</h3>
          <p className="text-sm text-gray-600 mt-2">0 crédits disponibles</p>
        </button>
      </div>

      {/* Account Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info */}
          <button 
            onClick={() => setActiveModal('personal')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👤</span>
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complétez et mettez à jour votre identité pour faciliter les échanges
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              Modifier →
            </span>
          </button>

          {/* Payment Methods */}
          <button 
            onClick={() => setActiveModal('payment')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💳</span>
              <h3 className="text-lg font-semibold text-gray-900">Moyens de paiement</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Gérez vos moyens de paiement
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              Ajouter un moyen →
            </span>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => setActiveModal('notifications')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔔</span>
              <h3 className="text-lg font-semibold text-gray-900">Gérer mes notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez la façon dont vous souhaite être contacté
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              Paramétrer →
            </span>
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Balance */}
          <button 
            onClick={() => setActiveModal('balance-detail')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💰</span>
              <h3 className="text-lg font-semibold text-gray-900">Mon solde ($0.00)</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Consultez les paiements et remboursements effectués
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              Consulter →
            </span>
          </button>

          {/* Documents */}
          <button 
            onClick={() => setActiveModal('documents')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📄</span>
              <h3 className="text-lg font-semibold text-gray-900">Documents et factures</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez tous les documents disponibles
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              Accéder →
            </span>
          </button>

          {/* Security */}
          <button 
            onClick={() => setActiveModal('security')}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900">Confiance et sécurité</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sécurité, qualité, fiabilité, tout a été pensé pour vous
            </p>
            <span className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
              En savoir plus →
            </span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Compte</h3>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold"
        >
          Se déconnecter
        </button>
      </div>

      {/* Modals */}
      {activeModal && <Modal modalType={activeModal} onClose={() => setActiveModal(null)} user={user} />}
    </div>
  );
}

interface ModalProps {
  modalType: ModalType;
  onClose: () => void;
  user: any;
}

function Modal({ modalType, onClose, user }: ModalProps) {
  const getModalContent = () => {
    switch (modalType) {
      case 'personal':
        return {
          title: 'Informations personnelles',
          icon: '👤',
          content: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" defaultValue={user?.firstName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" defaultValue={user?.lastName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" placeholder="+33 6 XX XX XX XX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Enregistrer les modifications
              </button>
            </div>
          )
        };
      case 'balance':
        return {
          title: 'Mon solde',
          icon: '💰',
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-lg">
                <p className="text-gray-600 text-sm">Solde disponible</p>
                <p className="text-3xl font-bold text-gray-900">$0.00</p>
              </div>
              <p className="text-gray-600">Votre solde sera mis à jour après validation des transactions.</p>
            </div>
          )
        };
      case 'credit':
        return {
          title: 'Mon crédit Kyndex',
          icon: '💳',
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                <p className="text-gray-600 text-sm">Crédits disponibles</p>
                <p className="text-3xl font-bold text-gray-900">0 crédits</p>
              </div>
              <p className="text-gray-600">Les crédits Kyndex vous permettent de payer vos services directement sur la plateforme.</p>
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Acheter des crédits
              </button>
            </div>
          )
        };
      case 'balance-detail':
        return {
          title: 'Historique des paiements',
          icon: '💰',
          content: (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">Aucune transaction pour le moment</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Résumé :</p>
                <div className="flex justify-between text-sm">
                  <span>Revenus</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dépenses</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span>Solde net</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          )
        };
      case 'documents':
        return {
          title: 'Documents et factures',
          icon: '📄',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Aucun document disponible pour le moment.</p>
              <p className="text-gray-600 text-sm">Les factures seront disponibles après vos premières transactions.</p>
            </div>
          )
        };
      case 'notifications':
        return {
          title: 'Gérer mes notifications',
          icon: '🔔',
          content: (
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Notifications par email</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Notifications par SMS</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Notifications de messages</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Notification marketing</span>
              </label>
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Enregistrer les préférences
              </button>
            </div>
          )
        };
      case 'security':
        return {
          title: 'Confiance et sécurité',
          icon: '🛡️',
          content: (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="font-semibold text-green-900">✓ Compte sécurisé</p>
                <p className="text-sm text-green-800 mt-1">Votre compte est protégé par authentification à deux facteurs.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">Mesures de sécurité actives :</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Mot de passe sécurisé</li>
                  <li>✓ Vérification par email</li>
                  <li>✓ Authentification à deux facteurs optionnelle</li>
                </ul>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-cyan-500 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition">
                Modifier le mot de passe
              </button>
            </div>
          )
        };
      case 'payment':
        return {
          title: 'Moyens de paiement',
          icon: '💳',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Aucun moyen de paiement enregistré.</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Ajouter une carte
              </button>
            </div>
          )
        };
      default:
        return { title: '', icon: '', content: null };
    }
  };

  const modal = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{modal.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900">{modal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {modal.content}
        </div>
      </div>
    </div>
  );
}
