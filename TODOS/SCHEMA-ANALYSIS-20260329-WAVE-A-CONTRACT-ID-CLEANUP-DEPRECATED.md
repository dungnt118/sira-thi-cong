# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: Wave A - contract_id cleanup

## PHAN 1: SO SANH GAP
- Contract da bi xoa khoi backend runtime.
- Nhieu aggregate con song van giu property contract_id voi refSchemas=[Contract].
- Gap: broken reference metadata toi schema da mat, de gay nhieu tang su that va loi runtime tiem an.

## PHAN 2: THIET KE CHI TIET THUOC TINH
- Project.contract_id: set isDeprecated=true
- PaymentMilestone.contract_id: set isDeprecated=true
- PaymentReceipt.contract_id: set isDeprecated=true
- SalesInvoice.contract_id: set isDeprecated=true
- DebtConfirmation.contract_id: set isDeprecated=true
- DebtCollectionTask.contract_id: set isDeprecated=true
- HandoverAcceptance.contract_id: set isDeprecated=true
- ProjectSettlement.contract_id: set isDeprecated=true
- ProjectCloseoutPackage.contract_id: set isDeprecated=true
- Ly do chung: khoa tiep tuc su dung reference toi Contract, chuyen lien ket chinh sang Project/Journey.

## PHAN 3: FORM PREVIEW
```text
Project / Finance / Handover / Closeout forms
[contract_id - deprecated hidden in cleanup wave]
[project_id] [journey_id] tro thanh lien ket chinh
```
