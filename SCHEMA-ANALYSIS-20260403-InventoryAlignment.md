# SCHEMA ANALYSIS: Inventory Backend Alignment

## PHAN 1: SO SANH GAP

- MaterialGroup thieu field type trong khi UI dang filter theo group.type = CONSUMABLE.
- Material hien chi co partial_stock tong hop, chua co cau truc chi tiet ton do theo lot/container mo.
- Asset hien chi co assigned_to dang text, chua co lien ket cap phat hien hanh de truy vet chac chan.
- StockOrder va AssetAllocation da dap ung kha tot workflow hien tai, chua can them field lon.

## PHAN 2: THIET KE CHI TIET THUOC TINH

### MaterialGroup
- Them type: Text Dropdown, default CONSUMABLE
- Them status: Text Dropdown, active/inactive
- Them sort_order: Number de sap xep nhom hang

### Material
- Them opened_lots: Nested Table de luu ton do chi tiet
- opened_lots fields: source_order_id, source_order_code, opened_at, original_quantity, remaining_quantity, unit_cost, note
- Muc dich: giu du lieu backend cho ton do thay vi chi mot so tong partial_stock

### Asset
- Them assigned_to_id: Text de luu user id nguoi dang giu
- Them current_allocation_id: ObjectId ref AssetAllocation
- Them assigned_journey_id: ObjectId ref Journey
- Muc dich: giu lien ket cap phat hien hanh de backend truy vet chac hon

## PHAN 3: FORM PREVIEW

```text
MaterialGroup
[Ten nhom] [Don vi co ban] [Don vi dong goi]
[Danh muc] [Type] [Trang thai] [Thu tu sap xep]

Material
[SKU] [Ten vat tu] [Nhom] [Quy cach] [Don vi]
[Ton nguyen] [Ton le] [Nguong canh bao] [Don gia]
[Opened lots table: phieu mo, thoi diem mo, so luong goc, so luong con lai, don gia]

Asset
[Ma TS] [Ten TS] [Nhom] [Trang thai]
[Nguoi dang giu] [User ID nguoi giu]
[Phieu cap phat hien hanh] [Hanh trinh dang su dung]
```

## DE XUAT THUC THI

1. Update MaterialGroup.
2. Update Material.
3. Update Asset.
4. Verify lai schema sau khi update.
