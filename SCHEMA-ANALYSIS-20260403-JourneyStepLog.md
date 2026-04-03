# SCHEMA ANALYSIS: JourneyStepLog

## PHAN 1: SO SANH GAP (Yeu cau vs Current Schema)

| Thuoc tinh | Yeu cau | Hien tai | Gap | Priority |
|---|---|---|---|---|
| Log step Journey | Append-only log theo tung lan vao/ra step | Chua co schema rieng | Thieu JourneyStepLog | High |
| Transition history | Luu from_step va to_step | Journey chi co current_step | Khong co lich su chuyen buoc | High |
| Step timing | Luu start_time, end_time, duration | WorkTask chi theo task | Chua du audit step lifecycle | High |
| SLA snapshot | Dong bang SLA tai luc event xay ra | Setting chi cau hinh, Journey chi tong hop | Chua co log SLA tung step | High |

## PHAN 2: THIET KE CHI TIET THUOC TINH

Schema: JourneyStepLog
- label: Nhat ky step hanh trinh
- collection: journeysteplog
- tags: Journey, SLA, Audit
- groups: Thong Tin Step; Theo Doi SLA va Audit

Thuoc tinh de xuat:
1. journey_id - ObjectId -> Journey - required - width1_2 - group Thong Tin Step
2. step_code - Text/Dropdown - required - width1_2 - group Thong Tin Step
3. event_type - Text/Dropdown - required - width1_2 - group Thong Tin Step
4. event_time - DateTime/DateTimePicker - required - width1_2 - group Thong Tin Step
5. from_step_code - Text/Dropdown - optional - width1_2 - group Thong Tin Step
6. to_step_code - Text/Dropdown - optional - width1_2 - group Thong Tin Step
7. start_time - DateTime - optional - width1_2 - group Theo Doi SLA va Audit
8. end_time - DateTime - optional - width1_2 - group Theo Doi SLA va Audit
9. duration_minutes - Number - optional - width1_2 - group Theo Doi SLA va Audit
10. sla_hours_snapshot - Number - optional - width1_2 - group Theo Doi SLA va Audit
11. sla_status - Text/Dropdown - optional - width1_2 - group Theo Doi SLA va Audit
12. actor_user - AuthorizedUser - optional - width1_2 - group Theo Doi SLA va Audit
13. trigger_source - Text/Dropdown - optional - width1_2 - group Theo Doi SLA va Audit
14. worktask_id - ObjectId -> WorkTask - optional - width1_2 - group Theo Doi SLA va Audit
15. activity_event_id - ObjectId -> ActivityEvent - optional - width1_2 - group Theo Doi SLA va Audit
16. note - Text/TextArea - optional - fullwidth - group Theo Doi SLA va Audit
17. metadata - Object - optional - fullwidth - group Theo Doi SLA va Audit

Value options chinh:
- step_code: lead_intake, qualification, survey_planning, site_survey, survey_review, estimate_preparation, quotation_preparation, quotation_sent, quotation_approved, contract_signing, project_execution, handover_acceptance, warranty_aftercare
- event_type: enter_step, exit_step, transition, pause_step, resume_step, complete_step, reopen_step, sla_snapshot
- sla_status: on_time, at_risk, overdue, paused, completed
- trigger_source: manual, workflow, system, api, import

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
+--------------------------------------------------+
| JourneyStepLog                                   |
+--------------------------------------------------+
| journey_id      | step_code                      |
| event_type      | event_time                     |
| from_step_code  | to_step_code                   |
|--------------------------------------------------|
| start_time      | end_time                       |
| duration_min    | sla_hours_snapshot             |
| sla_status      | actor_user                     |
| trigger_source  | worktask_id                    |
| activity_event_id                               |
| note                                             |
| metadata                                         |
+--------------------------------------------------+
```

Ghi chu: schema nay la append-only log, khong thay the Journey hay WorkTask.