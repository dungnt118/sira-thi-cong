# 🔄 USER FLOWS - Accountant

**SIRA Service Management Platform**  
**Role:** Accountant (Kế toán)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## OVERVIEW

Tài liệu này mô tả các user flows chính cho Accountant role sử dụng Mermaid flowchart diagrams.

**10 Main Flows:**
1. Financial Dashboard Overview
2. Create Payment Milestones
3. Confirm Customer Payment
4. Confirm Outsource Payment
5. Track Receivables (AR)
6. Track Payables (AP)
7. Generate Financial Report
8. Cash Flow Analysis
9. Payment Reconciliation
10. Handle Payment Dispute

---

## FLOW 01: Financial Dashboard Overview

```mermaid
flowchart TD
    Start([Accountant Login]) --> Dashboard[Load Financial Dashboard]
    Dashboard --> DisplayKPI[Display KPI Cards]
    DisplayKPI --> ShowCharts[Show Revenue/Cash Flow Charts]
    ShowCharts --> ShowActivities[Show Recent Activities]
    ShowActivities --> ShowAlerts[Show Alerts/Warnings]
    
    ShowAlerts --> UserAction{User Action}
    
    UserAction -->|Click KPI Card| DrillDown[Navigate to Detail View]
    UserAction -->|Click Chart| ChartDetail[Show Chart Details]
    UserAction -->|Click Alert| AlertDetail[Navigate to Related Payment]
    UserAction -->|Filter Date Range| FilterDashboard[Apply Date Filter]
    UserAction -->|Auto Refresh| RefreshData[Refresh Data Every 5 min]
    
    DrillDown --> End([View Details])
    ChartDetail --> End
    AlertDetail --> End
    FilterDashboard --> Dashboard
    RefreshData --> Dashboard
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style ShowAlerts fill:#fff4e1
```

**Key Decision Points:**
- User có thể click vào bất kỳ KPI card, chart, hoặc alert để drill down
- Dashboard auto-refresh every 5 minutes để update real-time data

---

## FLOW 02: Create Payment Milestones

```mermaid
flowchart TD
    Start([Navigate to Milestones]) --> ClickCreate[Click Create Milestone]
    ClickCreate --> ShowForm[Display Milestone Form]
    
    ShowForm --> SelectProject[Select Project]
    SelectProject --> SelectType[Select Milestone Type]
    SelectType --> TypeDecision{Calculation Method}
    
    TypeDecision -->|Percentage| EnterPercent[Enter Percentage %]
    TypeDecision -->|Fixed Amount| EnterAmount[Enter Amount VND]
    
    EnterPercent --> SetDueDate[Set Due Date]
    EnterAmount --> SetDueDate
    
    SetDueDate --> EnterNote[Enter Note Optional]
    EnterNote --> ClickSave[Click Save]
    
    ClickSave --> ValidateForm{Validate Form}
    
    ValidateForm -->|Invalid| ShowError[Show Validation Errors]
    ShowError --> ShowForm
    
    ValidateForm -->|Valid| CheckTotal{Check Total %}
    
    CheckTotal -->|> 100%| WarningTotal[Warning: Total > 100%]
    WarningTotal --> UserChoice{User Action}
    UserChoice -->|Adjust| ShowForm
    UserChoice -->|Cancel| End([Cancel])
    
    CheckTotal -->|≤ 100%| CheckDueDate{Due Date Valid?}
    
    CheckDueDate -->|Past Date| WarningDueDate[Warning: Due date in past]
    WarningDueDate --> UserConfirm{Confirm?}
    UserConfirm -->|No| ShowForm
    UserConfirm -->|Yes| SaveMilestone[Save Milestone]
    
    CheckDueDate -->|Future Date| SaveMilestone
    
    SaveMilestone --> LogAction[Log Action in Audit Trail]
    LogAction --> SendNotification[Send Notification to PM]
    SendNotification --> RefreshList[Refresh Milestone List]
    RefreshList --> Success([Success: Milestone Created])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style End fill:#ffe1e1
    style ShowError fill:#ffe1e1
    style WarningTotal fill:#fff4e1
    style WarningDueDate fill:#fff4e1
```

