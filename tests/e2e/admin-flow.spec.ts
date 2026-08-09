import { test, expect } from '@playwright/test';

test.describe('Admin E2E Management Journey', () => {
  test('should allow admin to sign in, view metrics dashboard, manage products, and inspect audit logs', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await page.click('button:has-text("Admin Demo")');
    await page.click('button:has-text("Sign In")');

    // 2. Expect redirection to Admin Dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1')).toContainText('Dashboard Overview');

    // 3. Navigate to Product Management
    await page.click('text=Products');
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.locator('h1')).toContainText('Product Management');

    // 4. Navigate to Audit Logs
    await page.click('text=Security Audit Logs');
    await expect(page).toHaveURL(/\/admin\/audit-logs/);
    await expect(page.locator('h1')).toContainText('Security Audit Logs');
  });
});
