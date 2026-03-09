# Đánh giá hiện trạng dự án - BA-V4

## 1. Phạm vi rà soát

Đợt rà soát này bao gồm:

- Bộ tài liệu `BA-V2`
- Bộ tài liệu `BA-V3`
- Nguồn đầu vào của V3: sơ đồ module, wireframe bổ sung, gap audit
- Codebase chính trong `src/`
- Ứng dụng `admin-app/`

## 2. Ảnh chụp hiện trạng

### 2.1 Về tài liệu

| Nhóm | Hiện trạng | Nhận xét |
|---|---|---|
| `BA-V2` | Có cấu trúc đầy đủ, phân vai trò rõ | Mạnh về form tài liệu, yếu ở yêu cầu mới của V3 |
| `BA-V3` | Bổ sung đúng các module CRM, checklist, inventory, finance | Chưa khóa mô hình dữ liệu chuẩn, nhiều bổ sung nằm ở wireframe/gap audit chứ chưa quy về một baseline duy nhất |
| Wireframe V3 | Bao phủ khá nhiều màn hình thực tế | Một số màn chỉ dừng ở sketch, chưa quy về acceptance criteria và data contract |
| ERD | `ERD_v2` không còn đủ | Chưa phản ánh `Service Request`, `Dynamic Pipeline`, `Task module`, `Acceptance`, `Maintenance` |

### 2.2 Về codebase

| Khu vực | Hiện trạng | Tác động |
|---|---|---|
| `src/` | Ứng dụng chính có nhiều route V2 + V3 cùng tồn tại | Điều hướng PM/Admin bị rời rạc, dễ gây chồng chéo |
| `src/data/mockData.ts` | Là nguồn dữ liệu chính cho phần lớn màn hình | Hệ thống chưa có backend, chưa có transaction, chưa có persistence thật |
| `src/services/` | Gần như chưa có lớp service/API thật | Chưa có ranh giới giữa presentation và nghiệp vụ |
| `src/store/` | Hầu như trống | Chưa có state management cho workflow thật |
| `admin-app/` | Có app admin riêng nhưng phần lớn là placeholder | Trùng định hướng với `admin-v2` trong app chính, dễ tạo hai nguồn sự thật |

### 2.3 Tình trạng build và chất lượng kỹ thuật

| Hạng mục | Kết quả | Ý nghĩa |
|---|---|---|
| `src/` type-check | Qua | Frontend chính chưa vỡ kiểu dữ liệu ở mức TypeScript |
| `src/` build | Bị chặn ở bước dọn `dist` do quyền file | Không phải lỗi nghiệp vụ chính, nhưng pipeline build chưa sạch |
| `admin-app/` type-check | Fail do import không dùng | App admin riêng chưa đạt ngưỡng tối thiểu để build ổn định |
| Service/API thật | Chưa có | Toàn bộ luồng hiện tại chỉ là mô phỏng UI |

## 3. Các phát hiện chính

### 3.1 Mô hình nghiệp vụ lõi chưa thống nhất

Hiện đang tồn tại song song 3 cách hiểu:

- `BA-V2`: CRM khá mỏng, trọng tâm nằm ở dự án/outsource
- `BA-V3`: đúng hơn ở góc CRM-first, nhưng phát sinh thêm nhiều chỗ qua wireframe và gap audit
- Code hiện tại: đã bắt đầu tách `ServiceRequest`, nhưng vẫn giữ song song nhiều route/màn legacy

Kết quả là chưa có một baseline duy nhất cho:

- Entity lõi
- Luồng chuyển đổi giữa module
- Quy tắc tạo dữ liệu
- Điểm cắt giữa CRM và Delivery

### 3.2 Sai số lớn nhất nằm ở lớp “vận hành thật”

Code hiện tại cho thấy dự án đã đi khá xa ở mặt trình bày UI, nhưng còn thiếu gần như toàn bộ các lớp để chạy thật:

- Auth/session thật
- RBAC thật
- Approval workflow
- API contract
- Lưu vết giao dịch kho/tài chính
- Notification engine
- Audit trail tổng
- Báo cáo đối soát
- UAT và regression pack

