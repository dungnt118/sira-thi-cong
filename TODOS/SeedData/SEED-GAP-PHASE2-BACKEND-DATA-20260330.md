# GAP Phase 2 - Backend Data / Validation còn lại

## 1. `PortalDocument` chưa chấp nhận seed không có file thật

### Hiện trạng

- Seed `PortalDocument` đã được chuẩn bị theo rule không đính kèm file thật.
- Metadata schema đã được chỉnh:
  - `PortalDocument.files.required = false`
- Tuy nhiên backend vẫn từ chối lưu khi:
  - gửi `files = null`
  - gửi `files = []`
  - bỏ hẳn field `files`

### Bằng chứng

- Runtime trả lỗi: `Tập tin không được để trống`
- Điều này cho thấy còn một lớp validation ẩn nằm ngoài metadata schema.

### Đánh giá

- Đây không còn là GAP của seed file.
- Đây là GAP giữa:
  - rule nghiệp vụ đã chốt: tài liệu portal có thể seed trước, chưa cần file thật
  - hành vi runtime hiện tại: bắt buộc phải có file upload thật

### Đề xuất xử lý

1. Ưu tiên: backend bỏ validation bắt buộc file thật khi `files.required = false`.
2. Nếu muốn giữ validation hiện tại, cần đổi rule nghiệp vụ:
   - không seed `PortalDocument` ở Phase 2
   - chỉ tạo sau khi có upload thật
3. Không nên fake file metadata để vượt validation, vì sẽ làm sai dữ liệu nghiệp vụ.

## 2. `CustomerJourneySetting` đang là singleton bẩn từ batch probe cũ

### Hiện trạng

- Hệ thống hiện có sẵn 1 bản ghi `CustomerJourneySetting`.
- Bản ghi này không phải seed chuẩn:
  - các field root như `setting_key`, `setting_name`, `is_active`, `version_label`, `note` đang `null`
  - nested field đang chứa giá trị probe dạng `EVIDENCE_*`

### Đánh giá

- Đây là dữ liệu singleton lõi, không nên tạo chồng thêm một bản ghi mới khi chưa làm rõ chiến lược cleanup.
- Nếu tiếp tục dùng generic create/update không kiểm soát, rất dễ tạo trùng cấu hình chuẩn của hành trình.

### Đề xuất xử lý

1. Dùng flow setting chuyên biệt để overwrite bản ghi singleton chuẩn từ file:
   - `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260329.json`
2. Nếu chưa có flow overwrite an toàn, cần cleanup bản ghi probe cũ trước rồi mới seed lại.
3. Không nên tạo thêm một bản ghi `CustomerJourneySetting` mới bằng generic create khi bản ghi probe cũ vẫn tồn tại.

## Kết luận

- Phase 2 cho nhóm schema `Multiple` đã chạy thực tế và phần lớn đã hoàn tất.
- Hai GAP còn lại hiện là GAP backend-data / validation thật sự:
  - `PortalDocument`
  - `CustomerJourneySetting`
- Các batch khác có thể xem là đã seed thành công trên tenant BAC.
