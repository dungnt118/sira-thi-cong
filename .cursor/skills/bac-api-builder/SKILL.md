---
name: bac-api-builder
description: >-
  Designs and updates BAC JavaScript APIs with js_library MCP tools. Covers
  namespace discovery, native method lookup, ApiModel review, usage impact
  checks, pre-save validation, create/update discipline, and post-save
  verification. Use when the user asks to create, modify, review, or refactor
  BAC ApiModel JavaScript APIs.
---

# BAC API Builder

Doc chi tiet trong repo: [BAC-ApiBuilderAgent.agent.md](../../../.github/agents/BAC-ApiBuilderAgent.agent.md).

## Muc dich

- Phan tich requirement truoc khi viet script.
- Khao sat namespace, native methods, va API co san truoc khi tao moi.
- Validate script truoc khi create/update qua MCP.
- Kiem tra usage impact truoc khi sua API dang ton tai.
- Verify lai metadata sau khi luu.

**MCP server:** goi cong cu qua server `user-bac` hoac BAC MCP tuong duong trong workspace. Uu tien nhom `js_library-*`.

## Mot file phan tich duy nhat: `API-ANALYSIS-{datestring}.md`

Chi tao file sau khi da lay du thong tin tu MCP. File gom 3 phan bat buoc:

1. **Discovery va gap** — namespace, API tuong tu, native methods, create hay update, usage impact.
2. **Thiet ke API chi tiet** — metadata, input contract, output contract, dependencies, script design.
3. **Validation va verify plan** — ket qua validate, tool write du kien, cach verify sau khi luu.

## Quy trinh 8 buoc

| Buoc | Hanh dong | Cong cu MCP |
|------|-----------|--------------|
| 1 | Khao sat namespace | `js_library-list_api_namespaces` |
| 2 | Tim native methods va API tuong tu | `js_library-search_functions` |
| 3 | Doc metadata chi tiet | `js_library-get_method_signature`, `js_library-get_function_usage_example`, `js_library-get_api_model` |
| 4 | Kiem tra impact neu update | `js_library-get_api_model_usage` |
| 5 | Viet `API-ANALYSIS-{datestring}.md` | — |
| 6 | Trinh bay va **cho user xac nhan** | — |
| 7 | Validate script | `js_library-validate_api_model_script` |
| 8 | Create/update va verify | `js_library-create_api_model`, `js_library-update_api_model`, `js_library-get_api_model` |

## Metadata can doc tu tool

- `search_functions`: `type`, `namespace`, `signature`/`syntax`, `isAsync`, `description`.
- `get_method_signature`: `parameters[]`, `returnType`, `isAsync`, `usageExample`.
- `get_api_model`: `script`, `parameters`, `outputType`, `syntax`, `nativeFunctions`, `jintFunctions`.
- `get_api_model_usage`: `results[]`, `totalUsages`.
- `validate_api_model_script`: `isValid`, `messages`, `syntaxErrors`, `warnings`.

## Quy tac bat buoc

- Khong viet script truoc khi discovery.
- Khong create/update truoc validate.
- Khong update API cu neu chua doc `get_api_model` va `get_api_model_usage`.
- Khong suy dien metadata khi MCP chua tra du lieu.
- Luon verify bang `get_api_model` sau khi write.

## Xu ly loi ha tang

Neu MCP BAC tra `502 Bad Gateway`, timeout, hoac du lieu thieu:

- Dung lai o discovery hoac validation.
- Bao ro day la loi ha tang.
- Khong create/update API.
- Khong viet metadata gia dinh vao file phan tich.

## Checklist truoc toolcall

- [ ] Da khao sat namespace
- [ ] Da search native methods / APIs lien quan
- [ ] Da doc method signature can dung
- [ ] Da doc API model neu la update hoac can tham khao
- [ ] Da doc usage neu co nguy co breaking change
- [ ] Da viet `API-ANALYSIS-{datestring}.md`
- [ ] Da duoc user xac nhan
- [ ] Da pass validation

## Tool tham chieu nhanh

| Tool | Khi dung |
|------|----------|
| `js_library-list_api_namespaces` | Chon namespace |
| `js_library-search_functions` | Discovery tong hop |
| `js_library-get_method_signature` | Hieu native method |
| `js_library-get_function_usage_example` | Lay snippet nhanh |
| `js_library-get_api_model` | Review / verify API |
| `js_library-get_api_model_usage` | Danh gia impact |
| `js_library-validate_api_model_script` | Gate truoc khi write |
| `js_library-create_api_model` | Tao API moi |
| `js_library-update_api_model` | Sua API hien co |