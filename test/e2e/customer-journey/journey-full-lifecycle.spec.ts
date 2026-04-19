import { test, expect } from '../../fixtures/app.fixture';
import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';

/**
 * Thử thách: Kịch bản test E2E 12 bước xuyên suốt vòng đời công trình (Customer Journey).
 * Bao gồm cập nhật tiến độ thi công thực tế qua Site Report.
 */
test('Customer Journey Full Lifecycle - All 12 Steps in sequence', async ({ page }) => {
  test.setTimeout(420000); // 7 phút cho toàn bộ quy trình 12 bước

  const journeyTitle = `Full Lifecycle ${Date.now()}`;
  let journeyId = '';

  const STEPS = [
    { key: 'lead_new', label: 'Tiếp nhận' },
    { key: 'consult_contact', label: 'Tư vấn' },
    { key: 'site_survey', label: 'Khảo sát' },
    { key: 'solution_design', label: 'Giải pháp' },
    { key: 'quotation', label: 'Báo giá' },
    { key: 'contract', label: 'Hợp đồng' },
    { key: 'execution', label: 'Thi công' },
    { key: 'final_acceptance', label: 'Nghiệm thu' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'maintenance', label: 'Bảo trì' },
    { key: 'warranty', label: 'Bảo hành' },
    { key: 'after_sales', label: 'Hậu mãi' },
  ];

  // Log browser errors and useful info
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Submit error') || msg.text().includes('Backend Response')) {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]: ${msg.text()}`);
    }
  });

  // --- Step 0: Tạo mới Journey ---
  console.log('--- Step 0: Tạo mới yêu cầu công trình ---');
  await page.goto('/admin/ql/journeys', { waitUntil: 'networkidle' });
  
  const createBtn = page.getByRole('button', { name: /Tạo yêu cầu/i }).first();
  await createBtn.waitFor({ state: 'visible', timeout: 30000 });
  await createBtn.click();
  
  await page.waitForSelector('.ant-drawer-content', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000); 
  
  const phone = '0984016786';
  await page.fill('input#customer_phone', phone);
  const option = page.locator('.ant-select-item-option-content:visible').filter({ hasText: phone }).first();
  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.click();

  await page.fill('input#request_title', journeyTitle);
  await page.fill('input#area_m2', '150');
  await page.fill('input#execution_days', '45');
  
  const serviceSelect = page.locator('.ant-select-selector').filter({ hasText: /Chọn loại dịch vụ/i });
  await serviceSelect.click();
  const serviceOption = page.locator('.ant-select-item-option-content:visible >> text=Chống thấm').first();
  await serviceOption.waitFor({ state: 'visible' });
  await serviceOption.click();

  await page.click('button[type="submit"]:has-text("Tạo mới")');
  await page.waitForSelector('.ant-drawer-content', { state: 'hidden', timeout: 30000 });

  // Tìm kiếm và mở chi tiết
  const searchInput = page.locator('input[placeholder*="Tìm kiếm công trình"]');
  await searchInput.fill(journeyTitle);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  const journeyLink = page.locator(`text=${journeyTitle}`).first();
  await expect(journeyLink).toBeVisible({ timeout: 15000 });
  await journeyLink.click();

  await expect(page).toHaveURL(/\/admin\/ql\/journeys\/[a-zA-Z0-9]+/);
  journeyId = page.url().split('/').pop()?.split('?')[0] || '';
  console.log(`Created Journey ID: ${journeyId}`);

  // --- Lặp qua 12 bước ---
  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];
    const isLastStep = i === STEPS.length - 1;
    console.log(`\n--- Step ${i + 1}/12: Xử lý giai đoạn "${step.label}" ---`);

    // Kiểm tra trạng thái trang và xác nhận đúng bước
    const stepIndicator = `${i + 1}/12`;
    console.log(`Đợi chỉ báo bước: ${stepIndicator}`);
    
    let pageOk = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await expect(page.locator('.ant-typography')).toContainText(stepIndicator, { timeout: 15000 });
        pageOk = true;
        break;
      } catch (e) {
        const bodyText = await page.innerText('body');
        if (bodyText.includes('Not Found') || bodyText.includes('404')) {
          console.log(`[DEBUG] 404/Not Found detected at step ${stepIndicator}. Attempting reload ${attempt}/3...`);
          await page.waitForTimeout(3000);
          await page.goto(`/admin/ql/journeys/${journeyId}`, { waitUntil: 'networkidle' });
        } else {
          // Có thể do trang đang load, thử lại
          await page.waitForTimeout(2000);
        }
      }
    }
    if (!pageOk) throw new Error(`Trang không hiển thị đúng chỉ báo bước ${stepIndicator}`);

    // 1. Cập nhật tiến độ tại bước Thi công (execution)
    if (step.key === 'execution') {
      console.log('-> Cập nhật tiến độ thi công qua Site Report (85%)');
      const openTasksBtn = page.locator('span[role="button"]').filter({ has: page.locator('.anticon-carry-out') }).first();
      await openTasksBtn.click();
      await page.waitForSelector('.ant-modal-content:has-text("Danh sách công việc")', { state: 'visible' });

      const reportBtn = page.locator('button:has-text("Báo cáo")').first();
      await expect(reportBtn).toBeVisible({ timeout: 10000 });
      await reportBtn.click();
      
      await page.waitForSelector('.ant-modal-content:has-text("Báo cáo hiện trường")', { state: 'visible' });
      await page.fill('.ant-modal-content input#title', 'Báo cáo tiến độ thi công tự động từ Playwright');
      await page.fill('.ant-modal-content input#progress_pct', '85');
      await page.fill('.ant-modal-content textarea#content', 'Tiến độ thực tế đạt 85%.');
      
      await page.click('.ant-modal-footer button:has-text("OK")');
      await page.waitForSelector('.ant-modal-content:has-text("Báo cáo hiện trường")', { state: 'hidden' });
      
      await page.click('button:has-text("Đóng")');
      await page.waitForSelector('.ant-modal-content:has-text("Danh sách công việc")', { state: 'hidden' });

      const pctText = page.locator('text=85%').first();
      await expect(pctText).toBeVisible({ timeout: 10000 });
      console.log('-> Đã xác nhận tiến độ 85% trên giao diện.');
    }

    // 2. Hoàn thành tất cả công việc (WorkTasks)
    const tasksModal = page.locator('.ant-modal-content:has-text("Danh sách công việc")');
    if (!(await tasksModal.isVisible())) {
      const openTasksBtn = page.locator('span[role="button"]').filter({ has: page.locator('.anticon-carry-out') }).first();
      await openTasksBtn.click();
      await page.waitForSelector('.ant-modal-content:has-text("Danh sách công việc")', { state: 'visible' });
    }

    const tasksList = page.locator('.ant-list-items .ant-list-item');
    const taskCount = await tasksList.count();
    console.log(`-> Đang xử lý ${taskCount} công việc...`);

    for (let j = 0; j < taskCount; j++) {
      const task = tasksList.nth(j);
      const statusSelect = task.locator('.ant-select');
      if (await statusSelect.isVisible()) {
        const currentStatus = await statusSelect.innerText();
        if (currentStatus !== 'Xong') {
          await statusSelect.click();
          await page.click('.ant-select-item-option-content:visible >> text=Xong');
          await page.waitForTimeout(500); 
        }
      }
    }

    // 3. Xác nhận hoàn thành bước
    if (!isLastStep) {
      console.log(`-> Nhấn xác nhận hoàn thành bước "${step.label}"`);
      const finalizeBtn = page.locator('button:has-text("Xác nhận hoàn thành bước")');
      await expect(finalizeBtn).toBeEnabled({ timeout: 15000 });
      await finalizeBtn.click();

      const confirmOk = page.locator('.ant-modal-confirm-btns button:has-text("Đồng ý")');
      if (await confirmOk.isVisible({ timeout: 3000 })) {
        await confirmOk.click();
      }

      await page.waitForSelector('.ant-modal-content:has-text("Danh sách công việc")', { state: 'hidden', timeout: 20000 });
      console.log(`[SUCCESS] Hoàn thành bước ${step.label}.`);
      await page.waitForTimeout(3000); // Đợi backend xử lý chuyển trạng thái
    } else {
      console.log('--- Hoàn tất quy trình 12 bước thành công! ---');
      await page.click('button:has-text("Đóng")');
    }
  }
});
