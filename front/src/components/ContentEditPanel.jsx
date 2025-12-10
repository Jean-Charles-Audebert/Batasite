import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { JsonEditor } from './JsonEditor';
import { useNotification } from '../contexts/NotificationContext';
import styles from './ContentEditPanel.module.css';

/**
 * Panneau d'édition du contenu - Destiné à être intégré dans la sidebar
 */
export function ContentEditPanel() {
  const { success, error: notifyError } = useNotification();
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Charger le contenu au montage
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
      console.error('Load content error:', err);
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
    if (name === '__json__') {
      setFormData(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.updateContent(formData);
      setContent(formData);
      setEditing(false);
      success('Contenu sauvegardé avec succès');
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

  return (
    <div className={styles.editPanel}>
      <div className={styles.header}>
        <button
          className={`${styles.toggleBtn} ${editing ? styles.active : ''}`}
          onClick={() => setEditing(!editing)}
          disabled={loading}
          title={editing ? 'Réduire' : 'Modifier'}
        >
          {editing ? '▼ Modifier' : '▶ Modifier'}
        </button>
      </div>

      {editing && (
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}

          <JsonEditor
            data={formData}
            onChange={handleChange}
            disabled={loading}
          />

          <div className={styles.actions}>
            <button
              onClick={handleSave}
              disabled={loading}
              className={styles.saveBtn}
            >
              {loading ? '⏳' : '✓'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className={styles.cancelBtn}
            >
              ✕
            </button>
            <button
              onClick={loadHistory}
              disabled={loading}
              className={styles.historyBtn}
              title="Historique"
            >
              📋
            </button>
          </div>

          {showHistory && (
            <HistoryModal
              history={history}
              loading={historyLoading}
              onRestore={handleRestore}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function HistoryModal({ history, loading, onRestore, onClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Historique</h3>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : history.length === 0 ? (
          <p className={styles.empty}>Aucun historique</p>
        ) : (
          <div className={styles.historyList}>
            {history.map((version, idx) => (
              <div key={idx} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <strong>V{history.length - idx}</strong>
                  <p className={styles.date}>
                    {new Date(version.updated_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onRestore(version)}
                  className={styles.restoreBtn}
                >
                  Restaurer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
