# SCHEMA ANALYSIS: PaymentRequest + Bank Accounts

## PHAN 1: SO SANH GAP

- Nghiep vu dung ban chat la phieu yeu cau chi tien, khong chi la lenh chuyen tien.
- Lich su chi tien phai nam ngay trong schema chinh de lam co so bao cao tai chinh.
- Khong can schema log rieng; cac moc gui duyet, duyet, chi tien se luu tren cung 1 phieu.
- Cong ty co nhieu tai khoan chi nen can 1 schema danh muc tai khoan ngan hang cong ty.
- Tai khoan nguoi nhan can tach thanh danh muc contact doc lap de tai su dung cho nhieu phieu.
- De giu tinh lich su bao cao, phieu chi khong chi reference ma con can luu snapshot tai khoan nguon va dich tai thoi diem lap phieu.

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Schema 1: PaymentRequest
- label: Phieu yeu cau chi tien
- collection: paymentrequest
- keyField: code
- tags: Finance, Accounting, Operations
- Muc dich: luu toan bo vong doi phieu chi tu de xuat den xac nhan da chi thanh cong.
- Nhom 1 Thong Tin Phieu: code, request_date, request_type, priority, requested_by, approver_assigned, status, request_note, reference_code, supporting_files
- Nhom 2 Thong Tin Chi Tien: company_bank_account_id, beneficiary_bank_contact_id, source_account_name_snapshot, source_account_number_snapshot, source_bank_name_snapshot, beneficiary_name_snapshot, beneficiary_account_number_snapshot, beneficiary_bank_name_snapshot, beneficiary_branch_snapshot, amount, currency, payment_content, approved_by, approved_at, rejected_at, rejection_reason, paid_by, paid_at, bank_transaction_ref, payment_proof_files, payment_proof_note
- Snapshot bat buoc de bao cao lich su: source_account_name_snapshot, source_account_number_snapshot, source_bank_name_snapshot, beneficiary_name_snapshot, beneficiary_account_number_snapshot, beneficiary_bank_name_snapshot, beneficiary_branch_snapshot
- Trang thai de xuat: draft, pending_approval, approved, rejected, paid, cancelled
- Rule nghiep vu: khong cho status = paid neu payment_proof_files rong
- Rule nghiep vu: company_bank_account_id va beneficiary_bank_contact_id la bat buoc khi lap phieu
- Rule nghiep vu: neu can tach nhiem thi requested_by khong trung approved_by

### Schema 2: CompanyBankAccount
- label: Tai khoan ngan hang cong ty
- collection: companybankaccount
- keyField: code
- tags: Finance, Accounting, MasterData
- Muc dich: danh muc cac tai khoan ngan hang ma cong ty duoc phep dung de chi tien.
- Thuoc tinh chinh: code, account_name, account_number, bank_name, branch_name, company_name, currency, is_default, status, note
- Trang thai de xuat: active, inactive
- Rang buoc: account_number unique

### Schema 3: BeneficiaryBankContact
- label: Tai khoan ngan hang nguoi nhan
- collection: beneficiarybankcontact
- keyField: code
- tags: Finance, Accounting, MasterData
- Muc dich: danh muc contact nhan tien doc lap, co the la nha cung cap, doi tac, nhan vien, khach hang, ca nhan khac.
- Thuoc tinh chinh: code, contact_type, contact_name, phone, email, linked_distributor_id, bank_account_name, bank_account_number, bank_name, branch_name, identity_no, tax_code, is_frequent, status, note
- contact_type de xuat: supplier, partner, employee, customer, other
- Trang thai de xuat: active, inactive
- linked_distributor_id co the optional ref Distributor neu contact la nha cung cap da ton tai trong he thong
- Rang buoc: bank_account_number khong nen unique toan he thong; nen unique theo cap contact_name + bank_account_number neu can

## PHAN 3: FORM PREVIEW

```text
Phieu yeu cau chi tien

Thong Tin Phieu
[Ma phieu] [Ngay lap] [Loai yeu cau] [Do uu tien]
[Nguoi de xuat] [Nguoi duyet du kien] [Trang thai]
[Ma chung tu lien quan]
[Ghi chu de xuat...............................]
[Chung tu de nghi: Upload files]

Thong Tin Chi Tien
[TK nguon cong ty: lookup CompanyBankAccount]
[TK nguoi nhan: lookup BeneficiaryBankContact]
[Nguon snapshot: ten TK, so TK, ngan hang]
[Dich snapshot: ten nguoi nhan, so TK, ngan hang, chi nhanh]
[So tien] [Loai tien]
[Noi dung chi tien.............................]
[Nguoi duyet] [Luc duyet]
[Luc tu choi] [Ly do tu choi...................]
[Nguoi xac nhan da chi] [Luc chi]
[Ma giao dich ngan hang]
[Bang chung da chi: Upload proof]
[Ghi chu xac nhan..............................]

Danh muc bo tro
[Tai khoan ngan hang cong ty] form rieng
[Tai khoan ngan hang nguoi nhan] form rieng
```

## DE XUAT THUC THI

1. Tao truoc CompanyBankAccount va BeneficiaryBankContact.
2. Tao PaymentRequest reference vao 2 schema danh muc nay.
3. Tren PaymentRequest van luu them snapshot tai khoan nguon va dich de bao cao lich su khong bi anh huong khi danh muc thay doi.
4. Chi thuc hien tool create schema sau khi user xac nhan file nay.
