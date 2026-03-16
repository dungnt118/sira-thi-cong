# Coverage Matrix v4

## 1. Cách đọc ma trận

Ma trận này đối chiếu giữa:

- nhu cầu nghiệp vụ mục tiêu của BA-V4
- mức độ tài liệu hiện tại đã mô tả
- mức độ code hiện tại đã thể hiện
- mức độ sẵn sàng vận hành thật

Tỷ lệ là ước lượng theo 3 lớp:

- `Tài liệu`
- `UI prototype / code`
- `Vận hành thật`

Lưu ý:

- sau vòng review mới nhất, `BA-V4` đã nâng mạnh độ phủ tài liệu
- codebase chưa thay đổi tương ứng, nên khoảng cách `tài liệu -> vận hành thật` vẫn còn rất lớn

## 2. Scorecard tổng quan

| Chỉ số | Tỷ lệ ước lượng | Ghi chú |
|---|---:|---|
| Tài liệu BA hiện hữu phủ nhu cầu nghiệp vụ | 81% | BA-V4 đã khóa phần lớn baseline, còn thiếu story-level backlog chi tiết |
| Wireframe phủ các flow chính | 76% | Có nhiều màn, nhưng một số flow vẫn lệch mô hình mới `Giám sát thao tác thay kỹ thuật profile` |
| Code có màn hình prototype tương ứng | 69% | Có page cho nhiều flow, nhưng phần lớn còn dùng mock data |
| Code có logic nghiệp vụ cục bộ | 42% | Mới ở mức local state/component rule |
| Hệ thống sẵn sàng vận hành thật | 22% | Thiếu API, transaction, sync, test, audit, migration |

## 3. Coverage theo domain

| Domain | Tài liệu hiện có | Code hiện tại | Đáp ứng tổng | Nhận định |
|---|---:|---:|---:|---|
| Foundation/Auth/RBAC | 58% | 35% | 35% | Có login/layout nhưng chưa có auth thật |
| Customer master | 82% | 60% | 52% | Tài liệu đã rõ hơn về master customer và dedupe |
| Service Request/Deal | 80% | 65% | 48% | Đã khóa hướng `SR-first` và auto-create customer, nhưng code chưa có workflow thật |
| Dynamic Pipeline & Stage Playbook | 82% | 55% | 38% | Tài liệu đủ sâu hơn, code vẫn thiếu playbook/handoff rule thực |
| Survey & đo đạc | 72% | 55% | 35% | Có form demo, chưa có form engine và storage rule đầy đủ |
| Quotation & versioning | 68% | 45% | 28% | Chưa có rule đầy đủ cho version, approval, history |
| Contract conversion | 70% | 20% | 18% | Luồng quote -> contract -> project mới được chuẩn hóa trong tài liệu |
| Vận hành nội bộ & Task orchestration | 78% | 25% | 18% | Đây vẫn là khoảng trống lớn nhất giữa tài liệu và code |
| Checklist & evidence | 82% | 70% | 52% | Là phần mạnh nhất của prototype hiện tại |
| File governance & Google Drive | 74% | 10% | 12% | Tài liệu đã khóa chiến lược, code gần như chưa có |
| Inventory & stock | 68% | 45% | 32% | Có UI khá nhiều, thiếu reservation và ledger kho |
| Finance & payments | 66% | 40% | 28% | Mới ở dashboard/milestone demo |
| Acceptance | 72% | 10% | 18% | Tài liệu đã rõ hơn, code gần như chưa có |
| Warranty & maintenance | 78% | 15% | 20% | Tài liệu đã chi tiết hơn nhiều, code còn rất mỏng |
| Customer Portal | 68% | 50% | 36% | Có page demo, thiếu governance và publish rule thật |
| Reports & KPI | 52% | 30% | 20% | Chưa có data mart/report model |
| Audit & governance | 58% | 35% | 26% | Có màn nhưng chưa có event model và audit transaction thật |

## 4. Những gì đã có trong codebase

