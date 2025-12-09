const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Routes d'authentification
 */

// Enregistrement
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Rafraîchir le token
router.post('/refresh', authController.refresh);

// Logout (protégé)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
