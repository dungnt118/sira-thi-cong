# WF-01: Financial Dashboard

**Role:** Accountant  
**Screen:** Financial Dashboard (Home screen)  
**Size:** Desktop (1920×1080 recommended, minimum 1280×768)  

---

## Purpose

Main dashboard for Accountant role, hiển thị tổng quan tài chính toàn hệ thống với KPIs, charts, recent activities, và alerts.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SIRA Logo]  SIRA Service Management           [🔔 3] [👤 John Doe ▼]      │ TOP BAR (64px)
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │                                                                  │
│  📊      │  Financial Dashboard                                             │
│ Dashboard│                                                                  │
│          │  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  💰      │  │ 💵 Total     │ 💸 Outstand  │ 📤 Outstand  │ 💳 Cash      │  │
│ Receiv..│  │ Revenue      │ Receivables  │ Payables     │ Balance      │  │
│          │  │              │              │              │              │  │
│  💸      │  │ 2.5B ₫       │ 350M ₫       │ 180M ₫       │ 1.2B ₫       │  │
│ Payables│  │ +12.5% ▲     │ 12 invoices  │ 8 pending    │ Healthy ✓    │  │
│          │  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│  💵      │                                                                  │
│ Cash Flow│ Revenue & Cost Trend (Last 6 Months)                            │
│          │  ┌───────────────────────────────────────────────────────────┐  │
│  📁      │  │  Amount                                                    │  │
│ Projects│  │  500M│                         ╱╲                          │  │
│          │  │     │                    ╱───╱  ╲───╲                      │  │
│  📊      │  │  400M│               ╱───╱          ╲───╲                  │  │
│ Reports  │  │     │          ╱───╱                    ╲───╱             │  │
│          │  │  300M│     ╱───╱                                          │  │
│  🔄      │  │     │╱───╱                                                │  │
│ Reconcil.│  │  200M├───────────────────────────────────────────────────│  │
│          │  │     Jan   Feb   Mar   Apr   May   Jun                    │  │
│  ⚠      │  │     ━━ Revenue   ━━ Cost                                  │  │
│ Disputes │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│  📜      │  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│ Audit Log│  │ Payment Status          │  │ Cash Flow Forecast (30d)    │  │
│          │  │                         │  │                             │  │
│  ⚙      │  │  Paid 68%              │  │  ┌───┬───┬───┬───┬───┐     │  │
│ Settings │  │  Pending 22%           │  │  │ + │ + │ - │ + │ + │     │  │
│          │  │  Overdue 10%           │  │  └───┴───┴───┴───┴───┘     │  │
│          │  │                         │  │  Projected: +450M ₫ ▲       │  │
│          │  │ [Pie Chart]             │  │                             │  │
│          │  └─────────────────────────┘  └─────────────────────────────┘  │
│          │                                                                  │
│          │  Recent Financial Activities                                    │
│          │  ┌────────────────────────────────────────────────────────────┐│
│          │  │ Date       │ Activity                           │ Amount    ││
│          │  ├────────────┼────────────────────────────────────┼──────────┤│
│          │  │ 2025-02-12 │ Payment received - ABC Company     │ +50M ₫   ││
│          │  │ 2025-02-11 │ Payment made - XYZ Outsource       │ -30M ₫   ││
│          │  │ 2025-02-11 │ Milestone created - PROJ-045       │ 100M ₫   ││
│          │  │ 2025-02-10 │ Payment confirmed - DEF Corp       │ +75M ₫   ││
│          │  │ 2025-02-10 │ Report generated - Revenue Q4      │ -        ││
│          │  └────────────┴────────────────────────────────────┴──────────┘│
│          │                                                                  │
│          │  ⚠️ Alerts & Warnings                       [View All →]        │
│          │  ┌────────────────────────────────────────────────────────────┐│
│          │  │ 🔴 3 receivables overdue >30 days (Total: 45M ₫)           ││
│          │  │ 🟡 5 payments approaching due date in 7 days                ││
│          │  │ 🟠 PROJ-023: Low profit margin (8%)                         ││
│          │  └────────────────────────────────────────────────────────────┘│
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. KPI Cards (Top Row)

**4 Cards in 1 row (4-4-4 grid on desktop)**

#### Card 1: Total Revenue
- **Icon:** 💵 (green)
- **Title:** "Total Revenue"
- **Value:** 2.5B ₫ (large, bold, blue)
- **Trend:** +12.5% ▲ (green, small text)
- **Period:** "vs last month" (gray, caption)

#### Card 2: Outstanding Receivables
- **Icon:** 💸 (yellow)
- **Title:** "Outstanding Receivables"
- **Value:** 350M ₫ (large, bold)
- **Subtext:** "12 invoices" (gray)
- **Click:** Navigate to AR view

#### Card 3: Outstanding Payables
- **Icon:** 📤 (red)
- **Title:** "Outstanding Payables"
- **Value:** 180M ₫ (large, bold)
- **Subtext:** "8 pending" (gray)
- **Click:** Navigate to AP view

#### Card 4: Cash Balance
- **Icon:** 💳 (blue)
- **Title:** "Cash Balance"
- **Value:** 1.2B ₫ (large, bold, green)
- **Status:** "Healthy ✓" (green badge)
- **Click:** Navigate to Cash Flow

### 2. Revenue & Cost Trend Chart

**Line chart (full width)**
- **Type:** Dual-line chart
- **X-axis:** Last 6 months (Jan - Jun 2025)
- **Y-axis:** Amount (VND)
- **Lines:**
  - Revenue: Blue line
  - Cost: Red line
