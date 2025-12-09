import React from 'react';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Batasite</h2>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeSection === 'content' ? styles.active : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            📄 Contenu
          </button>
          <button
            className={`${styles.navItem} ${activeSection === 'admins' ? styles.active : ''}`}
            onClick={() => navigate('/admin')}
          >
            👥 Administrateurs
          </button>
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            {activeSection === 'content' ? 'Gestion du contenu' : 'Gestion des administrateurs'}
          </h1>
        </header>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<ContentPage />} />
            <Route path="/dashboard" element={<ContentPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
