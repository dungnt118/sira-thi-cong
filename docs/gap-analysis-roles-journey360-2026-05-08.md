# Gap Analysis & Roadmap — Vai trò người dùng và Journey360

Ngày rà soát: 2026-05-08
Branch: `feature/detail-journey`
Phạm vi: Toàn bộ kiến trúc nghiệp vụ FE (`src/pages`, `src/layouts`, `src/services/core-contracts/types`) và Journey Detail 360 (`src/pages/shared/Journeys/JourneyDetail360.tsx`).

> Tài liệu này tổng hợp lại các gap **bám sát trạng thái code thực tế**, đối chiếu với `documents/BA-V4/01-Business-Requirements/Gap_Register_v4.md` (28 GAP) và các gap-log đã có trong `docs/`. Mục tiêu là chuyển các phát hiện thành kế hoạch thực thi tiếp theo.

---

## 1. Bản đồ vai trò và trạng thái module hiện tại

| Mã vai trò | Layout | Prefix route | Module đã có | Trạng thái thực thi |
|---|---|---|---|---|
| `QL` (PM/Quản lý) | `PMLayout` | `/admin/ql/*` | Journey list/board/detail, CRM (customers, service-requests, pipeline, quotation), Construction, Inventory (catalog, plan, stock-out, history, order), Assets, Finance (project finance, payment-requests, milestones), Teams (workers, groups, prices, outsource), Reports, Settings (journey, estimate templates, pricing, journey-estimates), Master Data | Đầy đủ nhất, nhưng **bị phân mảnh giữa CRM ↔ Construction ↔ Journey** (ba IA song song) |
| `KD` (Kinh doanh/Sale) | `SaleLayout` | `/admin/kd/*` | Inbox, SLA Queue, Surveys, Communications, Customers, JourneyContext, Sale Survey Detail, Inventory stock-out, Assets allocation, Payment Requests | Thiếu **Quotation**, follow-up board, hoa hồng/incentive; có mâu thuẫn quyền (KD có route `inventory/stock-out` & `assets/allocation` — không thuộc nghiệp vụ KD) |
| `GS` (Giám sát) | `GiamSatLayout` | `/admin/gs/*` | Dashboard, Projects (Journey list), Checklist, Evidence Upload, Incident Report, Material Receipt, Project Diary, Journey Detail, Inventory in/out/history/order, Asset allocation, Payment Requests | Thiếu **đề xuất nhập kho** chính thức, không có lịch bảo trì/bảo hành hiện trường, không có safety dashboard |
| `KT` (Kế toán) | `AccountantV3Layout` | `/admin/kt/*` | Overview, Inventory dashboard/distributors/in/out/history, Assets list/allocation/maintenance, Finance milestones, Expenditures (PR/company-bank/beneficiary), Journey Detail | **Warranty Cards & Schedule = `ComingSoon`**, **Reports = `ComingSoon`**, **Finance report = `ComingSoon`**, không có P&L dự án, không có debt collection thật, không có duyệt-tiếp-tục cho đề xuất nhập/chi |
| `KYT` (Kỹ thuật) | `KyThuatLayout` | `/admin/kyt/*` | Dashboard, Schedule, Survey form, Execution, Journey detail, Inventory stock-out/history/order, Asset allocation, Payment Requests | **Mỏng nhất**: chỉ 4 màn nghiệp vụ; mâu thuẫn với BA-V4 (BA-V4 chốt 4 vai trò không có KYT) |
| `ADMIN` | `AdminLayoutV2` | `/admin/*` | Users, Roles, Audit, Reports, Settings, MasterData | OK, không có gap chức năng nội tại; chỉ vướng GAP-09 (admin-app riêng) |
| `Partner` | `PartnerLayout` | `/admin/partner/*` | Chỉ có `/profile`; menu khai báo 6 mục (`dashboard`, `my-projects`, `upload-evidence`, `materials`, `labor`, `payments`) **đều là menu chết** | Khung sườn rỗng |
| `Worker` / `Supervisor` (legacy) | `WorkerLayout`, `SupervisorLayout` | — | **Không được đăng ký trong `src/app/App.tsx`**; `pages/worker/WorkerHome.tsx` **không được import ở bất kỳ đâu**; `pages/supervisor/` rỗng | Code chết — cần dọn |

