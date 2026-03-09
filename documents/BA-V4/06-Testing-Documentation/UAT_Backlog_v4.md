# UAT Backlog v4

## 1. Mục tiêu

Thiết lập các kịch bản UAT tối thiểu để dự án không lặp lại tình trạng:

- có màn hình
- có demo flow
- nhưng không kiểm chứng được khả năng vận hành thật

## 2. Nhóm kịch bản UAT bắt buộc

| ID | Kịch bản | Vai trò chính | Kết quả mong đợi |
|---|---|---|---|
| UAT-01 | Tạo `Service Request` trước với khách mới, hệ thống tự tạo/gợi ý `Customer` | PM | Service Request lưu đúng pipeline/stage, customer không bị trùng |
| UAT-02 | Tạo `Customer` trước rồi tạo `Service Request` mới cho khách hiện hữu | PM | Request gắn đúng hồ sơ khách hàng hiện có |
| UAT-03 | Chuyển stage trong pipeline có playbook | PM/Admin | Nhiệm vụ con, checklist, SLA được sinh đúng |
| UAT-04 | Tạo 2 báo giá cho cùng một service request | PM | Lưu đúng version, chỉ một bản thắng |
| UAT-05 | Convert báo giá thắng sang hợp đồng và project | PM | Dự án sinh đủ dữ liệu nền, task nền được tạo đúng |
| UAT-06 | Tạo task dự án, giao Supervisor và worker profile | PM | Owner, due date, dependency, worker profile đúng |
| UAT-07 | Supervisor ký nhận vật tư trên hệ thống và phân bổ cho worker profile rồi mới mở task thi công | Supervisor/Accountant | Task bị khóa/mở đúng theo rule, lưu được người nhận thực tế |
| UAT-08 | Supervisor upload evidence thay worker profile | Supervisor | Evidence gắn đúng task/checklist, audit lưu actor số và worker profile |
| UAT-09 | Báo cáo sự cố trong khi task đang chạy | Supervisor/PM | Sự cố vào đúng luồng xử lý và escalation |
| UAT-10 | Nghiệm thu và đóng dự án | Supervisor/PM/Accountant | Sinh acceptance record, kích hoạt thanh toán cuối |
| UAT-11 | Kích hoạt bảo hành sau nghiệm thu | Accountant | Có warranty card hợp lệ, đúng ngày bắt đầu/kết thúc |
| UAT-12 | Tiếp nhận case bảo hành/bảo trì và phân loại coverage | Supervisor/Accountant/PM | Case được phân loại đúng: bảo hành, tính phí, hoặc change order |
| UAT-13 | Ghi nhận chi phí hậu mãi và tạo billing cho case ngoài bảo hành | Accountant | Có aftersales cost, billing và trạng thái thu tiền đúng |
| UAT-14 | Khách hàng xem portal | Customer Portal | Chỉ thấy dữ liệu đã công bố, không lộ raw file cloud link |
| UAT-15 | Admin tra audit log và file sync log | Admin | Truy được chuỗi hành động và trạng thái đồng bộ file |

## 3. Kịch bản edge case phải test

| ID | Tình huống | Kỳ vọng |
|---|---|---|
| EDGE-01 | Khách hàng cũ tạo service request mới | Không trùng customer, tạo request mới |
| EDGE-02 | Tạo service request trước nhưng hệ thống gợi ý trùng khách hàng | Người dùng có thể chọn gắn vào khách cũ hoặc tạo mới có kiểm soát |
| EDGE-03 | Chuyển pipeline khi request đang giữa chặng | Có map stage và lưu lịch sử |
| EDGE-04 | Quote bị từ chối, tạo quote mới | Lưu đủ lịch sử thương lượng |
| EDGE-05 | Đổi PM/Supervisor giữa chừng | Không mất lịch sử và task ownership |
| EDGE-06 | Thiếu vật tư ở giữa chừng | Task liên quan bị chặn đúng |
| EDGE-07 | Supervisor nhập sai worker profile khi cập nhật hiện trường | Có lịch sử chỉnh sửa và truy vết ai sửa |
| EDGE-08 | Đồng bộ Google Drive lỗi | File vào retry queue, chưa được publish portal |
| EDGE-09 | Thu tiền sai số so với kế hoạch hoặc billing hậu mãi | Có transaction, reason và audit |
| EDGE-10 | Case bảo hành sau khảo sát bị kết luận là ngoài phạm vi | Chuyển đúng sang maintenance tính phí hoặc change order |
| EDGE-11 | Thu hồi portal link | Link cũ không truy cập được nữa |
| EDGE-12 | Dự án bị hủy giữa chừng | Có hoàn kho/cancel flow/audit |

## 4. Tiêu chí pass UAT của giai đoạn pilot

Pilot chỉ được xem là đạt khi:

1. Toàn bộ `UAT-01` đến `UAT-13` pass
2. Ít nhất 9/12 edge case pass
3. Không có lỗi `Critical` làm sai dữ liệu
4. Có thể dựng báo cáo tháng từ dữ liệu thật của pilot
5. Có thể truy vết ít nhất một case hậu mãi từ tiếp nhận đến đóng tài chính

## 5. Kết quả đầu ra cần lưu sau UAT

- danh sách test case pass/fail
- issue log
- mức độ ảnh hưởng theo vai trò
- dữ liệu sample để tái hiện lỗi
- quyết định go/no-go
