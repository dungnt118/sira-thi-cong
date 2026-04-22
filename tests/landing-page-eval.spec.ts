import { test, expect } from '@playwright/test';

test('Landing Page Evaluation', async ({ page }) => {
  const errors: any[] = [];
  page.on('pageerror', (err) => errors.push(err));
  page.on('requestfailed', (req) => errors.push(`${req.url()}: ${req.failure()?.errorText}`));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 1. Check for blank page
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Body height: ${bodyHeight}`);
  expect(bodyHeight).toBeGreaterThan(100);

  const isVisible = await page.isVisible('.landing-page');
  console.log(`Landing page container visible: ${isVisible}`);
  expect(isVisible).toBe(true);

  // 2. Check SEO tags
  const title = await page.title();
  console.log(`Title: ${title}`);
  expect(title).toBeTruthy();

  const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
  console.log(`Meta Description: ${metaDescription}`);
  expect(metaDescription).toBeTruthy();

  // 3. Check for specific content
  const heroText = await page.textContent('.hero-content h1');
  console.log(`Hero H1: ${heroText}`);
  expect(heroText).toContain('Bảo Vệ Ngôi Nhà');

  // 4. Report errors
  if (errors.length > 0) {
    console.error('Found errors:', errors);
  }
  expect(errors.length).toBe(0);
});