> Đối chiếu với `Phase1_Epic_Map.md` (BA-V4): Phase 1 chỉ tập trung 4 vai trò `PM / Sale / Giám sát / Customer Portal`. Việc còn `KYT`, `Partner`, `Worker`, `Supervisor` trong code là **di sản BA-V2/V3 cần quyết**: hoặc loại, hoặc hợp nhất vào `Giám sát` theo GAP-08.

---

## 2. GAP nhóm 1 — Thừa/thiếu tính năng theo từng vai trò

### 2.1. QL (PM/Quản lý)

| ID gap | Mô tả | Mức ảnh hưởng | Liên quan Gap_Register |
|---|---|---|---|
| ROLE-QL-01 | **Hai IA song song**: `/admin/ql/journeys/*` (mới) và `/admin/ql/construction/*` (cũ — có ProjectList, ProjectDetail, ProjectCreate, MaterialPlan, ProjectFinance, EvidenceQueue, PhotoApproval, TemplateChecklist) cùng tồn tại. PM không biết "công trình thật" nằm ở đâu. | High | GAP-10 |
| ROLE-QL-02 | Không có **Inbox duyệt đề xuất** (đề xuất nhập kho, đề xuất chi, đề xuất tăng chi phí, đề xuất change order) tập trung. PM phải tự rà từng module. | High | GAP-07, GAP-12, GAP-27 |
| ROLE-QL-03 | Không có **My Approvals / SLA cho duyệt** — Action Center hiện tại là task list, chưa phải approval hub. | High | GAP-19 |
| ROLE-QL-04 | Settings PM (`customer-journey`, `estimate-templates`, `pricing-policies`, `journey-estimates`) **không có quyền version & rollback**; mỗi lần publish ghi đè trực tiếp. | Medium | GAP-06 |
| ROLE-QL-05 | **Quản lý Đội/Thợ** (Teams, Workers) chưa nối với chấm công (`attendanceRecord`, `attendanceException`, `leaveRequest` đã có trong contract types nhưng không có UI). | High | — (mở rộng) |
| ROLE-QL-06 | Không có **bảng KPI sales pipeline** cho PM (conversion lead → quote → contract). Pipeline chỉ ở dạng Kanban CRM. | Medium | GAP-22 |

### 2.2. KD (Sale)

| ID gap | Mô tả | Mức ảnh hưởng | Liên quan Gap_Register |
|---|---|---|---|
| ROLE-KD-01 | **Quotation page chỉ tồn tại trong `/admin/ql/crm/*/quotation`** — KD không thể tự soạn báo giá. Trái ngược thực tế nghiệp vụ (Sale là người chốt báo giá). | Critical | GAP-02, GAP-06 |
| ROLE-KD-02 | KD có route `inventory/stock-out`, `assets/allocation` — **vượt quyền nghiệp vụ**; nếu không phải KD nội bộ vận hành kho, cần ẩn. | High | GAP-08 |
| ROLE-KD-03 | `CommunicationsCenter.tsx` là khung — không có data thật, không nối với `portalThread`/`portalMessage` schema đã có. | High | GAP-18 |
| ROLE-KD-04 | Không có **Follow-up board** (timeline lịch hẹn KD), chỉ có modal "Ghi follow-up" ở Journey detail (mock). | Medium | GAP-02 |
| ROLE-KD-05 | Không có **Hoa hồng / Incentive** — tài liệu BAO `2. QUY TRÌNH` có policy nhưng UI chưa thấy. | Medium | GAP-22 |
| ROLE-KD-06 | Không có Dashboard KPI cá nhân (tỷ lệ chuyển đổi, leak khách, SLA reply). | Medium | GAP-22 |

### 2.3. GS (Giám sát)

| ID gap | Mô tả | Mức ảnh hưởng | Liên quan Gap_Register |
|---|---|---|---|
| ROLE-GS-01 | Không có UI **đề xuất nhập kho** (Stock-In Request) cho GS. GS chỉ có form `MaterialReceipt` (xác nhận nhận hàng) và `InboundForm` (vốn dành KT). | Critical | GAP-12 |
| ROLE-GS-02 | Không có **lịch bảo dưỡng/bảo hành tại hiện trường**, dù có schema `warrantyVisit`, `maintenanceVisit`. | High | GAP-17 |
| ROLE-GS-03 | Không có **Safety / Incident dashboard** — chỉ có form tạo incident, không có queue/danh sách phân loại. | High | — (mở rộng) |
| ROLE-GS-04 | `ProjectDiary.tsx` là free-form, không nối với `siteReport` — nên 2 nguồn dữ liệu hiện trường song song. | Medium | GAP-20 |
| ROLE-GS-05 | Không có **Material Reservation** UI khi GS lập checklist; mọi đề xuất vật tư đều tạo qua MaterialPlan ở PM. | High | GAP-11 |

