# WF-ADD-01 – Admin/PM: Quản lý Template Checklist
**Giải quyết Gap #2 & #5 | Sprint 2 (bổ sung) | Actor: Admin, PM**

---

## Mô tả

Admin và PM có thể tạo, chỉnh sửa, sao chép các template checklist bước thi công. Template này được áp dụng khi PM tạo dự án mới (WF-07).

---

## Quy trình nghiệp vụ

```
Actor: Admin / PM
Flow Tạo/Sửa Template:
  1. Vào menu Settings → Checklist Templates
  2. Xem danh sách template hiện có
  3. Click [+ Tạo Template mới] hoặc [✏️ Sửa] template có sẵn
  4. Nhập tên template, mô tả
  5. Thêm/Sửa/Xóa/Sắp xếp thứ tự các bước
  6. Mỗi bước: Tên bước + mô tả hướng dẫn + yêu cầu ảnh tối thiểu
  7. Lưu → Template sẵn sàng dùng khi tạo dự án

Business Rules:
  - Không thể xóa template đang được dùng trong dự án active
  - Template default không thể xóa, chỉ có thể copy + sửa
  - Thay đổi template KHÔNG ảnh hưởng dự án đang dùng template đó
```

---

## Wireframe – Danh sách Template

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚙️ Settings > Checklist Templates           [+ Tạo template mới] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 🌟 SIRA Standard v1.0                          [Mặc định]   │  │
│  │ 18 bước | Chống thấm sàn | Dùng trong: 14 dự án            │  │
│  │                       [👁 Xem] [📋 Sao chép] [❌ Không sửa]│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ SIRA Tường v1.0                                               │  │
│  │ 12 bước | Chống thấm tường | Dùng trong: 3 dự án            │  │
│  │                            [👁 Xem] [📋 Copy] [✏️ Sửa] [🗑]│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Template Nhanh – Nhỏ (PM Tuấn)                               │  │
│  │ 8 bước | Dùng trong: 0 dự án (mới tạo)                      │  │
│  │                            [👁 Xem] [📋 Copy] [✏️ Sửa] [🗑]│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Wireframe – Sửa Template (Editor)

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Template   ✏️ Sửa: SIRA Tường v1.0         [💾 Lưu] [Hủy]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Tên template:   [SIRA Tường v1.0                         ]       │
│  Mô tả:          [Áp dụng cho chống thấm mặt tường...     ]       │
│  Loại hình:      [Chống thấm tường  ▼]                            │
│                                                                    │
│  CÁC BƯỚC THI CÔNG                                    [+ Thêm bước]│
│  ──────────────────────────────────────                            │
│                                                                    │
│ ┌───┬────────────────────────────────────┬─────────────┬─────────┐ │
│ │ ≡ │ Tên bước                           │ Ảnh tối thiểu│ Actions│ │
│ ├───┼────────────────────────────────────┼─────────────┼─────────┤ │
│ │ ≡ │ 1. Kiểm tra bề mặt tường          │ ≥ [1] ảnh   │[✏️][🗑]│ │
│ │ ≡ │ 2. Đục tẩy vết nứt               │ ≥ [2] ảnh   │[✏️][🗑]│ │
│ │ ≡ │ 3. Trám khe nứt bằng Sika        │ ≥ [1] ảnh   │[✏️][🗑]│ │
│ │ ≡ │ 4. Chờ trám khô (min 24h)         │ ≥ [1] ảnh   │[✏️][🗑]│ │
│ │ ≡ │ 5. Quét SIRA PU lớp 1            │ ≥ [2] ảnh   │[✏️][🗑]│ │
│ │ ≡ │ ...                               │ ...          │...      │ │
│ └───┴────────────────────────────────────┴─────────────┴─────────┘ │
│  ≡ = Kéo thả để sắp xếp thứ tự                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Modal Thêm/Sửa Bước

```
┌──────────────────────────────────────────────────┐
│  Thêm bước mới                                   │
│  ──────────────────────────────────────────────  │
│  Tên bước *:                                     │
│  [Quét SIRA PU lớp lót lần 1                 ]  │
│                                                  │
│  Mô tả / Hướng dẫn cho thợ:                     │
│  [Quét đều tay, không để bọt khí. Kiểm tra    ] │
│  [độ dày lớp phủ bằng thước đo.               ] │
│                                                  │
│  Yêu cầu ảnh tối thiểu: [2    ] ảnh             │
│  Có thể upload video: ☑ Có  ☐ Không             │
│                                                  │
│  [Hủy]                       [Thêm bước]        │
└──────────────────────────────────────────────────┘
```
