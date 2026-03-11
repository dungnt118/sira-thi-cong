# Phase 1 - PM CustomerJourney Backlog

## 1. EPIC P1-PM-01 - Journey List & Board

### 1.1 Feature P1-PM-01-F01 - Journey List

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-001 | Là PM, tôi muốn xem danh sách toàn bộ journey với owner, stage, SLA và tín hiệu rủi ro để biết việc nào cần xử lý trước. | Must | P1-CORE-01 |
| P1-US-PM-002 | Là PM, tôi muốn lọc journey theo nguồn khách, owner, loại dịch vụ và trạng thái chốt làm để quản lý theo lát cắt vận hành. | Must | P1-US-PM-001 |
| P1-US-PM-003 | Là PM, tôi muốn có view desktop và mobile cho danh sách journey để theo dõi được cả khi đi hiện trường. | Must | P1-CORE-02 |

Acceptance checklist:

- [ ] Có cột `customer`, `service request`, `stage`, `owner`, `SLA`, `go/no-go`
- [ ] Có filter và search
- [ ] Có sort theo SLA và updated time
- [ ] Có mobile card view

### 1.2 Feature P1-PM-01-F02 - Journey Board

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-004 | Là PM, tôi muốn có board theo step để nhìn dòng chảy tổng quan nhưng không bị đơn giản hóa như Kanban cũ. | Must | P1-US-PM-001 |
| P1-US-PM-005 | Là PM, tôi muốn trên từng card thấy được dữ liệu tóm tắt 360 như khảo sát, estimate, payment, incident thay vì chỉ tên khách. | Must | P1-US-PM-004 |

Acceptance checklist:

- [ ] Card hiển thị ít nhất 6 tín hiệu tóm tắt
- [ ] Có cảnh báo blocked/overdue
- [ ] Card bấm được để mở `Journey Detail`

## 2. EPIC P1-PM-02 - Journey Detail 360

### 2.1 Feature P1-PM-02-F01 - Journey Header & Timeline

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-006 | Là PM, tôi muốn mở một journey và thấy ngay header tổng hợp để nắm context trong vài giây. | Must | P1-PM-01 |
| P1-US-PM-007 | Là PM, tôi muốn timeline step thể hiện bước hiện tại, bước bị chặn và bước sắp đến để chủ động điều phối. | Must | P1-US-PM-006 |

Acceptance checklist:

- [ ] Header có customer, source, owner, priority, current step
- [ ] Timeline có trạng thái màu
- [ ] Có chỉ báo blocked
- [ ] Có action jump đến step đang chờ xử lý

### 2.2 Feature P1-PM-02-F02 - 360 Context Tabs

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-008 | Là PM, tôi muốn journey có tab `Yêu cầu`, `Khảo sát`, `Dự toán`, `Nhân công`, `Dự án`, `Thanh toán`, `Log`, `Phát sinh`, `Vật tư`, `Portal` để không phải đi nhiều màn rời rạc. | Must | P1-US-PM-006 |
| P1-US-PM-009 | Là PM, tôi muốn mỗi tab hiển thị summary trước và cho phép drill-down vào bản ghi gốc khi cần. | Must | P1-US-PM-008 |
| P1-US-PM-010 | Là PM, tôi muốn các tab vẫn thao tác được trên mobile bằng accordion hoặc drawer. | Must | P1-CORE-02 |

Acceptance checklist:

- [ ] Có đầy đủ các tab cốt lõi
- [ ] Mỗi tab có summary + deep link
- [ ] Mobile không bị mất chức năng

### 2.3 Feature P1-PM-02-F03 - Blocker & Alert Summary

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-011 | Là PM, tôi muốn thấy danh sách blocker tổng hợp của journey như thiếu khảo sát, estimate chưa xong, portal message chưa trả lời, để biết việc nào đang chặn luồng. | Must | P1-US-PM-006 |

Acceptance checklist:

- [ ] Có block `Open blockers`
- [ ] Có phân loại blocker theo step
- [ ] Có CTA đi tới chỗ xử lý

## 3. EPIC P1-PM-03 - Journey Step Config & Template Library

### 3.1 Feature P1-PM-03-F01 - Step Config

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-012 | Là PM/Admin, tôi muốn cấu hình chi tiết một step gồm actor, checklist, process, SLA và điều kiện hoàn tất. | Must | P1-CORE-01 |
| P1-US-PM-013 | Là PM/Admin, tôi muốn đánh dấu step nào được publish ra portal và step nào chỉ là nội bộ. | Must | P1-US-PM-012 |

Acceptance checklist:

- [ ] Step có `participants`
- [ ] Step có `process references`
- [ ] Step có `checklist references`
- [ ] Step có `publish flag`

### 3.2 Feature P1-PM-03-F02 - Template Library

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-014 | Là PM/Admin, tôi muốn có thư viện template journey mặc định theo loại dịch vụ để khởi tạo nhanh và tránh cấu hình thủ công từ đầu. | Must | P1-US-PM-012 |
| P1-US-PM-015 | Là PM/Admin, tôi muốn reset một journey về template mặc định khi cấu hình bị lệch hoặc cần chuẩn hóa lại. | Must | P1-US-PM-014 |
| P1-US-PM-016 | Là PM/Admin, tôi muốn version hóa template để biết ai đã sửa mẫu nào. | Should | P1-US-PM-014 |

Acceptance checklist:

- [ ] Có template mặc định
- [ ] Có clone template
- [ ] Có reset về mặc định
- [ ] Có audit/version history

## 4. EPIC P1-PM-04 - PM Action Center & Publish Handoff

### 4.1 Feature P1-PM-04-F01 - Action Center

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-017 | Là PM, tôi muốn thấy mọi action chờ xử lý của journey như review khảo sát, xác nhận blocker, thread portal chưa trả lời trong một inbox thống nhất. | Should | P1-US-PM-011 |

Acceptance checklist:

- [ ] Có action list theo step
- [ ] Có priority
- [ ] Có due/overdue

### 4.2 Feature P1-PM-04-F02 - Publish handoff to portal

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PM-018 | Là PM, tôi muốn chọn dữ liệu nào của journey được publish cho portal để khách chỉ thấy phần đã duyệt. | Should | P1-US-PM-008, P1-PRT-01 |
| P1-US-PM-019 | Là PM, tôi muốn nhìn trạng thái publish của từng block để kiểm soát thông tin đã gửi khách. | Should | P1-US-PM-018 |

Acceptance checklist:

- [ ] Publish theo block hoặc step
- [ ] Có trạng thái `draft/published/hidden`
- [ ] Có log publish/revoke
