# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 01 - Foundation and Governance

Priority: P0

Muc tieu
- Tai su dung toi da cac schema core he thong cho nguoi dung, to chuc, vai tro, notification va governance file/tich hop da ton tai.
- Khong tach rieng profile nguoi dung thanh schema/collection doc lap; actor nghiep vu duoc hieu la Employee gan voi Department, OrgMembership, Role, RoleType, Position(core).
- Quy uoc phan tich: Actor = Role. Moi actor nghiep vu duoc hieu la mot Role hoac nhom Role gan voi Employee.

Core system schema tai su dung
- Department - Phong ban
- Position - Chuc danh / Vi tri (core, user da xac nhan ton tai; tam hieu nhu master data gom _id, code, name)
- Employee - Nhan vien
- OrgMembership - Phan cong to chuc
- Role - Vai tro
- RoleType - Loai vai tro
- PermissionDefinition - Dinh nghia quyen
- AuthorizedUser - Nguoi dung he thong
- TenantMembership - Thanh vien tenant
- AnnouncementTemplateDefinition - Mau thong bao
- NotificationCategory - Nhom thong bao
- NotificationOutbox - Hang doi thong bao
- NotificationTriggerRule - Quy tac kich hoat thong bao
- UserNotificationItem - Hop thu thong bao ca nhan
- IntegrationSetting - Cau hinh tich hop (core)
- FileFolderPolicy - Chinh sach thu muc file (core)
- FileSyncJob - Lenh dong bo file (core)
- ActivityLog - Nhat ky hoat dong he thong (core)

Schema can bo sung thuc su trong nhom 01
- MasterDataCategory - Nhom danh muc dung chung
- MasterDataItem - Muc danh muc dung chung

Ten hieu theo nghiep vu de de doc
- MasterDataCategory co the hieu la `Nhom danh muc dung chung` hoac `Nhom ma nghiep vu`.
- MasterDataItem co the hieu la `Muc danh muc dung chung`.

Y nghia nghiep vu cua tung schema can bo sung
- MasterDataCategory - Dung de tao nhom danh muc dung chung nhu nguon lead, loai dich vu, muc uu tien, trang thai nghiep vu, kenh giao tiep. Day la lop phan nhom enum mem theo tenant/module, khong phai master data nhan su/to chuc.
- MasterDataItem - Chua cac gia tri cu the ben trong tung nhom danh muc. Vi du category `lead_source` se co cac item `hotline`, `facebook`, `referral`.

Cach lien ket voi core schema
- Moi actor nghiep vu tham chieu bang Employee va AuthorizedUser, khong tao profile rieng.
- Quy uoc actor = Role: neu co actor Sale, PM, Giam sat, Ke toan, Hanh chinh, Ky thuat thi he thong se tao/cau hinh Role tuong ung.
- Phan vai/chuc danh tham chieu qua OrgMembership, Role, RoleType va Position(core).
- MasterDataItem.categoryId -> MasterDataCategory

Luu y quan trong
- BA-V4 co nhac toi khai niem `ky thuat profile`, nhung theo yeu cau hien tai se dien giai ve mat du lieu la Employee + Position + Role + OrgMembership, khong tao schema ho so rieng.
- Position duoc xem ngam la master data core toi gian gom `_id`, `code`, `name`; tam thoi khong can MCP tra day du van co the tiep tuc lap plan.
- Notification, file governance, integration va audit da co schema core, nen bo qua trong nhom nay.

Slices MCP
1. Tao `MasterDataCategory`
2. Tao `MasterDataItem` va lien ket `categoryId -> MasterDataCategory`

Done when
- Da tao xong `MasterDataCategory` va `MasterDataItem`, verify duoc schema va relationship.