### 3.3 Task module là khoảng trống lớn nhất

Người dùng đã nêu đúng một vấn đề trọng tâm: hệ thống đang có `Checklist thi công`, nhưng chưa có `Task module` xuyên vai trò.

Khoảng trống hiện tại:

- Chưa có `task` cho từng stage CRM
- Chưa có `work package` cho từng dự án/khu vực
- Chưa có `owner`, `reviewer`, `due date`, `dependency`, `SLA`
- Chưa có task cho PM/Supervisor ngoài checklist ảnh
- Chưa liên thông task với kho, nghiệm thu, bảo dưỡng

### 3.4 UI/UX PM đang bị chia cắt

PM hiện phải đi qua nhiều cụm màn:

- CRM
- Construction
- Inventory
- Finance
- Legacy pages của V2

Nhưng chưa có:

- Một workbench thống nhất theo ngữ cảnh dự án/yêu cầu dịch vụ
- Một timeline end-to-end
- Một task board đa vai trò
- Một nơi duy nhất để thấy “đang vướng ở đâu”

## 4. Đánh giá trưởng thành hiện tại

### 4.1 Theo lớp năng lực

| Lớp năng lực | Điểm ước lượng | Giải thích |
|---|---:|---|
| Tài liệu nghiệp vụ | 62% | Có nhiều thành phần nhưng chưa gom thành một baseline sạch |
| Thiết kế màn hình | 74% | Wireframe và page prototype khá phong phú |
| Logic nghiệp vụ cục bộ | 42% | Có một phần rule trong UI nhưng chưa có workflow/backend |
| Mô hình dữ liệu chuẩn | 35% | Chưa có ERD mới phản ánh đầy đủ V3 + gap mới |
| Khả năng triển khai vận hành | 22% | Chưa có nền tảng để go-live thật |

### 4.2 Theo module

| Module | Maturity | Nhận xét |
|---|---:|---|
| CRM & Pipeline | 55% | Đã có hướng đúng với `Service Request`, nhưng thiếu playbook, quote versioning, contract conversion chuẩn |
| Delivery & Task | 28% | Có checklist thi công, chưa có task orchestration |
| Inventory | 35% | Có danh mục, định mức, đề xuất xuất/nhập; thiếu engine kho và mua hàng |
| Finance | 30% | Có dashboard và milestone demo; thiếu đối soát và bút toán thật |
| Warranty/Portal | 26% | Có ý tưởng và page portal, thiếu lifecycle hoàn chỉnh |
| Admin/Governance | 32% | Có màn admin nhưng bị phân mảnh, nhiều phần placeholder |

## 5. Quyết định reset cho BA-V4

BA-V4 đề xuất khóa lại 6 quyết định:

1. Dùng `Service Request` làm entity chạy pipeline.
2. Dựng `Task module` làm xương sống vận hành giữa CRM và Delivery.
3. Tách `Pipeline config` thành cấu hình động có `playbook nhiệm vụ`.
4. Gộp lại một `Admin control plane` duy nhất, không tiếp tục phát tán giữa `admin-v2` và `admin-app`.
5. Tạo một `ERD chuẩn` cho toàn hệ thống trước khi phát triển tiếp.
6. Chuyển từ tư duy “build từng màn” sang “build theo end-to-end workflow”.

## 6. Kết luận

Dự án hiện tại không phải là thất bại; ngược lại, nó đã có một lượng tài sản tốt:

- Ý tưởng nghiệp vụ đã đi khá sát thực tế
- Nhiều màn hình đã được mô phỏng
- Nhiều gap đã được phát hiện đúng

Tuy nhiên, nếu không dừng lại để chuẩn hóa bằng BA-V4, hệ thống sẽ tiếp tục gặp 3 rủi ro:

1. Xây thêm càng nhiều càng rối do thiếu mô hình dữ liệu chuẩn
2. PM/Supervisor/Worker không có một flow vận hành thống nhất
3. Code UI tiếp tục đi trước tài liệu và đi trước backend, làm tăng chi phí sửa lại

