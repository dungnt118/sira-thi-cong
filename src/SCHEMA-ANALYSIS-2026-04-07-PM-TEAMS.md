# SCHEMA ANALYSIS: PM Worker, Team, Labor Price

## PHAN 1: SO SANH GAP (Codebase vs Current Schema)

| Nghiep vu | Codebase PM | Schema hien tai | Gap/Issue | Priority |
|---|---|---|---|---|
| Danh muc tho | WorkerManagement quan ly ho so tho voi ten, loai tho, trinh do, don gia, ky nang, lien he, dia chi | Chi co Employee voi 6 field nen tang | Thieu schema master-data cho tho | High |
| Danh muc doi tho | TeamManagement quan ly doi, nguoi dai dien, lien he, thanh vien, chuyen mon, MST, ngan hang, khu vuc | Khong tim thay schema doi tho | Thieu hoan toan schema doi tho | High |
| Bang gia tho | LaborPriceConfig quan ly level, name, defaultPrice | Khong tim thay schema hoac setting schema tuong ung | Thieu schema cau hinh don gia | High |
| Nguon du lieu | 3 module dung useLocalStorageData + demoDataService | Khong bind vao schema he thong | Dang la mock/local persistence | High |
| Phan cong du an | Co ProjectAssignment lien ket Employee vao Journey/Project | Co schema that nhung chi cho phan cong du an | Khong giai quyet bai toan master data tho/doi/bang gia | Medium |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Worker
- Field cot loi: code, name, workerType, employeeId, gender, dob, phone, email, position, levelCode, costPerHour, skills, rating, status, teamId, address, location, attachments

### WorkerTeam
- Field cot loi: code, teamName, contactName, phone, email, zalo, status, specializations, rating, taxCode, bankAccount, joinDate, totalProjects, completedProjects, address, location

### LaborPriceConfig
- Field cot loi: levelCode, name, defaultPrice, status, note

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
[Worker] code | name | workerType | levelCode | costPerHour | teamId
[WorkerTeam] code | teamName | contactName | phone | specializations
[LaborPriceConfig] levelCode | name | defaultPrice | status
```
