const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

// All admin routes require authentication
router.use(authMiddleware);

/**
 * List all admins with optional role filtering
 * @route GET /admin
 * @query {string} [role] - Optional role filter (admin|superadmin)
 * @returns {Array<Object>} Array of admin objects
 */
router.get('/', adminController.getAllAdmins);

/**
 * Create a new admin
 * @route POST /admin
 * @body {Object} {email, password, role}
 * @returns {Object} Created admin object
 */
router.post('/', adminController.createAdmin);

/**
 * Fetch single admin by ID
 * @route GET /admin/:id
 * @param {number} id - Admin ID
 * @returns {Object} Admin object
 */
router.get('/:id', adminController.getAdminById);

/**
 * Fetch admin activity log
 * @route GET /admin/:id/activity
 * @param {number} id - Admin ID
 * @returns {Array} Activity log entries
 */
router.get('/:id/activity', adminController.getAdminActivity);

/**
 * Update admin role or active status
 * @route PATCH /admin/:id
 * @param {number} id - Admin ID
 * @body {Object} Update data (role, is_active)
 * @returns {Object} Updated admin object
 */
router.patch('/:id', adminController.updateAdmin);

/**
 * Delete admin account
 * @route DELETE /admin/:id
 * @param {number} id - Admin ID
 * @returns {Object} Success message
 */
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
