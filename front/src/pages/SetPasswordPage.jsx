import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './SetPasswordPage.module.css';

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token manquant. Lien d\'invitation invalide.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return;
    }

    if (!formData.confirmPassword) {
      setError('La confirmation du mot de passe est requise');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/set-password', {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess('Mot de passe créé avec succès !');
      setFormData({ password: '', confirmPassword: '' });

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du mot de passe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Lien d'invitation invalide</h1>
          <p className={styles.errorMessage}>Le lien d'invitation est manquant ou expiré.</p>
          <button onClick={() => navigate('/login')} className={styles.btn}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Créer votre mot de passe</h1>
        <p className={styles.subtitle}>Définissez un mot de passe sécurisé pour votre compte administrateur</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 caractères"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.btnPrimary}
          >
            {loading ? 'Création en cours...' : 'Créer mon mot de passe'}
          </button>
        </form>

        <p className={styles.infoText}>
          Après création, vous pourrez vous connecter avec votre email et votre nouveau mot de passe.
        </p>
      </div>
    </div>
  );
}