- **Interaction:** Hover to show exact values
- **Legend:** Bottom center

### 3. Payment Status & Cash Flow Cards

**2 Cards side-by-side (6-6 grid)**

#### Left: Payment Status Distribution
- **Type:** Pie chart
- **Segments:**
  - Paid: 68% (green)
  - Pending: 22% (yellow)
  - Overdue: 10% (red)
- **Legend:** Right side
- **Total:** "Total: 530M ₫"

#### Right: Cash Flow Forecast
- **Type:** Bar chart (mini)
- **Period:** Next 30 days (5-day intervals)
- **Bars:**
  - Green: Cash in
  - Red: Cash out
- **Projection:** "Projected: +450M ₫ ▲" (green)

### 4. Recent Financial Activities Table

**5 most recent activities**
- **Columns:**
  - Date (2025-02-12)
  - Activity (description + related entity)
  - Amount (color-coded: green +, red -)
- **Row hover:** Light blue background
- **Click row:** Navigate to detail
- **View All button:** Top right

### 5. Alerts & Warnings Section

**Alert cards với priority colors:**
- **Red (🔴):** Critical (overdue >30 days)
- **Yellow (🟡):** Warning (approaching due date)
- **Orange (🟠):** Attention (low margin, issues)

**Each alert:**
- Icon + priority color
- Count/number
- Brief description
- Amount (if applicable)
- **Click:** Navigate to related view

---

## Interactions

### KPI Card Clicks
- **Total Revenue** → Navigate to Revenue Report
- **Outstanding Receivables** → Navigate to AR view with filter "status=pending"
- **Outstanding Payables** → Navigate to AP view with filter "status=approved"
- **Cash Balance** → Navigate to Cash Flow dashboard

### Chart Interactions
- **Hover:** Show tooltip with exact value
- **Click data point:** Drill down to monthly detail
- **Zoom:** Mouse wheel to zoom in/out (if >12 months data)

### Recent Activities
- **Click row:** Navigate to related entity (payment, project, report)
- **View All:** Navigate to full activity log

###Alerts
- **Click alert:** Navigate to filtered view (e.g., overdue receivables)
- **Dismiss:** (X button) Hide alert temporarily
- **View All:** Navigate to alerts dashboard

---

## Filters & Actions

### Date Range Filter
**Top right corner:**
```
[Today ▼] [This Week] [This Month] [This Quarter] [Custom...]
```

**Options:**
- Today
- This Week
- This Month
- This Quarter
- This Year
- Last Month / Quarter / Year
- Custom date range (datepicker)

**Default:** This Month

### Action Buttons
**Top right:**
- [Export Dashboard] (PDF/Excel)
- [Refresh] (⟳ icon)
- [Settings] (⚙️ icon)

---

## Auto-Refresh

**Behavior:**
- Auto-refresh every 5 minutes
- Show "Updated 2 minutes ago" (bottom right)
- Loading indicator during refresh (subtle spinner)
- No page reload, data update only

---

## Responsive Behavior

### 1920px (Large Desktop)
- 4 KPI cards in one row
- Charts full width
- 2-column layout for payment status / forecast cards

### 1366px (Standard Desktop)
- 4 KPI cards in one row (slightly smaller)
- Charts full width
- 2-column layout maintained

### 1280px (Minimum Desktop)
- 2 KPI cards per row (2 rows total)
- Charts full width
- Payment status / forecast cards stacked (1 column)

### <1024px
- Display warning: "This application requires desktop (min 1024px)"
- Prevent usage

---

## Colors & Styling

### KPI Card Colors
- **Revenue:** Blue icon (#1890ff)
- **Receivables:** Yellow icon (#faad14)
- **Payables:** Red icon (#ff4d4f)
- **Cash Balance:** Green icon (#52c41a)

### Number Colors
- **Positive (revenue, profit):** Green (#52c41a)
- **Negative (costs, losses):** Red (#ff4d4f)
- **Neutral:** Gray (#8c8c8c)

### Chart Colors
- **Revenue line:** Blue (#1890ff)
- **Cost line:** Red (#ff4d4f)
- **Forecast bars:** Green/Red with transparency

### Alert Colors
- **Critical:** Red background (#fff1f0), red border
- **Warning:** Yellow background (#fffbe6), yellow border
- **Attention:** Orange background (#fff7e6), orange border

---

## Empty States

**If no financial data:**
```
┌─────────────────────────────┐
│                             │
│        📊 Icon              │
│                             │
│   No financial data yet     │
│                             │
│  Start by creating payment  │
│  milestones for projects    │
│                             │
│  [Go to Projects]           │
│                             │
└─────────────────────────────┘
```

---

## Loading States

### Initial Load
- Show skeleton cards (gray blocks with animation)
- Load KPIs first → Charts → Tables
- Progressive loading (don't wait for everything)

### Chart Loading
- Show loading spinner in chart area
- Text: "Loading data..."

### Table Loading
- Show skeleton rows (3-5 rows)
- Animated shimmer effect

---

## Accessibility

- **ARIA labels:** All cards, charts, and interactive elements
- **Keyboard navigation:** Tab through KPI cards, chart, table rows
- **Focus indicators:** Blue outline (2px) on focused elements
- **Screen reader:** Announce KPI values, chart data points
- **Color blindness:** Don't rely on color alone (use icons + text)

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 01 (Financial Dashboard Overview)  
**Dependencies:** None (home screen)
