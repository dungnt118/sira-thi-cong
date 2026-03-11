# Operating Guide - PM V4

## 1. Mục tiêu

Hướng dẫn này mô tả cách PM vận hành hệ thống theo các kịch bản chính, không đi theo cấu trúc menu rời rạc.

## 2. Chu kỳ làm việc hằng ngày của PM

### Đầu ngày

1. Mở `PM Dashboard`
2. Kiểm tra:
   - service request cần follow-up
   - project overdue / blocked
   - evidence chờ review
   - milestone sắp đến hạn
   - case bảo hành/bảo trì đang mở
3. Ưu tiên việc theo severity và due date

### Trong ngày

1. Cập nhật CRM và các request nóng
2. Convert request thắng sang project khi đủ điều kiện
3. Điều phối Giám sát, workforce nội bộ hoặc partner
4. Review evidence / incident / bottleneck
5. Theo dõi vật tư, nhân lực, tài chính ở mức điều hành

### Cuối ngày

1. Kiểm tra project nào còn blocked
2. Kiểm tra evidence bị reject chưa được xử lý lại
3. Kiểm tra các mốc thanh toán hoặc nghiệm thu ngày hôm sau

## 3. Kịch bản 1 - Tạo Service Request

### Khi dùng

- khách mới gọi đến
- khách cũ phát sinh nhu cầu mới

### Cách làm

1. Mở `Service Request Create`
2. Nếu đã có customer, chọn customer hiện hữu
3. Nếu chưa có, nhập thông tin request trước
4. Kiểm tra gợi ý trùng
5. Lưu request với pipeline/stage phù hợp

### Lưu ý

- không tạo customer trùng chỉ vì nhập nhanh
- request phải có owner và expected next step

## 4. Kịch bản 2 - Khảo sát, báo giá, hợp đồng

1. Mở `Survey Workspace`
2. Upload ảnh/file khảo sát và nhập đo đạc
3. Tạo báo giá version đầu tiên
4. Nếu chỉnh nhiều lần, luôn tạo version mới
5. Khi khách chốt, đánh dấu bản thắng và tạo contract

### Lưu ý

- không sửa đè báo giá cũ làm mất history
- mọi file khảo sát phải đúng request và đúng customer

## 5. Kịch bản 3 - Convert sang project

1. Từ contract hoặc request thắng, mở `Convert to Project Wizard`
2. Kiểm tra đủ dữ liệu
3. Chọn template task/playbook
4. Chọn PM/Giám sát phụ trách
5. Kiểm tra payment plan
6. Xác nhận tạo project

### Lưu ý

- không tạo project khi contract hoặc dữ liệu khảo sát còn thiếu
- project mới phải có task nền, không để trống

## 6. Kịch bản 4 - Điều phối đội nội bộ và partner

### Nội bộ

1. Mở `Workforce Management`
2. Chọn Giám sát và worker profile phù hợp
3. Kiểm tra capacity trước khi assign
4. Gán vào task package

### Partner/outsource

1. Mở `Partner Assignment Wizard`
2. Chỉ chọn company đang `ACTIVE`
3. Chọn leader phụ trách
4. Giao rõ phạm vi việc và mốc bàn giao

### Lưu ý

- luôn nhìn rõ ai là owner thật của package
- nếu partner có vấn đề, cập nhật performance và xem xét block

## 7. Kịch bản 5 - Review evidence và xử lý ngoại lệ

1. Mở `Evidence Queue`
2. Lọc theo project/task/status
3. Approve nếu đạt
4. Reject nếu chưa đạt và luôn nhập lý do
5. Kiểm tra incident/blocked reason liên quan

### Lưu ý

- đừng chỉ nhìn ảnh đẹp hay xấu; phải nhìn đúng task, đúng thời điểm, đúng context
- evidence chưa approved không được xem là đủ cho close-out

## 8. Kịch bản 6 - Theo dõi tài chính, nghiệm thu, portal

1. Mở `Finance Snapshot`
2. Kiểm tra paid/outstanding và milestone sắp tới
3. Phối hợp với Kế toán khi có nợ quá hạn
4. Kiểm tra acceptance readiness
5. Chỉ publish portal khi dữ liệu đã approved và file đã sync

### Lưu ý

- PM không confirm thu tiền
- PM chịu trách nhiệm follow-up vận hành và customer communication

## 9. Kịch bản 7 - Theo dõi hậu mãi

1. Xem open warranty/maintenance cases
2. Kiểm tra case nào ảnh hưởng khách hàng lớn hoặc chi phí cao
3. Phối hợp Giám sát và Kế toán để xá»­ lý
4. Theo dõi xem case thuộc:
   - bảo hành
   - bảo trì tính phí
   - change order

## 10. Những điều PM phải tránh

- dùng `Customer` thay cho `Service Request` để theo dõi pipeline
- giao việc mà không qua task package/assignment rõ ràng
- bỏ trống quản lý partner chỉ vì phase đầu rollout ưu tiên internal
- publish dữ liệu khách hàng khi file chưa approved hoặc chưa sync
- tự xác nhận nghiệp vụ kế toán vượt quyền

## 11. Kết luận

PM trong V4 phải vận hành hệ thống theo một chuỗi thống nhất. Nếu một công việc vẫn phải xử lý ngoài hệ thống mà không có chỗ phản ánh trong các flow trên, đó là tín hiệu cần mở rộng tiếp backlog PM.
