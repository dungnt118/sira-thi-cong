# GAP: chưa có API lưu ảnh avatar cho Hồ sơ cá nhân

## Bối cảnh
- Yêu cầu cần hợp nhất trang Hồ sơ cá nhân dùng chung cho mọi vai trò.
- Trong phạm vi tính năng bổ sung, người dùng muốn có chế độ cập nhật hồ sơ, bao gồm đổi họ tên và ảnh avatar.

## Phát hiện
- Frontend hiện đã có contract rõ ràng cho:
  - `change_password(old_pw, new_pw)`
  - `update_global_user(userId, fullName, email, phoneNumber)`
- Trong codebase hiện tại không có mutation/service nào để lưu `avatarId` hoặc cập nhật avatar cho hồ sơ cá nhân.
- `AuthorizedUser` có field `avatarId` để đọc/hiển thị, nhưng chưa có API cập nhật tương ứng được khai báo ở frontend.

## Ảnh hưởng
- Có thể triển khai an toàn các phần:
  - đổi mật khẩu
  - mở Trung tâm trợ giúp
  - cập nhật các thông tin text mà backend đã hỗ trợ
- Không thể triển khai hoàn chỉnh luồng đổi avatar theo đúng nghiệp vụ vì thiếu contract backend để lưu dữ liệu.

## Cách xử lý tạm thời trong đợt này
- Đã triển khai trang Hồ sơ cá nhân dùng chung cho các route `/{role}/profile`.
- Đã bật chế độ cập nhật hồ sơ cho các field backend hỗ trợ.
- Tạm thời giữ avatar ở chế độ chỉ xem để tránh tạo ra trải nghiệm “đổi được trên UI nhưng không lưu thật”.

## Đề xuất phương án
1. Mở rộng mutation `update_global_user` để nhận thêm `avatarId`.
2. Hoặc bổ sung mutation riêng, ví dụ `update_my_profile(fullName, phoneNumber, avatarId)`.
3. Sau khi backend chốt contract, frontend chỉ cần nối thêm phần chọn/upload ảnh và gửi `avatarId` tương ứng.
