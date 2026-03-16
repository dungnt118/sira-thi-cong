# User Flows - Kỹ Thuật (Technical) v4

## 1. Giới thiệu
Tài liệu định nghĩa các luồng thao tác (User Flows) chính yếu của người dùng có role **Kỹ thuật** thông qua hệ thống BAC Group.

## 2. User Flow: Luồng Khảo sát hiện trường (Site Survey Flow)
Đây là quy trình nền tảng nhất, chuyển đổi data từ thực địa thành cơ sở thiết kế giải pháp.

```mermaid
sequenceDiagram
    participant Sale as Sale
    participant Hệ thống as Hệ thống
    participant KT as Kỹ thuật (App)
    participant Khách as Khách hàng

    Sale->>Hệ thống: Tạo Lịch khảo sát & Assign Kỹ thuật
    Hệ thống-->>KT: Push Notification: Lịch khảo sát mới
    KT->>Hệ thống: Xem chi tiết (địa chỉ, SĐT, thông tin sơ bộ)
    KT->>Hệ thống: Bấm "Bắt đầu di chuyển"
    Note over KT, Khách: Đến hiện trường
    KT->>Hệ thống: Bấm "Check-in tại hiện trường"
    KT->>Hệ thống: Mở Form "Phiếu Khảo Sát"
    KT->>Hệ thống: Điền text hiện trạng, ghi chú kỹ thuật
    KT->>Hệ thống: Chụp ảnh/Video trực tiếp gắn vào form
    KT->>Khách: "Anh/Chị kiểm tra lại thông tin và xác nhận giúp em"
    Khách->>KT: Ký chữ ký điện tử trực tiếp trên màn hình Mobile
    KT->>Hệ thống: Bấm Tải lên / Hoàn thành Khảo sát
    Hệ thống-->>Sale: Thông báo: Khảo sát hoàn tất, chờ Phương án
```

## 3. User Flow: Luồng Cung cấp Phương án kỹ thuật (Solution Consultation)
Xảy ra ngay sau khi có phiếu khảo sát.

```mermaid
flowchart TD
    A[Hoàn tất Phiếu Khảo Sát] --> B[Mở Workspace Tư Vấn Giải Pháp]
    B --> C{Loại công trình phức tạp?}
    C -->|Đơn giản| D[Chọn Package giải pháp có sẵn định tuyến]
    C -->|Phức tạp| E[Thêm mới biện pháp thi công manual]
    D --> F[Nhập ước lượng Khối lượng thi công / Vật tư]
    E --> F
    F --> G[Submit Phương án thô về Sale]
    G --> H[Sale lên Báo giá cho khách]
```

## 4. User Flow: Luồng Báo cáo Thi công hàng ngày (Daily Execution Log)
Quy trình giúp PM và Giám sát kiểm soát công trường không cần có mặt.

```mermaid
flowchart TD
    A[Đến ngày thi công] --> B[Mở App, Chọn Dự án]
    B --> C[Mở Nhật ký ngày]
    C --> D[Thêm ảnh trước thi công]
    D --> E[Làm việc...]
    E --> F[Thêm ảnh đang thi công]
    F --> G[Làm việc...]
    G --> H[Thêm ảnh sau thi công / Hoàn thiện khu vực]
    H --> I[Ghi chú hao hụt vật tư hoặc tình huống phát sinh]
    I --> J[Submit Nhật ký cho Giám sát duyệt]
```

## 5. User Flow: Luồng Bảo trì định kỳ (Periodic Maintenance)
Quy trình sau bán hàng (After-sales) đảm bảo chất lượng.

```mermaid
sequenceDiagram
    participant CRM as Hệ thống (Auto)
    participant KT as Kỹ thuật (App)
    participant Khách as Khách hàng

    CRM->>KT: Assign Ticket Bảo trì (Đến hạn 6 tháng)
    KT->>Khách: Gọi điện chốt giờ đến kiểm tra
    KT->>CRM: Cập nhật giờ hẹn thực tế
    Note over KT, Khách: Đến công trình
    KT->>CRM: Mở Phiếu Bảo Trì
    KT->>CRM: Chụp ảnh hiện trạng khu vực đã chống thấm
    KT->>CRM: Tick các hạng mục Pass/Fail
    alt Lỗi nhỏ xử lý được ngay
        KT->>CRM: Ghi chú "Đã khắc phục lỗi nhỏ"
    else Lỗi phức tạp
        KT->>CRM: Tick "Cần xử lý bảo hành" 
    end
    KT->>Khách: Yêu cầu ký xác nhận biên bản kiểm tra bảo trì
    KT->>CRM: Submit Hoàn thành
```
