/**
 * Nhãn + tab điều hướng cho WorkTask.actions (đồng bộ preset CustomerJourneySetting).
 */

export const WORK_TASK_ACTION_KEY_LABELS: Record<string, string> = {
    fill_site_address: 'Điền địa chỉ công trình',
    assign_owner_user: 'Gán người phụ trách',
    link_origin_journey: 'Liên kết Journey gốc',
    upload_survey_report: 'Tải biên bản khảo sát',
    upload_site_photos: 'Tải ảnh hiện trạng',
    upload_solution_doc: 'Tải hồ sơ giải pháp',
    upload_business_plan: 'Tải kế hoạch kinh doanh',
    upload_customer_quotation: 'Tải báo giá khách hàng',
    upload_contract: 'Tải hợp đồng',
    upload_payment_receipt: 'Tải chứng từ thanh toán',
    confirm_quote_approved: 'Xác nhận chốt báo giá',
    confirm_final_acceptance: 'Xác nhận nghiệm thu cuối',
};

/** Tab `tab=` trong JourneyDetail360 (và event switch-journey-tab). */
export const WORK_TASK_ACTION_KEY_TO_JOURNEY_TAB: Record<string, string> = {
    fill_site_address: 'GRP_01_INFO',
    assign_owner_user: 'GRP_01_INFO',
    link_origin_journey: 'GRP_01_INFO',
    upload_survey_report: 'GRP_03_SURVEY',
    upload_site_photos: 'GRP_03_SURVEY',
    upload_solution_doc: 'GRP_04_SOLUTION',
    upload_business_plan: 'GRP_04_SOLUTION',
    upload_customer_quotation: 'GRP_05_QUOTE',
    upload_contract: 'GRP_DOCUMENTS',
    confirm_quote_approved: 'GRP_05_QUOTE',
    confirm_final_acceptance: 'GRP_ACCEPTANCE',
    upload_payment_receipt: 'GRP_07_DEPOSIT',
};

export function labelForWorkTaskActionKey(actionKey?: string | null): string {
    if (!actionKey) return 'Thao tác';
    return WORK_TASK_ACTION_KEY_LABELS[actionKey] || actionKey;
}

export function resolveJourneyTabForWorkTaskAction(action: {
    action_key?: string | null;
    action_type?: string | null;
    doc_type?: string | null;
    target_field?: string | null;
}): string | undefined {
    const key = action.action_key;
    if (key && WORK_TASK_ACTION_KEY_TO_JOURNEY_TAB[key]) {
        return WORK_TASK_ACTION_KEY_TO_JOURNEY_TAB[key];
    }
    if (action.action_type === 'require_document') return 'GRP_DOCUMENTS';
    if (action.action_type === 'require_journey_field') return 'GRP_01_INFO';
    if (action.action_type === 'require_status_equals') return 'GRP_05_QUOTE';
    return undefined;
}
