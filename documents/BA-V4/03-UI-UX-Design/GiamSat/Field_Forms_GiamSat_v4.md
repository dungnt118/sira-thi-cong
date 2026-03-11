# Field Forms Giám sát v4

## 1. Mục tiêu

Tài liệu này chuẩn hóa các biểu mẫu hiện trường mà `Giám sát` phải tạo và quản lý trên hệ thống, dựa trên các mẫu chứng từ thực tế trong `documents/Orignal-Requirements-Docs`.

Mục tiêu không phải là số hóa một file Word/Excel nguyên trạng, mà là bóc tách dữ liệu lõi để:

- nhập liệu trực tiếp trên ứng dụng
- sinh tài liệu số tự động
- ký điện tử trên màn hình touch
- đồng bộ hồ sơ lên Google Drive theo dossier chuẩn

## 2. Nguyên tắc chuẩn hóa biểu mẫu

1. Mỗi biểu mẫu phải có `dữ liệu cấu trúc` và `file đầu ra`.
2. Ảnh/video minh chứng phải gắn được với từng biểu mẫu hoặc từng khối nội dung trong biểu mẫu.
3. Chữ ký điện tử là một thành phần dữ liệu bắt buộc đối với các biên bản cần xác nhận tại hiện trường.
4. Một biểu mẫu có thể có nhiều phiên bản nháp trước khi được khóa thành bản chính thức.
5. Bản chính thức sau khi ký phải đẩy vào dossier cloud, không cho sửa trực tiếp.

## 3. Danh mục biểu mẫu lõi

| Mã form | Biểu mẫu | Nguồn tham chiếu thực tế | Đầu ra số |
|---|---|---|---|
| GF-01 | Biên bản khảo sát công trình | Mẫu khảo sát công trình BAC | PDF/biên bản số + chữ ký + media khảo sát |
| GF-02 | Báo cáo hiện trạng & đề xuất biện pháp | Mẫu báo cáo tổng hợp và các dossier công trình đang triển khai | Report số + media gắn ngữ cảnh |
| GF-03 | Nhật ký ảnh/video hiện trường | Ảnh/video trong hồ sơ công trình thực tế | Bộ media có metadata + mapping dossier |
| GF-04 | Phiếu giao nhận và cấp phát vật tư | Mẫu biên bản giao nhận + file kho vật tư | Biên bản số + chữ ký + log cấp phát |
| GF-05 | Biên bản nghiệm thu công trình | Mẫu nghiệm thu BAC | Biên bản số + checklist nghiệm thu + chữ ký |
| GF-06 | Báo cáo hiện trạng cần bảo hành/bảo trì | Hồ sơ công trình đang bảo trì | Report hậu mãi + media trước/sau |
| GF-07 | Bảng ghi nhận chi phí bảo trì tại hiện trường | File chi phí bảo trì thực tế | Dữ liệu chi phí cấu trúc + đính kèm chứng từ |

## 4. Chi tiết từng biểu mẫu

### 4.1 GF-01 - Biên bản khảo sát công trình

**Mục tiêu**

Chuẩn hóa dữ liệu khảo sát đầu vào để phục vụ báo giá, giải pháp và kế hoạch triển khai.

**Nhóm thông tin bắt buộc**

- khách hàng
- số điện thoại
- địa chỉ công trình
- khảo sát viên
- ngày giờ khảo sát
- bảng chi tiết hiện trạng
- bảng hạng mục thi công dự kiến
- chữ ký khách hàng
- chữ ký Giám sát

**Media đi kèm**

- ảnh tổng thể công trình
- ảnh cận cảnh từng vấn đề
- video nếu cần mô tả dòng chảy, thấm dột hoặc điều kiện khó ghi bằng ảnh

**Output hệ thống**

- bản preview để xác nhận tại chỗ
- biên bản khảo sát số
- thư mục media khảo sát trong dossier cloud

### 4.2 GF-02 - Báo cáo hiện trạng & đề xuất biện pháp

**Mục tiêu**

Phản ánh rõ tình trạng thực tế và hướng xử lý đề xuất theo logic các báo cáo tổng hợp BAC đang sử dụng.

**Khối nội dung bắt buộc**

- tóm tắt công trình và bối cảnh khảo sát
- hiện trạng chi tiết theo khu vực/hạng mục
- nhận định nguyên nhân hoặc rủi ro
- đề xuất biện pháp xử lý
- ghi chú kỹ thuật hoặc điều kiện thi công liên quan

**Output hệ thống**

- report dạng số có thể xuất PDF
- version history
- media mapping theo từng khối nội dung

### 4.3 GF-03 - Nhật ký ảnh/video hiện trường

**Mục tiêu**

Biến ảnh/video hiện trường thành tài sản dữ liệu có thể truy vết, không chỉ là file rời.

**Metadata bắt buộc**

