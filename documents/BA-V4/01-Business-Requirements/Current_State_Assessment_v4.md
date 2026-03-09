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
| ERD | `ERD_v2` không còn đủ | Chưa phản ánh đầy đủ `Service Request`, `Dynamic Pipeline`, `Task module`, `Worker profile`, `Google Drive sync`, `Acceptance`, `Warranty/Maintenance` |

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
- Quản lý metadata file và đồng bộ cloud
- Notification engine
- Audit trail tổng
- Báo cáo đối soát
- UAT và regression pack

### 3.3 Task module là khoảng trống lớn nhất

Người dùng đã nêu đúng một vấn đề trọng tâm: hệ thống đang có `Checklist thi công`, nhưng chưa có `Task module` xuyên vai trò và chưa khóa mô hình `Supervisor thao tác thay Worker profile`.

Khoảng trống hiện tại:

- Chưa có `task` cho từng stage CRM
- Chưa có `work package` cho từng dự án/khu vực
- Chưa có `owner`, `reviewer`, `due date`, `dependency`, `SLA`
- Chưa có task cho PM/Supervisor ngoài checklist ảnh
- Chưa có worker profile, phân công nội bộ và bàn giao liên vai trò ở mức dữ liệu chuẩn
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
| Tài liệu nghiệp vụ | 81% | BA-V4 đã gom được baseline khá đầy đủ, nhưng chưa xuống hết tới mức user story/dev spec |
| Thiết kế màn hình | 74% | Wireframe và page prototype khá phong phú |
| Logic nghiệp vụ cục bộ | 42% | Có một phần rule trong UI nhưng chưa có workflow/backend |
| Mô hình dữ liệu chuẩn | 70% | ERD v4 đã phản ánh core flow mới, nhưng còn cần khóa tiếp khi xuống API contract và migration |
| Khả năng triển khai vận hành | 22% | Chưa có nền tảng để go-live thật |

### 4.2 Theo module

| Module | Maturity | Nhận xét |
|---|---:|---|
| CRM & Sales Orchestration | 60% | Đã khóa rõ hơn luồng `Service Request` linh hoạt, nhưng code chưa có workflow thật và chưa có versioning/approval đầy đủ |
| Vận hành nội bộ | 36% | Blueprint đã rõ hơn về WBS/task/playbook/handoff, nhưng code chưa có orchestration thật |
| Inventory & Procurement | 38% | Có danh mục, định mức, đề xuất xuất/nhập; thiếu reservation, ledger kho và mua hàng thật |
| Finance, Acceptance, Warranty & Maintenance | 34% | Tài liệu đã rõ hơn, nhưng code vẫn thiếu close loop nghiệm thu, hậu mãi và hạch toán phát sinh |
| File governance & Cloud | 20% | Đã xác định hướng metadata-first và Google Drive, nhưng code gần như chưa có lớp tích hợp |
| Admin/Governance | 32% | Có màn admin nhưng bị phân mảnh, nhiều phần placeholder |

## 5. Quyết định reset cho BA-V4

BA-V4 đề xuất khóa lại 10 quyết định:

1. Dùng `Service Request` làm entity chạy pipeline.
2. Hỗ trợ cả hai hướng tạo dữ liệu: `Customer -> Service Request` và `Service Request -> auto-create Customer`.
3. Dựng `Task module` làm xương sống vận hành giữa CRM và khối vận hành nội bộ.
4. Khóa mô hình `Supervisor thao tác thay Worker profile` ở giai đoạn hiện tại.
5. Tách `Pipeline config` thành cấu hình động có `playbook nhiệm vụ`.
6. Chốt `Google Drive` là lớp lưu trữ cloud, nhưng metadata phải nằm trong hệ thống.
7. Chuẩn hóa vòng đời `Acceptance -> Warranty/Maintenance -> Financial impact`.
8. Gộp lại một `Admin control plane` duy nhất, không tiếp tục phát tán giữa `admin-v2` và `admin-app`.
9. Tạo một `ERD chuẩn` cho toàn hệ thống trước khi phát triển tiếp.
10. Chuyển từ tư duy “build từng màn” sang “build theo end-to-end workflow”.

## 6. Kết luận

Dự án hiện tại không phải là thất bại; ngược lại, nó đã có một lượng tài sản tốt:

- Ý tưởng nghiệp vụ đã đi khá sát thực tế
- Nhiều màn hình đã được mô phỏng
- Nhiều gap đã được phát hiện đúng

Tuy nhiên, nếu không dừng lại để chuẩn hóa bằng BA-V4, hệ thống sẽ tiếp tục gặp 3 rủi ro:

1. Xây thêm càng nhiều càng rối do thiếu mô hình dữ liệu chuẩn
2. PM/Supervisor/worker profile không có một flow vận hành thống nhất, dễ sai actor và sai trách nhiệm
3. Code UI tiếp tục đi trước tài liệu và đi trước backend, làm tăng chi phí sửa lại
