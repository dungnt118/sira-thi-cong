# Phase 1 - Sale Backlog

## 1. EPIC P1-SAL-01 - Intake & SLA in Journey Context

### 1.1 Feature P1-SAL-01-F01 - Service Request Intake

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-001 | Là Sale, tôi muốn tạo `Service Request` nhanh và được gắn ngay vào journey để không phải làm việc ở một context khác PM. | Must | P1-CORE-01 |
| P1-US-SAL-002 | Là Sale, tôi muốn hệ thống gợi ý trùng khách hàng khi tạo yêu cầu để không tạo rác dữ liệu. | Must | P1-US-SAL-001 |

Acceptance checklist:

- [ ] Tạo request từ khách cũ hoặc mới
- [ ] Sinh/join journey ngay sau khi tạo
- [ ] Có duplicate suggestion

### 1.2 Feature P1-SAL-01-F02 - SLA Queue

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-003 | Là Sale, tôi muốn nhìn hàng đợi SLA theo journey để biết khách nào cần gọi trước. | Must | P1-US-SAL-001 |
| P1-US-SAL-004 | Là Sale, tôi muốn log kết quả tư vấn ngay trong journey để PM không bị thiếu context. | Must | P1-US-SAL-003 |

Acceptance checklist:

- [ ] Có danh sách SLA theo deadline
- [ ] Có consultation log gắn journey
- [ ] PM xem lại được log

## 2. EPIC P1-SAL-02 - Survey & Commercial Context

### 2.1 Feature P1-SAL-02-F01 - Survey Coordination

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-005 | Là Sale, tôi muốn lên lịch khảo sát và thấy trạng thái khảo sát ngay trong journey để biết khách đang chờ gì. | Must | P1-US-SAL-001, P1-GS-01 |

Acceptance checklist:

- [ ] Có lịch khảo sát
- [ ] Có trạng thái `scheduled / in_progress / completed`
- [ ] Có người phụ trách khảo sát

### 2.2 Feature P1-SAL-02-F02 - Estimate/Quote readiness

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-006 | Là Sale, tôi muốn thấy `estimate readiness`, `go/no-go status` và `quotation readiness` trên journey để biết khi nào được phép nói tiếp với khách. | Must | P1-PM-02 |
| P1-US-SAL-007 | Là Sale, tôi muốn thấy tóm tắt rủi ro chốt làm để giao tiếp với khách đúng kỳ vọng. | Should | P1-US-SAL-006 |

Acceptance checklist:

- [ ] Có block `estimate status`
- [ ] Có block `go/no-go status`
- [ ] Có block `quote status`

## 3. EPIC P1-SAL-03 - Customer Follow-up & Communication Context

### 3.1 Feature P1-SAL-03-F01 - Milestone follow-up

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-008 | Là Sale, tôi muốn journey hiển thị mốc hợp đồng/cọc/thanh toán để biết đang cần follow khách ở đâu. | Should | P1-PM-02 |

Acceptance checklist:

- [ ] Có contract/deposit/payment summary
- [ ] Có trạng thái follow-up

### 3.2 Feature P1-SAL-03-F02 - Communication thread context

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-SAL-009 | Là Sale, tôi muốn nhìn thread portal theo đúng journey để biết khách đang hỏi về bước nào. | Should | P1-PRT-02 |
| P1-US-SAL-010 | Là Sale, tôi muốn đánh dấu phản hồi nào là phản hồi chính thức từ BAC trong phase 1. | Should | P1-US-SAL-009 |

Acceptance checklist:

- [ ] Thread gắn context step
- [ ] Có trạng thái chờ trả lời
- [ ] Có flag `official response`
