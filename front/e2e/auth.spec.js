import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Authentication & Navigation
 */

const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'password123';

test.describe('Authentication Flow', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h1')).toContainText('Batasite Admin');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Se connecter")');
    
    // Attendre le message d'erreur
    const errorMsg = page.locator('text=Erreur de connexion');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    
    // Attendre redirection vers dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('should show dashboard after login', async ({ page, context }) => {
    // Ajouter le token au localStorage avant de naviguer
    const token = 'valid-token'; // Dans un vrai test, obtenir depuis l'API
    
    // Pour ce test, faire le login d'abord
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    
    // Vérifier que le dashboard est visible
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h2:has-text("Batasite")')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    
    // Attendre dashboard
    await page.waitForURL('**/dashboard');
    
    // Click logout
    await page.click('button:has-text("Déconnexion")');
    
    // Devrait retourner à login
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });
});

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Passer auth check - mock localStorage
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL('**/dashboard');
  });

  test('should show sidebar with navigation buttons', async ({ page }) => {
    await expect(page.locator('text=📄 Contenu')).toBeVisible();
    await expect(page.locator('text=👥 Administrateurs')).toBeVisible();
  });

  test('should navigate to content page', async ({ page }) => {
    await page.click('text=📄 Contenu');
    await expect(page.locator('text=Gestion du contenu')).toBeVisible();
  });

  test('should navigate to admin page', async ({ page }) => {
    await page.click('text=👥 Administrateurs');
    await page.waitForURL('**/admin');
    await expect(page.locator('text=Gestion des administrateurs')).toBeVisible();
  });

  test('should show logout button in sidebar', async ({ page }) => {
    await expect(page.locator('button:has-text("Déconnexion")')).toBeVisible();
  });
});
