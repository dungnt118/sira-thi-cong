# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

 # Nhom 07 - Portal Documents, Embedded Signatures, Reporting Reuse

Priority: P2

Muc tieu
- Chot pham vi Group 07 theo codebase-first, khong dung lai plan BA cu qua rong.
- Ho tro portal documents, print/PDF reuse, dashboard/report reuse va cac field tong hop con thieu tren Journey.
- Khong tao document engine, e-sign envelope hay KPI snapshot stack neu frontend hien tai chua dung.

Bang chung codebase chinh
- src/pages/public/portal/PortalDocuments.tsx: co UI danh sach tai lieu/hinh anh cong bo voi file_name, file_type, published_context, published_at.
- src/components/portal/PortalDashboard.tsx: doc publish_flag tu JourneyTemplate.steps[] va hien journey.document_count.
- src/components/common/SignaturePad.tsx: chu ky hien tai duoc luu duoi dang Base64 data URL.
- src/pages/pm/Reports/index.tsx: dashboard tong hop tinh toan inline; nut Excel, PDF, Print moi o muc UI/export.
- src/pages/accountant/Inventory/StockOrderDetail.tsx va src/pages/accountant/Assets/AssetAllocationDetail.tsx: PDF/print/signature dang la embedded flow, khong phai envelope workflow.

Ket luan pham vi
- Reuse schema ha tang BAC da co: PrintTemplate, ReportDashboard, ReportPanel.
- Chi xem xet bo sung toi thieu o lop business: PortalDocument va update Journey cho document summary.
- Khong tao trong wave nay: DocumentTemplate, TemplateVersion, DocumentRecord, DocumentAttachment, SignatureEnvelope, SignatureParticipant, SignatureEvent, DossierChecklist, PublishedLink, SyncFailureLog, ReportSnapshot, KpiDefinition, KpiSnapshot.

Schema / update du kien
- PortalDocument: journey_id, context_type, published_context, file_name, file_type, files, thumbnail_url, published_at, sort_order, is_visible.
- Journey update them: document_count, missing_document_count, published_step_count.

Slices MCP
1. Portal documents va Journey summary fields
2. Reuse PrintTemplate cho print/PDF thay vi tao document lifecycle moi
3. Reuse ReportDashboard / ReportPanel; chua tao KPI snapshot schema

Done when
- Portal co nguon du lieu tai lieu cong bo theo journey/context.
- Journey co du summary field de dashboard portal khong con phai fallback mock.
- Nhom report/print duoc chot theo huong reuse ha tang BAC san co, khong mo rong sang schema suy doan.
