const { query } = require('../config/db');
const { validate, contentUpdateSchema } = require('../utils/validators');
const log = require('../utils/logger');

/**
 * Récupère le contenu global
 * @returns {Promise<object>} Contenu du site
 */
const getContent = async () => {
  try {
    const res = await query(
      'SELECT id, content, updated_at FROM content ORDER BY id DESC LIMIT 1'
    );

    if (res.rows.length === 0) {
      // Crée un contenu par défaut si aucun n'existe
      const defaultContent = await query(
        'INSERT INTO content (content) VALUES ($1) RETURNING id, content, updated_at',
        ['{}']
      );
      return defaultContent.rows[0];
    }

    return res.rows[0];
  } catch (error) {
    log.error('Error getting content:', error);
    throw error;
  }
};

/**
 * Met à jour le contenu global
 * @param {object} data - Données à mettre à jour
 * @param {number} adminId - ID de l'admin qui effectue la mise à jour
 * @returns {Promise<object>} Contenu mis à jour
 */
const updateContent = async (data, adminId) => {
  // Validation
  const { error } = validate(contentUpdateSchema, { data });
  if (error) {
    const err = new Error(error.details.map(d => d.message).join(', '));
    err.status = 400;
    throw err;
  }

  try {
    // Récupère le contenu existant ou en crée un
    let contentId;
    const existing = await query('SELECT id FROM content ORDER BY id DESC LIMIT 1');

    if (existing.rows.length === 0) {
      const created = await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2) RETURNING id',
        [JSON.stringify(data), adminId]
      );
      contentId = created.rows[0].id;
    } else {
      contentId = existing.rows[0].id;
    }

    // Met à jour le contenu
    const res = await query(
      'UPDATE content SET content = $1, updated_at = CURRENT_TIMESTAMP, updated_by = $2 WHERE id = $3 RETURNING id, content, updated_at, updated_by',
      [JSON.stringify(data), adminId, contentId]
    );

    log.info('Content updated by admin:', adminId);
    return res.rows[0];
  } catch (error) {
    log.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Récupère l'historique du contenu
 * @param {number} limit - Nombre de versions à récupérer
 * @returns {Promise<array>} Historique du contenu
 */
const getContentHistory = async (limit = 20) => {
  try {
    const res = await query(
      `SELECT c.id, c.content, c.updated_at, a.email 
       FROM content c
       LEFT JOIN admins a ON c.updated_by = a.id
       ORDER BY c.updated_at DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (error) {
    log.error('Error getting content history:', error);
    throw error;
  }
};

/**
 * Fusionne (patch) le contenu existant avec les nouvelles données
 * @param {object} partialData - Données partielles à fusionner
 * @param {number} adminId - ID de l'admin
 * @returns {Promise<object>} Contenu fusionné
 */
const patchContent = async (partialData, adminId) => {
  try {
    // Récupère le contenu existant
    const existing = await getContent();
    const currentData = existing.content || {};

    // Fusion profonde (simple pour le moment)
    const mergedData = { ...currentData, ...partialData };

    // Met à jour avec les données fusionnées
    return await updateContent(mergedData, adminId);
  } catch (error) {
    log.error('Error patching content:', error);
    throw error;
  }
};

module.exports = {
  getContent,
  updateContent,
  getContentHistory,
  patchContent,
};
