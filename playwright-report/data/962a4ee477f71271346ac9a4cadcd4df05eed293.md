# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-layout\layout-responsive.spec.ts >> Kiểm tra Responsive Layout Quản lý (AdminLayoutV2) >> Màn hình: Desktop Full HD (1920x1080) >> Module Quản lý người dùng - Hiển thị đúng trên Desktop Full HD
- Location: test\e2e\admin-layout\layout-responsive.spec.ts:32:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/users
Call log:
  - navigating to "http://localhost:5173/admin/users", waiting until "load"

```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class AdminLayoutPage {
  4  |   readonly page: Page;
  5  |   readonly sidebarDesktop: Locator;
  6  |   readonly sidebarMobile: Locator;
  7  |   readonly sidebarToggle: Locator;
  8  |   readonly topBar: Locator;
  9  |   readonly contentArea: Locator;
  10 | 
  11 |   constructor(page: Page) {
  12 |     this.page = page;
  13 |     // Dựa trên Ant Design components dùng trong AdminLayoutV2
  14 |     this.sidebarDesktop = page.locator('.ant-layout-sider');
  15 |     this.sidebarMobile = page.locator('.ant-drawer-content');
  16 |     this.sidebarToggle = page.locator('header button.ant-btn-text'); // Nút MenuOutlined trên mobile
  17 |     this.topBar = page.locator('header.ant-layout-header'); 
  18 |     this.contentArea = page.locator('.ant-layout-content');
  19 |   }
  20 | 
  21 |   async goto(path: string = '/admin') {
> 22 |     await this.page.goto(path);
     |                     ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/users
  23 |   }
  24 | 
  25 |   async toggleSidebar() {
  26 |     await this.sidebarToggle.click();
  27 |   }
  28 | 
  29 |   async isMobile() {
  30 |     return this.page.viewportSize()?.width! <= 991;
  31 |   }
  32 | }
  33 | 
```