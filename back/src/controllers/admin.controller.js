const { pool } = require('../config/db');
const logger = require('../utils/logger');
const adminModel = require('../models/admin.model');
const emailService = require('../services/email.service');
const { validateNumericId, sendValidationError, sendNotFound } = require('../utils/validation.helpers');
const crypto = require('crypto');

/**
 * POST /admin - Create a new admin with invitation email
 */
exports.createAdmin = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    // Validate required fields
    if (!email) {
      return sendValidationError(res, 'Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendValidationError(res, 'Invalid email format');
    }

    // Validate role if provided
    if (role && !['admin', 'superadmin'].includes(role)) {
      return sendValidationError(res, 'Invalid role. Must be admin or superadmin');
    }

    // Générer un token de reset unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expire dans 24h

    // Create admin via model with invitation
    const admin = await adminModel.createAdminInvite(email, resetToken, tokenExpiry, role || 'admin');

    // Envoyer l'email d'invitation
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
      await emailService.sendPasswordInviteEmail(email, resetToken, baseUrl);
    } catch (emailError) {
      logger.warn(`Failed to send invitation email to ${email}, but admin was created`);
      // On continue même si l'email échoue, l'admin est créé
    }

    logger.info(`Admin created by ${req.user.email}: ${email} (${admin.role})`);
    res.status(201).json(admin);
  } catch (error) {
    if (error.message.includes('already exists')) {
      return sendValidationError(res, error.message);
    }
    logger.error(`Error creating admin: ${error.message}`);
    next(error);
  }
};

/**
 * GET /admin - List all admins (excluding superadmins, with optional role filter)
 */
exports.getAllAdmins = async (req, res, next) => {
  try {
    // Always return only regular admins (not superadmins)
    const query = 'SELECT id, email, role, is_active, created_at FROM admins WHERE role = \'admin\' ORDER BY created_at DESC';
    const result = await pool.query(query);
    logger.info(`Admin list retrieved by: ${req.user.email}`);
    res.json(result.rows);
  } catch (error) {
    logger.error(`Error fetching admins: ${error.message}`);
    next(error);
  }
};

/**
 * GET /admin/:id - Fetch single admin by ID
 */
exports.getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valid, id: validatedId } = validateNumericId(id);

    if (!valid) {
      return sendValidationError(res, 'Invalid admin ID format');
    }

    const result = await pool.query(
      'SELECT id, email, role, is_active, created_at FROM admins WHERE id = $1',
      [validatedId]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
    }

    logger.info(`Admin ${validatedId} retrieved by: ${req.user.email}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error(`Error fetching admin: ${error.message}`);
    next(error);
  }
};

/**
 * GET /admin/:id/activity - Fetch admin activity log
 */
exports.getAdminActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valid, id: validatedId } = validateNumericId(id);

    if (!valid) {
      return sendValidationError(res, 'Invalid admin ID format');
    }

    // First check if admin exists
    const adminCheck = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [validatedId]
    );

    if (adminCheck.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
    }

    // Get activity log from content history or audit table if available
    // For now, return empty array as placeholder
    const activity = [];

    logger.info(`Admin ${validatedId} activity retrieved by: ${req.user.email}`);
    res.json(activity);
  } catch (error) {
    logger.error(`Error fetching admin activity: ${error.message}`);
    next(error);
  }
};

/**
 * PATCH /admin/:id - Update admin role, password, or is_active
 */
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, is_active, password } = req.body;

    // Validate ID is a number
    const { valid, id: validatedId } = validateNumericId(id);
    if (!valid) {
      return sendValidationError(res, 'Invalid admin ID format');
    }

    // Prevent updating email
    if (req.body.email) {
      return sendValidationError(res, 'Cannot update email via PATCH');
    }

    // Validate at least one field is being updated
    if (!role && is_active === undefined && !password) {
      return sendValidationError(res, 'Provide role, password, or is_active to update');
    }

    // Check if admin exists and get their role
    const adminCheck = await pool.query('SELECT id, role FROM admins WHERE id = $1', [validatedId]);
    if (adminCheck.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
    }

    // Prevent modifying superadmins
    if (adminCheck.rows[0].role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot modify superadmin' });
    }

    // Security: Only the admin themselves or a superadmin can change password
    if (password) {
      // req.user.id is the ID of the authenticated user making the request
      // validatedId is the ID of the admin being modified
      const currentUserIsSuperadmin = req.user.role === 'superadmin';
      const isModifyingSelf = parseInt(req.user.id) === parseInt(validatedId);
      
      if (!isModifyingSelf && !currentUserIsSuperadmin) {
        return res.status(403).json({ error: 'You can only change your own password' });
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (role) {
      updates.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(is_active);
      paramIndex++;
    }

    // Handle password update
    if (password) {
      const { hashPassword } = require('../utils/auth');
      const passwordHash = await hashPassword(password);
      updates.push(`password_hash = $${paramIndex}`);
      values.push(passwordHash);
      paramIndex++;
    }

    // Set updated_at
    updates.push(`updated_at = NOW()`);

    values.push(validatedId); // For WHERE clause

    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, role, is_active, updated_at`;
    const result = await pool.query(query, values);

    logger.info(`Admin ${validatedId} updated by: ${req.user.email} (role: ${role}, password: ${password ? 'changed' : 'unchanged'}, is_active: ${is_active})`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error(`Error updating admin: ${error.message}`);
    next(error);
  }
};

/**
 * DELETE /admin/:id - Delete admin
 */
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    const { valid, id: validatedId } = validateNumericId(id);
    if (!valid) {
      return sendValidationError(res, 'Invalid admin ID format');
    }

    // Prevent self-deletion
    if (validatedId === req.user.id) {
      return res.status(403).json({ error: 'Cannot delete yourself' });
    }

    // Check if admin exists and get their role
    const adminCheck = await pool.query('SELECT email, role FROM admins WHERE id = $1', [validatedId]);
    if (adminCheck.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
    }

    // Prevent deleting superadmins
    if (adminCheck.rows[0].role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot delete superadmin' });
    }

    const deletedEmail = adminCheck.rows[0].email;

    // Delete admin
    await pool.query('DELETE FROM admins WHERE id = $1', [validatedId]);

    logger.info(`Admin ${validatedId} (${deletedEmail}) deleted by: ${req.user.email}`);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting admin: ${error.message}`);
    next(error);
  }
};
