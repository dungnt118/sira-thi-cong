# OPTION 3 FRONTEND IMPLEMENTATION PLAN

## 1. Muc tieu

Option 3 dua estimate flow vao frontend that su, khong con dung mock cho Step04 va Step05, dong thoi nang Step01 thanh nguon dau vao estimate-ready ngay tu Journey.

Muc tieu cu the
- Dong bo contract Journey giua create, edit, view va step flow.
- Bien Step01 thanh noi kiem tra va cap nhat du lieu dau vao cho auto-estimate.
- Bien Step04 thanh man hinh pricing noi bo dung JourneyEstimate la source of truth.
- Bien Step05 thanh man hinh quote/public output dung du lieu da approved.
- Loai bo hoan toan viec frontend bam vao mock estimate shape cu.
- Cung cap tieu chi hoan thanh ro rang de dev va tester tu kiem chung duoc.

## 2. Pham vi

Trong pham vi
- Journey form create/edit.
- Step01 view/edit trong Journey detail.
- Journey detail container va gating giua cac step.
- Step04 Solution.
- Step05 Quote.
- Service layer, query layer, frontend state layer phuc vu estimate flow.
- Regression check cac man hinh Journey chinh co hien thi service type, estimate readiness va quote readiness.

Ngoai pham vi
- Thay doi schema BAC nua.
- Viet lai toan bo Journey workflow ngoai Step01, Step04, Step05.
- Tinh toan pricing engine trong frontend.
- Tinh toan business formulas o client-side.

## 3. Nen tang da co

- Journey da co serviceTypeId, area_m2, execution_days, complexity_level.
- JourneyEstimate da co contract final voi journey_input_snapshot, quote_derivation, standardized_buckets, labor_breakdown, direct_cost_groups, validation_result.
- Legacy shape da bi deprecated voi tax_rate, subtotal, tax_amount, grand_total, notes, groups va toan bo nested child cua groups.
- Frontend types da co field moi cho Journey va JourneyEstimate.
- Service CRUD da co cho JourneyEstimate va EstimatePricingPolicy.

## 4. Van de hien tai can giai quyet

1. Step01 va JourneyForm chua su dung day du contract Journey moi.
2. serviceTypeId dang duoc nhap bang Input tho, khong phu hop voi reference thuc te.
3. Step04 van doc mockEstimates, mockEstimateTemplates, mockMaterials.
4. Step05 van sync quote tu estimate groups cu va mockJourneys.
5. JourneyDetail360 chua co gating theo estimate readiness va approval readiness.
6. Frontend chua co facade hoac orchestration layer cho estimate flow.
7. Tester chua co checklist xac minh ro rang cho option 3.

## 5. Nguyen tac thuc hien

- Khong tinh gia trong frontend. Frontend chi render snapshot va gui action.
- Khong tiep tuc dung groups legacy cho logic moi.
- Mot contract du lieu Journey phai duoc dung thong nhat o create, edit, view va step flow.
- Step04 la pricing noi bo, Step05 la quote/public output. Hai man hinh nay khong trung vai tro.
- Moi action business nhu recalculate, submit review, approve, generate quote phai di qua API dedicated hoac facade server-side.

## 6. Danh sach file anh huong chinh

Can sua chac chan
- src/components/journey/JourneyForm.tsx
- src/components/journey/JourneyUpsertDrawer.tsx
- src/pages/shared/JourneySteps/Step01Info.tsx
- src/pages/shared/JourneySteps/Step04Solution.tsx
- src/pages/shared/JourneySteps/Step05Quote.tsx
- src/pages/shared/Journeys/JourneyDetail360.tsx

Can bo sung moi kha nang cao
- src/components/journey/JourneyEstimateInputFields.tsx
- src/components/journey/JourneyEstimateReadinessCard.tsx
- src/components/journey/StandardizedBucketTable.tsx
- src/components/journey/LaborBreakdownCard.tsx
- src/components/journey/DirectCostGroupsPanel.tsx
- src/components/journey/EstimateValidationBanner.tsx
- src/hooks/useJourneyEstimateFlow.ts
- src/utils/journeyEstimate.ts

## 7. Deliverable cua option 3

- Journey create/edit co the nhap day du 4 field estimate-ready.
- Step01 view/edit hien thi va validate dung 4 field nay.
- JourneyDetail360 tu hien readiness state cua estimate.
- Step04 load va hien JourneyEstimate that, khong con mock.
- Step05 load va hien quote tu estimate approved, khong con mock.
- Toan bo UI moi khong doc shape groups legacy.
- Tester co bo testcase ro rang de tu kiem chung.

