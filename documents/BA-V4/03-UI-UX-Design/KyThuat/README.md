# UI/UX Blueprint - Kỹ thuật

## Vai trò trong phase hiện tại

Folder này được giữ lại để quản lý blueprint theo vai trò, nhưng cần chốt rõ:

- `Kỹ thuật` hiện là `kỹ thuật profile`, chưa có tài khoản đăng nhập trực tiếp
- mọi thao tác số hiện tại Ä'i qua giao diện `Giám sát`

Do đó, tài liệu này có 2 mục tiêu:

1. mô tả dữ liệu/ngữ cảnh cần lưu cho kỹ thuật profile ngay từ bây giờ
2. giữ blueprint cho phase sau nếu BAC Group mở tài khoản trực tiếp cho Kỹ thuật

## Nhu cầu dữ liệu hiện tại

Dù chưa có account, hệ thống vẫn phải lưu được cho từng kỹ thuật profile:

- danh tính cơ bản
- tổ/đội tham gia
- task tham gia
- vật tư đã nhận
- bằng chứng công việc đã thực hiện
- sự cố liên quan

## Blueprint phase sau

Nếu mở app riêng cho Kỹ thuật ở giai đoạn sau, các màn hình mục tiêu sẽ là:

- Việc của tôi
- Chi tiết task
- Checklist task
- Upload ảnh/video
- Xác nhận nhận vật tư
- Báo cáo sự cố
- Lịch sử việc đã làm

## Quy ước cho phase hiện tại

- Không xem màn `Kỹ thuật` hiện có trong prototype là release scope độc lập
- Các màn kỹ thuật hiện tại phải được quy hoạch lại thành:
  - dữ liệu kỹ thuật profile
  - hành động proxy trong màn Giám sát

## Gap còn thiếu trong hiện trạng

- Chưa có kỹ thuật profile master rõ ràng
- Chưa có mapping giữa task, vật tư, evidence và kỹ thuật profile
- Prototype đang thể hiện Kỹ thuật như một user app độc lập, chưa đúng baseline BA-V4
