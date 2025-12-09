import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Composant HOC pour protéger les routes
 * Redirige vers /login si non authentifié
 */
export function ProtectedRoute({ children }) {
  const auth = React.useContext(AuthContext);

  if (auth.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