## 8. Workstream A - Dong bo input Journey

### A1. Refactor JourneyForm
File: src/components/journey/JourneyForm.tsx
- Thay serviceTypeId tu Input thanh Select hoac component lookup dung nguon MasterDataItem.
- Them area_m2 bang InputNumber.
- Them execution_days bang InputNumber.
- Them complexity_level bang Select.
- Dat validation: serviceTypeId required, area_m2 required va lon hon 0, execution_days required va lon hon 0, complexity_level optional.
- Dat help text ro rang rang 3 field dau la can thiet de he thong lap du toan.
- Dam bao payload onSubmit gui du cac field moi.

UI de xuat cho block Thong tin cong trinh
- Dich vu yeu cau
- Dien tich m2
- So ngay thuc hien
- Muc do phuc tap
- Dia chi cong trinh
- Tieu de yeu cau

### A2. Refactor JourneyUpsertDrawer
File: src/components/journey/JourneyUpsertDrawer.tsx
- Cap nhat title va description neu can de phan biet tao ho so va tao ho so estimate-ready.
- Dam bao destroyOnClose van giu duoc UX hien tai.
- Khong can logic business moi o drawer, chi can pass dung initialValues va submit flow.

### A3. Refactor Step01Info edit mode
File: src/pages/shared/JourneySteps/Step01Info.tsx
- Them 3 field moi vao form edit: area_m2, execution_days, complexity_level.
- serviceTypeId phai dung component select hoac lookup, khong dung Input string.
- Gop thanh block rieng ten la Dau vao lap du toan.
- Save payload phai gui du 4 field estimate-related.
- Validation giong JourneyForm de tranh lech contract.

### A4. Refactor Step01Info view mode
File: src/pages/shared/JourneySteps/Step01Info.tsx
- Bo sung section hien thi service type title, area_m2, execution_days, complexity_level.
- Them readiness banner: Ready neu du serviceTypeId, area_m2, execution_days. Missing neu thieu 1 trong 3 field bat buoc.
- Neu thieu field, hien CTA Chinh sua ngay trong Step01.

## 9. Workstream B - Orchestration va state cho estimate flow

### B1. Tao facade hoac hook useJourneyEstimateFlow
File moi: src/hooks/useJourneyEstimateFlow.ts
- Gom logic query JourneyEstimate latest theo journey_id.
- Xu ly state loading, error, refreshing.
- Cung cap action: loadLatestEstimate, createDraftEstimate, recalculateEstimate, saveEstimateDraft, submitEstimateReview, approveEstimate, generateQuoteFromEstimate.
- Hook phai co co che invalidate sau khi Step01 save xong.

### B2. Xac dinh API can co
- create draft estimate from journey
- recalculate estimate
- submit review
- approve estimate
- create quotation from approved estimate
- CRUD JourneyEstimate hien tai chua du cho full business flow.

## 10. Workstream C - Refactor Step04 Solution
File: src/pages/shared/JourneySteps/Step04Solution.tsx
- Bo import mockEstimates, mockEstimateTemplates, mockMaterials.
- Bo logic tinh subtotal, tax, grand total o client.
- Khong dung groups cu.
- Thay source data bang JourneyEstimate latest.
- Render 6 block: Journey input snapshot, Pricing policy snapshot, Quote derivation, Standardized buckets, Labor breakdown, Direct cost groups va validation result.

Action tren man hinh
- Khoi tao du toan
- Tinh lai
- Luu nhap
- Trinh duyet
- Duyet
- Tao bao gia

Rule UX
- Neu Step01 chua du input, Step04 hien empty state co huong dan.
- Neu chua co JourneyEstimate, hien CTA Khoi tao du toan.
- Neu status la reviewing, khoa editable fields va cho theo doi.
- Neu status la approved, chi con read-only va cho tao bao gia.
- Neu status la superseded, hien badge va khoa thao tac.

## 11. Workstream D - Refactor Step05 Quote
File: src/pages/shared/JourneySteps/Step05Quote.tsx
- Bo mockQuotations, mockEstimates, mockJourneys.
- Bo handleSyncWithEstimates dua tren groups cu.
- Load quote data tu API quote that hoac generate tu approved JourneyEstimate.
- Hien traceability den JourneyEstimate version.

Rule nghiep vu
- Neu chua co approved JourneyEstimate thi khong cho tao quote.
- Neu co quote roi thi Step05 hien quote summary va line items.
- Neu estimate da superseded sau khi quote tao ra, Step05 hien canh bao quote dang bam estimate cu.

