# Phase 1 - GiamSat Backlog

## 1. EPIC P1-GS-01 - Survey Feed to Journey

### 1.1 Feature P1-GS-01-F01 - Assigned survey queue

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-GS-001 | Là Giám sát, tôi muốn thấy danh sách khảo sát được giao theo lịch để vào công trình đúng hẹn. | Must | P1-CORE-01, P1-CORE-02 |

Acceptance checklist:

- [ ] Có queue khảo sát được giao
- [ ] Có thời gian, địa điểm, khách hàng
- [ ] Mobile dùng được

### 1.2 Feature P1-GS-01-F02 - Structured survey capture

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-GS-002 | Là Giám sát, tôi muốn nhập khảo sát có cấu trúc để dữ liệu đi thẳng vào journey thay vì chỉ là file rời. | Must | P1-US-GS-001 |
| P1-US-GS-003 | Là Giám sát, tôi muốn chụp ảnh/video theo khu vực khảo sát và gắn đúng context để PM xem lại được. | Must | P1-US-GS-002 |

Acceptance checklist:

- [ ] Có khu vực khảo sát
- [ ] Có hiện trạng
- [ ] Có media theo khu vực
- [ ] Có chữ ký khảo sát tối thiểu nếu cần

### 1.3 Feature P1-GS-01-F03 - Field risk flag

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-GS-004 | Là Giám sát, tôi muốn đánh dấu các rủi ro như khó tiếp cận, cần giáo mác, vật tư khó kiếm để journey phản ánh đúng khả năng nhận việc. | Must | P1-US-GS-002 |

Acceptance checklist:

- [ ] Có cờ rủi ro vật tư
- [ ] Có cờ rủi ro nhân công
- [ ] Có cờ rủi ro tiến độ/điều kiện thi công

## 2. EPIC P1-GS-02 - Field Feed & Incident Summary

### 2.1 Feature P1-GS-02-F01 - Field update summary

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-GS-005 | Là Giám sát, tôi muốn cập nhật ghi chú hiện trường tối thiểu để journey không bị mù sau khi đã khởi tạo project. | Should | P1-GS-01, P1-PM-02 |

Acceptance checklist:

- [ ] Có field note ngắn
- [ ] Có timestamp
- [ ] PM xem được trong tab Log/Phát sinh

### 2.2 Feature P1-GS-02-F02 - Incident summary

#### User Story

| Story ID | User Story | Priority | Phụ thuộc |
|---|---|---|---|
| P1-US-GS-006 | Là Giám sát, tôi muốn tạo incident/phát sinh tối thiểu để PM và Sale thấy được các điểm cần xử lý trên journey. | Should | P1-US-GS-005 |

Acceptance checklist:

- [ ] Incident có loại, mức độ, mô tả
- [ ] Incident hiện trong journey summary
- [ ] Có owner xử lý tối thiểu
