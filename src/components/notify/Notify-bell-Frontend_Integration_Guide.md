# Notification Inbox — Frontend Integration Guide

> **Phiên bản:** 1.1  
> **Backend entity:** `UserNotificationItem` (collection `usernotificationitem`)  
> **GraphQL schema:** App API (`IBaseAppQueryService` / `IBaseAppMutationService`)  
> **Yêu cầu auth:** User đã đăng nhập (session hợp lệ)

---

## ⚠️ Lưu ý quan trọng cho Frontend

### 1. Collection `usernotificationitem` chỉ có data từ InApp delivery mới
Collection này được tạo mới và **chỉ populate khi có InApp notification được gửi thành công** qua pipeline mới (`InAppNotificationConsumer → SaveToUserInboxAsync`). Các notification cũ (trong `NotificationDeliveryLog`) **không được migrate** tự động.

→ **Nếu inbox rỗng (`"Trống"`) và count = 0:** đây là bình thường nếu chưa có notification nào được gửi qua pipeline mới. Không phải lỗi frontend.

### 2. `categories` trong `get_my_notification_summary` luôn trả về đầy đủ danh mục
Kể từ **v1.1**, backend trả về **tất cả `NotificationCategory` active** của tenant, kể cả khi `total = 0`. Frontend **không cần** merge thêm với `get_notification_categories`.

→ Dropdown "Danh mục" hiển thị thẳng từ `data.categories` (kể cả count = 0).

---

## 1. Tổng quan luồng dữ liệu

```
Bell icon badge ──► get_my_unread_count          (polling mỗi 30s hoặc SSE push)
                          │
User click bell  ──► get_my_notification_summary  (tab counts + danh mục dropdown)
                    + get_my_notifications         (danh sách trang 1)
                          │
User filter/search ──► get_my_notifications       (với params isRead/categoryId/keyword)
                          │
User click item  ──► mark_notification_read       (đánh dấu đã đọc, sau đó navigate deepLink)
                          │
Mark all read    ──► mark_all_notifications_read
Delete item      ──► delete_my_notification
Delete all       ──► delete_all_my_notifications
```

---

## 2. Wireframe

### 2a. Desktop — Panel nổi (Popover)

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard                          🔍  🔔[8]  ≡             │
│                                         └──────────────────┐ │
│  ┌─────────────────────────────────────┤  Thông báo      ✕ │ │
│  │                                     ├──────────────────┤ │
│  │  🔍 Nhập để tìm kiếm                │                  │ │
│  │  ┌──────────────────────────────────┤                  │ │
│  │  │ [Tất 8] [Chưa đọc 6] [Đã đọc 2] │  [Danh mục ▼]   │ │
│  │  ├──────────────────────────────────┤                  │ │
│  │  │ 🔴 [🎯] Công việc        5ph trước│                  │ │
│  │  │      Có task mới được giao...     │                  │ │
│  │  │      ┌──────────────────────┐    │                  │ │
│  │  │      │  [Ảnh đính kèm]      │    │                  │ │
│  │  │      └──────────────────────┘    │                  │ │
│  │  ├──────────────────────────────────┤                  │ │
│  │  │ 🔴 [📋] Đăng ký cư dân   1h trước│                  │ │
│  │  │      Có yêu cầu đăng ký tài...   │                  │ │
│  │  ├──────────────────────────────────┤                  │ │
│  │  │    [🗓] Sự kiện         2 ngày nữa│                  │ │
│  │  │      Sự kiện Ngày hội gia đình... │                  │ │
│  │  ├──────────────────────────────────┤                  │ │
│  │  │    [🕐] Kế hoạch phân ca   Hôm qua│                  │ │
│  │  │      Nhắc nhở: Đã đến thời...    │                  │ │
│  │  ├──────────────────────────────────┤                  │ │
│  │  │  Mẹo: ESC để đóng    ‹  1 / 2  › │                  │ │
│  │  └──────────────────────────────────┘                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 2b. Mobile — Màn hình đầy đủ

