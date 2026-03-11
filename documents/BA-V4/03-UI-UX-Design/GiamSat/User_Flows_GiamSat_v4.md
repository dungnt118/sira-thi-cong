# User Flows Giám sát v4

## 1. Mục tiêu

Các flow dưới đây mô tả chuỗi thao tác điển hình của `Giám sát` theo bộ chứng từ và dossier thực tế trong `Original requirement`.

## 2. Flow 1 - Nhận công trình và chuẩn bị hiện trường

### Mục tiêu

Đảm bảo Giám sát nhận đúng công trình, hiểu đúng phạm vi và biết những gì phải làm trước khi ra hiện trường.

### Luồng chính

1. PM giao công trình hoặc visit cho Giám sát.
2. Giám sát mở `Trang chủ hiện trường` để xem:
   - loại việc: khảo sát, thi công, nghiệm thu, bảo trì
   - lịch hẹn
   - yêu cầu đặc biệt
   - hồ sơ liên quan đã có
3. Giám sát mở `Tóm tắt công trình`.
4. Hệ thống hiển thị:
   - khách hàng
   - địa chỉ
   - trạng thái công trình
   - hạng mục dự kiến
   - hồ sơ cũ nếu là case hậu mãi
5. Giám sát xác nhận bắt đầu visit.

### Đầu ra

- visit được ghi nhận trạng thái `đang thực hiện`
- Giám sát có bộ context ban đầu trước khi thao tác tại công trình

### Rule

- nếu là case bảo hành/bảo trì thì phải hiển thị lịch sử nghiệm thu và điều khoản liên quan
- nếu hồ sơ công trình chưa đủ thông tin cơ bản thì không cho bắt đầu visit mà không có cảnh báo

## 3. Flow 2 - Khảo sát hiện trạng và lập biên bản khảo sát

### Mục tiêu

Chuẩn hóa việc ghi nhận hiện trạng ban đầu thành `biên bản khảo sát` và `media khảo sát`.

### Luồng chính

1. Giám sát chọn `Biên bản khảo sát công trình`.
2. Hệ thống tải thông tin khách hàng/công trình có sẵn.
3. Giám sát ghi:
   - khu vực khảo sát
   - hiện trạng từng khu vực
   - hạng mục thi công dự kiến
   - số đo hoặc ghi chú kỹ thuật
4. Giám sát chụp ảnh/video theo từng khu vực.
5. Hệ thống gắn timestamp, actor và context khu vực cho từng file.
6. Giám sát preview biên bản khảo sát.
7. Khách hàng và Giám sát ký trực tiếp trên thiết bị touch.
8. Hệ thống tạo biên bản khảo sát số và đồng bộ vào dossier.

### Đầu ra

- biên bản khảo sát số
- bộ ảnh/video khảo sát
- log thời gian và người thực hiện

### Rule

- biên bản khảo sát phải tạo được từ dữ liệu có cấu trúc, không phụ thuộc file Word thủ công
- ảnh khảo sát phải gắn được tới khu vực/hạng mục liên quan
- nếu chưa có chữ ký thì trạng thái là `chờ hoàn tất`, chưa được xem là hồ sơ chính thức

## 4. Flow 3 - Lập báo cáo hiện trạng và đề xuất biện pháp

### Mục tiêu

Tạo ra báo cáo tổng hợp phục vụ PM, Sale hoặc khách hàng ra quyết định.

### Luồng chính

1. Sau khảo sát, Giám sát mở `Báo cáo hiện trạng & đề xuất biện pháp`.
2. Hệ thống gợi ý media và dữ liệu khảo sát vừa nhập.
3. Giám sát viết theo 3 phần:
   - hiện trạng thực tế
   - nhận định/nguyên nhân
   - đề xuất biện pháp xử lý
4. Gắn ảnh minh chứng cho từng phần nếu cần.
5. Preview báo cáo.
6. Gửi PM review hoặc xuất dùng cho báo giá/triển khai.

### Đầu ra

- báo cáo tổng hợp hiện trạng theo chuẩn BAC
- version report có lịch sử chỉnh sửa

### Rule

- cùng một công trình có thể có nhiều report theo từng lần khảo sát hoặc visit
- report phải giữ lịch sử version, không ghi đè mất dữ liệu cũ

## 5. Flow 4 - Thi công và cập nhật checklist thay worker profile

### Mục tiêu

Quản lý bước thi công, bằng chứng và trạng thái công việc trong bối cảnh worker chưa có tài khoản.

### Luồng chính

1. Giám sát mở `Danh sách gói việc/task`.
2. Chọn gói việc hoặc công trình đang thi công.
3. Hệ thống hiển thị checklist bước thi công.
4. Giám sát chọn `worker profile` tham gia từng bước hoặc ca làm.
5. Trong quá trình thực hiện, Giám sát:
   - cập nhật trạng thái bước
   - ghi chú điều kiện thực tế
   - chụp/tải ảnh/video minh chứng
   - gửi bước chờ review
6. Hệ thống ghi:
   - Giám sát thao tác
   - worker profile thực hiện
   - thời điểm
   - file minh chứng
7. PM review từ xa nếu cần.

### Đầu ra

- checklist có trạng thái rõ ràng
- evidence đủ ngữ cảnh
- lịch sử ai làm gì tại công trình

### Rule

- không cho hoàn tất bước nếu thiếu số lượng ảnh tối thiểu
- không cho bắt đầu bước mở mới nếu đang bị khóa do thiếu vật tư hoặc có blocking issue
- ảnh/video gửi lên phải hiện trạng thái đồng bộ cloud và trạng thái chờ duyệt

