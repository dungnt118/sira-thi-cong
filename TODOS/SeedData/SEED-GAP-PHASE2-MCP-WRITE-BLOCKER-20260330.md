# GAP Phase 2 - BAC MCP write tool đang ghi bản ghi trắng

## Bối cảnh

- Ngày thực hiện: `2026-03-30`
- Mục tiêu: đẩy toàn bộ batch seed trong `TODOS/SeedData` lên hệ thống BAC bằng MCP.
- Ràng buộc đã chốt:
  - enum canonical dùng lowercase theo backend schema;
  - schema `Single` phải dùng `content-save_setting`;
  - `FileUploads` có thể để `null`.

## Kết luận ngắn

Hiện chưa thể chạy import Phase 2 một cách an toàn vì BAC MCP write tool đang có lỗi bind payload:

- `content-create_many` nhận mảng object nhưng ghi ra bản ghi trắng;
- `content-update_by_ids` không patch được object;
- `content-create` không nhận payload stringified object;
- chưa có tool xóa content để dọn các bản ghi probe bị sinh trắng.

Vì đây là blocker kỹ thuật thật, tôi dừng import thật để tránh làm bẩn dữ liệu tenant thêm.

## Bằng chứng đã xác minh

### 1. Schema backend không sai field

Schema `AssetGroup` trên backend đang có đúng các field:

- `name`
- `category`
- `depreciation_months`

Tức là seed file `AssetGroup-SEED-20260330.json` không bị sai `property id`.

### 2. `content-create_many` nhận payload nhưng ghi bản ghi trắng

Đã gọi BAC MCP trực tiếp qua HTTP JSON-RPC tới `https://bac-mcp.demego.vn/mcp` với payload dạng:

```json
{
  "jsonrpc": "2.0",
  "id": 403,
  "method": "tools/call",
  "params": {
    "name": "content-create_many",
    "arguments": {
      "request": {
        "schemaName": "AssetGroup",
        "data": [
          {
            "name": "Máy thi công",
            "category": "Máy móc",
            "depreciation_months": 36
          },
          {
            "name": "Dụng cụ an toàn",
            "category": "Dụng cụ",
            "depreciation_months": 24
          }
        ]
      }
    }
  }
}
```

Kết quả backend đã sinh thêm các `_id` mới nhưng toàn bộ field business đều `null`.

Các bản ghi trắng đã xác minh:

- `69c9bde3412faf49b0ab3918`
- `69c9bf3e412faf49b0ab3919`
- `69c9bf3e412faf49b0ab391a`
- `69c9bf3e412faf49b0ab391b`

### 3. `content-update_by_ids` lỗi với object payload

Khi gọi `content-update_by_ids` với:

```json
{
  "request": {
    "schemaName": "AssetGroup",
    "ids": ["69c9bde3412faf49b0ab3918"],
    "data": {
      "name": "TEST UPDATE OBJ",
      "category": "Kiểm thử",
      "depreciation_months": 12
    }
  }
}
```

MCP trả về:

```text
.NET type System.Text.Json.JsonElement cannot be mapped to a BsonValue.
```

### 4. `content-update_by_ids` lỗi với stringified payload

Khi gọi `content-update_by_ids` với `data` là chuỗi JSON:

```json
"{\"name\":\"TEST UPDATE STR\",\"category\":\"Kiểm thử\",\"depreciation_months\":12}"
```

MCP trả về:

```text
The JSON value could not be converted to System.Collections.Generic.Dictionary`2[System.String,System.Object].
```

### 5. `content-create_many` stringified array cũng không hợp lệ

Khi truyền `data` dưới dạng chuỗi JSON array, MCP trả về:

```text
data must be an array of objects
```

Tức là tool yêu cầu `array of objects`, nhưng đường bind hiện tại vẫn không map đúng object vào dữ liệu lưu.

## Tác động

- Không thể import an toàn cho toàn bộ schema `Multiple`.
- Không thể vá ngược các bản ghi trắng đã lỡ sinh ra.
- Không thể hoàn tất vòng đời circular reference kiểu `WarrantyCase.latest_visit_id` vì `content-update_by_ids` đang hỏng.
- Không có `content-delete` để tự dọn probe record.

## Đề xuất xử lý

### Phương án 1 - Ưu tiên

Fix BAC MCP server:

- convert `request.data` từ `JsonElement` sang `Dictionary<string, object>` hoặc `List<Dictionary<string, object>>` trước khi ghi;
- fix tương tự cho `content-update_by_ids`;
- giữ `content-save_setting` cùng logic bind nhất quán cho schema `Single`.

### Phương án 2

Bổ sung tool xóa content hoặc tool cleanup probe record để có thể dọn các bản ghi trắng sau khi fix.

### Phương án 3

Nếu team backend đã có REST/GraphQL write path ổn định và có cơ chế auth sẵn cho agent, có thể chuyển Phase 2 sang endpoint đó thay cho BAC MCP content tool hiện tại.

## Trạng thái

- Phase 2 import thật: `blocked`
- Seed file JSON: `đã sẵn sàng`
- Rule singleton `content-save_setting`: `đã xác định được tool`, nhưng chưa dám chạy thật do chưa có write path ổn định cho toàn batch
