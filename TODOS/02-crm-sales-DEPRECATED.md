# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 02 - CRM and Sales

Priority: P0

Muc tieu
- Chuan hoa diem vao theo `ServiceRequest`, khong dung `Customer` lam entity Kanban.
- Tai su dung schema CRM da co san tren backend; chi bo sung phan gap thuc su.

Schema da ton tai, uu tien tai su dung
- Customer
- ServiceRequest
- SalesPipeline
- PipelineStage
- SurveyRecord
- Journey
- Quotation

Schema can update
- Customer
- ServiceRequest
- SurveyRecord

Schema can bo sung
- ServiceRequestStageHistory
- ServiceRequestInteractionLog
- SurveySummary

Khong dua vao scope hien tai
- CustomerAddress
- CustomerContact
- SurveyAppointment

Ly do loai khoi scope hien tai
- Chua co bang chung BA/frontend bat buoc tach rieng nhieu dia chi hay nhieu contact o wave nay.
- `SurveyAppointment` co the hap thu vao `SurveyRecord` bang cach ho tro draft + `scheduled_date`, tranh tao them schema som.

Quan he chinh
- ServiceRequest.customer_id -> Customer
- ServiceRequest.pipeline_id -> SalesPipeline
- ServiceRequest.stage_id -> PipelineStage
- SurveyRecord.service_request_id -> ServiceRequest
- SurveyRecord.journey_id -> Journey (giu de dung sau khi request duoc convert)
- ServiceRequestStageHistory.service_request_id -> ServiceRequest
- ServiceRequestInteractionLog.service_request_id -> ServiceRequest
- SurveySummary.survey_record_id -> SurveyRecord

Slices MCP
1. Chuan hoa Customer + ServiceRequest intake
2. Stage history + interaction log
3. SurveyRecord + SurveySummary

Done when
- Co the tao nhanh `ServiceRequest` tu khach moi hoac khach cu.
- Co lich su chuyen stage va log tuong tac khach hang tren backend.
- Co the luu `SurveyRecord` gan `ServiceRequest` truoc khi convert sang `Journey`.
- Co `SurveySummary` de xuat report/version cho PM/Sale.
