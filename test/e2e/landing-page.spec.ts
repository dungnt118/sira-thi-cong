import { test, expect } from '../fixtures/app.fixture';

test.describe('BAC Waterproofing Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('SEO: should have correct title and meta description', async ({ page }) => {
        await expect(page).toHaveTitle(/BAC/);
        
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toContain('BAC');
        expect(description).toContain('chống thấm');
    });

    test('UI: should display key sections', async ({ page }) => {
        // Hero section
        await expect(page.locator('h1').first()).toBeVisible();
        await expect(page.locator('.hero-section')).toBeVisible();

        // Services section
        await expect(page.locator('#services')).toBeVisible();
        await expect(page.locator('.services-grid .service-card')).toHaveCount(6);

        // Process section
        await expect(page.locator('text=Quy Trình Làm Việc')).toBeVisible();
    });

    test('Navigation: should have working links in header', async ({ page }) => {
        // Ensure menu is visible (desktop)
        const navMenu = page.locator('.nav-menu');
        await expect(navMenu).toBeVisible();

        // Test navigation to an article page
        await page.click('text=Giới thiệu');
        await page.waitForURL(/\/gioi-thieu/);
        
        // Wait for content to render
        const articleH1 = page.locator('h1');
        await expect(articleH1).toBeVisible();
        await expect(articleH1).toContainText('Gioi Thieu');
    });

    test('Responsive: should adapt to mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Logo should be visible
        await expect(page.locator('.logo')).toBeVisible();
        
        // Menu should be hidden on mobile (as per CSS)
        await expect(page.locator('.nav-menu')).toBeHidden();
        
        // Hero title should be visible
        await expect(page.locator('h1').first()).toBeVisible();
    });

    test('UX: should have working CTA buttons', async ({ page }) => {
        const servicesCta = page.locator('a[href="#services"]');
        await servicesCta.click();
        
        // Check if element is in viewport after scroll
        await expect(page.locator('#services')).toBeInViewport();
    });
});
