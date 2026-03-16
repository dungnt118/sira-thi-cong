# PM Reference Audit - Đối chiếu V2/V3 và nâng chuẩn V4

## 1. Mục tiêu

File này dùng để trả lời 3 câu hỏi:

1. PM của `V2` đã có những gì đáng giữ?
2. PM của `V3` đã sửa đúng phần nào và còn giới hạn gì?
3. PM của `V4` cần nâng lên mức nào để không sơ sài hơn `V2/V3`?

## 2. Phạm vi nguồn tham chiếu

### 2.1 Nguồn đã dùng

- `documents/BA-V2/03-UI-UX-Design/PM/*`
- `documents/BA-V3/BusinessRequirementsV3.md`
- `documents/BA-V3/Wireframes/WF-08_TCK_PM_DanhSachDuAn.md`
- `documents/BA-V3/Wireframes/WF-12_TCK_PM_GiamSatRealtime.md`
- `documents/BA-V3/Wireframes/WF-ADD-06_PM_TaiChinh.md`
- prototype hiện có trong `src/pages/pm/*`

### 2.2 Ghi chú về V1

Trong repo hiện tại không có thư mục/tài liệu `BA-V1`, nên reference audit này lấy `V2` và `V3` làm baseline tham chiếu có thật.

## 3. Ma trận đối chiếu

| Nhóm | V2 | V3 | V4 cũ trước khi nâng cấp | Quyết định của V4 mới |
|---|---|---|---|---|
| PM Dashboard/Workbench | Khá đầy, có dashboard, báo cáo, quick actions | Có dashboard dự án realtime nhưng thiên thi công | Chỉ nêu tên màn ở mức tổng quát | Giữ dashboard/workbench, bổ sung inbox, bottleneck, mixed view `Service Request + Project` |
| CRM cho PM | Có customer, contract, project create | Mạnh hơn ở CRM/pipeline/khảo sát/báo giá | Có nhắc nhưng chưa đủ flow và rule | Dùng `Service Request-first`, vẫn giữ customer hub và contract workspace |
| Project orchestration | Có project list/detail/create | Có danh sách dự án và giám sát realtime | Chưa mô tả đủ task board và work package | Bổ sung `Project Workbench`, `Task Board`, `Task Package Detail`, `handoff` |
| Team nội bộ | V2 có `Team Management` và `Labor Planning` | V3 gần như giản lược do internal-first và PM kiêm giám sát | Bị thiếu gần như hoàn toàn | Bắt buộc phục hồi và nâng cấp thành `Workforce Management` |
| Nhà thầu liên kết/outsource | V2 có `Outsource Management` khá rõ | V3 defer do first stage nội bộ | Bị bỏ trống khỏi PM V4 | Thiết kế lại đầy đủ ở mức tài liệu, rollout có thể phase sau |
| Vật tư/nhân công | V2 có material/labor planning | V3 có inventory và PM finance view | V4 cũ chỉ nhắc material plan rất mỏng | Bổ sung planning theo project/task/package và variance |
| Review bằng chứng | V2 có evidence gallery | V3 rất mạnh ở realtime/checklist/review ảnh | V4 cũ chỉ nêu chung chung | Giữ phần mạnh của V3, gắn với task/evidence queue/escalation |
| Tài chính PM | V2 có milestone, financial tab, reports | V3 có PM tài chính giản lược | V4 cũ chưa mô tả ranh giới quyền | Bổ sung `PM Finance Snapshot` và boundary với Kế toán |
| Portal | V2 có generate link | V3 defer ở first stage | V4 cũ chỉ nhắc portal publish | Giữ trong V4 vì đã quay lại baseline hậu mãi/portal |
| Nghiệm thu/bảo hành | V2 còn mỏng, V3 có bảo hành điện tử | V3 chưa đủ maintenance close loop | V4 cũ chưa chi tiết theo PM | Bổ sung PM oversight cho acceptance, portal, warranty case |
| Reports/Notifications | V2 có reports, activity log, notifications | V3 nêu ở mức chức năng | V4 cũ hầu như không có mô tả riêng | Phục hồi lại như năng lực bắt buộc của workbench PM |

## 4. Những gì nên giữ từ V2

- độ đầy của `screen inventory`
- các chuyên mục `Team Management`, `Outsource Management`, `Material Planning`, `Labor Planning`
- góc nhìn PM như một role điều hành chứ không chỉ bấm xem checklist
- activity log, notifications và report center

## 5. Những gì nên giữ từ V3

- tư duy `CRM-first`
- `Service Request`, `Pipeline`, `Survey`, `Quotation`
- checklist thi công và review bằng chứng theo realtime
- phân ranh `PM` với `Kế toán`

## 6. Những gì cần sửa so với cả V2 và V3

- không dùng lại giả định `Kỹ thuật có account trực tiếp`
- không để `PM kiêm Giám sát` như giả định first-stage cá»§a V3
- không để outsource bị biến mất khỏi tài liệu chỉ vì rollout phase đầu ưu tiên internal
- không chia PM thành nhiều cụm màn rời rạc giữa các module

## 7. Kết luận bắt buộc cho V4

PM của V4 phải bao phủ ít nhất 11 năng lực:

1. PM workbench
2. CRM và pipeline
3. Survey và quotation
4. Contract và conversion
5. Project workbench
6. Task orchestration
7. Workforce nội bộ
8. Partner/outsource
9. Material/labor planning
10. Finance/acceptance/portal/warranty oversight
11. Reports/notifications/audit

Nếu thiếu một trong các năng lực trên, tài liệu PM của V4 vẫn chưa đạt mức hoàn chỉnh hơn `V2/V3`.
