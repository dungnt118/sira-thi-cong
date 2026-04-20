import type { IndexedContentItem } from 'types/apis';

// ============================================================
// Phase 1 â€“ Customer Journey Types
// ============================================================

// --- Status Types ---
export type GoNoGoStatus = 'draft' | 'go' | 'no_go' | 'on_hold' | 'pending';
export type SlaStatus = 'ontime' | 'at_risk' | 'overdue';
export type PortalPublishStatus = 'hidden' | 'partial' | 'published';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export type SurveyStatusType = 'not_started' | 'scheduled' | 'in_progress' | 'completed';
export type EstimateStatusType = 'not_started' | 'draft' | 'ready';
export type QuoteStatusType = 'not_started' | 'draft' | 'sent' | 'approved';
export type ProjectStatusType = 'not_started' | 'active' | 'completed' | 'cancelled';

// --- Journey Step Definition (Template) ---
export interface RoleConfiguration {
    roleId: string;
    isKeyRole: boolean; // Acts as "Finalizer" (authority to close step)
    isEditable: boolean; // Acts as "Editor" (authority to modify content)
    slaHours: number;
    dependencyRole?: string | null;
    instructions?: string;
    checklists?: string[];
}

export interface JourneyStepDef {
    step_code: string;
    step_name: string;
    step_order: number;
    step_goal: string;
    standardProcedureGroupCd?: string;
    roleConfigurations?: RoleConfiguration[];
    publish_flag: boolean;

    // Legacy fields
    participant_roles?: string[];
    owner_role?: string;
    checklist_refs?: string[];
    process_refs?: string[];
    entry_criteria?: string;
    exit_criteria?: string;
    sla_hours?: number;
    escalation_rule?: string;
}

// --- Journey Template ---
export interface JourneyTemplate {
    id: string;
    template_code: string;
    template_name: string;
    service_type: string;
    description?: string;
    is_default: boolean;
    version_label: string;
    status: 'draft' | 'active' | 'inactive';
    steps: JourneyStepDef[];
    created_at: string;
    updated_at: string;
}

// --- Journey Activity (log entry) ---
// Log UI/legacy trong app; nghiá»‡p vá»¥ audit chuáº©n trÃªn BAC dÃ¹ng JourneyStepLog (vÃ  history trÃªn chá»©ng tá»« nhÆ° StockOrder).
// KhÃ´ng phá»¥ thuá»™c schema ActivityEvent (Ä‘Ã£ loáº¡i bá» / deprecated trÃªn tenant hiá»‡n táº¡i).
export interface JourneyActivity {
    id: string;
    journey_id: string;
    activity_actor: string;
    activity_action: string;
    activity_context: string;
    activity_time: string;
    activity_summary: string;
    category?: string;
    related_entity_id?: string;
    related_entity_type?: string;
}

// --- Portal Thread ---
export interface PortalMessage {
    id: string;
    thread_id: string;
    sender: string;
    sender_role: 'customer' | 'QL' | 'KD' | 'ADMIN' | 'GS' | 'KYT' | 'KT';
    message_body: string;
    attachments?: string[];
    official_response?: boolean;
    sent_at: string;
}

export interface PortalThread {
    thread_id: string;
    journey_id: string;
    context_type: 'survey' | 'progress' | 'payment' | 'general' | 'quotation';
    context_label: string;
    status: 'open' | 'waiting' | 'closed';
    last_message_at?: string;
    unread_count: number;
    messages: PortalMessage[];
}

// --- Survey Record ---
export interface SurveyArea {
    area_name: string;
    area_type?: string;
    current_condition: string;
    measurement_notes?: string;
    moisture_value?: number;
    media_files?: string[];
}

export interface RiskFlag {
    material_risk?: string[];
    labor_risk?: string[];
    time_risk?: string[];
    access_risk?: string[];
    risk_note?: string;
}

export interface SurveyRecord {
    id: string;
    journey_id: string;
    survey_date: string;
    surveyor_name: string;
    customer_name: string;
    site_address: string;
    area_list: SurveyArea[];
    proposed_solution?: string;
    labor_need_note?: string;
    material_need_note?: string;
    risk_flags: RiskFlag;
    giam_sat_signature?: string;
    customer_signature?: string;
    submitted_at?: string;
    review_status: 'pending' | 'reviewed' | 'need_update' | 'approved';
    scheduled_date?: string;
    scheduled_time?: string;
    giam_sat_user?: string;
    meeting_address?: string;
    contact_name?: string;
    contact_phone?: string;
}

export interface IncidentReport {
    id: string;
    journeyId: string;
    type: 'MATERIAL_SHORTAGE' | 'TECHNICAL' | 'WEATHER' | 'EQUIPMENT' | 'SAFETY' | 'OTHER';
    description: string;
    severity: 'NORMAL' | 'URGENT';
    images: string[];
    reportedAt: string;
    reportedBy: string;
    pmReply?: string;
    isResolved: boolean;
    resolvedAt?: string;
}

