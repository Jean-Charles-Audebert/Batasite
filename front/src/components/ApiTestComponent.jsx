import React, { useEffect, useState } from 'react';

/**
 * Composant de test pour vérifier la connexion API
 */
export function ApiTestComponent() {
  const [status, setStatus] = useState('Vérification...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('http://localhost:3000/health', {
          method: 'GET',
        });

        if (response.ok) {
          setStatus('✅ API Backend disponible');
        } else {
          setStatus(`❌ API Backend: ${response.status}`);
        }
      } catch (err) {
        setError(`Erreur: ${err.message}`);
        setStatus('❌ API Backend indisponible');
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ 
      padding: '1rem', 
      margin: '1rem', 
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    }}>
      <p><strong>Status Backend:</strong> {status}</p>
      {error && <p style={{ color: '#c33' }}>{error}</p>}
    </div>
  );
}
