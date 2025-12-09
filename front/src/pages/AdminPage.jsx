import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import styles from './AdminPage.module.css';

/**
 * US-2.3: Page de gestion des administrateurs
 * - Affichage de la liste des admins
 * - Formulaire CRUD (créer, éditer, supprimer)
 * - Gestion des rôles (admin ↔ superadmin)
 */
export function AdminPage() {
  const { user: currentUser } = useAuth();
  const { success, error: notifyError } = useNotification();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    is_active: true
  });

  // Charger la liste des admins
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listAdmins();
      // API returns array directly, not { admins: [...] }
      setAdmins(Array.isArray(data) ? data : (data.admins || []));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleCreate = async () => {
    if (!formData.email) {
      setError('Email est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.createAdmin(formData);
      setFormData({ email: '', password: '', role: 'admin' });
      setShowForm(false);
      success('Administrateur créé avec succès');
      await loadAdmins();
    } catch (err) {
      const msg = err.message || 'Erreur lors de la création de l\'administrateur';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.email) {
      setError('Email est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updateData = {};
      if (formData.password) {
        updateData.password = formData.password;
      }
      // Allow updating is_active for other admins
      if (editingId !== currentUser?.id) {
        updateData.is_active = formData.is_active;
      }
      await api.updateAdmin(editingId, updateData);
      setFormData({ email: '', password: '', role: 'admin', is_active: true });
      setEditingId(null);
      setShowForm(false);
      success('Administrateur mis à jour avec succès');
      await loadAdmins();
    } catch (err) {
      const msg = err.message || 'Erreur lors de la mise à jour';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.deleteAdmin(id);
      success('Administrateur supprimé avec succès');
      await loadAdmins();
    } catch (err) {
      const msg = err.message || 'Erreur lors de la suppression';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setFormData({
      email: admin.email,
      password: '',
      role: admin.role,
      is_active: admin.is_active
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ email: '', password: '', role: 'admin', is_active: true });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && admins.length === 0) {
    return (
      <div className={styles.container}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestion des Administrateurs</h2>
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ email: '', password: '', role: 'admin', is_active: true });
              setShowForm(true);
            }}
            disabled={loading}
            className={styles.primaryButton}
          >
            Ajouter un administrateur
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm ? (
        <AdminForm
          data={formData}
          onChange={handleChange}
          onSave={editingId ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          loading={loading}
          isEditing={!!editingId}
          editingId={editingId}
          currentUser={currentUser}
        />
      ) : (
        <AdminList
          admins={admins}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/**
 * Formulaire CRUD pour administrateurs
 */
function AdminForm({ data, onChange, onSave, onCancel, loading, isEditing, editingId, currentUser }) {
  return (
    <div className={styles.formContainer}>
      <h3>{isEditing ? 'Modifier l\'administrateur' : 'Créer un administrateur'}</h3>

      <form>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={onChange}
            disabled={loading || isEditing}
            placeholder="admin@example.com"
            required
          />
        </div>
        {isEditing && editingId === currentUser?.id && (
          <div className={styles.formGroup}>
            <label htmlFor="password">
              Mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={onChange}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
        )}

        {isEditing && editingId !== currentUser?.id && (
          <div className={styles.formGroup}>
            <label htmlFor="is_active">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={data.is_active}
                onChange={onChange}
                disabled={loading}
              />
              {' '}Compte actif
            </label>
          </div>
        )}

        {!isEditing && (
          <div className={styles.infoBox}>
            <p>Un email d'invitation sera envoyé avec un lien pour créer le mot de passe.</p>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? 'En cours...' : 'Sauvegarder'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={styles.secondaryButton}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Liste des administrateurs
 */
function AdminList({ admins, loading, onEdit, onDelete }) {
  if (admins.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Aucun administrateur pour le moment</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.email}</td>
              <td>
                <span className={`${styles.badge} ${styles[admin.role]}`}>
                  {admin.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                </span>
              </td>
              <td>{new Date(admin.created_at).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <button
                  onClick={() => onEdit(admin)}
                  disabled={loading}
                  className={styles.editButton}
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDelete(admin.id)}
                  disabled={loading}
                  className={styles.deleteButton}
                  title="Supprimer"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
