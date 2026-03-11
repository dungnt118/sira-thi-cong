# Chiến lược quản lý file và Google Drive v4

## 1. Mục tiêu

Tài liệu này chuẩn hóa cách BAC Group quản lý:

- ảnh khảo sát
- ảnh/video thi công
- hồ sơ báo giá/hợp đồng
- hồ sơ dossier khách hàng/công trình theo vòng đời
- biên bản nghiệm thu
- chứng từ tài chính
- tài liệu bảo hành/bảo trì

Mục tiêu là vừa lưu trữ được trên cloud bằng `Google Drive`, vừa không đánh mất kiểm soát nghiệp vụ trong hệ thống.

## 2. Quy tắc nền

1. `Google Drive` là nơi chứa file nhị phân, không phải nguồn sự thật nghiệp vụ.
2. Hệ thống BAC Group phải giữ metadata tập trung cho mọi file.
3. Không đưa raw link Google Drive trực tiếp ra portal khách hàng.
4. Mọi file phải gắn được với business context cụ thể.
5. Mọi lỗi đồng bộ phải có retry, cảnh báo và audit.

## 3. Phạm vi file phải quản lý

| Nhóm file | Context chính | Ví dụ |
|---|---|---|
| CRM survey | Customer, Service Request | Ảnh hiện trạng, đo độ ẩm, form khảo sát |
| Sales docs | Service Request, Quotation, Contract | Báo cáo tổng hợp, báo giá PDF, phụ lục, hợp đồng scan |
| Delivery docs | Project, Task, Checklist | Ảnh/video bằng chứng, nhật ký hiện trường |
| Inventory docs | Stock Document | Phiếu xuất/nhập, ký nhận vật tư |
| Finance docs | Payment Schedule, Transaction, Cost Entry | Phiếu thu/chi, hóa đơn, đề nghị thanh toán, sổ quỹ, đối soát |
| Aftersales docs | Warranty Case, Maintenance Visit | Ảnh bảo hành, biên bản bảo trì, phiếu tính phí |

## 4. Metadata tối thiểu bắt buộc

Mỗi file phải có các thuộc tính sau trong DB:

- `file_asset_id`
- `tenant_id`
- `context_type`
- `context_id`
- `file_name`
- `mime_type`
- `file_size`
- `checksum_sha256`
- `version_no`
- `sync_status`
- `drive_file_id`
- `drive_folder_id`
- `visibility_scope`
- `uploaded_by_user_id`
- `performed_by_worker_id` nếu là file hiện trường
- `approved_by_user_id` nếu file cần duyệt

## 5. Chuẩn cấu trúc thư mục Google Drive

Đề xuất chuẩn thư mục:

```text
BAC-GROUP/
└── {TENANT_CODE}/
    └── Dossiers/
        ├── ProspectActive/
        │   └── {CUSTOMER_CODE}_{SR_CODE}/
        │       ├── Survey/
        │       ├── Summary/
        │       ├── Quotation/
        │       └── Contract/
        ├── LostNoGo/
        │   └── {CUSTOMER_CODE}_{SR_CODE}/
        ├── ProjectInProgress/
        │   └── {PROJECT_CODE}/
        │       ├── CRM/
        │       ├── Execution/
        │       │   └── {TASK_CODE}/
        │       ├── Inventory/
        │       ├── Acceptance/
        │       ├── Finance/
        │       └── DeliveryNotes/
        ├── ProjectCompleted/
        │   └── {PROJECT_CODE}/
        │       ├── Contract/
        │       ├── Acceptance/
        │       ├── PaymentRequests/
        │       └── FinalDossier/
        └── AftersalesActive/
            └── {WARRANTY_CASE_CODE}/
                ├── Inspection/
                ├── MaintenanceReport/
                ├── CostSheet/
                └── Billing/
```

Quy tắc:

- tên thư mục phải theo `code`, không theo tên tự do
- hệ thống quản lý `drive_folder_id` qua bảng `DRIVE_FOLDER_MAP`
- không cho người dùng tự tạo cấu trúc folder ngoài chuẩn
- bucket vòng đời trên Drive phải tương ứng với `lifecycle bucket` trong hệ thống, không quản lý rời rạc

## 6. Luồng upload chuẩn

### 6.1 Upload từ CRM

1. Người dùng upload file tại màn hình khảo sát/báo giá/hợp đồng.
2. Hệ thống tạo `FILE_ASSET` với trạng thái `PENDING_SYNC`.
3. File vào hàng đợi `FILE_SYNC_JOB`.
4. Sau khi đẩy thành công lên Drive, cập nhật:
   - `SYNCED`
   - `drive_file_id`
   - `drive_folder_id`
   - checksum xác nhận

