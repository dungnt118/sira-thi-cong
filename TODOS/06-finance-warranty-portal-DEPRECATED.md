# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 06 - Finance, Warranty and Portal

Priority: P2

Muc tieu
- Dong vong doi tai chinh sau hop dong, hau mai bao hanh va giao tiep portal khach hang theo dung logic frontend hien tai.
- Chi tao/update schema co bang chung ro trong codebase; khong mo rong theo BA legacy neu chua thay UI/service su dung.

Codebase-first scope da chot
- Create PaymentMilestone
- Create WarrantyCard
- Create WarrantyReminder
- Create PortalThread
- Create PortalMessage
- Update IncidentReport de dung duoc cho warranty / maintain flow hau mai
- Update Journey de bo sung cac summary field payment / portal dang duoc frontend doc

Khong dua vao scope hien tai
- PortalPublication: frontend khong co entity doc lap, du lieu cong bo dang suy ra tu JourneyTemplate.steps.publish_flag + Journey.current_step_code
- PaymentTransaction, ReceivableLedger, PayableLedger, ProjectCostEntry, CashBookEntry, RetentionEntry, AftersalesBilling: chua thay type/page/mock data du manh
- AcceptanceRecord: nghiem thu dang thuoc wave field execution / project closeout, khong phai entity doc lap co bang chung manh trong Group 06
- MaintenanceVisit, AftersalesCost: chi co dau vet nghiep vu nhe, chua du bang chung de tach schema rieng

Quan he chinh du kien
- PaymentMilestone.journey_id -> Journey
- PaymentMilestone.project_id -> Project
- PaymentMilestone.quotation_id -> Quotation
- WarrantyCard.journey_id -> Journey
- WarrantyCard.project_id -> Project
- WarrantyReminder.warranty_card_id -> WarrantyCard
- PortalThread.journey_id -> Journey
- PortalMessage.thread_id -> PortalThread
- IncidentReport.journey_id -> Journey
- IncidentReport.project_id -> Project

Slices MCP
1. Payment milestones + Journey payment summary
2. Warranty card + reminder + IncidentReport bridge cho aftersales
3. Portal thread/message + Journey portal summary

Done when
- Theo doi duoc cac dot thanh toan theo milestone tren backend
- Co the cap the bao hanh va nhac bao hanh co ban
- Co the luu thread/message portal theo journey
- Khong tao them cac schema ledger/publication suy doan khi frontend chua dung
