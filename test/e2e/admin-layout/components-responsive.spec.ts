import { test, expect } from '../../fixtures/app.fixture';

test.describe('Kiểm tra Thành phần UI Responsive', () => {
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Mobile', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test.describe(`Màn hình: ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test('Quản lý người dùng - Bảng dữ liệu có scroll ngang trên mobile', async ({ page }) => {
        await page.goto('/admin/users');
        const table = page.locator('.ant-table-content');
        
        if (viewport.width <= 768) {
          // Trên mobile bảng nên có scroll ngang (scroll-x: 1100)
          const hasScroll = await table.evaluate(el => el.scrollWidth > el.clientWidth);
          expect(hasScroll).toBe(true);
        } else {
          // Trên desktop bảng có thể đủ chỗ
        }
      });

      test('Quản lý người dùng - Card thống kê xếp chồng trên mobile', async ({ page }) => {
        await page.goto('/admin/users');
        const cards = page.locator('.ant-card');
        
        if (viewport.width <= 768) {
          // Trên mobile các card xs={24} nên xếp chồng (chiếm full width)
          const firstCardWidth = await cards.first().evaluate(el => el.clientWidth);
          const containerWidth = await page.evaluate(() => document.body.clientWidth);
          expect(firstCardWidth).toBeGreaterThan(containerWidth * 0.8);
        }
      });

      test('Quản lý người dùng - Form lọc responsive', async ({ page }) => {
        await page.goto('/admin/users');
        const searchInput = page.locator('.ant-input-search');
        await expect(searchInput).toBeVisible();
        
        // Kiểm tra không bị vỡ layout
        const overflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
        expect(overflow).toBe(false);
      });

      test('Modal thêm người dùng không vượt quá chiều rộng màn hình', async ({ page }) => {
        await page.goto('/admin/users');
        await page.getByRole('button', { name: /Tạo người dùng mới/i }).click();
        
        const modal = page.locator('.ant-modal-content');
        await expect(modal).toBeVisible();
        
        const modalWidth = await modal.evaluate(el => el.clientWidth);
        const windowWidth = await page.evaluate(() => window.innerWidth);
        expect(modalWidth).toBeLessThanOrEqual(windowWidth);
      });
    });
  }
});