### 4.1 Đã có ở mức prototype

- login và layout theo vai trò
- danh sách khách hàng
- danh sách/chi tiết service request
- pipeline Kanban
- cấu hình pipeline động ở mức demo
- upload khảo sát và báo giá
- tạo dự án và checklist thi công
- màn hình route `supervisor` và page `kỹ thuật` di sản cho checklist/upload ảnh, nhưng cần quy hoạch lại theo mô hình `Giám sát thao tác thay kỹ thuật profile`
- danh mục vật tư, định mức, phiếu yêu cầu xuất/nhập
- dashboard thanh toán kế toán
- customer portal
- admin user/role/audit/settings/reports ở mức demo

### 4.2 Đã có một phần nhưng chưa đủ

- rule khóa bước theo vật tư
- review ảnh và trạng thái bằng chứng
- portal link ở chi tiết dự án
- audit page và settings page
- PM xem tài chính dự án

### 4.3 Chưa có hoặc quá mỏng

- create `Service Request` theo luồng linh hoạt kèm dedupe/auto-create customer thật
- stage playbook gắn pipeline
- task board cho PM/Giám sát theo mô hình vận hành nội bộ
- kỹ thuật profile và tracking `Giám sát thao tác thay kỹ thuật profile`
- convert flow quote -> contract -> project
- acceptance record
- stock ledger và reservation
- payment ledger và đối soát
- Google Drive sync, metadata store và retry queue
- warranty case / maintenance visit / aftersales cost / aftersales billing
- notification preference
- monthly report/export
- API/service/store thật

## 5. Coverage theo nhóm wireframe V3

| Nhóm wireframe | Tình trạng hiện tại |
|---|---|
| WF-00 đến WF-07 CRM | Phần lớn đã có prototype, nhưng chưa đủ rule `SR-first`, dedupe và quote flow thật |
| WF-07 đến WF-14 Delivery | Có prototype tương đối tốt, nhưng cần chuyển sang ngôn ngữ `Vận hành nội bộ` và task orchestration |
| WF-15 đến WF-21 Inventory | Có prototype trung bình, thiếu vận hành thật |
| WF-22 đến WF-27 Finance | Có prototype một phần, thiếu close loop với nghiệm thu và hậu mãi |
| WF-ADD nhóm evidence/checklist | Tương đối mạnh ở prototype |
| WF-ADD nhóm acceptance/warranty/maintenance | Chưa đầy đủ hoặc chưa có trong app chính |

## 6. Các hiệu chỉnh trọng yếu sau vòng review BRD

- Hỗ trợ hai hướng nhập liệu CRM: tạo `Customer` trước hoặc tạo `Service Request` trước.
- Chốt `Giám sát` là actor số hiện trường; `Kỹ thuật` chưa có account ở phase hiện tại.
- Đổi trọng tâm module từ `Delivery Planning & Task Management` sang `Vận hành nội bộ`.
- Bổ sung chiến lược quản lý ảnh/video/file và đồng bộ `Google Drive`.
- Làm sâu vòng đời `Acceptance -> Warranty/Maintenance -> Financial impact`.

## 7. Kết luận coverage

### Nếu nhìn theo góc tài liệu

- BA-V4 hiện đã đủ tốt để làm baseline build.
- Tuy nhiên vẫn nên tiếp tục tách xuống `Epic -> User Story -> Acceptance Criteria` trước khi giao toàn bộ cho dev team.

### Nếu nhìn theo góc code

- Dự án vẫn đang ở trạng thái `prototype khá tốt`.
- Nhưng chưa thể coi là `MVP vận hành thật`.

### Kết luận cuối

Hiện tại BAC Group đã có:

- baseline tài liệu tốt hơn rất nhiều
- tài sản UI prototype tái sử dụng được

Nhưng vẫn cần một giai đoạn build lại "xương sống" rất rõ ràng ở:

- workflow
- actor model
- transaction
- file governance
- hậu mãi gắn tài chính
