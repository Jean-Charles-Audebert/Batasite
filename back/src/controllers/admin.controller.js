const { pool } = require('../config/db');
const logger = require('../utils/logger');

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

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }

    const result = await pool.query(
      'SELECT id, email, role, is_active, created_at FROM admins WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    logger.info(`Admin ${id} retrieved by: ${req.user.email}`);
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

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }

    // First check if admin exists
    const adminCheck = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [id]
    );

    if (adminCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Get activity log from content history or audit table if available
    // For now, return empty array as placeholder
    const activity = [];

    logger.info(`Admin ${id} activity retrieved by: ${req.user.email}`);
    res.json(activity);
  } catch (error) {
    logger.error(`Error fetching admin activity: ${error.message}`);
    next(error);
  }
};

/**
 * PATCH /admin/:id - Update admin
 */
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active, role } = req.body;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }

    // Prevent updating email or password
    if (req.body.email || req.body.password) {
      return res.status(400).json({ error: 'Cannot update email or password via this endpoint' });
    }

    // Check if admin exists
    const checkRes = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [id]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [id];
    let paramCount = 2;

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    if (role !== undefined) {
      updates.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = $1 RETURNING id, email, role, is_active, created_at`;
    const result = await pool.query(query, values);

    logger.info(`Admin ${id} updated by: ${req.user.email}`);
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
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid admin ID format' });
    }

    // Prevent self-deletion
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({ error: 'You cannot delete your own account' });
    }

    // Check if admin exists
    const checkRes = await pool.query(
      'SELECT id FROM admins WHERE id = $1',
      [id]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Delete the admin
    await pool.query('DELETE FROM admins WHERE id = $1', [id]);

    // Clean up related data (content updates by this admin)
    await pool.query('UPDATE content SET updated_by = NULL WHERE updated_by = $1', [id]);

    logger.info(`Admin ${id} deleted by: ${req.user.email}`);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting admin: ${error.message}`);
    next(error);
  }
};