```
┌─────────────────────────────┐
│ ◁  Thông báo              🔍│
├─────────────────────────────┤
│ 🔍 Nhập để tìm kiếm     [🔍]│
├─────────────────────────────┤
│[Tất 8][Chưa đọc 8][Đã đọc]  │
│                  [Danh mục ▼]│
├─────────────────────────────┤
│ • [🎯] Công việc    2      │ │
│   Có task mới được giao... │ │
│   [──────────────────────] │ │  ← imageUrl
│   5 phút trước             │ │
├─────────────────────────────┤
│ • [📋] Đăng ký cư dân  4  │ │
│   Có yêu cầu đăng ký...   │ │
├─────────────────────────────┤
│ ✓ [🗓] Sự kiện         1  │ │  ← isRead
│   Sự kiện Ngày hội...     │ │
├─────────────────────────────┤
│   ‹  1 / 3  ›              │
└─────────────────────────────┘
```

### 2c. Dropdown Danh mục

```
┌──────────────────────────────┐
│ 🔔 Tất cả                 8 │  ← total unread
│ 🎯 Công việc               2 │
│ 📋 Đăng ký cư dân          4 │
│ 🗓 Sự kiện                 1 │
│ 🕐 Kế hoạch phân ca        1 │
│ 🔗 Đồ thất lạc             0 │
│              [Thu gọn]        │
└──────────────────────────────┘
```

---

## 3. Data Model — `UserNotificationItem`

| Field          | Type                   | Mô tả                                                         |
|----------------|------------------------|---------------------------------------------------------------|
| `_id`          | `String`               | MongoDB ObjectId                                             |
| `messageId`    | `String`               | Idempotency key, liên kết với NotificationOutbox             |
| `recipientKey` | `String`               | Username người nhận (ẩn với frontend)                        |
| `subject`      | `String`               | **Tiêu đề thông báo** (đã render)                            |
| `body`         | `String`               | **Nội dung tóm tắt** (đã render, plain text)                 |
| `imageUrl`     | `String?`              | URL ảnh preview (nếu có)                                     |
| `deepLink`     | `String?`              | Deep link điều hướng khi click. VD: `headless://schema/Pet/detail/abc` |
| `categoryId`   | `String?`              | FK → `NotificationCategory._id`                              |
| `priority`     | `Int`                  | `0`=thấp, `1`=bình thường, `2`=cao                           |
| `workflowKey`  | `String`               | Nguồn phát. VD: `trigger.NewTask`, `PUSHNOTIFICATION`        |
| `actions`      | `[NotificationAction]?`| Nút hành động (tối đa 3)                                     |
| `customData`   | `Object?`              | Custom data cho client-side logic                            |
| `isRead`       | `Boolean`              | `false` = chưa đọc (hiển thị chấm đỏ)                       |
| `readAt`       | `DateTime?`            | Thời điểm đọc                                                |
| `createdAt`    | `DateTime`             | Thời điểm nhận thông báo (dùng hiển thị timestamp)          |

---

## 4. GraphQL Queries

### 4.1 Badge biểu tượng chuông — `get_my_unread_count`

**Mục đích:** Lấy số thông báo chưa đọc để hiển thị badge đỏ trên icon chuông.  
**Polling:** mỗi 30 giây, hoặc update khi nhận SSE event `usernotification`.

```graphql
query GetMyUnreadCount {
  get_my_unread_count {
    code
    data        # Int — số lượng chưa đọc
  }
}
```

**Response:**
```json
{
  "data": {
    "get_my_unread_count": {
      "code": 1,
      "data": 8
    }
  }
}
```

**UI mapping:**
```
🔔[8]  ←── data
```

---

### 4.2 Mở panel — `get_my_notification_summary`

**Mục đích:** Lấy thống kê tab (Tất cả / Chưa đọc / Đã đọc) và danh sách danh mục kèm số lượng. Gọi **một lần** khi user mở panel.

```graphql
query GetMyNotificationSummary {
  get_my_notification_summary {
    code
    data {
      total          # Tổng thông báo
      unread         # Số chưa đọc
      categories {
        categoryId
        categoryName
        categoryIcon   # Ant Design icon name. VD: "BellOutlined"
        categoryColor  # Hex. VD: "#f5222d"
        total
        unread
      }
    }
  }
}
```

