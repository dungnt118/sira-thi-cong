# Phase 3 - Internal Delivery, Inventory & Finance Control

## 1. Mục tiêu phase

Phase 3 chuyển hệ thống từ `preconstruction` sang `vận hành nội bộ và kiểm soát tài chính`.

Trọng tâm:

- dự án
- task
- workforce
- kho vật tư
- tài sản thi công
- phần dư hoàn nhập
- thanh toán và chi phí

## 2. Vai trò trung tâm

- `PM`
- `Giám sát`
- `Kế toán`

## 3. Cấu trúc chức năng chi tiết

### 3.1 Project Workbench

- convert project hoàn chỉnh
- WBS/task package
- assignment cho PM/Giám sát
- dependency
- action center

Checklist:

- [ ] Project có task nền
- [ ] Có owner/reviewer/due date
- [ ] Có handoff log

### 3.2 Workforce & Field Execution

- workforce assignment
- kỹ thuật profile
- checklist thực thi
- evidence
- incident
- acceptance draft

### 3.3 Inventory, Asset & Remainder

- reservation
- phiếu xuất/nhập/hoàn
- asset registry
- cấp phát tài sản
- thu hồi tài sản
- remainder lot cho vật tư bán tiêu hao
- kiểm tra chất lượng hoàn nhập

Checklist:

- [ ] Phân biệt asset/consumable/semi-consumable
- [ ] Có log `planned -> issued -> used -> returned -> lost`
- [ ] Cost ledger nhận được giá trị từ kho

### 3.4 Finance Control

- payment schedule
- payment transaction
- cost entry
- cashbook
- retention tracking
- project finance snapshot

### 3.5 Financial Dossier

- đề nghị tạm ứng
- đề nghị thanh toán
- phiếu thu/chi
- acceptance-linked document
- dossier tài chính

## 4. Deliverable chính của phase

- project workbench
- task orchestration
- inventory + asset + remainder flow
- payment và cost control
- financial dossier nền

## 5. Ngoài phạm vi phase

- reporting quản trị cấp cao đầy đủ
- warranty/maintenance vận hành hoàn chỉnh
- portal hậu mãi sâu

## 6. Tiêu chí hoàn tất phase

- [ ] Project và task chạy được end-to-end nội bộ
- [ ] Giám sát thao tác thay kỹ thuật profile đúng mô hình
- [ ] Kho khóa/mở task đúng logic
- [ ] Tài sản và phần dư được đối soát
- [ ] Kế toán nhìn được thu/chi/cost cơ bản theo công trình
