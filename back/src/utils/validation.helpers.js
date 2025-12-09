/**
 * Validation helpers for controllers
 */

/**
 * Validate numeric ID parameter
 * @param {string|number} id - ID to validate
 * @returns {{ valid: boolean, id: number | null }}
 */
exports.validateNumericId = (id) => {
  if (isNaN(id) || !id) {
    return { valid: false, id: null };
  }
  return { valid: true, id: parseInt(id) };
};

/**
 * Send 400 Bad Request with validation error
 */
exports.sendValidationError = (res, message = 'Invalid request parameters') => {
  res.status(400).json({ error: message });
};

/**
 * Send 401 Unauthorized
 */
exports.sendUnauthorized = (res, message = 'Unauthorized') => {
  res.status(401).json({ error: message });
};

/**
 * Send 403 Forbidden
 */
exports.sendForbidden = (res, message = 'Forbidden') => {
  res.status(403).json({ error: message });
};

/**
 * Send 404 Not Found
 */
exports.sendNotFound = (res, message = 'Resource not found') => {
  res.status(404).json({ error: message });
};

/**
 * Send success response
 */
exports.sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};