**Response (kể cả khi inbox trống — tất cả category active vẫn được trả về với count=0):**
```json
{
  "data": {
    "get_my_notification_summary": {
      "code": 1,
      "data": {
        "total": 8,
        "unread": 6,
        "categories": [
          {
            "categoryId": "6630abc123",
            "categoryName": "Công việc",
            "categoryIcon": "ToolOutlined",
            "categoryColor": "#1677ff",
            "total": 2,
            "unread": 2
          },
          {
            "categoryId": "6630abc124",
            "categoryName": "Đăng ký cư dân",
            "categoryIcon": "FormOutlined",
            "categoryColor": "#722ed1",
            "total": 4,
            "unread": 3
          },
          {
            "categoryId": "6630abc125",
            "categoryName": "Đồ thất lạc",
            "categoryIcon": "SearchOutlined",
            "categoryColor": "#fa8c16",
            "total": 0,
            "unread": 0
          }
        ]
      }
    }
  }
}
```

> **Quan trọng:** `categories` luôn bao gồm **tất cả** `NotificationCategory` active của tenant (v1.1+), được sắp xếp theo `sortOrder` rồi `name`. Kể cả category chưa có notification nào cũng xuất hiện với `total=0, unread=0`.

**UI mapping:**
```
[Tất 8]           ←── total
[Chưa đọc 6]      ←── unread
[Đã đọc 2]        ←── total - unread

Danh mục dropdown — render TOÀN BỘ categories (kể cả unread=0):
  🔔 Tất cả         8   ←── summary.total / summary.unread (hardcode ở frontend)
  🔧 Công việc      2   ←── categories[0].unread
  📋 Đăng ký cư dân 3   ←── categories[1].unread
  🔍 Đồ thất lạc    0   ←── categories[2].unread (vẫn hiển thị)
```

---

### 4.3 Danh sách thông báo — `get_my_notifications`

**Mục đích:** Lấy danh sách có phân trang. Gọi khi mở panel, đổi tab, lọc danh mục, tìm kiếm, hoặc chuyển trang.

```graphql
query GetMyNotifications(
  $isRead: Boolean
  $categoryId: String
  $keyword: String
  $skip: Int
  $limit: Int
) {
  get_my_notifications(
    isRead: $isRead
    categoryId: $categoryId
    keyword: $keyword
    skip: $skip
    limit: $limit
  ) {
    code
    records      # Tổng số (không phụ thuộc phân trang)
    data {
      _id
      subject
      body
      imageUrl
      deepLink
      categoryId
      priority
      workflowKey
      isRead
      readAt
      createdAt
      actions {
        actionId
        label
        icon
        type       # OpenUrl | DeepLink | CallApi | Dismiss
        url
        deepLink
        apiEndpoint
        payload
      }
      customData
    }
  }
}
```

#### Tham số

| Param        | Type      | Default | Mô tả                                              |
|--------------|-----------|---------|----------------------------------------------------|
| `isRead`     | `Boolean?`| null    | `null`=tất cả, `false`=chưa đọc, `true`=đã đọc   |
| `categoryId` | `String?` | null    | Lọc theo chủ đề (từ summary.categories[n].categoryId) |
| `keyword`    | `String?` | null    | Tìm kiếm trong subject + body                      |
| `skip`       | `Int`     | 0       | Số bản ghi bỏ qua (offset)                        |
| `limit`      | `Int`     | 20      | Số bản ghi lấy về (max 100)                       |

#### Ví dụ theo từng tab

```graphql
# Tab "Tất cả"
variables: { skip: 0, limit: 20 }

# Tab "Chưa đọc"
variables: { isRead: false, skip: 0, limit: 20 }

# Tab "Đã đọc"
variables: { isRead: true, skip: 0, limit: 20 }

# Lọc theo danh mục "Công việc"
variables: { categoryId: "6630abc123", skip: 0, limit: 20 }

# Tìm kiếm + lọc chưa đọc
variables: { isRead: false, keyword: "task", skip: 0, limit: 20 }

# Trang 2 (20 items/trang)
variables: { skip: 20, limit: 20 }
```

**Tính số trang:**
```javascript
const totalPages = Math.ceil(records / limit);
const currentPage = Math.floor(skip / limit) + 1;
// Hiển thị: "1 / 3"
```

**UI mapping từng item:**
```
● [icon]  subject                createdAt (relative)
          body (2 dòng max)
          [imageUrl nếu có]
          [action buttons nếu có]

● = isRead === false  →  chấm đỏ hiển thị
```

