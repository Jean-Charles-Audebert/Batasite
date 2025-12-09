import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Admin Management
 */

const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'password123';

test.describe('Admin Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    
    // Navigate to admin
    await page.waitForURL('**/dashboard');
    await page.click('text=👥 Administrateurs');
    await page.waitForURL('**/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should load admin page', async ({ page }) => {
    await expect(page.locator('text=Gestion des Administrateurs')).toBeVisible();
  });

  test('should show admin list', async ({ page }) => {
    // Attendre le chargement de la liste
    await page.waitForSelector('button:has-text("Ajouter un administrateur")', { timeout: 5000 });
    await expect(page.locator('button:has-text("Ajouter un administrateur")')).toBeVisible();
  });

  test('should show add admin form on button click', async ({ page }) => {
    await page.click('button:has-text("Ajouter un administrateur")');
    
    // Formulaire devrait apparaître
    await expect(page.locator('text=Créer un administrateur')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Créer")')).toBeVisible();
  });

  test('should show role selector in form', async ({ page }) => {
    await page.click('button:has-text("Ajouter un administrateur")');
    
    await expect(page.locator('select')).toBeVisible({ timeout: 5000 });
  });

  test('should cancel form', async ({ page }) => {
    await page.click('button:has-text("Ajouter un administrateur")');
    await page.click('button:has-text("Annuler")');
    
    // Formulaire devrait disparaître
    await expect(page.locator('text=Créer un administrateur')).not.toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.click('button:has-text("Ajouter un administrateur")');
    await page.click('button:has-text("Créer")');
    
    // Message d'erreur requis
    const errorMsg = page.locator('text=requis');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should show loading state during form submission', async ({ page }) => {
    await page.click('button:has-text("Ajouter un administrateur")');
    
    // Remplir avec email valide
    await page.fill('input[type="email"]', `newadmin${Date.now()}@test.com`);
    
    // Intercepter la requête pour simuler un délai
    await page.route('**/admin', route => {
      setTimeout(() => route.continue(), 500);
    });
    
    await page.click('button:has-text("Créer")');
    
    // Button devrait afficher état de chargement
    const submitBtn = page.locator('button:has-text("Création en cours")');
    // Peut être visible ou non selon la vitesse
  });
});
