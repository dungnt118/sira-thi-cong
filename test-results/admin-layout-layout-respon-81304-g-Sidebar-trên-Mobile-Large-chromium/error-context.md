# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-layout\layout-responsive.spec.ts >> Kiểm tra Tương tác Sidebar trên Mobile >> Mở và đóng Sidebar trên Mobile Large
- Location: test\e2e\admin-layout\layout-responsive.spec.ts:70:5

# Error details

```
Error: Playwright Test did not expect test.use() to be called here.
Most common reasons include:
- You are calling test.use() in a configuration file.
- You are calling test.use() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';
  3  | 
  4  | const viewports = [
  5  |   { name: 'Desktop Full HD', width: 1920, height: 1080 },
  6  |   { name: 'Desktop Large', width: 1440, height: 900 },
  7  |   { name: 'Desktop Standard', width: 1280, height: 720 },
  8  |   { name: 'Tablet Landscape', width: 1024, height: 768 },
  9  |   { name: 'Tablet Portrait', width: 768, height: 1024 },
  10 |   { name: 'Mobile Large', width: 414, height: 896 },
  11 |   { name: 'Mobile Medium', width: 390, height: 844 },
  12 |   { name: 'Mobile Small', width: 375, height: 667 },
  13 |   { name: 'Mobile Android', width: 360, height: 800 },
  14 |   { name: 'Mobile Narrow', width: 320, height: 568 },
  15 | ];
  16 | 
  17 | const modules = [
  18 |   { name: 'Dashboard', path: '/admin' },
  19 |   { name: 'Quản lý người dùng', path: '/admin/users' },
  20 |   { name: 'Quản lý quyền', path: '/admin/roles' },
  21 |   { name: 'Nhật ký hệ thống', path: '/admin/audit' },
  22 |   { name: 'Báo cáo', path: '/admin/reports' },
  23 |   { name: 'Cài đặt hệ thống', path: '/admin/settings' },
  24 | ];
  25 | 
  26 | test.describe('Kiểm tra Responsive Layout Quản lý (AdminLayoutV2)', () => {
  27 |   for (const viewport of viewports) {
  28 |     test.describe(`Màn hình: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
  29 |       test.use({ viewport: { width: viewport.width, height: viewport.height } });
  30 | 
  31 |       for (const module of modules) {
  32 |         test(`Module ${module.name} - Hiển thị đúng trên ${viewport.name}`, async ({ page }) => {
  33 |           const adminLayout = new AdminLayoutPage(page);
  34 |           const isMobile = viewport.width <= 991;
  35 |           
  36 |           // 1. Kiểm tra tải trang thành công
  37 |           await adminLayout.goto(module.path);
  38 |           
  39 |           // 2. Kiểm tra Header/TopBar luôn hiển thị
  40 |           await expect(adminLayout.topBar).toBeVisible();
  41 | 
  42 |           // 3. Kiểm tra Sidebar theo kích thước màn hình
  43 |           if (!isMobile) {
  44 |             // Trên Desktop/Tablet ngang (> 991px): Sidebar hiện cố định (Sider)
  45 |             await expect(adminLayout.sidebarDesktop).toBeVisible();
  46 |           } else {
  47 |             // Trên Mobile/Tablet dọc (<= 991px): Sidebar ẩn và hiển thị nút toggle
  48 |             await expect(adminLayout.sidebarToggle).toBeVisible();
  49 |             await expect(adminLayout.sidebarDesktop).not.toBeVisible();
  50 |           }
  51 | 
  52 |           // 4. Kiểm tra không có scroll ngang (Overflow check)
  53 |           const overflowX = await page.evaluate(() => {
  54 |             return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  55 |           });
  56 |           expect(overflowX, `Trang ${module.name} bị tràn khung ngang trên ${viewport.name}`).toBe(false);
  57 | 
  58 |           // 5. Kiểm tra Content Area hiển thị đúng
  59 |           await expect(adminLayout.contentArea).toBeVisible();
  60 |         });
  61 |       }
  62 |     });
  63 |   }
  64 | });
  65 | 
  66 | test.describe('Kiểm tra Tương tác Sidebar trên Mobile', () => {
  67 |   const mobileViewports = viewports.filter(v => v.width <= 991);
  68 | 
  69 |   for (const viewport of mobileViewports) {
  70 |     test(`Mở và đóng Sidebar trên ${viewport.name}`, async ({ page }) => {
> 71 |       test.use({ viewport: { width: viewport.width, height: viewport.height } });
     |            ^ Error: Playwright Test did not expect test.use() to be called here.
  72 |       const adminLayout = new AdminLayoutPage(page);
  73 |       await adminLayout.goto('/admin');
  74 | 
  75 |       // Ban đầu sidebar (Drawer) chưa mở
  76 |       await expect(adminLayout.sidebarMobile).not.toBeVisible();
  77 | 
  78 |       // Mở sidebar qua nút toggle
  79 |       await adminLayout.toggleSidebar();
  80 |       await expect(adminLayout.sidebarMobile).toBeVisible();
  81 | 
  82 |       // Đóng sidebar (giả định click ra ngoài hoặc nút close nếu có)
  83 |       // Trong code hiện tại setDrawerVisible(false) qua onItemClick hoặc onClose của Drawer
  84 |       // Click vào vùng mask của Ant Design Drawer để đóng
  85 |       await page.locator('.ant-drawer-mask').click();
  86 |       await expect(adminLayout.sidebarMobile).not.toBeVisible();
  87 |     });
  88 |   }
  89 | });
  90 | 
```