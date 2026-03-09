# UI/UX Blueprint - Supervisor

## Mục tiêu vai trò

Supervisor là actor số chính cho hiện trường ở giai đoạn hiện tại. Vai trò này chịu trách nhiệm:

- điều phối tổ đội và worker profile
- cập nhật tiến độ hiện trường
- thao tác checklist/evidence/sự cố trên phần mềm
- ký nhận vật tư trên hệ thống và phát cho worker profile
- hỗ trợ nghiệm thu, bảo hành, bảo trì

## Màn hình bắt buộc

- Danh sách dự án phụ trách
- Task board hiện trường
- Chi tiết task và worker profile tham gia
- Checklist theo task
- Upload/review evidence tại hiện trường
- Ký nhận và phát vật tư cho worker profile
- Incident center
- Acceptance draft form
- Warranty/Maintenance visit form
- Trạng thái đồng bộ file lên Google Drive

## Flow chính

1. Nhận task từ PM
2. Phân công worker profile cho từng gói việc
3. Ký nhận vật tư trên hệ thống và ghi nhận phát vật tư thực tế
4. Cập nhật checklist, bằng chứng, sự cố thay mặt worker profile
5. Gửi chờ review/nghiệm thu
6. Thực hiện visit bảo hành/bảo trì khi phát sinh

## Điểm UI/UX cần làm rõ

- Phải thể hiện rõ `Supervisor đang thao tác thay ai`
- Mỗi evidence cần nhìn được cả:
  - actor số
  - worker profile thực hiện
- Cần có widget cảnh báo:
  - thiếu vật tư
  - thiếu bằng chứng
  - sync file lỗi
  - case hậu mãi chờ xử lý

## Gap còn thiếu trong hiện trạng

- Code đang lẫn giữa `Supervisor` và `Worker`
- Chưa có task board riêng cho Supervisor
- Chưa có quản lý worker profile trong luồng hiện trường
- Chưa có màn theo dõi sync file/Google Drive
- Chưa có acceptance và maintenance workflow thật