export type StepStatus = 'LOCKED' | 'OPEN' | 'IN_PROGRESS' | 'AWAITING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface StepEvidence {
    id: string;
    url: string;
    thumbnailUrl?: string;
    uploadedAt: string;
    uploadedBy: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    pmFeedback?: string;
}

export interface JourneyChecklistStep {
    id: string;
    templateStepId: string;
    order: number;
    name: string;
    description: string;
    minPhotos: number;
    status: StepStatus;
    completedAt?: string;
    completedBy?: string;
    evidences: StepEvidence[];
    notes?: string;
}

// --- Journey (main aggregate) ---
export interface Journey {
    // FG-01 Header
    journey_code: string;
    id: string;
    service_request_code: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    site_address?: string;
    source_channel: 'MKT' | 'hotline' | 'referral' | 'direct';
    serviceTypeId?: string;
    idx_serviceTypeId?: IndexedContentItem;
    service_type?: string;
    // requested_service: removed
    request_title: string;
    request_description?: string;
    owner_user: string;
    /** Lookup đầy đủ khi API trả enriched reference (hiển thị tên PM) */
    idx_owner_user?: IndexedContentItem;
    priority: PriorityLevel;
    current_step: string;
    current_step_code: string;
    go_no_go_status: GoNoGoStatus;
    go_no_go_summary?: string;
    sla_status: SlaStatus;
    portal_publish_status: PortalPublishStatus;
    last_activity_at: string;
    created_at: string;
    created_by: string;
    urgency?: string;

    // FG-03 Summary fields
    survey_status: SurveyStatusType;
    estimate_status: EstimateStatusType;
    quote_status: QuoteStatusType;
    project_status: ProjectStatusType;
    next_milestone?: string;
    blocker_count: number;
    unread_portal_threads: number;

    // Tab 2 - Survey
    latest_survey_at?: string;
    surveyor_name?: string;
    area_count?: number;
    survey_media_count?: number;
    moisture_summary?: string;
    current_condition_summary?: string;
    proposed_solution_summary?: string;
    field_risk_summary?: string;
    labor_need_note?: string;
    material_need_note?: string;

    // Tab 3 - Estimate
    estimate_version_no?: number;
    estimated_cost_total?: number;
    estimated_margin_pct?: number;
    labor_estimate_total?: number;
    material_estimate_total?: number;
    transport_estimate_total?: number;
    scaffold_estimate_total?: number;

    // Tab 4 - Quotation/Contract
    quotation_status?: string;
    quotation_version_no?: number;
    quotation_total?: number;
    quotation_sent_at?: string;
    contract_status?: string;
    contract_no?: string;
    signature_status?: string;
    deposit_status?: string;

    // Tab 5 - Labor/Resources
    supervisor_name?: string;
    workforce_plan_status?: string;
    internal_team_count?: number;
    outsource_required?: boolean;
    labor_risk_summary?: string;
    tentative_start_date?: string;
    tentative_duration_days?: number;

    // Tab 6 - Project
    project_code?: string;
    plan_start?: string;
    plan_end?: string;
    progress_pct?: number;
    blocked_task_count?: number;
    latest_incident_summary?: string;

    // Tab 7 - Materials
    material_need_status?: string;
    key_material_summary?: string;
    procurement_alert_count?: number;
    asset_need_summary?: string;
    stock_risk_summary?: string;

    // Tab 8 - Payment
    milestone_count?: number;
    next_milestone_name?: string;
    next_milestone_due?: string;
    total_contract_value?: number;
    collected_amount?: number;
    outstanding_amount?: number;
    last_payment_note?: string;

    // Tab 9 - Activity log
    activities: JourneyActivity[];

    incident_count?: number;
    open_incident_count?: number;
    latest_incident_type?: string;
    latest_incident_status?: string;
    change_request_count?: number;

    // Tab 10.5 - Field Execution Data (mock purposes)
    work_steps?: JourneyChecklistStep[];
    incidents?: IncidentReport[];

    // Tab 11 - Documents
    document_count?: number;
    missing_document_count?: number;
    latest_document_type?: string;
    latest_document_status?: string;

    // Tab 12 - Portal/Chat
    published_step_count?: number;
    thread_count?: number;
    unread_thread_count?: number;
    latest_thread_context?: string;
    latest_thread_status?: string;

    // Portal token
    portal_token?: string;
    template_id?: string;
}

// --- Action Center Item ---
export type ActionType = 'step_overdue' | 'survey_waiting' | 'portal_unread' | 'publish_pending' | 'blocked' | 'active_all';

export interface ActionItem {
    id: string;
    action_type: ActionType;
    journey_code: string;
    customer_name: string;
    current_step: string;
    priority: PriorityLevel;
    due_at?: string;
    start_at?: string;
    owner_user: string;
    source_tab?: string;
    journey_id: string;
    progress_pct?: number;
}

