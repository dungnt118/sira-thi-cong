# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 01 FOUNDATION FINAL

## PHAN 1: SO SANH GAP (BA vs Current Schema)

| Schema/Capability | Label tieng Viet | Yeu cau BA / User | Schema hien tai | Gap/Issue | Priority |
|---|---|---|---|---|---|
| Department | Phong ban | Core to chuc | Da co Department | Khong tao moi, chi reference | High |
| Position | Chuc danh / Vi tri | Core vai tro nhan su | User xac nhan da co | Khong tao moi | High |
| Employee | Nhan vien | Ho so nguoi dung nghiep vu chinh | Da co Employee | Khong tao moi | High |
| OrgMembership | Phan cong to chuc | Gan Employee voi Department/Position | Da co OrgMembership | Khong tao moi | High |
| Role / RoleType | Vai tro / Loai vai tro | Actor = Role | Da co Role, RoleType | Khong tao moi | High |
| PermissionDefinition | Dinh nghia quyen | Permission catalog | Da co PermissionDefinition | Khong tao moi | High |
| Notification schemas | He thong thong bao | Notification engine | Da co cum notification schema | Khong tao moi | High |
| IntegrationSetting / FileFolderPolicy / FileSyncJob | Governance core | User xac nhan da ton tai trong core | Khong tao moi | Loai khoi pham vi nhom 01 | High |
| ActivityLog | Nhat ky hoat dong | Audit he thong | Da co ActivityLog | Khong tao BusinessAuditEvent | High |
| MasterDataCategory | Nhom danh muc / Nhom ma nghiep vu | Can phan loai enum mem theo module/tenant | Chua thay schema tuong duong | Can tao moi | High |
| MasterDataItem | Gia tri danh muc / Muc danh muc | Can quan ly gia tri thuoc tung nhom | Chua thay schema tuong duong | Can tao moi | High |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Schema 1: MasterDataCategory
- ten hieu theo nghiep vu: `Nhom danh muc dung chung`
- name: `MasterDataCategory`
- label: `Nhom danh muc`
- muc dich: dau nhom cho cac enum mem dung chung theo tung module.
- vi du category: `lead_source`, `service_type`, `priority_level`, `communication_channel`

Thuoc tinh de xuat
- `code` | label: `Ma nhom` | propType: `Text` | editor: `Input` | required: `true` | unique: `true` | formWidth: `width1_2`
- `name` | label: `Ten nhom` | propType: `Text` | editor: `Input` | required: `true` | formWidth: `width1_2`
- `module` | label: `Module ap dung` | propType: `Text` | editor: `Dropdown` | required: `true` | formWidth: `width1_2`
- `description` | label: `Mo ta` | propType: `Text` | editor: `TextArea` | required: `false` | formWidth: `fullwidth`
- `isActive` | label: `Dang su dung` | propType: `Boolean` | editor: `Checkbox` | required: `false` | formWidth: `width1_2`
- `allowCustomItem` | label: `Cho phep them gia tri tuy bien` | propType: `Boolean` | editor: `Checkbox` | required: `false` | formWidth: `width1_2`
- `sortOrder` | label: `Thu tu hien thi` | propType: `Number` | editor: `Input` | required: `false` | formWidth: `width1_2`
- `note` | label: `Ghi chu` | propType: `Text` | editor: `TextArea` | required: `false` | formWidth: `fullwidth`

Gia tri module de xuat
- `foundation` - Nen tang
- `crm` - CRM va Sale
- `project` - Du an va dieu phoi
- `execution` - Hien truong
- `inventory` - Kho va tai san
- `finance` - Tai chinh va hau mai
- `document` - Tai lieu va ky so

### Schema 2: MasterDataItem
- ten hieu theo nghiep vu: `Muc danh muc dung chung`
- name: `MasterDataItem`
- label: `Gia tri danh muc`
- muc dich: luu tung gia tri cu the thuoc mot nhom danh muc.

Thuoc tinh de xuat
- `categoryId` | label: `Nhom danh muc` | propType: `ObjectId` | refSchemas: `[MasterDataCategory]` | required: `true` | formWidth: `width1_2`
- `value` | label: `Gia tri ky thuat` | propType: `Text` | editor: `Input` | required: `true` | formWidth: `width1_2`
- `label` | label: `Nhan hien thi` | propType: `Text` | editor: `Input` | required: `true` | formWidth: `width1_2`
- `shortLabel` | label: `Nhan ngan` | propType: `Text` | editor: `Input` | required: `false` | formWidth: `width1_2`
- `color` | label: `Mau sac` | propType: `Text` | editor: `Color` | required: `false` | formWidth: `width1_4`
- `faIcon` | label: `Icon` | propType: `Text` | editor: `Input` | required: `false` | formWidth: `width1_4`
- `sortOrder` | label: `Thu tu hien thi` | propType: `Number` | editor: `Input` | required: `false` | formWidth: `width1_4`
- `isDefault` | label: `Mac dinh` | propType: `Boolean` | editor: `Checkbox` | required: `false` | formWidth: `width1_4`
- `isActive` | label: `Dang su dung` | propType: `Boolean` | editor: `Checkbox` | required: `false` | formWidth: `width1_4`
- `description` | label: `Mo ta` | propType: `Text` | editor: `TextArea` | required: `false` | formWidth: `fullwidth`
- `metadataJson` | label: `Metadata bo sung` | propType: `Json` | editor: `CodeEditor` | required: `false` | formWidth: `fullwidth`

Quy tac du lieu de xuat
- `MasterDataCategory.code` la duy nhat toan tenant
- `MasterDataItem` phai unique theo cap `categoryId + value` o tang nghiep vu
- `label` la tieng Viet, `value` la ma ky thuat snake_case

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Group 01 - Foundation Final                                â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â”Œâ”€ Nhom danh muc â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ [Ma nhom]         [lead_source___________________]   â”‚  â”‚
â”‚  â”‚ [Ten nhom]        [Nguon lead____________________]   â”‚  â”‚
â”‚  â”‚ [Module]          [CRM va Sale â–¼_________________]   â”‚  â”‚
â”‚  â”‚ [Dang su dung]    [x]    [Cho phep tuy bien] [ ]     â”‚  â”‚
â”‚  â”‚ [Thu tu]          [10___________________________]    â”‚  â”‚
â”‚  â”‚ [Mo ta]           [Danh muc nguon tiep can khach]    â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                                           â”‚
â”‚  â”Œâ”€ Gia tri danh muc â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ [Nhom danh muc]    [Nguon lead â–¼_________________]  â”‚  â”‚
â”‚  â”‚ [Gia tri ky thuat] [hotline______________________]  â”‚  â”‚
â”‚  â”‚ [Nhan hien thi]    [Hotline______________________]  â”‚  â”‚
â”‚  â”‚ [Nhan ngan]        [HL___________________________]  â”‚  â”‚
â”‚  â”‚ [Mau] [#17a2b8] [Icon fa-phone] [Thu tu 1] [x MD]   â”‚  â”‚
â”‚  â”‚ [Dang su dung] [x]                                   â”‚  â”‚
â”‚  â”‚ [Mo ta]           [Kenh goi truc tiep vao cong ty]   â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## KET LUAN DE XAC NHAN
- Pham vi cuoi cung cua nhom 01 chi con `MasterDataCategory` va `MasterDataItem`.
- Se trien khai tao 2 schema nay bang mcp-bac ngay sau khi chot file nay.