### 2.4. KT (Kế toán)

| ID gap | Mô tả | Mức ảnh hưởng | Liên quan Gap_Register |
|---|---|---|---|
| ROLE-KT-01 | **`/admin/kt/warranty/cards` & `/warranty/schedule` = `ComingSoon`** dù đã có schema `warrantyCard`, `warrantyCase`, `warrantyVisit`, `warrantyReminder`. | Critical | GAP-17 |
| ROLE-KT-02 | **`/admin/kt/finance/report` & `/admin/kt/reports` = `ComingSoon`**, không có P&L dự án, dòng tiền, công nợ phải thu/phải trả. | Critical | GAP-14, GAP-15, GAP-22 |
| ROLE-KT-03 | Không có **Approval Pipeline** cho `PaymentRequest` (KT đang mở chính `PaymentRequestList` shared, không có view "chờ duyệt / đã duyệt / từ chối / đã chi"). | Critical | GAP-26, GAP-27 |
| ROLE-KT-04 | Không có **Stock-In Approval Pipeline**: GS/PM tạo "đề xuất nhập kho" → KT duyệt → KT phát hành Inbound. Thiếu mắt xích "đề xuất". | Critical | GAP-12, GAP-13 |
| ROLE-KT-05 | Không có **Quỹ tiền mặt / Sổ quỹ** (cash book), không có **đối soát ngân hàng** dù schema `companyBankAccount` đã có. | High | GAP-27 |
| ROLE-KT-06 | Không có **Bảng lương thợ / công nhật** dù có `attendanceRecord`, `worker`, `laborPriceConfig`. | High | — (mở rộng) |
| ROLE-KT-07 | `salesInvoice` schema có nhưng không có UI tạo hoá đơn (xuất VAT). | High | GAP-26 |
| ROLE-KT-08 | Debt confirmation (`debtConfirmation`, `debtCollectionTask`) có schema nhưng không có UI. | High | GAP-14, GAP-26 |

### 2.5. KYT (Kỹ thuật)

| ID gap | Mô tả | Mức ảnh hưởng | Liên quan Gap_Register |
|---|---|---|---|
| ROLE-KYT-01 | **Mâu thuẫn role model V4**: BA-V4 chốt 4 vai trò (PM/Sale/Giám sát/Portal); KYT trong code là di sản. Cần **chốt deprecate hoặc giữ lại**. | Critical | GAP-08 |
| ROLE-KYT-02 | KYT chỉ có 4 màn (Dashboard, Schedule, SurveyForm, Execution); không có UI checklist nội bộ, không có WorkTask cá nhân, không có lịch bảo trì. | High | GAP-03 |
| ROLE-KYT-03 | KYT có truy cập `inventory/stock-out` nhưng không có **đề xuất nhập kho** (giống GS). | High | GAP-12 |

### 2.6. Partner

| ID gap | Mô tả | Mức ảnh hưởng |
|---|---|---|
| ROLE-PA-01 | 6/7 menu đều dẫn về route 404 (`/admin/partner/dashboard`, `my-projects`, `upload-evidence`, `materials`, `labor`, `payments`). Cần **roadmap rõ** hoặc **ẩn menu**. | High |
| ROLE-PA-02 | Không có entity `Partner` rõ trong contract types (chỉ có `worker`, `workerTeam`, `distributor`); cần thiết kế chính thức. | High |

### 2.7. Worker / Supervisor legacy

| ID gap | Mô tả | Mức ảnh hưởng |
|---|---|---|
| ROLE-DEAD-01 | `src/layouts/WorkerLayout/index.tsx`, `src/layouts/SupervisorLayout/index.tsx`, `src/pages/worker/WorkerHome.tsx`, `src/pages/supervisor/` đều **không được wire** trong `App.tsx`. | Medium — code chết |
| ROLE-DEAD-02 | `src/pages/worker/Checklist.tsx`, `EvidenceUpload.tsx`, `IncidentReport.tsx` được dùng lại bên trong `gs` routes — naming gây nhầm lẫn. | Medium |

