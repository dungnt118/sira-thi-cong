# 💰 FUNCTIONAL DESIGN DOCUMENT - Accountant

**SIRA Service Management Platform**  
**Role:** Accountant (Kế toán)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. ROLE OVERVIEW

### 1.1 Vai Trò và Trách Nhiệm

**Accountant** là người quản lý tài chính và thanh toán trong hệ thống, chịu trách nhiệm theo dõi cash flow và đảm bảo thanh toán đúng hạn:

**Trách nhiệm chính:**
- ✅ Xem tất cả tài chính (dự án, hợp đồng, thanh toán)
- ✅ Tạo và quản lý payment milestones
- ✅ Confirm payment từ khách hàng (receivables)
- ✅ Confirm payment cho outsource (payables)
- ✅ Track accounts receivable (AR) và accounts payable (AP)
- ✅ Xuất báo cáo tài chính (Revenue, P&L, Cash Flow)
- ✅ Reconcile payments và handle disputes
- ✅ Monitor cash flow và financial health

**Không có quyền:**
- ❌ Tạo/sửa dự án (chỉ PM)
- ❌ Upload evidence (chỉ PM/Supervisor/OL/Staff)
- ❌ Assign teams (chỉ PM)
- ❌ Approve evidence (chỉ PM/Supervisor)
- ❌ Quản lý users/roles (chỉ Admin)

### 1.2 User Profile

**Đặc điểm người dùng:**
- Làm việc chủ yếu tại văn phòng (desktop)
- Cần xem overview tài chính nhiều dự án cùng lúc
- Xử lý hàng chục payment transactions mỗi ngày
- Cần data visualization và financial analytics
- Cần export reports (PDF/Excel) thường xuyên
- Cần batch actions để tăng hiệu suất

**Device:**
- Primary: Desktop (1920x1080, 1366x768)
- Secondary: Laptop (1440x900)
- Không cần mobile (financial tasks phức tạp)

### 1.3 Permission Matrix

| Function | Accountant | Admin | PM |
|----------|-----------|-------|-----|
| Xem tất cả tài chính | ✅ | ✅ | ✅ (own projects) |
| Tạo payment milestones | ✅ | ✅ | ✅ |
| Confirm payment từ khách | ✅ | ✅ | ❌ |
| Confirm payment cho outsource | ✅ | ✅ | ❌ |
| Xuất báo cáo tài chính | ✅ | ✅ | ✅ (limited) |
| Xem cash flow | ✅ | ✅ | ❌ |
| Reconcile payments | ✅ | ✅ | ❌ |
| Tạo/sửa dự án | ❌ | ✅ | ✅ |
| Upload evidence | ❌ | ✅ | ✅ |

---

## 2. USE CASES

### UC-ACC-01: Xem Financial Dashboard

**Actor:** Accountant  
**Precondition:** Accountant đã login  

**Main Flow:**
1. Accountant login vào system
2. System hiển thị desktop dashboard với:
   - **KPI Cards:**
     - Total revenue (month/quarter/year)
     - Total outstanding receivables
     - Total outstanding payables
     - Cash balance
     - Profit margin (%)
   - **Charts:**
     - Revenue trend (line chart)
     - Payment status distribution (pie chart)
     - Cash flow forecast (bar chart)
     - AR aging (stacked bar chart)
   - **Recent Activities:**
     - Recent payments received
     - Recent payments made
     - Pending approvals
     - Overdue receivables/payables
   - **Alerts:**
     - Overdue payments from customers
     - Overdue payments to outsource
     - Low cash balance warning
     - Payment milestones approaching due date
3. Accountant có thể:
   - Click vào KPI card → Navigate to detail view
   - Click vào chart → Drill down to details
   - Click vào alert → Navigate to related payment
   - Filter by date range (Today/Week/Month/Quarter/Year)
   - Switch between different fiscal periods
4. System auto-refresh data every 5 minutes

**Alternative Flow 2a:** Không có dữ liệu tài chính
- System hiển thị empty state
- Message: "Chưa có giao dịch tài chính nào"
- Suggest: "Bắt đầu bằng cách tạo payment milestones cho dự án"

**Postcondition:** Accountant xem được overview tài chính tổng thể

---

### UC-ACC-02: Quản lý Payment Milestones

