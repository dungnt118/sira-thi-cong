# Giám sát - Bộ tài liệu chuyên sâu V4

## Mục tiêu vai trò

Giám sát là actor số chính ở hiện trường trong giai đoạn triển khai hiện tại của hệ thống. Vai trò này chịu trách nhiệm biến kế hoạch của PM thành dữ liệu vận hành thực tế tại công trình, đồng thời thao tác trên phần mềm thay cho các `kỹ thuật profile` chưa có tài khoản riêng.

Giám sát trong V4 không chỉ là người cập nhật checklist. Đây là vai trò sở hữu trọn bộ đầu ra hiện trường:

- biên bản khảo sát
- báo cáo hiện trạng và đề xuất biện pháp
- nhật ký thi công
- ảnh/video minh chứng
- ký nhận và cấp phát vật tư
- biên bản nghiệm thu
- hồ sơ visit bảo hành, bảo trì

## Cơ sở nghiệp vụ dùng để chuẩn hóa

Bộ tài liệu này được làm sạch và tái cấu trúc theo các chứng từ, hồ sơ và dossier thực tế trong `documents/Orignal-Requirements-Docs`, nổi bật gồm:

- mẫu khảo sát công trình
- mẫu báo cáo tổng hợp hiện trạng
- mẫu biên bản giao nhận
- mẫu biên bản nghiệm thu công trình
- hồ sơ công trình đang triển khai
- hồ sơ công trình đang bảo trì
- file kho vật tư thi công

## Phạm vi tài liệu trong package

| File | Mục đích |
|---|---|
| `FDD_GiamSat_v4.md` | Đặc tả chức năng chi tiết cho vai trò Giám sát |
| `Screen_Inventory_GiamSat_v4.md` | Danh mục màn hình, route prototype và độ phủ hiện tại |
| `User_Flows_GiamSat_v4.md` | Các luồng nghiệp vụ hiện trường theo end-to-end |
| `Field_Forms_GiamSat_v4.md` | Chuẩn hóa các biểu mẫu và đầu ra số của Giám sát |

## Những điểm được làm rõ trong V4

- Giám sát là tên vai trò nghiệp vụ chính thức của package hiện trường trong BA-V4.
- Kỹ thuật vẫn tồn tại dưới dạng `kỹ thuật profile`, chưa phải user account trực tiếp.
- Mọi thao tác checklist, evidence, sự cố, vật tư, nghiệm thu đều phải ghi nhận được:
  - người thao tác số là Giám sát
  - kỹ thuật profile thực tế tham gia nếu có
- Dữ liệu hiện trường phải đủ cấu trúc để sinh tài liệu số, không chỉ là ảnh đính kèm rời.
- Ảnh/video/file tại hiện trường là một phần của hồ sơ vận hành, phải đồng bộ với chiến lược Google Drive của hệ thống.

## Quan hệ với prototype hiện tại

Code hiện tại mới có seed mobile cho một phần vai trò này ở các route `/gs/*`, nhưng vẫn còn dùng lại component trong `src/pages/kỹ thuật/*`. Trong BA-V4, tên vai trò và luồng nghiệp vụ được chuẩn hóa thống nhất là `Giám sát`; phần naming kỹ thuật di sản sẽ được xử lý ở pha refactor code riêng.

## Kết luận

Từ phiên bản này, package `GiamSat` được xem là bộ baseline triển khai cho vai trò hiện trường. Nếu một màn hình, form hoặc luồng hiện trường chưa xuất hiện trong package này thì mặc định xem là chưa đủ để đưa vào triển khai thực tế.
