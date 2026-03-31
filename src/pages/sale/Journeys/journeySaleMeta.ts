export interface JourneySelectOption {
    value: string;
    label: string;
}

export const JOURNEY_PRIORITY_OPTIONS: JourneySelectOption[] = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
    { value: 'critical', label: 'Khẩn cấp' },
];

export const JOURNEY_GO_NO_GO_OPTIONS: JourneySelectOption[] = [
    { value: 'draft', label: 'Nháp' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'go', label: 'Tiếp tục' },
    { value: 'no_go', label: 'Không tiếp tục' },
    { value: 'on_hold', label: 'Tạm hoãn' },
];

export const JOURNEY_SLA_OPTIONS: JourneySelectOption[] = [
    { value: 'on_time', label: 'Đúng hạn' },
    { value: 'at_risk', label: 'Có rủi ro' },
    { value: 'overdue', label: 'Trễ hạn' },
];

export const JOURNEY_SOURCE_CHANNEL_OPTIONS: JourneySelectOption[] = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'hotline', label: 'Hotline' },
    { value: 'referral', label: 'Giới thiệu' },
    { value: 'direct', label: 'Trực tiếp' },
];

export const JOURNEY_SURVEY_STATUS_OPTIONS: JourneySelectOption[] = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'scheduled', label: 'Đã đặt lịch' },
    { value: 'in_progress', label: 'Đang khảo sát' },
    { value: 'completed', label: 'Hoàn thành' },
];

export const JOURNEY_QUOTE_STATUS_OPTIONS: JourneySelectOption[] = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'draft', label: 'Nháp' },
    { value: 'sent', label: 'Đã gửi' },
    { value: 'approved', label: 'Đã duyệt' },
];

export const JOURNEY_PROJECT_STATUS_OPTIONS: JourneySelectOption[] = [
    { value: 'not_started', label: 'Chưa bắt đầu' },
    { value: 'active', label: 'Đang triển khai' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
];

export const JOURNEY_STEP_OPTIONS: JourneySelectOption[] = [
    { value: 'lead_intake', label: 'Tiếp nhận lead' },
    { value: 'qualification', label: 'Sàng lọc nhu cầu' },
    { value: 'survey_planning', label: 'Lập lịch khảo sát' },
    { value: 'site_survey', label: 'Khảo sát hiện trạng' },
    { value: 'survey_review', label: 'Review khảo sát' },
    { value: 'estimate_preparation', label: 'Lập dự toán nội bộ' },
    { value: 'quotation_preparation', label: 'Soạn báo giá' },
    { value: 'quotation_sent', label: 'Gửi báo giá' },
    { value: 'quotation_approved', label: 'Chốt báo giá' },
    { value: 'contract_signing', label: 'Ký hợp đồng' },
    { value: 'project_execution', label: 'Triển khai thi công' },
    { value: 'handover_acceptance', label: 'Nghiệm thu / bàn giao' },
    { value: 'warranty_aftercare', label: 'Bảo hành / chăm sóc sau bàn giao' },
];

export const JOURNEY_SLA_META: Record<string, { label: string; color: string; background: string }> = {
    on_time: { label: 'Đúng hạn', color: '#2f855a', background: '#f0fff4' },
    at_risk: { label: 'Có rủi ro', color: '#b7791f', background: '#fffaf0' },
    overdue: { label: 'Trễ hạn', color: '#c53030', background: '#fff5f5' },
};

export const JOURNEY_PRIORITY_META: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: '#8c8c8c' },
    medium: { label: 'Trung bình', color: '#1677ff' },
    high: { label: 'Cao', color: '#fa8c16' },
    critical: { label: 'Khẩn cấp', color: '#cf1322' },
};

export const JOURNEY_STEP_META: Record<string, { label: string; color: string }> = {
    lead_intake: { label: 'Tiếp nhận lead', color: '#6b7280' },
    qualification: { label: 'Sàng lọc nhu cầu', color: '#0891b2' },
    survey_planning: { label: 'Lập lịch khảo sát', color: '#2563eb' },
    site_survey: { label: 'Khảo sát hiện trạng', color: '#f59e0b' },
    survey_review: { label: 'Review khảo sát', color: '#8b5cf6' },
    estimate_preparation: { label: 'Lập dự toán nội bộ', color: '#4f46e5' },
    quotation_preparation: { label: 'Soạn báo giá', color: '#0f766e' },
    quotation_sent: { label: 'Gửi báo giá', color: '#0284c7' },
    quotation_approved: { label: 'Chốt báo giá', color: '#16a34a' },
    contract_signing: { label: 'Ký hợp đồng', color: '#15803d' },
    project_execution: { label: 'Triển khai thi công', color: '#ea580c' },
    handover_acceptance: { label: 'Nghiệm thu / bàn giao', color: '#2563eb' },
    warranty_aftercare: { label: 'Bảo hành / chăm sóc sau bàn giao', color: '#dc2626' },
};

export const JOURNEY_EMPTY_VALUE = 'Chưa cập nhật';

export const getOptionLabel = (options: JourneySelectOption[], value?: string | null): string => {
    if (!value) {
        return JOURNEY_EMPTY_VALUE;
    }

    const found = options.find((option) => option.value === value);
    return found?.label || value;
};

export const getJourneyStepLabel = (value?: string | null): string =>
    value ? JOURNEY_STEP_META[value]?.label || value : JOURNEY_EMPTY_VALUE;

export const getJourneyPriorityLabel = (value?: string | null): string =>
    value ? JOURNEY_PRIORITY_META[value]?.label || value : JOURNEY_EMPTY_VALUE;

export const getJourneySlaLabel = (value?: string | null): string =>
    value ? JOURNEY_SLA_META[value]?.label || value : JOURNEY_EMPTY_VALUE;

export const formatJourneyDate = (value?: string | Date | null, includeTime = false): string => {
    if (!value) {
        return JOURNEY_EMPTY_VALUE;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return JOURNEY_EMPTY_VALUE;
    }

    return includeTime
        ? date.toLocaleString('vi-VN')
        : date.toLocaleDateString('vi-VN');
};