---

## 3. GAP nhóm 2 — Tính năng chưa phát triển đồng bộ giữa các vai trò

Đây là các "process xuyên vai trò" mà mỗi role chỉ có một nửa miếng ghép → workflow không đóng vòng.

### 3.1. Đề xuất Nhập kho (Stock-In Request)

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| `GS` (đề xuất từ hiện trường) | ❌ Không có UI | Form đề xuất kèm checklist công trình |
| `KYT` (đề xuất khi khảo sát/thi công) | ❌ Không có UI | Tương tự GS |
| `QL/PM` (duyệt đề xuất) | ❌ Không có Inbox | Dashboard "đề xuất chờ duyệt" |
| `KT` (phát hành Inbound) | ✅ `InboundForm.tsx` | Nhận từ "đề xuất đã duyệt" → tạo phiếu nhập tự động |
| Distributor (đối soát) | ✅ `DistributorList.tsx` | OK |

**Schema hiện có**: `stockOrder.types.ts`, `stockRequest.types.ts` — sẵn entity nhưng UI mới triển khai phía KT.

### 3.2. Đề xuất Chi (Payment Request)

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| Mọi vai trò (`QL/KD/GS/KYT/KT`) | ✅ Cùng dùng `PaymentRequestList` shared | OK ở mức "danh sách" |
| `QL/PM` | ❌ Không có view "chờ tôi duyệt" | Dashboard duyệt theo tier (PM → KT → Giám đốc) |
| `KT` | ❌ Không có Approval Queue, không có "đã chi / chưa chi" filter | Pipeline 4 trạng thái + nối với Cash Book |
| `Giám đốc` | ❌ Vai trò này chưa có UI riêng | Approval > 1 ngưỡng tiền |

**Schema hiện có**: `paymentRequest.types.ts`, `paymentAdjustment.types.ts`, `paymentReceipt.types.ts`.

### 3.3. Phân công Công việc (WorkTask)

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| `QL/PM` | ✅ Modal "Giao việc" sinh WorkTask từ checklist setting | OK, nhưng chỉ tạo, không re-assign |
| `KD/GS/KYT` | ⚠️ Có thể đổi trạng thái task của step hiện tại nếu đúng `assignee_role` (gap-log 2026-04-12 đã ghi) | Cho phép **đề xuất task** ngược lại lên PM |
| Worker (thợ) | ❌ Không có entity worker login → không có UI nhận việc | Cần quyết: worker có login hay PM/GS thay mặt? |

### 3.4. Mốc Thanh toán & Thu tiền

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| `QL/PM` | ✅ Tạo `paymentMilestone` qua Step10 (mock) | Sinh tự động từ Contract |
| `KD` | ❌ Không thấy milestones của khách | Dashboard "đợt thu sắp tới" |
| `KT` | ⚠️ `PaymentDashboard.tsx` mới có demo | Nối với invoicing & receipt thực |
| `Customer (Portal)` | ⚠️ Có timeline nhưng không có "Thanh toán đợt này" CTA | Nối với cổng thanh toán |

### 3.5. Bảo hành / Bảo trì sau bàn giao

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| `KT` | ❌ ComingSoon | Phiếu BH, lịch nhắc |
| `GS` | ❌ Không có lịch hiện trường | Lịch khảo sát BH định kỳ |
| `KD` | ❌ Không có view "khách sắp hết BH" | Cross-sell trigger |
| `Customer Portal` | ⚠️ Step12 chỉ hiện mock incident | Form yêu cầu bảo hành |

### 3.6. Hồ sơ Khách hàng & Dossier

| Vai trò | Trạng thái hiện tại | Mong đợi |
|---|---|---|
| `QL/PM` | ⚠️ `JourneyDocumentsTab` có nhưng phẳng | Dossier theo lifecycle bucket (đang/hoàn thiện/bảo trì/không làm) — GAP-25 |
| Tất cả | ❌ Không có version, không có retention | File governance theo GAP-21 |

---

