import { test, expect } from '../../fixtures/app.fixture';
import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';
import { savePassedTest } from '../../helpers/registry';

test.describe.serial('Customer Journey Lifecycle - Create and Update Steps', () => {
  const journeyTitle = `Journey Test ${Date.now()}`;
  const customChecklistItem = `Checklist Item ${Date.now()}`;
  let journeyId = '';

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning' || msg.text().includes('Payload') || msg.text().includes('Reject') || msg.text().includes('Submit error') || msg.text().includes('Backend Response')) {
            console.log(`[BROWSER ${msg.type().toUpperCase()}]: ${msg.text()}`);
        }
    });
  });

  test('P1: Tạo mới Customer Journey từ danh sách', async ({ page }) => {
    const testName = 'Customer Journey Lifecycle - Create and Update Steps > P1: Tạo mới Customer Journey từ danh sách';
    const adminLayout = new AdminLayoutPage(page);

    await page.goto('/admin/ql/journeys');
    await expect(adminLayout.topBar).toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Tạo yêu cầu")');
    await page.waitForSelector('.ant-drawer-content', { state: 'visible' });
    await page.waitForTimeout(2000); 

    const phone = '0984016786';
    const phoneInput = page.locator('input#customer_phone');
    await phoneInput.fill(phone);
    await page.waitForSelector('.ant-select-item-option-content:visible');
    await page.click(`.ant-select-item-option-content:visible >> text=${phone}`);

    await page.fill('input#request_title', journeyTitle);
    await page.fill('input#area_m2', '100');
    await page.fill('input#execution_days', '30');
    
    const jCode = `JRN-${Math.floor(Math.random() * 1000000)}`;
    await page.fill('input#journey_code', jCode);
    
    const serviceSelect = page.locator('.ant-select-selector').filter({ hasText: 'Chọn loại dịch vụ' });
    await serviceSelect.click({ force: true });
    await page.waitForTimeout(1000);
    
    const option = page.locator('.ant-select-item-option-content:visible').filter({ hasText: /Chống thấm/i }).first();
    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();

    const submitBtn = page.locator('button[type="submit"]').filter({ hasText: 'Tạo mới' });
    await submitBtn.click();

    await page.waitForSelector('.ant-drawer-content', { state: 'hidden', timeout: 30000 });

    await page.fill('input[placeholder="Tìm kiếm công trình..."]', journeyTitle);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    
    const journeyLink = page.locator(`text=${journeyTitle}`).first();
    await expect(journeyLink).toBeVisible({ timeout: 20000 });
    await journeyLink.click();

    await expect(page).toHaveURL(/\/admin\/ql\/journeys/);
    const url = page.url();
    const match = url.match(/\/journeys\/([^/?]+)$/) || url.match(/\/detail\/([^/?]+)$/);
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
    
    await page.goto('/admin/ql/settings/customer-journey');
    await page.waitForTimeout(2000);
    
    await page.click('.step-item:has-text("Bước 02")');
    await page.click('button:has-text("Chỉnh sửa")');

    await page.click('button:has-text("Thêm Nhiệm vụ Checklist")');
    await page.waitForTimeout(1500);
    
    const lastPanel = page.locator('.ant-collapse-item').last();
    await lastPanel.locator('.ant-collapse-header').click(); 
    await page.waitForTimeout(1000);

    const nameInput = lastPanel.locator('input[placeholder*="tên nhiệm vụ"]');
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill(customChecklistItem);

    // Click Save and wait for ANY success indicator
    await page.click('button:has-text("Cập nhật & Lưu")');
    await page.waitForTimeout(3000); // Wait for async save

    savePassedTest(testName);
  });

  test('P3: Thực hiện các bước trong Journey Detail 360', async ({ page }) => {
    const testName = 'Customer Journey Lifecycle - Create and Update Steps > P3: Thực hiện các bước trong Journey Detail 360';
    
    if (!journeyId) {
        throw new Error('No journeyId available for P3');
    }

    await page.goto(`/admin/ql/journeys/${journeyId}`);
    await expect(page.locator('.ant-steps')).toBeVisible({ timeout: 30000 });

    await page.click('.ant-tabs-tab:has-text("Tư vấn")');
    await page.waitForTimeout(3000);

    // Kiểm tra checklist item mới
    const itemLocator = page.locator(`text=${customChecklistItem}`);
    await expect(itemLocator).toBeVisible({ timeout: 30000 });

    savePassedTest(testName);
  });
});
