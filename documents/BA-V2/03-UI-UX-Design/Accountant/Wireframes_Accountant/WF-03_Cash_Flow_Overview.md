# WF-03: Cash Flow Overview

**Role:** Accountant  
**Screen:** Cash Flow Dashboard  
**Size:** Desktop (1920×1080 recommended)  

---

## Purpose

Monitor cash flow, forecast future cash positions, và analyze cash in/out trends.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Dashboard > Cash Flow                                                        │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Cash Flow Dashboard                        [Filter: Last 6 months ▼]│
│[Sidebar] │                                                                  │
│          │  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│          │  │ Current      │ Available    │ Reserved for │ Forecast     │  │
│          │  │ Balance      │ for Payment  │ Commitments  │ (30 days)    │  │
│          │  │              │              │              │              │  │
│          │  │ 1.2B ₫       │ 1.0B ₫       │ 200M ₫       │ +450M ₫ ▲    │  │
│          │  │ ✅ Healthy   │              │              │ Positive     │  │
│          │  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│          │                                                                  │
│          │  Cash Flow Timeline (Last 6 Months)                              │
│          │  ┌───────────────────────────────────────────────────────────┐  │
│          │  │ Amount                                                     │  │
│          │  │ 800M │                                                     │  │
│          │  │      │    ┌───┐     ┌───┐          ┌───┐     ┌───┐       │  │
│          │  │ 600M │    │░░░│     │░░░│          │░░░│     │░░░│       │  │
│          │  │      │ ┌──┤▓▓▓│  ┌──┤▓▓▓│       ┌──┤▓▓▓│  ┌──┤▓▓▓│       │  │
│          │  │ 400M │ │▓▓│▓▓▓│  │▓▓│▓▓▓│    ┌──┤▓▓│▓▓▓│  │▓▓│▓▓▓│       │  │
│          │  │      │ │▓▓│▓▓▓│  │▓▓│▓▓▓│ ┌──┤▓▓│▓▓│▓▓▓│  │▓▓│▓▓▓│       │  │
│          │  │ 200M │ │▓▓│▓▓▓│  │▓▓│▓▓▓│ │▓▓│▓▓│▓▓│▓▓▓│  │▓▓│▓▓▓│       │  │
│          │  │   0  ├─┴──┴───┴──┴──┴───┴─┴──┴──┴──┴───┴──┴──┴───┴───────│  │
│          │  │      Jan  Feb  Mar  Apr  May  Jun                         │  │
│          │  │                                                            │  │
│          │  │  ▓▓ Cash In (Receivables)   ░░ Cash Out (Payables)        │  │
│          │  │  ── Net Cash Flow (Blue line overlay)                     │  │
│          │  └───────────────────────────────────────────────────────────┘  │
│          │                                                                  │
│          │  ┌──────────────────────────────────┐ ┌──────────────────────┐ │
│          │  │ Cash In Forecast (Next 90 days)  │ │ Cash Out Forecast    │ │
│          │  │                                  │ │                      │ │
│          │  │ Week 1 (Feb 12-18):   +120M ₫   │ │ Week 1:   -80M ₫     │ │
│          │  │ Week 2 (Feb 19-25):   +80M ₫    │ │ Week 2:   -60M ₫     │ │
│          │  │ Week 3 (Feb 26-Mar 3): +150M ₫  │ │ Week 3:   -90M ₫     │ │
│          │  │ Week 4 (Mar 4-10):    +100M ₫   │ │ Week 4:   -70M ₫     │ │
│          │  │ ────────────────────────────     │ │ ─────────────────    │ │
│          │  │ Total (30 days): +450M ₫ ✅      │ │ Total: -300M ₫       │ │
│          │  │                                  │ │ Net: +150M ₫ ✅      │ │
│          │  └──────────────────────────────────┘ └──────────────────────┘ │
│          │                                                                  │
│          │  Cash Flow Transactions                       [Export] [Filter] │
│          │  ┌────────────────────────────────────────────────────────────┐ │
│          │  │ Date   │ Type    │ Description           │ Cash In │ Cash Out│ Balance│
│          │  ├────────────────────────────────────────────────────────────┤ │
│          │  │ 02-12  │ Receipt │ ABC Co - PROJ-001     │ +50M ₫  │         │1.2B ₫ │
│          │  │ 02-11  │ Payment │ XYZ Outsource         │         │ -30M ₫  │1.15B ₫│
│          │  │ 02-10  │ Receipt │ DEF Corp - PROJ-023   │ +75M ₫  │         │1.18B ₫│
│          │  │ 02-09  │ Payment │ Material Supplier     │         │ -20M ₫  │1.105B │
│          │  │ 02-08  │ Receipt │ GHI Ltd - PROJ-045    │ +100M ₫ │         │1.125B │
│          │  └────────────────────────────────────────────────────────────┘ │
│          │               [Load More]                                        │
│          │                                                                  │
│          │  ⚠️ Cash Alerts                                                  │
│          │  ┌────────────────────────────────────────────────────────────┐ │
│          │  │ 🟡 Projected low balance on Mar 15 (estimated: 850M ₫)      │ │
│          │  │ 🔵 Large payment expected: PROJ-001 Final (100M ₫) on Apr 30│ │
│          │  └────────────────────────────────────────────────────────────┘ │
│          │                                                                  │
│          │  [Set Cash Alert] [Download Cash Flow Report] [Refresh Data]    │
│          │                                                                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Cash KPI Cards (4 cards)
- **Current Balance:** Available cash
- **Available for Payment:** After reserved commitments
- **Reserved for Commitments:** Approved payables
- **Forecast (30 days):** Projected net cash flow

### 2. Cash Flow Timeline Chart
- **Type:** Stacked bar + line chart
- **Bars:** Green (cash in), Red (cash out)
- **Line:** Blue (net cash flow cumulative)
- **Period:** Configurable (1/3/6/12 months)

### 3. Forecast Panels (2 panels side-by-side)
**Left: Cash In Forecast**
- Weekly breakdown (next 4 weeks)
- Total expected receipts

**Right: Cash Out Forecast**
- Weekly breakdown
- Total expected payments
- **Net Forecast:** Bold, color-coded

### 4. Cash Flow Transactions Table
- **Columns:** Date, Type, Description, Cash In, Cash Out, Running Balance
- **Color coding:** Green (+), Red (-)
- **Pagination:** 20 rows per page

### 5. Cash Alerts
- Low balance warnings
- Large payment notifications
- **Set Alert button:** Configure threshold alerts

---

## Interactions

- **Chart hover:** Show exact amounts
- **Chart click:** Drill down to daily/weekly details
- **Filter transactions:** By type (Receipt/Payment), date range
- **Export:** Generate cash flow statement (PDF/Excel)
- **Set Cash Alert:** Configure threshold và recipients

---

**Wireframe Status:** ✅ Complete  
**Relatedflows:** FLOW 08 (Cash Flow Analysis)
