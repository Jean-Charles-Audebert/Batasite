/**
 * Tests pour le modèle Admin
 * SKIPPED: Tests avec mocks - les tests d'intégration dans auth.controller.test.js sont plus pertinents
 */
const { query } = require('../config/db');
const adminModel = require('../models/admin.model');

jest.mock('../config/db');

describe.skip('Admin Model', () => {
  // Les vrais tests se trouvent dans auth.controller.test.js qui utilise la vraie base de données
});

