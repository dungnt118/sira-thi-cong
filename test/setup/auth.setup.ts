import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authDir = path.join(__dirname, '../../playwright/.auth');

// Danh sách tài khoản
const credentials = {
  admin: { user: 'dungnt118@gmail.com', pass: 'Hano@1002' },
  manager: { user: 'lamnguyen.sira@gmail.com', pass: '123456' },
  supervisor: { user: 'tuanta@gmail.com', pass: '123456' },
};

async function login(page: any, user: string, pass: string, storagePath: string) {
  await page.goto('/login');
  await page.fill('input[placeholder="Tên đăng nhập"]', user);
  await page.fill('input[placeholder="Mật khẩu"]', pass);
  await page.click('button.login-button');
  
  // Đợi đăng nhập thành công (thường là chuyển hướng tới /admin hoặc dashboard)
  await expect(page).not.toHaveURL(/.*\/login/);
  
  await page.context().storageState({ path: storagePath });
}

setup('authenticate as manager (default)', async ({ page }) => {
  await login(page, credentials.manager.user, credentials.manager.pass, path.join(authDir, 'manager.json'));
});

setup('authenticate as admin', async ({ page }) => {
  await login(page, credentials.admin.user, credentials.admin.pass, path.join(authDir, 'admin.json'));
});

setup('authenticate as supervisor', async ({ page }) => {
  await login(page, credentials.supervisor.user, credentials.supervisor.pass, path.join(authDir, 'supervisor.json'));
});
