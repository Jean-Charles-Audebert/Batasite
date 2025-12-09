const { pool } = require('../config/db');
const logger = require('../utils/logger');
const adminModel = require('../models/admin.model');
const { validateNumericId, sendValidationError, sendNotFound } = require('../utils/validation.helpers');

/**
 * POST /admin - Create a new admin
 */
exports.createAdmin = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return sendValidationError(res, 'Email and password are required');
    }

    // Validate role if provided
    if (role && !['admin', 'superadmin'].includes(role)) {
      return sendValidationError(res, 'Invalid role. Must be admin or superadmin');
    }

    // Create admin via model (handles duplicate check)
    const admin = await adminModel.createAdmin(email, password, role || 'admin');

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
 * GET /admin - List all admins (with optional role filter)
 */
exports.getAllAdmins = async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = 'SELECT id, email, role, is_active, created_at FROM admins';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
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

    // Check if admin exists
    const adminCheck = await pool.query('SELECT id FROM admins WHERE id = $1', [validatedId]);
    if (adminCheck.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
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

    // Check if admin exists
    const adminCheck = await pool.query('SELECT email FROM admins WHERE id = $1', [validatedId]);
    if (adminCheck.rows.length === 0) {
      return sendNotFound(res, 'Admin not found');
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
