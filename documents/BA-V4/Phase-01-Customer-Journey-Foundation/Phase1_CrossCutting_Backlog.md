# Phase 1 - Cross-cutting Backlog

## 1. EPIC P1-CORE-01 - Journey Core Domain & Permission

### 1.1 Mục tiêu epic

Tạo nền dữ liệu và phân quyền tối thiểu để mọi vai trò cùng làm việc trên một `Customer Journey`.

### 1.2 Feature P1-CORE-01-F01 - Journey aggregate

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-001 | Là PM, tôi muốn mỗi `Service Request` có một `Journey` để mọi dữ liệu liên quan được gắn vào cùng một context. | Must | Không |
| P1-US-CORE-002 | Là hệ thống, tôi muốn `Journey` chứa được `step timeline` để biết đang ở giai đoạn nào và bước nào bị chặn. | Must | P1-US-CORE-001 |

Acceptance checklist:

- [ ] Có `journey_id` gắn với `service_request`
- [ ] Có danh sách `step instance`
- [ ] Có trạng thái `not_started / in_progress / blocked / completed`
- [ ] Có owner của journey

### 1.3 Feature P1-CORE-01-F02 - Step definition

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-003 | Là PM, tôi muốn mỗi step có actor, checklist, quy trình nội bộ và SLA để journey không chỉ là trạng thái hiển thị. | Must | P1-US-CORE-001 |
| P1-US-CORE-004 | Là hệ thống, tôi muốn step có điều kiện vào/ra để chặn mở sai bước tiếp theo. | Must | P1-US-CORE-003 |

Acceptance checklist:

- [ ] Step có `code`, `name`, `order`
- [ ] Step có `participants`
- [ ] Step có `checklist references`
- [ ] Step có `process references`
- [ ] Step có `entry/exit criteria`

### 1.4 Feature P1-CORE-01-F03 - Permission by context

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-005 | Là Sale, tôi muốn nhìn thấy đúng phần của journey mà tôi cần để làm việc, nhưng không thấy toàn bộ dữ liệu nội bộ nhạy cảm. | Must | P1-US-CORE-001 |
| P1-US-CORE-006 | Là Giám sát, tôi muốn chỉ thấy phần khảo sát/hiện trường liên quan để thao tác nhanh trên mobile. | Must | P1-US-CORE-001 |
| P1-US-CORE-007 | Là khách hàng portal, tôi muốn chỉ thấy phần BAC đã publish. | Must | P1-US-CORE-001 |

Acceptance checklist:

- [ ] Có matrix `role -> visible tabs`
- [ ] Có matrix `role -> action`
- [ ] Portal không thấy tab nội bộ

## 2. EPIC P1-CORE-02 - Responsive Shell & Shared Patterns

### 2.1 Mục tiêu epic

Đảm bảo toàn bộ phase 1 dùng được trên desktop và mobile, đặc biệt cho `CustomerJourney` và `Giám sát`.

### 2.2 Feature P1-CORE-02-F01 - Shared layout pattern

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-008 | Là PM, tôi muốn `CustomerJourney Detail` có layout rộng trên desktop để xem nhanh nhiều thông tin cùng lúc. | Must | P1-US-CORE-01-F01 |
| P1-US-CORE-009 | Là Giám sát, tôi muốn layout mobile-first không bị vỡ khi mở từ điện thoại. | Must | P1-US-CORE-01-F01 |

Acceptance checklist:

- [ ] Desktop có vùng timeline + detail panel
- [ ] Mobile chuyển sang accordion/drawer
- [ ] CTA chính luôn thấy được

### 2.3 Feature P1-CORE-02-F02 - Shared components

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-010 | Là team UI, tôi muốn có bộ component chung cho `step card`, `status pill`, `context tab`, `activity item` để các role không lệch pattern. | Should | P1-US-CORE-008 |

Acceptance checklist:

- [ ] Có `Journey Step Card`
- [ ] Có `Context Summary Card`
- [ ] Có `Activity Timeline Item`
- [ ] Có `Publish Status Badge`

## 3. EPIC P1-CORE-03 - Activity Log & Notification Hook

### 3.1 Mục tiêu epic

Tạo xương sống ghi log và hook thông báo tối thiểu cho phase 1.

### 3.2 Feature P1-CORE-03-F01 - Journey activity log

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-011 | Là PM, tôi muốn nhìn activity log theo journey để biết ai đã làm gì, ở bước nào. | Must | P1-US-CORE-001 |
| P1-US-CORE-012 | Là Sale, tôi muốn thấy các mốc tương tác quan trọng với khách trong cùng timeline. | Should | P1-US-CORE-011 |

Acceptance checklist:

- [ ] Log có `actor`, `action`, `time`, `context`
- [ ] Log lọc được theo tab hoặc step
- [ ] Log hiển thị được trên mobile

### 3.3 Feature P1-CORE-03-F02 - Notification hook

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-CORE-013 | Là PM, tôi muốn có hook thông báo khi step bị quá hạn hoặc khi có dữ liệu mới từ Sale/Giám sát/Portal. | Should | P1-US-CORE-011 |

Acceptance checklist:

- [ ] Có event `step overdue`
- [ ] Có event `new survey feed`
- [ ] Có event `new portal message`
