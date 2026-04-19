import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
  testDir: './test',
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
  },

  projects: [
    // Project để chạy authenticate trước các test khác
    {
      name: 'setup',
      testMatch: /setup\/.*\.setup\.ts/,
      use: { storageState: undefined },
    },
    {
      name: 'chromium',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'admin-chromium',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});
