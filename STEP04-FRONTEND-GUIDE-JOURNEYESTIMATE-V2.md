# STEP04 FRONTEND GUIDE - JOURNEYESTIMATE CONTRACT V2

Target file: src/pages/shared/JourneySteps/Step04SolutionOrchestration.tsx
Scope: Frontend guidance only. No implementation in this document.

## 1. Muc dich

Tai lieu nay huong dan frontend thiet ke lai Step04 de bam sat contract JourneyEstimate moi nhat, khong con dung tu duy summary-only va khong duplicate voi Step05.

Muc tieu
- Hien thi du chi tiet theo contract moi.
- Giu ro ranh gioi giua du toan noi bo va bao gia khach hang.
- Bao dam view mode va edit mode deu khong lam mat du lieu moi.
- Tao co so ro rang de dev frontend implement nhat quan.

## 2. Ranh gioi nghiep vu

Step04 la man hinh DU TOAN NOI BO.
Step05 la man hinh BAO GIA KHACH HANG.

Step04 phai la noi doc va chinh JourneyEstimate day du, bao gom
- standardized_buckets
- labor_breakdown
- role_cost_allocations
- direct_cost_groups
- direct_cost_groups.components
- journey_role_snapshot
- validation_result
- quote_derivation

Step05 KHONG duoc tro thanh estimate editor thu hai. Step05 chi duoc doc du lieu quote-ready da map tu estimate approved.

## 3. Contract hien tai can frontend ton trong

Root fields
- code
- journey_id
- pricing_policy_id
- total_estimate_cost
- version_no
- status
- journey_input_snapshot
- quote_derivation
- standardized_buckets
- labor_breakdown
- role_cost_allocations
- direct_cost_groups
- journey_role_snapshot
- validation_result

Khong duoc quay lai dung shape legacy groups, subtotal, tax_amount, grand_total, notes.

## 4. Kien truc UI Step04 de xuat

Step04 nen duoc chia thanh 8 block ro rang theo dung contract.

Block 1 - Estimate header
- code
- status
- version_no
- pricing_policy_id va label policy
- total_estimate_cost
- quote_derivation.recommended_quote_value_initial
- quote_derivation.final_quote_floor

Block 2 - Journey input snapshot
- service_type_id
- area_m2
- execution_days
- worker_count
- internal_staff_count
- supervisor_count
- outsource_mode
- internal_schedule_utilization_pct
- project_complexity_factor

Block 3 - Journey role snapshot
- pm_user
- owner_user
- sale_users
- supervisor_users
- technical_users

Block 4 - Cost buckets summary
- standardized_buckets la bang tong hop chinh
- luon co 9 dong bucket theo thu tu 01 den 09
- row 09_profit phai duoc highlight

Block 5 - Labor breakdown summary
- outsource_labor
- internal_fixed_salary
- technical_commission
- supervisor_commission
- labor_total
- role_allocation_total
- sale_related_excluded
- management_related_excluded
- note

Block 6 - Role cost allocations table
- bucket_code
- role_code
- usernames
- headcount
- work_days
- calc_mode
- unit_rate
- allocation_pct
- amount
- formula_snapshot
- note

Block 7 - Direct cost groups
- group_code
- name
- template_name_snapshot
- quantity
- unit
- material_amount
- labor_amount
- other_amount
- subtotal
- cost_basis_note
- note

Block 8 - Direct cost components detail
- type
- material_id va neu co thi idx_material_id
- labor_price_config_id
- item_code
- item_name
- item_spec
- brand_name
- source_type
- source_ref_label
- calc_mode
- quantity_per_unit
- expanded_quantity
- quantity
- waste_pct
- unit
- unit_price
- line_total
- formula_code
- formula_snapshot
- cost_note
- note

Block 9 - Validation and audit
- validation_result.is_feasible
- validation_result.target_profit_pct_min
- validation_result.actual_profit_pct
- validation_result.warning_codes
- validation_result.warning_note
- updatedTime
- updatedBy
 

## 5. Mapping contract sang UI

5.1 standardized_buckets
- Hien thi dang bang tong hop, day la bang tong duy nhat duoc xem la summary bucket chuan.
- Khong duoc dung bang nay de thay the chi tiet vat tu hay chi tiet nhan su.

5.2 labor_breakdown
- Chi la summary cho bucket 02.
- Khong duoc xem day la bang phan bo theo user.
- role_allocation_total la tong doi chieu voi role_cost_allocations cho bucket 02.
- sale_related_excluded va management_related_excluded phai duoc hien nhu helper numbers, khong phai item chinh cua bucket 02.

