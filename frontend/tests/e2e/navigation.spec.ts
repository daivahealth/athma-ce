import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/en/dashboard');
    await expect(page).toHaveTitle(/Zeal PMS/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should navigate to patients page', async ({ page }) => {
    await page.goto('/en/patients');
    await expect(page.locator('h1')).toContainText('Patients');
  });

  test('should navigate to appointments page', async ({ page }) => {
    await page.goto('/en/appointments');
    await expect(page.locator('h1')).toContainText('Appointments');
  });

  test('should navigate to claims page', async ({ page }) => {
    await page.goto('/en/claims');
    await expect(page.locator('h1')).toContainText('Claims');
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/en/settings');
    await expect(page.locator('h1')).toContainText('Settings');
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Check initial theme
    const body = page.locator('body');
    await expect(body).toHaveClass(/light/);
    
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');
    
    // Check if theme changed
    await expect(body).toHaveClass(/dark/);
  });
});

test.describe('Language Toggle', () => {
  test('should toggle language to Arabic', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Check initial language
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Click language toggle
    await page.click('[data-testid="language-toggle"]');
    await page.click('text=العربية');
    
    // Check if language changed
    await expect(page).toHaveURL(/\/ar\//);
    await expect(page.locator('h1')).toContainText('لوحة التحكم');
  });
});

test.describe('Data Table', () => {
  test('should filter patients table', async ({ page }) => {
    await page.goto('/en/patients');
    
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Search for a patient
    await page.fill('input[placeholder*="Search"]', 'Ahmed');
    
    // Check if results are filtered
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });

  test('should export data', async ({ page }) => {
    await page.goto('/en/patients');
    
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export")');
    
    // Check if download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/export-.*\.csv/);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/dashboard');
    
    // Check if mobile menu is available
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Click mobile menu
    await page.click('[data-testid="mobile-menu"]');
    
    // Check if sidebar is visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});



