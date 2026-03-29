# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 03 - Preconstruction and Project Handoff

Priority: P1

Muc tieu
- Di tu `ServiceRequest` sang du toan, bao gia, go/no-go, hop dong va Project.
- Tai su dung cac schema nen da co; chi bo sung phan con thieu cho preconstruction va handoff.

Schema da ton tai, uu tien tai su dung
- ServiceRequest
- SurveySummary
- Quotation
- Journey
- JourneyTemplate
- EstimateTemplate
- ChecklistTemplate

Schema can update
- Quotation
- Journey

Schema can bo sung
- PriceBook
- PriceBookItem
- EstimateVersion
- EstimateLineItem
- QuotationMappingRule
- QuotationLineItem
- GoNoGoReview
- Contract
- ContractAppendix
- Project
- ProjectAssignment
- StagePlaybook
- HandoffRule
- ProjectTask
- WorkforceAssignment

Khong dua vao scope Group 03 neu chi muon co buc tranh tong quan som
- ChangeOrder chi tiet
- Reservation / Inventory linkage day du
- Checklist execution / evidence / incident
- Payment schedule va acceptance chi tiet

Quan he chinh
- EstimateVersion.service_request_id -> ServiceRequest
- EstimateLineItem.estimate_version_id -> EstimateVersion
- PriceBookItem.price_book_id -> PriceBook
- Quotation.service_request_id -> ServiceRequest
- Quotation.journey_id -> Journey (giu lai de tuong thich hien tai)
- QuotationLineItem.quotation_id -> Quotation
- GoNoGoReview.service_request_id -> ServiceRequest
- Contract.service_request_id -> ServiceRequest
- Contract.quotation_id -> Quotation
- Project.service_request_id -> ServiceRequest
- Project.contract_id -> Contract
- ProjectAssignment.project_id -> Project
- ProjectTask.project_id -> Project
- WorkforceAssignment.project_task_id -> ProjectTask
- StagePlaybook.journey_template_id -> JourneyTemplate
- StagePlaybook.checklist_template_id -> ChecklistTemplate
- HandoffRule.stage_playbook_id -> StagePlaybook

Slices MCP
1. Estimate + PriceBook + Quotation structure
2. Go/No-Go + Contract
3. Project + assignment + task
4. Playbook + handoff rule

Done when
- Co mo hinh du lieu du de chay luong `ServiceRequest -> Estimate -> Quotation -> Go/No-Go -> Contract -> Project`.
- Co cau truc giao task va ban giao noi bo du cho PM/Giam sat/Ky thuat profile.
