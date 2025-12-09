const { query } = require('../config/db');
const { hashPassword } = require('../utils/auth');
const { validate, adminCreateSchema, adminUpdateSchema } = require('../utils/validators');
const log = require('../utils/logger');
const crypto = require('crypto');

/**
 * Crée un nouvel admin
 * @param {string} email - Email de l'admin
 * @param {string} password - Mot de passe en clair
 * @param {string} role - Role ('admin' ou 'superadmin')
 * @returns {Promise<object>} Admin créé (sans mot de passe)
 */
const createAdmin = async (email, password, role = 'admin') => {
  // Validation
  const { error, value } = validate(adminCreateSchema, { email, password });
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

    // Valider le role
    if (!['admin', 'superadmin'].includes(role)) {
      const err = new Error('Invalid role');
      err.status = 400;
      throw err;
    }

    // Hash le mot de passe
    const passwordHash = await hashPassword(password);

    // Insère l'admin
    const res = await query(
      'INSERT INTO admins (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, is_active, created_at',
      [email, passwordHash, role]
    );

    log.info('Admin created:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    log.error('Error creating admin:', error);
    throw error;
  }
};

/**
 * Crée un nouvel admin sans password (invitation par email)
 * @param {string} email - Email de l'admin
 * @param {string} resetToken - Token de réinitialisation
 * @param {Date} tokenExpiry - Expiration du token
 * @param {string} role - Role ('admin' ou 'superadmin')
 * @returns {Promise<object>} Admin créé (sans mot de passe)
 */
const createAdminInvite = async (email, resetToken, tokenExpiry, role = 'admin') => {
  try {
    // Vérifier si l'email existe
    const existingEmail = await query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      const err = new Error('Email already exists');
      err.status = 409;
      throw err;
    }

    // Valider le role
    if (!['admin', 'superadmin'].includes(role)) {
      const err = new Error('Invalid role');
      err.status = 400;
      throw err;
    }

    // Insérer l'admin sans password_hash (NULL), avec token de reset et is_active=false
    const res = await query(
      'INSERT INTO admins (email, password_hash, role, password_reset_token, password_reset_expires, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, is_active, created_at',
      [email, null, role, resetToken, tokenExpiry, false]
    );

    log.info('Admin invited:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    log.error('Error creating admin invite:', error);
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
    const res = await query('SELECT id, email, password_hash, role, is_active FROM admins WHERE email = $1', [email]);
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
      'SELECT id, email, role, is_active, created_at, updated_at FROM admins WHERE id = $1',
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
      'SELECT id, email, role, is_active, created_at, updated_at FROM admins ORDER BY created_at DESC'
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
      'UPDATE admins SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, role, is_active, updated_at',
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

/**
 * Obtient un admin par le token de reset password
 * @param {string} token - Token de reset
 * @returns {Promise<object>} Admin trouvé ou null
 */
const getAdminByResetToken = async (token) => {
  try {
    const res = await query(
      'SELECT id, email, role, is_active, password_reset_expires FROM admins WHERE password_reset_token = $1 AND password_reset_expires > CURRENT_TIMESTAMP',
      [token]
    );
    return res.rows[0] || null;
  } catch (error) {
    log.error('Error getting admin by reset token:', error);
    throw error;
  }
};

/**
 * Définit le password et efface le token de reset
 * @param {number} id - ID de l'admin
 * @param {string} password - Nouveau mot de passe
 * @returns {Promise<object>} Admin mis à jour
 */
const setPasswordFromReset = async (id, password) => {
  try {
    // Hash le mot de passe
    const passwordHash = await hashPassword(password);

    // Mettre à jour le password, activer l'admin et effacer les tokens
    const res = await query(
      'UPDATE admins SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, role, is_active',
      [passwordHash, id]
    );

    if (res.rows.length === 0) {
      const err = new Error('Admin not found');
      err.status = 404;
      throw err;
    }

    log.info('Admin password set from reset token:', id);
    return res.rows[0];
  } catch (error) {
    log.error('Error setting password from reset:', error);
    throw error;
  }
};

module.exports = {
  createAdmin,
  createAdminInvite,
  getAdminByEmail,
  getAdminById,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin,
  getAdminByResetToken,
  setPasswordFromReset,
};