**Validation Rules:**
- Total percentage ≤ 100%
- Amount > 0
- Due date is valid
- All required fields filled

---

## FLOW 03: Confirm Customer Payment

```mermaid
flowchart TD
    Start([Open Receivables Tab]) --> ViewPending[View Pending Receivables Table]
    ViewPending --> CustomerPays[Customer Transfers Money]
    CustomerPays --> CheckBank[Accountant Checks Bank Statement]
    CheckBank --> SelectPayment[Select Payment to Confirm]
    SelectPayment --> ClickConfirm[Click Confirm Payment]
    
    ClickConfirm --> ShowDialog[Show Payment Confirmation Dialog]
    ShowDialog --> FillActualAmount[Enter Actual Amount]
    FillActualAmount --> FillDate[Select Payment Date]
    FillDate --> FillBankRef[Enter Bank Reference]
    FillBankRef --> SelectMethod[Select Payment Method]
    SelectMethod --> UploadProof[Upload Proof Optional]
    UploadProof --> EnterNote[Enter Note Optional]
    EnterNote --> ClickConfirmBtn[Click Confirm Button]
    
    ClickConfirmBtn --> ValidateInput{Validate Input}
    
    ValidateInput -->|Invalid| ShowValidationError[Show Errors]
    ShowValidationError --> ShowDialog
    
    ValidateInput -->|Valid| CompareAmount{Compare Amount}
    
    CompareAmount -->|Amount < Due| PartialWarning[Warning: Partial Payment]
    PartialWarning --> PartialDecision{Accountant Decision}
    PartialDecision -->|Accept Partial| CreateRemaining[Create Remaining Balance]
    PartialDecision -->|Cancel| EndCancel([Cancel])
    CreateRemaining --> UpdateMilestone
    
    CompareAmount -->|Amount > Due| OverpaymentWarning[Warning: Overpayment]
    OverpaymentWarning --> OverpayDecision{Accountant Decision}
    OverpayDecision -->|Accept| ApplyToNext[Apply Excess to Next Milestone]
    OverpayDecision -->|Refund| RefundCustomer[Process Refund]
    OverpayDecision -->|Cancel| EndCancel
    ApplyToNext --> UpdateMilestone
    RefundCustomer --> UpdateMilestone
    
    CompareAmount -->|Amount = Due| UpdateMilestone[Update Milestone Status = Paid]
    
    UpdateMilestone --> SetPaidInfo[Set paid_amount, paid_date, paid_by]
    SetPaidInfo --> UploadToStorage[Upload Proof to Storage]
    UploadToStorage --> LogAudit[Log in Audit Trail]
    LogAudit --> SendNotifyPM[Notify PM]
    SendNotifyPM --> UpdateProjectFinance[Update Project Financial Summary]
    UpdateProjectFinance --> RefreshReceivables[Refresh Receivables List]
    RefreshReceivables --> Success([Payment Confirmed])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style EndCancel fill:#ffe1e1
    style ShowValidationError fill:#ffe1e1
    style PartialWarning fill:#fff4e1
    style OverpaymentWarning fill:#fff4e1
```

**Key Decision Points:**
- Partial payment → Accept hoặc Cancel
- Overpayment → Apply to next, Refund, hoặc Cancel
- All validations must pass before confirming

---

## FLOW 04: Confirm Outsource Payment

