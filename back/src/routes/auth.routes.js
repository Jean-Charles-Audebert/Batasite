const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Authenticate and get access token
 * @route POST /auth/login
 * @body {Object} credentials - {email, password}
 * @returns {Object} Access token, refresh token, admin data
 */
router.post('/login', authController.login);

/**
 * Refresh access token using refresh token
 * @route POST /auth/refresh
 * @body {Object} token - {refreshToken}
 * @returns {Object} New access token
 */
router.post('/refresh', authController.refresh);

/**
 * Logout (invalidate tokens)
 * @route POST /auth/logout
 * @auth Required
 * @returns {Object} Logout confirmation
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * Set password from invitation token
 * @route POST /auth/set-password
 * @body {Object} data - {token, password, confirmPassword}
 * @returns {Object} Updated admin data
 */
router.post('/set-password', authController.setPasswordFromInvite);

/**
 * Get current authenticated user
 * @route GET /auth/me
 * @auth Required
 * @returns {Object} Current admin data
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
