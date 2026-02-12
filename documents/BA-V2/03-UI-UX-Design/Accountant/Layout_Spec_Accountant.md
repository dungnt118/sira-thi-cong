# 📐 LAYOUT SPECIFICATION - Accountant

**SIRA Service Management Platform**  
**Role:** Accountant (Kế toán)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. DESIGN PHILOSOPHY

### Desktop-Only Strategy

**Platform focus: Desktop workstation environments ONLY**

Accountant role requires:
- **Dense data displays** (financial tables, charts)
- **Multi-panel layouts** (dashboard with multiple KPIs)
- **Complex forms** (payment confirmation, report generation)
- **Large datasets** (AR/AP aging reports, transaction lists)
- **Data visualization** (charts, graphs, timelines)

**Minimum viewport:** 1280px width recommended (support down to 1024px)  
**Optimal viewport:** 1920px × 1080px (Full HD)

**Why desktop-only:**
- Financial work requires large screen real estate
- Multi-tasking (view invoice while entering payment)
- Keyboard-heavy workflow (number entry, shortcuts)
- Accountants work from office, not field work
- Complex data visualization không suitable cho mobile

---

## 2. RESPONSIVE BREAKPOINTS

### Desktop Breakpoints

```css
/* Large desktop (recommended) */
@media (min-width: 1920px) {
  /* 3-column dashboard layout */
  /* More KPI cards visible */
  /* Larger charts */
}

/* Standard desktop */
@media (min-width: 1366px) and (max-width: 1919px) {
  /* 2-column dashboard layout */
  /* Standard card size */
}

/* Minimum desktop */
@media (min-width: 1024px) and (max-width: 1365px) {
  /* 1-2 column layout (responsive) */
  /* Compact cards */
  /* Stacked panels */
}

/* Below 1024px: Show warning */
@media (max-width: 1023px) {
  /* Display message: "This application requires desktop (min 1024px)" */
  /* Prevent usage */
}
```

**No tablet/mobile breakpoints** - Financial application requires desktop

---

## 3. GRID SYSTEM

### 12-Column Grid

```
Container: Fluid (max-width: 1920px)
Columns: 12
Gutter: 24px
Margin: 32px (desktop), 16px (compact)
```

### Column Distribution

**Dashboard layout (1920px):**
```
[Sidebar: 2 cols] [Main: 7 cols] [Right panel: 3 cols]
```

**Dashboard layout (1366px):**
```
[Sidebar: 2 cols] [Main: 10 cols]
(Right panel: collapsed to sidebar menu)
```

**Form layouts:**
- 2-column forms: 6+6 columns
- 3-column forms: 4+4+4 columns
- Full-width fields: 12 columns

---

## 4. SPACING SYSTEM

### 8px Base Scale

```scss
$spacing: (
  'xs': 4px,    // Tight spacing (icon-label gap)
  'sm': 8px,    // Component internal spacing
  'md': 16px,   // Card padding, section spacing
  'lg': 24px,   // Panel spacing
  'xl': 32px,   // Major section spacing
  'xxl': 48px,  // Page section dividers
  'xxxl': 64px  // Dashboard section spacing
);
```

**Usage:**
- **Card padding:** 24px (lg)
- **Section gaps:** 32px (xl)
- **Table cell padding:** 12px (8px + 4px)
- **Form field spacing:** 16px (md)
- **Button padding:** 8px 16px (sm md)

---

## 5. TYPOGRAPHY

### Font Family

```css
/* Primary font */
font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (for numbers, codes) */
font-family: 'Roboto Mono', 'Courier New', monospace;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 32px | 600 | 40px | Page title |
| **H2** | 24px | 600 | 32px | Section header |
| **H3** | 20px | 600 | 28px | Subsection header |
| **H4** | 18px | 600 | 24px | Card header |
| **Body Large** | 16px | 400 | 24px | Primary content |
| **Body** | 14px | 400 | 20px | Standard text |
| **Body Small** | 12px | 400 | 16px | Secondary text, captions |
| **Number Large** | 32px | 700 | 40px | KPI values |
| **Number Medium** | 24px | 600 | 32px | Chart labels |
| **Number Small** | 14px | 500 | 20px | Table numbers (Roboto Mono) |

### Financial Number Formatting

```javascript
// Currency (VND)
formatCurrency(1234567890) → "1,234,567,890 ₫"
formatCurrency(1234567890, {compact: true}) → "1.2B ₫"

