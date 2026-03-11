# User Flows - HanhChinh v4

## 1. Phát hành hợp đồng

```mermaid
flowchart LR
    A["Sale chốt hợp đồng"] --> B["Hành Chính nhận yêu cầu phát hành"]
    B --> C["Chọn template version"]
    C --> D["Merge dữ liệu và preview"]
    D --> E["Gửi kiểm tra/Ký duyệt"]
    E --> F["Gửi khách"]
    F --> G["Nhận lại bản đã ký"]
    G --> H["Lưu hồ sơ số"]
```

## 2. Phát hành phiếu tạm ứng / đề nghị thanh toán

```mermaid
flowchart LR
    A["Accountant xác nhận dữ liệu tài chính"] --> B["Hành Chính chọn mẫu chứng từ"]
    B --> C["Merge dữ liệu"]
    C --> D["Ký duyệt nội bộ"]
    D --> E["Gửi khách"]
    E --> F["Lưu chứng từ vào dossier"]
```

## 3. Ký điện tử trên thiết bị touch

```mermaid
flowchart LR
    A["Mở signature session"] --> B["Hiển thị bản snapshot cần ký"]
    B --> C["Khách hoặc nhân viên ký touch"]
    C --> D["Ghi log người ký và thời điểm ký"]
    D --> E["Khóa tài liệu đã ký"]
    E --> F["Lưu file signed PDF"]
```

## 4. Gửi mail mẫu và CC nội bộ

```mermaid
flowchart LR
    A["Chọn loại hồ sơ"] --> B["Nạp mail template"]
    B --> C["Nạp danh sách CC mặc định"]
    C --> D["Kiểm tra file đính kèm"]
    D --> E["Gá»­i mail"]
    E --> F["Log vào dossier"]
```

## 5. Lưu hồ sơ số

```mermaid
flowchart LR
    A["Tài liệu phát hành hoặc đã ký"] --> B["Gắn vào khách/công trình/chứng từ"]
    B --> C["Xếp vào dossier"]
    C --> D["Đồng bộ Google Drive"]
    D --> E["Đánh dấu đã lưu hồ sơ"]
```

## 6. Hỗ trợ phát sinh và hồ sơ bổ sung

```mermaid
flowchart LR
    A["PM/Giám sát/Sale báo cần hồ sÆ¡ má»›i"] --> B["Hành Chính nhận handoff"]
    B --> C["Kiểm tra template và dữ liệu"]
    C --> D["Phát hành biên bản hoặc chứng từ bổ sung"]
    D --> E["Gửi khách và lưu dossier"]
```
