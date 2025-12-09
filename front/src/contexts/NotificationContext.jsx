import React, { createContext, useState, useCallback } from 'react';

/**
 * Context pour notifications (toasts)
 * Permet aux composants de déclencher des notifications
 */
export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Ajouter une notification
   * @param {string} message - Message à afficher
   * @param {string} type - 'success', 'error', 'info', 'warning'
   * @param {number} duration - Durée d'affichage en ms (0 = manuel)
   * @returns {string} ID de la notification
   */
  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-remove après duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Retirer une notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Raccourcis pour types spécifiques
   */
  const success = useCallback((message, duration) => 
    notify(message, 'success', duration), [notify]);
  
  const error = useCallback((message, duration) => 
    notify(message, 'error', duration), [notify]);
  
  const info = useCallback((message, duration) => 
    notify(message, 'info', duration), [notify]);
  
  const warning = useCallback((message, duration) => 
    notify(message, 'warning', duration), [notify]);

  const value = {
    notifications,
    notify,
    removeNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook pour utiliser les notifications
 */
export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
