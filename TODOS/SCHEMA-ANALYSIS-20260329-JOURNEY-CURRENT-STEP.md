# SCHEMA ANALYSIS: Journey current_step canonicalization

## PHAN 1: SO SANH GAP
- Journey.current_step hien dang la Text/Input, de rong value tu do.
- CustomerJourneySetting da co 13 canonical step codes dung cho runtime flow.
- Gap: current_step chua bi rang buoc vao danh sach canonical.

## PHAN 2: THIET KE CHI TIET THUOC TINH
- name: current_step
- propType: Text
- editor: Dropdown
- form_width: width1_2
- action: replace free-text by canonical 13 step options.

## PHAN 3: FORM PREVIEW
```text
Journey: [current_step v Dropdown 13 canonical steps]
```