**Hiển thị timestamp tương đối (`createdAt`):**
```javascript
// Gợi ý dùng dayjs hoặc date-fns
dayjs(createdAt).fromNow()
// "5 phút trước", "1 giờ trước", "Hôm qua", "2 ngày trước"

// Với future: "2 ngày nữa" (scheduled notifications)
```

---

## 5. GraphQL Mutations

### 5.1 Đánh dấu đã đọc một thông báo — `mark_notification_read`

**Gọi khi:** User click vào một notification item. Sau khi gọi xong, navigate theo `deepLink`.

```graphql
mutation MarkNotificationRead($id: String!) {
  mark_notification_read(_id: $id) {
    code
    message
    data {
      _id
      isRead
      readAt
    }
  }
}
```

**Flow frontend:**
```javascript
// 1. Gọi mutation
await markNotificationRead({ variables: { id: item._id } });

// 2. Cập nhật local state (optimistic update hoặc refetch)
updateItemInList(item._id, { isRead: true });
decrementUnreadCount();

// 3. Navigate nếu có deepLink
if (item.deepLink) navigateToDeepLink(item.deepLink);
```

---

### 5.2 Đánh dấu tất cả đã đọc — `mark_all_notifications_read`

```graphql
mutation MarkAllNotificationsRead($categoryId: String) {
  mark_all_notifications_read(categoryId: $categoryId) {
    code
    data    # Int — số thông báo đã được đánh dấu
  }
}
```

**Ví dụ:**
```graphql
# Đánh dấu tất cả
mutation { mark_all_notifications_read { code data } }

# Đánh dấu tất cả trong chủ đề "Công việc"
mutation {
  mark_all_notifications_read(categoryId: "6630abc123") { code data }
}
```

---

### 5.3 Xóa một thông báo — `delete_my_notification`

```graphql
mutation DeleteMyNotification($id: String!) {
  delete_my_notification(_id: $id) {
    code
    message
    data    # Boolean
  }
}
```

---

### 5.4 Xóa toàn bộ — `delete_all_my_notifications`

```graphql
mutation DeleteAllMyNotifications($categoryId: String) {
  delete_all_my_notifications(categoryId: $categoryId) {
    code
    data    # Int — số thông báo đã xóa
  }
}
```

---

## 6. Tích hợp Real-time (SSE)

Khi backend gửi InApp notification, hệ thống publish một SSE event với `type = "usernotification"`. Frontend nên lắng nghe event này để **tự động cập nhật** badge và danh sách mà không cần polling.

```javascript
// Kết nối SSE (theo implementation của HeadlessSubscribeEventService)
const eventSource = new EventSource('/api/subscribe?token=...');

eventSource.addEventListener('usernotification', (event) => {
  const notification = JSON.parse(event.data);
  // notification.subject, notification.body, notification.data, ...

  // 1. Tăng badge đếm chưa đọc
  incrementUnreadCount();

  // 2. Nếu panel đang mở → prepend item vào đầu danh sách
  if (isPanelOpen) {
    prependToList(mapSSEToItem(notification));
  }

  // 3. Hiển thị toast popup (optional)
  showToast(notification.subject, notification.body);
});
```

**Fallback (nếu SSE không khả dụng):** Polling `get_my_unread_count` mỗi 30 giây.

---

## 7. UX Checklist

| Hành vi | Mô tả |
|---------|-------|
| Mở panel | Gọi `get_my_notification_summary` + `get_my_notifications` song song |
| Đóng panel | Không cần API |
| Chuyển tab | Gọi lại `get_my_notifications` với `isRead` tương ứng, reset skip=0 |
| Chọn danh mục | Gọi lại `get_my_notifications` với `categoryId`, reset skip=0 |
| Tìm kiếm | Debounce 400ms, gọi `get_my_notifications` với `keyword`, reset skip=0 |
| Click notification | Gọi `mark_notification_read` → navigate deepLink |
| Chuyển trang | Gọi `get_my_notifications` với skip=`(page-1)*limit` |
| Mark all read | Gọi `mark_all_notifications_read` → refetch summary + list |
| Xóa item | Optimistic remove → gọi `delete_my_notification` |
| Xóa tất cả | Confirm dialog → `delete_all_my_notifications` → refetch |
| SSE event đến | Increment badge; nếu panel mở thì prepend item |

