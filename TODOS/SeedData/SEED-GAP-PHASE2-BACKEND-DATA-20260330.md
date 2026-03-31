# GAP Phase 2 - Metadata và dữ liệu live còn lại

## 1. `PortalDocument` còn lệch giữa schema runtime và schema descriptor

### Hiện trạng

- `schema_get("PortalDocument")` cho thấy schema runtime hiện tại không còn field `file_name`.
- `content_describe_schema("PortalDocument")` vẫn trả về:
  - `keyField = file_name`
- Runtime create hiện đã hoạt động đúng với payload chỉ dùng các field:
  - `journey_id`
  - `journey_step_code`
  - `journey_code`
  - `context_type`
  - `published_context`
  - `file_type`
  - `files`
  - `thumbnail_url`
  - `published_at`
  - `sort_order`
  - `is_visible`

### Đánh giá

- Đây không còn là blocker import.
- Đây là GAP metadata backend: lớp mô tả schema dùng cho tool `content_describe_schema` chưa đồng bộ với schema runtime thực tế.
- Nếu tiếp tục dựa mù vào descriptor cũ, các batch seed hoặc automation sau này rất dễ suy luận sai `keyField`.

### Đề xuất xử lý

1. Đồng bộ lại metadata descriptor của `PortalDocument` để bỏ `keyField = file_name`.
2. Trong lúc chưa fix backend, dùng `schema_get` làm nguồn sự thật duy nhất khi seed hoặc generate payload cho `PortalDocument`.

## 2. Còn dữ liệu legacy ngoài batch seed chuẩn

### Hiện trạng

- `MasterDataCategory` hiện còn 1 bản ghi legacy:
  - `code = crm`
  - `_id = 69c7f0daa718dc692a22b79c`
- Kiểm tra `MasterDataItem` cho thấy chưa có item nào đang tham chiếu category này.
- `ServiceRequest` hiện còn 2 bản ghi live ngoài batch seed chuẩn:
  - `YC-20260330-003`
  - `sanmai`

### Đánh giá

- Đây không phải dữ liệu do batch seed chuẩn hiện tại tạo ra.
- Các bản ghi này không chặn Phase 2, nhưng khiến tenant không còn ở trạng thái “chỉ gồm dữ liệu seed chuẩn”.
- Chưa xóa nóng trong wave này vì cần xác nhận chúng có còn bị form/view/workflow nào tham chiếu hay không.

### Đề xuất xử lý

1. Tạo wave cleanup dữ liệu live riêng cho các bản ghi legacy ngoài batch seed.
2. Ưu tiên rà usage trước khi xóa hoặc archive các bản ghi:
   - `MasterDataCategory.code = crm`
   - `ServiceRequest.code = YC-20260330-003`
   - `ServiceRequest.code = sanmai`

## Kết luận

- Phase 2 import seed đã hoàn tất theo phạm vi business seed chuẩn.
- Các điểm còn lại hiện chỉ là:
  - metadata descriptor chưa đồng bộ của `PortalDocument`
  - dữ liệu legacy tồn dư ngoài batch seed
- Không còn blocker nghiệp vụ cho việc tiếp tục dùng bộ seed chuẩn làm mốc tenant BAC.

