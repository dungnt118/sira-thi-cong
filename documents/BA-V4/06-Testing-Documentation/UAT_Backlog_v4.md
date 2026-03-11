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
| UAT-04 | Tạo `Estimate Version` từ dữ liệu khảo sát, bảng giá nội bộ và vận chuyển | PM/Accountant | Hệ thống tính được giá vốn và lưu đúng version nội bộ |
| UAT-05 | Map nhiều dòng dự toán nội bộ thành một dòng báo giá khách hàng | PM/Sale | Lưu đúng `quotation mapping`, không lộ dữ liệu nội bộ |
| UAT-06 | Cảnh báo `Go/No-Go` khi thiếu vật tư, thiếu nhân công hoặc deadline không khả thi | PM/Accountant/Giám sát | Cảnh báo hiện đúng, không cho phát hành báo giá khi chưa xử lý |
| UAT-07 | Tạo 2 báo giá cho cùng một service request | PM/Sale | Lưu đúng version, chỉ một bản thắng |
| UAT-08 | Convert báo giá thắng sang hợp đồng và project | PM | Dự án sinh đủ dữ liệu nền, task nền được tạo đúng |
| UAT-09 | Tạo task dự án, giao Giám sát và worker profile | PM | Owner, due date, dependency, worker profile đúng |
| UAT-10 | Giám sát ký nhận vật tư trên hệ thống và phân bổ cho worker profile rồi mới mở task thi công | Giám sát/Accountant | Task bị khóa/mở đúng theo rule, lưu được người nhận thực tế |
| UAT-11 | Xuất 1 thùng 10L cho dự toán 9.5L và hoàn nhập 0.5L phần dư | Giám sát/Accountant | Tạo được `remainder lot`, phản ánh đúng tồn và cost ledger |
| UAT-12 | Thu hồi tài sản thi công sau khi kết thúc hạng mục | Giám sát/Accountant | Tài sản chuyển đúng trạng thái, có log cấp phát và thu hồi |
| UAT-13 | Giám sát upload evidence thay worker profile | Giám sát | Evidence gắn đúng task/checklist, audit lưu actor số và worker profile |
| UAT-14 | Báo cáo sự cố trong khi task đang chạy | Giám sát/PM | Sự cố vào đúng luồng xử lý và escalation |
| UAT-15 | Nghiệm thu và đóng dự án | Giám sát/PM/Accountant | Sinh acceptance record, kích hoạt thanh toán cuối |
| UAT-16 | Kích hoạt bảo hành sau nghiệm thu | Accountant | Có warranty card hợp lệ, đúng ngày bắt đầu/kết thúc |
| UAT-17 | Tiếp nhận case bảo hành/bảo trì và phân loại coverage | Giám sát/Accountant/PM | Case được phân loại đúng: bảo hành, tính phí, hoặc change order |
| UAT-18 | Ghi nhận chi phí hậu mãi và tạo billing cho case ngoài bảo hành | Accountant | Có aftersales cost, billing và trạng thái thu tiền đúng |
| UAT-19 | Khách hàng xem portal và chỉ thấy dữ liệu đã publish | Customer Portal | Không lộ raw file cloud link, token và quyền truy cập đúng |
| UAT-20 | Khách hàng tạo thread chat trên portal về mốc thanh toán hoặc bảo hành | Customer Portal/Sale/PM | Lưu đúng thread, read receipt, attachment và audit |
| UAT-21 | Admin tra audit log, file sync log và lịch sử portal communication | Admin | Truy được đầy đủ log nghiệp vụ và log đồng bộ |

## 3. Kịch bản edge case phải test

| ID | Tình huống | Kỳ vọng |
|---|---|---|
| EDGE-01 | Khách hàng cũ tạo service request mới | Không trùng customer, tạo request mới |
| EDGE-02 | Tạo service request trước nhưng hệ thống gợi ý trùng khách hàng | Người dùng có thể chọn gắn vào khách cũ hoặc tạo mới có kiểm soát |
| EDGE-03 | Chuyển pipeline khi request đang giữa chặng | Có map stage và lưu lịch sử |
| EDGE-04 | Quote bị từ chối, tạo quote mới | Lưu đủ lịch sử thương lượng |
| EDGE-05 | Đổi PM/Giám sát giữa chừng | Không mất lịch sá»­ và task ownership |
| EDGE-06 | Thiếu vật tư ở giữa chừng | Task liên quan bị chặn đúng |
| EDGE-06A | Giá nhân công thay đổi mạnh sau khi đã lập dự toán | Hệ thống yêu cầu review lại `Go/No-Go` hoặc estimate |
| EDGE-07 | Giám sát nhập sai worker profile khi cập nhật hiện trường | Có lịch sá»­ chỉnh sá»­a và truy vết ai sá»­a |
| EDGE-08 | Đồng bộ Google Drive lỗi | File vào retry queue, chưa được publish portal |
| EDGE-08A | Vật tư bán tiêu hao còn phần dư nhưng hoàn nhập không đạt chất lượng | Phần dư không cộng lại vào tồn khả dụng và có log kiểm tra |
| EDGE-09 | Thu tiền sai số so với kế hoạch hoặc billing hậu mãi | Có transaction, reason và audit |
| EDGE-10 | Case bảo hành sau khảo sát bị kết luận là ngoài phạm vi | Chuyển đúng sang maintenance tính phí hoặc change order |
| EDGE-11 | Thu hồi portal link | Link cũ không truy cập được nữa |
| EDGE-11A | Khách hàng gửi message trên portal kèm file không được publish | Hệ thống chặn hoặc đưa vào kiểm duyệt đúng rule |
| EDGE-12 | Dự án bị hủy giữa chừng | Có hoàn kho/cancel flow/audit |

## 4. Tiêu chí pass UAT của giai đoạn pilot

Pilot chỉ được xem là đạt khi:

1. Toàn bộ `UAT-01` đến `UAT-21` pass
2. Ít nhất 11/15 edge case pass
3. Không có lỗi `Critical` làm sai dữ liệu
4. Có thể dựng báo cáo tháng từ dữ liệu thật của pilot
5. Có thể truy vết ít nhất một case hậu mãi từ tiếp nhận đến đóng tài chính

## 5. Kết quả đầu ra cần lưu sau UAT

- danh sách test case pass/fail
- issue log
- mức độ ảnh hưởng theo vai trò
- dữ liệu sample để tái hiện lỗi
- quyết định go/no-go