## 4. GAP Journey360 — Cấu trúc Contract & UX

### 4.1. Bộ Contract (Schema) — phát hiện chính

Đối chiếu `IJourney` (`journey.types.ts`) với UI:

| Nhóm gap | Phát hiện |
|---|---|
| **Enum lệch bước** | `JourneyCurrentStepEnum` có 12 mã (`lead_new`...`after_sales`) nhưng UI có 13 nhóm (`GRP_01_INFO`...`GRP_13_CARE` + `GRP_LABOR`, `GRP_MATERIALS`, `GRP_ESTIMATE`, `GRP_DOCUMENTS`). Các nhóm **GRP_LABOR/GRP_MATERIALS/GRP_ESTIMATE** không có `currentStepCode` tương ứng → khó dùng làm "current step" kết toán. Tương tự `GRP_07_DEPOSIT` không có mã `advance_deposit` (gap-log đã ghi). |
| **Hai bộ tab song song** | `JourneyDetail360.tsx` đang chứa **2 mảng tabs**: `tabItems` (legacy, định nghĩa từ dòng 1358–1450) và `stagedTabItems` (mới, dòng 1453–1572). Chỉ `stagedTabItems` được render (dòng 2310, 2398). `tabItems` là **dead code** ~90 dòng — cần xoá. |
| **Mock data còn nguyên** | Step06Contract dùng `mockContracts`; Step09Acceptance hardcode object literal; Step10Payment dùng `mockPayments`; Step11Maintain dùng `mockIncidents`; Step12Warranty dùng `mockIncidents`. Trong khi schema thật **đã có**: `quotation`, `quotationLineItem`, `paymentMilestone`, `paymentReceipt`, `handoverAcceptance`, `handoverIssue`, `warrantyCard`, `warrantyCase`, `warrantyVisit`, `incidentReport`. |
| **Permission theo "permissions"** | `permissionsAllowDocumentActions` chỉ check 3 giá trị `edit/submit/commit`. Không hỗ trợ `view/comment/sign` — không khớp với governance Portal. |
| **Two-source-of-truth** | `mockJourneyTemplates` (đọc từ `data/journeyMockData`) cấp `roleConfigurations` cho từng step **trong khi** `customerJourneySettingService` cấp setting động. Khi hai bộ này không khớp, UI ưu tiên `mock` (dòng 722). Cần loại mock template khỏi runtime. |
| **Header step config** | `HEADER_STEP_CONFIG` được import từ `JourneyHistoryModal` — **header ở module modal**, dễ vỡ phụ thuộc nếu modal bị refactor. |
| **Contract IJourney quá rộng** | 80+ field trên một aggregate. Các "summary" field (`outstanding_amount`, `collected_amount`, `next_milestone_due`, `milestone_count`, `missing_document_count`, `procurement_alert_count`, `stock_risk_summary`...) đang là **denormalised aggregates** không có job đảm bảo nhất quán → dễ stale. |
| **Thiếu Change Order entity** | Không có schema cho thay đổi phạm vi sau ký (GAP-07). Không thể nối UI. |
| **Thiếu Reservation entity** | Không có `materialReservation`/`stockReservation` → StepMaterials chỉ là plan, không khoá tồn kho (GAP-11). |

### 4.2. Trải nghiệm người dùng (UX) — phát hiện chính

