/**
 * Tests unitaires du service API
 * Vérifie les fonctionnalités essentielles sans dépendre d'une lib de test
 */

import api from '../services/api';

/**
 * Résultats de test
 */
const testResults = [];

/**
 * Enregistrer un test réussi
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
}

/**
 * Exécuter un test
 */
async function test(name, fn) {
  try {
    await fn();
    testResults.push({ name, status: '✓', error: null });
    console.log(`✓ ${name}`);
  } catch (error) {
    testResults.push({ name, status: '✗', error: error.message });
    console.error(`✗ ${name}: ${error.message}`);
  }
}

/**
 * Suite de tests
 */
export async function runApiTests() {
  console.log('\n📋 Running API Service Tests...\n');

  // Test 1: API_BASE_URL is configured
  await test('API_BASE_URL should be configured', () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    assert(baseUrl, 'API_BASE_URL is empty');
  });

  // Test 2: ApiService has required methods
  await test('ApiService should have all HTTP methods', () => {
    assert(typeof api.get === 'function', 'Missing get method');
    assert(typeof api.post === 'function', 'Missing post method');
    assert(typeof api.patch === 'function', 'Missing patch method');
    assert(typeof api.put === 'function', 'Missing put method');
    assert(typeof api.delete === 'function', 'Missing delete method');
  });

  // Test 3: ApiService has auth methods
  await test('ApiService should have auth methods', () => {
    assert(typeof api.login === 'function', 'Missing login method');
    assert(typeof api.register === 'function', 'Missing register method');
    assert(typeof api.logout === 'function', 'Missing logout method');
    assert(typeof api.isAuthenticated === 'function', 'Missing isAuthenticated method');
  });

  // Test 4: ApiService has content methods
  await test('ApiService should have content methods', () => {
    assert(typeof api.getContent === 'function', 'Missing getContent method');
    assert(typeof api.updateContent === 'function', 'Missing updateContent method');
    assert(typeof api.patchContent === 'function', 'Missing patchContent method');
    assert(typeof api.getContentHistory === 'function', 'Missing getContentHistory method');
  });

  // Test 5: ApiService has admin methods
  await test('ApiService should have admin methods', () => {
    assert(typeof api.listAdmins === 'function', 'Missing listAdmins method');
    assert(typeof api.getAdmin === 'function', 'Missing getAdmin method');
    assert(typeof api.updateAdmin === 'function', 'Missing updateAdmin method');
    assert(typeof api.deleteAdmin === 'function', 'Missing deleteAdmin method');
    assert(typeof api.getAdminActivity === 'function', 'Missing getAdminActivity method');
  });

  // Test 6: Token management
  await test('Token management should work', () => {
    // Clear tokens first
    api.clearTokens();
    assert(!api.isAuthenticated(), 'Should not be authenticated after clearTokens');

    // Set tokens
    api.setTokens('test-access', 'test-refresh');
    assert(api.isAuthenticated(), 'Should be authenticated after setTokens');
    assert(localStorage.getItem('accessToken') === 'test-access', 'Access token not saved');
    assert(localStorage.getItem('refreshToken') === 'test-refresh', 'Refresh token not saved');

    // Clear again
    api.clearTokens();
    assert(!api.isAuthenticated(), 'Should not be authenticated after clearTokens');
    assert(!localStorage.getItem('accessToken'), 'Access token not cleared');
    assert(!localStorage.getItem('refreshToken'), 'Refresh token not cleared');
  });

  // Print summary
  console.log('\n📊 Test Summary\n');
  const passed = testResults.filter(r => r.status === '✓').length;
  const failed = testResults.filter(r => r.status === '✗').length;
  const total = testResults.length;

  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Success rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    testResults.filter(r => r.status === '✗').forEach(r => {
      console.error(`  - ${r.name}: ${r.error}`);
    });
  }

  return { passed, failed, total };
}
