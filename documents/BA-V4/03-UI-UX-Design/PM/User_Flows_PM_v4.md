# User Flows - PM V4

## 1. Mục tiêu

Các flow dưới đây mô tả các hành trình PM bắt buộc phải làm được trong V4. Flow được viết theo mô hình mới:

- `Service Request-first`
- `Giám sát thao tác thay kỹ thuật profile`
- `Module B - Vận hành nội bộ`
- có cả `đội nội bộ` và `partner/outsource`

## 2. Flow 1 - Tạo Service Request linh hoạt

**Goal**: PM tạo lead mới mà không bị ép trình tự nhập liệu.

```mermaid
flowchart TD
  A["PM mở Service Request Create"] --> B{"Đã có Customer chưa?"}
  B -->|Có| C["Chọn Customer hiện hữu"]
  B -->|Chưa| D["Nhập thông tin Service Request trước"]
  D --> E["Hệ thống gợi ý trùng theo phone/email/address"]
  E --> F{"Chọn khách cũ hay tạo mới?"}
  F -->|Khách cũ| C
  F -->|Tạo mới| G["Sinh Customer mới trong cùng transaction"]
  C --> H["Gắn Pipeline và Stage"]
  G --> H
  H --> I["Lưu Service Request"]
  I --> J["PM tiếp tục Survey / Quotation"]
```

**Điểm kiểm soát**

- không tạo rác customer
- request phải có pipeline/stage ngay từ đầu
- activity log phải ghi rõ cách customer được gắn vào request

## 3. Flow 2 - Survey -> Quotation -> Contract

**Goal**: PM chốt đầu vào thương mại mà không mất dữ liệu khảo sát.

```mermaid
flowchart TD
  A["Service Request Detail"] --> B["PM mở Survey Workspace"]
  B --> C["Upload ảnh/file, nhập đo đạc"]
  C --> D["Tạo báo giá version 1"]
  D --> E{"Khách cần chỉnh?"}
  E -->|Có| F["Tạo version mới, lưu history"]
  F --> E
  E -->|Không| G["Đánh dấu bản thắng"]
  G --> H["Tạo Contract"]
  H --> I["Thiết lập milestone thanh toán"]
  I --> J["Sẵn sàng Convert to Project"]
```

## 4. Flow 3 - Convert sang Project và seed vận hành nội bộ

**Goal**: Khi deal thắng, PM tạo được project đầy đủ dữ liệu nền.

```mermaid
flowchart TD
  A["Contract Detail"] --> B["PM mở Convert to Project Wizard"]
  B --> C["Kiểm tra dữ liệu bắt buộc"]
  C --> D["Chọn template task/playbook"]
  D --> E["Chọn PM/Giám sát phụ trách"]
  E --> F["Thiết lập task package, timeline, payment plan"]
  F --> G["Hệ thống sinh Project + Task nền + Assignment"]
  G --> H["PM vào Project Workbench"]
```

## 5. Flow 4 - Quản lý đội nội bộ và phân công workforce

**Goal**: PM phân bổ nguồn lực nội bộ đúng tải và đúng kỹ năng.

```mermaid
flowchart TD
  A["Project Workbench"] --> B["PM mở Workforce Management"]
  B --> C["Xem capacity cá»§a Giám sát và kỹ thuật profile"]
  C --> D["Chọn Giám sát chính"]
  D --> E["Chọn kỹ thuật profile / tổ đội hỗ trợ"]
  E --> F["Gán vào task package"]
  F --> G["Hệ thống ghi assignment + thời gian hiệu lực"]
  G --> H["Giám sát nhận được phân công"]
```

## 6. Flow 5 - Gán nhà thầu liên kết/outsource

**Goal**: PM đưa đối tác liên kết vào dự án mà vẫn kiểm soát được chất lượng và trách nhiệm.

```mermaid
flowchart TD
  A["Project Workbench"] --> B["PM mở Partner Assignment Wizard"]
  B --> C["Chọn Partner Company đang ACTIVE"]
  C --> D["Kiểm tra leader và compliance documents"]
  D --> E["Chọn package hoặc khu vực giao khoán"]
  E --> F["Thiết lập leader, phạm vi việc, deadline, handoff rule"]
  F --> G["Tạo Partner Assignment"]
  G --> H["Theo dõi performance và incident theo partner"]
```

## 7. Flow 6 - Lập kế hoạch vật tư và nhân lực

**Goal**: PM khóa được planning trước khi thi công.

```mermaid
flowchart TD
  A["Project Workbench"] --> B["PM vào Material Planning"]
  B --> C["Lập planned quantity theo task/package"]
  C --> D["PM vào Labor Planning"]
  D --> E["Lập vai trò nội bộ/outsource theo ngày công"]
  E --> F["Tạo request-out hoặc purchase request khi cần"]
  F --> G["Hệ thống đánh dấu task nào đang chờ vật tư"]
  G --> H["PM theo dõi variance trong quá trình chạy"]
```

## 8. Flow 7 - Review evidence và xử lý ngoại lệ

**Goal**: PM giám sát từ xa thông qua evidence, incident và blocked reason.

```mermaid
flowchart TD
  A["PM mở Evidence Queue"] --> B["Lọc theo project/task/status"]
  B --> C["Xem evidence chi tiết"]
  C --> D{"Đạt yêu cầu?"}
  D -->|Có| E["Approve evidence"]
  D -->|Không| F["Reject với lý do"]
  E --> G["Checklist/task cập nhật trạng thái"]
  F --> H["Giám sát nhận feedback để cập nhật lại"]
  G --> I["PM kiểm tra incident/blocked reason nếu có"]
  H --> I
```

## 9. Flow 8 - Theo dõi tài chính -> nghiệm thu -> portal -> warranty

**Goal**: PM đóng được vòng đời dự án và theo dõi hậu mãi.

```mermaid
flowchart TD
  A["PM mở Finance Snapshot"] --> B["Xem milestone và outstanding"]
  B --> C["Theo dõi điều kiện nghiệm thu"]
  C --> D["PM phối hợp tạo Acceptance Record"]
  D --> E["Dự án đủ điều kiện publish portal"]
  E --> F["PM công bố dữ liệu portal được phép xem"]
  F --> G["Warranty Card được kích hoạt"]
  G --> H["PM theo dõi open warranty/maintenance cases"]
```

## 10. Kết luận

8 flow trên là tối thiểu để PM trong V4 vận hành được thực tế. Nếu một màn hình hoặc backlog dev không map được vào một trong các flow này, cần xem lại vì rất có thể đang xây lệch scope PM.
