# 📱 WIREFRAME 06: Quality Issue Detail - Desktop

**Screen:** Quality Issue Detail (Desktop - 1920x1080)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [← Back to Issues]  Quality Issue Detail                                         [×] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  🚨 ISS-2026-001: Foundation crack detected                                           │
│  Status: OPEN                    Severity: CRITICAL                Priority: HIGH     │
│  ──────────────────────────────────────────────────────────────────────────────────── │
│                                                                                        │
│  Project Information                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Project: PRJ-2026-001 - ABC Corp Renovation                                     │ │
│  │  Location: 123 Nguyen Hue, Q1, TP HCM                                            │ │
│  │  Stage: Foundation Work                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│  Issue Details                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Created by: Supervisor (You)                                                    │ │
│  │  Created date: 12/02/2026 14:30                                                  │ │
│  │  Assigned to: Nguyen Van A (Outsource Leader)                                    │ │
│  │  Category: Structural                                                            │ │
│  │  Expected resolution: 13/02/2026 (24h)                                           │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│  Description                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Phát hiện vết nứt dài 2m trên móng cột M1. Vết nứt rộng khoảng 3mm, chạy theo  │ │
│  │  hướng chéo từ góc móng. Nghi ngờ do nền đất không đồng đều hoặc thi công không │ │
│  │  đúng kỹ thuật. Cần kiểm tra và xử lý ngay để tránh ảnh hưởng đến kết cấu.      │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│  Evidence Photos                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                                     │
│  │            │  │            │  │            │                                     │
│  │  [IMAGE]   │  │  [IMAGE]   │  │  [IMAGE]   │                                     │
│  │  200x150   │  │  200x150   │  │  200x150   │                                     │
│  │            │  │            │  │            │                                     │
│  └────────────┘  └────────────┘  └────────────┘                                     │
│  Click to view full size                                                              │
│                                                                                        │
│  Activity Timeline                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ● 12/02 14:30 - Issue created by Supervisor                                     │ │
│  │  ● 12/02 14:35 - Assigned to Nguyen Van A (OL)                                   │ │
│  │  ● 12/02 15:00 - OL acknowledged issue                                           │ │
│  │  ● 12/02 16:00 - OL submitted action plan                                        │ │
│  │  ○ Waiting for Supervisor review...                                              │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│  OL Response & Action Plan                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Submitted by: Nguyen Van A                                                      │ │
│  │  Date: 12/02/2026 16:00                                                          │ │
│  │  ──────────────────────────────────────────────────────────────────────────────  │ │
│  │                                                                                  │ │
│  │  Đã kiểm tra hiện trường. Nguyên nhân do nền đất lún không đều. Kế hoạch xử lý: │ │
│  │  1. Đào bới móng để kiểm tra độ sâu vết nứt                                      │ │
│  │  2. Gia cố thêm cốt thép                                                         │ │
│  │  3. Đổ bê tông cốt thép mới                                                      │ │
│  │  4. Thời gian hoàn thành: 2 ngày                                                 │ │
│  │                                                                                  │ │
│  │  [Attached: repair_plan.pdf]                                                     │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│  Supervisor Feedback                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                  │ │
│  │  Add your feedback on the action plan...                                        │ │
│  │                                                                                  │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│                           [Escalate to PM] [Request Revision] [Approve Plan] [Close] │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Header
- **Issue ID + Title:** 24px, bold
- **Status/Severity badges:** Right-aligned
- **Severity colors:** Same as list view

### Timeline
- **Completed items:** Filled circle (●), black
- **Pending items:** Empty circle (○), gray
- **Line height:** 1.8
- **Font:** 14px

### Action Plan Card
- **Background:** #FFFEF7 (light yellow)
- **Border:** 1px solid #FFE082
- **Padding:** 20px

### Action Buttons
- **Escalate:** Warning button (orange)
- **Request Revision:** Secondary button
- **Approve Plan:** Primary button (green)
- **Close:** Success button (green)

---

**Related Screens:**
- WF-05: Quality Issues List
- WF-07: Create Issue Modal
