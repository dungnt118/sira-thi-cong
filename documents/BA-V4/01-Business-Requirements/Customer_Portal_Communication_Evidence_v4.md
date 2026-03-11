# Portal khách hàng: giao tiếp và bằng chứng trao đổi v4

## 1. Mục tiêu

Bổ sung `chat trên portal khách hàng` như một kênh giao tiếp chính thức có bằng chứng, thay vì chỉ dùng:

- gọi điện
- Zalo cá nhân
- tin nhắn rời
- email không gắn đúng ngữ cảnh công trình

Tài liệu này khóa lại nguyên tắc: mọi trao đổi quan trọng với khách hàng liên quan tới tiến độ, phát sinh, thanh toán, nghiệm thu, bảo hành phải có thể lưu vết trên portal.

## 2. Phạm vi giao tiếp trên portal

Portal phải hỗ trợ ít nhất 4 nhóm trao đổi:

1. `Tiến độ và minh chứng`
2. `Làm rõ hạng mục hoặc phát sinh`
3. `Nhắc mốc thanh toán/chứng từ liên quan`
4. `Bảo hành/bảo trì sau bàn giao`

## 3. Đối tượng dữ liệu bắt buộc

| Đối tượng | Mục đích |
|---|---|
| `Portal Thread` | chuỗi trao đổi theo ngữ cảnh cụ thể |
| `Portal Message` | từng tin nhắn trong thread |
| `Portal Attachment` | file, ảnh, video, biên bản số, link nội bộ đã kiểm soát |
| `Portal Read Receipt` | xác nhận khách hàng hoặc BAC đã xem |
| `Portal SLA Event` | cảnh báo tin nhắn chưa phản hồi |
| `Portal Publish Scope` | xác định dữ liệu nào được công bố cho khách |

## 4. Các loại thread bắt buộc

- `GENERAL_PROJECT`
- `TASK_OR_MILESTONE`
- `PAYMENT`
- `CHANGE_OR_ISSUE`
- `ACCEPTANCE`
- `WARRANTY_OR_MAINTENANCE`

## 5. Luồng nghiệp vụ chuẩn

1. `PM` hoặc `Sale` mở `Portal Thread` theo ngữ cảnh phù hợp.
2. Hệ thống chỉ cho phép đính kèm dữ liệu đã được publish hoặc file đã được kiểm duyệt.
3. Khách hàng gửi phản hồi ngay trên portal.
4. `Sale`, `PM`, `Giám sát`, `Kế toán` tham gia trả lời theo quyền.
5. Toàn bộ lịch sử trao đổi được lưu audit và dùng làm bằng chứng nghiệp vụ nếu có tranh chấp.

## 6. Nguyên tắc vận hành

### 6.1 Portal chat không thay thế hoàn toàn kênh ngoài

BAC vẫn có thể gọi điện hoặc nhắn Zalo, nhưng nếu nội dung ảnh hưởng đến:

- phạm vi công việc
- giá trị thanh toán
- timeline nghiệm thu
- điều kiện bảo hành

thì phải được tóm tắt hoặc xác nhận lại trên portal để lưu vết.

### 6.2 Chỉ publish dữ liệu đã duyệt

Khách hàng không được xem:

- file thô chưa duyệt
- link Google Drive raw
- tài liệu nội bộ
- estimate nội bộ
- comment nội bộ giữa các bộ phận BAC

## 7. Chức năng hệ thống bắt buộc

| ID | Chức năng |
|---|---|
| PRT-01 | Tạo thread theo `project`, `task`, `payment`, `warranty case` |
| PRT-02 | Gửi nhận tin nhắn 2 chiều trên portal |
| PRT-03 | Đính kèm ảnh/video/file đã được publish |
| PRT-04 | Xem `read receipt` và thời gian phản hồi |
| PRT-05 | Ghim thông báo hoặc kết luận chính thức |
| PRT-06 | Escalate thread chưa phản hồi đúng SLA |
| PRT-07 | Trích xuất lịch sử trao đổi thành bằng chứng dossier |
| PRT-08 | Tạo yêu cầu bảo hành/bảo trì từ thread của khách |

## 8. Business rules bắt buộc

1. Mọi `Portal Message` phải gắn với một `thread` có ngữ cảnh nghiệp vụ rõ ràng.
2. Attachment trên portal phải là file nằm trong `FILE_ASSET` của hệ thống BAC, không trỏ trực tiếp ra link ngoài không kiểm soát.
3. Thread `PAYMENT` chỉ cho phép hiển thị mốc thanh toán, chứng từ và trao đổi liên quan; không cho sửa số tiền bởi khách hàng.
4. Thread `CHANGE_OR_ISSUE` có thể trở thành đầu vào tạo:
   - incident
   - change order
   - aftersales case
5. Tin nhắn quan trọng được PM hoặc Sale đánh dấu `official response` phải được giữ trong dossier.
6. Hệ thống phải ghi được:
   - người gửi
   - vai trò
   - thời điểm
   - thiết bị hoặc kênh truy cập
   - ngữ cảnh công trình

## 9. Đầu ra bắt buộc

- timeline trao đổi với khách hàng theo công trình
- bằng chứng phản hồi/đã xem
- lịch sử file đã gửi cho khách
- dữ liệu đầu vào cho xử lý khiếu nại, thanh toán, bảo hành