**Actor:** Accountant hoặc PM  
**Precondition:** Dự án đã được tạo  

**Main Flow:**
1. Accountant navigate to "Payment Milestones"
2. System hiển thị milestone list table:
   - Project code/name
   - Milestone name (Đặt cọc/Tạm ứng/Nghiệm thu/Final)
   - Amount (VND)
   - Percentage (%)
   - Due date
   - Status (Pending/Paid/Overdue)
   - Actions (Edit/Delete/Mark as Paid)
3. Accountant click "Create Milestone"
4. System hiển thị milestone creation form:
   - Select project (dropdown)
   - Select milestone type:
     - Đặt cọc (Deposit)
     - Tạm ứng (Advance payment)
     - Nghiệm thu (Acceptance payment)
     - Final payment
   - Enter amount calculation method:
     - **Option A:** Percentage (%) of contract value
     - **Option B:** Fixed amount (VND)
   - Enter percentage or amount
   - Set due date (datepicker)
   - Enter note (optional)
5. Accountant fill form và click "Save"
6. System validate:
   - Project selected
   - Amount/percentage > 0
   - Due date is valid
   - Total percentage of all milestones ≤ 100%
7. System save milestone
8. System gửi notification:
   - PM: "New payment milestone created for {project}"
   - If due date < 7 days: Warning notification
9. System refresh milestone list

**Alternative Flow 6a:** Total percentage > 100%
- System error "Tổng % các milestones vượt quá 100%"
- Show current total: "{current_total}%"
- Suggest: "Giảm % milestone này hoặc xóa milestone khác"

**Alternative Flow 6b:** Due date in the past
- System warning "Due date đã qua, milestone sẽ ở trạng thái Overdue"
- Accountant confirm hoặc adjust date

**Business Rules:**
- BR-PAY-01: Tổng % các milestones = 100% (recommended, not enforced)
- BR-PAY-02: Mỗi dự án phải có ít nhất 1 milestone
- BR-PAY-03: Milestone amount > 0
- BR-PAY-04: Cannot delete milestone nếu đã paid

**Postcondition:** Payment milestone được tạo và track

---

### UC-ACC-03: Confirm Payment từ Khách hàng

**Actor:** Accountant  
**Precondition:** Payment milestone exists, status = Pending  

**Main Flow:**
1. Accountant mở "Receivables" tab
2. System hiển thị pending receivables table:
   - Customer name
   - Project code/name
   - Milestone name
   - Amount due
   - Due date
   - Days overdue (if overdue)
   - Status (Pending/Overdue)
   - Actions (Confirm Payment)
3. Customer thực hiện chuyển khoản
4. Accountant check bank statement
5. Accountant click "Confirm Payment" trên milestone
6. System hiển thị payment confirmation dialog:
   - **Payment Details:**
     - Customer name
     - Project
     - Milestone name
     - Amount due
   - **Actual Payment Info:**
     - Actual amount received (editable, default = amount due)
     - Payment date (datepicker, default = today)
     - Bank reference number (input field)
     - Payment method (dropdown: Bank Transfer/Cash/Check)
     - Upload proof of payment (optional, PDF/Image)
     - Note (optional)
   - **Buttons:** Cancel / Confirm
7. Accountant fill actual payment info
8. Accountant click "Confirm"
9. System validate:
   - Actual amount > 0
   - Payment date ≤ today
   - Bank reference not empty (nếu chọn Bank Transfer)
10. System update milestone:
    - Set status = Paid
    - Set paid_amount = actual amount
    - Set paid_date = payment date
    - Set paid_by = Accountant user_id
    - Upload proof to storage (if provided)
11. System log action in audit trail
12. System gửi notifications:
    - PM: "Payment received: {project} - {milestone} - {amount}"
    - If overdue was resolved: "Overdue payment resolved"
13. System update project financial summary
14. System refresh receivables list

**Alternative Flow 7a:** Partial payment (amount < due amount)
- System warning "Partial payment: {actual} < {due}"
- Accountant có thể:
  - **Option A:** Accept partial payment
    - System tạo remaining balance milestone
  - **Option B:** Cancel và liên hệ customer

**Alternative Flow 7b:** Overpayment (amount > due amount)
- System warning "Overpayment: {actual} > {due}"
- Accountant có thể:
  - **Option A:** Accept overpayment
    - System apply excess to next milestone
  - **Option B:** Refund excess to customer
  - **Option C:** Cancel và clarify với customer

