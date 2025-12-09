import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';

/**
 * US-2.2: Dashboard principal
 * - Navigation sidebar
 * - Section principale (swap entre Content/Admin)
 * - Logout
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const [activeSection, setActiveSection] = React.useState('content');

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
            onClick={() => setActiveSection('content')}
          >
            📄 Contenu
          </button>
          <button
            className={`${styles.navItem} ${activeSection === 'admins' ? styles.active : ''}`}
            onClick={() => setActiveSection('admins')}
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
          {activeSection === 'content' ? (
            <ContentSection />
          ) : (
            <AdminSection />
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Section contenu (US-2.3)
 */
function ContentSection() {
  return (
    <div>
      <p>Section contenu - À implémenter (US-2.3)</p>
    </div>
  );
}

/**
 * Section admins (US-2.4)
 */
function AdminSection() {
  return (
    <div>
      <p>Section administrateurs - À implémenter (US-2.4)</p>
    </div>
  );
}
