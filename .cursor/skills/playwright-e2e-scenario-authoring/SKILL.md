---
name: playwright-e2e-scenario-authoring
description: Hướng dẫn agent phân tích codebase và viết kịch bản Playwright E2E theo khung test của repo (test/, test-results/), seed qua UI, bao phủ luồng đầy đủ, ưu tiên phát hiện bug và bằng chứng hình ảnh/video. Mặc định chỉ tập trung desktop (project Chromium) — không tạo thêm kịch bản riêng cho mobile và không coi mobile là phạm vi bắt buộc trừ khi người dùng yêu cầu rõ. Tiêu đề test.describe/test và chuỗi hiển thị trên báo cáo phải dùng tiếng Việt có dấu, khớp thuật ngữ UI/nghiệp vụ. Khi có lỗi, báo cáo phải đính kèm console logs và API request/response liên quan cùng ảnh/video/trace. Dùng khi người dùng yêu cầu tạo/sửa test E2E, mở rộng coverage module, hoặc viết scenario Playwright theo chức năng cụ thể.
---

# Playwright E2E — soạn kịch bản theo kiến trúc dự án

## Phạm vi

Skill này áp dụng cho **frontend CMS** (React, Ant Design) trong repo này. Agent phải **bám cấu trúc thư mục và quy ước sẵn có** dưới `test/`, không phát minh pattern mới nếu đã có mẫu tương tự.

## Khám phá bắt buộc trước khi viết code test

1. **Đọc** `test/README.md` — biến môi trường, lệnh chạy, ý nghĩa các thư mục.
2. **Đọc** `playwright.config.ts` — `testDir`, `outputDir` (`test-results/artifacts`), `trace` / `screenshot` / `video`, `projects` (setup + chromium; có thêm mobile-chrome nhưng xem mục **Mobile** bên dưới), timeout.
3. **Tìm module/chức năng trong source** (`src/app/exts/...`) — route, component, form, dialog, message thành công/lỗi.
4. **Rà soát test hiện có** — `test/e2e/**`, `test/page-objects/**`, `test/helpers/**`, `test/constants/routes.ts`; tái sử dụng Page Object và fixture thay vì nhân bản locator.
5. **Luồng UI/UX** — lập danh sách từng bước người dùng (menu → trang → tab → nút → modal/drawer → submit → feedback). Kịch bản phải **phản ánh đủ các thao tác có ý nghĩa**, không “nhảy cóc” màn hình.

## Cấu trúc file (chuẩn repo)

| Thành phần | Vai trò |
|------------|---------|
| `test/setup/*.setup.ts` | Auth / storage state — không nhân đôi logic login trong từng spec nếu đã dùng `storageState`. |
| `test/fixtures/app.fixture.ts` | Mở rộng `test` với fixture (docs, bundle theo module). |
| `test/page-objects/<module>/` | Encapsulate locator, `goto`, `expectLoaded`, thao tác form/dialog/table. |
| `test/helpers/` | Auth module (`ensureHrmAdminContext`, …), `unique` token, `graphql` nếu cần, attach tài liệu. |
| `test/e2e/<module>/` | `*.spec.ts` — `test.describe` / `test('...')` theo nghiệp vụ, **tiếng Việt có dấu** (xem mục Ngôn ngữ). |
| `test/constants/routes.ts` | `APP_ROUTES` — luôn ưu tiên route hằng số thay vì string rải rác. |

**Chia nhỏ module lớn**

- Cho phép tổ chức: `test/e2e/<module-name>/<sub-module-name>/*.spec.ts`.
- **Vẫn phải có** (khi phù hợp) file/spec ở cấp `test/e2e/<module-name>/` chạy **full journey theo module** (smoke/regression tích hợp) để người dùng chạy một lệnh cho cả module.
- Tránh trùng lặp: logic chung → Page Object hoặc helper; không copy-paste dài dòng giữa các spec.

## Ngôn ngữ kịch bản (bắt buộc: tiếng Việt có dấu)

- **`test.describe`**, **`test('...')`**, và **ghi chú trong spec** (khi có) phải viết **tiếng Việt có dấu**, câu rõ ràng, trùng hoặc gần với **nhãn UI / thuật ngữ nghiệp vụ** đang kiểm tra (ví dụ đúng app: «Chính sách chấm công», «Mã ca làm việc» — không viết không dấu kiểu «Chinh sach cham cong» trừ khi chính UI hiển thị vậy).
- Mục đích: báo cáo HTML/trace của Playwright **khớp ngữ cảnh nghiệp vụ** khi tester/PO đọc, không lệch so với màn hình thật.
- **Code** (tên biến, class Page Object, tên file): giữ convention TypeScript/English của repo; chỉ phần **mô tả hành vi trong test** và **chuỗi attach** hướng người dùng là tiếng Việt có dấu.

## Nguyên tắc nội dung kịch bản

### Mobile (mặc định: không bắt buộc)

- **Mặc định không** thêm kịch bản chỉ phục vụ mobile, **không** yêu cầu user chạy project `mobile-chrome`, và **không** nhân đôi suite chỉ để cover viewport mobile — trừ khi **người dùng yêu cầu rõ** (responsive, gesture, breakpoint, v.v.).
- Khi user yêu cầu mobile: mới bổ sung test/assertion phù hợp hoặc hướng dẫn chạy `yarn playwright test --project=mobile-chrome ...` theo `playwright.config.ts`.

### Seed data qua UI (mặc định)

