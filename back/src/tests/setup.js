/**
 * Configuration setup pour les tests Jest
 */
require('dotenv').config();

// Définir des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.ACCESS_TOKEN_EXPIRE_MINUTES = '30';
process.env.REFRESH_TOKEN_EXPIRE_DAYS = '7';
