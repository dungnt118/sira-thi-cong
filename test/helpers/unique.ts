/**
 * Tạo một token hoặc chuỗi duy nhất để dùng cho dữ liệu test
 * @param prefix Tiền tố cho chuỗi
 * @returns Chuỗi duy nhất dạng prefix-timestamp
 */
export function uniqueToken(prefix: string = 'test'): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}
