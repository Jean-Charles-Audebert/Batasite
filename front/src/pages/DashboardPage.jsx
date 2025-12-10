import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ContentPage } from './ContentPage';
import { AdminPage } from './AdminPage';
import styles from './DashboardPage.module.css';

/**
 * US-2.2: Dashboard principal
 * - Navigation sidebar
 * - Section principale avec routing
 * - Logout
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = React.useContext(AuthContext);

  // Déterminer la section active basée sur le path
  const isAdminRoute = location.pathname.includes('/admin');
  const activeSection = isAdminRoute ? 'admins' : 'content';

  const handleLogout = async () => {
    await auth.logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {isAdminRoute ? (
        // Admin page - affiche sidebar + AdminPage
        <div className={styles.dashboard}>
          <aside className={styles.sidebar}>
            <div className={styles.logo}>
              <h2>Batasite</h2>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
              <button
                className={`${styles.navItem} ${activeSection === 'content' ? styles.active : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                📄 Contenu
              </button>
            </nav>

            {/* Administrateurs et Déconnexion en bas */}
            <div className={styles.navBottom}>
              <button
                className={`${styles.navItem} ${activeSection === 'admins' ? styles.active : ''}`}
                onClick={() => navigate('/admin')}
              >
                👥 Administrateurs
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </aside>

          {/* Main content area */}
          <main className={styles.main}>
            <AdminPage />
          </main>
        </div>
      ) : (
        // Content page - gère son propre layout
        <ContentPage />
      )}
    </>
  );
}
