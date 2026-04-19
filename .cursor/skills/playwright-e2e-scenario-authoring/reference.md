# Tham chiếu bổ sung — Playwright E2E (repo này)

## Mẫu tổ chức spec (gợi ý)

```typescript
import { test, expect } from '../../fixtures/app.fixture';
import { SomePage } from '../../page-objects/<module>/some.page';

// Tiêu đề describe/test: tiếng Việt có dấu, trùng hoặc gần nhãn UI (ví dụ HRM).
test.describe('HRM | Cấu hình ca và lịch làm việc', () => {
    test.describe.configure({ mode: 'serial' }); // khi test phụ thuộc thứ tự / dữ liệu chung

    test.beforeEach(async ({ page }, testInfo) => {
        // attach docs: await attachModuleDocs(testInfo, ...);
        // await ensure<Module>Context(page);
    });

    test('lưu nháp chính sách chấm công rồi công bố và hoàn nguyên được', async ({ page }) => {
        const p = new SomePage(page);
        await p.goto();
        await p.expectLoaded();
        // ... thao tác qua method Page Object ...
        await expect(page.locator('body')).toContainText('...', { timeout: 20_000 });
    });
});
```

## Gợi ý attach bằng chứng thủ công (điểm nghi ngờ)

```typescript
await testInfo.attach('before-submit.png', {
    body: await page.screenshot(),
    contentType: 'image/png'
});
```

## Mẫu thu thập console + API request/response khi lỗi

```typescript
type ConsoleEntry = { type: string; text: string; url?: string; line?: number; column?: number };
type NetworkEntry = {
    phase: 'request' | 'response';
    method?: string;
    url: string;
    status?: number;
    payload?: string;
    body?: string;
};

const consoleEntries: ConsoleEntry[] = [];
const networkEntries: NetworkEntry[] = [];

page.on('console', (msg) => {
    const t = msg.type();
    if (t === 'error' || t === 'warning') {
        const loc = msg.location();
        consoleEntries.push({ type: t, text: msg.text(), url: loc.url, line: loc.lineNumber, column: loc.columnNumber });
    }
});

page.on('request', async (req) => {
    if (!req.url().includes('/graphql') && !req.url().includes('/api/')) return;
    const raw = req.postData();
    networkEntries.push({
        phase: 'request',
        method: req.method(),
        url: req.url(),
        payload: raw ? raw.replace(/\"password\":\"[^\"]+\"/g, '\"password\":\"***\"') : undefined
    });
});

page.on('response', async (res) => {
    if (!res.url().includes('/graphql') && !res.url().includes('/api/')) return;
    let body = '';
    try {
        body = await res.text();
    } catch {
        body = '<không đọc được response body>';
    }
    networkEntries.push({
        phase: 'response',
        method: res.request().method(),
        url: res.url(),
        status: res.status(),
        body
    });
});

try {
    // ... steps + assertions
} catch (error) {
    await testInfo.attach('console-log.json', {
        body: Buffer.from(JSON.stringify(consoleEntries, null, 2), 'utf8'),
        contentType: 'application/json'
    });
    await testInfo.attach('network-log.json', {
        body: Buffer.from(JSON.stringify(networkEntries, null, 2), 'utf8'),
        contentType: 'application/json'
    });
    throw error;
}
```

## Chạy cục bộ

Mặc định chỉ cần desktop Chromium (không bắt buộc mobile trừ khi user yêu cầu):

```bash
yarn e2e:install
yarn playwright test test/e2e/<module>
```

Chỉ khi có yêu cầu kiểm tra mobile:

```bash
yarn playwright test test/e2e/<module> --project=mobile-chrome
```

Xem thêm `test/README.md` và `playwright.config.ts`.
