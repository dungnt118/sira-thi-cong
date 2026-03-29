# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 07 - PORTAL DOCUMENTS, EMBEDDED SIGNATURES, REPORTING REUSE

## PHAN 1: SO SANH GAP (Codebase vs Current Schema)

| Thuoc tinh / Flow | Yeu cau codebase hien tai | Schema hien tai | Gap/Issue | Priority |
|------------|-----------|-----------------|-----------|----------|
| Portal document listing | PortalDocuments.tsx hien danh sach tai lieu/hinh anh cong bo theo file_name, file_type, published_context, published_at | Backend search document tra rong; search file khong tim thay business schema phu hop | Thieu entity business nhe de gan file vao Journey va context cong bo | High |
| Journey document summary | PortalDashboard.tsx doc journey.document_count; mock journeyMockData.ts co them missing_document_count, published_step_count | Schema Journey hien da co portal_token, thread_count, milestone_count nhung chua thay 3 field tong hop document nay | Can bo sung field tong hop de portal dashboard bo fallback mock | High |
| Publish logic | journey.ts va PortalDashboard.tsx deu cho thay publish la derived tu JourneyTemplate.steps.publish_flag + Journey.current_step_code | Backend da co JourneyTemplate / Journey, khong can entity publication doc lap | Khong nen tao PublishedLink hay PortalPublication | Low |
| Embedded signatures | SignaturePad.tsx tao Base64 data URL; SurveyRecord co giam_sat_signature, customer_signature; Group 05 da luu nested signatureDataUrl tren stock/asset flows | Schema hien tai da dung model embedded signatures cho cac flow thuc te | Khong co gap nao buoc phai tao SignatureEnvelope, SignatureParticipant, SignatureEvent | Low |
| Print / PDF template | Frontend co nut export/print va mock pdf_url; stock order dang in/PDF tai client | Backend da co schema PrintTemplate | Nen tai su dung ha tang san co, khong tao DocumentTemplate / TemplateVersion moi | Medium |
| Reporting dashboard config | PMReports/index.tsx tinh KPI/summary inline va co nut Excel, PDF, Print | Backend da co ReportDashboard va ReportPanel | Nen reuse dashboard/report infra, chua can ReportSnapshot, KpiDefinition, KpiSnapshot | Medium |
| Dossier / sync monitoring | Plan cu de xuat DossierChecklist, SyncFailureLog | Codebase hien tai chua co page/type/mock data du manh cho 2 flow nay | Model suy doan, khong nen tao trong wave nay | Low |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Thuoc tinh 1: PortalDocument
- name: PortalDocument
- label: Tai lieu portal
- Muc dich: luu lien ket file + metadata cong bo cho customer portal, khong kiem nhiem document lifecycle engine
- Thuoc tinh chinh:
  - journey_id: ObjectId -> Journey
  - journey_code: Text
  - context_type: Text + Dropdown = survey | quotation | contract | progress | payment | general
  - published_context: Text
  - file_name: Text
  - file_type: Text + Dropdown = pdf | doc | image | other
  - files: FileUploads
  - thumbnail_url: Text
  - published_at: DateTime
  - sort_order: Number
  - is_visible: Boolean
- form_group goi y:
  - Thong Tin Cong Bo
  - Tap Tin

### Thuoc tinh 2: Journey document summary (update schema Journey)
- Can bo sung:
  - document_count: Number
  - missing_document_count: Number
  - published_step_count: Number
- Muc dich: giu dashboard portal va tong quan hanh trinh dong bo voi UI hien tai

### Thuoc tinh 3: Print/PDF reuse
- Khong tao schema moi
- Reuse: PrintTemplate
- Muc dich: uu tien mo rong tren PrintTemplate neu can server-side generation

### Thuoc tinh 4: Embedded signatures
- Khong tao schema moi
- Reuse pattern hien tai: SurveyRecord.giam_sat_signature, SurveyRecord.customer_signature, nested signatureDataUrl tren stock/asset flows

### Thuoc tinh 5: Reporting reuse
- Khong tao schema moi
- Reuse: ReportDashboard, ReportPanel
- Muc dich: chua mo rong sang persisted KPI snapshot

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Group 07 - Portal Documents / Reporting Reuse             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                             â”‚
â”‚  â”Œâ”€ PortalDocument â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚  [Journey]        [chon hanh trinh..............]     â”‚ â”‚
â”‚  â”‚  [Context Type]   [quotation v]  [Visible] [x]        â”‚ â”‚
â”‚  â”‚  [Published Ctx]  [Bao gia lan 1..................]    â”‚ â”‚
â”‚  â”‚  [File Name]      [BG-2026-001.pdf...............]     â”‚ â”‚
â”‚  â”‚  [File Type]      [pdf v]       [Published At] [..]    â”‚ â”‚
â”‚  â”‚  [Files]          [upload..........................]   â”‚ â”‚
â”‚  â”‚  [Thumbnail URL]  [optional........................]   â”‚ â”‚
â”‚  â”‚  [Sort Order]     [10]                                â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                                             â”‚
â”‚  â”Œâ”€ Journey Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚  [Document Count] [3]                                 â”‚ â”‚
â”‚  â”‚  [Missing Docs]   [2]                                 â”‚ â”‚
â”‚  â”‚  [Published Steps][4]                                 â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                                             â”‚
â”‚  Quyet dinh modeling:                                       â”‚
â”‚  - Reuse PrintTemplate cho print/PDF                        â”‚
â”‚  - Reuse ReportDashboard / ReportPanel cho dashboard        â”‚
â”‚  - Khong tao SignatureEnvelope / KpiSnapshot stack          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
``` 