```mermaid
flowchart TD
    Start([Open Payables Tab]) --> ViewPending[View Pending Payables Table]
    ViewPending --> PMApproves[PM Approves Payment Request]
    PMApproves --> SelectPayable[Accountant Selects Payable]
    SelectPayable --> ClickPay[Click Confirm Payment]
    
    ClickPay --> CheckBusinessRule{Customer Paid?}
    
    CheckBusinessRule -->|No| ShowWarning[Warning: Customer Not Paid Yet]
    ShowWarning --> ShowReceivableStatus[Show Receivables Status]
    ShowReceivableStatus --> AccountantDecision{Accountant Decision}
    
    AccountantDecision -->|Wait| EndWait([Wait for Customer Payment])
    AccountantDecision -->|Proceed| RequireReason[Require Reason for Override]
    AccountantDecision -->|Request Admin Override| RequestOverride[Request Admin Approval]
    
    RequestOverride --> AdminApproves{Admin Approves?}
    AdminApproves -->|No| EndWait
    AdminApproves -->|Yes| LogOverride[Log Override Reason]
    LogOverride --> ShowPaymentDialog
    
    RequireReason --> EnterReason[Enter Override Reason]
    EnterReason --> ShowPaymentDialog
    
    CheckBusinessRule -->|Yes| ShowPaymentDialog[Show Payment Confirmation Dialog]
    
    ShowPaymentDialog --> FillAmount[Enter Actual Amount]
    FillAmount --> FillDate[Select Payment Date]
    FillDate --> FillBankRef[Enter Bank Reference]
    FillBankRef --> SelectMethod[Select Payment Method]
    SelectMethod --> UploadProof[Upload Payment Proof]
    UploadProof --> EnterNote[Enter Note]
    EnterNote --> ClickConfirm[Click Confirm]
    
    ClickConfirm --> ValidatePayment{Validate Input}
    
    ValidatePayment -->|Invalid| ShowError[Show Validation Errors]
    ShowError --> ShowPaymentDialog
    
    ValidatePayment -->|Valid| UpdatePayable[Update Payable Status = Paid]
    UpdatePayable --> SetPaymentInfo[Set paid_amount, paid_date, paid_by]
    SetPaymentInfo --> LogPayment[Log Payment in Audit Trail]
    LogPayment --> NotifyOL[Notify Outsource Leader]
    NotifyOL --> NotifyPM[Notify PM]
    NotifyPM --> UpdateCashFlow[Update Cash Flow]
    UpdateCashFlow --> RefreshPayables[Refresh Payables List]
    RefreshPayables --> Success([Payment Confirmed])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style EndWait fill:#ffe1e1
    style ShowError fill:#ffe1e1
    style ShowWarning fill:#fff4e1
```

**Business Rules:**
- BR-PAY-08: Không thanh toán outsource nếu chưa nhận tiền customer (có thể override bởi Admin)
- All overrides must be logged với reason

---

## FLOW 05: Track Receivables (AR)

```mermaid
flowchart TD
    Start([Click AR Menu]) --> LoadDashboard[Load AR Dashboard]
    LoadDashboard --> DisplaySummary[Display AR Summary Cards]
    DisplaySummary --> ShowAgingChart[Show AR Aging Chart]
    ShowAgingChart --> ShowTopOverdue[Show Top Overdue Customers]
    ShowTopOverdue --> ShowARTable[Show AR Table]
    
    ShowARTable --> UserAction{User Action}
    
    UserAction -->|Filter| ApplyFilter[Apply Filters]
    ApplyFilter --> RefreshTable[Refresh AR Table]
    RefreshTable --> ShowARTable
    
    UserAction -->|Sort| SortTable[Sort by Column]
    SortTable --> ShowARTable
    
    UserAction -->|Select Receivable| ViewDetail[View Receivable Detail]
    ViewDetail --> ShowDetailInfo[Show Customer/Project/Invoice Info]
    ShowDetailInfo --> ShowPaymentHistory[Show Payment History]
    ShowPaymentHistory --> ShowCommLog[Show Communication Log]
    ShowCommLog --> DetailAction{Accountant Action}
    
    DetailAction -->|Send Reminder| ComposeEmail[Compose Reminder Email]
    ComposeEmail --> SendEmail[Send Email]
    SendEmail --> LogReminder[Log Reminder Sent]
    LogReminder --> UpdateLastReminder[Update last_reminder_date]
    UpdateLastReminder --> BackToDetail[Back to Detail View]
    BackToDetail --> ViewDetail
    
    DetailAction -->|Contact Customer| LogContact[Log Contact Attempt]
    LogContact --> BackToDetail
    
    DetailAction -->|Confirm Payment| ConfirmPaymentFlow[Go to UC-ACC-03]
    ConfirmPaymentFlow --> Success([Payment Confirmed])
    
    DetailAction -->|Mark as Disputed| ShowDisputeForm[Show Dispute Form]
    ShowDisputeForm --> EnterReason[Enter Dispute Reason]
    EnterReason --> SaveDispute[Save Dispute]
    SaveDispute --> UpdateStatus[Update Status = Disputed]
    UpdateStatus --> NotifyPM[Notify PM]
    NotifyPM --> CreateTask[Create Dispute Resolution Task]
    CreateTask --> BackToDetail
    
    UserAction -->|Export Report| GenerateExport[Generate Excel/PDF]
    GenerateExport --> DownloadFile[Download AR Report]
    DownloadFile --> End([Report Downloaded])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style End fill:#e1f5e1
```

