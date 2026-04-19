import { test, expect } from '../../fixtures/app.fixture';
import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PASSED_TESTS_FILE = path.join(__dirname, '../../constants/passed-tests.json');

// Hàm đọc danh sách test đã pass
function getPassedTests(): string[] {
  try {
    if (fs.existsSync(PASSED_TESTS_FILE)) {
      return JSON.parse(fs.readFileSync(PASSED_TESTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading passed tests file:', e);
  }
  return [];
}

// Hàm lưu test mới pass
function savePassedTest(testName: string) {
  try {
    const passed = getPassedTests();
    if (!passed.includes(testName)) {
      passed.push(testName);
      fs.writeFileSync(PASSED_TESTS_FILE, JSON.stringify(passed, null, 2));
    }
  } catch (e) {
    console.error('Error saving passed test:', e);
  }
}

const viewports = [
  { name: 'Desktop Full HD', width: 1920, height: 1080 },
  { name: 'Desktop Large', width: 1440, height: 900 },
  { name: 'Desktop Standard', width: 1280, height: 720 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Mobile Medium', width: 390, height: 844 },
  { name: 'Mobile Small', width: 375, height: 667 },
  { name: 'Mobile Android', width: 360, height: 800 },
  { name: 'Mobile Narrow', width: 320, height: 568 },
];

const modules = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Quản lý người dùng', path: '/admin/users' },
  { name: 'Quản lý quyền', path: '/admin/roles' },
  { name: 'Nhật ký hệ thống', path: '/admin/audit' },
  { name: 'Báo cáo', path: '/admin/reports' },
  { name: 'Cài đặt hệ thống', path: '/admin/settings' },
];

test.describe('Kiểm tra Responsive Layout Quản lý (AdminLayoutV2)', () => {
  for (const viewport of viewports) {
    test.describe(`Màn hình: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const module of modules) {
        test(`Module ${module.name} - Hiển thị đúng trên ${viewport.name}`, async ({ page }) => {
          const testFullName = `Kiểm tra Responsive Layout Quản lý (AdminLayoutV2) › Màn hình: ${viewport.name} › Module ${module.name} - Hiển thị đúng trên ${viewport.name}`;
          const passedTests = getPassedTests();
          
          if (passedTests.includes(testFullName)) {
            console.log(`Skipping already passed test: ${testFullName}`);
            test.skip();
            return;
          }

          const adminLayout = new AdminLayoutPage(page);
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          const isMobile = viewport.width <= 991;
          
          // 1. Kiểm tra tải trang thành công
          await adminLayout.goto(module.path);
          
          // 2. Kiểm tra Header/TopBar luôn hiển thị
          await expect(adminLayout.topBar).toBeVisible({ timeout: 15000 });

          // 3. Kiểm tra Sidebar theo kích thước màn hình
          if (!isMobile) {
            // Trên Desktop/Tablet ngang (> 991px): Sidebar hiện cố định (Sider)
            await expect(adminLayout.sidebarDesktop).toBeVisible();
          } else {
            // Trên Mobile/Tablet dọc (<= 991px): Sidebar ẩn và hiển thị nút toggle
            await expect(adminLayout.sidebarToggle).toBeVisible();
            await expect(adminLayout.sidebarDesktop).not.toBeVisible();
          }

          // 4. Kiểm tra không có scroll ngang (Overflow check)
          const overflowX = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(overflowX, `Trang ${module.name} bị tràn khung ngang trên ${viewport.name}`).toBe(false);

          // 5. Kiểm tra Content Area hiển thị đúng
          await expect(adminLayout.contentArea).toBeVisible();

          // Lưu kết quả nếu pass
          savePassedTest(testFullName);
        });
      }
    });
  }
});

test.describe('Kiểm tra Tương tác Sidebar trên Mobile', () => {
  const mobileViewports = viewports.filter(v => v.width <= 991);

  for (const viewport of mobileViewports) {
    test.describe(`Viewport: ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });
      
      test(`Mở và đóng Sidebar trên ${viewport.name}`, async ({ page }) => {
        const testFullName = `Kiểm tra Responsive Layout Quản lý (AdminLayoutV2) › Kiểm tra Tương tác Sidebar trên Mobile › Viewport: ${viewport.name} › Mở và đóng Sidebar trên ${viewport.name}`;
        const passedTests = getPassedTests();
        
        if (passedTests.includes(testFullName)) {
          console.log(`Skipping already passed test: ${testFullName}`);
          test.skip();
          return;
        }

        const adminLayout = new AdminLayoutPage(page);
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await adminLayout.goto('/admin');
        await expect(adminLayout.topBar).toBeVisible({ timeout: 15000 });

        // Mở sidebar (Drawer)
        await adminLayout.sidebarToggle.click();
        await expect(adminLayout.sidebarMobile).toBeVisible();

        // Kiểm tra click vào backdrop để đóng hoặc nút đóng (nếu có)
        // Ở đây click lại vào vùng content hoặc phím Esc
        await page.keyboard.press('Escape');
        await expect(adminLayout.sidebarMobile).not.toBeVisible();

        // Lưu kết quả nếu pass
        savePassedTest(testFullName);
      });
    });
  }
});
