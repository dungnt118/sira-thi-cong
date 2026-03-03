# 🗺️ ROADMAP CHI TIẾT – DL TECH MANAGEMENT V3
## Giai đoạn đầu (First Stage)

---

## 📌 Tổng quan Roadmap

```
SPRINT 1 (Tuần 1-2): Nền tảng hệ thống (Foundation)
SPRINT 2 (Tuần 3-4): MODULE 1 – CRM & Khảo sát
SPRINT 3 (Tuần 5-6): MODULE 2 – Nhật ký Thi công (Checklist + Evidence)
SPRINT 4 (Tuần 7-8): MODULE 3 – Vật tư & Kho
SPRINT 5 (Tuần 9-10): MODULE 4 – Tài chính & Bảo hành
SPRINT 6 (Tuần 11-12): Tích hợp, Test, Hoàn thiện UX
```

---

## 🏗️ SPRINT 1: Foundation (Tuần 1-2)
**Mục tiêu**: Xây dựng nền tảng kỹ thuật, hệ thống Auth, RBAC 4 roles

### Backend
| Hạng mục | Chi tiết | Ưu tiên |
|---------|----------|---------|
| Setup hạ tầng | Database schema, API gateway, Storage | P0 |
| Authentication | Login/Logout, JWT, Refresh token | P0 |
| RBAC | 4 roles: Admin, PM, Thợ, Kế toán | P0 |
| User Management | CRUD user, gán role, đặt lại mật khẩu | P0 |
| Audit Log | Log toàn bộ action | P1 |
| Notification Engine | In-app + Email (nền tảng) | P1 |

### Frontend
| Hạng mục | Chi tiết | Ưu tiên |
|---------|----------|---------|
| Design System | Màu sắc, Typography, Components cơ bản | P0 |
| Layout Shell | Sidebar, Header, Navigation per role | P0 |
| Login Page | Form đăng nhập, handle error | P0 |
| User Management UI | Danh sách user, CRUD | P1 |
| Dashboard Shell | Layout tổng quan (chưa có data) | P1 |

### Acceptance Criteria Sprint 1
- [ ] Đăng nhập thành công bằng 4 role khác nhau
- [ ] Mỗi role thấy menu phù hợp với quyền của mình
- [ ] API Auth trả về JWT hợp lệ
- [ ] CRUD User từ Admin UI

---

## 📋 SPRINT 2: MODULE 1 – CRM & Khảo sát (Tuần 3-4)
**Mục tiêu**: Quản lý khách hàng, pipeline trạng thái, khảo sát

### Backend
| Hạng mục | Function ID | Độ phức tạp |
|---------|-------------|------------|
| API CRUD Khách hàng | CRM-01 | Low |
| API GPS tọa độ | CRM-02 | Medium |
| API Upload ảnh khảo sát | CRM-05 | Medium |
| API nhập chỉ số đo ẩm | CRM-06 | Low |
| API Báo giá (draft) | CRM-07 | Medium |
| API Pipeline status machine | CRM-09, CRM-10 | High |
| API Lịch sử KH | CRM-04 | Low |

### Frontend
| Hạng mục | Wireframe Ref | Độ phức tạp |
|---------|--------------|------------|
| Danh sách KH + Search/Filter | WF-01 | Medium |
| Form Tạo/Sửa KH + GPS picker | WF-02 | High |
| Upload ảnh khảo sát + đo ẩm | WF-03 | Medium |
| Form Báo giá | WF-04 | Medium |
| Dashboard Pipeline (Kanban) | WF-05 | High |
| Chi tiết KH + lịch sử | WF-06 | Medium |

### Business Rules cần implement
- BR-CRM-01: Trạng thái KH chỉ tiến về phía trước
- BR-CRM-02: Chỉ KH "Đã ký HĐ" mới tạo dự án
- BR-CRM-03: Ảnh khảo sát timestamp tự động

### Acceptance Criteria Sprint 2
- [ ] PM tạo KH mới với GPS
- [ ] PM upload ảnh khảo sát + nhập chỉ số ẩm
- [ ] PM chuyển trạng thái KH (Đang khảo sát → Gửi báo giá → Ký HĐ)
- [ ] Admin xem Dashboard Pipeline

---

## 🔨 SPRINT 3: MODULE 2 – Nhật ký Thi công (Tuần 5-6)
**Mục tiêu**: Checklist tiêu chuẩn vàng, upload bằng chứng theo bước, giám sát realtime

### Backend
| Hạng mục | Function ID | Độ phức tạp |
|---------|-------------|------------|
| API Tạo/Sửa Dự án | (Kế thừa BRD-V2) | Medium |
| API Checklist Template | TCK-04 | Medium |
| API State Machine Checklist | TCK-01, TCK-02, TCK-03 | High |
| API Upload Evidence per bước | TCK-05 | High |
| API Timestamp + GPS | TCK-06, TCK-07 | Medium |
| API Approve/Reject Evidence | TCK-08, TCK-09 | Medium |
| API Dashboard Tiến độ | TCK-10, TCK-11 | Medium |
| API Cảnh báo trễ deadline | TCK-12 | Medium |
| API Audit Log thi công | TCK-13 | Low |