**Features:**
- Filter by customer, project, status, aging bucket
- Send payment reminders
- Mark as disputed
- Export AR aging report

---

## FLOW 06: Track Payables (AP)

```mermaid
flowchart TD
    Start([Click AP Menu]) --> LoadDashboard[Load AP Dashboard]
    LoadDashboard --> DisplaySummary[Display AP Summary Cards]
    DisplaySummary --> ShowAgingChart[Show AP Aging Chart]
    ShowAgingChart --> ShowTopPayables[Show Top Payables]
    ShowTopPayables --> ShowAPTable[Show AP Table with Customer Payment Status]
    
    ShowAPTable --> UserAction{User Action}
    
    UserAction -->|Filter| ApplyFilter[Apply Filters]
    ApplyFilter --> RefreshTable[Refresh AP Table]
    RefreshTable --> ShowAPTable
    
    UserAction -->|Sort| SortTable[Sort by Column]
    SortTable --> ShowAPTable
    
    UserAction -->|Batch Select| SelectMultiple[Select Multiple Payables]
    SelectMultiple --> CheckSameOutsource{Same Outsource?}
    CheckSameOutsource -->|No| ShowError[Error: Must be same outsource]
    ShowError --> ShowAPTable
    CheckSameOutsource -->|Yes| BatchPay[Click Batch Pay]
    BatchPay --> CalcTotal[Calculate Total Amount]
    CalcTotal --> ShowBatchDialog[Show Batch Payment Dialog]
    ShowBatchDialog --> ConfirmBatchPayment[Confirm Batch Payment]
    ConfirmBatchPayment --> ProcessAll[Process All Selected Payables]
    ProcessAll --> Success([Batch Payment Confirmed])
    
    UserAction -->|Select Payable| ViewDetail[View Payable Detail]
    ViewDetail --> ShowDetailInfo[Show Outsource/Project Info]
    ShowDetailInfo --> ShowApprovalHistory[Show Approval History]
    ShowApprovalHistory --> ShowRelatedReceivables[Show Related Customer Payments]
    ShowRelatedReceivables --> DetailAction{Accountant Action}
    
    DetailAction -->|Confirm Payment| ConfirmPaymentFlow[Go to UC-ACC-04]
    ConfirmPaymentFlow --> Success
    
    DetailAction -->|Schedule Payment| ShowScheduleForm[Show Schedule Form]
    ShowScheduleForm --> SelectDate[Select Scheduled Date]
    SelectDate --> SaveSchedule[Save Scheduled Payment]
    SaveSchedule --> CreateReminder[Create Reminder Task]
    CreateReminder --> BackToDetail[Back to Detail View]
    BackToDetail --> ViewDetail
    
    DetailAction -->|Contact Outsource| LogContact[Log Contact]
    LogContact --> BackToDetail
    
    DetailAction -->|Request Clarification| SendMessage[Send Message to PM]
    SendMessage --> BackToDetail
    
    UserAction -->|Export Report| GenerateExport[Generate Excel/PDF]
    GenerateExport --> DownloadFile[Download AP Report]
    DownloadFile --> End([Report Downloaded])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style End fill:#e1f5e1
    style ShowError fill:#ffe1e1
```

