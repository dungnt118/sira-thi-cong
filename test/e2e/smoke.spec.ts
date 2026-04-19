import { test, expect } from '../fixtures/app.fixture';
import { APP_ROUTES } from '../constants/routes';

test.describe('Kiểm tra cơ bản (Smoke Test)', () => {
  test('Kiểm tra trang chủ có thể truy cập', async ({ page }) => {
    // Đi tới trang chủ dựa trên route hằng số
    await page.goto(APP_ROUTES.DASHBOARD);

    // Kiểm tra tiêu đề hoặc nội dung cơ bản (điều chỉnh cho phù hợp app thật)
    // await expect(page).toHaveTitle(/SIRA/);
    
    // Ghi log đơn giản
    console.log('Smoke test completed successfully');
  });
});