// Percentage
formatPercentage(45.67) → "45.67%"
formatPercentage(45.67, {decimals: 0}) → "46%"

// Number
formatNumber(1234567) → "1,234,567"
formatNumber(1234567, {compact: true}) → "1.2M"

// Decimal
formatDecimal(45.678) → "45.68" (2 decimals default)
```

**Number display rules:**
- **Positive numbers:** Green color
- **Negative numbers:** Red color, prefix "-"
- **Zero:** Gray color
- **Large numbers:** Compact format (1.2B, 5.3M)
- **Table numbers:** Right-aligned, Roboto Mono
- **KPI numbers:** Large, bold, color-coded

---

## 6. COLOR SYSTEM

### Brand Colors

```scss
$primary: #1890ff;      // Blue (primary actions)
$primary-light: #40a9ff;
$primary-dark: #096dd9;

$secondary: #52c41a;    // Green (success, profit)
$secondary-light: #73d13d;
$secondary-dark: #389e0d;
```

### Semantic Colors

```scss
// Financial colors (CUSTOM for Accountant)
$profit: #52c41a;       // Green (profit, positive balance)
$loss: #ff4d4f;         // Red (loss, negative balance)
$warning: #faad14;      // Yellow (overdue, alerts)
$neutral: #8c8c8c;      // Gray (zero, neutral)

// Status colors
$status-paid: #52c41a;      // Green
$status-pending: #faad14;   // Yellow
$status-overdue: #ff4d4f;   // Red
$status-disputed: #722ed1;  // Purple
$status-cancelled: #8c8c8c; // Gray
```

### Chart Colors

```scss
// Revenue chart
$revenue-color: #1890ff;    // Blue
$cost-color: #ff4d4f;       // Red
$profit-color: #52c41a;     // Green

// AR/AP aging buckets
$aging-current: #52c41a;    // 0-30 days: Green
$aging-30-60: #faad14;      // 31-60 days: Yellow
$aging-60-90: #fa8c16;      // 61-90 days: Orange
$aging-90-plus: #ff4d4f;    // 90+ days: Red

// Pie chart palette
$chart-colors: [
  #1890ff, #52c41a, #faad14, #ff4d4f,
  #722ed1, #13c2c2, #eb2f96, #fa8c16
];
```

### Neutral Colors

```scss
$gray-1: #ffffff;
$gray-2: #fafafa;  // Background
$gray-3: #f5f5f5;  // Card background
$gray-4: #f0f0f0;  // Disabled
$gray-5: #d9d9d9;  // Borders
$gray-6: #bfbfbf;  // Icons
$gray-7: #8c8c8c;  // Secondary text
$gray-8: #595959;  // Primary text
$gray-9: #434343;  // Headings
$gray-10: #262626; // Dark text
```

### Background Colors

```scss
$bg-page: #f0f2f5;        // Page background
$bg-card: #ffffff;        // Card background
$bg-hover: #fafafa;       // Hover state
$bg-selected: #e6f7ff;    // Selected row
$bg-disabled: #f5f5f5;    // Disabled bg
```

---

## 7. NAVIGATION

### Top Bar (Global)

**Height:** 64px  
**Background:** #001529 (dark blue)  
**Position:** Fixed top  

**Structure:**
```
[Logo] [App Name: "SIRA"] [Spacer] [Notifications] [User Menu]
```

**Components:**
- **Logo:** 40×40px
- **App name:** White, 20px, bold
- **Notifications:** Icon + badge (red dot if unread)
- **User menu:** Avatar + name + dropdown
  - Thông tin tài khoản
  - Đổi mật khẩu
  - Đăng xuất

### Side Navigation

**Width:** 
- Expanded: 256px
- Collapsed: 80px (icon only)

**Background:** #ffffff  
**Position:** Fixed left  

**Menu items (Accountant-specific):**

```
📊 Dashboard (Financial Dashboard)
├─ 💰 Receivables (AR)
│  ├─ Pending Receivables
│  ├─ Overdue Receivables
│  └─ AR Aging Report
├─ 💸 Payables (AP)
│  ├─ Pending Payables
│  ├─ Approved Payables
│  └─ AP Aging Report
├─ 📝 Payment Milestones
│  ├─ All Milestones
│  ├─ Create Milestone
│  └─ Milestone Calendar
├─ 💵 Cash Flow
│  ├─ Cash Flow Dashboard
│  ├─ Forecast
│  └─ Transaction Log
├─ 📁 Projects (Financial View)
│  ├─ Active Projects
│  ├─ Completed Projects
│  └─ Project Financial Summary
├─ 📊 Reports
│  ├─ Revenue Report
│  ├─ Profit & Loss
│  ├─ Cash Flow Statement
│  ├─ AR/AP Aging
│  └─ Tax Report (VAT)
├─ 🔄 Reconciliation
│  ├─ Payment Reconciliation
│  ├─ Bank Statement Upload
│  └─ Reconciliation History
├─ ⚠️ Disputes
│  ├─ Open Disputes
│  ├─ Resolved Disputes
│  └─ Dispute Dashboard
├─ 📜 Audit Log
│  └─ Financial Activities
└─ ⚙️ Settings
   ├─ Tax Settings
   ├─ Bank Accounts
   └─ Payment Terms
