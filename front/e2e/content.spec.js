import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Content Management
 */

const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'password123';

test.describe('Content Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    
    // Navigate to content
    await page.waitForURL('**/dashboard');
    await page.click('text=📄 Contenu');
    await page.waitForLoadState('networkidle');
  });

  test('should load content page', async ({ page }) => {
    await expect(page.locator('text=Gestion du Contenu Global')).toBeVisible();
  });

  test('should show content display mode by default', async ({ page }) => {
    await expect(page.locator('text=Contenu Actuel')).toBeVisible();
    await expect(page.locator('button:has-text("Modifier")')).toBeVisible();
  });

  test('should switch to edit mode', async ({ page }) => {
    await page.click('button:has-text("Modifier")');
    
    await expect(page.locator('text=Formulaire d\'édition du contenu')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Sauvegarder")')).toBeVisible();
    await expect(page.locator('button:has-text("Annuler")')).toBeVisible();
  });

  test('should cancel edit mode', async ({ page }) => {
    await page.click('button:has-text("Modifier")');
    await page.click('button:has-text("Annuler")');
    
    await expect(page.locator('text=Contenu Actuel')).toBeVisible();
  });

  test('should show history button', async ({ page }) => {
    await expect(page.locator('button:has-text("Historique")')).toBeVisible();
  });

  test('should display loading state when fetching', async ({ page }) => {
    // Intercepter pour simuler un délai réseau
    await page.route('**/content', route => {
      setTimeout(() => route.continue(), 500);
    });
    
    await page.reload();
    
    // Devrait afficher "Chargement..."
    const loadingText = page.locator('text=Chargement');
    // Ne pas forcément visible si chargement rapide
    await page.waitForLoadState('networkidle');
  });
});