| ID | UX gap | Ảnh hưởng |
|---|---|---|
| UX-J360-01 | **Header action thiên về QL**: chỉ QL có 5+ button (Giao việc, Tạo tài liệu, Sửa, Ưu tiên, Publish, Chat, History). KD có 3, role khác chỉ "Tạo tài liệu" + chat. KT/GS/KYT không có một CTA nghiệp vụ nào trên header (vd. "Đề nghị thanh toán đợt", "Đề xuất nhập kho", "Báo cáo tiến độ", "Yêu cầu bảo hành"). | High |
| UX-J360-02 | **Tab `Tạm ứng` (GRP_07_DEPOSIT)** không gắn với `current_step` riêng — ý nghĩa nghiệp vụ mơ hồ, gap-log đã đề nghị thêm `advance_deposit`. | Medium |
| UX-J360-03 | **Tab `Nhật ký` (GRP_08_CONSTRUCT)** luôn hiển thị (alwaysVisible) cho mọi vai trò, nhưng **edit chỉ khi `editableGroupCodes` chứa `GRP_08_CONSTRUCT`** — không phân biệt "xem nhật ký công khai" vs "ghi nhận tiến độ thực tế". | Medium |
| UX-J360-04 | **Tab `Tài liệu công trình` & `Bàn giao`** là 2 tab khác nhau nhưng đều dùng JourneyDocument; người dùng dễ nhầm. | Medium |
| UX-J360-05 | **Tab Báo giá (GRP_05_QUOTE)** không có versioning UI dù schema `quotation` có thể có version — không thấy lịch sử "v1 → v2 lý do XYZ" (GAP-06). | High |
| UX-J360-06 | **Step10 Payment** không thể tạo **Receipt thực** từ UI; không có nút "Ghi nhận thu/chuyển khoản". | High |
| UX-J360-07 | **Step09 Acceptance** không có **luồng ký số** thật, chỉ là mock; không nối `handoverAcceptance`. | Critical |
| UX-J360-08 | **Step11 Maintain & Step12 Warranty** không có CTA tạo phiếu, không nối `warrantyCard`/`warrantyCase`/`warrantyVisit`. | Critical |
| UX-J360-09 | **Drawer "Lộ trình"** (Steps drawer) chỉ render `HEADER_STEP_CONFIG` — không có `GRP_LABOR/GRP_MATERIALS/GRP_DOCUMENTS`. Người dùng mở drawer không thấy tab nhân công/vật tư đang ở đâu. | Medium |
| UX-J360-10 | **Chat drawer** dùng `ContentConversationPanel` với `schemaName="Journey"`. Không có **lọc thread theo step** — dài ngày sẽ trộn nhiều ngữ cảnh. | High |
| UX-J360-11 | **Estimate readiness alert** (Bổ sung dữ liệu dự toán) đẩy người dùng ra modal độc lập; nên là form inline trong tab `GRP_01_INFO` để "1 chỗ". | Low |
| UX-J360-12 | **Không có breadcrumb step**: người dùng đang ở `final_acceptance` nhưng vẫn thấy tab `Khảo sát` không bị disable — không có hint "đã đóng / chỉ xem". | Medium |
| UX-J360-13 | **Không có timeline rollup** một mặt: Step08Construct chỉ hiện site reports, **không thấy** transition step (lead → consult → survey → ...). Lịch sử `JourneyHistoryModal` là modal ẩn nút sau History icon. | Medium |
| UX-J360-14 | **WorkTask badge** trong header card chỉ hiện count current step. Không có **"My tasks on this journey"** filter — KYT/GS phải mở tab và xem hết list để tìm việc của mình. | High |
| UX-J360-15 | **Mobile dropdown tabs** (`stagedTabItems` map vào Dropdown) không cho **swipe hoặc back-button**; người dùng mobile mất ngữ cảnh khi chuyển tab. | Medium |
| UX-J360-16 | **Chuyển tab đổi `?tab=` qua searchParams** nhưng các step con (Step01–Step13) lại dispatch CustomEvent `switch-journey-tab` trở lại — workaround mong manh, dễ vỡ khi refactor (xem hook `useEffect` dòng 698). | Medium |
| UX-J360-17 | Thiếu tab **"Phát sinh / Change Order"** dù đó là pain point thật trong nghiệp vụ thi công. | High |
| UX-J360-18 | Thiếu tab **"P&L / Chi phí công trình"** ở Journey360 (đang ở route riêng `/admin/ql/finance/projects/:id` — không tích hợp). | High |
| UX-J360-19 | Thiếu tab **"Bảo trì lịch nhắc"** — Step11 chỉ là incident timeline. | High |
| UX-J360-20 | **`Publish Portal` modal**: chọn nội dung publish chỉ là 3 checkbox cứng (`Tổng quan`, `Timeline`, `Tài liệu`); không có per-document granular setting (GAP-18). | High |

### 4.3. Tính năng chưa phát triển trong Journey360 (nhưng có schema)

