import { test as base, expect } from '@playwright/test';
import { getPassedTests } from '../helpers/registry';

// Mở rộng Playwright test với tính năng tự động skip nếu đã pass trước đó
export const test = base.extend<{ skipIfPassed: void }>({
  skipIfPassed: [async ({}, use, testInfo) => {
    const passedTests = getPassedTests();
    const testFullName = testInfo.titlePath.join(' > ');
    
    if (passedTests.includes(testFullName)) {
      console.log(`Skipping already passed test: ${testFullName}`);
      base.skip();
    }
    
    await use();
  }, { auto: true }], // auto: true giúp nó tự chạy cho mọi test dùng fixture này
});

export { expect };