**Features:**
- Batch payment (same outsource)
- Schedule future payments
- View customer payment status
- Export AP aging report

---

## FLOW 07: Generate Financial Report

```mermaid
flowchart TD
    Start([Click Reports Menu]) --> ShowGenerator[Show Report Generator Form]
    ShowGenerator --> SelectType[Select Report Type]
    SelectType --> TypeDecision{Report Type}
    
    TypeDecision -->|Revenue Report| ConfigRevenue[Configure Revenue Options]
    TypeDecision -->|P&L| ConfigPL[Configure P&L Options]
    TypeDecision -->|Cash Flow| ConfigCashFlow[Configure Cash Flow Options]
    TypeDecision -->|AR Aging| ConfigAR[Configure AR Options]
    TypeDecision -->|AP Aging| ConfigAP[Configure AP Options]
    
    ConfigRevenue --> CommonFilters
    ConfigPL --> CommonFilters
    ConfigCashFlow --> CommonFilters
    ConfigAR --> CommonFilters
    ConfigAP --> CommonFilters
    
    CommonFilters[Set Date Range] --> SelectProjects[Select Projects Multi-select]
    SelectProjects --> SelectGroupBy[Select Group By]
    SelectGroupBy --> SelectOptions[Select Options]
    SelectOptions --> SelectFormat[Select Format PDF/Excel/Both]
    SelectFormat --> ClickGenerate[Click Generate Report]
    
    ClickGenerate --> ValidateConfig{Validate Configuration}
    
    ValidateConfig -->|Invalid| ShowError[Show Validation Errors]
    ShowError --> ShowGenerator
    
    ValidateConfig -->|Valid| CheckSize{Report Size}
    
    CheckSize -->|Large| ShowSizeWarning[Warning: May take few minutes]
    ShowSizeWarning --> UserConfirm{Continue?}
    UserConfirm -->|No| ShowGenerator
    UserConfirm -->|Yes| GenerateBackground[Generate in Background]
    GenerateBackground --> ShowProgress[Show Progress Indicator]
    ShowProgress --> WaitComplete[Wait for Completion]
    WaitComplete --> SendNotification[Notify When Complete]
    SendNotification --> ShowPreview
    
    CheckSize -->|Small| GenerateReport[Generate Report]
    GenerateReport --> ShowPreview[Show Report Preview]
    
    ShowPreview --> ReviewReport[Accountant Reviews Report]
    ReviewReport --> ReportAction{User Action}
    
    ReportAction -->|Download| GenerateFiles[Generate PDF/Excel Files]
    GenerateFiles --> DownloadFiles[Download to Device]
    DownloadFiles --> LogGeneration[Log Report Generation]
    LogGeneration --> Success([Report Downloaded])
    
    ReportAction -->|Email| ShowEmailForm[Show Email Form]
    ShowEmailForm --> AddRecipients[Add Recipients: CEO, CFO, PM]
    AddRecipients --> ReviewEmail[Review Email]
    ReviewEmail --> SendEmail[Send Email with Attachments]
    SendEmail --> LogEmail[Log Email Sent]
    LogEmail --> Success
    
    ReportAction -->|Print| PrintReport[Print Report Directly]
    PrintReport --> Success
    
    ReportAction -->|Schedule| ShowScheduleForm[Show Schedule Form]
    ShowScheduleForm --> ConfigSchedule[Configure Frequency/Recipients]
    ConfigSchedule --> SaveSchedule[Save Scheduled Report]
    SaveSchedule --> Success
    
    ReportAction -->|Back| ShowGenerator
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style ShowError fill:#ffe1e1
    style ShowSizeWarning fill:#fff4e1
```

**Report Types:**
- Revenue Report
- Profit & Loss (P&L)
- Cash Flow Statement
- AR/AP Aging
- Tax Report (VAT)

---

## FLOW 08: Cash Flow Analysis

