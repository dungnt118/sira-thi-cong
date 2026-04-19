import { test, expect } from '../../fixtures/app.fixture';
import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';
import { savePassedTest } from '../../helpers/registry';

test.describe.serial('Customer Journey Lifecycle - Create and Update Steps', () => {
  const journeyTitle = `Journey Test ${Date.now()}`;
  const customChecklistItem = `Checklist Item ${Date.now()}`;
  let journeyId = '';

  test.beforeEach(async ({ page }) => {
    // Authentication is handled via storageState in playwright.config.ts
  });

  test('P1: Tạo mới Customer Journey từ danh sách', async ({ page }) => {
    const testName = 'Customer Journey Lifecycle - Create and Update Steps > P1: Tạo mới Customer Journey từ danh sách';
    const adminLayout = new AdminLayoutPage(page);

    // 1. Đi tới trang danh sách Journey
    await page.goto('/admin/ql/journeys');
    await expect(adminLayout.topBar).toBeVisible({ timeout: 15000 });

    // 2. Click nút "Tạo yêu cầu"
    await page.click('button:has-text("Tạo yêu cầu")');
    await page.waitForTimeout(1000); // Đợi drawer mở hẳn

    // 3. Điền form tạo mới (JourneyForm)
    await page.fill('input#customer_phone', `09${Date.now().toString().slice(-8)}`);
    await page.fill('input#customer_full_name', 'Khách hàng Test');
    await page.fill('input#customer_province', 'Hà Nội');
    await page.fill('input#customer_ward', 'Dịch Vọng');
    
    await page.fill('input#request_title', journeyTitle);
    
    // Chọn loại dịch vụ (MasterDataSelect)
    const serviceSelect = page.locator('.ant-select-selector').filter({ hasText: 'Chọn loại dịch vụ' });
    await serviceSelect.click();
    await page.waitForSelector('.ant-select-item-option');
    // Tìm và click option có chứa chữ "Thi công" (không phân biệt hoa thường hoặc khoảng trắng dư)
    await page.locator('.ant-select-item-option-content').filter({ hasText: /Thi công/i }).first().click();

    // Submit
    await page.click('button[type="submit"]:has-text("Tạo mới")');

    // 4. Kiểm tra message thành công and redirection
    await expect(page.locator('.ant-message-success')).toBeVisible();
    
    // Wait for the drawer to close
    await expect(page.locator('.ant-drawer-content')).not.toBeVisible();

    // 5. Tìm kiếm lại và vào chi tiết
    await page.fill('input[placeholder="Tìm kiếm công trình..."]', journeyTitle);
    const journeyLink = page.locator(`div:has-text("${journeyTitle}")`).first();
    await expect(journeyLink).toBeVisible();
    await journeyLink.click();

    // 6. Verify URL and extract ID
    await expect(page).toHaveURL(/\/admin\/ql\/journeys\/detail/);
    const url = page.url();
    const match = url.match(/detail\/([^/?]+)/);
    if (match) {
        journeyId = match[1];
        console.log(`Created Journey ID: ${journeyId}`);
    } else {
        throw new Error('Could not extract journeyId from URL: ' + url);
    }

    savePassedTest(testName);
  });

  test('P2: Cấu hình Customer Journey Step (Thêm checklist)', async ({ page }) => {
    const testName = 'Customer Journey Lifecycle - Create and Update Steps > P2: Cấu hình Customer Journey Step (Thêm checklist)';
    
    // 1. Đi tới trang cấu hình
    await page.goto('/admin/ql/settings/customer-journey');
    
    // 2. Chọn bước "Bước 02 - Tư vấn / liên hệ" (consult_contact)
    await page.click('.step-item:has-text("Bước 02")');
    
    // 3. Click "Chỉnh sửa"
    await page.click('button:has-text("Chỉnh sửa")');

    // 4. Thêm Checklist item mới
    await page.click('button:has-text("Thêm Nhiệm vụ Checklist")');
    
    // Ant Design Form.List uses indices. We assume the last one is the new one.
    const lastChecklistNameInput = page.locator('input[placeholder="Nhập tên nhiệm vụ..."]').last();
    await lastChecklistNameInput.fill(customChecklistItem);

    // 5. Lưu cấu hình
    await page.click('button:has-text("Cập nhật & Lưu")');
    await expect(page.locator('.ant-message-success')).toBeVisible();

    savePassedTest(testName);
  });

  test('P3: Thực hiện các bước trong Journey Detail 360', async ({ page }) => {
    const testName = 'Customer Journey Lifecycle - Create and Update Steps > P3: Thực hiện các bước trong Journey Detail 360';
    
    if (!journeyId) {
        throw new Error('No journeyId available for P3');
    }

    await page.goto(`/admin/ql/journeys/detail/${journeyId}`);
    
    // 1. Kiểm tra hiển thị các Steps
    await expect(page.locator('.ant-steps')).toBeVisible();

    // 2. Chuyển sang tab "Tư vấn"
    // URL support: /admin/ql/journeys/detail/:id?tab=GRP_02_CONTACT
    await page.click('.ant-tabs-tab:has-text("Tư vấn")');

    // 3. Kiểm tra Checklist item mới thêm ở P2 có xuất hiện không
    // Lưu ý: Journey Detail 360 có thể load config dynamic. 
    // Tuy nhiên, journey hiện tại có thể đã được "snapshot" nếu đã tạo trước đó.
    // Nhưng trong code JourneyDetail360.tsx nó gọi customerJourneySettingService.findSetting() 
    // để verify quyền và buildWorkTasks.
    
    // Ta sẽ kiểm tra sự tồn tại của checklist item trong UI
    await expect(page.locator(`text=${customChecklistItem}`)).toBeVisible({ timeout: 10000 });

    savePassedTest(testName);
  });
});
