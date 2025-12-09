const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Register new admin account
 * @route POST /auth/register
 * @body {Object} credentials - {email, password, role?}
 * @returns {Object} Created admin with ID
 */
router.post('/register', authController.register);

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

module.exports = router;
