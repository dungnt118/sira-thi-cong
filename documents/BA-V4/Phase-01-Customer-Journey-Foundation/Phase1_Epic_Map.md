# Phase 1 - Epic Map

## 1. Mục tiêu của bộ tài liệu này

Tài liệu này chuyển `Phase 1` từ mức roadmap sang mức triển khai:

- xác định `Epic`
- bóc thành `Feature`
- liên kết sang tài liệu `User Story` chi tiết theo vai trò

## 2. Phạm vi phase 1

Phase 1 chỉ tập trung vào 4 đối tượng:

- `PM`
- `Sale`
- `Giám sát`
- `Customer Portal`

Với trọng tâm số 1 là:

- `CustomerJourney` trở thành màn hình trung tâm của PM

## 3. Các epic của phase 1

| Epic ID | Epic | Vai trò chính | Kết quả đầu ra | Độ ưu tiên | Phụ thuộc chính |
|---|---|---|---|---|---|
| P1-CORE-01 | Journey Core Domain & Permission | Cross-role | Có aggregate `journey`, `step`, `template`, `role visibility` | Must | Không |
| P1-CORE-02 | Responsive Shell & Shared Patterns | Cross-role | Có trải nghiệm dùng được trên desktop + mobile | Must | P1-CORE-01 |
| P1-PM-01 | PM Journey List & Board | PM | PM thấy danh sách công trình và board đúng ngữ cảnh | Must | P1-CORE-01, P1-CORE-02 |
| P1-PM-02 | PM Journey Detail 360 | PM | PM mở 1 journey và xem được toàn bộ thông tin liên kết | Must | P1-PM-01 |
| P1-PM-03 | PM Journey Step Config & Template Library | PM/Admin | Journey configurable, có template mặc định và reset | Must | P1-CORE-01 |
| P1-PM-04 | PM Action Center & Publish Handoff | PM | PM thấy việc chờ xử lý và publish được dữ liệu ra portal | Should | P1-PM-02, P1-PRT-01 |
| P1-SAL-01 | Sale Intake & SLA in Journey Context | Sale | Sale làm việc theo journey thay vì màn riêng rời rạc | Must | P1-CORE-01, P1-PM-01 |
| P1-SAL-02 | Sale Survey & Commercial Context | Sale | Sale theo được khảo sát, estimate readiness, quote readiness | Must | P1-PM-02, P1-GS-01 |
| P1-SAL-03 | Sale Follow-up & Communication Context | Sale | Sale theo được deposit, milestone và thread giao tiếp | Should | P1-PM-04, P1-PRT-02 |
| P1-GS-01 | GiamSat Survey Feed to Journey | Giám sát | Dữ liệu khảo sát và rủi ro hiện trường đẩy được vào journey | Must | P1-CORE-01, P1-CORE-02 |
| P1-GS-02 | GiamSat Field Feed & Incident Summary | Giám sát | Journey phản ánh được log hiện trường và phát sinh tối thiểu | Should | P1-GS-01, P1-PM-02 |
| P1-PRT-01 | Portal Published Journey Timeline | Customer Portal | Khách thấy timeline đã publish theo context | Must | P1-PM-04, P1-CORE-02 |
| P1-PRT-02 | Portal Chat & Evidence Context | Customer Portal | Có chat theo context làm bằng chứng | Must | P1-PRT-01 |

## 4. Trình tự triển khai đề xuất trong phase 1

### 4.1 Cụm A - Nền móng

- P1-CORE-01
- P1-CORE-02

### 4.2 Cụm B - PM trung tâm

- P1-PM-01
- P1-PM-02
- P1-PM-03

### 4.3 Cụm C - Feed từ vai trò vận hành

- P1-SAL-01
- P1-SAL-02
- P1-GS-01
- P1-GS-02

### 4.4 Cụm D - Giao tiếp khách hàng

- P1-PM-04
- P1-PRT-01
- P1-PRT-02
- P1-SAL-03

## 5. Điều kiện để epic được xem là sẵn sàng triển khai

Checklist:

- [ ] Có owner nghiệp vụ rõ
- [ ] Có source document tham chiếu trong BA-V4
- [ ] Có flow chính đã chốt
- [ ] Có acceptance checklist tối thiểu
- [ ] Có xác định rõ phụ thuộc vào epic khác

## 6. Tài liệu chi tiết theo vai trò

- [Phase1_CrossCutting_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_CrossCutting_Backlog.md)
- [Phase1_PM_CustomerJourney_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_PM_CustomerJourney_Backlog.md)
- [Phase1_Sale_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Sale_Backlog.md)
- [Phase1_GiamSat_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_GiamSat_Backlog.md)
- [Phase1_CustomerPortal_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_CustomerPortal_Backlog.md)