**Alternative Flow 9a:** Payment date in future
- System error "Payment date không thể là tương lai"
- Accountant adjust date

**Business Rules:**
- BR-PAY-05: Chỉ Accountant confirm payment
- BR-PAY-06: Payment date ≤ today
- BR-PAY-07: Partial payment allowed (tạo remaining balance)
- BR-PAY-08: Overpayment allowed (apply to next milestone hoặc refund)

**Postcondition:** Payment được confirm, receivable cleared, PM nhận notification

---

### UC-ACC-04: Confirm Payment cho Outsource

**Actor:** Accountant  
**Precondition:** Outsource payment request approved by PM  

**Main Flow:**
1. Accountant mở "Payables" tab
2. System hiển thị pending payables table:
   - Outsource company name
   - Project code/name
   - Payment type (Labor cost/Material/Other)
   - Amount to pay
   - Requested date
   - Status (Pending Approval/Approved/Paid)
   - Customer payment status (Received/Not Received)
   - Actions (Confirm Payment)
3. Outsource đã hoàn thành công việc
4. PM đã approve payment request
5. Accountant click "Confirm Payment"
6. System check business rule: Customer payment received?
7. **Nếu customer chưa thanh toán:**
   - System warning "Chưa nhận tiền từ khách hàng cho dự án này"
   - Show receivables status:
     - Total due from customer: {amount}
     - Total received: {amount}
     - Outstanding: {amount}
   - Accountant có thể:
     - **Option A:** Proceed anyway (require reason)
     - **Option B:** Wait until customer pays
     - **Option C:** Request Admin override
8. **Nếu customer đã thanh toán hoặc Accountant proceed:**
   - System hiển thị payment confirmation dialog:
     - **Payable Details:**
       - Outsource company
       - Project
       - Payment type
       - Amount to pay
     - **Payment Info:**
       - Actual amount paid (editable, default = amount to pay)
       - Payment date (datepicker, default = today)
       - Bank reference number
       - Payment method (Bank Transfer/Cash/Check)
       - Upload payment proof (optional)
       - Note (optional)
     - **Buttons:** Cancel / Confirm
9. Accountant fill payment info
10. Accountant click "Confirm"
11. System validate payment info
12. System update payable:
    - Set status = Paid
    - Set paid_amount = actual amount
    - Set paid_date = payment date
    - Set paid_by = Accountant user_id
13. System log action
14. System gửi notifications:
    - Outsource Leader: "Payment processed: {project} - {amount}"
    - PM: "Payment made to {outsource} for {project}"
15. System update cash flow
16. System refresh payables list

**Alternative Flow 7a:** Admin override (thanh toán trước khi nhận từ customer)
- Admin approve override request
- System allow payment regardless of customer payment status
- System log override reason trong audit trail
- System flag payment as "Paid before customer payment"

**Alternative Flow 9a:** Payment split (chia nhiều lần)
- Accountant enter partial amount
- System tạo remaining payable
- System track payment schedule

**Business Rules:**
- BR-PAY-09: Không thanh toán outsource nếu chưa nhận tiền customer (có thể override bởi Admin)
- BR-PAY-10: Payable amount > 0
- BR-PAY-11: Payment date ≤ today
- BR-PAY-12: Log all override actions

**Postcondition:** Payment cho outsource được confirm, cash flow updated

---

### UC-ACC-05: Track Receivables (Công nợ phải thu)

**Actor:** Accountant  
**Precondition:** Có receivables trong hệ thống  

**Main Flow:**
1. Accountant click menu "Accounts Receivable"
2. System hiển thị AR dashboard:
   - **Summary Cards:**
     - Total AR: {total_amount}
     - Current (0-30 days): {amount}
     - 31-60 days: {amount}
     - 61-90 days: {amount}
     - Over 90 days: {amount}
   - **AR Aging Chart:**
     - Stacked bar chart by aging buckets
     - Color-coded (Green: Current, Yellow: 31-60, Orange: 61-90, Red: >90)
   - **Top Overdue Customers:**
     - Customer name
     - Total overdue amount
     - Oldest invoice date
     - Actions (Contact/Send Reminder)
   - **AR Table:**
     - Customer name
     - Project code
     - Invoice/Milestone
     - Amount
     - Due date
     - Days overdue
     - Status
     - Actions (View/Contact/Confirm Payment)
