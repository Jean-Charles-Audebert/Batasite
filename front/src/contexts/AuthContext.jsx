import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Context pour la gestion globale de l'authentification
 * État: utilisateur + loading
 * Actions: login, logout, register, check
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au montage
  useEffect(() => {
    if (api.isAuthenticated()) {
      // Charger les infos utilisateur depuis le token JWT
      // Note: Dans une app réelle, on ferait un /me endpoint
      // Pour l'instant, on considère qu'on est authentifié
      setUser({ authenticated: true });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      await api.login(email, password);
      setUser({ authenticated: true, email });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      setError(null);
      await api.register(email, password);
      setUser({ authenticated: true, email });
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
    register,
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
