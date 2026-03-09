# Coverage Matrix v4

## 1. Cách đọc ma trận

Ma trận này đối chiếu giữa:

- nhu cầu nghiệp vụ mục tiêu của V4
- mức độ tài liệu hiện tại đã mô tả
- mức độ code hiện tại đã thể hiện
- mức độ sẵn sàng vận hành thật

Tỷ lệ là ước lượng theo 3 lớp:

- `Tài liệu`
- `UI prototype`
- `Vận hành thật`

## 2. Scorecard tổng quan

| Chỉ số | Tỷ lệ ước lượng | Ghi chú |
|---|---:|---|
| Tài liệu BA hiện hữu phủ nhu cầu nghiệp vụ | 62% | Đã có nhiều ý đúng nhưng thiếu hợp nhất |
| Wireframe phủ các flow chính | 78% | V3 đã có nhiều WF và bổ sung |
| Code có màn hình prototype tương ứng | 69% | Có page cho nhiều WF, nhưng nhiều phần dùng mock data |
| Code có logic nghiệp vụ cục bộ | 42% | Mới ở mức local state/component rule |
| Hệ thống sẵn sàng vận hành thật | 22% | Thiếu API, transaction, test, audit, migration |

## 3. Coverage theo domain

| Domain | Tài liệu hiện có | Code hiện tại | Đáp ứng tổng | Nhận định |
|---|---:|---:|---:|---|
| Foundation/Auth/RBAC | 55% | 35% | 35% | Có login/layout nhưng chưa có auth thật |
| Customer master | 75% | 60% | 50% | Có tài liệu và page cơ bản |
| Service Request/Deal | 70% | 65% | 45% | Hướng đúng nhưng chưa có workflow thật |
| Dynamic Pipeline | 70% | 55% | 35% | Có settings demo, chưa có playbook và migration rule thật |
| Survey & đo đạc | 68% | 55% | 35% | Có form demo, chưa có storage/form engine |
| Quotation & versioning | 55% | 45% | 25% | Chưa có rule đầy đủ cho nhiều phiên bản và phê duyệt |
| Contract conversion | 45% | 20% | 15% | Luồng từ báo giá sang hợp đồng/dự án chưa khóa |
| Project & Task orchestration | 35% | 25% | 15% | Khoảng trống lớn nhất |
| Checklist & evidence | 80% | 70% | 50% | Đây là phần mạnh nhất của prototype hiện tại |
| Incident & field reporting | 65% | 60% | 40% | Có page nhưng chưa có workflow tổng |
| Inventory & stock | 60% | 45% | 30% | Có UI khá nhiều, thiếu ledger kho |
| Finance & payments | 58% | 40% | 25% | Mới ở dashboard/milestone demo |
| Acceptance | 40% | 10% | 10% | Wireframe có, code gần như chưa có |
| Warranty & maintenance | 45% | 15% | 15% | Nhiều phần `ComingSoon` |
| Customer Portal | 60% | 50% | 35% | Có page demo, thiếu governance và publish rule |
| Reports & KPI | 45% | 30% | 20% | Chưa có data model báo cáo |
| Audit & governance | 50% | 35% | 25% | Có màn nhưng chưa có event model thật |

## 4. Những gì đã có trong codebase

### 4.1 Đã có ở mức prototype

- Login và layout theo vai trò
- Danh sách khách hàng
- Danh sách/chi tiết service request
- Pipeline Kanban
- Cấu hình pipeline động
- Upload khảo sát và báo giá
- Tạo dự án và checklist thi công
- Màn hình worker/supervisor cho checklist và upload ảnh
- Danh mục vật tư, định mức, phiếu yêu cầu xuất/nhập
- Dashboard thanh toán kế toán
- Customer portal
- Admin user/role/audit/settings/reports ở mức demo

### 4.2 Đã có một phần nhưng chưa đủ

- Rule khóa bước theo vật tư
- Review ảnh và trạng thái bằng chứng
- Portal link ở chi tiết dự án
- Audit page và settings page
- PM xem tài chính dự án

### 4.3 Chưa có hoặc quá mỏng

- Task board cho PM/Supervisor/Worker
- Stage playbook gắn pipeline
- Convert flow quote -> contract -> project
- Acceptance record
- Stock ledger và reservation
- Payment ledger và đối soát
- Warranty lifecycle
- Maintenance visits
- Notification preference
- Monthly report/export
- API/service/store thật

## 5. Coverage theo nhóm wireframe V3

| Nhóm wireframe | Tình trạng hiện tại |
|---|---|
| WF-00 đến WF-07 CRM | Phần lớn đã có prototype |
| WF-07 đến WF-14 Delivery | Đã có prototype tương đối tốt |
| WF-15 đến WF-21 Inventory | Có prototype trung bình, thiếu vận hành thật |
| WF-22 đến WF-27 Finance | Có prototype một phần, thiếu close loop |
| WF-ADD-01, 02, 05, 06, 11 | Đã có page hoặc logic demo |
| WF-ADD-03, 04, 07, 08, 09, 10 | Chưa đầy đủ hoặc chưa có trong app chính |

## 6. Kết luận coverage

### Nếu nhìn theo góc tài liệu

- Dự án đã có nền BA khá hơn mức sơ khởi.
- Nhưng tài liệu vẫn chưa đạt mức “ready for build” cho toàn hệ thống nếu chưa chuẩn hóa sang BA-V4.

### Nếu nhìn theo góc code

- Dự án đang ở trạng thái `prototype rất khá`.
- Nhưng chưa thể coi là `MVP vận hành thật`.

### Kết luận cuối

Có thể tận dụng rất nhiều tài sản hiện có, nhưng phải coi BA-V4 là đường ray mới để:

- dọn mô hình dữ liệu
- khóa workflow
- gom lại UI/UX
- xây tiếp theo wave

