# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 04 - FIELD EXECUTION (CODEBASE-FIRST)

## PHAN 1: SO SANH GAP (CURRENT CODEBASE vs Current Backend)

| Thuoc tinh | Codebase hien tai dang dung | Backend hien tai | Gap/Issue | Priority |
|------------|----------------------------|------------------|-----------|----------|
| Journey work_steps | Checklist page doc truc tiep Journey.work_steps voi status LOCKED, OPEN, IN_PROGRESS, AWAITING_REVIEW, APPROVED, REJECTED | Journey backend chua thay work_steps, chi co project_status | Thieu lop execution state trung tam dang duoc UI su dung | High |
| Embedded step evidences | EvidenceUpload gan anh/video vao tung step, co minPhotos, uploadedAt, uploadedBy, status, pmFeedback | Backend chua co work_steps.evidences hay schema map truc tiep | Neu tach schema qua som se gay mismatch voi UI hien tai | High |
| ChecklistTemplate.steps | mockTemplates va type ChecklistTemplate deu co steps[] | ChecklistTemplate backend chua co steps | Thieu template step structure dung voi codebase | High |
| Incident flow | UI IncidentReport dang chon project nhung type canonical van journey-centric | IncidentReport backend bat buoc journey_id va chua co project_id/project_task_id/title/status | Chua bridge duoc giua codebase hien tai va Project/ProjectTask moi | High |
| Activity log | Code co JourneyActivity/ActivityEvent gan voi journeyId | ActivityEvent backend bat buoc journey_id va chua co project/task bridge fields | Can mo rong schema cu, khong nen tao schema moi | Medium |
| Construct/site report | demoDataService dang seed CONSTRUCT_REPORTS, mock data dung journey_id, date, supervisor, content, progress_pct, images | Chua co SiteReport schema | Thieu entity cho nhat ky hien truong dang duoc mock | High |
| Acceptance step | Step09Acceptance dang la journey step view, chua co entity rieng | Chua co schema rieng | Khong nen ep tao AcceptanceDraft standalone neu code chua dung | Medium |
| ProjectTask-first normalization | Backend da co Project va ProjectTask tu Group 03 | Frontend hien tai chua doc checklist tu ProjectTask | Neu tao TaskChecklist ngay se vuot truoc codebase | High |

## PHAN 2: CHIEN LUOC THIET KE UU TIEN THEO CODEBASE

### A. UPDATE: Journey
- Y nghia: bo sung lop execution state dung voi aggregate ma frontend dang dung.
- De xuat bo sung cac field bridge sau:
- `supervisor_name`: Text/Input
- `progress_pct`: Number/Input
- `blocked_task_count`: Number/Input
- `work_steps`: Nested/Table, fullwidth
- `latest_site_report_at`: DateTime/DateTimePicker
- `acceptance_note`: Text/TextArea, fullwidth (neu can luu tam thong tin step 09 ma khong tach schema som)
- Nested `work_steps` de xuat: `step_id`, `template_step_id`, `order`, `name`, `description`, `min_photos`, `status`, `completed_at`, `completed_by`, `notes`, `evidences`.
- Nested `evidences` ben trong `work_steps`: `evidence_id`, `url`, `thumbnail_url`, `uploaded_at`, `uploaded_by`, `status`, `pm_feedback`.
- Status options cua `work_steps.status`: locked, open, in_progress, awaiting_review, approved, rejected.

### B. UPDATE: ChecklistTemplate
- Y nghia: dua backend ve dung cau truc ChecklistTemplate.steps[] ma code dang dung.
- Them nested `steps` gom: `step_code`, `step_order`, `step_name`, `description`, `min_photos`, `allow_video`, `is_required`.

### C. UPDATE: IncidentReport
- Y nghia: giu tuong thich journey-first nhung bridge sang project/task.
- Giu `journey_id` de code hien tai khong gay.
- Them: `project_id` -> Project, `project_task_id` -> ProjectTask, `title`, `status`, `priority`.
- Giu `type`, `severity`, `description`, `images`, `reported_by`, `pm_reply`, `is_resolved`, `resolved_at`.

### D. UPDATE: ActivityEvent
- Y nghia: tai su dung schema nhat ky chuan da co.
- Giu `journey_id` la field chinh o pha hien tai.
- Them bridge fields: `project_id`, `project_task_id`, `service_request_id`.
- Bo sung `related_entity_type` cho `site_report`, `incident_report`, `journey_step`, `project_task`.

### E. CREATE: SiteReport
- Y nghia: schema hoa mockConstructReports dang duoc seed trong demoDataService.
- Fields chinh: `journey_id` -> Journey (required), `project_id` -> Project (optional), `project_task_id` -> ProjectTask (optional), `report_date`, `supervisor_user`, `title`, `content`, `progress_pct`, `images`, `weather_note`, `issue_summary`, `next_action`.

### F. DEFER: TaskChecklist / TaskChecklistStep / EvidenceRecord / EvidenceReview
- Ly do: frontend hien tai chua dung cac entity nay.
- Neu tao ngay se can them API adapter hoac doi UI, de gay lech voi logic codebase dang chay.
- Chi nen tach khi checklist execution khong con nam trong Journey.work_steps nua.

### G. ACCEPTANCE SCOPE
- Step09Acceptance hien tai la mot journey step view voi du lieu gia lap, chua phai aggregate doc lap.
- Group 04 chi nen du tru field tam trong Journey hoac SiteReport neu can.
- Acceptance record/chung tu chinh thuc van de o Group 06.

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
+-----------------------------------------------------------+
|  Journey Field Execution Bridge                           |
+-----------------------------------------------------------+
| [Journey] [HT-2026-xxx]   [Supervisor] [___________]      |
| [Progress %] [__]         [Latest site report] [Date]     |
|                                                           |
| work_steps[]                                               |
| - #01 Kiem tra be mat   [open/in_progress/review]         |
|   notes: ____________________________________________     |
|   evidences[]: [img] [img] [video]                        |
|   pm_feedback: ______________________________________     |
|                                                           |
| Incident / Site Report Bridge                              |
| [journey_id] [required]  [project_id] [optional]          |
| [project_task_id] [optional]                               |
| [title] [______________________________]                  |
| [content] ____________________________________________    |
+-----------------------------------------------------------+
```

Ghi chu quyet dinh pham vi:
- Uu tien schema bridge de phuc vu codebase hien tai, khong ep normalize som.
- Khong bo qua schema backend da ton tai, nhung cung khong mac dinh chung da dung voi luong frontend.
- Pha sau moi xem xet tach TaskChecklist/EvidenceRecord khi frontend chuyen khoi Journey-first.
