/**
 * Sanitize HTML nội dung thông báo (thay thế module playbook không có trong repo).
 * Giảm rủi ro XSS cơ bản; nội dung vẫn tin cậy phần lớn từ backend.
 */
export function sanitizeNotificationHtml(html: string): string {
    if (!html) {
        return '';
    }
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/javascript:/gi, '');
}
