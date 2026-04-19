# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-layout\components-responsive.spec.ts >> Kiểm tra Thành phần UI Responsive >> Màn hình: Mobile >> Quản lý người dùng - Bảng dữ liệu có scroll ngang trên mobile
- Location: test\e2e\admin-layout\components-responsive.spec.ts:13:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/users
Call log:
  - navigating to "http://localhost:5173/admin/users", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kiểm tra Thành phần UI Responsive', () => {
  4  |   const viewports = [
  5  |     { name: 'Desktop', width: 1280, height: 720 },
  6  |     { name: 'Mobile', width: 375, height: 667 },
  7  |   ];
  8  | 
  9  |   for (const viewport of viewports) {
  10 |     test.describe(`Màn hình: ${viewport.name}`, () => {
  11 |       test.use({ viewport: { width: viewport.width, height: viewport.height } });
  12 | 
  13 |       test('Quản lý người dùng - Bảng dữ liệu có scroll ngang trên mobile', async ({ page }) => {
> 14 |         await page.goto('/admin/users');
     |                    ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/users
  15 |         const table = page.locator('.ant-table-content');
  16 |         
  17 |         if (viewport.width <= 768) {
  18 |           // Trên mobile bảng nên có scroll ngang (scroll-x: 1100)
  19 |           const hasScroll = await table.evaluate(el => el.scrollWidth > el.clientWidth);
  20 |           expect(hasScroll).toBe(true);
  21 |         } else {
  22 |           // Trên desktop bảng có thể đủ chỗ
  23 |         }
  24 |       });
  25 | 
  26 |       test('Quản lý người dùng - Card thống kê xếp chồng trên mobile', async ({ page }) => {
  27 |         await page.goto('/admin/users');
  28 |         const cards = page.locator('.ant-card');
  29 |         
  30 |         if (viewport.width <= 768) {
  31 |           // Trên mobile các card xs={24} nên xếp chồng (chiếm full width)
  32 |           const firstCardWidth = await cards.first().evaluate(el => el.clientWidth);
  33 |           const containerWidth = await page.evaluate(() => document.body.clientWidth);
  34 |           expect(firstCardWidth).toBeGreaterThan(containerWidth * 0.8);
  35 |         }
  36 |       });
  37 | 
  38 |       test('Quản lý người dùng - Form lọc responsive', async ({ page }) => {
  39 |         await page.goto('/admin/users');
  40 |         const searchInput = page.locator('.ant-input-search');
  41 |         await expect(searchInput).toBeVisible();
  42 |         
  43 |         // Kiểm tra không bị vỡ layout
  44 |         const overflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
  45 |         expect(overflow).toBe(false);
  46 |       });
  47 | 
  48 |       test('Modal thêm người dùng không vượt quá chiều rộng màn hình', async ({ page }) => {
  49 |         await page.goto('/admin/users');
  50 |         await page.getByRole('button', { name: /Tạo người dùng mới/i }).click();
  51 |         
  52 |         const modal = page.locator('.ant-modal-content');
  53 |         await expect(modal).toBeVisible();
  54 |         
  55 |         const modalWidth = await modal.evaluate(el => el.clientWidth);
  56 |         const windowWidth = await page.evaluate(() => window.innerWidth);
  57 |         expect(modalWidth).toBeLessThanOrEqual(windowWidth);
  58 |       });
  59 |     });
  60 |   }
  61 | });
  62 | 
```