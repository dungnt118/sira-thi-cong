import { test, expect } from '../../fixtures/app.fixture';
import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';

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
          const adminLayout = new AdminLayoutPage(page);
          const isMobile = viewport.width <= 991;
          
          // 1. Kiểm tra tải trang thành công
          await adminLayout.goto(module.path);
          
          // 2. Kiểm tra Header/TopBar luôn hiển thị
          await expect(adminLayout.topBar).toBeVisible();

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
        });
      }
    });
  }
});

test.describe('Kiểm tra Tương tác Sidebar trên Mobile', () => {
  const mobileViewports = viewports.filter(v => v.width <= 991);

  for (const viewport of mobileViewports) {
    test(`Mở và đóng Sidebar trên ${viewport.name}`, async ({ page }) => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });
      const adminLayout = new AdminLayoutPage(page);
      await adminLayout.goto('/admin');

      // Ban đầu sidebar (Drawer) chưa mở
      await expect(adminLayout.sidebarMobile).not.toBeVisible();

      // Mở sidebar qua nút toggle
      await adminLayout.toggleSidebar();
      await expect(adminLayout.sidebarMobile).toBeVisible();

      // Đóng sidebar (giả định click ra ngoài hoặc nút close nếu có)
      // Trong code hiện tại setDrawerVisible(false) qua onItemClick hoặc onClose của Drawer
      // Click vào vùng mask của Ant Design Drawer để đóng
      await page.locator('.ant-drawer-mask').click();
      await expect(adminLayout.sidebarMobile).not.toBeVisible();
    });
  }
});
