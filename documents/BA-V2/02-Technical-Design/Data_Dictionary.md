# 📖 DATA DICTIONARY v2.0
**SIRA Service Management Platform - Complete Field Definitions**

---

## 1. DOCUMENT INFO

| Attribute | Value |
|-----------|-------|
| **Version** | 2.0 |
| **Date** | 2026-02-12 |
| **Based On** | ERD v2.0 |
| **Purpose** | Complete field definitions for all database tables |

---

## 2. CONVENTIONS

### 2.1 Data Types

| Type | Description | Example |
|------|-------------|---------|
| **uuid** | UUID v4 | `550e8400-e29b-41d4-a716-446655440000` |
| **string** | VARCHAR | `"John Doe"` |
| **text** | TEXT (unlimited) | Long descriptions |
| **decimal** | Decimal(10,2) | `1234.56` |
| **bigint** | Big integer | `9223372036854775807` |
| **datetime** | Timestamp | `2026-02-12T10:30:00Z` |
| **date** | Date only | `2026-02-12` |
| **boolean** | True/False | `true` |

### 2.2 Field Naming

- Snake_case: `created_at`, `user_id`
- Suffix `_id` for foreign keys
- Suffix `_at` for timestamps
- Prefix `is_` for booleans

---

## 3. TABLE DEFINITIONS

### 3.1 TENANT

**Purpose**: Multi-tenant isolation

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `name` | string(200) | NO | | Tenant name (company name) |
| `code` | string(50) | NO | | Unique tenant code (slug) |
| `created_at` | datetime | NO | now() | Creation timestamp |

**Indexes**:
- PK: `id`
- UNIQUE: `code`