```mermaid
flowchart TD
    Start([Click Cash Flow Menu]) --> LoadDashboard[Load Cash Flow Dashboard]
    LoadDashboard --> DisplayBalance[Display Current Cash Balance]
    DisplayBalance --> ShowTimeline[Show Cash Flow Timeline Chart]
    ShowTimeline --> ShowForecast[Show Cash Flow Forecast]
    ShowForecast --> ShowTransactionTable[Show Cash Flow Transaction Table]
    
    ShowTransactionTable --> UserAction{User Action}
    
    UserAction -->|Filter by Date| ApplyDateFilter[Apply Date Range Filter]
    ApplyDateFilter --> RefreshChart[Refresh Charts & Table]
    RefreshChart --> ShowTimeline
    
    UserAction -->|Filter by Category| ApplyCategoryFilter[Filter by Category]
    ApplyCategoryFilter --> RefreshChart
    
    UserAction -->|View Actual vs Forecast| CompareData[Show Comparison View]
    CompareData --> HighlightVariance[Highlight Variances]
    HighlightVariance --> AnalyzeAction{Accountant Analysis}
    
    AnalyzeAction -->|Export| ExportCashFlow[Export Cash Flow Report]
    ExportCashFlow --> End([Report Exported])
    
    AnalyzeAction -->|Set Alert| ShowAlertForm[Show Cash Balance Alert Form]
    ShowAlertForm --> SetThreshold[Set Threshold Amount]
    SetThreshold --> SaveAlert[Save Alert Configuration]
    SaveAlert --> MonitorBalance[System Monitors Balance]
    MonitorBalance --> CheckAlert{Balance < Threshold?}
    CheckAlert -->|Yes| SendAlert[Send Alert to Accountant/CFO]
    SendAlert --> End
    CheckAlert -->|No| Continue([Continue Monitoring])
    
    UserAction -->|Identify Issues| AnalyzeIssues[Analyze Cash Flow Issues]
    AnalyzeIssues --> IssueType{Issue Type}
    
    IssueType -->|Low Balance| TakeAction1[Contact Overdue Customers]
    IssueType -->|High Outflow| TakeAction2[Schedule Payments]
    IssueType -->|Delays| TakeAction3[Adjust Payment Terms]
    
    TakeAction1 --> ActionComplete([Actions Taken])
    TakeAction2 --> ActionComplete
    TakeAction3 --> ActionComplete
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style Continue fill:#e1f5e1
    style ActionComplete fill:#e1f5e1
```

**Features:**
- Real-time cash balance monitoring
- Cash flow forecast (30/60/90 days)
- Variance analysis (actual vs forecast)
- Cash balance alerts

---

## FLOW 09: Payment Reconciliation

