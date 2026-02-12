# WF-05: Create Milestone Dialog

**Role:** Accountant / PM  
**Screen:** Create Payment Milestone (Modal Dialog)  
**Size:** 600px width modal  

---

## Purpose

Form to create a new payment milestone for a project.

---

## Layout Structure

```
┌──────────────────────────────────────────────────┐
│ Create Payment Milestone                   [X]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  Select Project *                                │
│  ┌────────────────────────────────────────────┐ │
│  │ [Search or select project...]          ▼  │ │
│  └────────────────────────────────────────────┘ │
│  Selected: PROJ-001 - Website Development       │
│  Contract Value: 500M ₫                          │
│                                                  │
│  Milestone Type *                                │
│  ┌────────────────────────────────────────────┐ │
│  │ ○ Đặt cọc (Deposit)                         │ │
│  │ ○ Tạm ứng (Advance Payment)                 │ │
│  │ ● Nghiệm thu (Acceptance Payment)           │ │
│  │ ○ Final Payment                              │ │
│  │ ○ Custom (specify name below)                │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Custom Milestone Name (if Custom selected)      │
│  ┌────────────────────────────────────────────┐ │
│  │ E.g., Second Advance Payment               │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Amount Calculation Method *                     │
│  ┌────────────────────────────────────────────┐ │
│  │ ● Percentage of contract value              │ │
│  │ ○ Fixed amount (VND)                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Percentage *                                    │
│  ┌─────────────────┐                            │
│  │ 30            % │                            │
│  └─────────────────┘                            │
│  = 150,000,000 ₫                                 │
│                                                  │
│  Current Total: 80% (Đặt cọc: 20%, Tạm ứng: 30%,│
│                      Nghiệm thu: 30% = 80%)      │
│  ⚠️ Warning: Total >100% will show error         │
│  ✅ Remaining: 20%                                │
│                                                  │
│  Due Date *                                      │
│  ┌─────────────────┐                            │
│  │ 2025-03-20  📅 │                            │
│  └─────────────────┘                            │
│                                                  │
│  Note (Optional)                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ Payment for phase 3 completion             │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│                      [Cancel] [Create Milestone] │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Components

### 1. Project Selection
- **Searchable dropdown:** Type to search projects
- **Display:** Project code + name
- **After selection:** Show contract value

### 2. Milestone Type
- **Radio buttons:** Pre-defined types + Custom option
- **If Custom:** Show text input for custom name

### 3. Amount Calculation
- **Radio buttons:** Percentage vs Fixed amount
- **If Percentage:**
  - Number input (0-100)
  - Auto-calculate amount (= percentage × contract value)
  - Show current total % of all milestones
  - **Validation:** Warn if total >100%
- **If Fixed amount:**
  - Currency input (VND)
  - Show percentage equivalent

### 4. Due Date
- **Date picker:** Calendar popup
- **Minimum:** Today (can set past date with warning)

### 5. Note
- **Textarea:** Optional notes

### 6. Validation
**Real-time validation:**
- **Total % > 100%:** Warning message (allow but warn)
- **Amount = 0:** Error (block submit)
- **Due date in past:** Warning (allow but confirm)
- **All required fields:** Must be filled

---

## Interactions

- **Project dropdown:** Search and autocomplete
- **Percentage input:** Auto-calculate amount on change
- **Create button:** 
  - Validate form
  - If valid: Create milestone → Close dialog → Refresh list → Toast success
  - If invalid: Show errors

---

**Wireframe Status:** ✅ Complete  
**Related Flows:** FLOW 02 (Create Payment Milestones)
