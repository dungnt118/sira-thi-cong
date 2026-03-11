# UI/UX Blueprint - Sale

## Mục tiêu vai trò

`Sale` là owner của chuỗi trước dự án và sau bàn giao về mặt quan hệ khách hàng:

- tiếp nhận lead và service request
- phản hồi theo SLA
- tư vấn sơ bộ và điều phối khảo sát
- gửi giải pháp, báo giá, theo hợp đồng
- đốc thúc tạm ứng và thanh toán
- phối hợp xá»­ lý phát sinh vá»›i PM/Giám sát
- chăm sóc sau công trình và bán thêm

## Bộ tài liệu trong folder này

- `FDD_Sale_v4.md`: đặc tả chức năng chi tiết cho Sale
- `Screen_Inventory_Sale_v4.md`: danh mục màn hình và trạng thái prototype
- `User_Flows_Sale_v4.md`: luồng chính của Sale từ lead đến after-sales

## Nguyên tắc thiết kế

1. `Service Request` là bản ghi làm việc trung tâm của Sale.
2. Sale có thể bắt đầu từ `Customer` hoặc tạo `Service Request` trước rồi auto-create khách hàng.
3. Flow của Sale phải xuyên suốt tới hợp đồng, tạm ứng, thanh toán và chăm sóc sau công trình.
4. Sale không thay `PM`, nhưng phải nhìn được các mốc delivery cần cho giao tiếp với khách.
5. `Quản lý mẫu tài liệu` và `Chữ ký điện tử` là capability bắt buộc của workspace Sale.