```

**Menu item states:**
- Default: Gray icon + text
- Hover: Blue background (light)
- Active: Blue icon + text + blue left border (4px)
- Disabled: Gray + 50% opacity

### Breadcrumbs

**Location:** Below top bar, left side  
**Format:** Home / Receivables / Pending Receivables  

```
Dashboard > Receivables > Pending Receivables > REC-2025-001
```

**Styling:**
- Separator: `/` (gray)
- Links: Blue (clickable)
- Current page: Gray (not clickable)

---

## 8. FINANCIAL COMPONENTS

### 8.1 KPI Cards

**Dimensions:**
- Width: Flexible (grid)
- Height: 120px
- Padding: 24px
- Border-radius: 8px
- Background: White
- Shadow: 0 2px 8px rgba(0,0,0,0.08)

**Structure:**
```
┌───────────────────────────────────┐
│ [Icon]  Title              [Trend]│
│                                   │
│ Value (Large number)              │
│ Change: +5.2% vs last month       │
└───────────────────────────────────┘
```

**Example:**
```
💰 Total Revenue
1,234,567,890 ₫
+12.5% vs last month ▲
```

**Variants:**
- **Positive:** Green icon, green trend
- **Negative:** Red icon, red trend
- **Neutral:** Blue icon, gray trend

### 8.2 Financial Summary Table

**Table structure:**
```
┌──────────┬──────────┬──────────┬──────────┬───────┐
│ Project  │ Revenue  │ Cost     │ Profit   │ Margin│
├──────────┼──────────┼──────────┼──────────┼───────┤
│ PROJ-001 │ 100M ₫   │ 70M ₫    │ 30M ₫    │ 30%   │
│ PROJ-002 │ 200M ₫   │ 150M ₫   │ 50M ₫    │ 25%   │
└──────────┴──────────┴──────────┴──────────┴───────┘
```

**Features:**
- **Header row:** Bold, gray background
- **Sortable columns:** Click header to sort (▲▼ indicators)
- **Number alignment:** Right-aligned
- **Row hover:** Light blue background
- **Row selection:** Checkbox + blue background
- **Totals row:** Bold, top border
- **Pagination:** Bottom, 10/20/50/100 per page

**Color coding:**
- **Revenue column:** Blue
- **Cost column:** Gray
- **Profit column:** Green (positive) / Red (negative)
- **Margin column:** Green (>20%) / Yellow (10-20%) / Red (<10%)

### 8.3 Payment Status Badge

**Sizes:**
- Small: 20px height
- Medium: 24px height
- Large: 32px height

**Variants:**

```jsx
<Badge status="paid">Paid</Badge>        // Green
<Badge status="pending">Pending</Badge>  // Yellow
<Badge status="overdue">Overdue</Badge>  // Red
<Badge status="disputed">Disputed</Badge>// Purple
<Badge status="cancelled">Cancelled</Badge>// Gray
```

**Styling:**
- Border-radius: 12px (pill shape)
- Padding: 4px 12px
- Font-weight: 500
- Font-size: 12px
- Icon (optional): Left side

### 8.4 Payment Timeline

**Visual representation của payment history:**

```
Jan 2025  Feb 2025  Mar 2025  Apr 2025
   ├─────────┼─────────┼─────────┼─────
   ●         ●         ○         ○
  Paid      Paid    Pending   Pending
  20M ₫     30M ₫     25M ₫     25M ₫
