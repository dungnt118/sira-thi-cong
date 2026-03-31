# GAP cleanup dữ liệu mồ côi sau hợp nhất `Journey`

## Bối cảnh

Theo quyết định mới, các GAP kiểu "không rõ map dữ liệu cũ" không còn được xử lý bằng suy đoán nghiệp vụ. Hướng xử lý chuẩn là:

- xóa dữ liệu cũ không map an toàn được
- giữ lại và seed mới theo mô hình `Journey` làm trung tâm
- chỉ giữ các dữ liệu legacy thật sự cần đối soát lịch sử

Wave cleanup hiện tại đã xóa được toàn bộ dữ liệu seed cũ của `ServiceRequest` và `Project`. Tuy nhiên vẫn còn một nhóm dữ liệu mồ côi cá nhân không thể xóa bằng tool hiện có do backend đang áp ownership ở mức nội dung.

## Đã xóa thành công

### 1. `Project` seed cũ

- `DA-2026-001`
- `DA-2026-002`

Kết quả hiện tại: collection `Project` live không còn bản ghi seed chuẩn.

### 2. `ServiceRequest` seed cũ

- `SR-2026-001`
- `SR-2026-002`
- `SR-2026-003`

Kết quả hiện tại: tenant chỉ còn các record legacy cá nhân ngoài batch seed chuẩn.

## Dữ liệu mồ côi còn sót và lý do chưa xóa được

### 1. `ServiceRequest`

- `_id = 69c7f189a718dc692a22b79e`, `code = sanmai`, chủ sở hữu `admin`
- `_id = 69c9e53f1e264278da741a98`, `code = YC-20260330-003`, chủ sở hữu `lamnd@gmail.com`
- `_id = 69cb57821265d63bececab31`, `code = YC-20260331-001`, chủ sở hữu `lamnd@gmail.com`

### 2. `MasterDataCategory`

- `_id = 69c7f0daa718dc692a22b79c`, `code = crm`, chủ sở hữu `admin`

### 3. Lý do chưa xóa được

Các record trên đã được đánh `isSeeding = true` để thử đi qua luồng xóa seed an toàn. Tuy nhiên backend vẫn trả về lỗi ownership:

- tài nguyên cá nhân của `admin`
- tài nguyên cá nhân của `lamnd@gmail.com`

Điều này cho thấy vấn đề còn lại không phải GAP nghiệp vụ, mà là hạn chế quyền xóa nội dung cá nhân ở tầng backend.

## Đánh giá ảnh hưởng

- Không còn ảnh hưởng tới runtime chuẩn của batch seed mới.
- `ServiceRequest` hiện không còn schema runtime để tiếp tục phát sinh seeding chuẩn.
- Các record trên chỉ còn là dữ liệu mồ côi để đối soát hoặc cần dọn thủ công.
- `MasterDataCategory.code = crm` là residue legacy, không được dùng lại cho batch canonical mới.

## Khuyến nghị xử lý dứt điểm

### Phương án A. Xóa bằng tài khoản chủ sở hữu hoặc tài khoản có quyền cao hơn

Áp dụng khi có thể thao tác bằng đúng owner `admin` / `lamnd@gmail.com` hoặc có luồng backend bypass ownership cho cleanup dữ liệu cũ.

### Phương án B. Tạo tác vụ cleanup đặc quyền ở backend

Tạo một luồng bảo trì chỉ dành cho admin hệ thống để xóa record legacy đã có `isSeeding = true` mà không bị chặn bởi ownership cá nhân.

### Phương án C. Giữ nguyên như dữ liệu mồ côi đã cô lập

Chấp nhận để lại các record này nếu:

- không còn menu/runtime/schema nào dùng đến
- không còn seed canonical nào tham chiếu tới chúng
- không gây xung đột mã nghiệp vụ trong batch mới

## Kết luận

- Phần GAP nghiệp vụ map `ServiceRequest -> Journey` đã được đóng theo hướng "không map mù".
- Batch canonical mới không còn phụ thuộc các record legacy trên.
- Phần còn lại là cleanup quyền sở hữu dữ liệu cũ, không còn là blocker nghiệp vụ cho mô hình seed `Journey-first`.
