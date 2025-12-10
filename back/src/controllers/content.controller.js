/**
 * Content Controller
 * Gère les opérations CRUD sur le contenu global
 */

const contentModel = require('../models/content.model');
const { validate, contentUpdateSchema } = require('../utils/validators');
const log = require('../utils/logger');
const { sendValidationError } = require('../utils/validation.helpers');

/**
 * Récupère le contenu global
 * GET /content
 */
const getContent = async (req, res, next) => {
  try {
    const result = await contentModel.getContent();
    log.info('Content retrieved by:', req.user.email);
    // Renvoyer avec wrapping pour cohérence avec le frontend
    res.json({
      content: result.content || {},
      id: result.id,
      updated_at: result.updated_at
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Met à jour le contenu global (remplacement complet)
 * PUT /content
 */
const updateContent = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Validation
    const { error } = validate(contentUpdateSchema, { data });
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      return sendValidationError(res, errorMessage);
    }

    // Update
    const result = await contentModel.updateContent(data, req.user.id);

    log.info('Content updated by:', req.user.email);
    res.json({
      content: result.content || {},
      id: result.id,
      updated_at: result.updated_at
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};

/**
 * Met à jour partiellement le contenu (merge)
 * PATCH /content
 */
const patchContent = async (req, res, next) => {
  try {
    const { data: partialData } = req.body;

    // Validation
    const { error } = validate(contentUpdateSchema, { data: partialData });
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      return sendValidationError(res, errorMessage);
    }

    // Patch (merge)
    const result = await contentModel.patchContent(partialData, req.user.id);

    log.info('Content patched by:', req.user.email);
    res.json({
      content: result.content || {},
      id: result.id,
      updated_at: result.updated_at
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};

/**
 * Récupère l'historique du contenu
 * GET /content/history?limit=20
 */
const getContentHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100

    const versions = await contentModel.getContentHistory(limit);

    log.info('Content history retrieved by:', req.user.email);
    res.json({ versions });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = {
  getContent,
  updateContent,
  patchContent,
  getContentHistory,
};