| Schema có sẵn | Chưa có UI trong Journey360 |
|---|---|
| `handoverAcceptance` | Step09 vẫn mock |
| `handoverIssue` | Không có form ghi nhận lỗi tại bàn giao |
| `projectCloseoutPackage` | Không có UI đóng dự án |
| `projectSettlement` | Không có UI thanh lý hợp đồng |
| `paymentMilestone` + `paymentReceipt` + `paymentAdjustment` | Step10 mock |
| `salesInvoice` | Không có nút xuất hoá đơn |
| `debtConfirmation`, `debtCollectionTask` | Không có tab công nợ |
| `warrantyCard`, `warrantyCase`, `warrantyVisit`, `warrantyReminder` | Step11/Step12 mock |
| `materialReceiptConfirmation` | Có ở GS riêng, chưa render trong Journey360 tab Vật tư |
| `materialStandard` | Step04Solution chưa nối |
| `quotationLineItem` versioning | Step05 chưa có |
| `surveyAppointment` + `surveyRecord` | Step03 nối được nhưng không hiện danh sách kết quả khảo sát (gap-log 2026-04-12 đã ghi) |
| `siteReport` | Step08 đã có (OK) |
| `incidentReport` | Step08 chưa link, Step12 dùng mock |
| `journeyEstimate` | Tab `GRP_ESTIMATE` (Step04SolutionOrchestration) chưa nối CRUD đầy đủ |
| `attendanceRecord`, `leaveRequest` | Tab Nhân công (StepLabor) chưa nối chấm công |

---

## 5. Kế hoạch triển khai đề xuất

> Sắp xếp theo **5 wave** ngắn — mỗi wave 1.5–2 tuần. Mỗi item có ID gap để track về phía Gap_Register V4.

### Wave 1 — Dọn nền & chốt role model (tuần 1–2)

| Task | Liên quan | Output |
|---|---|---|
| W1-01 | Xoá `tabItems` legacy trong `JourneyDetail360.tsx`; chỉ còn `stagedTabItems` | UX-J360 cleanup |
| W1-02 | Xoá code chết: `WorkerLayout`, `SupervisorLayout`, `WorkerHome.tsx`, `pages/supervisor/` rỗng | ROLE-DEAD-01/02 |
| W1-03 | Quyết định: deprecate `KYT` (gộp vào GS) **HOẶC** giữ lại; cập nhật `App.tsx` & `Auth.role` enum | GAP-08, ROLE-KYT-01 |
| W1-04 | Quyết định Partner: ẩn các menu chết hoặc tạo backlog rõ; tạo entity `Partner` | ROLE-PA-01/02 |
| W1-05 | Hợp nhất hai IA của QL: chốt `/admin/ql/journeys/*` là source-of-truth, đánh dấu `/admin/ql/construction/*` là legacy redirect | ROLE-QL-01, GAP-10 |
| W1-06 | Loại `mockJourneyTemplates` khỏi runtime, chỉ dùng `customerJourneySettingService` | UX-J360 contract |
| W1-07 | Bổ sung enum `advance_deposit` vào `JourneyCurrentStepEnum` HOẶC chốt tài liệu coi `Tạm ứng` là tab con của `contract` | UX-J360-02, gap-log |

### Wave 2 — Đóng vòng "Đề xuất → Duyệt → Thực thi" (tuần 3–4)

| Task | Liên quan | Output |
|---|---|---|
| W2-01 | Tạo entity `StockInRequest` (đề xuất nhập kho) — schema + UI cho GS/KYT/PM tạo, KT duyệt | 3.1, GAP-12 |
| W2-02 | UI Approval Pipeline cho `PaymentRequest`: 4 trạng thái + per-tier | 3.2, ROLE-KT-03 |
| W2-03 | PM "Approval Inbox" tổng hợp: `PaymentRequest`, `StockInRequest`, `WorkTask request`, `ChangeOrder request` | ROLE-QL-02/03, GAP-19 |
| W2-04 | Header action mới trong Journey360 cho KT/GS/KYT theo vai trò (Đề nghị thanh toán đợt, Đề xuất nhập kho, Báo cáo tiến độ, Yêu cầu bảo hành) | UX-J360-01 |
| W2-05 | Tab "My Tasks" trong Journey360 — filter `assignee = currentUser` | UX-J360-14 |

### Wave 3 — Số hoá Contract / Acceptance / Payment / Warranty thực (tuần 5–7)

