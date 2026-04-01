# SEED GAP WorkTask Content Cache - 2026-04-01

## Bối cảnh

Schema `WorkTask` đã được tạo thành công ở lớp schema metadata và `schema_get("WorkTask")` trả về đầy đủ 17 field.

Đã chuẩn bị file seed:

- `WorkTask-SEED-20260401.json`

## Hiện tượng

Khi chuyển sang nhóm tool `content_*` để import dữ liệu mẫu, backend trả về lỗi:

```text
Schema 'WorkTask' does not exist
```

Các lệnh đã xác nhận lại cùng một hiện tượng:

- `content_search(schemaName="WorkTask")`
- `content_create_many(schemaName="WorkTask")`

Trong khi đó:

- `schema_get("WorkTask")` vẫn thành công

## Đánh giá

Đây là xung đột giữa:

- lớp schema metadata
- và lớp content runtime/cache

Nói cách khác, seed file hiện tại **không có lỗi cấu trúc**, nhưng content layer chưa nhận diện được schema mới nên chưa thể import bằng đường chuẩn `content_*`.

## Ảnh hưởng

- Chưa thể đẩy dữ liệu mẫu `WorkTask` lên hệ thống qua MCP content tool.
- File seed chưa thể canonicalize lại với `_id` thật sau import.

## Khuyến nghị

1. Reload hoặc refresh cache schema ở content runtime/backend.
2. Sau khi backend nhận diện được `WorkTask`, chạy lại:
   - `content_create_many`
   - `content_search`
3. Canonicalize lại `WorkTask-SEED-20260401.json` bằng `_id` thật từ backend.
