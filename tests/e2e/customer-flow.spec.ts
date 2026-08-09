import { test, expect } from '@playwright/test';

test.describe('Customer E2E Shopping Journey', () => {
  test('should display landing page, browse catalog, view product, add to cart and proceed to checkout', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Sculptural living');

    // 2. Navigate to Catalog
    await page.click('text=Explore Collection');
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.locator('h1')).toContainText('Architectural Furniture');

    // 3. View Product Detail
    await page.click('text=Modulive Bouclé Curved Lounge Armchair');
    await expect(page).toHaveURL(/\/product\/modulive-boucle-curved-lounge-armchair/);
    await expect(page.locator('h1')).toContainText('Modulive Bouclé Curved Lounge Armchair');

    // 4. Add to Cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('h3')).toContainText('Your Shopping Bag');

    // 5. Proceed to Checkout
    await page.click('text=Proceed to Checkout');
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('h1')).toContainText('Shipping & Payment');
  });
});