3. Accountant có thể:
   - **Filter:**
     - By customer
     - By project
     - By status (All/Current/Overdue)
     - By aging bucket
     - By date range
   - **Sort:**
     - By amount (high to low)
     - By due date (oldest first)
     - By days overdue
   - **Actions:**
     - Send payment reminder email
     - Export AR report (Excel/PDF)
     - Mark as disputed
     - Write off bad debt
4. Accountant select receivable
5. System hiển thị receivable detail:
   - Customer info
   - Project info
   - Invoice/milestone details
   - Payment history
   - Communication log
   - Actions available
6. Accountant có thể:
   - Send reminder
   - Contact customer
   - Confirm payment (UC-ACC-03)
   - Mark as disputed
   - Add note

**Alternative Flow 4a:** Send payment reminder
- Accountant click "Send Reminder"
- System hiển thị email template:
   - To: Customer email
   - Subject: "Payment Reminder - {project} - {milestone}"
   - Body: Pre-filled template với payment details
   - Editable
- Accountant review và send
- System log reminder sent
- System update "last_reminder_date"

**Alternative Flow 4b:** Mark as disputed
- Accountant click "Mark as Disputed"
- System require reason
- Accountant enter dispute reason
- System update status = Disputed
- System notify PM
- System create dispute resolution task

**Postcondition:** Accountant track được receivables và aging

---

### UC-ACC-06: Track Payables (Công nợ phải trả)

**Actor:** Accountant  
**Precondition:** Có payables trong hệ thống  

**Main Flow:**
1. Accountant click menu "Accounts Payable"
2. System hiển thị AP dashboard:
   - **Summary Cards:**
     - Total AP: {total_amount}
     - Current (0-30 days): {amount}
     - 31-60 days: {amount}
     - 61-90 days: {amount}
     - Over 90 days: {amount}
   - **AP Aging Chart:**
     - Stacked bar chart by aging buckets
   - **Top Payables:**
     - Outsource company
     - Total payable
     - Oldest due date
     - Actions (Pay/Schedule)
   - **AP Table:**
     - Outsource company
     - Project code
     - Payment type
     - Amount
     - Due date
     - Days overdue
     - Customer payment status
     - Status (Pending Approval/Approved/Paid)
     - Actions (View/Pay)
3. Accountant có thể:
   - Filter similar to AR
   - Sort by amount/due date/overdue
   - Batch select for payment
   - Export AP report
4. Accountant select payable
5. System hiển thị payable detail:
   - Outsource info
   - Project info
   - Payment request details
   - Approval history
   - Related customer payments
   - Actions
6. Accountant có thể:
   - Confirm payment (UC-ACC-04)
   - Schedule payment
   - Contact outsource
   - Request clarification
   - Add note

**Alternative Flow 3a:** Batch payment
- Accountant select multiple payables (same outsource)
- Click "Batch Pay"
- System group by outsource
- System calculate total amount
- Accountant confirm batch payment
- System process all selected payables

**Alternative Flow 6a:** Schedule payment
- Accountant click "Schedule Payment"
- Select scheduled date (future)
- System create scheduled payment task
- System remind Accountant on scheduled date
- Auto-mark as due on that date

**Postcondition:** Accountant track được payables và prioritize payments

---

### UC-ACC-07: Xem Project Financial Summary

**Actor:** Accountant  
**Precondition:** Dự án có financial data  

**Main Flow:**
1. Accountant navigate to "Projects" → Select project
2. System hiển thị project financial summary tab:
   - **Revenue Section:**
     - Contract value
     - Payment milestones (list)
     - Total received
     - Outstanding receivables
     - Collection rate (%)
   - **Cost Section:**
     - **Material costs:**
       - Planned material cost
       - Actual material cost
       - Variance
     - **Labor costs:**
       - Internal labor (if applicable)
       - Outsource labor cost
       - Total labor cost
     - **Other costs:**
       - Equipment rental
       - Transportation
       - Miscellaneous
     - **Total costs**
   - **Profit Section:**
     - Gross profit = Revenue - Costs
     - Gross margin (%)
     - Net profit (after tax/fees)
     - Net margin (%)
   - **Cash Flow:**
     - Cash in (received from customer)
     - Cash out (paid to outsource/suppliers)
     - Net cash flow