- **Ưu tiên** tạo/chỉnh dữ liệu qua form, dialog, bảng mà UI nghiệp vụ cung cấp — giống người dùng thật.
- Dùng token duy nhất (`test/helpers/unique.ts` hoặc pattern tương tự) để tránh đụng dữ liệu cố định của môi trường.
- Sau khi test thay đổi cấu hình dùng chung: **khối `try/finally` hoặc teardown** để hoàn nguyên nếu codebase đã làm vậy (tham chiếu spec HRM hiện có).

### Không bỏ qua thao tác (mặc định)

- **Mỗi** click/tab/chọn có ý nghĩa trong luồng đều phải có trong kịch bản hoặc được gói trong Page Object với tên method mô tả đúng bước — không “giả lập” bằng `page.goto` tới URL đích nếu người dùng yêu cầu kiểm tra đường đi UI đầy đủ.
- **Chỉ skip** khi người dùng **nói rõ** (ví dụ: bỏ qua bước X; mobile đã mặc định không nằm trong phạm vi — không cần user nói «skip mobile»).
- **Dữ liệu nhạy cảm** (mật khẩu thật, PII, xóa hàng loạt production-like): **không tự skip** — ghi trong kịch bản chỗ cần xác nhận user hoặc dùng biến môi trường / tài khoản test đã thống nhất.

### Mục tiêu: phát hiện lỗi, không chỉ “pass”

- Assertion phải kiểm tra **hành vi kỳ vọng** (text, trạng thái nút, hiển thị bản ghi, message server) — nếu sản phẩm đang sai, test **fail** là đúng.
- Tránh `expect(true).toBe(true)` hoặc chờ không kiểm tra kết quả.
- Ghi chú trong test hoặc mô tả `test()` khi có **GAP** giữa tài liệu và UI (có thể attach doc — xem dưới).

### Bằng chứng khi lệch kỳ vọng

Cấu hình mặc định đã có trace/screenshot/video **retain-on-failure** / **only-on-failure**. Trong code:

- Dùng `testInfo.attach` cho log bổ sung khi cần (stack, HTML snippet).
- Với điểm nghi ngờ: có thể `await page.screenshot({ path: ... })` trong `catch` hoặc trước assertion quan trọng — **ưu tiên không làm phình kích thước repo**; artifact chính nằm dưới `test-results/` khi chạy CI/local.

### Bằng chứng kỹ thuật bắt buộc khi test fail

- Ngoài ảnh/video/trace, phải thu thập và attach vào report: **console log**, **API request**, **API response** của thời điểm màn lỗi.
- Thiết lập listener theo test để gom dữ liệu:
  - `page.on('console', ...)`: lưu `type`, `text`, `location` (url/line/column) cho log mức `error`, `warning` (có thể giữ thêm `info` nếu liên quan).
  - `page.on('request')` + `page.on('response')`: theo dõi endpoint nghiệp vụ của module đang test (ưu tiên `graphql`, REST module), lưu `method`, `url`, `status`, `request payload`, `response body` (nếu đọc được).
- Trong `catch` hoặc khi chuẩn bị throw:
  - chụp screenshot bổ sung (nếu cần),
  - attach các file `console-log.json`, `network-log.json`, `failed-step-context.md` qua `testInfo.attach`.
- Nếu response chứa dữ liệu nhạy cảm (token, mật khẩu, PII), bắt buộc **mask** trước khi attach (ví dụ `Authorization`, `password`, `access_token`).
- Không cần log toàn bộ network của cả test; ưu tiên **cửa sổ thời gian quanh bước lỗi** và endpoint liên quan để báo cáo súc tích, dễ đọc.

### Tài liệu đính kèm report

Theo `test/README.md`, ưu tiên attach **seed JSON / scenario markdown / tester rules** vào report qua `testInfo.attach` (pattern `attachHrmDocs`, `loadModuleDocs` trong helpers). Khi thêm module mới: cập nhật helper tương ứng hoặc attach file trong `test/fixtures` nếu chưa có bundle.

## Checklist agent trước khi hoàn thành

- [ ] Đã map route + Page Object + spec path phù hợp `test/e2e/...`
- [ ] `describe` / tiêu đề `test(...)` **tiếng Việt có dấu**, sát nghiệp vụ và nhãn UI
- [ ] Không thêm phạm vi mobile trừ khi user yêu cầu
- [ ] Seed/hoàn nguyên an toàn; token unique
- [ ] Luồng UI đủ bước (theo yêu cầu), không skip trừ khi user cho phép
- [ ] Assertion có ý nghĩa; có thể fail nếu bug tồn tại
- [ ] Khi fail có đủ bằng chứng: screenshot/video/trace + console log + API request/response liên quan
- [ ] Không xóa/thay thế hàm helper hoặc Page Object cũ chỉ để “dọn code” — chỉ mở rộng hoặc sửa tối thiểu phục vụ scenario
- [ ] Chạy `yarn playwright test <đường_dẫn_spec>` (mặc định project desktop; thêm `--project=mobile-chrome` chỉ khi có yêu cầu mobile) khi môi trường cho phép

## Tham chiếu nhanh

- Biến môi trường: xem bảng trong `test/README.md`.
- Artifact: `test-results/artifacts` (Playwright `outputDir`).

## Tài liệu chi tiết thêm (tùy chọn)

Nếu cần mở rộng (template `describe`, mẫu attach file), thêm vào [reference.md](reference.md) trong cùng thư mục skill và link một cấp từ file này.
