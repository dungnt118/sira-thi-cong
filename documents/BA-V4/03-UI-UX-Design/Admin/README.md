# UI/UX Blueprint - Admin

## Mục tiêu vai trò

Admin là người cấu hình và kiểm soát toàn bộ hệ thống:

- người dùng và phân quyền
- pipeline và playbook
- checklist/template/master data
- audit
- notification
- báo cáo quản trị

## Màn hình bắt buộc

- Dashboard điều hành
- User/Role/Permission
- Pipeline Settings
- Stage Playbook Settings
- Checklist Template Settings
- Material Standard Settings
- Notification Settings
- Audit Log
- Report Center

## Flow chính

1. Tạo hoặc sửa pipeline
2. Gắn playbook nhiệm vụ cho từng stage
3. Publish template checklist/định mức chuẩn
4. Theo dõi audit và report quản trị
5. Can thiệp override trong các trường hợp đặc biệt

## Gap còn thiếu trong hiện trạng

- Chưa có control plane admin thống nhất
- Chưa có màn cấu hình `Stage Playbook`
- `admin-app` và `admin-v2` đang bị trùng vai
- Audit log mới là màn hình demo, chưa là ledger thật

