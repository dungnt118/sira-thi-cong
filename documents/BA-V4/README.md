# BA-V4 - Bộ tài liệu tái cấu trúc BAC Group

## Mục tiêu của BA-V4

BA-V4 được dựng lại từ đầu để giải quyết 3 vấn đề của bộ tài liệu hiện tại:

1. `BA-V2` khá đầy về khung tài liệu nhưng mô hình nghiệp vụ lõi đã cũ so với định hướng mới.
2. `BA-V3` đã bổ sung nhiều ý đúng và gần vận hành hơn, nhưng vẫn còn rời rạc giữa BRD, gap audit, wireframe và codebase.
3. Code hiện tại chủ yếu là `frontend prototype` dùng `mockData`, chưa phản ánh được một hệ thống vận hành thật từ CRM đến thi công, kho, tài chính và bảo hành.

## Kết luận nhanh sau khi rà soát

| Hạng mục | Đánh giá ước lượng | Nhận định |
|---|---:|---|
| Độ đầy đủ của tài liệu BA hiện có | 81% | BA-V4 đã gom được baseline khá đầy đủ hơn trước |
| Mức phủ UI prototype so với nhu cầu | 76% | Nhiều màn hình đã có bản demo, nhưng còn lệch ở actor model và workflow |
| Mức phủ logic nghiệp vụ trong code | 42% | Có một phần rule cục bộ trong UI, chưa có engine nghiệp vụ và lớp dịch vụ chuẩn |
| Mức sẵn sàng vận hành thật | 22% | Chưa đủ để go-live do thiếu dữ liệu thật, API, phân quyền, transaction, test và tích hợp |

Các tỷ lệ trên là ước lượng dựa trên:

- toàn bộ `documents/BA-V2`
- `documents/BA-V3/BusinessRequirementsV3.md`
- `documents/BA-V3/GapAudit_CasualReasoning.md`
- `documents/BA-V3/Wireframes/*`
- nguồn yêu cầu gốc `LAM-BAC-GROUP-Module.jpg`
- codebase `src/` và `admin-app/`

## Quyết định kiến trúc của BA-V4

BA-V4 lấy 10 quyết định làm nền:

1. `Customer` không còn là đối tượng chạy Kanban. Kanban phải chạy trên `Service Request / Deal`.
2. Hệ thống phải hỗ trợ cả hai hướng nhập liệu: `Customer -> Service Request` và `Service Request -> auto-create Customer`.
3. Mỗi `Pipeline Stage` phải cấu hình được `playbook nhiệm vụ`, `người/phòng ban phụ trách`, `checklist`, `SLA`, `điều kiện vào/ra`.
4. `Giám sát` là actor số hiện trường ở giai đoạn hiện tại; `Kỹ thuật` được quản lý qua `kỹ thuật profile`.
5. Cần một `ERD chuẩn` liên kết chặt giữa `Khách hàng`, `Yêu cầu dịch vụ`, `Báo giá`, `Hợp đồng`, `Dự án`, `Task`, `Kho`, `Tài chính`, `Bảo hành`.
6. Quản lý file phải theo hướng metadata tập trung trong hệ thống và đồng bộ cloud qua `Google Drive`.
7. `Admin` không đồng nhất với `HanhChinh`; `Sale` cũng không nên bị gộp hoàn toàn vào `PM`.
8. `Quản lý mẫu tài liệu` và `Chữ ký điện tử` là capability nền, không phải tiện ích phụ.
9. `Dự toán nội bộ`, `Go/No-Go` và `Báo giá khách hàng` phải tách lớp dữ liệu.
10. `Portal Chat/Evidence` là kênh giao tiếp chính thức với khách hàng, không chỉ là tính năng phụ.

## Cấu trúc tài liệu

