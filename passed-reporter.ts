import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { getPassedTests, savePassedTests } from './test/helpers/registry';

class PassedReporter implements Reporter {
  private passedTests: Set<string>;

  constructor() {
    this.passedTests = new Set(getPassedTests());
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passedTests.add(test.titlePath().join(' > '));
    }
  }

  async onEnd(result: FullResult) {
    savePassedTests(Array.from(this.passedTests));
    console.log(`\nRegistry updated: ${this.passedTests.size} tests marked as passed.`);
  }
}

export default PassedReporter;
