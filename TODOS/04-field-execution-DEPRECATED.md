# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 04 - Field Execution

Priority: P1

Muc tieu
- Bam sat logic codebase hien tai truoc: supervisor workflow dang Journey-centric voi work_steps, evidences va incident.
- Bo sung schema theo kieu bridge-compatible de khong gay UI hien tai va van mo duong cho Project/ProjectTask o Group 03.

Nen codebase/backend can tai su dung va doi chieu ky
- Journey
- ChecklistTemplate
- IncidentReport
- ActivityEvent
- Project
- ProjectTask
- StagePlaybook

Pham vi gap-only uu tien theo codebase hien tai
- Update Journey de co lop execution hien truong phu hop work_steps cua frontend
- Update ChecklistTemplate de co nested steps dung voi ChecklistTemplate.steps[]
- Update IncidentReport de giu duoc journey-first va bo sung project/task bridge
- Update ActivityEvent de giu duoc journey-first va bo sung project/task bridge
- Create SiteReport theo flow mock construct report hien tai (journey-first, project/task optional bridge)
- Defer viec tach TaskChecklist / TaskChecklistStep / EvidenceRecord / EvidenceReview thanh schema rieng cho pha sau khi frontend roi khoi Journey.work_steps

Quan he chinh uu tien
- Journey.template_id -> JourneyTemplate
- Journey.customer_id -> Customer
- IncidentReport.journey_id -> Journey
- IncidentReport.project_id -> Project (optional bridge)
- IncidentReport.project_task_id -> ProjectTask (optional bridge)
- ActivityEvent.journey_id -> Journey
- ActivityEvent.project_id -> Project (optional bridge)
- ActivityEvent.project_task_id -> ProjectTask (optional bridge)
- SiteReport.journey_id -> Journey
- SiteReport.project_id -> Project (optional bridge)
- SiteReport.project_task_id -> ProjectTask (optional bridge)

Slices MCP
1. Bridge execution on Journey + ChecklistTemplate steps
2. Incident + Activity bridge fields
3. SiteReport va acceptance scope review

Done when
- Frontend hien tai co the map duoc checklist/evidence/incident/site report ma khong doi aggregate chinh khoi Journey.
- Backend mo duong cho Project/ProjectTask bang optional bridge fields thay vi cat dut journey-first flow.
- Group 04 khong ep codebase chuyen sang model moi khi UI hien tai chua su dung.