Thanh phan UI
- header quote status
- badge version nguon
- list line item public-facing
- subtotal
- VAT
- grand total
- ghi chu thuong mai

## 12. Workstream E - Dieu chinh JourneyDetail360
File: src/pages/shared/Journeys/JourneyDetail360.tsx
- Them readiness state cho estimate flow.
- Tinh 3 bien UI: isEstimateInputReady, hasDraftOrApprovedEstimate, isQuoteReady.
- Tab Step04 phai hien badge: missing_input, draft, reviewing, approved, superseded.
- Tab Step05 phai hien badge: blocked, ready_to_generate, quote_created, out_of_date.
- Sau khi Step01 save xong, JourneyDetail360 phai refresh readiness.
- Sau khi Step04 recalculate hoac approve xong, JourneyDetail360 phai refresh badge Step04 va Step05.

## 13. Workstream F - Reusable component de tranh duplicate logic
- JourneyEstimateInputFields
- JourneyEstimateReadinessCard
- StandardizedBucketTable
- LaborBreakdownCard
- DirectCostGroupsPanel
- EstimateValidationBanner
- EstimateStatusBadge

Muc tieu
- Step01, Step04, JourneyForm va JourneyDetail360 khong lap lai logic readiness.
- UI giong nhau giua create, edit va view.

## 14. Workstream G - Loai bo legacy va mock phu tro
- Xoa import mockData khoi Step04 va Step05.
- Xoa logic render groups legacy o Step04 moi.
- Xoa moi helper tinh subtotal, tax, grandTotal o client trong flow estimate.
- Review toan bo code de dam bao khong co noi nao moi tiep tuc doc JourneyEstimate.groups.

Kiem tra ky thuat
- grep khong con usage moi cua mockEstimates trong Step04 va Step05.
- grep khong con usage moi cua mockQuotations trong Step05.
- grep khong con usage moi cua JourneyEstimate.groups trong component moi.

## 15. Ke hoach trien khai theo phase

Phase 1 - Intake readiness
- Pham vi: JourneyForm, JourneyUpsertDrawer, Step01Info, JourneyDetail360 readiness basic.
- Ket qua: user nhap du input estimate-ready ngay khi tao hoac sua Journey, Step01 hien ro readiness state, Step04 co the bi khoa neu input chua hop le.

Phase 2 - Estimate orchestration
- Pham vi: useJourneyEstimateFlow, API adapter hoac facade, readiness and loading state.
- Ket qua: co mot tang logic trung tam cho Step04 va Step05.

Phase 3 - Step04 production refactor
- Pham vi: Step04Solution va reusable estimate components.
- Ket qua: Step04 doc du lieu JourneyEstimate that va khong con mock estimate.

Phase 4 - Step05 production refactor
- Pham vi: Step05Quote va quote generation bridge.
- Ket qua: Step05 doc du lieu quote that va quote duoc sinh tu approved JourneyEstimate.

Phase 5 - cleanup va regression
- Pham vi: xoa import cu, grep legacy usage, smoke test role pages.
- Ket qua: flow on dinh tren JourneyDetail360 va khong con usage logic cu trong code moi.

## 16. Dependency va risk can quan ly
Dependency ky thuat
- Backend phai co business action cho recalculate, review, approve, generate quote, hoac co ke hoach bo sung.
- Lookup service cho serviceTypeId phai san sang.
- Quote API phai co contract ro rang de Step05 render.

Risk
- Neu frontend refactor xong ma backend chua co action business-level, Step04 va Step05 se bi dung o muc CRUD.
- Neu serviceTypeId van tiep tuc cho nhap text, data se lech refSchema va auto-estimate se khong on dinh.
- Neu tester khong co dataset Journey du input estimate, se kho thuc hien UAT.

Giam thieu risk
- Chuan bi seed data 3 loai Journey: thieu input, co draft estimate, co approved estimate.
- Chot som contract API cho JourneyEstimate actions.
- Khong deploy Step04 va Step05 refactor neu van con duong doc mock.

## 17. Dataset test can chuan bi
1. Journey A - Missing input: thieu serviceTypeId hoac area_m2 hoac execution_days, khong co JourneyEstimate.
2. Journey B - Ready for estimate: du serviceTypeId, area_m2, execution_days, chua co JourneyEstimate.
3. Journey C - Draft estimate: du input, co JourneyEstimate status draft hoac reviewing, co du standardized_buckets, labor_breakdown, direct_cost_groups, validation_result.
4. Journey D - Approved estimate va quote: du input, co JourneyEstimate status approved, da co Quotation tao tu estimate do.