3. Accountant có thể:
   - Drill down to transaction details
   - Compare planned vs actual
   - View variance analysis
   - Export project financial report
   - View payment timeline

**Alternative Flow 2a:** Incomplete financial data
- System show warning "Một số dữ liệu tài chính chưa đầy đủ"
- Highlight missing data:
   - Material costs not confirmed
   - Labor costs pending approval
   - Invoices not issued
- Suggest actions to complete

**Postcondition:** Accountant xem được tổng quan tài chính từng dự án

---

### UC-ACC-08: Xuất Báo cáo Tài chính

**Actor:** Accountant  
**Precondition:** Có dữ liệu tài chính  

**Main Flow:**
1. Accountant click menu "Financial Reports"
2. System hiển thị report generator:
   - **Report Type:** (dropdown)
     - Revenue Report
     - Profit & Loss (P&L)
     - Cash Flow Statement
     - Accounts Receivable Aging
     - Accounts Payable Aging
     - Project Financial Summary
     - Tax Report (VAT)
   - **Filters:**
     - Date range (from/to)
     - Projects (multi-select, default: All)
     - Customers (multi-select, optional)
     - Outsource companies (multi-select, optional)
   - **Options:**
     - Group by: Project/Customer/Month/Quarter
     - Include charts: Yes/No
     - Include details: Summary only/Full details
   - **Format:**
     - PDF (for viewing/printing)
     - Excel (for analysis)
     - Both
3. Accountant select report type: "Profit & Loss"
4. Accountant configure filters:
   - Date range: Last quarter (Q4 2025)
   - Projects: All
   - Group by: Month
   - Include charts: Yes
   - Format: Both (PDF + Excel)
5. Accountant click "Generate Report"
6. System validate configuration
7. System generate report:
   - Fetch data from database
   - Calculate metrics (revenue, costs, profit, margins)
   - Generate charts (revenue trend, cost breakdown, profit margin)
   - Format according to template
8. System hiển thị report preview:
   - **Cover Page:**
     - Report title: "Profit & Loss Report - Q4 2025"
     - Generated by: {Accountant name}
     - Generated date: {current date}
     - Company logo
   - **Summary:**
     - Total revenue: {amount}
     - Total costs: {amount}
     - Gross profit: {amount}
     - Gross margin: {percentage}
   - **Details by Month:**
     - October 2025
     - November 2025
     - December 2025
   - **Charts:**
     - Revenue vs Cost bar chart
     - Profit margin line chart
     - Cost breakdown pie chart
9. Accountant review preview
10. Accountant có thể:
    - **Download:** Download file(s) to device
    - **Email:** Send to recipients
    - **Print:** Print directly
    - **Schedule:** Schedule recurring report
11. Accountant click "Download"
12. System generate files:
    - PL_Report_Q4_2025.pdf
    - PL_Report_Q4_2025.xlsx
13. System download files to device
14. System log report generation in audit trail

**Alternative Flow 7a:** Large report (many projects/long period)
- System show warning "Report size lớn, có thể mất vài phút"
- System generate in background
- System notify khi complete
- System send download link

**Alternative Flow 11a:** Email report
- Accountant click "Email"
- System show email form:
   - To: (multiple emails)
   - CC: (optional)
   - Subject: Pre-filled
   - Message: Editable
   - Attachments: Report files
- Accountant add recipients: CEO, CFO, PM
- Accountant click "Send"
- System send email with attachments
- System log email sent

**Alternative Flow 11b:** Schedule recurring report
- Accountant click "Schedule"
- System show schedule form:
   - Report type: (selected)
   - Frequency: Weekly/Monthly/Quarterly/Yearly
   - Day of period: First day/Last day/15th
   - Recipients: (emails)
   - Auto-send: Yes/No
- Accountant configure schedule:
   - Frequency: Monthly
   - Day: First day of month
   - Recipients: CEO, CFO
   - Auto-send: Yes
- System save schedule
- System auto-generate và send report theo schedule

**Postcondition:** Financial report được generate và export

---

### UC-ACC-09: Xem Cash Flow Report

**Actor:** Accountant  
**Precondition:** Có cash flow data  

