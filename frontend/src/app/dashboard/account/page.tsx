'use client';

export default function AccountPage() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-4xl font-bold text-white">Gérer mon compte</h1>
      <p className="text-gray-400">Page en cours de développement...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-2">Informations personnelles</h3>
          <p className="text-gray-400">Mettez à jour votre profil</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-2">Sécurité</h3>
          <p className="text-gray-400">Gérez votre mot de passe et vos sessions</p>
        </div>
      </div>
    </div>
  );
}
