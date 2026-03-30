# GAP Chuẩn Hóa Catalog Dùng Chung Cho Field Phân Loại - 2026-03-30

## 1. Bối cảnh
Trong quá trình rà soát và chuẩn hóa metadata trước Phase 2 seeding, hệ thống vẫn còn một nhóm field có cùng vai trò nghiệp vụ nhưng chưa có một catalog chuẩn dùng chung ở backend.

Các field tiêu biểu:
- `QuotationMappingRule.service_type`
- `ChecklistTemplate.category`
- `MaterialStandard.construction_type`

Ngoài ra, seed và codebase prototype cũ còn đang dùng các biến thể gần nghĩa như:
- mã snake_case: `chong_tham_san_mai`, `xu_ly_tham_tuong`
- nhãn tiếng Việt: `Chống thấm sân mái`, `Chống thấm sân mái bê tông`, `Bàn giao công trình`

## 2. Hiện trạng đã kiểm tra

### 2.1 Backend schema
- `QuotationMappingRule.service_type` đang là `Text + Input`
- `ChecklistTemplate.category` đang là `Text + Input`
- `MaterialStandard.construction_type` đang là `Text + Input`

### 2.2 Seed hiện tại
- `QuotationMappingRule.service_type` dùng mã snake_case.
- `ChecklistTemplate.category` dùng nhãn tiếng Việt có dấu.
- `MaterialStandard.construction_type` dùng nhãn tiếng Việt có dấu chi tiết hơn.

### 2.3 Codebase và tài liệu
- `src/pages/pm/Journeys/TemplateList.tsx` đang dùng `service_type` như một trường chọn.
- `src/pages/pm/Construction/TemplateChecklist.tsx` đang dùng `category` như một trường chọn.
- `documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Developer_Execution_Spec.md` mô tả `service_type` là field dạng `select` hoặc `multi-select`.
- `documents/BA-V3/Wireframes/WF-15_16_17_INV_DanhMuc_DinhMuc.md` mô tả `construction_type` là field chọn loại hình thi công để tính định mức.

### 2.4 Kiểm tra catalog dùng chung
Đã kiểm tra `MasterDataCategory` và `MasterDataItem` cho các mã:
- `service_type`
- `construction_type`

Kết quả:
- chưa có category nào được seed hoặc cấu hình làm nguồn sự thật dùng chung.

## 3. Mô tả GAP
Hiện chưa có quyết định nghiệp vụ cuối cùng cho câu hỏi sau:

`service_type`, `category` và `construction_type` là:
- cùng một catalog, chỉ khác tên hiển thị theo ngữ cảnh,
- hay là 2 tầng dữ liệu khác nhau:
  - `service_type` = nhóm dịch vụ cấp cao,
  - `construction_type` = loại hình thi công hoặc bối cảnh kỹ thuật chi tiết hơn.

Nếu chưa chốt điểm này mà ép sửa nóng:
- đổi `editor` sang `Dropdown` sẽ phải tự đoán tập giá trị,
- đổi `propType` sang reference/catalog sẽ làm lệch seed hiện tại,
- nguy cơ phát sinh sai khác giữa module sale, template checklist, định mức vật tư và mapping báo giá.

## 4. Ảnh hưởng nếu xử lý sai
- Filter và grouping ở sale/preconstruction có thể không khớp với định mức vật tư.
- Một `service_type` có thể map sai sang nhiều `construction_type`, hoặc ngược lại.
- Seed Phase 2 phải sửa lại hàng loạt vì cùng một trường nhưng mỗi schema hiểu khác nhau.
- Về lâu dài sẽ rất khó chuẩn hóa báo cáo và rule engine nếu không có source of truth.

## 5. Phương án xử lý

### Phương án A - Dùng một catalog chuẩn duy nhất
- Tạo `MasterDataCategory.code = service_type`
- Mọi schema liên quan cùng dùng chung một tập giá trị
- Ưu điểm:
  - đơn giản
  - dễ seed
  - dễ filter
- Nhược điểm:
  - có thể không đủ chi tiết cho bài toán định mức kỹ thuật