| Task | Liên quan | Output |
|---|---|---|
| W3-01 | Step06Contract: bỏ `mockContracts`, nối service contract thật + version + e-sign placeholder | UX-J360-05, GAP-06 |
| W3-02 | Step09Acceptance: nối `handoverAcceptance` + `handoverIssue`; sinh tự động `WarrantyCard` khi acceptance pass | UX-J360-07, GAP-16 |
| W3-03 | Step10Payment: nối `paymentMilestone` + `paymentReceipt` + `paymentAdjustment`; CTA "Ghi nhận thu" | UX-J360-06, GAP-14, GAP-26 |
| W3-04 | Step11Maintain & Step12Warranty: nối `warrantyCard`/`warrantyCase`/`warrantyVisit`/`warrantyReminder`; bỏ mockIncidents | UX-J360-08, ROLE-KT-01, GAP-17 |
| W3-05 | Step13Care: nối CRM follow-up & cross-sell trigger | GAP-22 |
| W3-06 | KT Warranty Cards & Schedule pages (rời `ComingSoon`) | ROLE-KT-01 |

### Wave 4 — Tài chính dự án & báo cáo (tuần 8–9)

| Task | Liên quan | Output |
|---|---|---|
| W4-01 | Tab "P&L / Chi phí" trong Journey360 — kết hợp `projectFinance` + cost ledger mới | UX-J360-18, GAP-15, GAP-27 |
| W4-02 | Schema mới: `ProjectCostEntry`, `CashBookEntry` + UI KT | GAP-27 |
| W4-03 | KT Reports: P&L, dòng tiền, công nợ phải thu/phải trả | ROLE-KT-02, GAP-22 |
| W4-04 | Sales Invoice (`salesInvoice`) UI cho KT — xuất VAT | ROLE-KT-07 |
| W4-05 | Debt confirmation & collection UI | ROLE-KT-08, GAP-26 |

### Wave 5 — Phát sinh / Đổi phạm vi / Reservation / Governance (tuần 10–11)

| Task | Liên quan | Output |
|---|---|---|
| W5-01 | Schema mới `ChangeOrder` + tab "Phát sinh" trong Journey360 | UX-J360-17, GAP-07 |
| W5-02 | Schema mới `MaterialReservation` + UI khoá tồn kho theo task; cập nhật StepMaterials | ROLE-GS-05, GAP-11 |
| W5-03 | Publish Portal nâng cấp: per-document permission, tracking ai xem khi nào | UX-J360-20, GAP-18 |
| W5-04 | Chat per-step thread filter | UX-J360-10 |
| W5-05 | Notification engine + digest preference | GAP-19 |
| W5-06 | File governance: version, retention, drive sync (`FileAsset`, `FileSyncJob`, `DriveFolderMap`) | GAP-21 |
| W5-07 | Dossier model lifecycle bucket | GAP-25 |

### Backlog (vào sau)

- KD: Quotation page riêng, Follow-up board, Hoa hồng/Incentive (ROLE-KD-01/04/05)
- KD: Communications Center wire data thật (ROLE-KD-03, GAP-18)
- GS: Safety/Incident dashboard (ROLE-GS-03)
- GS: Lịch BH/BD hiện trường (ROLE-GS-02)
- QL: KPI Sales Pipeline cho PM (ROLE-QL-06)
- Admin: Hợp nhất `admin-app` & `admin-v2` (GAP-09)
- Toàn hệ thống: Audit log end-to-end (GAP-20)
- UAT/regression backlog (GAP-24)

---

## 6. Đề xuất theo dõi

1. Mỗi task trong Wave nên được mở `SystemIssue` (Feature/Gap) qua MCP backend để gắn với schema thay đổi tương ứng.
2. Mỗi lần Journey360 thêm 1 tab nghiệp vụ mới (vd. Phát sinh, P&L), bổ sung `JOURNEY_TAB_ACCESS_RULES` + cập nhật `STEP_PRIORITY_TABS` và `customerJourneySetting.steps[].roles[].permissions` đồng bộ.
3. Dọn `mock*` data khỏi `data/journeyMockData.ts` theo từng Wave; sau Wave 3 file này nên còn rất ít.
4. Sau Wave 1, cập nhật `Phase1_Epic_Map.md` và `Implementation_Roadmap_v1.md` để khớp với role model đã chốt.
5. Tài liệu này nên được **review song song** với `Gap_Register_v4.md` mỗi 2 tuần để cập nhật trạng thái GAP.
