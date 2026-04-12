# SCHEMA ANALYSIS: Estimate Flow Final Spec

## 1. Final Conclusion

- Phuong an chot la bo 3 schema: EstimateTemplate, EstimatePricingPolicy, JourneyEstimate.
- Dinh nghia du toan phai duoc quy ve DUNG 9 bucket chuan, khong phu thuoc vao template hien thi.
- Luong toi uu la policy-first: tinh recommended_quote_value truoc, sau do boc tach 9 bucket, cuoi cung moi expand template de giai trinh direct cost.
- Journey la aggregate root cua flow. Quotation va QuotationLineItem la output cong bo cho khach hang. SurveyRecord la input ky thuat, khong la noi tinh costing.

## 2. Standardized 9 Buckets

Danh sach bucket bat buoc trong moi JourneyEstimate:
- 01_materials: vat tu
- 02_labor_total: tong nhan cong
- 03_warranty_maintenance: bao hanh bao tri
- 04_risk: rui ro
- 05_corporate_tax: thue doanh nghiep
- 06_sales_cost: chi phi ban hang
- 07_management_cost: chi phi quan ly
- 08_hidden_cost: chi phi an
- 09_profit: loi nhuan

Quy tac bucket 02_labor_total:
- Bucket nay luon hien thi thanh 1 dong chuan cho PM.
- Ben trong phai boc tach du 4 thanh phan de giai trinh:
  - outsource_labor
  - internal_fixed_salary
  - technical_commission
  - supervisor_commission

## 3. Minimal Input From Journey

Dau vao toi gian de he thong co the auto-estimate khong gap:
- serviceTypeId
- area_m2
- execution_days

Ket qua ra soat schema Journey hien tai:
- serviceTypeId da ton tai.
- area_m2 chua thay tren Journey schema.
- execution_days chua thay tren Journey schema.

Ket luan input:
- area_m2 va execution_days la GAP nghiep vu dau vao can bo sung o Journey.
- Khong nen day 2 truong nay xuong SurveyRecord neu muc tieu la auto-estimate ngay tu Journey.
- Cac bien so khac nhu worker_count, outsource_mode, internal_schedule_utilization_pct co the de he thong goi y theo policy hoac cho PM override sau.

## 4. Optimized User Flow

1. User tao hoac mo 1 Journey.
2. User nhap 3 dau vao toi gian: loai cong trinh, so m2, so ngay thuc hien.
3. He thong phan loai quy mo va chon EstimatePricingPolicy phu hop.
4. He thong tinh recommended_quote_value truoc.
5. He thong boc tach 9 bucket chuan tu recommended_quote_value.
6. He thong goi y EstimateTemplate va expand direct detail de doi chieu direct cost.
7. He thong validate quote floor va profit target.
8. PM chi override cac ngoai le neu can.
9. Sau khi chot JourneyEstimate, he thong moi sinh Quotation va QuotationLineItem.

## 5. Schema Responsibilities

### 5.1 EstimateTemplate
- Vai tro: direct recipe cho 1 loai hang muc.
- Chi luu direct detail, khong luu profit, risk, tax, cost allocation.
- Nen gom:
  - code, name, service_type_id, scale_type, unit
  - components[]
  - components.type: material, labor, other
  - components.material_id neu la vat tu
  - components.labor_price_config_id neu la tham chieu bang gia tho
  - components.calc_mode: manual, package_m2, daily_worker, formula
  - components.quantity_per_unit
  - components.unit_price
  - components.note

### 5.2 EstimatePricingPolicy
- Vai tro: quote suggestion rule va allocation rule.
- Day la noi giu cong thuc tinh gia va 9 bucket rule.
- Nen gom:
  - code, name, service_type_id, scale_type, is_default, status
  - quote_suggestion_rule
  - scale_rules
  - labor_policy
  - allocation_policy cho bucket 03 den 08
  - profit_policy cho bucket 09
  - scenario_rules

### 5.3 JourneyEstimate
- Vai tro: snapshot giao dich du toan cho tung Journey.
- Day la source of truth cua pricing noi bo.
- Nen gom:
  - header: code, journey_id, survey_record_id, pricing_policy_id, version_no, status
  - journey_input_snapshot: service_type_id, area_m2, execution_days
  - quote_derivation: recommended_quote_value_initial, final_quote_floor, factor snapshot
  - standardized_buckets: DUNG 9 dong bucket chuan
  - labor_breakdown: de giai trinh bucket 02
  - direct_cost_groups: template expand va direct detail
  - validation_result: is_feasible, actual_profit_pct, warning_codes

## 6. No-Gap Calculation Rules

Buoc 1. Tinh recommended_quote_value
- Cong thuc mac dinh nen duoc dat trong EstimatePricingPolicy:
  - recommended_quote_value = area_m2 x base_quote_rate_m2 x duration_factor x scale_factor x complexity_factor
- Co the thay bang banded pricing, nhung ket qua van phai tra ra 1 gia tri quote de boc tach bucket.