**Sample Data**:
```json
{
  "id": "550e8400-...",
  "name": "ABC Construction Co.",
  "code": "abc-construction",
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### 3.2 USER

**Purpose**: System users (internal + outsource)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `user_type` | enum | NO | 'INTERNAL' | User type: INTERNAL \| OUTSOURCE |
| `outsource_company_id` | uuid | YES | null | FK to OUTSOURCE_COMPANY (required if user_type=OUTSOURCE) |
| `username` | string(50) | NO | | Login username (unique per tenant) |
| `full_name` | string(200) | NO | | Full display name |
| `phone` | string(20) | YES | null | Phone number (format: +84...) |
| `email` | string(100) | YES | null | Email address |
| `password_hash` | string(255) | NO | | Bcrypt hash |
| `role` | enum | NO | | Role: ADMIN \| PM \| SUPERVISOR \| ACCOUNTANT \| OUTSOURCE_LEADER \| STAFF |
| `status` | enum | NO | 'ACTIVE' | Status: ACTIVE \| DISABLED |
| `created_at` | datetime | NO | now() | Creation timestamp |
| `updated_at` | datetime | NO | now() | Last update timestamp |

**Indexes**:
- PK: `id`
- UNIQUE: `(tenant_id, username)`
- UNIQUE: `(tenant_id, email)` where email IS NOT NULL
- INDEX: `(tenant_id, role)`
- INDEX: `(outsource_company_id)` where NOT NULL

**Business Rules**:
- If `user_type` = OUTSOURCE → `outsource_company_id` must NOT be NULL
- If `user_type` = INTERNAL → `outsource_company_id` must be NULL
- Password must be hashed with bcrypt (min cost: 12)
- Username: 3-50 chars, alphanumeric + underscore only

**Sample Data**:
```json
{
  "id": "user-123",
  "tenant_id": "tenant-1",
  "user_type": "INTERNAL",
  "outsource_company_id": null,
  "username": "john.doe",
  "full_name": "John Doe",
  "phone": "+84901234567",
  "email": "john@company.com",
  "password_hash": "$2a$12$...",
  "role": "PM",
  "status": "ACTIVE"
}
```

---

### 3.3 OUTSOURCE_COMPANY

**Purpose**: Outsource contractor companies

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `name` | string(200) | NO | | Company name |
| `contact_person` | string(200) | YES | null | Contact person name |
| `phone` | string(20) | YES | null | Company phone |
| `email` | string(100) | YES | null | Company email |
| `address` | text | YES | null | Company address |
| `tax_code` | string(50) | YES | null | Tax ID number (unique per tenant) |
| `payment_terms` | string(500) | YES | null | Payment terms (e.g., "Net 30") |
| `status` | enum | NO | 'ACTIVE' | Status: ACTIVE \| INACTIVE |
| `created_at` | datetime | NO | now() | Creation timestamp |
| `updated_at` | datetime | NO | now() | Last update timestamp |

**Indexes**:
- PK: `id`
- UNIQUE: `(tenant_id, tax_code)` where tax_code IS NOT NULL
- INDEX: `(tenant_id, status)`

**Business Rules**:
- Only ADMIN/PM can create outsource companies
- Outsource Leaders must be linked to a company

**Sample Data**:
```json
{
  "id": "company-1",
  "tenant_id": "tenant-1",
  "name": "XYZ Contractors Ltd.",
  "contact_person": "Jane Smith",
  "phone": "+84987654321",
  "email": "contact@xyz.com",
  "address": "123 Main St, HCMC",
  "tax_code": "0123456789",
  "payment_terms": "Net 30 days from invoice",
  "status": "ACTIVE"
}
```

---

### 3.4 PROJECT

**Purpose**: Construction projects

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `contract_id` | uuid | NO | | FK to CONTRACT |
| `customer_id` | uuid | NO | | FK to CUSTOMER |
| `pm_id` | uuid | NO | | FK to USER (Project Manager) |
| `supervisor_id` | uuid | YES | null | FK to USER (Supervisor, for outsource projects) |
| `outsource_company_id` | uuid | YES | null | FK to OUTSOURCE_COMPANY |
| `project_type` | enum | NO | 'INTERNAL' | Type: INTERNAL \| OUTSOURCE |
| `code` | string(50) | NO | | Unique project code (e.g., "PRJ-2026-001") |
| `name` | string(200) | NO | | Project name/title |
| `address` | text | NO | | Project site address |
| `geo_lat` | string(20) | YES | null | Latitude (e.g., "10.762622") |
| `geo_lng` | string(20) | YES | null | Longitude (e.g., "106.660172") |
| `waterproofing_type` | string(100) | YES | null | Type of waterproofing (e.g., "Polyurethane") |
| `status` | enum | NO | 'DRAFT' | Status: DRAFT \| SCHEDULED \| IN_PROGRESS \| AWAITING_APPROVAL \| COMPLETED \| CLOSED \| CANCELLED |
| `plan_start` | date | YES | null | Planned start date |
| `plan_end` | date | YES | null | Planned end date |
| `created_at` | datetime | NO | now() | Creation timestamp |
| `updated_at` | datetime | NO | now() | Last update timestamp |

**Indexes**:
- PK: `id`
- UNIQUE: `(tenant_id, code)`
- INDEX: `(tenant_id, status, plan_start)`
- INDEX: `(pm_id)`
- INDEX: `(supervisor_id)` where NOT NULL
- INDEX: `(outsource_company_id)` where NOT NULL

**Business Rules**:
- If `project_type` = OUTSOURCE → `outsource_company_id` must NOT be NULL
- If `project_type` = INTERNAL → `outsource_company_id` must be NULL
- `plan_start` <= `plan_end`
- Only PM/Admin can create projects

---

### 3.5 FILE_STORAGE

**Purpose**: File storage abstraction (Google Drive integration)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `uploaded_by` | uuid | NO | | FK to USER (uploader) |
| `file_type` | enum | NO | | Type: IMAGE \| VIDEO \| PDF \| EXCEL \| OTHER |
| `original_name` | string(255) | NO | | Original filename (e.g., "photo.jpg") |
| `mime_type` | string(100) | NO | | MIME type (e.g., "image/jpeg") |
| `file_size` | bigint | NO | | File size in bytes (max: 500MB) |
| `storage_provider` | enum | NO | 'LOCAL' | Provider: LOCAL \| GOOGLE_DRIVE \| S3 |
| `storage_url` | text | NO | | Full URL or path to file |
| `thumbnail_url` | text | YES | null | Thumbnail URL (for images/videos only) |
| `uploaded_at` | datetime | NO | now() | Upload timestamp |

**Indexes**:
- PK: `id`
- INDEX: `(tenant_id, project_id, file_type)`
- INDEX: `(tenant_id, uploaded_by, uploaded_at)`

**Business Rules**:
- `file_size` > 0 AND <= 524,288,000 (500MB)
- Auto-generate `thumbnail_url` for IMAGE/VIDEO types
- Supported MIME types: image/*, video/*, application/pdf, application/vnd.ms-excel

**Sample Data**:
```json
{
  "id": "file-1",
  "tenant_id": "tenant-1",
  "project_id": "proj-1",
  "uploaded_by": "user-1",
  "file_type": "IMAGE",
  "original_name": "before_waterproofing_1.jpg",
  "mime_type": "image/jpeg",
  "file_size": 2048576,
  "storage_provider": "GOOGLE_DRIVE",
  "storage_url": "https://drive.google.com/file/d/...",
  "thumbnail_url": "https://drive.google.com/thumbnail/...",
  "uploaded_at": "2026-02-12T10:30:00Z"
}
```

---

### 3.6 EVIDENCE

**Purpose**: Project evidence (photos/videos before, during, after)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `file_id` | uuid | NO | | FK to FILE_STORAGE |
| `uploaded_by` | uuid | NO | | FK to USER (uploader) |
| `stage` | enum | NO | | Stage: BEFORE \| DURING \| AFTER |
| `status` | enum | NO | 'UPLOADED' | Status: UPLOADED \| APPROVED \| REJECTED |
| `reject_reason` | text | YES | null | Reason for rejection (required if status=REJECTED) |
| `reviewed_by` | uuid | YES | null | FK to USER (reviewer: PM/Supervisor) |
| `reviewed_at` | datetime | YES | null | Review timestamp |
| `note` | text | YES | null | Optional notes from uploader |
| `created_at` | datetime | NO | now() | Upload timestamp |

**Indexes**:
- PK: `id`
- INDEX: `(project_id, stage, status)`
- INDEX: `(file_id)`

**Business Rules**:
- BEFORE stage required before project can start
- No min/max count (flexible)
- Only PM/Supervisor can approve/reject
- If `status` = REJECTED → `reject_reason` is required

---

### 3.7 PAYMENT_MILESTONE

**Purpose**: Payment milestones (deposit, advance, acceptance, final)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `milestone_type` | enum | NO | | Type: DEPOSIT \| ADVANCE \| ACCEPTANCE \| FINAL |
| `amount` | decimal(15,2) | NO | | Amount in VND |
| `percentage` | decimal(5,2) | NO | | Percentage of total contract value (0-100) |
| `status` | enum | NO | 'PENDING' | Status: PENDING \| PAID \| OVERDUE |
| `due_date` | date | YES | null | Due date for payment |
| `paid_date` | date | YES | null | Actual paid date |
| `paid_by` | uuid | YES | null | FK to USER (Accountant who confirmed) |
| `payment_method` | enum | YES | null | Method: CASH \| BANK \| OTHER |
| `note` | text | YES | null | Notes |
| `created_at` | datetime | NO | now() | Creation timestamp |
| `updated_at` | datetime | NO | now() | Last update timestamp |

**Indexes**:
- PK: `id`
- INDEX: `(project_id, status)`
- INDEX: `(tenant_id, due_date, status)` for overdue checks

**Business Rules**:
- Sum of all `percentage` for a project = 100%
- Only Accountant can mark as PAID
- Auto-set `status` = OVERDUE if `due_date` < today AND `status` = PENDING

---

### 3.8 PAYMENT_TXN

**Purpose**: Payment transactions (income from customer, expense to outsource)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `milestone_id` | uuid | NO | | FK to PAYMENT_MILESTONE |
| `project_id` | uuid | NO | | FK to PROJECT |
| `created_by` | uuid | NO | | FK to USER (Accountant) |
| `direction` | enum | NO | | Direction: INCOME \| EXPENSE |
| `payee` | enum | NO | | Payee type: CUSTOMER \| OUTSOURCE_COMPANY |
| `payee_company_id` | uuid | YES | null | FK to OUTSOURCE_COMPANY (if payee=OUTSOURCE_COMPANY) |
| `amount` | decimal(15,2) | NO | | Transaction amount |
| `txn_at` | datetime | NO | now() | Transaction timestamp |
| `attachment_url` | text | YES | null | Receipt/proof document URL |
| `note` | text | YES | null | Transaction notes |

**Indexes**:
- PK: `id`
- INDEX: `(project_id, txn_at)`
- INDEX: `(milestone_id)`

**Business Rules**:
- INCOME: from customer (payee=CUSTOMER)
- EXPENSE: to outsource (payee=OUTSOURCE_COMPANY)
- If `payee` = OUTSOURCE_COMPANY → `payee_company_id` required

---

### 3.9 PROJECT_SHARE_LINK

**Purpose**: Customer portal access via share link

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `created_by` | uuid | NO | | FK to USER (PM) |
| `token` | string(64) | NO | | Unique random token (min 32 chars) |
| `access_level` | enum | NO | 'BASIC' | Access level: BASIC \| FULL |
| `expires_at` | datetime | YES | null | Expiration timestamp (null = never) |
| `is_active` | boolean | NO | true | Active status (PM can revoke) |
| `created_at` | datetime | NO | now() | Creation timestamp |

**Indexes**:
- PK: `id`
- UNIQUE: `token`
- INDEX: `(token, is_active)`
- INDEX: `(tenant_id, project_id)`

**Business Rules**:
- `token` must be cryptographically secure random (min 32 chars)
- Only PM can create/revoke links
- Link is invalid if `is_active` = false OR `expires_at` < now()
- BASIC: show progress, evidence
- FULL: show financial info

---

### 3.10 PROJECT_LABOR_COST

**Purpose**: Labor cost calculation (flexible per project)

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `user_id` | uuid | YES | null | FK to USER (for individual staff cost) |
| `outsource_company_id` | uuid | YES | null | FK to OUTSOURCE_COMPANY (for outsource cost) |
| `cost_type` | enum | NO | | Type: MANDAY \| PERCENTAGE \| FIXED \| CUSTOM |
| `rate` | decimal(10,2) | YES | null | Daily rate (for MANDAY) |
| `percentage` | decimal(5,2) | YES | null | Percentage of project value (for PERCENTAGE) |
| `fixed_amount` | decimal(15,2) | YES | null | Fixed amount (for FIXED) |
| `custom_formula` | text | YES | null | Custom formula (for CUSTOM, e.g., "days * 500 + materials * 0.1") |
| `actual_cost` | decimal(15,2) | YES | null | Calculated actual cost |
| `note` | text | YES | null | Notes |
| `created_at` | datetime | NO | now() | Creation timestamp |
| `updated_at` | datetime | NO | now() | Last update timestamp |

**Indexes**:
- PK: `id`
- INDEX: `(tenant_id, project_id)`
- INDEX: `(tenant_id, outsource_company_id)` where NOT NULL

**Business Rules**:
- If `cost_type` = MANDAY → `rate` is required
- If `cost_type` = PERCENTAGE → `percentage` is required
- If `cost_type` = FIXED → `fixed_amount` is required
- If `cost_type` = CUSTOM → `custom_formula` is required
- Internal staff: default MANDAY
- Outsource: default PERCENTAGE or FIXED

---

### 3.11 MATERIAL_USAGE

**Purpose**: Material consumption tracking

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `project_id` | uuid | NO | | FK to PROJECT |
| `task_id` | uuid | YES | null | FK to TASK (optional) |
| `material_id` | uuid | NO | | FK to MATERIAL_CATALOG |
| `recorded_by` | uuid | NO | | FK to USER |
| `quantity_planned` | decimal(10,2) | NO | 0 | Planned quantity (PM input) |
| `quantity_actual` | decimal(10,2) | YES | null | Actual quantity (Supervisor/Outsource Leader input) |
| `unit_cost` | decimal(10,2) | NO | | Cost per unit |
| `total_cost` | decimal(15,2) | NO | | Total cost = quantity * unit_cost |
| `used_at` | datetime | NO | now() | Usage timestamp |
| `note` | text | YES | null | Notes |

**Business Rules**:
- PM inputs `quantity_planned`
- Supervisor/Outsource Leader confirms `quantity_actual`
- `total_cost` calculated based on `quantity_actual` (if available) else `quantity_planned`

---

### 3.12 CHAT_MESSAGE

**Purpose**: Project chat messages

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `tenant_id` | uuid | NO | | FK to TENANT |
| `room_id` | uuid | NO | | FK to CHAT_ROOM |
| `sender_id` | uuid | NO | | FK to USER |
| `reply_to_id` | uuid | YES | null | FK to CHAT_MESSAGE (for threads) |
| `message` | text | NO | | Message content |
| `created_at` | datetime | NO | now() | Send timestamp |

**Indexes**:
- PK: `id`
- INDEX: `(room_id, created_at DESC)`

**Business Rules**:
- Each project has 1 CHAT_ROOM
- Messages retained for 1 year
- Supports file attachments via CHAT_ATTACHMENT

---

### 3.13 CHAT_ATTACHMENT

**Purpose**: File attachments in chat

| Field | Type | Null | Default | Description |
|-------|------|------|---------|-------------|
| `id` | uuid | NO | uuid_generate_v4() | Primary key |
| `message_id` | uuid | NO | | FK to CHAT_MESSAGE |
| `file_id` | uuid | NO | | FK to FILE_STORAGE |

**Indexes**:
- PK: `id`
- INDEX: `(message_id)`

**Business Rules**:
- 1 message can have multiple attachments
- Max 10 attachments per message
- Supported types: IMAGE, VIDEO, PDF, EXCEL

---

## 4. ENUM DEFINITIONS

### 4.1 user_type
- **INTERNAL**: Internal staff of the company
- **OUTSOURCE**: External contractor staff

### 4.2 role
- **ADMIN**: System administrator
- **PM**: Project Manager
- **SUPERVISOR**: Internal supervisor (can oversee outsource teams)
- **ACCOUNTANT**: Financial/accounting staff
- **OUTSOURCE_LEADER**: Leader of outsource team
- **STAFF**: General internal staff

### 4.3 project_type
- **INTERNAL**: Project executed by internal staff
- **OUTSOURCE**: Project executed by outsource team

### 4.4 project_status
- **DRAFT**: Project created but not scheduled
- **SCHEDULED**: Project scheduled with dates
- **IN_PROGRESS**: Work started
- **AWAITING_APPROVAL**: Work done, awaiting customer approval
- **COMPLETED**: Approved and completed
- **CLOSED**: Financially closed
- **CANCELLED**: Project cancelled

### 4.5 evidence_stage
- **BEFORE**: Photos/videos before work starts
- **DURING**: Photos/videos during work
- **AFTER**: Photos/videos after work completed

### 4.6 evidence_status
- **UPLOADED**: Evidence uploaded, pending review
- **APPROVED**: Evidence approved by PM/Supervisor
- **REJECTED**: Evidence rejected (need re-upload)

### 4.7 milestone_type
- **DEPOSIT**: Initial deposit (e.g., 30%)
- **ADVANCE**: Advance payment (e.g., 40%)
- **ACCEPTANCE**: Payment upon acceptance (e.g., 20%)
- **FINAL**: Final payment (e.g., 10%)

### 4.8 payment_status
- **PENDING**: Payment not yet made
- **PAID**: Payment confirmed by Accountant
- **OVERDUE**: Payment overdue (past due_date)

### 4.9 payment_direction
- **INCOME**: Money received from customer
- **EXPENSE**: Money paid to outsource company

### 4.10 file_type
- **IMAGE**: Image files (jpg, png, heic)
- **VIDEO**: Video files (mp4, mov)
- **PDF**: PDF documents
- **EXCEL**: Excel files
- **OTHER**: Other file types

### 4.11 storage_provider
- **LOCAL**: Local server storage
- **GOOGLE_DRIVE**: Google Drive API
- **S3**: AWS S3

### 4.12 access_level
- **BASIC**: Customer sees progress, evidence only
- **FULL**: Customer sees all info including financials

### 4.13 cost_type
- **MANDAY**: Cost per day (rate * days)
- **PERCENTAGE**: Percentage of project value
- **FIXED**: Fixed amount
- **CUSTOM**: Custom formula

---

## 5. VALIDATION RULES

### 5.1 String Length Limits

| Field Pattern | Max Length |
|---------------|------------|
| `name` | 200 |
| `code` | 50 |
| `username` | 50 |
| `email` | 100 |
| `phone` | 20 |
| `password_hash` | 255 |
| `token` | 64 |
| `mime_type` | 100 |
| `original_name` | 255 |

### 5.2 Numeric Ranges

| Field | Min | Max |
|-------|-----|-----|
| `file_size` | 1 byte | 500MB (524,288,000 bytes) |
| `percentage` | 0 | 100 |
| `amount` | 0 | 999,999,999,999.99 |
| `quantity` | 0 | 999,999.99 |

### 5.3 Date Validations

- `plan_start` <= `plan_end`
- `effective_from` <= `effective_to`
- `paid_date` >= payment `created_at`

---

## 6. DEFAULT VALUES

| Field | Default |
|-------|---------|
| `user_type` | 'INTERNAL' |
| `project_type` | 'INTERNAL' |
| `evidence_status` | 'UPLOADED' |
| `payment_status` | 'PENDING' |
| `storage_provider` | 'LOCAL' |
| `access_level` | 'BASIC' |
| `is_active` | true |
| `quantity_planned` | 0 |

---

**Version**: 2.0  
**Date**: 2026-02-12  
**Status**: Draft
