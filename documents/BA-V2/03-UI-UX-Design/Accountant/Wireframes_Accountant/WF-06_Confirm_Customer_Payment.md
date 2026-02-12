# WF-06: Confirm Customer Payment Dialog

**Role:** Accountant  
**Screen:** Confirm Payment from Customer (Modal Dialog)  
**Size:** 600px width modal  

---

## Purpose

Form to confirm payment received from customer for a specific milestone.

---

## Layout Structure

```
┌──────────────────────────────────────────────────┐
│ Confirm Payment from Customer              [X]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  Payment Details                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Customer: ABC Company                      │ │
│  │ Project: PROJ-001 - Website Development    │ │
│  │ Milestone: Nghiệm thu (Acceptance Payment) │ │
│  │ Amount Due: 150,000,000 ₫                  │ │
│  │ Due Date: 2025-03-20                       │ │
│  │ Status: ⏳ Pending                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Actual Payment Information                      │
│  ─────────────────────────────────────────────  │
│                                                  │
│  Actual Amount Received *                        │
│  ┌────────────────────────────────────────────┐ │
│  │ 150,000,000                            ₫   │ │
│  └────────────────────────────────────────────┘ │
│  ✅ Exact payment                                 │
│                                                  │
│  Payment Date *                                  │
│  ┌─────────────────┐                            │
│  │ 2025-02-12  📅 │                            │
│  └─────────────────┘                            │
│                                                  │
│  Bank Reference Number *                         │
│  ┌────────────────────────────────────────────┐ │
│  │ FT20250212ABC123456                        │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Payment Method *                                │
│  ┌────────────────────────────────────────────┐ │
│  │ [Bank Transfer                         ▼]  │ │
│  └────────────────────────────────────────────┘ │
│  Options: Bank Transfer / Cash / Check           │
│                                                  │
│  Upload Proof of Payment (Optional)              │
│  ┌────────────────────────────────────────────┐ │
│  │ [Choose File]  payment_proof.pdf   97KB   │ │
│  └────────────────────────────────────────────┘ │
│  Accepted: PDF, JPG, PNG (max 10MB)              │
│                                                  │
│  Note (Optional)                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Received via Vietcombank transfer          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│                   [Cancel] [Confirm Payment]     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Components

### 1. Payment Details (Read-only)
- Customer name
- Project info
- Milestone name
- Amount due
- Due date
- Current status

### 2. Actual Amount Input
- **Number input:** Right-aligned, formatted với commas
- **Auto-check:**
  - If = due amount: ✅ "Exact payment"
  - If < due amount: ⚠️ "Partial payment: {remaining} remaining"
  - If > due amount: ⚠️ "Overpayment: +{excess}"

### 3. Payment Date
- **Date picker:** Default = today
- **Validation:** Must be ≤ today

### 4. Bank Reference
- **Text input:** Alphanumeric
- **Required if:** Payment method = Bank Transfer

### 5. Payment Method
- **Dropdown:** Bank Transfer (default) / Cash / Check

### 6. Upload Proof
- **File upload:** Optional but recommended
- **Accepted:** PDF, JPG, PNG
- **Max size:** 10MB

### 7. Note
- **Textarea:** Optional notes

---

## Validation & Warnings

### Partial Payment Warning
```
┌────────────────────────────────────────────────┐
│ ⚠️ Partial Payment Detected                    │
│                                                │
│ Actual amount (100M ₫) < Amount due (150M ₫)  │
│ Remaining balance: 50M ₫                       │
│                                                │
│ ○ Accept partial payment                       │
│   → Create remaining balance milestone        │
│                                                │
│ ○ Cancel and contact customer                  │
│                                                │
│            [Back to Edit] [Proceed]            │
└────────────────────────────────────────────────┘
```

### Overpayment Warning
```
┌────────────────────────────────────────────────┐
│ ⚠️ Overpayment Detected                        │
│                                                │
│ Actual amount (170M ₫) > Amount due (150M ₫)  │
│ Excess amount: +20M ₫                          │
│                                                │
│ ○ Apply excess to next milestone               │
│ ○ Process refund to customer                   │
│ ○ Cancel and clarify with customer             │
│                                                │
│            [Back to Edit] [Proceed]            │
└────────────────────────────────────────────────┘
```

---

## Interactions

- **Amount input change:** Auto-detect partial/overpayment
- **Confirm button:**
  - If exact: Direct confirmation
  - If partial/over: Show warning dialog → Choose action → Confirm
  - Update milestone status
  - Send notification to PM
  - Toast success message
  - Close dialog → Refresh list

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 03 (Confirm Customer Payment)
