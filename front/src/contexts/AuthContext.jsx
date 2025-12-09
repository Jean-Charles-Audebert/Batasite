import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Context pour la gestion globale de l'authentification
 * État: utilisateur + loading
 * Actions: login, logout, check
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          // Charger les infos utilisateur depuis le endpoint /me
          const response = await api.get('/auth/me');
          setUser(response.data || response);
        } catch (err) {
          console.error('Failed to load user data:', err);
          // Si erreur, garder juste l'état authentifié
          setUser({ authenticated: true });
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const loginResponse = await api.login(email, password);
      // Après login réussi, charger les données utilisateur complètes
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data || userResponse);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte auth
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
