import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../constants/passed-tests.json');

/**
 * Đọc danh sách các test đã pass từ file
 */
export function getPassedTests(): string[] {
  try {
    if (fs.existsSync(REGISTRY_PATH)) {
      const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading passed tests registry:', error);
  }
  return [];
}

/**
 * Cập nhật danh sách các test đã pass
 */
export function savePassedTests(tests: string[]) {
  try {
    const dir = path.dirname(REGISTRY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(tests, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving passed tests registry:', error);
  }
}

/**
 * Thêm một test vào danh sách đã pass
 */
export function savePassedTest(testName: string) {
  const tests = getPassedTests();
  if (!tests.includes(testName)) {
    tests.push(testName);
    savePassedTests(tests);
  }
}