### Frontend
| Hạng mục | Wireframe Ref | Độ phức tạp |
|---------|--------------|------------|
| PM: Tạo dự án từ KH | WF-07 | Medium |
| PM: Giao việc cho thợ | WF-08 | Medium |
| Thợ: Danh sách dự án của tôi | WF-09 | Low |
| Thợ: Checklist thi công (có khóa bước) | WF-10 | **HIGH** |
| Thợ: Upload ảnh/video theo bước | WF-11 | High |
| PM: Giám sát tiến độ realtime | WF-12 | High |
| PM: Review & Approve Evidence | WF-13 | Medium |
| Admin: Dashboard tổng quan dự án | WF-14 | Medium |

### Business Rules cần implement
- **BR-TCK-01**: Bắt buộc upload ảnh TRƯỚC khi tick bước hoàn thành
- **BR-TCK-02**: Bước N+1 bị KHÓA nếu bước N chưa có ảnh
- **BR-TCK-03**: Server timestamp bất biến
- **BR-TCK-04**: 100% bước hoàn thành → Dự án mới Complete

### Acceptance Criteria Sprint 3
- [ ] PM tạo dự án và giao cho thợ
- [ ] Thợ thấy checklist, các bước khóa/mở đúng logic
- [ ] Thợ upload ảnh → bước mở khóa → tick hoàn thành
- [ ] PM xem realtime thợ đang ở bước nào
- [ ] PM approve/reject từng ảnh
- [ ] Notification khi thợ hoàn thành bước cuối

---

## 📦 SPRINT 4: MODULE 3 – Vật tư & Kho (Tuần 7-8)
**Mục tiêu**: Định mức tự tính, xuất kho thợ ký nhận, cảnh báo tồn kho

### Backend
| Hạng mục | Function ID | Độ phức tạp |
|---------|-------------|------------|
| API Danh mục vật tư | INV-01, INV-02 | Low |
| API Cập nhật tồn kho | INV-03 | Low |
| API Setup định mức | INV-04 | Medium |
| API Tự tính định mức | INV-05 | **HIGH** |
| API Xuất định mức dự án | INV-06 | Medium |
| API Tạo phiếu xuất kho | INV-07 | Medium |
| API Thợ ký nhận (digital signature) | INV-08 | High |
| API Lịch sử xuất/nhập kho | INV-09 | Low |
| API Ngưỡng cảnh báo tồn kho | INV-10 | Low |
| API Tự động cảnh báo | INV-11 | Medium |
| API Dashboard kho | INV-12 | Medium |

### Frontend
| Hạng mục | Wireframe Ref | Độ phức tạp |
|---------|--------------|------------|
| Kế toán: Danh mục vật tư | WF-15 | Low |
| Admin: Setup định mức m2/kg | WF-16 | Medium |
| PM: Nhập định mức dự án (auto-calc) | WF-17 | High |
| Kế toán: Tạo phiếu xuất kho | WF-18 | Medium |
| Thợ: Xem phiếu vật tư + Ký nhận (mobile) | WF-19 | High |
| Kế toán: Dashboard tồn kho + cảnh báo | WF-20 | Medium |
| Admin/Kế toán: Lịch sử kho | WF-21 | Low |

### Business Rules cần implement
- **BR-INV-01**: Auto-calc định mức từ diện tích nhập vào
- **BR-INV-02**: Không xuất kho khi tồn kho không đủ
- **BR-INV-03**: Thợ ký → Phiếu mới có hiệu lực
- **BR-INV-04**: Auto-alert khi tồn ≤ ngưỡng

### Acceptance Criteria Sprint 4
- [ ] Admin setup định mức: 1m2 = X kg SIRA PU
- [ ] PM nhập 100m2 → Hệ thống tự tính cần 150kg
- [ ] Kế toán tạo phiếu xuất kho
- [ ] Thợ ký nhận trên mobile → Phiếu confirmed
- [ ] Tồn kho ≤ 5 thùng → Kế toán nhận notification

---

## 💰 SPRINT 5: MODULE 4 – Tài chính & Bảo hành (Tuần 9-10)
**Mục tiêu**: Dòng tiền 50%-40%-10%, bảo hành tự động SMS/Zalo

### Backend
| Hạng mục | Function ID | Độ phức tạp |
|---------|-------------|------------|
| API Tạo Payment Milestone (template) | FIN-01, FIN-02 | Medium |
| API Confirm thanh toán | FIN-03 | Medium |
| API Dashboard dòng tiền | FIN-04 | Medium |
| API Cảnh báo quá hạn | FIN-05 | Medium |
| API Báo cáo tài chính | FIN-06 | High |
| API Config bảo hành (thời hạn) | FIN-07 | Low |
| API Scheduler gửi nhắc bảo hành | FIN-08 | High |
| API SMS/Zalo Gateway Integration | FIN-08 | High |
| API Lịch sử bảo hành | FIN-09 | Low |
| API Tạo phiếu bảo hành | FIN-10 | Medium |

