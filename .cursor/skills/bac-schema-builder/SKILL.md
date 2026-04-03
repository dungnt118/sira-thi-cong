---
name: bac-schema-builder
description: >-
  Designs and modifies BAC low-code schemas with BA alignment, gap analysis, and
  MCP verification. Covers PropType/editor conventions, SCHEMA-ANALYSIS workflow,
  form layout, value_options rules, and pre/post toolcall gates. Use when the user
  asks to create or change schemas, batch properties, triggers, form layout,
  schema gaps vs BA, or references Building Management schema work on BAC.
---

# BAC Schema Builder

Đọc thêm nguồn chi tiết trong repo: [BAC-SchemaBuilderAgent.agent.md](../../../.github/agents/BAC-SchemaBuilderAgent.agent.md).

## Mục đích

- Phân tích yêu cầu/BA, so sánh với schema hiện tại, ghi nhận gap.
- Thiết kế thuộc tính chuẩn hóa; chỉ thực hiện create/update qua MCP sau khi người dùng xác nhận.
- Verify lại schema sau mỗi thay đổi.

**MCP server:** gọi công cụ qua server `user-bac` (hoặc server BAC tương đương trong workspace). Tên công cụ dưới đây khớp descriptor `schema-*`, `content-*`, `js_library-*`, v.v.

## Một file phân tích duy nhất: `SCHEMA-ANALYSIS-{datestring}.md`

Chỉ tạo file sau khi đã lấy đủ dữ liệu từ MCP (không bịa thiếu). File gồm **3 phần bắt buộc**:

1. **So sánh GAP (BA vs schema hiện tại)** — bảng: thuộc tính | BA | hiện tại | gap | priority.
2. **Thiết kế chi tiết từng thuộc tính** — `name`, `label`, `propType`, `editor`, `form_width`, `required`, `unique`, `form_group`, `hints`, `value_options` (nếu có), `refSchemas`, `nested`.
3. **Form preview** — wireframe ASCII (nhóm, width 1/2, full, dropdown, date, reference).

## Quy trình 8 bước

| Bước | Hành động | Công cụ MCP (ví dụ) |
|------|-----------|---------------------|
| 1 | Lấy schema hiện tại | `schema-get` |
| 2 | Lấy quan hệ | `schema-get_relationships` |
| 3 | Tìm schema tham khảo | `schema-search` |
| 4 | Phân tích, viết `SCHEMA-ANALYSIS-{datestring}.md` đủ 3 phần | — |
| 5 | Trình bày và **chờ xác nhận** — không tự create/update | — |
| 6 | Thực hiện thay đổi | `schema-create`, `schema-batch_create_or_update_property`, `schema-update_nested_property`, `schema-update_prop_client_rules`, `schema-update_triggers`, … |
| 7 | Tối ưu layout | `schema-re_layout_form`, `schema-re_layout_nested_form`, `schema-update_deprecated_properties` (tuỳ cần). Mặc định tối đa **2** `form_group` nếu user không yêu cầu khác |
| 8 | Verify | `schema-get` lại, đối chiếu file phân tích |

Trước mỗi lần gọi tool: đọc descriptor JSON trong `mcps/user-bac/tools/` để đủ tham số bắt buộc.

## Thuộc tính hệ thống

Đã có sẵn trên schema; chỉ cấu hình hiển thị khi cần: `_id`, `createdAt`, `updatedAt`, `isDeleted`, `creator`, `updator`. **Không** tạo lại như field mới.

## PropType / editor (tóm tắt)

| Use case | propType | editor |
|----------|----------|--------|
| Text ngắn | Text | Input |
| Text dài | Text | Textarea (fullwidth) |
| Rich text | Text | RichText (fullwidth) |
| Dropdown/Radio | Text | Dropdown/Radio + value_options |
| Số | Number | Input |
| Ngày/giờ | DateTime | DatePicker / DateTimePicker |
| Nhiều ngày | MultiDateTime | DatePicker |
| Khoảng thời gian | TimeSpan | TimeInput |
| Boolean | Boolean | Checkbox / Toggle |
| Tags | Tags | Tags |
| File | FileUploads | FileUpload |
| FK 1-1 | ObjectId | (picker) — ưu tiên hơn Lookup |
| FK 1-N | Reference | Ưu tiên hơn Lookups |
| Object phức tạp | Object | tuỳ trường hợp, thường fullwidth |
| Nested | Nested | tuỳ trường hợp, thường fullwidth |

**Cấm:** `propType=Selection` (dùng Text + value_options). **Cấm** Lookup/Lookups theo chính sách agent (dùng ObjectId/Reference).

## value_options (Text + Dropdown/Radio/Tags)

- `value`: **snake_case**, chữ thường, tiếng Anh (vd. `pending_approval`).
- `label`: **Tiếng Việt**.
- Khuyến nghị: `faIcon`, `color` (hex).

## Form width

- `fullwidth`: Object, Nested, Textarea, RichText, FileUploads.
- `width1_2`: tên, mã, trạng thái, v.v.
- `width1_3` / `width1_4`: ít dùng.

## Form group

- Tối đa ~2 nhóm; tên tiếng Việt rõ ràng.
- Schema đơn giản (khoảng dưới 5 field) có thể không nhóm.

## Cấm kỵ

1. Không suy diễn khi chưa có dữ liệu tool.
2. Không create/update schema khi chưa được user xác nhận.
3. Không tạo file phân tích khi thiếu thông tin.
4. Không tạo lại system fields.
5. Không bỏ qua bước verify sau thay đổi.

## Checklist trước toolcall

- [ ] `schema-get` đã chạy
- [ ] `schema-get_relationships` khi có tham chiếu
- [ ] `SCHEMA-ANALYSIS-{datestring}.md` đủ 3 phần
- [ ] User đã đồng ý
- [ ] Tham số tool đã đối chiếu descriptor
- [ ] Có kế hoạch verify (bước 8)

## Mẫu trả lời

**Sau phân tích:** tóm tắt gap, số thuộc tính thiết kế, có wireframe; yêu cầu review file và xác nhận trước khi gọi MCP.

**Sau implement:** liệt kê created/updated/deprecated/re-layout; xác nhận đã `schema-get` và khớp file phân tích.

## Bảng công cụ schema (tham chiếu nhanh)

| Tool | Khi dùng |
|------|----------|
| `schema-get` | Đầu cuối + verify |
| `schema-get_relationships` | Reference/Lookup/Lookups |
| `schema-search` | Tham khảo schema tương tự |
| `schema-create` | Schema mới |
| `schema-batch_create_or_update_property` | Cập nhật nhiều property |
| `schema-update_nested_property` | Nested |
| `schema-re_layout_form` / `schema-re_layout_nested_form` | UX form |
| `schema-update_deprecated_properties` | Dọn deprecated |

Công việc liên quan (API, menu, nội dung): dùng thêm `js_library-*`, `menu_mng-*`, `content-*`, `graphql_inspector-*` khi phạm vi yêu cầu — luôn đọc schema tool trước.
