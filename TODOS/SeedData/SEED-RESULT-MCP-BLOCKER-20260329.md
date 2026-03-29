# SEED RESULT AND MCP BLOCKER REPORT - 2026-03-29

Muc dich
- Tong hop ket qua seed data da chay len backend trong phien lam viec ngay 2026-03-29.
- Ghi nhan cac loi MCP content tools xay ra khi thuc thi hoac khi ra soat lai sau seed.
- Cung cap tai lieu dau vao de doi sua MCP Tool co the reproduce va khoanh vung nguyen nhan.

## 1. Pham vi seed da thu nghiem
- SalesPipeline
- CustomerJourneySetting
- MasterDataCategory
- MasterDataItem
- PipelineStage

## 2. Ket qua theo tung schema
| Schema | Hanh dong | Ket qua thuc te | Trang thai |
|---|---|---|---|
| SalesPipeline | Khong tao moi, reuse record mac dinh hien co | Tim thay 1 record default, active | OK |
| CustomerJourneySetting | Da goi content-create voi payload singleton 13 buoc | Tao ra 1 record, nested step blocks co du lieu, nhung scalar root fields doc lai bi null hoac object rong | LOI MCP |
| MasterDataCategory | Da goi content-create_many them 4 category moi | Tao ra 4 record moi, nhung scalar root fields khong duoc materialize khi doc lai | LOI MCP |
| MasterDataItem | Chua seed tiep | Tam dung do category chua verify tot | BLOCKED |
| PipelineStage | Chua seed tiep | Tam dung de tranh nhan rong du lieu loi | BLOCKED |

## 3. Du lieu da xac minh
### SalesPipeline
- Search ket qua: ton tai 1 record mac dinh.
- Gia tri doc duoc: `_id=69c7f1a4a718dc692a22b79f`, `name=quy trinh 1`, `is_default=true`, `is_active=true`.

### CustomerJourneySetting
- Truoc khi seed: search tra ve `records=0`.
- Sau khi goi create: search/get tra ve `records=1`.
- Dau hieu bat thuong sau seed:
- `setting_key` tra ve `null` hoac `{}` tuy cach doc.
- `setting_name` tra ve `null` hoac `{}`.
- `is_active` tra ve `null` hoac `{}`.
- `version_label` tra ve `null` hoac `{}`.
- `note` tra ve `null` hoac `{}`.
- 13 nested blocks nhu `lead_intake`, `qualification`, `survey_planning`... van co du lieu day du.

### MasterDataCategory
- Truoc khi seed: ton tai 1 record cu `crm` voi du lieu doc duoc day du.
- Sau khi goi create_many: co them 4 record moi, sap xep theo `createdAt` cho thay cac `_id` moi:
- `69c9005de5037c6495efc451`
- `69c9005de5037c6495efc453`
- `69c9005de5037c6495efc455`
- `69c9005de5037c6495efc457`
- Dau hieu bat thuong sau seed: cac field root mong doi nhu `code`, `name`, `module`, `isActive`, `allowCustomItem`, `sortOrder`, `description`, `note` khong doc lai duoc nhu record cu.

## 4. Loi MCP da gap
### Loi 1: create/create_many tao duoc record nhung scalar root khong materialize
- Hien tuong: record duoc tao, `createdAt`/`updatedAt` co gia tri, nested object co the duoc luu, nhung scalar root fields doc lai thanh `null` hoac `{}`.
- Anh huong: khong the tin cay ket qua seed, khong the dung record vua tao lam foreign key hop le cho batch tiep theo.

### Loi 2: update_by_ids khong the dung de va record da loi
- Khi thu patch lai cac record MasterDataCategory vua tao bang `content-update_by_ids`, tool tra ve loi:
.NET type System.Text.Json.JsonElement cannot be mapped to a BsonValue.
- Anh huong: khong co duong sua nong record loi bang cung bo MCP content tools.

### Loi 3: Projection/doc lai khong on dinh
- Cung mot record CustomerJourneySetting nhung o cac cach doc khac nhau, scalar root co luc hien `null`, co luc hien `{}`.
- Dau hieu nay cho thay kha nang cao co van de o lop map du lieu JSON -> BSON hoac BSON -> DTO/projection.

## 5. Chuoi reproduce toi thieu
1. Goi `content-create` cho schema co scalar root fields va nested object fields, vi du `CustomerJourneySetting`.
2. Doc lai bang `content-search` hoac `content-get`.
3. Quan sat scalar root fields bi `null`/`{}` trong khi nested object van co du lieu.
4. Thu sua bang `content-update_by_ids`.
5. Quan sat tool tra ve loi JsonElement/BsonValue mapping.

## 6. Nhan dinh ky thuat de sua MCP Tool
- Kiem tra mapper tai duong ghi content-create/content-create_many, dac biet voi payload `data` duoc deserialize thanh `JsonElement`.
- Kiem tra converter JsonElement -> BsonValue cho cac scalar root fields.
- So sanh duong xu ly field scalar root va field nested object, vi nested dang luu duoc con scalar thi khong.
- Kiem tra projection/doc lai cua `content-search` va `content-get` de xac dinh loi nam o write path, read path, hay ca hai.
- Kiem tra truong hop schema co collection `setting` vi CustomerJourneySetting dang o collection nay.
- Kiem tra create_many co chung bug voi create don le, vi MasterDataCategory xuat hien cung mot mau loi.

## 7. Tac dong hien tai len du lieu
- Da phat sinh 1 record CustomerJourneySetting o trang thai khong tin cay.
- Da phat sinh 4 record MasterDataCategory moi o trang thai khong tin cay.
- Chua seed MasterDataItem va PipelineStage de tranh lan rong du lieu loi.

## 8. Kien nghi xu ly
- Tam dung seed tiep bang MCP content tools hien tai.
- Sau khi doi MCP sua bug, can rerun seed tren moi truong sach hoac co script cleanup record loi truoc khi rerun.
- Khi sua xong, uu tien test lai 3 ca: create don le, create_many, update_by_ids.

## 9. Tai lieu lien quan
- Xem checklist tong quan tai `TODOS/SEED-DATA-CHECKLIST-20260329.md`.
- Bao cao nay chi tap trung vao ket qua seed va blocker MCP trong phien hien tai.
