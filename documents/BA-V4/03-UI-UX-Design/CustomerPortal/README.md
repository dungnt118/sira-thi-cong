# Customer Portal - UI/UX Blueprint V4

## Mục tiêu vai trò

Customer Portal trong V4 không còn chỉ là màn hình xem tiến độ. Đây là package gồm:

- xem dữ liệu đã được publish
- xem chứng từ và minh chứng đã duyệt
- chat chính thức với BAC theo đúng ngữ cảnh nghiệp vụ
- gửi yêu cầu bảo hành/bảo trì

## Bộ tài liệu trong folder này

- `FDD_CustomerPortal_v4.md`: đặc tả chức năng chi tiết
- `Screen_Inventory_CustomerPortal_v4.md`: danh mục màn hình cần có
- `User_Flows_CustomerPortal_v4.md`: flow chính của khách hàng trên portal

## Nguyên tắc thiết kế

1. Portal chỉ hiển thị dữ liệu đã được `publish`.
2. Chat trên portal là bằng chứng giao tiếp, không phải tiện ích tùy chọn.
3. Không được lộ `Google Drive raw link` cho khách hàng.
4. Mọi trao đổi ảnh hưởng đến thanh toán, nghiệm thu, bảo hành phải truy xuất lại được trong dossier.