**Main Flow:**
1. Accountant click menu "Cash Flow"
2. System hiển thị cash flow dashboard:
   - **Current Balance:**
     - Cash balance: {amount}
     - Available for payment: {amount}
     - Reserved for commitments: {amount}
   - **Cash Flow Timeline:** (chart)
     - X-axis: Time (months/weeks)
     - Y-axis: Cash amount
     - Green bars: Cash in (receipts)
     - Red bars: Cash out (payments)
     - Blue line: Net cash flow (cumulative)
   - **Forecast:**
     - Expected cash in (next 30/60/90 days)
     - Expected cash out (next 30/60/90 days)
     - Projected balance
   - **Cash Flow Table:**
     - Date
     - Description
     - Cash in
     - Cash out
     - Balance
     - Category (Customer payment/Outsource payment/Other)
3. Accountant có thể:
   - Filter by date range
   - Filter by category
   - View actual vs forecast
   - Export cash flow report
   - Set cash balance alerts
4. Accountant analyze cash flow trends
5. Accountant identify potential issues:
   - Low balance periods
   - High outflow periods
   - Customer payment delays impact
6. Accountant take actions:
   - Contact overdue customers (speed up cash in)
   - Schedule outsource payments (control cash out)
   - Request credit line (if needed)
   - Adjust payment terms

**Alternative Flow 5a:** Cash balance warning
- System detect low balance forecast
- System show alert "Cash balance dự kiến < {threshold} vào {date}"
- System suggest actions:
   - Prioritize collection from customers
   - Delay non-critical payments
   - Arrange short-term financing

**Postcondition:** Accountant monitor cash flow và forecast

---

### UC-ACC-10: Reconcile Payments

**Actor:** Accountant  
**Precondition:** Có payments cần reconcile  

**Main Flow:**
1. Accountant click menu "Payment Reconciliation"
2. System hiển thị reconciliation workspace:
   - **Bank Statement Section:** (left panel)
     - Upload bank statement (CSV/Excel/PDF)
     - Or manual entry
     - List of bank transactions:
       - Date
       - Description
       - Amount
       - Reference
       - Status (Matched/Unmatched)
   - **System Transactions Section:** (right panel)
     - List of system payments:
       - Date
       - Customer/Outsource name
       - Project
       - Amount
       - Reference
       - Status (Matched/Unmatched)
   - **Matching Section:** (bottom panel)
     - Matched pairs
     - Discrepancies
3. Accountant upload bank statement
4. System parse bank statement
5. System auto-match transactions:
   - Match by bank reference number
   - Match by amount + date (±3 days)
   - Match by amount + customer name
6. System hiển thị matching results:
   - Matched: {count} transactions
   - Unmatched in bank: {count}
   - Unmatched in system: {count}
   - Discrepancies: {count} (amount mismatch)
7. Accountant review auto-matches
8. Accountant manually match remaining:
   - Select bank transaction
   - Select system transaction
   - Click "Match"
   - System link the two transactions
9. Accountant handle discrepancies:
   - **Amount mismatch:**
     - Check bank fees
     - Check exchange rate (if foreign currency)
     - Create adjustment entry
   - **Missing in system:**
     - Create manual transaction
     - Link to project/customer
   - **Missing in bank:**
     - Investigate (not yet cleared?)
     - Contact bank
     - Mark as pending
10. Accountant finalize reconciliation
11. System generate reconciliation report:
    - Reconciliation date
    - Bank statement period
    - Opening balance
    - Closing balance
    - Total matched
    - Total unmatched
    - Discrepancies resolved
12. System save reconciliation
13. System update transaction statuses

**Alternative Flow 5a:** Auto-match confidence low
- System show matches with confidence score
- Low confidence (<80%): Require manual review
- High confidence (>95%): Auto-accept
- Medium confidence (80-95%): Suggest for review

**Alternative Flow 9a:** Unresolved discrepancy
- Accountant cannot resolve
- Mark as "Pending investigation"
- Add note với details
- Assign to senior accountant/manager
- System track pending items

**Postcondition:** Payments được reconcile với bank statement

---

### UC-ACC-11: Handle Payment Disputes

**Actor:** Accountant  
**Precondition:** Payment dispute reported  