```mermaid
flowchart TD
    Start([Click Reconciliation Menu]) --> ShowWorkspace[Show Reconciliation Workspace]
    ShowWorkspace --> UploadChoice{Upload Method}
    
    UploadChoice -->|Upload File| UploadStatement[Upload Bank Statement CSV/Excel/PDF]
    UploadChoice -->|Manual Entry| ManualEntry[Manually Enter Transactions]
    
    UploadStatement --> ParseFile[System Parses File]
    ParseFile --> LoadBankTrans[Load Bank Transactions]
    ManualEntry --> LoadBankTrans
    
    LoadBankTrans --> LoadSystemTrans[Load System Transactions]
    LoadSystemTrans --> AutoMatch[System Auto-Matches Transactions]
    
    AutoMatch --> MatchByRef[Match by Bank Reference]
    MatchByRef --> MatchByAmount[Match by Amount + Date]
    MatchByAmount --> MatchByName[Match by Amount + Customer Name]
    MatchByName --> ShowResults[Display Matching Results]
    
    ShowResults --> DisplayMatched[Show Matched Transactions]
    DisplayMatched --> DisplayUnmatched[Show Unmatched in Bank]
    DisplayUnmatched --> DisplayUnmatchedSys[Show Unmatched in System]
    DisplayUnmatchedSys --> DisplayDiscrepancies[Show Amount Discrepancies]
    
    DisplayDiscrepancies --> ReviewMatches[Accountant Reviews Auto-Matches]
    ReviewMatches --> ReviewAction{Review Decision}
    
    ReviewAction -->|Accept Matches| ConfirmMatches[Confirm Auto-Matches]
    ReviewAction -->|Adjust Matches| ManualMatch[Manually Match Remaining]
    
    ManualMatch --> SelectBankTrans[Select Bank Transaction]
    SelectBankTrans --> SelectSysTrans[Select System Transaction]
    SelectSysTrans --> ClickMatch[Click Match Button]
    ClickMatch --> LinkTransactions[System Links Transactions]
    LinkTransactions --> RepeatManual{More to Match?}
    RepeatManual -->|Yes| ManualMatch
    RepeatManual -->|No| HandleDiscrepancies
    
    ConfirmMatches --> HandleDiscrepancies[Handle Discrepancies]
    
    HandleDiscrepancies --> DiscrepancyType{Discrepancy Type}
    
    DiscrepancyType -->|Amount Mismatch| CheckBankFees[Check Bank Fees/Exchange Rate]
    CheckBankFees --> CreateAdjustment[Create Adjustment Entry]
    CreateAdjustment --> ResolveDiscrepancy
    
    DiscrepancyType -->|Missing in System| CreateManualTrans[Create Manual Transaction]
    CreateManualTrans --> LinkToProject[Link to Project/Customer]
    LinkToProject --> ResolveDiscrepancy
    
    DiscrepancyType -->|Missing in Bank| InvestigateMissing[Investigate Missing]
    InvestigateMissing --> MissingAction{Resolution}
    MissingAction -->|Not Cleared Yet| MarkPending[Mark as Pending]
    MissingAction -->|Contact Bank| LogInquiry[Log Bank Inquiry]
    MissingAction -->|System Error| CorrectError[Correct System Error]
    MarkPending --> ResolveDiscrepancy
    LogInquiry --> ResolveDiscrepancy
    CorrectError --> ResolveDiscrepancy
    
    ResolveDiscrepancy[All Discrepancies Resolved] --> FinalizeRecon[Finalize Reconciliation]
    FinalizeRecon --> GenerateReport[Generate Reconciliation Report]
    GenerateReport --> SaveRecon[Save Reconciliation]
    SaveRecon --> UpdateTransStatus[Update Transaction Statuses]
    UpdateTransStatus --> Success([Reconciliation Complete])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
```

**Matching Methods:**
1. By bank reference (highest priority)
2. By amount + date (±3 days)
3. By amount + customer name

**Discrepancy Handling:**
- Amount mismatch → Adjustment entry
- Missing in system → Create transaction
- Missing in bank → Pending/Investigate

---

## FLOW 10: Handle Payment Dispute

