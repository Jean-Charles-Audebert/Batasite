import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import styles from './ToastNotification.module.css';

/**
 * Composant affichage des notifications
 * À intégrer une seule fois dans App.jsx
 */
export function ToastNotification() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className={styles.container}>
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

/**
 * Toast individuel
 */
function Toast({ notification, onClose }) {
  return (
    <div className={`${styles.toast} ${styles[notification.type]}`}>
      <div className={styles.message}>{notification.message}</div>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}