5.3 role_cost_allocations
- Day moi la bang phai dung de boc tach theo role va user.
- Frontend phai group duoc theo bucket_code va role_code.
- usernames phai hien duoc dang danh sach chip hoac text list.
- amount la cot thanh tien chinh.
- formula_snapshot va note khong nen an, phai xem duoc khi expand row hoac drawer detail.

5.4 direct_cost_groups
- Day la cap group summary.
- Khong duoc dung direct_cost_groups de thay cho bang components detail.
- cost_basis_note va note phai hien ro de audit.

5.5 direct_cost_groups.components
- Day la bang chi tiet vat tu va dong chi phi truc tiep.
- item_name, item_code, item_spec, brand_name, source_type, source_ref_label phai duoc uu tien hien thi truoc cac id raw.
- material_id va labor_price_config_id chi la thong tin tham chieu phu.
- quantity_per_unit, expanded_quantity, waste_pct phai hien de giai thich cach mo rong khoi luong.

5.6 journey_role_snapshot
- Day la snapshot nguon audit.
- Frontend khong duoc tu dong suy ra user tu Journey live neu estimate da co snapshot.
- Neu snapshot co du lieu thi uu tien render snapshot, khong render Journey current users de tranh sai audit.

## 6. Yeu cau view mode
- View mode phai show du 8 block neu co du lieu.
- Cho phep collapse cac khoi chi tiet, nhung mac dinh phai thay duoc bucket summary, role cost allocations va mot phan direct cost groups.
- Bang chi tiet vat tu phai hien duoc it nhat cac cot item_code, item_name, item_spec, unit, quantity, unit_price, line_total.
- Bang chi tiet role cost phai hien duoc it nhat bucket_code, role_code, usernames, calc_mode, amount.
- Validation banner phai hien tren cung neu is_feasible la false hoac actual_profit_pct nho hon target_profit_pct_min.

## 7. Yeu cau edit mode
- Edit mode khong duoc chi sua buckets va group summary ma bo qua role_cost_allocations.
- Edit mode phai cho sua journey_role_snapshot neu business cho phep, neu khong thi phai khoa va hien read-only audit.
- Edit mode phai cho sua role_cost_allocations theo dong.
- Edit mode phai cho sua direct_cost_groups va components theo 2 cap.
- Neu UI chua ho tro edit 2 cap cho components, toi thieu phai hien read-only table chi tiet va cho sua summary o group, khong duoc an phan detail.
- Moi payload save phai giu toan ven du lieu moi: labor_breakdown, role_cost_allocations, direct_cost_groups, journey_role_snapshot, validation_result neu co.

## 8. Hanh vi bi cam
- Khong doc hoac render groups legacy.
- Khong map role breakdown tu note string.
- Khong an bang components detail chi vi da co direct_cost_groups summary.
- Khong lay user hien tai tu Journey de de len journey_role_snapshot khi render.
- Khong day logic nay sang Step05.

## 9. De xuat bo cuc UI/UX
- Header sticky nho: code, status, version, policy, total_estimate_cost.
- Hang 1: Journey input snapshot + Journey role snapshot.
- Hang 2: Buckets summary full width.
- Hang 3: Labor breakdown ben trai, Role cost allocations ben phai.
- Hang 4: Direct cost groups summary.
- Hang 5: Bang chi tiet components cua group dang chon hoac accordion tung group.
- Footer: validation va audit trail.

## 10. Tieu chi nghiem thu frontend
- User nhin vao Step04 phai phan biet duoc summary bucket, summary nhan cong, chi phi theo role, va vat tu chi tiet.
- User phai thay duoc vai tro Sale va Quan ly tach rieng, khong bi tron vao bucket 02.
- User phai thay duoc bang vat tu chi tiet voi ten, ma, spec, don gia, thanh tien.
- UI phai uu tien field snapshot moi thay vi suy dien tu id raw.
- Step04 sau khi sua xong khong duoc duplicate Step05.

## 11. Checklist review truoc khi implement
- Query JourneyEstimate DTO da tra ve role_cost_allocations, journey_role_snapshot va toan bo field moi cua components.
- Type frontend da co du cac field moi.
- Hook useJourneyEstimateFlow khong lam roi du lieu moi khi save.
- Step04 render du cac khoi moi.
- Step05 khong render lai phan estimate detail nay.

## 12. Ghi chu cuoi
Tai lieu nay chi la chi dan frontend cho Step04 theo contract moi. No khong yeu cau thay doi schema them nua. Moi implementation tiep theo phai bam sat tai lieu nay va contract core-contracts hien tai. 