**Main Flow:**
1. Customer hoặc Outsource raise payment dispute
2. System create dispute ticket
3. System notify Accountant
4. Accountant mở "Payment Disputes" queue
5. System hiển thị dispute list:
   - Dispute ID
   - Type: Customer dispute / Outsource dispute
   - Project
   - Amount disputed
   - Raised by
   - Raised date
   - Status (Open/Under Review/Resolved/Closed)
   - Priority (High/Medium/Low)
   - Actions (Review/Resolve)
6. Accountant click "Review" trên dispute
7. System hiển thị dispute details:
   - **Dispute Info:**
     - Dispute reason (from customer/outsource)
     - Amount disputed
     - Original invoice/payment
     - Supporting documents
   - **History:**
     - Transaction history
     - Communication log
     - Previous disputes (if any)
   - **Evidence:**
     - Contracts
     - Invoices
     - Payment proofs
     - Email correspondence
8. Accountant investigate:
   - Review contract terms
   - Check payment records
   - Verify amounts
   - Contact customer/outsource for clarification
   - Consult with PM if needed
9. Accountant determine resolution:
   - **Option A:** Dispute valid → Adjust payment
   - **Option B:** Dispute invalid → Reject with explanation
   - **Option C:** Partial validity → Negotiate settlement
10. Accountant execute resolution:
    - **If adjustment needed:**
      - Create credit note
      - Issue refund
      - Update records
    - **If rejected:**
      - Document reason
      - Send explanation to disputer
    - **If settlement:**
      - Agree on settlement amount
      - Process settlement payment
11. Accountant close dispute
12. System update dispute status = Resolved
13. System log resolution
14. System notify involved parties
15. System update payment records

**Alternative Flow 9a:** Cannot resolve (escalate)
- Accountant unable to resolve
- Escalate to:
   - **Option A:** Senior Accountant
   - **Option B:** CFO
   - **Option C:** Legal team (if contractual issue)
- System assign to escalation recipient
- System track escalation

**Alternative Flow 10a:** Refund required
- Calculate refund amount
- Get approval (if >threshold)
- Process refund via bank
- Issue refund receipt
- Update accounting records
- Log refund transaction

**Postcondition:** Payment dispute resolved, records updated

---

### UC-ACC-12: Xem Audit Trail (Financial activities)

**Actor:** Accountant  
**Precondition:** Accountant có audit permissions  

**Main Flow:**
1. Accountant click menu "Financial Audit Log"
2. System hiển thị audit log interface:
   - **Filters:**
     - Date range
     - User (who performed action)
     - Action type (Payment confirmed/Milestone created/etc.)
     - Entity (Project/Customer/Outsource)
     - Amount range
   - **Log Table:**
     - Timestamp
     - User
     - Action
     - Entity type
     - Entity ID/name
     - Before value (if update)
     - After value (if update)
     - Amount (if financial)
     - IP address
     - Details
3. Accountant có thể:
   - Filter logs
   - Search by keyword
   - Sort by date/user/action
   - Export audit log (CSV/Excel/PDF)
4. Accountant select log entry
5. System hiển thị log detail:
   - Full action description
   - User who performed action
   - Exact timestamp
   - Before/after comparison (for updates)
   - Related entities
   - Session info
6. Accountant review audit trail for:
   - Compliance
   - Error investigation
   - Reconciliation
   - Security review

**Alternative Flow 3a:** Export audit log
- Accountant click "Export"
- Select format: CSV/Excel/PDF
- Select columns to include
- System generate export file
- Download to device

**Postcondition:** Accountant review financial activities audit trail

---

## 3. BUSINESS RULES

### Payment Rules
- **BR-PAY-01**: Tổng % các payment milestones = 100% (recommended)
- **BR-PAY-02**: Chỉ Accountant confirm payment
- **BR-PAY-03**: Payment date ≤ today
- **BR-PAY-04**: Milestone amount > 0
- **BR-PAY-05**: Cannot delete milestone nếu đã paid
- **BR-PAY-06**: Partial payment allowed (tạo remaining balance)
- **BR-PAY-07**: Overpayment allowed (apply to next milestone)
- **BR-PAY-08**: Không thanh toán outsource nếu chưa nhận tiền customer (có thể override bởi Admin)
- **BR-PAY-09**: Log all payment confirmations trong audit trail
- **BR-PAY-10**: Payment proof recommended but not required

