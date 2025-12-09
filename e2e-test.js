#!/usr/bin/env node

/**
 * Test E2E simple pour Phase 2.1
 * Teste:
 * 1. La connexion API
 * 2. L'enregistrement
 * 3. La connexion
 * 4. La récupération du contenu
 * 5. La déconnexion
 */

const API_URL = 'http://localhost:3000';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    return false;
  }
}

async function runE2ETests() {
  console.log('\n🧪 E2E Tests - Phase 2.1\n');

  let email = `test-${Date.now()}@example.com`;
  let password = 'TestPassword123!';
  let accessToken = null;
  let passed = 0;
  let failed = 0;

  // Test 1: Health check
  if (await test('Backend santé check', async () => {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 2: Register
  if (await test('Enregistrement nouvel utilisateur', async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.accessToken) throw new Error('No accessToken in response');
    accessToken = data.accessToken;
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Login
  if (await test('Connexion avec identifiants', async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.accessToken) throw new Error('No accessToken in response');
    accessToken = data.accessToken;
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Get content (requires auth)
  if (await test('Récupération contenu (requête authentifiée)', async () => {
    const res = await fetch(`${API_URL}/content`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.content !== 'object') throw new Error('Invalid content structure');
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: Update content
  if (await test('Mise à jour contenu', async () => {
    const newContent = { title: 'Test', description: 'E2E Test' };
    const res = await fetch(`${API_URL}/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newContent),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 6: List admins (should have at least the new user)
  if (await test('Récupération liste administrateurs', async () => {
    const res = await fetch(`${API_URL}/admin`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.admins)) throw new Error('Invalid admins structure');
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 7: Logout
  if (await test('Déconnexion', async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  })) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  console.log(`\n📊 Résultats: ${passed}/${passed + failed} tests réussis`);
  const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
  console.log(`Taux de réussite: ${successRate}%\n`);

  return failed === 0 ? 0 : 1;
}

// Run tests
runE2ETests().then(code => process.exit(code));