### Phương án B - Tách 2 catalog
- `service_type` = nhóm dịch vụ cấp cao
- `construction_type` = loại hình thi công hoặc ngữ cảnh kỹ thuật chi tiết
- Cho phép khai báo mapping từ `construction_type` sang `service_type`
- Ưu điểm:
  - đúng hơn với thực tế preconstruction và inventory
  - dễ mở rộng về sau
- Nhược điểm:
  - cần thêm quyết định mapping
  - seeding phức tạp hơn một bước

### Phương án C - Giữ Text tự do tạm thời
- Chưa dựng catalog
- Chỉ chuẩn hóa label và seed conventions
- Ưu điểm:
  - triển khai nhanh
  - không đụng logic hiện tại
- Nhược điểm:
  - tiếp tục để lại nợ chuẩn hóa
  - khó kiểm soát dữ liệu nhập mới

## 6. Khuyến nghị
Khuyến nghị chọn **Phương án B**.

Lý do:
- `QuotationMappingRule.service_type` đang gần với tầng điều phối preconstruction.
- `ChecklistTemplate.category` và `MaterialStandard.construction_type` đang gần với tầng thực thi kỹ thuật.
- Hai tầng này có liên quan chặt, nhưng chưa chắc là cùng một danh mục.

Đề xuất chốt nghiệp vụ:
1. Tạo catalog chuẩn cho `service_type`.
2. Tạo catalog chuẩn cho `construction_type`.
3. Chốt bảng mapping giữa 2 catalog.
4. Sau đó mới quay lại sửa `editor/valueOptions` hoặc `propType` của các field liên quan.

## 7. Quyết định tạm thời đã áp dụng
- Không ép đổi `propType` cho các field nêu trên trong wave này.
- Không ép đổi `editor` sang dropdown khi chưa có catalog chuẩn.
- Chỉ chuẩn hóa các phần an toàn:
  - label tiếng Việt có dấu
  - hints tiếng Việt có dấu
  - enum đã có canonical source rõ ràng

## 8. Thông tin cần user xác nhận
- `service_type` và `construction_type` là một hay hai catalog khác nhau?
- Nếu là hai catalog:
  - catalog nào là nguồn sự thật chính,
  - và mapping được quản trị ở schema nào?

## 9. Quyết định đã chốt ngày 2026-03-30
Theo xác nhận của user:

- `service_type` và `construction_type` là hai catalog độc lập.
- Các field tiêu biểu phải chuyển sang `ObjectId` và tham chiếu `MasterDataItem`.
- Giá trị kỹ thuật phải chuẩn hóa theo tiếng Anh lowercase snake_case.
- `MasterDataCategory` chỉ đóng vai trò header catalog; dữ liệu nghiệp vụ phải link tới `MasterDataItem`.

## 10. Quy tắc áp dụng sau khi chốt

### 10.1 Kiến trúc lưu trữ
- `MasterDataCategory.code = service_type`
- `MasterDataCategory.code = construction_type`
- Các field business tham chiếu trực tiếp `MasterDataItem`:
  - `QuotationMappingRule.service_type`
  - `ChecklistTemplate.category`
  - `MaterialStandard.construction_type`
  - `WarrantyCard.construction_type`

### 10.2 Canonical value đã chọn
- `service_type`
  - `waterproofing`
  - `seepage_treatment`
  - `epoxy_floor`
- `construction_type`
  - `rooftop_waterproofing`
  - `wall_seepage_treatment`
  - `epoxy_floor_coating`

### 10.3 Cách biểu diễn mapping
- Không tạo schema mapping mới trong wave này.
- Mapping được lưu trong `MasterDataItem.metadataJson` để giữ hai catalog độc lập nhưng vẫn có quan hệ định hướng:
  - `service_type.metadataJson.defaultConstructionTypes`
  - `construction_type.metadataJson.serviceType`

### 10.4 Chuẩn hóa residue legacy
- Giá trị cũ `mkt` được thay bằng `marketing`.
- Giá trị cũ `ontime` được thay bằng `on_time`.
- Mẫu `Checklist nghiệm thu bàn giao` không còn nằm trong `ChecklistTemplate`, vì `ChecklistTemplate` là thư viện checklist thi công.
- Nghiệp vụ bàn giao tiếp tục nằm ở `HandoverAcceptance`.
- `WarrantyCard.construction_type` phải phản ánh loại thi công thực tế của dự án, không dùng loại công trình chung kiểu `Nhà ở dân dụng`.