### Cash Flow Rules
- **BR-CASH-01**: Cash balance alert nếu < threshold
- **BR-CASH-02**: Cash flow forecast based on pending milestones
- **BR-CASH-03**: Reserved cash = sum of approved but unpaid payables

### Reporting Rules
- **BR-REPORT-01**: Financial reports include all completed transactions
- **BR-REPORT-02**: Pending payments shown separately
- **BR-REPORT-03**: Reports generated in real-time (not cached)
- **BR-REPORT-04**: All report generation logged

### Reconciliation Rules
- **BR-RECON-01**: Auto-match by bank reference (highest priority)
- **BR-RECON-02**: Manual match requires Accountant approval
- **BR-RECON-03**: Discrepancies >5% require investigation
- **BR-RECON-04**: Reconciliation must be done monthly

### AR/AP Rules
- **BR-AR-01**: Receivable overdue if >30 days past due date
- **BR-AR-02**: Send payment reminder at 7 days before due date
- **BR-AR-03**: Escalate to PM if receivable >60 days overdue
- **BR-AP-01**: Payable overdue if >30 days past due date
- **BR-AP-02**: Notify PM if payable approaching due date
- **BR-AP-03**: Cannot delete payable if status = Paid

### Dispute Rules
- **BR-DISPUTE-01**: Dispute must be resolved within 30 days
- **BR-DISPUTE-02**: High-value disputes (>50M VND) require CFO approval
- **BR-DISPUTE-03**: Refund >10M VND requires approval
- **BR-DISPUTE-04**: All dispute resolutions logged

---

## 4. VALIDATION RULES

### Payment Amount Validation
- **Amount**: Must be positive number
- **Percentage**: 0 < percentage ≤ 100
- **Total percentage**: Sum of all milestones ≤ 100%
- **Currency**: VND only (for MVP)
- **Decimal places**: Max 2 decimal places

### Date Validation
- **Payment date**: ≤ today, ≥ project start date
- **Due date**: ≥ today (for new milestones)
- **Date range**: From date ≤ To date
- **Fiscal period**: Valid fiscal year/quarter/month

### Bank Account Validation
- **Bank reference**: Alphanumeric, max 50 chars
- **Account number**: Numeric, 9-14 digits (Vietnam banks)
- **Bank name**: Required for international transfers

### Report Configuration Validation
- **Date range**: Max 2 years
- **Projects**: Max 100 projects per report
- **Format**: PDF (max 200 pages), Excel (max 50,000 rows)

### File Upload Validation
- **Proof of payment**: PDF, JPG, PNG
- **Max file size**: 10MB
- **Bank statement**: CSV, Excel, PDF
- **Max rows**: 10,000 transactions

---

## 5. NOTIFICATIONS

### Payment Notifications
| Event | Recipient | Channel | Priority |
|-------|-----------|---------|----------|
| Payment milestone created | PM | In-app + Email | Medium |
| Payment received from customer | PM, Admin | In-app + Email | High |
| Payment made to outsource | Outsource Leader, PM | In-app + Email | High |
| Payment overdue (customer) | PM, Accountant | In-app + Email | High |
| Payment due soon (<7 days) | Accountant | In-app | Medium |

### AR/AP Notifications
| Event | Recipient | Channel | Priority |
|-------|-----------|---------|----------|
| Receivable overdue >30 days | PM, Accountant | In-app + Email | High |
| Receivable overdue >60 days | Admin, PM | Email | Critical |
| Payable approaching due date | Accountant | In-app | Medium |
| Payable overdue | Accountant, PM | In-app + Email | High |

### Cash Flow Notifications
| Event | Recipient | Channel | Priority |
|-------|-----------|---------|----------|
| Low cash balance forecast | Accountant, CFO | Email | High |
| Negative cash flow projected | CFO, Admin | Email | Critical |

### Dispute Notifications
| Event | Recipient | Channel | Priority |
|-------|-----------|---------|----------|
| New payment dispute | Accountant, PM | In-app + Email | High |
| Dispute resolved | Disputer, PM | Email | Medium |
| Dispute escalated | CFO | Email | High |

---

**Status:** ✅ Complete  
**Platform:** Desktop-only (1280px minimum recommended)  
**Use Cases:** 12 comprehensive use cases  
**Business Rules:** 25+ financial rules  
**Notifications:** 15+ notification types
