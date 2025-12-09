const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

// All admin routes require authentication
router.use(authMiddleware);

// Read operations
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.get('/:id/activity', adminController.getAdminActivity);

// Write operations
router.patch('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