- công trình
- loại hồ sơ: khảo sát, thi công, nghiệm thu, bảo hành, bảo trì
- khu vực/hạng mục
- step hoặc visit liên quan
- người thao tác số
- worker profile thực hiện nếu có
- thời gian
- trạng thái đồng bộ

**Rule**

- file phải vào đúng dossier cloud
- file lỗi sync phải có cơ chế retry
- file dùng cho khách hàng phải có cờ `approved/published`

### 4.4 GF-04 - Phiếu giao nhận và cấp phát vật tư

**Mục tiêu**

Số hóa quá trình giao nhận vật tư tại công trình và tạo được liên kết với thi công thực tế.

**Nhóm thông tin bắt buộc**

- mã phiếu
- công trình
- người giao
- người nhận
- ngày giờ nhận
- danh sách vật tư, số lượng, đơn vị
- trạng thái nhận đủ/thiếu
- ghi chú tình trạng hàng hóa
- chữ ký điện tử các bên

**Phần mở rộng cần có**

- ảnh kiện hàng hoặc vật tư khi nhận
- log cấp phát tiếp theo cho hạng mục hoặc worker profile
- liên kết case sự cố nếu phát hiện thiếu/hư hỏng

### 4.5 GF-05 - Biên bản nghiệm thu công trình

**Mục tiêu**

Tạo biên bản nghiệm thu số từ dữ liệu thi công thay vì nhập tay lại từ đầu.

**Khối dữ liệu bắt buộc**

- tên công trình
- địa điểm
- thành phần tham gia
- danh sách hạng mục nghiệm thu
- đơn vị tính, khối lượng
- tiêu chuẩn kiểm tra
- kết quả nghiệm thu
- kết luận
- chữ ký các bên

**Rule**

- chỉ cho phép lấy các hạng mục đã đủ điều kiện từ checklist/task
- cho phép nghiệm thu từng phần và nghiệm thu toàn bộ
- bản sau ký phải là bản khóa

### 4.6 GF-06 - Báo cáo hiện trạng cần bảo hành/bảo trì

**Mục tiêu**

Ghi nhận hiện trạng phát sinh sau bàn giao và làm cơ sở quyết định bảo hành hay bảo trì tính phí.

**Khối dữ liệu bắt buộc**

- thông tin công trình gốc
- ngày tiếp nhận visit
- khu vực phát sinh
- mô tả hiện trạng
- nhận định sơ bộ
- phân loại bảo hành/bảo trì
- đề xuất xử lý
- ảnh trước xử lý

**Output hệ thống**

- report hậu mãi
- case link tới hợp đồng/điều khoản bảo hành
- dữ liệu cho PM và Kế toán xử lý tiếp

### 4.7 GF-07 - Bảng ghi nhận chi phí bảo trì tại hiện trường

**Mục tiêu**

Bóc chi phí bảo trì phát sinh tại visit để liên thông với tài chính.

**Nhóm dữ liệu bắt buộc**

- vật tư sử dụng
- đơn vị tính
- số lượng
- đơn giá tham chiếu hoặc giá thực tế
- thành tiền
- nhân công/phụ phí nếu có
- ghi chú nguyên nhân phát sinh

**Rule**

- nếu là case tính phí khách hàng thì phải đẩy dữ liệu sang module tài chính
- hỗ trợ đính kèm ảnh phiếu mua, ảnh hiện trường, ghi chú xác nhận

## 5. Chữ ký điện tử trong biểu mẫu hiện trường

Các form sau bắt buộc phải hỗ trợ ký điện tử trên màn hình touch:

- biên bản khảo sát
- phiếu giao nhận vật tư
- biên bản nghiệm thu
- biên bản visit bảo hành/bảo trì khi cần xác nhận với khách hàng

Yêu cầu dữ liệu ký:

- họ tên người ký
- vai trò người ký
- timestamp ký
- ảnh nét ký hoặc vector stroke
- file biên bản đã nhúng phần ký

## 6. Đồng bộ hồ sơ lên Google Drive

Mỗi biểu mẫu chính thức sau khi khóa phải được đồng bộ vào dossier cloud theo nhóm:

- `01_KhaoSat`
- `02_HienTrang_GiaiPhap`
- `03_ThiCong_Checklist_Media`
- `04_GiaoNhan_VatTu`
- `05_NghiemThu`
- `06_BaoHanh_BaoTri`

Ứng dụng giữ:

- metadata
- trạng thái sync
- version
- quyền hiển thị nội bộ/khách hàng

## 7. Kết luận

Bộ form của `Giám sát` là trục dữ liệu hiện trường của toàn hệ thống. Nếu chưa chuẩn hóa xong các form này thì các module phía sau như PM, Hành chính, Kế toán, Portal khách hàng và hậu mãi đều sẽ tiếp tục bị thiếu dữ liệu hoặc phải làm tay.
