# WF-ADD-11 – Quản lý Hành trình Khách hàng Động (Dynamic Kanban Pipeline)
**Đưa vào First Stage | Actor: Admin**

---

## Bối cảnh nghiệp vụ
Theo mặc định, hệ thống có 1 luồng Hành trình Khách hàng cứng (Đang KS → Đã báo giá → Đã ký HĐ → Từ chối) (đã định nghĩa ở WF-05).
Tuy nhiên, Khách hàng (SIRA) phát sinh nhu cầu: **Tùy biến Hành trình Khách hàng (Pipeline)** để phù hợp với từng mảng kinh doanh khác nhau (B2C, B2B, Dự án lớn) hoặc thay đổi quy trình sale theo thời gian.

**Yêu cầu cốt lõi:**
1. Admin có thể tạo nhiều "Pipeline Template" khác nhau.
2. Mỗi Pipeline có các "Cột Kanban" (Stages) với tên, màu sắc, thứ tự tùy ý.
3. Khi Admin đổi Pipeline mặc định hoặc gán Khách hàng sang Pipeline mới, **KHÔNG được làm mất** trạng thái lộ trình của Khách hàng cũ.

---

## Giải pháp Kiến trúc Phần mềm (Software Architecture)

Để giải bài toán "Chuyển đổi Pipeline không làm hỏng dữ liệu", hệ thống cần thiết kế Data Schema và Rule chuyển đổi như sau:

### 1. Data Schema Design
Khách hàng không trực tiếp lưu chuỗi string trạng thái (`status: 'Đã báo giá'`), mà lưu qua ID của Pipeline và Stage:

```typescript
// 1. Lõi Pipeline
type Pipeline = {
  id: string;
  name: string; // "Quy trình chuẩn SIRA", "Quy trình B2B"
  isActive: boolean;
  isDefault: boolean;
  stages: PipelineStage[];
}

// 2. Các bước trong Pipeline
type PipelineStage = {
  id: string;
  name: string; // "Khảo sát", "Báo giá"
  order: number;
  color: string;
  systemStage: 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST'; // Mapping cứng để code check logic
}

// 3. Khách hàng
type Customer = {
  // ... info
  pipelineId: string; // Thuộc hành trình nào
  stageId: string;    // Đang ở bước nào của hành trình đó
}
```

### 2. Nguyên tắc An toàn Dữ liệu (Safety Rules)
- **Rule 1 - Độc lập Hành trình:** Nếu có 2 Pipeline hoạt động song song, trên giao diện Kanban của PM, sẽ có **Dropdown chọn Pipeline** ở góc trên. Chọn Pipeline nào thì Kanban render các cột của Pipeline đó, và chỉ load Khách hàng thuộc Pipeline đó. -> Không bị lộn xộn.
- **Rule 2 - Thay đổi Pipeline của Khách hàng (Pipeline Migration):** Khi Admin muốn chuyển 1 Khách hàng từ `Pipeline A` sang `Pipeline B`, bắt buộc phải map trạng thái. Hệ thống sẽ bật 1 modal "Map Stage": *Khách hàng đang ở [Đã KS - Pipe A], bạn muốn thả vào cột nào của [Pipe B]?*
- **Rule 3 - Soft Delete Stage:** Admin KHÔNG ĐƯỢC XÓA cứng một Stage (cột) nếu cột đó đang có Khách hàng. Chỉ được "Ẩn" (Archive) hoặc hệ thống sẽ ép Admin gộp (Merge) tất cả KH ở cột sắp xóa sang một cột khác trước khi xóa.

---

## WF-ADD-11-A: Màn hình Quản lý Pipeline (Admin Settings)

```
┌────────────────────────────────────────────────────────────────────┐
| [⚙️ Cài đặt]               QUẢN LÝ HÀNH TRÌNH KHÁCH HÀNG           |
├────────────────────────────────────────────────────────────────────┤
| DANH SÁCH PIPELINE:                                                |
| [⭐ Quy trình bán lẻ chuẩn] (Mặc định)           [Mở bảng Kanban ↗]|
| [  Quy trình thầu B2B     ]                      [Mở bảng Kanban ↗]|
| [+ Tạo Pipeline mới]                                               |
|                                                                    |
| CẤU HÌNH PIPELINE: [Quy trình bán lẻ chuẩn]                        |
|                                                                    |
| Các bước (Kéo thả để sắp xếp):                                     |
| ☰ 1. Tiếp nhận Lead      (Mới)             [🔵]  [✏️] [❌ Xóa]     |
| ☰ 2. Đang khảo sát       (Đang xử lý)      [🟡]  [✏️] [❌ Xóa]     |
| ☰ 3. Đã Báo giá          (Đang xử lý)      [🟠]  [✏️] [❌ Xóa]     |
| ☰ 4. Đã ký Hợp đồng      (Thành công/WON)  [🟢]  [🔒 Cố định]      |
| ☰ 5. Hủy / Từ chối       (Thất bại/LOST)   [🔴]  [🔒 Cố định]      |
|                                                                    |
| [+ Thêm bước mới]                                                  |
|                                                                    |
| [💾 LƯU CẤU HÌNH]                                                  |
└────────────────────────────────────────────────────────────────────┘
```
*(Ghi chú: Bước WON và LOST thường được lock vì liên quan đến flow tạo Dự án Thi công ở WF-05)*

---

## WF-ADD-11-B: Modal Chuyển Pipeline (Khi đổi Pipeline cho 1 Khách hàng)

```
┌────────────────────────────────────────────────────────────────────┐
| CHUYỂN HÀNH TRÌNH KHÁCH HÀNG                                       |
|────────────────────────────────────────────────────────────────────|
| Khách hàng: Nguyễn Văn A (Đang ở: Quy trình bán lẻ chuẩn)          |
|                                                                    |
| Chuyển sang Pipeline: [ Quy trình thầu B2B ▼ ]                     |
|                                                                    |
| Chọn vị trí tương ứng ở Pipeline mới:                              |
| Trạng thái cũ:     [Đã Báo giá]                                    |
| Trạng thái mới:    [ Chờ duyệt thầu ▼ ]                            |
|                                                                    |
| [Hủy]                                        [✔️ Xác nhận chuyển]  |
└────────────────────────────────────────────────────────────────────┘
```

## Tác động vào WF-05 (Kanban chính của PM)
1. Thêm dropdown chọn Pipeline góc trên cùng.
2. Các cột sinh ra động dựa trên mảng `stages` của Pipeline đang được select.
3. Card khách hàng kéo thả làm thay đổi thuộc tính `customer.stageId` thay vì chuỗi cố định.
