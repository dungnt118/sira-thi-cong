# SYSTEM CLEANUP CLOSURE - 2026-03-29

Muc dich
- Day la file tong hop sach, chi giu trang thai hien tai sau khi cleanup da hoan tat.
- Khong lap lai cac schema/menu da xoa xong hoac cac wave lich su da xu ly.
- Su dung file nay lam nguon su that de van hanh tiep theo.

## 1. Trang thai he thong hien tai
- Lop schema legacy muc tieu da duoc don dep khoi runtime.
- Lop menu da duoc don dep, khong con route toi cac schema legacy da xoa.
- Dot cleanup metadata trong pham vi MCP co the xem la da dong.

## 2. Kien truc nen su dung tu bay gio
- Journey la runtime hub chinh.
- Project la aggregate van hanh chinh sau ban hang.
- project_id va journey_id la lien ket nghiep vu uu tien.
- CustomerJourneySetting la nguon chuan cho 13 canonical journey step codes.
- Contract khong con la runtime schema dang hoat dong trong he thong hien tai.

## 3. Trang thai metadata hien tai can giu
- Journey.current_step da duoc chuan hoa thanh Dropdown 13 canonical step codes.
- Journey.template_id dang o trang thai deprecated.
- Journey.work_steps dang o trang thai deprecated.
- Cac property contract_id con sot tren cac aggregate con song da duoc deprecated de khoa tiep tuc su dung moi.

## 4. Cach doc he thong hien tai
- Neu can truy vet nghiep vu, uu tien di theo Journey va Project.
- Neu can doi soat tai chinh, uu tien di theo PaymentMilestone, PaymentReceipt, SalesInvoice, DebtConfirmation, ProjectSettlement.
- Neu can dong ho so du an, uu tien di theo ProjectCloseoutPackage va PortalDocument.
- Khong mo rong them theo huong contract_id hoac template_id cu.

## 5. Nhung gi KHONG can lam them trong pham vi MCP
- Khong can mo them mot wave xoa schema/menu nua.
- Khong can cleanup metadata live bo sung cho contract_id trong luc nay.
- Khong can ra soat lai cac tai lieu lich su neu muc tieu chi la van hanh hien tai.

## 6. Neu muon dat trang thai sach tuyet doi
- Thuc hien mot dot backend-level review cho custom report, dashboard, script, query thu cong ngoai pham vi MCP.
- Chi sau buoc review do moi can can nhac cleanup sau cung cho metadata deprecated con lai.

## 7. Ket luan van hanh
- Co the xem he thong da duoc clean o muc metadata platform de tiep tuc phat trien.
- Tu thoi diem nay, moi phan tich va mo rong nen bam theo Journey + Project + Payment/Settlement/Closeout thay vi cac lop legacy da dong.
