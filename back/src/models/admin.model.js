const { query } = require('../config/db');
const { hashPassword, verifyPassword } = require('../utils/auth');
const { validate, adminCreateSchema, adminUpdateSchema } = require('../utils/validators');
const log = require('../utils/logger');

/**
 * Crée un nouvel admin
 * @param {string} email - Email de l'admin
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<object>} Admin créé (sans mot de passe)
 */
const createAdmin = async (email, username, password) => {
  // Validation
  const { error, value } = validate(adminCreateSchema, { email, username, password });
  if (error) {
    const err = new Error(error.details.map(d => d.message).join(', '));
    err.status = 400;
    throw err;
  }

  try {
    // Vérifier si l'email existe
    const existingEmail = await query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      const err = new Error('Email already exists');
      err.status = 409;
      throw err;
    }

    // Vérifier si l'username existe
    const existingUsername = await query('SELECT id FROM admins WHERE username = $1', [username]);
    if (existingUsername.rows.length > 0) {
      const err = new Error('Username already exists');
      err.status = 409;
      throw err;
    }

    // Hash le mot de passe
    const passwordHash = await hashPassword(password);

    // Insère l'admin
    const res = await query(
      'INSERT INTO admins (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, is_active, created_at',
      [email, username, passwordHash]
    );

    log.info('Admin created:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    log.error('Error creating admin:', error);
    throw error;
  }
};

/**
 * Récupère un admin par email
 * @param {string} email - Email de l'admin
 * @returns {Promise<object>} Admin trouvé ou null
 */
const getAdminByEmail = async (email) => {
  try {
    const res = await query('SELECT id, email, username, password_hash, is_active FROM admins WHERE email = $1', [email]);
    return res.rows[0] || null;
  } catch (error) {
    log.error('Error getting admin by email:', error);
    throw error;
  }
};

/**
 * Récupère un admin par ID
 * @param {number} id - ID de l'admin
 * @returns {Promise<object>} Admin trouvé ou null
 */
const getAdminById = async (id) => {
  try {
    const res = await query(
      'SELECT id, email, username, is_active, created_at, updated_at FROM admins WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  } catch (error) {
    log.error('Error getting admin by id:', error);
    throw error;
  }
};

/**
 * Récupère tous les admins
 * @returns {Promise<array>} Liste des admins
 */
const getAllAdmins = async () => {
  try {
    const res = await query(
      'SELECT id, email, username, is_active, created_at, updated_at FROM admins ORDER BY created_at DESC'
    );
    return res.rows;
  } catch (error) {
    log.error('Error getting all admins:', error);
    throw error;
  }
};

/**
 * Met à jour le statut d'un admin (activation/désactivation)
 * @param {number} id - ID de l'admin
 * @param {boolean} isActive - Nouveau statut
 * @returns {Promise<object>} Admin mis à jour
 */
const updateAdminStatus = async (id, isActive) => {
  // Validation
  const { error } = validate(adminUpdateSchema, { is_active: isActive });
  if (error) {
    const err = new Error(error.details.map(d => d.message).join(', '));
    err.status = 400;
    throw err;
  }

  try {
    const res = await query(
      'UPDATE admins SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, username, is_active, updated_at',
      [isActive, id]
    );

    if (res.rows.length === 0) {
      const err = new Error('Admin not found');
      err.status = 404;
      throw err;
    }

    log.info('Admin status updated:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    log.error('Error updating admin status:', error);
    throw error;
  }
};

/**
 * Supprime un admin
 * @param {number} id - ID de l'admin à supprimer
 * @returns {Promise<boolean>} true si suppression réussie
 */
const deleteAdmin = async (id) => {
  try {
    const res = await query('DELETE FROM admins WHERE id = $1 RETURNING id', [id]);

    if (res.rows.length === 0) {
      const err = new Error('Admin not found');
      err.status = 404;
      throw err;
    }

    log.info('Admin deleted:', id);
    return true;
  } catch (error) {
    log.error('Error deleting admin:', error);
    throw error;
  }
};

module.exports = {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin,
};