Buoc 2. Tinh bucket 01 materials
- Lay tu EstimateTemplate.components where type = material.
- amount = tong quantity_expanded x unit_price.

Buoc 3. Tinh bucket 02 labor_total
- outsource_labor = tong component labor tu template.
- internal_fixed_salary = (internal_salary_monthly + internal_support_monthly) x execution_days x salary_allocation_factor / working_days_per_month.
- technical_commission = technical_commission_pct x recommended_quote_value.
- supervisor_commission = supervisor_commission_pct x recommended_quote_value.
- labor_total = outsource_labor + internal_fixed_salary + technical_commission + supervisor_commission.

Buoc 4. Tinh bucket 03 den 08
- warranty_maintenance = rate x recommended_quote_value.
- risk = rate x recommended_quote_value.
- corporate_tax = rate x recommended_quote_value.
- sales_cost = rate x recommended_quote_value.
- management_cost = rate x recommended_quote_value.
- hidden_cost = rate x recommended_quote_value.

Buoc 5. Tinh bucket 09 profit
- profit = recommended_quote_value - tong bucket 01 den 08.
- profit_rate = profit / recommended_quote_value.

Buoc 6. Validate
- Neu profit_rate < target_profit_pct_min thi he thong phai tang quote floor hoac doi policy.
- Neu bucket 01 + 02 da lon hon recommended_quote_value thi quote hien tai khong kha thi.
- He thong phai luu ca recommended_quote_value_initial va final_quote_floor.

## 7. Case Study 100m2 Waterproof Floor

Gia dinh cau hinh:
- serviceTypeId: Chong tham san
- area_m2: 100
- execution_days: 3
- EstimateTemplate CT-SAN-PU-3L:
  - Primer: 0.2 lit x 35,000
  - BACPU lot: 1.5 kg x 45,000
  - BACPU phu: 2.0 kg x 48,000
  - Outsource labor package: 90,000 / m2
  - Direct other fixed: 800,000 / cong trinh
- EstimatePricingPolicy CS-CT-SAN-MEDIUM:
  - technical_commission_pct = 3%
  - supervisor_commission_pct = 4%
  - warranty_maintenance = 10%
  - risk = 10%
  - corporate_tax = 8%
  - sales_cost = 5%
  - management_cost = 3%
  - hidden_cost = 2%
  - target_profit_pct_min = 18%

Ket qua direct detail khi expand template cho 100 m2:
- Primer = 20 lit = 700,000
- BACPU lot = 150 kg = 6,750,000
- BACPU phu = 200 kg = 9,600,000
- Outsource labor = 9,000,000
- Direct other = 800,000
- Bucket 01 materials = 17,050,000
- Outsource labor trong bucket 02 = 9,000,000

Truong hop danh gia muc tieu gia 70,000,000:
- internal_fixed_salary = 1,650,000
- technical_commission = 2,100,000
- supervisor_commission = 2,800,000
- Bucket 02 labor_total = 15,550,000
- Bucket 03 = 7,000,000
- Bucket 04 = 7,000,000
- Bucket 05 = 5,600,000
- Bucket 06 = 3,500,000
- Bucket 07 = 2,100,000
- Bucket 08 = 1,400,000
- Bucket 09 profit = 10,800,000
- Profit rate = 15.43%
- Ket luan: du 9 bucket, nhung chua dat target 18%.

Truong hop toi uu de dat target profit 18%:
- final_quote_floor = 77,030,000
- Bucket 01 materials = 17,050,000
- Bucket 02 labor_total = 15,392,100
- Bucket 03 = 7,703,000
- Bucket 04 = 7,703,000
- Bucket 05 = 6,162,400
- Bucket 06 = 3,851,500
- Bucket 07 = 2,310,900
- Bucket 08 = 1,540,600
- Bucket 09 profit = 15,316,500
- Profit rate = 19.88%
- Ket luan: dat target, khong gap, du 9 bucket chuan.

## 8. Redundancy Assessment

- SurveyRecord khong du thua, nhung chi nen giu input ky thuat muc cao.
- EstimateTemplate khong du thua, nhung chi nen giu direct recipe.
- EstimatePricingPolicy la schema moi can thiet, khong the thay bang LaborPriceConfig.
- LaborPriceConfig van co gia tri de cap don gia tham chieu cho labor component.
- QuotationMappingRule khong du thua; dung de cong bo du lieu tu JourneyEstimate sang QuotationLineItem.
- CustomerJourneySetting khong du thua; day la flow config, khong phai pricing config.

## 9. Final Decisions

- Chot bo 3 schema: EstimateTemplate, EstimatePricingPolicy, JourneyEstimate.
- Chot 9 standardized buckets la bat buoc o top-level JourneyEstimate.
- Chot luong policy-first thay vi template-first.
- Chot 3 input toi gian tu Journey: serviceTypeId, area_m2, execution_days.
- Chot area_m2 va execution_days la gap nghiep vu can bo sung o Journey.
- Chot Quotation va QuotationLineItem chi la output cong bo cho khach hang.

