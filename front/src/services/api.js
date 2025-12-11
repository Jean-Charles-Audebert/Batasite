/**
 * API Service - Utilise uniquement l'API Fetch native
 * Pas de dépendance externe
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Effectue une requête HTTP
   * @param {string} endpoint - URL endpoint (ex: '/auth/login')
   * @param {object} options - Options fetch (method, body, etc.)
   * @returns {Promise<object>}
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Ajouter le token d'accès si disponible
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Si 401, essayer de rafraîchir le token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Réessayer la requête avec le nouveau token
          return this.request(endpoint, options);
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Authentification - Login
   */
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  /**
   * Authentification - Logout
   */
  async logout() {
    try {
      await this.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout error:', error.message);
    }
    this.clearTokens();
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Sauvegarder les tokens
   */
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Effacer les tokens
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Vérifier si utilisateur est authentifié
   */
  isAuthenticated() {
    return !!this.accessToken;
  }

  // ========== CONTENT ENDPOINTS ==========

  /**
   * Récupérer le contenu global
   */
  getContent() {
    return this.get('/content');
  }

  /**
   * Mettre à jour le contenu global
   */
  updateContent(data) {
    return this.put('/content', { data });
  }

  /**
   * Patch du contenu (merge partiel)
   */
  patchContent(data) {
    return this.patch('/content', { data });
  }

  /**
   * Récupérer l'historique du contenu
   */
  getContentHistory(page = 1, limit = 10) {
    return this.get(`/content/history?page=${page}&limit=${limit}`);
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Lister les admins
   */
  listAdmins(role = null) {
    const query = role ? `?role=${role}` : '';
    return this.get(`/admin${query}`);
  }

  /**
   * Créer un nouvel admin
   */
  createAdmin(data) {
    return this.post('/admin', data);
  }

  /**
   * Récupérer un admin
   */
  getAdmin(id) {
    return this.get(`/admin/${id}`);
  }

  /**
   * Mettre à jour un admin
   */
  updateAdmin(id, data) {
    return this.patch(`/admin/${id}`, data);
  }

  /**
   * Supprimer un admin
   */
  deleteAdmin(id) {
    return this.delete(`/admin/${id}`);
  }

  /**
   * Récupérer l'activité d'un admin
   */
  getAdminActivity(id, page = 1, limit = 20) {
    return this.get(`/admin/${id}/activity?page=${page}&limit=${limit}`);
  }

  /**
   * Envoyer un message de contact
   */
  sendContact(name, email, message) {
    return this.post('/contact/send', {
      name,
      email,
      message,
    });
  }
}

export default new ApiService();