## 18. Test case chi tiet cho tester
TC01 - Tao Journey moi co du input estimate-ready. Ket qua mong doi: save thanh cong, Journey luu du 4 field estimate-related, mo lai detail thay du lieu hien dung o Step01 view.
TC02 - Chinh sua Step01 de bo sung du lieu estimate. Ket qua mong doi: canh bao bien mat sau khi save, readiness state chuyen sang san sang lap du toan, Step04 khong con bi khoa vi thieu input.
TC03 - Step04 bi khoa khi chua du input. Ket qua mong doi: khong hien bang du toan editable, hien empty state noi ro thieu field nao, co CTA dieu huong ve Step01.
TC04 - Khoi tao draft JourneyEstimate. Ket qua mong doi: tao duoc JourneyEstimate draft moi gan dung journey_id, UI hien pricing policy, quote derivation, 9 bucket, labor breakdown, direct cost groups, khong doc mock data.
TC05 - Hien thi dung 9 bucket chuan. Ket qua mong doi: co dung 9 dong bucket, ma bucket 01 den 09, bucket 09_profit duoc highlight, khong co subtotal, tax, grand total legacy o block chinh cua estimate.
TC06 - Validation result chan approve. Ket qua mong doi: UI hien ly do chan thao tac, approve hoac generate quote bi disable hoac bi reject co thong bao ro rang.
TC07 - Step05 chi mo khi estimate approved. Ket qua mong doi: khong cho tao quote tu draft hoac reviewing estimate, hien guidance can approved estimate truoc.
TC08 - Generate quote tu approved estimate. Ket qua mong doi: quote tao thanh cong, Step05 hien quote items, subtotal, VAT, grand total, co badge nguon JourneyEstimate version.
TC09 - Quote out-of-date khi estimate superseded. Ket qua mong doi: hien canh bao quote dang dua tren estimate cu, user khong bi nham quote dang fresh neu estimate da thay doi.
TC10 - Regression role pages. Ket qua mong doi: khong vo layout, serviceTypeId title van hien dung, Step01, Step04, Step05 van hoat dong trong shell role tuong ung.

## 19. Definition of Done cho dev
- JourneyForm va Step01Info da hien thi va luu dung 4 field estimate-related.
- serviceTypeId khong con la text input tho trong create va edit chinh.
- Step04 khong con import mock estimate, template, material.
- Step05 khong con import mock quotation, estimate, journey.
- Khong con logic moi su dung JourneyEstimate.groups.
- JourneyDetail360 co readiness va status gating cho Step04 va Step05.
- Tester chay qua TC01 den TC10 dat ket qua nhu mong doi.
- Khong co regression nghiem trong tren Journey detail cua sale va PM.

## 20. Definition of Done cho tester
- Co the tao Journey moi va nhap du estimate input ngay tu dau.
- Co the chinh sua Step01 va thay readiness thay doi dung.
- Step04 khong con hien du lieu mock cu.
- Step04 hien du 9 bucket chuan va validation dung.
- Step05 chi lam viec khi estimate da approved.
- Quote sinh ra co traceability den estimate version.
- Khong co man hinh nao tiep tuc the hien groups legacy la luong chinh.

## 21. Tieu chi nghiem thu cuoi cung
- User co duoc yeu cau nhap input estimate-ready ngay tai Step01 hoac create-edit Journey khong.
- Step01 co cho biet ho so da san sang lap du toan hay chua khong.
- Step04 co dung JourneyEstimate thay cho mock khong.
- Step04 co hien va giai thich du 9 bucket chuan khong.
- Step05 co chi sinh va hien quote tu approved estimate khong.
- Quote co truy vet duoc ve JourneyEstimate version nguon khong.
- Frontend co ngung bam vao groups legacy khong.
- Tester co the xac minh toan bo flow bang dataset thu nghiem ma khong can doc code khong.

## 22. Thu tu thuc hien de xuat cho team
1. Chot API action business-level cho estimate flow.
2. Sua JourneyForm va Step01Info.
3. Them readiness state vao JourneyDetail360.
4. Tao useJourneyEstimateFlow va reusable estimate components.
5. Refactor Step04.
6. Refactor Step05.
7. Chay testcase TC01 den TC10.
8. Don dep legacy, mock import va grep regression.

## 23. Ghi chu cuoi
Option 3 khong chi la thay Step04 va Step05, ma la chuan hoa toan bo hanh trinh tu du lieu dau vao cua Journey den estimate noi bo va quote dau ra. Neu bo qua Step01 thi estimate flow se tiep tuc thieu can cu dau vao va frontend se van pha lech contract so voi schema da chot.
