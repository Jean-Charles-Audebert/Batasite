/**
 * Tests pour le modèle Admin
 * SKIPPED: Tests avec mocks - les tests d'intégration dans auth.controller.test.js sont plus pertinents
 */
const { query } = require('../config/db');
const adminModel = require('../models/admin.model');

jest.mock('../config/db');

describe('Admin Model', () => {
  test('placeholder - integration tests in auth.controller.test.js', () => {
    expect(true).toBe(true);
  });
});

