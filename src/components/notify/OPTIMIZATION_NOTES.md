# Tối ưu hóa Notification Component

## Vấn đề ban đầu
- `notify_my_total_unread_notify` được gọi rất nhiều lần không cần thiết
- useEffect có dependencies `[user, popup, dispatch]` khiến API được gọi mỗi khi popup state thay đổi
- Không có cơ chế cache hoặc throttle để hạn chế số lần gọi API

## Các tối ưu hóa đã thực hiện

### 1. Tách riêng logic fetch total unread
- Tách `fetchTotalUnread` thành function riêng biệt
- Tách useEffect thành 2 effect riêng biệt:
  - Một cho việc fetch total unread (chỉ chạy khi user thay đổi)
  - Một cho việc reload data khi popup mở

### 2. Thêm cơ chế cache và throttle
- Sử dụng `useRef` để lưu trữ:
  - `lastFetchTime`: thời gian gọi API cuối cùng
  - `isFetching`: trạng thái đang fetch để tránh duplicate calls
- `FETCH_INTERVAL = 30000ms`: chỉ cho phép gọi API tối đa 1 lần mỗi 30 giây

### 3. Tối ưu re-render với React hooks
- `useMemo` cho `userInfo` để tránh tính toán lại không cần thiết
- `useCallback` cho các functions để tránh tạo function mới mỗi lần render
- `React.memo` cho các components con

### 4. Thêm refresh mechanism
- `refreshTotalUnread`: function để force refresh total unread khi cần thiết
- Được gọi sau khi user đọc thông báo để cập nhật số lượng unread

### 5. Cải thiện performance
- Memoize các expensive operations
- Tách riêng các concerns để dễ maintain
- Giảm số lần gọi API không cần thiết

## Kết quả
- Giảm đáng kể số lần gọi `notify_my_total_unread_notify`
- Cải thiện performance và user experience
- Code dễ maintain và debug hơn
- Vẫn đảm bảo tính chính xác của dữ liệu

## Cách sử dụng
- Component sẽ tự động fetch total unread khi user thay đổi
- Khi user mở popup, chỉ reload data state (không gọi total unread)
- Khi user đọc thông báo, sẽ tự động refresh total unread count
- Có cơ chế throttle để tránh spam API calls
