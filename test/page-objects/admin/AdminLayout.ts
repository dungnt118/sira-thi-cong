import { Page, Locator, expect } from '@playwright/test';

export class AdminLayoutPage {
  readonly page: Page;
  readonly sidebarDesktop: Locator;
  readonly sidebarMobile: Locator;
  readonly sidebarToggle: Locator;
  readonly topBar: Locator;
  readonly contentArea: Locator;

  constructor(page: Page) {
    this.page = page;
    // Dựa trên Ant Design components dùng trong AdminLayoutV2
    this.sidebarDesktop = page.locator('aside');
    this.sidebarMobile = page.locator('.ant-drawer-content');
    this.sidebarToggle = page.locator('header button').filter({ hasText: '' }).first(); // Nút chứa Menu icon
    // Hoặc cụ thể hơn nếu Ant Design render aria-label hoặc dùng svg class
    this.sidebarToggle = page.locator('header button').filter({ has: page.locator('.anticon-menu') });
    this.topBar = page.locator('.ant-layout-header'); 
    this.contentArea = page.locator('.ant-layout-content');
  }

  async goto(path: string = '/admin') {
    await this.page.goto(path);
  }

  async toggleSidebar() {
    await this.sidebarToggle.click();
  }

  async isMobile() {
    return this.page.viewportSize()?.width! <= 991;
  }
}
