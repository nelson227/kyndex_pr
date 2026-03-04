'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('Chargement...');

  useEffect(() => {
    setMessage('✅ Frontend fonctionne!');
    
    // Test API backend
    fetch('http://localhost:3001/api/v1/test/health')
      .then(res => res.json())
      .then(data => {
        setMessage(`✅ Frontend & Backend OK! Backend dit: ${JSON.stringify(data)}`);
      })
      .catch(err => {
        setMessage(`✅ Frontend OK! Backend error: ${err.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🧪 Test Page</h1>
        <p className="text-2xl text-green-400">{message}</p>
      </div>
    </div>
  );
}
