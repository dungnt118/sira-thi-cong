import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // Theo yêu cầu phát hiện gap/fail, không nên retry quá nhiều
  workers: process.env.CI ? 1 : undefined,
  
  // Sử dụng reporter mặc định và reporter tùy chỉnh để lưu danh sách pass
  reporter: [
    ['html'],
    ['./passed-reporter.ts']
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Mặc định sử dụng tài khoản manager
    storageState: 'playwright/.auth/manager.json',
  },

  projects: [
    // Project để chạy authenticate trước các test khác
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Project chính: Chromium Desktop sử dụng quyền manager
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['setup'],
    },

    // Project Admin: Chạy với quyền admin
    {
      name: 'admin-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },

    // Project Mobile
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});
