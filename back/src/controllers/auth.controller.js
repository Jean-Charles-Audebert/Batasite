const adminModel = require('../models/admin.model');
const { verifyPassword, generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/auth');
const { validate, loginSchema } = require('../utils/validators');
const log = require('../utils/logger');

/**
 * Login - Authentifier un admin
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { error, value } = validate(loginSchema, req.body);
    if (error) {
      const err = new Error(error.details.map(d => d.message).join(', '));
      err.status = 400;
      return next(err);
    }

    const { email, password } = value;

    // Récupère l'admin
    const admin = await adminModel.getAdminByEmail(email);
    if (!admin) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }

    // Vérifie si actif
    if (!admin.is_active) {
      const err = new Error('Account is inactive');
      err.status = 403;
      return next(err);
    }

    // Vérifie le mot de passe
    const isPasswordValid = await verifyPassword(password, admin.password_hash);
    if (!isPasswordValid) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      return next(err);
    }

    // Génère les tokens
    const accessToken = generateAccessToken({
      id: admin.id,
      email: admin.email,
    });

    const refreshToken = generateRefreshToken({
      id: admin.id,
      email: admin.email,
    });

    // Retourne sans le hash du mot de passe
    const { password_hash, ...adminData } = admin;

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      admin: adminData,
    });

    log.info(`Admin logged in: ${admin.email}`);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Refresh - Rafraîchir le token d'accès
 * POST /api/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const err = new Error('Refresh token is required');
      err.status = 400;
      return next(err);
    }

    // Vérifie le refresh token
    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!payload) {
      const err = new Error('Invalid or expired token');
      err.status = 401;
      return next(err);
    }

    // Vérifie que l'admin existe toujours
    const admin = await adminModel.getAdminById(payload.id);
    if (!admin || !admin.is_active) {
      const err = new Error('Admin not found or inactive');
      err.status = 403;
      return next(err);
    }

    // Génère un nouveau access token
    const accessToken = generateAccessToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      message: 'Token refreshed',
      accessToken,
    });

    log.info(`Token refreshed for admin: ${admin.email}`);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Logout - Déconnecter un admin
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const admin = req.user; // Depuis le middleware auth

    res.json({
      message: 'Logout successful',
    });

    log.info(`Admin logged out: ${admin.email}`);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Set Password from Invite - Créer un password après invitation
 * POST /api/auth/set-password
 */
const setPasswordFromInvite = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Validation
    if (!token || !password || !confirmPassword) {
      const err = new Error('Token, password and confirmPassword are required');
      err.status = 400;
      return next(err);
    }

    if (password !== confirmPassword) {
      const err = new Error('Passwords do not match');
      err.status = 400;
      return next(err);
    }

    if (password.length < 8) {
      const err = new Error('Password must be at least 8 characters long');
      err.status = 400;
      return next(err);
    }

    // Récupère l'admin avec le token valide
    const admin = await adminModel.getAdminByResetToken(token);
    if (!admin) {
      const err = new Error('Invalid or expired reset token');
      err.status = 400;
      return next(err);
    }

    // Définit le password
    const updatedAdmin = await adminModel.setPasswordFromReset(admin.id, password);

    log.info(`Admin password set from invitation: ${admin.email}`);

    res.json({
      message: 'Password set successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Get current user info
 * GET /api/auth/me
 * @auth Required
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const admin = await adminModel.getAdminById(req.user.id);
    if (!admin) {
      const err = new Error('Admin not found');
      err.status = 404;
      return next(err);
    }

    // Retourne sans le hash du mot de passe
    const { password_hash, ...adminData } = admin;

    res.json({
      data: adminData,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
  setPasswordFromInvite,
  getCurrentUser,
};
