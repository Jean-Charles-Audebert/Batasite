/**
 * Tests pour le modèle Admin
 * TDD: Les tests définissent le comportement attendu
 */
const { query } = require('../config/db');
const adminModel = require('../models/admin.model');

// Mock la fonction query
jest.mock('../config/db');

describe('Admin Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdmin', () => {
    test('should create an admin with valid data', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        username: 'admintest',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [] }); // Email check
      query.mockResolvedValueOnce({ rows: [] }); // Username check
      query.mockResolvedValueOnce({ rows: [mockAdmin] }); // Insert

      const result = await adminModel.createAdmin('admin@test.com', 'admintest', 'SecurePass123!');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('admin@test.com');
      expect(query).toHaveBeenCalledTimes(3);
    });

    test('should reject invalid email', async () => {
      await expect(
        adminModel.createAdmin('invalid-email', 'admintest', 'SecurePass123!')
      ).rejects.toThrow();
    });

    test('should reject short password', async () => {
      await expect(
        adminModel.createAdmin('admin@test.com', 'admintest', 'Short1!')
      ).rejects.toThrow();
    });

    test('should reject existing email', async () => {
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Email exists

      await expect(
        adminModel.createAdmin('admin@test.com', 'admintest', 'SecurePass123!')
      ).rejects.toThrow(/Email already exists/);
    });

    test('should reject existing username', async () => {
      query.mockResolvedValueOnce({ rows: [] }); // Email check
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Username exists

      await expect(
        adminModel.createAdmin('admin@test.com', 'existinguser', 'SecurePass123!')
      ).rejects.toThrow(/Username already exists/);
    });

    test('should not return password hash', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        username: 'admintest',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [] });
      query.mockResolvedValueOnce({ rows: [] });
      query.mockResolvedValueOnce({ rows: [mockAdmin] });

      const result = await adminModel.createAdmin('admin@test.com', 'admintest', 'SecurePass123!');

      expect(result.password_hash).toBeUndefined();
      expect(result.password).toBeUndefined();
    });
  });

  describe('getAdminByEmail', () => {
    test('should retrieve admin by email', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        username: 'admintest',
        password_hash: 'hashed_password',
        is_active: true,
      };

      query.mockResolvedValueOnce({ rows: [mockAdmin] });

      const result = await adminModel.getAdminByEmail('admin@test.com');

      expect(result).toEqual(mockAdmin);
      expect(result.email).toBe('admin@test.com');
    });

    test('should return null if admin not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await adminModel.getAdminByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('getAdminById', () => {
    test('should retrieve admin by id', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        username: 'admintest',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [mockAdmin] });

      const result = await adminModel.getAdminById(1);

      expect(result).toEqual(mockAdmin);
      expect(result.id).toBe(1);
    });

    test('should return null if admin not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await adminModel.getAdminById(999);

      expect(result).toBeNull();
    });
  });

  describe('getAllAdmins', () => {
    test('should retrieve all admins', async () => {
      const mockAdmins = [
        {
          id: 1,
          email: 'admin1@test.com',
          username: 'admin1',
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          email: 'admin2@test.com',
          username: 'admin2',
          is_active: false,
          created_at: new Date().toISOString(),
        },
      ];

      query.mockResolvedValueOnce({ rows: mockAdmins });

      const result = await adminModel.getAllAdmins();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    test('should return empty array if no admins', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await adminModel.getAllAdmins();

      expect(result).toEqual([]);
    });
  });

  describe('updateAdminStatus', () => {
    test('should update admin status', async () => {
      const updatedAdmin = {
        id: 1,
        email: 'admin@test.com',
        username: 'admintest',
        is_active: false,
        updated_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [updatedAdmin] });

      const result = await adminModel.updateAdminStatus(1, false);

      expect(result.is_active).toBe(false);
      expect(result.id).toBe(1);
    });

    test('should throw error if admin not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(adminModel.updateAdminStatus(999, true)).rejects.toThrow(/Admin not found/);
    });

    test('should reject non-boolean status', async () => {
      await expect(adminModel.updateAdminStatus(1, 'true')).rejects.toThrow();
    });
  });

  describe('deleteAdmin', () => {
    test('should delete admin', async () => {
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const result = await adminModel.deleteAdmin(1);

      expect(result).toBe(true);
    });

    test('should throw error if admin not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await expect(adminModel.deleteAdmin(999)).rejects.toThrow(/Admin not found/);
    });
  });
});