```

**Components:**
- **Timeline line:** Horizontal gray line
- **Milestone dot:** 
  - Filled (●): Paid (green)
  - Empty (○): Pending (gray)
  - Red filled: Overdue
- **Date label:** Above timeline
- **Amount label:** Below timeline
- **Milestone name:** Tooltip on hover

### 8.5 Cash Flow Chart

**Chart type:** Combined Line + Bar chart

**Structure:**
```
Cash Amount
│    ┌─┐                    ┌─┐
│    │ │         ┌─┐        │ │
│ ┌─┐│ │      ┌─┐│ │     ┌─┐│ │
│ │▓││▓│   ┌─┐│▓││▓│  ┌─┐│▓││▓│
│ │▓││▓│┌─┐│▓││▓││▓│┌─┐│▓││▓││▓│
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─
  Jan  Feb  Mar  Apr  May  Jun
  
Green bars: Cash in (receipts)
Red bars: Cash out (payments)
Blue line: Net cash flow (cumulative)
```

**Interactions:**
- **Hover:** Show exact values
- **Click bar:** Drill down to transactions
- **Zoom:** Mouse wheel to zoom in/out
- **Pan:** Click + drag to pan

### 8.6 AR/AP Aging Chart

**Chart type:** Stacked bar chart

```
Amount
│  ┌──────────┐
│  │   Red    │ 90+ days
│  │  Orange  │ 61-90 days
│  │  Yellow  │ 31-60 days
│  │  Green   │ 0-30 days
└──┴──────────┴─────────────
   Current    Aged
```

**Legend:**
- Green: Current (0-30 days)
- Yellow: 31-60 days
- Orange: 61-90 days
- Red: Over 90 days

**Interactions:**
- **Hover segment:** Show amount for that aging bucket
- **Click segment:** Filter table to that aging bucket

---

## 9. FORM COMPONENTS

### 9.1 Payment Confirmation Form

**Layout:** Modal dialog (600px width)

**Structure:**
```
┌─────────────────────────────────────┐
│ Confirm Payment              [X]    │
├─────────────────────────────────────┤
│ Payment Details                     │
│ Customer: ABC Company               │
│ Project: PROJ-001                   │
│ Milestone: Đặt cọc (Deposit)        │
│ Amount due: 50,000,000 ₫            │
│                                     │
│ Actual Payment Information          │
│ ┌─────────────────────────────┐    │
│ │ Actual amount *             │    │
│ │ 50,000,000 ₫               │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Payment date *              │    │
│ │ [2025-02-12] [📅]          │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Bank reference *            │    │
│ │ FT20250212ABC123           │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Payment method *            │    │
│ │ [Bank Transfer ▼]          │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Upload proof (optional)     │    │
│ │ [Upload file] proof.pdf    │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Note (optional)             │    │
│ │                             │    │
│ └─────────────────────────────┘    │
│                                     │
│        [Cancel] [Confirm Payment]   │
└─────────────────────────────────────┘
```

**Field components:**
- **Text input:** Border, 40px height
- **Number input:** Right-aligned, Roboto Mono
- **Date picker:** Calendar icon, popup calendar
- **Dropdown:** Chevron icon, option list
- **File upload:** Browse button + file name display
- **Textarea:** Multi-line, 80px height

**Validation:**
- **Real-time:** Validate on blur
- **Error message:** Red text below field
- **Required indicator:** Red asterisk (*)
- **Disable submit:** If validation fails

### 9.2 Report Generator Form

**Layout:** Full-width panel

**Structure:**
```
┌──────────────────────────────────────────────────┐
│ Financial Report Generator                       │
├──────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐        │
│ │ Report Type *   │  │ Date Range *    │        │
│ │ [P&L ▼]        │  │ [Q4 2025 ▼]    │        │
│ └─────────────────┘  └─────────────────┘        │
│                                                  │
│ ┌──────────────────────────────────────┐        │
│ │ Projects (multi-select)              │        │
│ │ ☑ PROJ-001 - Project Alpha           │        │
│ │ ☑ PROJ-002 - Project Beta            │        │
│ │ ☐ PROJ-003 - Project Gamma           │        │
│ │ [Select All] [Clear]                 │        │
│ └──────────────────────────────────────┘        │
│                                                  │
│ ┌─────────────────┐  ┌─────────────────┐        │
│ │ Group by        │  │ Format          │        │
│ │ [Month ▼]      │  │ ☑ PDF ☑ Excel  │        │
│ └─────────────────┘  └─────────────────┘        │
│                                                  │
│ ☑ Include charts                                │
│ ☑ Include details                               │
│                                                  │
│            [Reset] [Generate Report]             │
└──────────────────────────────────────────────────┘
```

**Components:**
- **Multi-select:** Checkbox list với scrollable container
- **Checkbox:** Ant Design checkbox component
- **Dropdown:** Searchable dropdown với nhiều options
- **Button group:** Reset (secondary) + Generate (primary)

---

## 10. DATA VISUALIZATION

### 10.1 Chart Library

**Library:** Apache ECharts (hoặc Ant Design Charts)

**Chart types:**
- **Line chart:** Revenue trend, cash flow trend
- **Bar chart:** Monthly revenue/cost comparison
- **Stacked bar:** AR/AP aging breakdown
- **Pie chart:** Payment distribution, cost breakdown
- **Combined chart:** Cash flow (line + bar)
- **Gauge chart:** Collection rate, profit margin
- **Treemap:** Project contribution to revenue

### 10.2 Chart Design Guidelines

**Colors:**
- Use semantic colors (green for revenue, red for cost)
- Max 8 colors in one chart
- Use color-blind friendly palette

**Axes:**
- **X-axis:** Time (months/quarters), categories
- **Y-axis:** Amounts (VND), percentages (%)
- **Format:** Use compact notation (1.2M, 5.3B)
- **Grid lines:** Light gray, subtle

**Labels:**
- **Data label:** Show on hover (tooltip)
- **Axis label:** 12px, gray
- **Legend:** Bottom or right side
- **Title:** 16px, bold, top

**Interactions:**
- **Hover:** Highlight data point + show tooltip
- **Click:** Drill down to details (if applicable)
- **Zoom:** Allow zoom on timeline charts
- **Export:** Download chart as PNG/SVG

### 10.3 Empty States

**When no data:**
```
┌────────────────────────┐
│                        │
│       📊 Icon          │
│                        │
│  No data available     │
│                        │
│  Try adjusting filters │
│  or date range         │
│                        │
│   [Reset Filters]      │
│                        │
└────────────────────────┘
```

**Design:**
- **Icon:** Large, gray (64×64px)
- **Message:** 16px, gray, centered
- **Action button:** Optional (create/reset)

---

## 11. FEEDBACK COMPONENTS

### 11.1 Toast Notifications

**Position:** Top-right corner  
**Duration:** 3-5 seconds (auto-dismiss)  
**Max stack:** 3 toasts  

**Variants:**
```jsx
// Success
<Toast type="success">
  Payment confirmed successfully!
