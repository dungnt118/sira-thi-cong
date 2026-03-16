# Chuyên đề PM - Quản lý đội nội bộ và nhà thầu liên kết

## 1. Mục tiêu

Đây là phần được bổ sung riêng vì PM của V4 trước đó chưa làm đủ sâu. Tài liệu này khóa lại cách PM quản lý:

- đội nội bộ
- đội Giám sát
- kỹ thuật profile
- công ty đối tác/nhà thầu liên kết
- leader phụ trách của đối tác
- assignment vào project và task package

## 2. Phạm vi

### 2.1 Nội bộ

- PM
- Giám sát
- Kỹ thuật profile
- vai trò kỹ thuật/chuyên môn
- khả năng nhận việc / tải công việc

### 2.2 Đối tác liên kết

- partner company
- partner leader
- compliance documents
- performance score
- lịch sử dự án

## 3. Tình huống nghiệp vụ phải hỗ trợ

| Mã | Tình huống | Ý nghĩa |
|---|---|---|
| WF-PM-WP-01 | Dự án dùng hoàn toàn đội nội bộ | Luồng cơ bản |
| WF-PM-WP-02 | Dự án giao một package cho partner | Giao khoán từng phần |
| WF-PM-WP-03 | Dự án hybrid nội bộ + partner | Thực tế phổ biến khi scale |
| WF-PM-WP-04 | Thay Giám sát/leader giữa chừng | Tránh mất ownership |
| WF-PM-WP-05 | Block partner vì hiệu suất hoặc vi phạm | Quản trị rủi ro |

## 4. Đối tượng dữ liệu PM cần nhìn thấy

### 4.1 Đội nội bộ

- `Giám sát`
- `Kỹ thuật profile`
- phòng ban/nhóm kỹ thuật
- kỹ năng chính
- allocation %
- dự án đang tham gia
- lịch sử năng suất/sự cố

### 4.2 Đối tác liên kết

- `Partner Company`
- `Partner Leader`
- thông tin pháp lý
- người liên hệ
- rating
- active projects
- incident count
- hồ sơ hợp đồng/compliance

## 5. Màn hình bắt buộc

### 5.1 Nội bộ

- Internal Workforce List
- Capacity Board
- Kỹ thuật Profile Detail
- Assignment Modal
- Skill Matrix

### 5.2 Đối tác liên kết

- Partner Company List
- Partner Company Detail
- Partner Leader Directory
- Partner Assignment Wizard
- Partner Performance Dashboard

## 6. Flow nội bộ

### 6.1 Assign đội nội bộ vào project

1. PM mở `Project Workbench`
2. Vào `Workforce Management`
3. Chọn Giám sát chính
4. Chọn kỹ thuật profile hoặc tổ đội
5. Gán vào `task package`
6. Lưu allocation, ngày hiệu lực, ghi chú
7. Giám sát nhận assignment

### 6.2 Reassign khi quá tải hoặc thay đổi

1. PM xem `Capacity Board`
2. Phát hiện Giám sát/kỹ thuật profile quá tải
3. Chuyển một phần package sang người khác
4. Hệ thống giữ lịch sử trước/sau

## 7. Flow đối tác liên kết

### 7.1 Onboard đối tác

1. PM hoặc Admin tạo hồ sơ `Partner Company`
2. Gắn leader phụ trách
3. Upload hồ sơ compliance
4. Đánh dấu trạng thái `ACTIVE` khi đủ điều kiện

### 7.2 Assign đối tác vào package

1. PM mở `Partner Assignment Wizard`
2. Chọn company `ACTIVE`
3. Chọn leader phụ trách
4. Chọn package, deadline, deliverables
5. Cấu hình handoff rule vá»›i Giám sát/PM
6. Lưu assignment

### 7.3 Đánh giá sau dự án

1. PM mở `Partner Performance Dashboard`
2. Chấm tiến độ, chất lượng, phối hợp, an toàn
3. Hệ thống cập nhật rating
4. Nếu rating thấp hoặc vi phạm, company có thể bị `BLOCKED`

## 8. Business rules bắt buộc

1. Một `task package` phải có `execution owner` rõ:
   - nội bộ
   - partner
   - hoặc hybrid có primary owner
2. Partner `BLOCKED` không được gán mới.
3. Kỹ thuật profile vẫn phải được quản lý kể cả khi không có account.
4. Giám sát là actor số hiện trường trong cả luồng nội bộ và partner.
5. PM phải nhìn được ai đang chịu trách nhiệm ở 3 cấp:
   - project
   - package/task
   - hiện trường thực tế
6. Assignment phải lưu được:
   - người giao
   - người nhận
   - thời gian hiệu lực
   - phạm vi việc
   - ghi chú/handoff

## 9. KPI PM cần theo dõi

- utilization cá»§a Giám sát và workforce nội bộ
- tỷ lệ overload
- số package đang giao cho partner
- on-time rate theo partner
- reject rate evidence theo partner
- incident rate theo partner
- chi phí nhân lực nội bộ vs outsource

## 10. Kết luận

PM của V4 sẽ tiếp tục bị "hở" nếu thiếu trục `Workforce & Partners`. Tài liệu này khóa lại rõ rằng:

- quản lý đội nội bộ là scope bắt buộc
- nhà thầu liên kết là scope phải được thiết kế sẵn
- rollout có thể phase theo internal-first, nhưng tài liệu V4 không được phép bỏ trống phần này