```mermaid
flowchart TD
    Start([Customer/Outsource Raises Dispute]) --> SystemCreate[System Creates Dispute Ticket]
    SystemCreate --> NotifyAccountant[Notify Accountant]
    NotifyAccountant --> OpenQueue[Accountant Opens Disputes Queue]
    OpenQueue --> ViewDisputeList[View Dispute List]
    
    ViewDisputeList --> SelectDispute[Select Dispute to Review]
    SelectDispute --> ShowDetail[Show Dispute Details]
    
    ShowDetail --> DisplayInfo[Display Dispute Info & Reason]
    DisplayInfo --> ShowHistory[Show Transaction History]
    ShowHistory --> ShowEvidence[Show Supporting Documents]
    ShowEvidence --> ShowComm[Show Communication Log]
    
    ShowComm --> Investigate[Accountant Investigates]
    Investigate --> InvestigateActions[Review Contracts/Invoices/Payments]
    InvestigateActions --> ContactParty[Contact Customer/Outsource]
    ContactParty --> ConsultPM{Need PM Input?}
    
    ConsultPM -->|Yes| ConsultWithPM[Consult with PM]
    ConsultWithPM --> DetermineResolution
    ConsultPM -->|No| DetermineResolution[Determine Resolution]
    
    DetermineResolution --> ResolutionType{Resolution Decision}
    
    ResolutionType -->|Valid Dispute| AdjustPayment[Adjust Payment]
    AdjustPayment --> CreateCreditNote[Create Credit Note]
    CreateCreditNote --> IssueRefund[Issue Refund if needed]
    IssueRefund --> UpdateRecords[Update Payment Records]
    UpdateRecords --> CloseDispute
    
    ResolutionType -->|Invalid Dispute| RejectDispute[Reject Dispute]
    RejectDispute --> DocumentReason[Document Rejection Reason]
    DocumentReason --> SendExplanation[Send Explanation to Disputer]
    SendExplanation --> CloseDispute
    
    ResolutionType -->|Partial Validity| NegotiateSettlement[Negotiate Settlement]
    NegotiateSettlement --> AgreeAmount[Agree on Settlement Amount]
    AgreeAmount --> ProcessSettlement[Process Settlement Payment]
    ProcessSettlement --> UpdateRecords
    
    ResolutionType -->|Cannot Resolve| EscalateDecision{Escalate To?}
    EscalateDecision -->|Senior Accountant| EscalateSenior[Escalate to Senior]
    EscalateDecision -->|CFO| EscalateCFO[Escalate to CFO]
    EscalateDecision -->|Legal| EscalateLegal[Escalate to Legal Team]
    
    EscalateSenior --> AssignEscalation[Assign to Escalation Recipient]
    EscalateCFO --> AssignEscalation
    EscalateLegal --> AssignEscalation
    AssignEscalation --> TrackEscalation[Track Escalation]
    TrackEscalation --> WaitResolution([Wait for Resolution])
    
    CloseDispute[Close Dispute] --> UpdateStatus[Update Status = Resolved]
    UpdateStatus --> LogResolution[Log Resolution Details]
    LogResolution --> NotifyParties[Notify All Involved Parties]
    NotifyParties --> UpdatePaymentRecords[Update Payment Records]
    UpdatePaymentRecords --> Success([Dispute Resolved])
    
    style Start fill:#e1f5e1
    style Success fill:#e1f5e1
    style WaitResolution fill:#ffe1e1
```

**Resolution Options:**
1. **Valid dispute** → Adjust payment, issue refund
2. **Invalid dispute** → Reject with explanation
3. **Partial validity** → Negotiate settlement
4. **Cannot resolve** → Escalate to Senior/CFO/Legal

**Escalation Criteria:**
- High-value disputes (>50M VND)
- Contractual issues
- Legal implications
- Unable to resolve within 30 days

---

## FLOW CONNECTIONS

### How Flows Connect

```mermaid
graph LR
    Dashboard[FLOW 01: Dashboard] --> AR[FLOW 05: AR]
    Dashboard --> AP[FLOW 06: AP]
    Dashboard --> CashFlow[FLOW 08: Cash Flow]
    
    AR --> ConfirmCustomer[FLOW 03: Confirm Customer Payment]
    AP --> ConfirmOutsource[FLOW 04: Confirm Outsource Payment]
    
    ConfirmCustomer --> Recon[FLOW 09: Reconciliation]
    ConfirmOutsource --> Recon
    
    ConfirmCustomer --> Dispute[FLOW 10: Dispute]
    ConfirmOutsource --> Dispute
    
    Dashboard --> Reports[FLOW 07: Reports]
    AR --> Reports
    AP --> Reports
    CashFlow --> Reports
    
    Dashboard --> Milestones[FLOW 02: Milestones]
    Milestones --> ConfirmCustomer
    
    style Dashboard fill:#e1f5ff
    style Reports fill:#ffe1ff
```

**Flow Integration:**
- Dashboard là entry point chính
- AR/AP flows dẫn đến payment confirmations
- Payment confirmations kết nối với reconciliation và disputes
- Tất cả flows có thể generate reports

---

**Status:** ✅ Complete  
**Total Flows:** 10 comprehensive user journeys  
**Coverage:** All major Accountant workflows  
**Tool:** Mermaid flowchart diagrams
