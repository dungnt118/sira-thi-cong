# GAP triển khai trao đổi nhóm cho Journey

## Bối cảnh

Đợt này đã triển khai component dùng chung cho trao đổi nhóm dựa trên API `cb_*` và gắn vào tab `Portal/Chat` của màn `JourneyDetail360`.

## GAP 1: Ngữ nghĩa giữa chat nội bộ và chat Portal chưa được chốt

- Hiện tab `GRP_06_CONTRACT` đang đồng thời mang ý nghĩa KPI Portal (`portal_publish_status`, `unread_thread_count`) và nhu cầu trao đổi nhóm nội bộ.
- Backend `cb_*` là chatbox generic theo `schemaName/contentId`, còn dữ liệu Portal hiện tại trong repo vẫn đang đi theo hướng `PortalThread` / `PortalMessage`.
- Vì chưa có quyết định nghiệp vụ chính thức, đợt này chỉ đặt component trao đổi nhóm nội bộ cùng khu vực KPI Portal, chưa hợp nhất hai luồng thành một mô hình duy nhất.

### Đánh giá

- Nếu gộp vội hai luồng ngay bây giờ, rất dễ làm sai vai trò người tham gia, sai chỉ số chưa đọc, hoặc lệch phạm vi hiển thị giữa nội bộ và khách hàng.
- Giữ song song ở mức UI là an toàn hơn để user trải nghiệm sớm mà chưa khóa cứng mô hình dữ liệu.

### Phương án đề xuất

1. Chốt rõ `cb_*` sẽ là nguồn dữ liệu duy nhất cho cả nội bộ và khách hàng.
2. Hoặc giữ tách biệt: `cb_*` cho nội bộ, `PortalThread/PortalMessage` cho khách hàng, sau đó tách tab/khối hiển thị rõ ràng.
3. Hoặc dùng `cb_*` cho nội bộ trước, Portal vẫn giữ riêng, và đổi tên tab hiện tại để tránh hiểu nhầm nghiệp vụ.

## GAP 2: Chưa chốt phạm vi feature parity với `chatboxv2`

- Code tham chiếu `chatboxv2` có các khả năng nâng cao như `attachment workflow`, `schedule`, `linked content`, `filter bar`, `thread info drawer`, `xóa message`, `message render chuyên biệt`.
- Đợt này chỉ triển khai các luồng chắc chắn và dùng được ngay:
  - tải hierarchy
  - chuyển thread
  - xem timeline
  - gửi `message` / `note`
  - tạo sub-thread
  - mời thêm thành viên

### Đánh giá

- Các phần nâng cao chưa có yêu cầu nghiệp vụ cụ thể trên Journey, nên nếu kéo sang toàn bộ sẽ làm tăng mạnh chi phí maintain và rủi ro lệch UX với repo hiện tại.
- Riêng `attachment`, `schedule` và `linked content` có thể triển khai tiếp ở pha sau vì backend đã có nền tảng, nhưng cần user xác nhận ưu tiên.

### Phương án đề xuất

1. Pha 2 ưu tiên `attachment + preview file`.
2. Pha 3 bổ sung `schedule / linked content / thread info`.
3. Pha 4 chuẩn hóa renderer theo từng loại message để tiến gần `chatboxv2`.

## GAP 3: Chưa có rule nghiệp vụ mời thành viên theo vai trò Journey

- API hiện hỗ trợ mời người dùng theo `username`, nhưng chưa có rule chính thức rằng ai được auto-join theo `sale_users`, `supervisor_users`, `technical_users`, `pm_user`.
- Đợt này chỉ hỗ trợ mời thủ công bằng picker `AuthorizedUserSelect`.

### Đánh giá

- Nếu tự động gán thành viên khi chưa chốt rule, rất dễ mời sai người hoặc lộ luồng thảo luận không đúng phạm vi.

### Phương án đề xuất

1. Xác nhận mapping vai trò Journey sang participant chatbox.
2. Chốt thời điểm auto-invite: khi tạo Journey, khi chuyển step, hay khi tạo sub-thread.
3. Sau đó mới bổ sung auto-sync participant theo role.
