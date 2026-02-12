# WF-02: Project Financial Summary

**Role:** Accountant  
**Screen:** Project Financial Summary  
**Size:** Desktop (1920×1080 recommended)  

---

## Purpose

Hiển thị tổng quan tài chính chi tiết của một dự án cụ thể, bao gồm revenue, costs, profit, và cash flow.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Dashboard > Projects > PROJ-001 - Website Development                       │ BREADCRUMB
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│ [Sidebar]│  Project Financial Summary: PROJ-001                             │
│          │  Client: ABC Company  │  PM: John Doe  │  Status: Active        │
│          │                                                                  │
│          │  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│          │  │ Contract     │ Received     │ Outstanding  │ Collection   │  │
│          │  │ Value        │              │              │ Rate         │  │
│          │  │              │              │              │              │  │
│          │  │ 500M ₫       │ 350M ₫       │ 150M ₫       │ 70%          │  │
│          │  │              │ (70%)        │ (30%)        │ ████░░ 70%   │  │
│          │  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│          │                                                                  │
│          │  Payment Milestones                                              │
│          │  ┌───────────────────────────────────────────────────────────┐  │
│          │  │ Milestone   │ Amount  │ Due Date   │ Paid Date │ Status   │  │
│          │  ├───────────────────────────────────────────────────────────┤  │
│          │  │ Đặt cọc     │ 100M ₫  │ 2025-01-10 │ 2025-01-08│ ✅ Paid │  │
│          │  │ Tạm ứng     │ 150M ₫  │ 2025-02-15 │ 2025-02-12│ ✅ Paid │  │
│          │  │ Nghiệm thu  │ 150M ₫  │ 2025-03-20 │ -         │⏳Pending│  │
│          │  │ Final       │ 100M ₫  │ 2025-04-30 │ -         │⏳Pending│  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌─────────────────────────────────┐                            │
│          │  │  Cost Breakdown                 │                            │
│          │  │                                 │                            │
│          │  │  Planned Costs:                 │                            │
│          │  │  ├─ Material: 100M ₫            │                            │
│          │  │  ├─ Labor (Outsource): 200M ₫   │                            │
│          │  │  ├─ Equipment: 20M ₫            │                            │
│          │  │  └─ Other: 10M ₫                │                            │
│          │  │  Total Planned: 330M ₫          │                            │
│          │  │                                 │                            │
│          │  │  Actual Costs (to date):        │                            │
│          │  │  ├─ Material: 95M ₫ (✓ 5M saved)│                            │
│          │  │  ├─ Labor: 140M ₫               │                            │
│          │  │  ├─ Equipment: 18M ₫            │                            │
│          │  │  └─ Other: 7M ₫                 │                            │
│          │  │  Total Actual: 260M ₫           │                            │
│          │  │                                 │                            │
│          │  │  Remaining Budget: 70M ₫        │                            │
│          │  └─────────────────────────────────┘                            │
│          │                                                                  │
│          │  ┌─────────────────────────────────┐                            │
│          │  │  Profit Analysis                │                            │
│          │  │                                 │                            │
│          │  │  Revenue (to date): 350M ₫      │                            │
│          │  │  - Costs (actual):  260M ₫      │                            │
│          │  │  ──────────────────────         │                            │
│          │  │  Gross Profit: 90M ₫            │                            │
│          │  │  Gross Margin: 25.7% ✅         │                            │
│          │  │                                 │                            │
│          │  │  Projected Final:               │                            │
│          │  │  Revenue: 500M ₫                │                            │
│          │  │  - Costs:  330M ₫               │                            │
│          │  │  ──────────                     │                            │
│          │  │  Net Profit: 170M ₫             │                            │
│          │  │  Net Margin: 34% ✅             │                            │
│          │  └─────────────────────────────────┘                            │
│          │                                                                  │
│          │  Cash Flow Timeline                                              │
│          │  ┌───────────────────────────────────────────────────────────┐  │
│          │  │  Jan     Feb     Mar     Apr     May                       │  │
│          │  │   ├───────┼───────┼───────┼───────┼──────                 │  │
│          │  │   ●       ●       ○       ○                                │  │
│          │  │  Paid    Paid   Pending Pending                            │  │
│          │  │  100M    150M    150M    100M                              │  │
│          │  │                                                            │  │
│          │  │  Cash In:  +350M ₫                                         │  │
│          │  │  Cash Out: -260M ₫                                         │  │
│          │  │  ─────────────────                                         │  │
│          │  │  Net Cash Flow: +90M ₫ ✅                                  │  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  [Export Report] [View Payment History] [Back to Projects]      │
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Project Header
- **Project Code:** PROJ-001
- **Project Name:** Website Development
- **Client:** ABC Company
- **PM:** John Doe
- **Status:** Active (green badge)

### 2. Revenue KPI Cards (4 cards)
- Contract Value
- Received (with %)
- Outstanding (with %)
- Collection Rate (progress bar)

### 3. Payment Milestones Table
**Columns:**
- Milestone name
- Amount
- Due date
- Paid date
- Status (badge: Paid/Pending/Overdue)

### 4. Cost Breakdown Panel
**Two sections:**
- **Planned Costs:** Breakdown by category
- **Actual Costs:** Current spending với variance indicators
- **Remaining Budget:** Planned - Actual

### 5. Profit Analysis Panel
**Two calculations:**
- **Current (to date):** Based on received revenue & actual costs
- **Projected final:** Based on contract value & planned costs
- **Margin indicators:** ✅ Green if >20%, ⚠️ Yellow if 10-20%, ❌ Red if <10%

### 6. Cash Flow Timeline
- Visual timeline với milestones
- Paid (●), Pending (○)
- Cash summary (In, Out, Net)

---

## Interactions

- **Click milestone row:** Expand to show payment details
- **Export Report:** Generate PDF/Excel với full financial summary
- **View Payment History:** Navigate to detailed transaction log

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 07 (Project Financial Summary)