---

## 8. Category Icon Rendering

`categoryIcon` là tên icon theo thư viện **Ant Design Icons**. Frontend dùng:

```jsx
// React + @ant-design/icons
import * as AntIcons from '@ant-design/icons';

function CategoryIcon({ iconName, color }) {
  const Icon = AntIcons[iconName] ?? AntIcons.BellOutlined;
  return (
    <div style={{ background: color, borderRadius: 8, padding: 8 }}>
      <Icon style={{ color: '#fff', fontSize: 20 }} />
    </div>
  );
}

// Sử dụng
<CategoryIcon iconName={item.categoryIcon} color={item.categoryColor} />
```

---

## 9. Priority Styling

| `priority` | Ý nghĩa | Gợi ý UI |
|-----------|---------|----------|
| `0` | Thấp | Không có indicator đặc biệt |
| `1` | Bình thường | Mặc định |
| `2` | Cao | Border đỏ hoặc icon 🔴 nổi bật hơn |

---

## 10. DeepLink Navigation

`deepLink` có format: `headless://schema/{schemaName}/{action}/{recordId}`

```javascript
function navigateToDeepLink(deepLink) {
  if (!deepLink) return;

  // Parse deepLink
  const url = new URL(deepLink);
  // url.hostname = "schema"
  // url.pathname = "/Pet/detail/abc123"

  const [, schemaName, action, recordId] = url.pathname.split('/');

  // Navigate theo router của app
  router.push(`/${schemaName}/${action}/${recordId}`);
}
```

---

## 11. Complete Example — Notification Panel Component

```typescript
// hooks/useNotificationPanel.ts

export function useNotificationPanel() {
  const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // 1. Badge count (realtime via SSE + polling fallback)
  const { data: unreadData } = useQuery(GET_MY_UNREAD_COUNT, {
    pollInterval: 30_000,
  });
  const unreadCount = unreadData?.get_my_unread_count?.data ?? 0;

  // 2. Summary (khi mở panel)
  const { data: summaryData } = useQuery(GET_MY_NOTIFICATION_SUMMARY, {
    skip: !isPanelOpen,
  });

  // 3. Notification list
  const isRead = tab === 'all' ? undefined : tab === 'read';
  const { data: listData, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    variables: {
      isRead,
      categoryId,
      keyword: keyword || undefined,
      skip: (page - 1) * LIMIT,
      limit: LIMIT,
    },
    skip: !isPanelOpen,
  });

  // 4. Mark read
  const [markRead] = useMutation(MARK_NOTIFICATION_READ);
  const handleClickItem = async (item) => {
    if (!item.isRead) {
      await markRead({ variables: { id: item._id } });
      refetch();
    }
    if (item.deepLink) navigateToDeepLink(item.deepLink);
  };

  // 5. Mark all read
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
  const handleMarkAllRead = async () => {
    await markAllRead({ variables: { categoryId } });
    refetch();
  };

  return {
    unreadCount,
    summary: summaryData?.get_my_notification_summary?.data,
    notifications: listData?.get_my_notifications?.data ?? [],
    totalPages: Math.ceil((listData?.get_my_notifications?.records ?? 0) / LIMIT),
    tab, setTab,
    categoryId, setCategoryId,
    keyword, setKeyword: debounce(setKeyword, 400),
    page, setPage,
    handleClickItem,
    handleMarkAllRead,
  };
}
```

---

## 12. MongoDB Index Gợi ý

> ⚠️ Chạy script này trong môi trường tenant DB tương ứng sau khi deploy.

```javascript
// migration_usernotificationitem_indexes.js
db.usernotificationitem.createIndex(
  { recipientKey: 1, isRead: 1, createdAt: -1 },
  { name: "idx_inbox_user_read_time" }
);

db.usernotificationitem.createIndex(
  { recipientKey: 1, categoryId: 1, isRead: 1 },
  { name: "idx_inbox_user_category_read" }
);

db.usernotificationitem.createIndex(
  { messageId: 1, recipientKey: 1 },
  { unique: true, name: "idx_inbox_idempotency" }
);
```
