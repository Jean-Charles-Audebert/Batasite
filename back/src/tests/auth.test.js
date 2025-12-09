/**
 * Tests pour les utilitaires d'authentification
 */
const { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/auth');

describe('Auth Utils', () => {
  describe('Password Hashing', () => {
    test('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    test('should verify a correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    test('should not verify an incorrect password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('WrongPassword', hash);

      expect(isValid).toBe(false);
    });

    test('should handle different passwords independently', async () => {
      const password1 = 'Password1!';
      const password2 = 'Password2!';
      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(hash1).not.toBe(hash2);
      expect(await verifyPassword(password1, hash1)).toBe(true);
      expect(await verifyPassword(password2, hash2)).toBe(true);
      expect(await verifyPassword(password1, hash2)).toBe(false);
      expect(await verifyPassword(password2, hash1)).toBe(false);
    });
  });

  describe('JWT Tokens', () => {
    const testPayload = { id: 1, email: 'test@example.com' };

    test('should generate an access token', () => {
      const token = generateAccessToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Format JWT: header.payload.signature
    });

    test('should generate a refresh token', () => {
      const token = generateRefreshToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    test('should verify an access token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyToken(token, process.env.JWT_SECRET);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
    });

    test('should verify a refresh token', () => {
      const token = generateRefreshToken(testPayload);
      const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
    });

    test('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken, process.env.JWT_SECRET);

      expect(decoded).toBeNull();
    });

    test('should not verify access token with refresh secret', () => {
      const accessToken = generateAccessToken(testPayload);
      const decoded = verifyToken(accessToken, process.env.JWT_REFRESH_SECRET);

      expect(decoded).toBeNull();
    });

    test('should not verify refresh token with access secret', () => {
      const refreshToken = generateRefreshToken(testPayload);
      const decoded = verifyToken(refreshToken, process.env.JWT_SECRET);

      expect(decoded).toBeNull();
    });
  });
});
