const { verifyToken } = require('../utils/auth');

/**
 * Middleware d'authentification
 * Vérifie le JWT dans l'header Authorization
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token, process.env.JWT_SECRET);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
};

module.exports = authMiddleware;
