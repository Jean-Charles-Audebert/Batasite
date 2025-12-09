const { hash, verify } = require('argon2');
const jwt = require('jsonwebtoken');

/**
 * Hash un mot de passe avec argon2id
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} Hash du mot de passe
 */
const hashPassword = async (password) => {
  try {
    return await hash(password, {
      type: 2, // argon2id
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

/**
 * Vérifie un mot de passe contre son hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash du mot de passe
 * @returns {Promise<boolean>} true si le mot de passe correspond
 */
const verifyPassword = async (password, passwordHash) => {
  try {
    return await verify(passwordHash, password);
  } catch (error) {
    return false;
  }
};

/**
 * Génère un JWT access token
 * @param {object} payload - Données à encoder
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 30}m`,
  });
};

/**
 * Génère un JWT refresh token
 * @param {object} payload - Données à encoder
 * @returns {string} JWT token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_DAYS || 7}d`,
  });
};

/**
 * Vérifie un JWT token
 * @param {string} token - Token à vérifier
 * @param {string} secret - Secret à utiliser
 * @returns {object} Payload décodé ou null
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
