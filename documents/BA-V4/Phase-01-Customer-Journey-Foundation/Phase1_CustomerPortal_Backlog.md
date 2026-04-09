# Phase 1 - Customer Portal Backlog

## 1. EPIC P1-PRT-01 - Published Journey Timeline

### 1.1 Feature P1-PRT-01-F01 - Portal access

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PRT-001 | Là khách hàng, tôi muốn truy cập portal của công trình để theo dõi công trình đã được BAC công bố. | Must | P1-CORE-01, P1-CORE-02 |

Acceptance checklist:

- [ ] Có link/token truy cập
- [ ] Chỉ thấy journey đã được cấp quyền
- [ ] Mobile dùng được

### 1.2 Feature P1-PRT-01-F02 - Published timeline view

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PRT-002 | Là khách hàng, tôi muốn xem timeline các step BAC đã publish để biết hồ sơ của mình đang ở đâu. | Must | P1-US-PRT-001, P1-PM-04 |
| P1-US-PRT-003 | Là khách hàng, tôi muốn xem các block liên quan như khảo sát, tiến độ, mốc thanh toán đã được publish mà không thấy dữ liệu nội bộ. | Must | P1-US-PRT-002 |

Acceptance checklist:

- [ ] Có timeline step publish
- [ ] Có block chi tiết theo step
- [ ] Không hiển thị tab nội bộ

## 2. EPIC P1-PRT-02 - Portal Chat & Evidence Context

### 2.1 Feature P1-PRT-02-F01 - Contextual chat

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PRT-004 | Là khách hàng, tôi muốn nhắn theo từng context như khảo sát, tiến độ, thanh toán để không bị lẫn nội dung trao đổi. | Must | P1-PRT-01 |
| P1-US-PRT-005 | Là khách hàng, tôi muốn xem lịch sử trả lời của BAC trong cùng một thread để làm bằng chứng trao đổi. | Must | P1-US-PRT-004 |

Acceptance checklist:

- [ ] Thread có `context type`
- [ ] Có timeline message
- [ ] Có người gửi, thời gian gửi

### 2.2 Feature P1-PRT-02-F02 - Read state & escalation hook

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PRT-006 | Là Sale/PM, tôi muốn biết thread nào khách đã đọc và thread nào đang chờ phản hồi để không bỏ sót giao tiếp. | Must | P1-US-PRT-004 |

Acceptance checklist:

- [ ] Có read state tối thiểu
- [ ] Có status chờ trả lời
- [ ] Có hook đưa vào Action Center

### 2.3 Feature P1-PRT-02-F03 - Request from portal

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-PRT-007 | Là khách hàng, tôi muốn gửi yêu cầu hoặc câu hỏi từ portal để BAC nhận đúng context journey ngay từ đầu. | Should | P1-US-PRT-004 |

Acceptance checklist:

- [ ] Request gắn vào journey hiện tại
- [ ] PM/Sale nhìn thấy trong journey
- [ ] Có log thời gian gửi