</Toast>

// Error
<Toast type="error">
  Failed to confirm payment. Please try again.
</Toast>

// Warning
<Toast type="warning">
  Partial payment detected. Remaining balance: 20M ₫
</Toast>

// Info
<Toast type="info">
  Report generation in progress...
</Toast>
```

**Design:**
- **Width:** 320px
- **Padding:** 16px
- **Border-radius:** 8px
- **Icon:** Left side (24×24px)
- **Close button:** Right side (X icon)
- **Shadow:** 0 4px 12px rgba(0,0,0,0.15)

### 11.2 Loading Indicators

**Types:**

**Full-page loading:**
```
┌─────────────────────────────┐
│                             │
│           ⏳                │
│    Loading dashboard...     │
│                             │
└─────────────────────────────┘
```

**Inline loading (table):**
```
┌─────────────────┐
│ Loading data... │
│     ⏳ ━━━━    │
└─────────────────┘
```

**Button loading:**
```
[⏳ Processing...] (disabled)
```

**Skeleton loading (cards):**
```
┌─────────────────┐
│ ▓▓▓▓▓          │
│ ▓▓▓▓▓▓▓        │
│ ▓▓▓▓           │
└─────────────────┘
```

### 11.3 Empty States

**Variations:**

**No data (filters):**
```
📊 No transactions found
Try adjusting your filters or date range
[Reset Filters]
```

**No data (first use):**
```
💰 No receivables yet
Start by creating payment milestones for your projects
[Go to Projects]
```

**Error state:**
```
⚠️ Failed to load data
Server connection error. Please try again.
[Retry]
```

---

## 12. ACCESSIBILITY

### WCAG 2.1 AA Compliance

**Color contrast:**
- **Text on white:** Ratio ≥ 4.5:1
- **Large text (18px+):** Ratio ≥ 3:1
- **Icons:** Ratio ≥ 3:1

**Keyboard navigation:**
- **Tab order:** Logical flow (top to bottom, left to right)
- **Focus indicator:** Blue outline (2px)
- **Skip navigation:** "Skip to main content" link
- **Shortcuts:** See section 13

**Screen reader support:**
- **ARIA labels:** All interactive elements
- **ARIA roles:** Proper semantic roles
- **Alt text:** All images và icons
- **Table headers:** <th> với scope attribute

**Forms:**
- **Labels:** Associated với inputs (for/id)
- **Required fields:** aria-required="true"
- **Error messages:** aria-invalid + aria-describedby
- **Field groups:** <fieldset> + <legend>

---

## 13. KEYBOARD SHORTCUTS

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Global search |
| `Ctrl + /` | Show shortcuts help |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + ,` | Settings |
| `Esc` | Close dialog/modal |

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + 1` | Go to Dashboard |
| `Alt + 2` | Go to Receivables |
| `Alt + 3` | Go to Payables |
| `Alt + 4` | Go to Cash Flow |
| `Alt + 5` | Go to Reports |

### Action Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save form/report |
| `Ctrl + P` | Print report |
| `Ctrl + E` | Export data |
| `Ctrl + N` | New milestone/payment |
| `Ctrl + F` | Filter table |

### Table Shortcuts

| Shortcut | Action |
|----------|--------|
| `↑ ↓` | Navigate rows |
| `Enter` | Open selected row |
| `Space` | Select/deselect row |
| `Ctrl + A` | Select all |
| `Delete` | Delete selected (with confirmation) |

---

## 14. PERFORMANCE

### Optimization Strategies

**Lazy loading:**
- **Charts:** Load after page render
- **Tables:** Virtual scrolling (show 20 rows initially)
- **Images:** Lazy load payment proofs

**Pagination:**
- **Default:** 20 items per page
- **Options:** 10, 20, 50, 100
- **Server-side:** For large datasets (>1000 rows)

**Caching:**
- **Dashboard data:** Cache 5 minutes
- **Static data:** Cache 1 hour (bank list, tax rates)
- **Reports:** Cache generated reports for 15 minutes

**Code splitting:**
- **Route-based:** Split by main routes
- **Component-based:** Lazy load heavy components (charts)

**Bundle size:**
- **Target:** < 500KB (gzipped)
- **Vendor chunks:** Separate React, ECharts bundles
- **Tree shaking:** Remove unused code

---

## 15. BROWSER SUPPORT

### Supported Browsers

| Browser | Version |
|---------|---------|
| **Chrome** | Last 2 versions |
| **Firefox** | Last 2 versions |
| **Edge** | Last 2 versions |
| **Safari** | Last 2 versions |

**Not supported:**
- Internet Explorer (discontinued)
- Mobile browsers (not required for Accountant role)

**Polyfills:**
- ES6+ features (if needed)
- CSS Grid (modern browsers only)
- Flexbox (widely supported)

---

## 16. DESIGN TOKENS

### Export for Dev

```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "xxl": "48px",
    "xxxl": "64px"
  },
  "colors": {
    "primary": "#1890ff",
    "profit": "#52c41a",
    "loss": "#ff4d4f",
    "warning": "#faad14",
    "neutral": "#8c8c8c"
  },
  "typography": {
    "h1": {"size": "32px", "weight": 600, "lineHeight": "40px"},
    "h2": {"size": "24px", "weight": 600, "lineHeight": "32px"},
    "body": {"size": "14px", "weight": 400, "lineHeight": "20px"}
  },
  "borderRadius": {
    "sm": "2px",
    "md": "4px",
    "lg": "8px",
    "xl": "16px",
    "pill": "999px"
  },
  "shadows": {
    "sm": "0 1px 4px rgba(0,0,0,0.08)",
    "md": "0 2px 8px rgba(0,0,0,0.08)",
    "lg": "0 4px 12px rgba(0,0,0,0.15)"
  }
}
```

---

**Status:** ✅ Complete  
**Platform:** Desktop-only (1280px+ recommended)  
**Design System:** Based on Ant Design + Custom financial components  
**Accessibility:** WCAG 2.1 AA compliant
