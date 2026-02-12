# WF-07: Confirm Outsource Payment Dialog

**Role:** Accountant  
**Screen:** Confirm Payment to Outsource (Modal Dialog)  
**Size:** 650px width modal  

---

## Purpose

Form to confirm payment to outsource company, with business rule check for customer payment status.

---

## Layout Structure

```
┌──────────────────────────────────────────────────┐
│ Confirm Payment to Outsource               [X]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  Payable Details                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Outsource: XYZ Contractors Ltd             │ │
│  │ Project: PROJ-001 - Website Development    │ │
│  │ Payment Type: Labor Cost                   │ │
│  │ Amount to Pay: 80,000,000 ₫                │ │
│  │ Requested Date: 2025-02-05                 │ │
│  │ Status: ✅ Approved by PM                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Customer Payment Status                         │
│  ┌────────────────────────────────────────────┐ │
│  │ Contract Value: 500M ₫                     │ │
│  │ Total Received: 250M ₫ (50%)               │ │
│  │ Outstanding: 250M ₫ (50%)                  │ │
│  │                                            │ │
│  │ ✅ Customer has paid 50% - OK to proceed    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Payment Information                             │
│  ─────────────────────────────────────────────  │
│                                                  │
│  Actual Amount Paid *                            │
│  ┌────────────────────────────────────────────┐ │
│  │ 80,000,000                             ₫   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Payment Date *                                  │
│  ┌─────────────────┐                            │
│  │ 2025-02-12  📅 │                            │
│  └─────────────────┘                            │
│                                                  │
│  Bank Reference Number *                         │
│  ┌────────────────────────────────────────────┐ │
│  │ FT20250212XYZ789                           │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Payment Method *                                │
│  ┌────────────────────────────────────────────┐ │
│  │ [Bank Transfer                         ▼]  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Upload Payment Proof (Optional)                 │
│  ┌────────────────────────────────────────────┐ │
│  │ [Choose File]                              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Note (Optional)                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Payment for phase 2 labor completed        │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│                   [Cancel] [Confirm Payment]     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Business Rule Warning

**If customer hasn't paid yet:**

```
┌────────────────────────────────────────────────┐
│ ⚠️ Customer Payment Not Received                │
│                                                │
│ Project: PROJ-001 - Website Development       │
│                                                │
│ Customer Payment Status:                       │
│ • Contract Value: 500M ₫                       │
│ • Received: 0 ₫ (0%)                           │
│ • Outstanding: 500M ₫ (100%)                   │
│                                                │
│ Outsource Payment: 80M ₫                       │
│                                                │
│ ⚠️ Warning: Customer has not paid yet          │
│                                                │
│ ○ Wait until customer pays                     │
│ ○ Proceed anyway (requires reason)             │
│ ○ Request Admin override                       │
│                                                │
│           [Cancel] [Proceed with Reason]       │
└────────────────────────────────────────────────┘
```

**If proceeding with override:**

```
┌────────────────────────────────────────────────┐
│ Override Reason Required                       │
│                                                │
│ Why are you proceeding without customer        │
│ payment?                                       │
│ ┌──────────────────────────────────────────┐  │
│ │ Urgent payment to maintain vendor         │  │
│ │ relationship. Cash flow available from    │  │
│ │ other projects.                           │  │
│ │                                           │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ This override will be logged in audit trail.  │
│                                                │
│               [Cancel] [Confirm Override]      │
└────────────────────────────────────────────────┘
```

---

## Components

Similar to WF-06 but with:
- **Customer Payment Status panel:** Shows if customer has paid
- **Business rule check:** Warn if customer hasn't paid
- **Override flow:** If proceeding without customer payment

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 04 (Confirm Outsource Payment)
