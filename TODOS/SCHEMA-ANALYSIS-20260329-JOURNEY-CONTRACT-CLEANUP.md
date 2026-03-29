# SCHEMA ANALYSIS: Journey + Contract Cleanup

## PHAN 1: SO SANH GAP
- Journey.work_steps: legacy bridge nested container, can deprecated live.
- Contract.latest_project_settlement_id: convenience backlink, deprecated for lean architecture.
- Contract.latest_closeout_package_id: convenience backlink, deprecated for lean architecture.

## PHAN 2: THIET KE CHI TIET THUOC TINH
- Journey.work_steps: Nested/Table/fullwidth, action = set isDeprecated true.
- Contract.latest_project_settlement_id: ObjectId to ProjectSettlement, action = set isDeprecated true.
- Contract.latest_closeout_package_id: ObjectId to ProjectCloseoutPackage, action = set isDeprecated true.

## PHAN 3: FORM PREVIEW
```text
Journey: [work_steps - deprecated legacy bridge]
Contract: [latest_project_settlement_id - deprecated] [latest_closeout_package_id - deprecated]
```