### 6.2 Upload từ hiện trường

1. `Supervisor` chụp/upload ảnh hoặc video.
2. Hệ thống lưu:
   - actor số là `Supervisor`
   - `worker profile` thực tế nếu có
   - `task/checklist` liên quan
3. File được sync nền lên Google Drive.
4. Chỉ file đã duyệt và sync thành công mới đủ điều kiện publish portal.

### 6.3 Upload từ back-office

Áp dụng cho:

- phiếu thu/chi
- biên bản nghiệm thu
- hồ sơ bảo hành/bảo trì

Luồng tương tự nhưng có thể thêm bước:

- kiểm tra định dạng
- gắn loại chứng từ
- khóa chỉnh sửa sau khi chốt

## 7. Trạng thái đồng bộ đề xuất

| Trạng thái | Ý nghĩa |
|---|---|
| `PENDING_SYNC` | Đã lưu metadata, chờ đồng bộ cloud |
| `SYNCING` | Đang đồng bộ |
| `SYNCED` | Đồng bộ thành công, metadata hợp lệ |
| `FAILED` | Đồng bộ lỗi, cần retry/cảnh báo |
| `ORPHANED` | File có metadata nhưng không truy vết được object cloud |
| `ARCHIVED` | File hết vòng đời hoạt động nhưng vẫn lưu trữ |

## 8. Quy tắc phân quyền

### 8.1 Trong nội bộ

- `Admin` cấu hình storage, retention, quyền hệ thống
- `PM` xem file CRM, project, nghiệm thu, tài chính trong phạm vi dự án
- `Supervisor` upload và xem file hiện trường thuộc phạm vi phụ trách
- `Accountant` xem chứng từ tài chính, nghiệm thu, bảo hành liên quan

### 8.2 Đối với khách hàng

Portal chỉ được xem file khi đồng thời thỏa:

- file đã `SYNCED`
- file đã được approve
- file được đánh dấu `portal_publishable`
- link portal/token còn hiệu lực

Không cấp quyền khách hàng trực tiếp lên Google Drive.

## 9. Versioning, retention và audit

### 9.1 Versioning

Áp dụng bắt buộc cho:

- báo giá
- hợp đồng/phụ lục
- báo cáo tổng hợp
- biên bản giao nhận
- biên bản nghiệm thu
- đề nghị tạm ứng
- đề nghị thanh toán
- tài liệu bảo hành/bảo trì

Quy tắc:

- version mới không ghi đè version cũ
- luôn có cờ `is_latest_version`
- portal chỉ nhìn bản đã được công bố

### 9.2 Retention

Đề xuất:

- file survey, execution: lưu tối thiểu theo vòng đời dự án + thời hạn bảo hành
- chứng từ tài chính: theo chính sách kế toán của doanh nghiệp
- hồ sơ bảo hành/bảo trì: theo vòng đời hậu mãi

### 9.3 Audit

Mọi thao tác sau phải vào audit log:

- upload
- replace version
- approve/reject
- sync fail/retry
- publish/revoke portal
- delete/archive

## 10. Xử lý lỗi và đồng bộ

Khi Google Drive lỗi, hệ thống phải:

1. giữ metadata local, không mất liên kết nghiệp vụ
2. đưa file vào retry queue theo backoff
3. cảnh báo Admin nếu vượt ngưỡng retry
4. chặn publish portal cho file chưa `SYNCED`
5. có màn đối soát file lỗi/orphaned

## 11. Đề xuất triển khai theo phase

### Phase 1

- chuẩn hóa `FILE_ASSET`, `DRIVE_FOLDER_MAP`, `FILE_SYNC_JOB`
- đồng bộ một chiều lên Google Drive
- chưa mở portal file động

### Phase 2

- duyệt file và publish portal có kiểm soát
- versioning cho tài liệu chính
- dashboard file lỗi

### Phase 3

- retention policy
- dedupe theo checksum
- đối soát dung lượng và chi phí lưu trữ

## 12. Kết luận

Giải pháp đúng cho BAC Group không phải là “lưu file lên Drive cho có”, mà là:

- hệ thống sở hữu metadata
- Google Drive sở hữu binary storage
- portal chỉ tiêu thụ file đã kiểm soát
- mọi file đều truy vết được theo nghiệp vụ, vai trò và vòng đời sử dụng
