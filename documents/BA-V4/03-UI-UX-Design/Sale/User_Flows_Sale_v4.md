# User Flows - Sale v4

## 1. Intake và phản hồi lead

```mermaid
flowchart LR
    A["Lead từ MKT hoặc nguồn trực tiếp"] --> B["Tạo Service Request"]
    B --> C{"Khách đã tồn tại?"}
    C -->|Có| D["Liên kết Customer cũ"]
    C -->|Không| E["Auto-create Customer mới"]
    D --> F["Đưa vào SLA Queue"]
    E --> F
    F --> G["Sale gọi và tư vấn sơ bộ"]
    G --> H{"Kết quả"}
    H -->|Hẹn khảo sát| I["Tạo lịch khảo sát"]
    H -->|Chưa sẵn sàng| J["Đưa vào follow-up"]
    H -->|Từ chối| K["Đóng lý do thất bại"]
```

## 2. Khảo sát đến gửi giải pháp

```mermaid
flowchart LR
    A["Sale hẹn khảo sát"] --> B["Kỹ thuật/Giám sát khảo sát"]
    B --> C["Nhập phiếu khảo sát, ảnh, video, số đo"]
    C --> D["Tạo báo cáo tổng hợp công trình"]
    D --> E["Sale gửi process làm việc + giải pháp"]
    E --> F["Khách phản hồi / yêu cầu chỉnh sửa"]
```

## 3. Báo giá và chốt thắng/thua

```mermaid
flowchart LR
    A["Nhận số liệu kỹ thuật"] --> B["Tạo quotation version"]
    B --> C["Preview theo template"]
    C --> D["Gửi khách"]
    D --> E{"Kết quả"}
    E -->|Đàm phán tiếp| F["Tạo version mới"]
    E -->|Thắng| G["Chuyển sang hợp đồng"]
    E -->|Thua| H["Ghi lý do thất bại"]
```

## 4. Hợp đồng và ký điện tử

```mermaid
flowchart LR
    A["Sale chốt điều khoản"] --> B["Chọn mẫu hợp đồng"]
    B --> C["Merge dữ liệu"]
    C --> D["Hành Chính/Accountant kiểm tra"]
    D --> E["Giám đốc ký"]
    E --> F["Gửi khách ký touch hoặc nhận lại bản ký"]
    F --> G["Lưu hồ sơ số"]
    G --> H["Convert sang Project"]
```

## 5. Tạm ứng và thanh toán

```mermaid
flowchart LR
    A["Kế toán/Hành Chính phát hành chứng từ"] --> B["Sale nhận thông báo cần follow"]
    B --> C["Nhắc khách"]
    C --> D{"Khách thanh toán?"}
    D -->|Có| E["Kế toán xác nhận thu"]
    D -->|Chưa| F["Ghi lý do + ngày hẹn lại"]
    F --> B
```

## 6. Phối hợp phát sinh hiện trường

```mermaid
flowchart LR
    A["PM/Giám sát báo phát sinh"] --> B["Sale nắm ảnh hưởng tá»›i khách"]
    B --> C["Thống nhất cách trao đổi"]
    C --> D["Cập nhật khách hàng"]
    D --> E["Ghi biên bản hoặc note follow-up"]
```

## 7. Chăm sóc sau công trình và upsell

```mermaid
flowchart LR
    A["Công trình hoàn thành"] --> B["Lên lịch chăm sóc"]
    B --> C["Gọi hỏi trải nghiệm / nhu cầu mới"]
    C --> D{"Có cơ hội mới?"}
    D -->|Có| E["Tạo Service Request mới"]
    D -->|Không| F["Ghi nhận chăm sóc định kỳ"]
```