```text
BA-V4/
├── 01-Business-Requirements/
│   ├── Current_State_Assessment_v4.md
│   ├── BRD_v4.md
│   ├── Gap_Register_v4.md
│   ├── Original_Requirements_Audit_v4.md
│   ├── Customer_Journey_Sale_HanhChinh_Analysis_v4.md
│   ├── Document_Template_Electronic_Signature_v4.md
│   ├── Preconstruction_Estimation_and_Quotation_v4.md
│   ├── Go_NoGo_Decision_Control_v4.md
│   ├── Asset_Consumable_Recovery_v4.md
│   ├── Customer_Portal_Communication_Evidence_v4.md
│   └── Warranty_Finance_Lifecycle_v4.md
├── 02-Technical-Design/
│   ├── ERD_v4.md
│   ├── Module_Architecture_v4.md
│   └── File_Storage_GoogleDrive_Strategy_v4.md
├── 03-UI-UX-Design/
│   ├── Admin/
│   ├── Sale/
│   ├── HanhChinh/
│   ├── PM/
│   ├── GiamSat/
│   ├── Kỹ thuật/
│   ├── Accountant/
│   └── CustomerPortal/
├── 04-User-Documentation/
│   ├── Admin/
│   ├── Sale/
│   ├── HanhChinh/
│   ├── PM/
│   ├── GiamSat/
│   ├── Kỹ thuật/
│   ├── Accountant/
│   └── CustomerPortal/
├── 05-Development-Guides/
│   ├── Implementation_Plan_v4.md
│   ├── Build_Status_Summary_v4.md
│   └── Coverage_Matrix_v4.md
└── 06-Testing-Documentation/
    └── UAT_Backlog_v4.md
```

## Cách sử dụng bộ tài liệu này

Lưu ý:

- Folder `Kỹ thuật/` vẫn được giữ để quản lý blueprint nghiệp vụ cho lực lượng thi công và cho phase sau, nhưng ở giai đoạn hiện tại hệ thống chưa cấp tài khoản đăng nhập trực tiếp cho Kỹ thuật; `Giám sát` là actor thao tác trên phần mềm thay mặt Kỹ thuật.
- Folder `Admin/` là quản trị hệ thống. Folder `HanhChinh/` là vận hành hồ sơ nghiệp vụ. Hai vai trò này không nên trộn lẫn.
- Folder `Sale/` là vai trò front-office theo workbook hành trình khách hàng; không nên tiếp tục coi toàn bộ phần này chỉ là nhánh phụ của `PM`.

- Nếu cần nhìn toàn cảnh hiện trạng, đọc `Current_State_Assessment_v4.md`.
- Nếu cần chốt phạm vi và business rule đích, đọc `BRD_v4.md`.
- Nếu cần biết chỗ nào đang thiếu/gãy, đọc `Gap_Register_v4.md`.
- Nếu cần đối chiếu lại với dossier, báo cáo doanh thu, hợp đồng, chứng từ và tài liệu vận hành gốc, đọc `Original_Requirements_Audit_v4.md`.
- Nếu cần khóa mô hình dữ liệu và ranh giới module, đọc `ERD_v4.md` và `Module_Architecture_v4.md`.
- Nếu cần đi sâu vào quản lý file, cloud sync và Google Drive, đọc `File_Storage_GoogleDrive_Strategy_v4.md`.
- Nếu cần đóng vòng đời bảo hành/bảo trì gắn với tài chính, đọc `Warranty_Finance_Lifecycle_v4.md`.
- Nếu cần phân tích riêng luồng `Sale` và `HanhChinh` theo workbook gốc, đọc `Customer_Journey_Sale_HanhChinh_Analysis_v4.md`.
- Nếu cần chốt capability `Quản lý mẫu tài liệu` và `Chữ ký điện tử`, đọc `Document_Template_Electronic_Signature_v4.md`.
- Nếu cần chốt riêng `dự toán nội bộ`, `go/no-go` và `báo giá khách hàng`, đọc `Preconstruction_Estimation_and_Quotation_v4.md` và `Go_NoGo_Decision_Control_v4.md`.
- Nếu cần khóa quy trình `tài sản thi công`, `vật tư tiêu hao`, `phần dư hoàn nhập`, đọc `Asset_Consumable_Recovery_v4.md`.
- Nếu cần thiết kế `portal chat` như bằng chứng giao tiếp, đọc `Customer_Portal_Communication_Evidence_v4.md`.
- Nếu cần lập kế hoạch xây dựng, đọc `Implementation_Plan_v4.md`.
- Nếu cần một file chốt nhanh các nội dung đã khóa, đã xây và còn thiếu, đọc `Build_Status_Summary_v4.md`.
- Nếu cần biết mức độ đáp ứng giữa tài liệu và code, đọc `Coverage_Matrix_v4.md`.

## Hướng áp dụng thực tế

Khuyến nghị không tiếp tục vá trực tiếp lên logic tài liệu cũ theo kiểu bổ sung lẻ tẻ. BA-V4 nên được xem là bộ baseline mới để:

- dọn lại data model
- hợp nhất navigation và role model
- chia lại module ownership
- lập backlog phát triển thật
- chuẩn bị test/UAT/go-live
