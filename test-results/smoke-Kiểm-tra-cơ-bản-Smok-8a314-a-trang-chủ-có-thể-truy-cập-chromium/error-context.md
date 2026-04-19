# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Kiểm tra cơ bản (Smoke Test) >> Kiểm tra trang chủ có thể truy cập
- Location: test\e2e\smoke.spec.ts:5:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { APP_ROUTES } from '../constants/routes';
  3  | 
  4  | test.describe('Kiểm tra cơ bản (Smoke Test)', () => {
  5  |   test('Kiểm tra trang chủ có thể truy cập', async ({ page }) => {
  6  |     // Đi tới trang chủ dựa trên route hằng số
> 7  |     await page.goto(APP_ROUTES.DASHBOARD);
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  8  | 
  9  |     // Kiểm tra tiêu đề hoặc nội dung cơ bản (điều chỉnh cho phù hợp app thật)
  10 |     // await expect(page).toHaveTitle(/SIRA/);
  11 |     
  12 |     // Ghi log đơn giản
  13 |     console.log('Smoke test completed successfully');
  14 |   });
  15 | });
  16 | 
```