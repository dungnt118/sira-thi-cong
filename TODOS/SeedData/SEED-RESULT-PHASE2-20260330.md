# Kết quả Phase 2 - Import seed lên hệ thống

## Trạng thái tổng quan

- Mục tiêu: import batch seed từ `TODOS/SeedData` lên BAC backend.
- Kết quả hiện tại: chưa thể chạy import thật do blocker kỹ thuật ở BAC MCP write tool.

## Những gì đã xác minh

- Seed file hiện có đã bao phủ batch business schema cần thiết cho tenant BAC.
- `PortalDocument.files` đã được chuẩn hóa về `null` theo rule mới.
- MCP đã có thêm tool `content-save_setting` dành cho schema `Single`.
- `AssetGroup` schema backend xác nhận đúng field seed, nên lỗi hiện tại không nằm ở seed file.
- Thứ tự import trong `index.md` đã được chỉnh lại cho đúng dependency thực tế ở nhóm sale:
  - `Journey`
  - `ServiceRequest`
  - `SurveyAppointment`
  - `SurveyRecord`
  - `Quotation`
  - `QuotationLineItem`

## Blocker hiện hành

Xem chi tiết tại:

- `SEED-GAP-PHASE2-MCP-WRITE-BLOCKER-20260330.md`

Tóm tắt:

- `content-create_many` đang sinh bản ghi trắng;
- `content-update_by_ids` chưa patch được payload object;
- chưa có tool xóa content để dọn probe record.

## Hệ quả với kế hoạch import

- Chưa thể import an toàn cho nhóm schema `Multiple`.
- Chưa thể hoàn tất canonicalization `_id` thật về toàn bộ file seed.
- Chưa thể khép kín các quan hệ cần patch hậu import như `WarrantyCase.latest_visit_id`.

## Khuyến nghị bước tiếp theo

1. Team MCP/backend fix bind của `content-create`, `content-create_many`, `content-update_by_ids`.
2. Dọn các probe record trắng ở `AssetGroup`.
3. Chạy lại Phase 2 ngay sau khi fix, ưu tiên:
   - `CustomerJourneySetting` qua `content-save_setting`
   - nhóm master
   - nhóm sale
   - nhóm thi công
   - nhóm bảo hành, portal
   - nhóm tài chính
