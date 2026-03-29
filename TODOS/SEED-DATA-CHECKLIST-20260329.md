# SEED DATA CHECKLIST - 2026-03-29

Muc dich
- Theo doi tien do tao seed data backend bang MCP content tools.
- Moi muc se duoc danh dau ngay sau khi seed xong va verify du lieu.

## Checklist
- [x] SalesPipeline (reuse record mac dinh hien co, khong tao moi)
- [ ] CustomerJourneySetting (singleton default 13 buoc)
- [ ] MasterDataCategory (seed cac nhom danh muc dung chung toi thieu)
- [ ] MasterDataItem (seed gia tri cho cac nhom danh muc toi thieu)
- [ ] PipelineStage (seed 4 giai doan cho SalesPipeline mac dinh)


## Tien do thuc te
- SalesPipeline: da verify co 1 record mac dinh san co va duoc tai su dung.
- CustomerJourneySetting: da tao duoc 1 record nhung field scalar root (setting_key, setting_name, is_active, version_label, note) dang bi null khi doc lai qua MCP; 13 block step nested co du lieu.
- MasterDataCategory: da tao them 4 record moi nhung field scalar root dang khong duoc materialize khi doc lai qua MCP; chua du dieu kien seed tiep MasterDataItem.
- MasterDataItem: tam dung do chua co category record o trang thai verify tot.
- PipelineStage: tam dung de tranh tao them du lieu bi loi tuong tu.

## Blocker
- MCP content tool hien dang co bat thuong voi create/create_many va update_by_ids tren cac field scalar top-level.
- Khong nen tiep tuc seed them cho den khi co cach ghi du lieu scalar root on dinh hoac co kenh tao content thay the.

