# Wave 3.5 — Hotfix: Sai filter shape `GeneralCollectionFilter`

**Date**: 2026-05-08 (sau khi user phản hồi lỗi GraphQL)
**Status**: ✅ Hoàn tất, build clean

---

## Triệu chứng

User test JourneyList → page lỗi GraphQL:
```json
{
  "data": {
    "response": {
      "code": 1,
      "message": "Unable to convert 'System.Collections.Generic.List`1[System.Object]' value of type 'List<Object>' to the scalar type 'String'"
    }
  }
}
```

Payload gửi lên:
```json
{
  "filter": {
    "fields": [],
    "sortFields": [{ "field": "createdAt", "sortType": "desc" }],
    "pageNumber": 1,
    "pageSize": 200
  }
}
```

---

## Root cause

Tôi đã dùng SAI `GeneralCollectionFilter` shape suốt Wave 2 + Wave 3 + Wave 3.5. Shape thực tế từ code base:

```ts
// src/types/filters/GeneralCollectionFilter.ts
export interface GeneralCollectionFilter {
    skip?: number;
    limit?: number;
    group?: GroupQueryFilter;          // tree of conditions
    withRecords?: boolean;
    text?: string;
    sorted?: Array<QueryOrder>;        // [{ id, desc }]
}

// src/types/filters/GroupQueryFilter.ts
export interface GroupQueryFilter {
    id?: string;
    value?: any;
    operation?: FilterOperation | string;
    children: Array<GroupQueryFilter>;  // recursive
    op?: 'AND' | 'OR' | 'EXISTS';
}
```

Shape đúng:
```ts
// Single condition:
{
    group: { id: 'journey_id', operation: 'eq', value: jId, children: [] },
    sorted: [{ id: 'createdAt', desc: true }],
    limit: 200,
}

// Multiple conditions (AND):
{
    group: {
        op: 'AND',
        children: [
            { id: 'journey_id', operation: 'eq', value: jId, children: [] },
            { id: 'status', operation: 'eq', value: 'pending', children: [] },
        ],
    },
    sorted: [{ id: 'createdAt', desc: true }],
}
```

Shape SAI tôi đã dùng (backend không hiểu):
```ts
{
    fields: [{ field: 'journey_id', op: 'eq', value: jId }],   // ❌
    sortFields: [{ field: 'createdAt', sortType: 'desc' }],    // ❌
    pageNumber: 1,                                              // ❌
    pageSize: 200,                                              // ❌
}
```

`as any` cast khiến TypeScript không catch được lỗi shape.

---

## Solution: Helper `buildFilter`

Tạo `src/utils/filterBuilder.ts` để chuẩn hoá:

```ts
import { buildFilter } from '@/utils/filterBuilder';

// Single condition
buildFilter({
    where: { id: 'journey_id', value: jId },
    sortBy: [{ id: 'createdAt', desc: true }],
    limit: 200,
});

// Multiple conditions (AND default)
buildFilter({
    where: [
        { id: 'journey_id', value: jId },
        { id: 'journey_step_code', value: 'execution' },
    ],
    sortBy: [{ id: 'createdAt', desc: false }],
    limit: 100,
});

// Empty filter (sort + limit only)
buildFilter({
    sortBy: [{ id: 'createdAt', desc: true }],
    limit: 200,
});

// Full text search
buildFilter({
    text: 'HT-2026',
    limit: 100,
});
```

Helper auto-defaults `operation: 'eq'` cho leaf nodes, `op: 'AND'` cho group multi-condition.

---

## Files migrated (15 files)

| File | Wave | Notes |
|---|---|---|
| `components/journey/CreatePaymentMilestoneModal.tsx` | W2-04 | nextRound query |
| `components/journey/CreatePaymentRequestModal.tsx` | W2-04 | milestone link query |
| `pages/accountant/Finance/PaymentDashboard.tsx` | W3.5 UX-10 | aggregate cross-journey |
| `pages/accountant/Inventory/Dashboard.tsx` | W3.5 UX-04 | groups + materials |
| `pages/accountant/Warranty/WarrantyCardsList.tsx` | W3-06 | cards list |
| `pages/accountant/Warranty/WarrantySchedule.tsx` | W3-06 | visits + reminders |
| `pages/giam-sat/ProjectDiary.tsx` | W3.5 UX-05 | siteReport list |
| `pages/pm/Inbox/ApprovalInbox.tsx` | W2-03 | 3 sections |
| `pages/pm/Journeys/JourneyList.tsx` | W3.5 UX-06 | search/filter (USER REPORTED) |
| `pages/shared/Expenditures/components/PaymentRequestDetailModal.tsx` | W3.5 UX-12 | journey selector |
| `pages/shared/Journeys/components/MyTasksTab.tsx` | W2-05 | tasks list |
| `pages/shared/JourneySteps/Step06Contract.tsx` | W3-01 | quotation list |
| `pages/shared/JourneySteps/Step09Acceptance.tsx` | W3-02 | 4 queries |
| `pages/shared/JourneySteps/Step10Payment.tsx` | W3-03 | milestones + receipts |
| `pages/shared/JourneySteps/Step11Maintain.tsx` | W3-04 | cases + visits |
| `pages/shared/JourneySteps/Step12Warranty.tsx` | W3-04 | card + cases |
| `pages/shared/JourneySteps/Step13Care.tsx` | W3-05 | tasks + reminders |
| `pages/shared/StockOrderWorkflowList.tsx` | W2-01b | stock orders |

**Total**: 15 files, 25+ query call sites đã migrate sang `buildFilter`.

---

## Verification

- `tsc -b --noEmit` → EXIT=0
- User test JourneyList sau hotfix → confirm GraphQL pass

---

## Lessons learned

1. **`as any` cast là smell**: Nó che giấu lỗi shape mismatch giữa FE và BE. Khi viết query mới, KHÔNG `as any` — dùng đúng type `GeneralCollectionFilter` từ `src/types/filters/`.
2. **Reference working examples**: `pages/giam-sat/SupervisorDashboard.tsx` (line 67-90) là canonical example với `group.children: [...]` + nested `op: 'OR'`. Lần sau viết query mới, tham khảo file này.
3. **Helper for consistency**: `buildFilter` tránh mismatch tương lai. Khi có pattern lặp lại nhiều, tạo utility helper là đúng — đỡ phải gõ và sửa khi shape backend đổi.
4. **Test với real data**: Wave 3 + 3.5 build clean nhưng runtime fail. Build pass không đảm bảo runtime pass — luôn smoke test với real backend trước khi đóng wave.
