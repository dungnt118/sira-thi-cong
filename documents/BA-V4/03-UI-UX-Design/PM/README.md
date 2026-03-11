# PM Role - Bộ tài liệu chuyên sâu V4

## Mục tiêu vai trò

PM trong BA-V4 không chỉ là người "quản lý dự án thi công", mà là owner xuyên suốt chuỗi:

`Customer/Service Request -> Survey -> Quotation -> Contract -> Project -> Task -> Workforce -> Material/Labor Plan -> Evidence Review -> Acceptance -> Portal -> Warranty Follow-up`

## Bộ tài liệu PM trong V4

| File | Mục đích |
|---|---|
| `PM_Reference_Audit_v4.md` | Đối chiếu PM của V2/V3 với V4 để khóa phạm vi hợp lý hơn |
| `FDD_PM_v4.md` | Tài liệu chức năng chi tiết cho PM |
| `Screen_Inventory_PM_v4.md` | Danh mục màn hình, route, mục tiêu và mức ưu tiên |
| `User_Flows_PM_v4.md` | Các flow PM cốt lõi theo end-to-end nghiệp vụ |
| `Workforce_Partner_Management_PM_v4.md` | Chuyên đề quản lý đội nội bộ và nhà thầu liên kết |

## Những điểm được nâng cấp rõ so với README cũ

- không chỉ mô tả vai trò, mà liệt kê rõ `màn hình`, `tính năng`, `flow`, `ràng buộc nghiệp vụ`
- bổ sung trục `quản lý đội nội bộ`, `worker profile`, `nhà thầu liên kết/outsource`
- phân biệt rõ:
  - `PM workbench`
  - `CRM cho PM`
  - `Vận hành nội bộ`
  - `quản trị nguồn lực`
  - `tài chính ở mức PM được phép xem`
- đối chiếu được với:
  - tài liệu PM ở `BA-V2`
  - wireframe và BR ở `BA-V3`
  - prototype hiện có trong `src/pages/pm`

## Nguyên tắc thiết kế riêng cho PM ở V4

1. PM phải có một `workbench thống nhất`, không bị chia cắt giữa CRM, Construction, Inventory, Finance.
2. PM phải nhìn được đồng thời `Service Request` và `Project`, nhưng không được trộn lẫn hai entity này.
3. PM phải quản lý được cả `đội nội bộ` và `đối tác liên kết`, kể cả khi rollout thực tế ưu tiên internal first.
4. PM phải thao tác qua `Giám sát` và `worker profile`, không giả định worker có account trá»±c tiếp.
5. PM phải theo dõi được `financial impact` và `aftersales impact`, nhưng có ranh giới quyền rõ với Kế toán.

## Kết luận

Trục PM trong V4 từ đây phải được xem là một gói tài liệu hoàn chỉnh, đủ để team BA/UX/dev bám vào xây tiếp. Nếu thiếu một màn, một flow hay một rule ở PM, mặc định xem là chưa đủ ready for implementation.