### Frontend
| Hạng mục | Wireframe Ref | Độ phức tạp |
|---------|--------------|------------|
| PM: Xem/Cấu hình đợt thanh toán | WF-22 | Medium |
| Kế toán: Confirm thu tiền từng đợt | WF-23 | Medium |
| Kế toán: Dashboard dòng tiền tổng | WF-24 | High |
| Admin: Báo cáo tài chính dự án | WF-25 | High |
| PM: Phiếu bảo hành điện tử | WF-26 | Medium |
| Kế toán: Lịch bảo hành / Lịch sử gửi | WF-27 | Medium |

### Business Rules cần implement
- **BR-FIN-01**: Template 3 đợt: 50%-40%-10%
- **BR-FIN-02**: Chỉ Kế toán/Admin confirm thu tiền
- **BR-FIN-03**: Tự gửi nhắc bảo hành 6 tháng + 12 tháng
- **BR-FIN-04**: Phiếu bảo hành tự tạo khi dự án Completed

### Acceptance Criteria Sprint 5
- [ ] PM tạo dự án → milestone tự tạo 3 đợt 50%-40%-10%
- [ ] Kế toán confirm Đợt 1 đã thu → Dashboard cập nhật
- [ ] Dự án Completed → Phiếu bảo hành tự tạo
- [ ] 6 tháng sau Completed → KH nhận SMS/Zalo nhắc bảo hành
- [ ] Admin xem báo cáo lợi nhuận từng dự án

---

## ✅ SPRINT 6: Integration, Testing, UX Polish (Tuần 11-12)
**Mục tiêu**: Kết nối liên module, UAT, hoàn thiện UX mobile cho thợ

### Integration Testing
| Kịch bản | Mô tả |
|---------|-------|
| End-to-End Flow 1 | KH → Khảo sát → Ký HĐ → Tạo dự án → Thi công → Nghiệm thu → Thanh toán → Bảo hành |
| End-to-End Flow 2 | PM giám sát realtime khi thợ đang thi công |
| End-to-End Flow 3 | Tồn kho thấp → Cảnh báo → Kế toán nhập thêm |
| End-to-End Flow 4 | Dự án complete → Bảo hành auto-send SMS/Zalo |

### UX Polish (ưu tiên Mobile)
- [ ] Tối ưu upload ảnh trên mobile (compress trước upload)
- [ ] Thêm offline indicator cho thợ
- [ ] PWA setup (Add to Home Screen)
- [ ] Loading states và skeleton UI
- [ ] Error messages bằng tiếng Việt
- [ ] Notification push (in-app badge)

### Performance & Security
- [ ] API response < 500ms
- [ ] File upload optimization
- [ ] Rate limiting
- [ ] Penetration test cơ bản
- [ ] Backup policy setup

---

## 📊 TỔNG KẾT ROADMAP

| Sprint | Tuần | Module | Số Wireframe | Story Points (ước tính) |
|--------|------|--------|-------------|------------------------|
| Sprint 1 | 1-2 | Foundation | WF-00 (Auth/Shell) | 40 |
| Sprint 2 | 3-4 | CRM & Khảo sát | WF-01 ~ WF-06 | 45 |
| Sprint 3 | 5-6 | Nhật ký Thi công | WF-07 ~ WF-14 | 60 |
| Sprint 4 | 7-8 | Vật tư & Kho | WF-15 ~ WF-21 | 50 |
| Sprint 5 | 9-10 | Tài chính & Bảo hành | WF-22 ~ WF-27 | 55 |
| Sprint 6 | 11-12 | Integration & Polish | – | 35 |
| **Tổng** | **12 tuần** | **4 Modules** | **27 Wireframes** | **285 SP** |

---

## ⚠️ RỦI RO & GIẢM THIỂU

| Rủi ro | Khả năng | Ảnh hưởng | Giảm thiểu |
|--------|----------|-----------|------------|
| Zalo API phức tạp | Cao | Cao | Prepare SMS fallback trước |
| Thợ không quen app mobile | Trung bình | Cao | UX cực kỳ đơn giản, hướng dẫn video |
| Digital signature compliance | Thấp | Trung bình | Dùng OTP confirm thay thế |
| Upload ảnh chậm trên 3G | Cao | Cao | Compress ảnh client-side trước |
| Checklist khóa bước UX khó | Trung bình | Cao | User test sớm ở Sprint 3 |

---

*Roadmap V3 | Ngày: 2026-03-02 | First Stage | 12 tuần | 4 Modules | 27 Wireframes*
