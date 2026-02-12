# WF-04: Payment Milestones List

**Role:** Accountant / PM  
**Screen:** Payment Milestones Management  
**Size:** Desktop (1920×1080)  

---

## Purpose

Manage payment milestones across all projects, track payment status, và create new milestones.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Dashboard > Payment Milestones                                               │
├──────────┬──────────────────────────────────────────────────────────────────┤
│[Sidebar] │  Payment Milestones                    [+ Create Milestone]      │
│          │                                                                  │
│          │  Filters: [All Projects ▼] [All Statuses ▼] [Date Range ▼]     │
│          │           [Search...]                                  [Export] │
│          │                                                                  │
│          │  ┌────────────────────────────────────────────────────────────┐ │
│          │  │Project│Milestone│Amount   │%   │Due Date │Paid Date│Status │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Đặt cọc  │100M ₫   │20% │2025-01-10│2025-01-08│✅Paid│ │
│          │  │001  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Tạm ứng  │150M ₫   │30% │2025-02-15│2025-02-12│✅Paid│ │
│          │  │001  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Nghiệm thu│150M ₫  │30% │2025-03-20│-        │⏳Pend│ │
│          │  │001  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Final    │100M ₫   │20% │2025-04-30│-        │⏳Pend│ │
│          │  │001  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Đặt cọc  │50M ₫    │25% │2025-01-20│2025-01-18│✅Paid│ │
│          │  │023  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Tạm ứng1 │50M ₫    │25% │2025-02-10│-        │🔴Over│ │
│          │  │023  │         │         │    │          │         │ due    │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Tạm ứng2 │50M ₫    │25% │2025-03-10│-        │⏳Pend│ │
│          │  │023  │         │         │    │          │         │        │ │
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │PROJ-│Final    │50M ₫    │25% │2025-04-15│-        │⏳Pend│ │
│          │  │023  │         │         │    │          │         │        │ │
│          │  └────────────────────────────────────────────────────────────┘ │
│          │                                                                  │
│          │  Showing 1-20 of 156 milestones        [< Previous] [Next >]    │
│          │                                                                  │
│          │  Summary:                                                        │
│          │  Total Milestones: 156  │  Paid: 89  │  Pending: 62  │  Overdue: 5│
│          │  Total Amount: 2.5B ₫   │  Received: 1.8B ₫  │  Outstanding: 700M ₫│
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Action Bar
- **Create Milestone:** Primary button (blue)
- **Export:** Excel/PDF export

### 2. Filters
- **Project filter:** Dropdown (All Projects, or select specific)
- **Status filter:** All/Paid/Pending/Overdue
- **Date range:** Custom date picker
- **Search:** Search by project code/name

### 3. Milestones Table
**Columns:**
- Project (code + name on hover)
- Milestone name
- Amount (VND, right-aligned)
- Percentage (%)
- Due date
- Paid date
- Status (badge: Paid/Pending/Overdue)
- **Actions** (hidden column, show on row hover): Edit / Delete / Confirm Payment

**Row interactions:**
- Click row: Expand to show details
- Hover: Show action buttons
- Multi-select: Checkbox for batch actions

### 4. Pagination
- 20 milestones per page
- Previous / Next buttons
- Page numbers

### 5. Summary Footer
- Total counts by status
- Financial summary (total, received, outstanding)

---

## Interactions

- **Create Milestone:** Open creation dialog (WF-05)
- **Click Pending milestone:** Open payment confirmation dialog (WF-06/WF-07)
- **Edit:** Open milestone edit dialog
- **Delete:** Confirmation dialog (only if not yet paid)
- **Export:** Download filtered list as Excel/PDF

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 02 (Create Payment Milestones)
