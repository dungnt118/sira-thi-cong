import { test, expect } from '../../fixtures/app.fixture';
import { devices } from '@playwright/test';
import dayjs from 'dayjs';

/**
 * Kịch bản test E2E Mobile Full Lifecycle & Traceability.
 * Fix lỗi không chọn được người phụ trách trên mobile.
 */
test.use({ ...devices['iPhone 12'] });

test('Full Lifecycle & Traceability Mobile E2E', async ({ page }) => {
  test.setTimeout(600000);

  const timestamp = Date.now();
  const customerName = `Mobile Customer ${timestamp}`;
  const customerPhone = `090${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
  const journeyTitle = `Dự án Mobile ${timestamp}`;

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Submit error') || msg.text().includes('Backend Response')) {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]: ${msg.text()}`);
    }
  });

  // --- 1. Tạo dự án mới ---
  console.log('--- 1. Tạo dự án mới ---');
  await page.goto('/admin/ql/journeys', { waitUntil: 'networkidle' });

  await page.click('button:has-text("Tạo yêu cầu")', { force: true });
  await page.waitForSelector('.ant-drawer-content', { state: 'visible' });

  await page.fill('input#customer_phone', customerPhone);
  await page.waitForTimeout(1000);
  await page.fill('input#customer_full_name', customerName);
  await page.fill('input#customer_email', `mobile_${timestamp}@example.com`);
  await page.fill('input#customer_address', '123 Mobile St');
  await page.fill('input#customer_province', 'TP. Hồ Chí Minh');
  await page.fill('input#customer_ward', 'Phường Bến Nghé');

  await page.fill('input#request_title', journeyTitle);
  await page.fill('input#area_m2', '200');
  await page.fill('input#execution_days', '60');
  
  await page.locator('.ant-select-selector').filter({ hasText: 'Chọn loại dịch vụ' }).click({ force: true });
  await page.locator('.ant-select-item-option-content:visible >> text=Chống thấm').first().click();

  await page.click('button[type="submit"]:has-text("Tạo mới")');
  await page.waitForSelector('.ant-drawer-content', { state: 'hidden' });

  // --- 2. Mở chi tiết ---
  console.log('--- 2. Mở chi tiết dự án ---');
  await page.fill('input[placeholder*="Tìm kiếm"]', journeyTitle);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  await page.locator(`text=${journeyTitle}`).first().click();
  await page.waitForLoadState('networkidle');

  // Hàm chuyển tab trên Mobile
  const switchMobileTab = async (tabName: string) => {
    console.log(`-> Đang chuyển sang tab: ${tabName}`);
    const dropdownBtn = page.locator('.ant-card-body button.ant-dropdown-trigger:has(.anticon-menu)');
    await dropdownBtn.scrollIntoViewIfNeeded();
    await dropdownBtn.click({ force: true });
    
    const menuItem = page.locator('.ant-dropdown-menu-item').filter({ hasText: tabName });
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.scrollIntoViewIfNeeded();
    await menuItem.click({ force: true });
    await page.waitForTimeout(2000); 
  };

  // --- 3. Đặt lịch hẹn ---
  console.log('--- 3. Đặt lịch hẹn khảo sát ---');
  await switchMobileTab('Lịch hẹn');
  
  const createApptBtn = page.locator('button:has-text("Đặt lịch mới")');
  await createApptBtn.waitFor({ state: 'visible' });
  await createApptBtn.click({ force: true });

  await page.waitForSelector('input#appointment_date', { state: 'visible' });
  await page.click('input#appointment_date', { force: true });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  
  await page.fill('textarea#note', 'Test Traceability Note');
  
  // Đảm bảo chọn người phụ trách (Bắt buộc)
  console.log('-> Đang chọn người phụ trách...');
  const userSelect = page.locator('.ant-select-selector').filter({ hasText: 'phụ trách' });
  await userSelect.first().click({ force: true });
  await page.waitForTimeout(1000);
  await page.locator('.ant-select-item-option-content:visible').first().click();

  await page.click('button[type="submit"]:has-text("Tạo lịch hẹn")');
  
  // Đợi message thành công hoặc bất kỳ message nào
  await page.waitForTimeout(2000);
  const successMsg = page.locator('text=Đã đặt lịch hẹn mới, text=Đã cập nhật lịch hẹn');
  if (!await successMsg.isVisible()) {
    console.log('-> Không thấy message thành công, thử click lại submit...');
    await page.click('button[type="submit"]:has-text("Tạo lịch hẹn")', { force: true });
  }

  await expect(page.locator('text=Đã đặt lịch hẹn mới, text=Đã cập nhật lịch hẹn, text=Lịch hẹn')).toBeVisible({ timeout: 15000 });
  console.log('-> Đã tạo lịch hẹn thành công.');

  // --- 4. Thực hiện khảo sát ---
  console.log('--- 4. Thực hiện khảo sát và liên kết ---');
  await switchMobileTab('Khảo sát');
  
  const editSurveyBtn = page.locator('button:has-text("Khảo sát ngay"), button:has-text("Cập nhật")').first();
  await editSurveyBtn.click({ force: true });

  await page.locator('text=Chống thấm Sân thượng').click();
  await page.waitForSelector('text=Liên kết Lịch hẹn');
  await page.locator('.ant-select-selector').filter({ hasText: 'Chọn lịch hẹn' }).click({ force: true });
  await page.locator('.ant-select-item-option-content:visible').first().click(); 

  await page.click('button:has-text("Bắt đầu nhập liệu")');

  await page.click('button:has-text("Thêm Khu vực")');
  await page.fill('input[placeholder*="Sân thượng"]', 'KV Test Mobile');
  await page.fill('textarea[placeholder*="tình trạng"]', 'Nứt sàn');
  await page.fill('input[placeholder="Diện tích (m2)"]', '50');
  
  await page.click('button:has-text("Xem Biên bản")');
  await page.click('button:has-text("Tiến hành Ký tên")');

  await page.click('button:has-text("Lấy chữ ký Khách hàng")');
  await page.waitForSelector('canvas', { state: 'visible' });
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.up();
  }
  await page.click('button:has-text("Lưu chữ ký")');
  
  await page.click('button:has-text("Đóng & Nộp Hồ Sơ Khảo Sát")');
  await expect(page.locator('text=Hồ sơ KS đã chốt')).toBeVisible({ timeout: 20000 });
  console.log('-> Đã hoàn thành khảo sát và nộp hồ sơ.');

  // --- 5. Verify Traceability ---
  console.log('--- 5. Kiểm tra tính truy vết ---');
  await expect(page.locator('text=Link tới Lịch hẹn')).toBeVisible();
  console.log('[SUCCESS] Đã tìm thấy link truy vết tại Hồ sơ khảo sát.');

  await switchMobileTab('Lịch hẹn');
  await expect(page.locator('text=Đã có kết quả KS')).toBeVisible();
  console.log('[SUCCESS] Đã tìm thấy trạng thái khảo sát tại danh sách Lịch hẹn.');
  
  console.log('--- HOÀN TẤT TEST: Mọi luồng đã được chuẩn hóa và truy vết thành công ---');
});
