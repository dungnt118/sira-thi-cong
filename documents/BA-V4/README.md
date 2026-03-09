# BA-V4 - Bộ tài liệu tái cấu trúc BAC Group

## Mục tiêu của BA-V4

BA-V4 được dựng lại từ đầu để giải quyết 3 vấn đề của bộ tài liệu hiện tại:

1. `BA-V2` khá đầy về khung tài liệu nhưng mô hình nghiệp vụ lõi đã cũ so với định hướng mới.
2. `BA-V3` đã bổ sung nhiều ý đúng và gần vận hành hơn, nhưng vẫn còn rời rạc giữa BRD, gap audit, wireframe và codebase.
3. Code hiện tại chủ yếu là `frontend prototype` dùng `mockData`, chưa phản ánh được một hệ thống vận hành thật từ CRM đến thi công, kho, tài chính và bảo hành.

## Kết luận nhanh sau khi rà soát

| Hạng mục | Đánh giá ước lượng | Nhận định |
|---|---:|---|
| Độ đầy đủ của tài liệu BA hiện có | 62% | Có nhiều ý đúng nhưng chưa thống nhất mô hình dữ liệu và biên giới module |
| Mức phủ UI prototype so với BA-V3 | 69% | Nhiều màn hình đã có bản demo, nhưng phần lớn chưa có backend/workflow thật |
| Mức phủ logic nghiệp vụ trong code | 42% | Có một phần rule cục bộ trong UI, chưa có engine nghiệp vụ và lớp dịch vụ chuẩn |
| Mức sẵn sàng vận hành thật | 22% | Chưa đủ để go-live do thiếu dữ liệu thật, API, phân quyền, transaction, test và tích hợp |

Các tỷ lệ trên là ước lượng dựa trên:

- Toàn bộ `documents/BA-V2`
- `documents/BA-V3/BusinessRequirementsV3.md`
- `documents/BA-V3/GapAudit_CasualReasoning.md`
- `documents/BA-V3/Wireframes/*`
- Nguồn yêu cầu gốc `LAM-BAC-GROUP-Module.jpg`
- Codebase `src/` và `admin-app/`

## Quyết định kiến trúc của BA-V4

BA-V4 lấy 5 quyết định làm nền:

1. `Customer` không còn là đối tượng chạy Kanban. Kanban phải chạy trên `Service Request / Deal`.
2. Mỗi `Pipeline Stage` phải có thể cấu hình `playbook nhiệm vụ`, `người/phòng ban phụ trách`, `checklist`, `SLA`, `điều kiện vào/ra`.
3. Cần có `Task module` xuyên vai trò cho `PM`, `Supervisor`, `Worker`, thay vì chỉ có checklist thi công.
4. `Project` là entity vận hành được tạo ra sau khi chốt yêu cầu dịch vụ, không được trộn với lead CRM.
5. Cần một `ERD chuẩn` liên kết chặt giữa `Khách hàng`, `Yêu cầu dịch vụ`, `Báo giá`, `Hợp đồng`, `Dự án`, `Task`, `Kho`, `Tài chính`, `Bảo hành`.

## Cấu trúc tài liệu

```text
BA-V4/
├── 01-Business-Requirements/
│   ├── Current_State_Assessment_v4.md
│   ├── BRD_v4.md
│   └── Gap_Register_v4.md
├── 02-Technical-Design/
│   ├── ERD_v4.md
│   └── Module_Architecture_v4.md
├── 03-UI-UX-Design/
│   ├── Admin/
│   ├── PM/
│   ├── Supervisor/
│   ├── Worker/
│   ├── Accountant/
│   └── CustomerPortal/
├── 04-User-Documentation/
│   ├── Admin/
│   ├── PM/
│   ├── Supervisor/
│   ├── Worker/
│   ├── Accountant/
│   └── CustomerPortal/
├── 05-Development-Guides/
│   ├── Implementation_Plan_v4.md
│   └── Coverage_Matrix_v4.md
└── 06-Testing-Documentation/
    └── UAT_Backlog_v4.md
```

## Cách sử dụng bộ tài liệu này

- Nếu cần nhìn toàn cảnh hiện trạng, đọc `Current_State_Assessment_v4.md`.
- Nếu cần chốt phạm vi và business rule đích, đọc `BRD_v4.md`.
- Nếu cần biết chỗ nào đang thiếu/gãy, đọc `Gap_Register_v4.md`.
- Nếu cần khóa mô hình dữ liệu và ranh giới module, đọc `ERD_v4.md` và `Module_Architecture_v4.md`.
- Nếu cần lập kế hoạch xây dựng, đọc `Implementation_Plan_v4.md`.
- Nếu cần biết mức độ đáp ứng giữa tài liệu và code, đọc `Coverage_Matrix_v4.md`.

## Hướng áp dụng thực tế

Khuyến nghị không tiếp tục vá trực tiếp lên logic tài liệu cũ theo kiểu bổ sung lẻ tẻ. BA-V4 nên được xem là bộ baseline mới để:

- Dọn lại data model
- Hợp nhất navigation và role model
- Chia lại module ownership
- Lập backlog phát triển thật
- Chuẩn bị test/UAT/go-live

