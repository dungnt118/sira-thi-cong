# Ke hoach migration schema len BAC backend

## Muc tieu
- Chuyen du lieu frontend prototype sang backend BAC theo tung nhom nghiep vu.
- Trien khai qua mcp-bac theo dot nho, khong lam o at.
- Dung BA-V4 + src/types + src/data lam nguon chot schema.

## Hien trang
- src/services hien moi co localstorage, chua co backend that.
- Frontend da co types/mockData de boc tach entity cot loi.
- BA-V4 da chia module ro theo ownership du lieu.

## Thu tu uu tien
1. 01-foundation-governance.md
2. 02-crm-sales.md
3. 03-preconstruction-project-handoff.md
4. 04-field-execution.md
5. 05-inventory-assets.md
6. 06-finance-warranty-portal.md
7. 07-document-automation-reporting.md

## Quy tac lam viec voi mcp-bac
1. Moi schema phai co SCHEMA-ANALYSIS truoc khi tao/update.
2. Tao master/reference schema truoc transaction schema.
3. Khong tao lai system fields san co.
4. Xong nhom truoc moi mo nhom sau.
5. Schema nao co san tren backend thi uu tien get_schema roi update.

## Nguon tham chieu
- documents/BA-V4/README.md
- documents/BA-V4/02-Technical-Design/Module_Architecture_v4.md
- documents/BA-V4/05-Development-Guides/Implementation_Plan_v4.md
- src/types/journey.ts
- src/types/v3.ts
- src/data/journeyMockData.ts
- src/data/mockData.ts
