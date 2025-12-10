import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import ContentPreview from '../components/ContentPreview';
import ContentEditor from '../components/ContentEditor';
import { useNotification } from '../contexts/NotificationContext';
import styles from './ContentPage.module.css';

/**
 * US-2.2: Page de gestion du contenu global
 * Layout: 
 * - Sidebar gauche (nav + logo + éditeur + boutons + nav bas)
 * - Preview droite (iframe plein écran)
 * 
 * État local du JSON modifié avant sauvegarde
 */
export function ContentPage() {
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const { success, error: notifyError } = useNotification();
  const [content, setContent] = useState(null);
  const [editContent, setEditContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Charger le contenu initial
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContent();
      console.log('Contenu chargé:', data.content);
      setContent(data.content || {});
      setEditContent(data.content || {}); // Initialiser l'état d'édition
    } catch (err) {
      console.error('Erreur chargement:', err);
      const msg = err.message || 'Erreur lors du chargement du contenu';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (newContent) => {
    setEditContent(newContent);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.updateContent(editContent);
      setContent(editContent);
      success('Contenu sauvegardé avec succès');
    } catch (err) {
      const msg = err.message || 'Erreur lors de la sauvegarde';
      setError(msg);
      notifyError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    navigate('/login', { replace: true });
  };

  if (loading && !content) {
    return (
      <div className={styles.pageLayout}>
        <div className={styles.loadingMessage}>⏳ Chargement du contenu...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageLayout}>
      {/* Sidebar Gauche - Navigation + Éditeur */}
      <aside className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.logo}>
          <h2>Batasite</h2>
        </div>

        {/* Section Contenu */}
        <div className={styles.contentSection}>
          <div className={styles.sectionTitle}>📄 Contenu</div>
          
          {/* Éditeur */}
          <div className={styles.editorWrapper}>
            <ContentEditor
              content={editContent || {}}
              onChange={handleEditChange}
              error={error}
            />
          </div>
        </div>

        {/* Séparation */}
        <div className={styles.divider}></div>

        {/* Navigation Bas */}
        <div className={styles.navBottom}>
          <div className={styles.actionButtons}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => window.location.reload()}
              disabled={saving}
            >
              ✕ Annuler
            </button>
          </div>
          
          <div className={styles.separator}></div>

          <button
            className={styles.adminButton}
            onClick={() => navigate('/admin')}
          >
            👥 Administrateurs
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Preview Droite */}
      <main className={styles.preview}>
        {content && <ContentPreview content={editContent || content} />}
      </main>
    </div>
  );
}
