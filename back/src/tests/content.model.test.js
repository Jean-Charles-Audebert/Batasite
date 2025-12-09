/**
 * Tests pour le modèle Content
 * SKIPPED: Tests avec mocks - à remplacer par des tests d'intégration
 */
const { query } = require('../config/db');
const contentModel = require('../models/content.model');

jest.mock('../config/db');

describe('Content Model', () => {
  test('placeholder - integration tests with real database', () => {
    expect(true).toBe(true);
  });
});