## 6. Flow 5 - Nhận vật tư và cấp phát tại công trình

### Mục tiêu

Ràng buộc vật tư với công trình và hoạt động thi công thực tế.

### Luồng chính

1. Giám sát nhận thông báo có phiếu vật tư giao đến công trình.
2. Mở `Ký nhận vật tư`.
3. Hệ thống hiển thị:
   - danh sách vật tư
   - số lượng theo phiếu
   - người giao
   - thời gian giao dự kiến
4. Giám sát kiểm đếm, chụp ảnh nếu cần.
5. Xác nhận:
   - nhận đủ
   - nhận thiếu
   - từ chối nhận
6. Nếu nhận đủ hoặc đủ điều kiện nhận, Giám sát ký trên màn hình touch.
7. Khi cấp phát cho hạng mục hoặc nhóm thi công, Giám sát ghi log cấp phát.
8. Nếu thiếu/hỏng/mất, hệ thống mở case sự cố liên quan vật tư.

### Đầu ra

- phiếu ký nhận vật tư số
- log cấp phát tại công trình
- case ngoại lệ nếu có

### Rule

- ký nhận vật tư là điều kiện khóa/mở cho một số bước thi công
- vật tư nhận thiếu phải có lý do và ảnh minh chứng nếu cần

## 7. Flow 6 - Tạo biên bản nghiệm thu số

### Mục tiêu

Hoàn tất hồ sơ nghiệm thu tại công trình với dữ liệu, minh chứng và chữ ký điện tử.

### Luồng chính

1. Giám sát mở `Chuẩn bị nghiệm thu`.
2. Hệ thống kiểm tra điều kiện:
   - checklist bắt buộc đã xong
   - evidence đủ
   - issue chặn đã đóng
   - vật tư/chứng từ liên quan đã đầy đủ
3. Giám sát chọn các hạng mục nghiệm thu.
4. Nhập kết quả kiểm tra thực tế cho từng hạng mục.
5. Preview `Biên bản nghiệm thu số`.
6. Khách hàng và đại diện BAC ký trên thiết bị touch.
7. Hệ thống khóa biên bản, xuất file số, đồng bộ dossier.

### Đầu ra

- biên bản nghiệm thu số
- file chữ ký
- trạng thái công trình/hạng mục được cập nhật

### Rule

- nếu thiếu điều kiện, hệ thống phải chỉ rõ thiếu gì và ai cần bổ sung
- biên bản sau ký phải bất biến; nếu sửa phải tạo bản mới

## 8. Flow 7 - Visit bảo hành/bảo trì và ghi phát sinh

### Mục tiêu

Chuẩn hóa quy trình hậu mãi từ góc nhìn hiện trường, đặc biệt khi cần liên thông sang tài chính.

### Luồng chính

1. Giám sát nhận case bảo hành/bảo trì.
2. Mở `Visit bảo hành/bảo trì`.
3. Hệ thống hiển thị lịch sử công trình, hồ sơ nghiệm thu và điều khoản liên quan.
4. Giám sát ghi nhận:
   - hiện trạng phát sinh
   - khu vực ảnh hưởng
   - ảnh trước xử lý
   - nhận định sơ bộ
5. Nếu có xử lý ngay, Giám sát ghi:
   - công việc đã làm
   - vật tư sử dụng
   - khối lượng
   - chi phí phát sinh nếu có
   - ảnh sau xử lý
6. Ký xác nhận visit nếu cần.
7. Hệ thống đẩy case:
   - sang PM nếu cần theo dõi kỹ thuật
   - sang Kế toán nếu là hậu mãi tính phí

### Đầu ra

- báo cáo visit hậu mãi
- ảnh trước/sau
- chi phí hoặc khối lượng phát sinh

### Rule

- phải phân loại rõ bảo hành hay bảo trì
- case tính phí không được dừng ở mức báo cáo kỹ thuật, phải có dữ liệu tài chính đi kèm

## 9. Flow 8 - Đồng bộ hồ sơ hiện trường lên cloud

### Mục tiêu

Bảo đảm mọi file tại hiện trường trở thành một phần của dossier chuẩn, không thất lạc trên thiết bị cá nhân.

### Luồng chính

1. Khi Giám sát chụp/tải file, hệ thống nhận file vào hàng đợi đồng bộ.
2. Hệ thống gắn metadata:
   - công trình
   - loại hồ sơ
   - gói việc hoặc visit
   - actor
   - thời gian
3. File được gửi lên kho cloud theo mapping Google Drive.
4. Nếu thành công, file được đánh dấu `đã đồng bộ`.
5. Nếu lỗi, file nằm trong `Failed Upload Queue`.
6. Giám sát hoặc hệ thống retry cho đến khi hoàn tất.

### Đầu ra

- dossier cloud đồng bộ với hồ sơ tại app
- trạng thái sync rõ ràng cho từng file

### Rule

- hồ sơ chưa đồng bộ đủ thì chưa được xem là hoàn tất
- không cho publish hồ sơ nghiệm thu hoặc hồ sơ khách hàng khi file lỗi sync

## 10. Kết luận

Flow của `Giám sát` trong V4 bao phủ đầy đủ từ khảo sát đến hậu mãi. Đây là phần lõi để biến dữ liệu hiện trường rời rạc thành quy trình vận hành có thể kiểm soát, truy vết và liên thông với các module khác.
