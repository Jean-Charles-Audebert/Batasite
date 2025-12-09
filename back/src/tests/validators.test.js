/**
 * Tests pour les validateurs
 */
const { adminCreateSchema, adminUpdateSchema, contentUpdateSchema, loginSchema, validate } = require('../utils/validators');

describe('Validators', () => {
  describe('Admin Create Schema', () => {
    test('should validate a valid admin creation object', () => {
      const data = {
        email: 'admin@example.com',
        username: 'adminuser',
        password: 'SecurePassword123!',
      };
      const { error, value } = validate(adminCreateSchema, data);

      expect(error).toBeUndefined();
      expect(value.email).toBe(data.email);
      expect(value.username).toBe(data.username);
      expect(value.password).toBe(data.password);
    });

    test('should reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        username: 'adminuser',
        password: 'SecurePassword123!',
      };
      const { error } = validate(adminCreateSchema, data);

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path.includes('email'))).toBe(true);
    });

    test('should reject username with special characters', () => {
      const data = {
        email: 'admin@example.com',
        username: 'admin@user',
        password: 'SecurePassword123!',
      };
      const { error } = validate(adminCreateSchema, data);

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path.includes('username'))).toBe(true);
    });

    test('should reject short username', () => {
      const data = {
        email: 'admin@example.com',
        username: 'ab',
        password: 'SecurePassword123!',
      };
      const { error } = validate(adminCreateSchema, data);

      expect(error).toBeDefined();
    });

    test('should reject short password', () => {
      const data = {
        email: 'admin@example.com',
        username: 'adminuser',
        password: 'Short1!',
      };
      const { error } = validate(adminCreateSchema, data);

      expect(error).toBeDefined();
      expect(error.details.some(d => d.path.includes('password'))).toBe(true);
    });

    test('should reject missing required fields', () => {
      const { error } = validate(adminCreateSchema, {});

      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });

    test('should strip unknown fields', () => {
      const data = {
        email: 'admin@example.com',
        username: 'adminuser',
        password: 'SecurePassword123!',
        unknownField: 'should be removed',
      };
      const { error, value } = validate(adminCreateSchema, data);

      expect(error).toBeUndefined();
      expect(value.unknownField).toBeUndefined();
    });
  });

  describe('Admin Update Schema', () => {
    test('should validate is_active boolean', () => {
      const { error, value } = validate(adminUpdateSchema, { is_active: true });

      expect(error).toBeUndefined();
      expect(value.is_active).toBe(true);
    });

    test('should reject non-boolean is_active', () => {
      const { error } = validate(adminUpdateSchema, { is_active: 'true' });

      expect(error).toBeDefined();
    });
  });

  describe('Login Schema', () => {
    test('should validate valid login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePassword123!',
      };
      const { error, value } = validate(loginSchema, data);

      expect(error).toBeUndefined();
      expect(value.email).toBe(data.email);
    });

    test('should reject invalid email', () => {
      const { error } = validate(loginSchema, {
        email: 'not-an-email',
        password: 'SecurePassword123!',
      });

      expect(error).toBeDefined();
    });

    test('should reject short password', () => {
      const { error } = validate(loginSchema, {
        email: 'user@example.com',
        password: 'Short1!',
      });

      expect(error).toBeDefined();
    });
  });

  describe('Content Update Schema', () => {
    test('should validate JSONB data object', () => {
      const data = {
        data: {
          page: { title: 'Test' },
          hero: { video: 'test.mp4' },
        },
      };
      const { error, value } = validate(contentUpdateSchema, data);

      expect(error).toBeUndefined();
      expect(value.data).toBeDefined();
    });

    test('should validate empty object', () => {
      const { error, value } = validate(contentUpdateSchema, { data: {} });

      expect(error).toBeUndefined();
      expect(value.data).toEqual({});
    });

    test('should reject non-object data', () => {
      const { error } = validate(contentUpdateSchema, { data: 'not an object' });

      expect(error).toBeDefined();
    });

    test('should reject missing data field', () => {
      const { error } = validate(contentUpdateSchema, {});

      expect(error).toBeDefined();
    });
  });
});
