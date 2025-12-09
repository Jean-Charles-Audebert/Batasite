/**
 * Routes pour la gestion du contenu
 * POST /content - GET /content
 * PUT /content - PATCH /content
 * GET /content/history
 */

const express = require('express');
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Middleware de protection: tous les endpoints content requièrent auth
 */
router.use(authMiddleware);

/**
 * GET /content
 * Récupère le contenu global
 */
router.get('/', contentController.getContent);

/**
 * PUT /content
 * Met à jour le contenu complètement (remplacement)
 */
router.put('/', contentController.updateContent);

/**
 * PATCH /content
 * Met à jour le contenu partiellement (merge)
 */
router.patch('/', contentController.patchContent);

/**
 * GET /content/history
 * Récupère l'historique des versions
 * Query params: ?limit=20
 */
router.get('/history', contentController.getContentHistory);

module.exports = router;
