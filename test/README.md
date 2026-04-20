# Playwright E2E Testing

## Cấu trúc thư mục
- `test/setup/`: Các script thiết lập môi trường, ví dụ: Authentication/Storage state.
- `test/fixtures/`: Mở rộng Playwright `test` với các fixture tùy chỉnh.
- `test/page-objects/`: Chứa các Page Object Model để quản lý locator và action.
- `test/helpers/`: Các hàm tiện ích dùng chung (unique token, graphql, ...).
- `test/e2e/admin-layout/`: Chứa các bộ test cho Layout Quản lý.
  - `layout-responsive.spec.ts`: Kiểm tra hiển thị của Sidebar, Topbar, Content trên 10 loại màn hình (Desktop, Tablet, Mobile) cho tất cả các module chính (Dashboard, Users, Roles, Audit, Reports, Settings). (Tổng cộng 60+ kịch bản).
  - `components-responsive.spec.ts`: Kiểm tra tính tương thích của các thành phần UI (Bảng, Form, Modal, Card) trên mobile.
- `test-results/`: Chứa kết quả test, trace, screenshot, video (tự động tạo khi chạy test).

## Biến môi trường
Tạo file `.env` hoặc thiết lập biến môi trường:
| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `BASE_URL` | URL của ứng dụng | `http://localhost:5173` |
| `ADMIN_USER` | Tài khoản admin | - |
| `ADMIN_PASSWORD` | Mật khẩu admin | - |

## Lệnh chạy test
- Chạy tất cả test: `npx playwright test`
- Chạy một spec cụ thể: `npx playwright test test/e2e/module/name.spec.ts`
- Chạy với giao diện (UI mode): `npx playwright test --ui`
- Xem báo cáo: `npx playwright show-report`

## Quy ước viết test
- **Tiêu đề test**: Phải viết bằng **tiếng Việt có dấu**, sát với nghiệp vụ UI.
- **Page Object**: Sử dụng Page Object cho mọi tương tác màn hình.
- **Dữ liệu**: Sử dụng helper `unique` để tạo dữ liệu không trùng lặp.
- **Bằng chứng**: Trace/Screenshot/Video được cấu hình tự động lưu khi test fail.
