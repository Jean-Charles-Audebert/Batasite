import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import styles from './ContentPage.module.css';

/**
 * US-2.2: Page de gestion du contenu global
 * - Affichage du contenu actuel
 * - Formulaire d'édition
 * - Historique des versions
 */
export function ContentPage() {
  const { success, error: notifyError } = useNotification();
  const [content, setContent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Charger le contenu
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContent();
      setContent(data.content || {});
      setFormData(data.content || {});
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await api.getContentHistory(1, 10);
      setHistory(data.versions || []);
      setShowHistory(true);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de l\'historique');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.updateContent(formData);
      setContent(formData);
      setEditing(false);
      success('Contenu sauvegardé avec succès');
      // Recharger pour avoir le timestamp du serveur
      await loadContent();
    } catch (err) {
      const msg = err.message || 'Erreur lors de la sauvegarde';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(content || {});
    setEditing(false);
  };

  const handleRestore = async (version) => {
    if (!window.confirm(`Restaurer la version du ${new Date(version.updated_at).toLocaleString()} ?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.updateContent(version.content);
      setContent(version.content);
      setFormData(version.content);
      setShowHistory(false);
      success('Version restaurée avec succès');
      await loadContent();
    } catch (err) {
      const msg = err.message || 'Erreur lors de la restauration';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !content) {
    return (
      <div className={styles.container}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestion du Contenu Global</h2>
        <div className={styles.actions}>
          <button
            onClick={loadHistory}
            disabled={loading}
            className={styles.secondaryButton}
          >
            Historique
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className={styles.primaryButton}
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className={styles.primaryButton}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className={styles.secondaryButton}
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showHistory ? (
        <HistoryView
          history={history}
          loading={historyLoading}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      ) : editing ? (
        <ContentEditor
          data={formData}
          onChange={handleChange}
          loading={loading}
        />
      ) : (
        <ContentView data={content} />
      )}
    </div>
  );
}

/**
 * Affichage du contenu actuel
 */
function ContentView({ data }) {
  const safeData = data || {};
  return (
    <div className={styles.content}>
      <div className={styles.contentBox}>
        <h3>Contenu Actuel</h3>
        {Object.keys(safeData).length === 0 ? (
          <p className={styles.empty}>Aucun contenu pour le moment</p>
        ) : (
          <dl>
            {Object.entries(safeData).map(([key, value]) => (
              <div key={key} className={styles.item}>
                <dt>{key}</dt>
                <dd>{typeof value === 'string' ? value : JSON.stringify(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

/**
 * Formulaire d'édition du contenu
 */
function ContentEditor({ data, onChange, loading }) {
  return (
    <div className={styles.editor}>
      <form>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>{key}</label>
            <textarea
              id={key}
              name={key}
              value={typeof value === 'string' ? value : JSON.stringify(value)}
              onChange={onChange}
              disabled={loading}
              rows={4}
            />
          </div>
        ))}

        <div className={styles.formGroup}>
          <label htmlFor="newKey">Ajouter un champ</label>
          <input
            type="text"
            id="newKey"
            placeholder="Clé"
            disabled={loading}
          />
          <textarea
            placeholder="Valeur"
            disabled={loading}
            rows={3}
          />
        </div>
      </form>
    </div>
  );
}

/**
 * Affichage de l'historique des versions
 */
function HistoryView({ history, loading, onRestore, onClose }) {
  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h3>Historique des Versions</h3>
        <button onClick={onClose} className={styles.closeButton}>✕</button>
      </div>

      {loading ? (
        <p>Chargement de l'historique...</p>
      ) : history.length === 0 ? (
        <p className={styles.empty}>Aucun historique disponible</p>
      ) : (
        <div className={styles.historyList}>
          {history.map((version, idx) => (
            <div key={idx} className={styles.historyItem}>
              <div className={styles.historyInfo}>
                <p>
                  <strong>Version {history.length - idx}</strong>
                  {' - '}
                  {new Date(version.updated_at).toLocaleString()}
                </p>
                <p className={styles.historyPreview}>
                  {JSON.stringify(version.content).substring(0, 100)}...
                </p>
              </div>
              <button
                onClick={() => onRestore(version)}
                className={styles.restoreButton}
              >
                Restaurer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
