# Quyết định triển khai chat Journey ngày 06-04-2026

Tài liệu này thay cho bản GAP cũ. Các điểm nghiệp vụ đã được chốt để frontend triển khai tiếp mà không cần giữ trạng thái chờ xác nhận.

## Quyết định 1: Dùng duy nhất cung `cb_*`

- Frontend không tách riêng chat nội bộ và chat Portal.
- Backend đã quản lý vai trò, quyền xem và phạm vi hiển thị theo từng thread.
- Frontend chỉ cần hiển thị đúng hierarchy, participant, message và hành vi theo dữ liệu `cb_*` trả về.

## Quyết định 2: Feature parity bám theo `chatboxv2`

- Phạm vi hành vi tham chiếu theo codebase `chatboxv2` mà user đã cung cấp.
- Các chức năng nâng cao được bật/tắt theo `SchemaDefinition.chatboxSetting`.
- Nếu schema chưa có field `chatboxSetting` ở frontend thì phải mở rộng type để đọc được cấu hình này.

## Quyết định 3: Mời thành viên theo `username`

- Chức năng mời user dùng `username`.
- Không suy diễn hay auto-map participant theo vai trò của Journey.
- Bài toán auto-invite theo role nằm ngoài scope đợt triển khai hiện tại.

## Quyết định 4: UI tại màn Journey

- Bỏ tab `Portal/Chat` hiện hành khỏi `JourneyDetail360`.
- Thay bằng nút toggle chat đặt cùng nhóm action button ở phần đầu màn hình.
- Nội dung chat hiển thị trong drawer riêng để không làm nặng khu vực tab nghiệp vụ chính.
