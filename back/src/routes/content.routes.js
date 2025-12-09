/**
 * Routes pour la gestion du contenu global
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
 * Retrieve global site content
 * @route GET /content
 * @returns {Object} JSONB content object
 */
router.get('/', contentController.getContent);

/**
 * Replace entire content (full update)
 * @route PUT /content
 * @body {Object} data - Complete content object (JSONB)
 * @returns {Object} Updated content with metadata
 */
router.put('/', contentController.updateContent);

/**
 * Partially update content (merge operation)
 * @route PATCH /content
 * @body {Object} data - Partial content to merge
 * @returns {Object} Updated content with metadata
 */
router.patch('/', contentController.patchContent);

/**
 * Retrieve content version history with pagination
 * @route GET /content/history
 * @query {number} [limit=20] - Number of versions to return (max 100)
 * @returns {Array<Object>} Content versions ordered by updated_at DESC
 */
router.get('/history', contentController.getContentHistory);

module.exports = router;
