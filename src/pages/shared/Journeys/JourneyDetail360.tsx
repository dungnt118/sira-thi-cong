import {
    ArrowLeftOutlined,
    AuditOutlined,
    BoxPlotOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    CarryOutOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    FlagOutlined,
    FormOutlined,
    HistoryOutlined,
    MessageOutlined,
    NodeIndexOutlined,
    PaperClipOutlined,
    PartitionOutlined,
    RocketOutlined,
    SendOutlined,
    ShopOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined,
    MenuOutlined,
    DownOutlined
} from '@ant-design/icons';
import {
    Alert,
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Grid,
    Input,
    InputNumber,
    Menu,
    message,
    Modal,
    Row,
    Select,
    Switch,
    Space,
    Steps,
    Spin,
    Tabs, Tag,
    Tooltip,
    Typography,
    Progress
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ContentConversationPanel, type ChatPanelLayoutMode } from '../../../components/chatbox';
import { CreateJourneyDocumentModal } from '../../../components/journey/CreateJourneyDocumentModal';
import { CreateSiteReportModal } from '../../../components/journey/CreateSiteReportModal';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import PortalDashboard from '../../../components/portal/PortalDashboard';
import { useAuth } from '../../../hooks/useAuth';
import { customerJourneySettingService } from '../../../services/core-contracts/services/customerJourneySetting.service';
import { employeeService } from '../../../services/core-contracts/services/employee.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { journeyStepLogService } from '../../../services/core-contracts/services/journeyStepLog.service';
import { siteReportService } from '../../../services/core-contracts/services/siteReport.service';
import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import {
    IChecklistItem,
    ICustomerJourneySetting,
    IRolesItem,
    IStepsItem,
} from '../../../services/core-contracts/types/customerJourneySetting.types';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import { JourneyStepRenderer, StepLabor, StepMaterials, Step04SolutionOrchestration } from '../JourneySteps';

import { AuthorizedUserSelect } from '../../../components/authorizedusers/AuthorizedUser';
import { MasterDataSelect } from '../../../components/common/MasterDataSelect';
import { JourneyDocumentsTab } from '../../../components/journey/JourneyDocumentsTab';
import JourneyUpsertDrawer from '../../../components/journey/JourneyUpsertDrawer';
import { StepWorkTaskList } from '../../../components/journey/StepWorkTaskList';
import { WorkTaskActionModals, type WorkTaskActionDialogContext } from '../../../components/journey/WorkTaskActionModals';
import type { TaskActionClickPayload } from '../../../utils/workTaskActionGroups';
import {
    confirmAdvanceJourneyStep,
    JOURNEY_STEP_SEQUENCE,
    headerStepKeyToStandardProcedureGroupCd
} from '../../../utils/journeyStepConfirmation';
import { mockJourneyTemplates } from '../../../data/journeyMockData';
import { journeyDocumentService } from '../../../services/core-contracts/services/journeyDocument.service';
import { IJourneyDocument } from '../../../services/core-contracts/types/journeyDocument.types';
import { IJourneyStepLog } from '../../../services/core-contracts/types/journeyStepLog.types';
import { resolveJourneyTabForWorkTaskAction } from '../../../constants/workTaskActionUx';
import type { IActionsItem, ICreateWorkTaskInput, WorkTaskAssigneeRoleEnum2 } from '../../../services/core-contracts/types/workTask.types';
import { IWorkTask } from '../../../services/core-contracts/types/workTask.types';
import type { GoNoGoStatus, PortalPublishStatus, SlaStatus } from '../../../types/journey';

const { Text, Title } = Typography;
const { TextArea } = Input;

import {
    HEADER_STEP_CONFIG,
    JourneyHistoryModal,
    SLA_CONFIG
} from './components/JourneyHistoryModal';

const WORKTASK_ASSIGNEE_ROLES: WorkTaskAssigneeRoleEnum2[] = ['QL', 'GS', 'KYT', 'KT', 'HC', 'KD', 'ADMIN'];

const JOURNEY_ASSIGNMENT_HINT_BY_ROLE: Record<WorkTaskAssigneeRoleEnum2, string> = {
    QL: 'Phân công Quản lý dự án (PM) trên công trình.',
    KD: 'Gán Kinh doanh phụ trách (sale_users) trên hồ sơ / công trình.',
    GS: 'Phân công Giám sát trên công trình.',
    KYT: 'Phân công Kỹ thuật trên công trình.',
    KT: 'Gán chủ sở hữu / người phụ trách (owner_user) trên công trình.',
    HC: 'Gán chủ sở hữu / người phụ trách (owner_user) trên công trình.',
    ADMIN: 'Cần có PM (pm_user) hoặc chủ sở hữu (owner_user) trên công trình.',
};

/** Bỏ dấu + gom khoảng trắng để map nhãn tiếng Việt / mã vai trò. */
const normalizeRoleToken = (raw: string): { spaced: string; compact: string } => {
    const spaced = raw
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
    return { spaced, compact: spaced.replace(/\s/g, '') };
};

/** Đồng nghĩa nhãn hiển thị / biến thể → mã WorkTask (KD, QL, …). */
const CHECKLIST_ROLE_SYNONYM_TO_CODE: Record<string, WorkTaskAssigneeRoleEnum2> = {
    KD: 'KD',
    KINHDOANH: 'KD',
    'KINH DOANH': 'KD',
    QL: 'QL',
    QUANLY: 'QL',
    'QUAN LY': 'QL',
    QUANLYDUAN: 'QL',
    'QUAN LY DU AN': 'QL',
    GS: 'GS',
    GIAMSAT: 'GS',
    'GIAM SAT': 'GS',
    KYT: 'KYT',
    KYTHUAT: 'KYT',
    'KY THUAT': 'KYT',
    KT: 'KT',
    KETHUAN: 'KT',
    'KE TOAN': 'KT',
    HC: 'HC',
    HANHCHINH: 'HC',
    'HANH CHINH': 'HC',
    ADMIN: 'ADMIN',
};

const normalizeChecklistAssigneeRole = (role: unknown): WorkTaskAssigneeRoleEnum2 | null => {
    if (role == null || role === '') return null;
    const { spaced, compact } = normalizeRoleToken(String(role));
    if (WORKTASK_ASSIGNEE_ROLES.includes(spaced as WorkTaskAssigneeRoleEnum2)) {
        return spaced as WorkTaskAssigneeRoleEnum2;
    }
    if (WORKTASK_ASSIGNEE_ROLES.includes(compact as WorkTaskAssigneeRoleEnum2)) {
        return compact as WorkTaskAssigneeRoleEnum2;
    }
    return CHECKLIST_ROLE_SYNONYM_TO_CODE[spaced] ?? CHECKLIST_ROLE_SYNONYM_TO_CODE[compact] ?? null;
};

/** Lấy role từ checklist: field `role` hoặc title từ idx_role (một số bản ghi GraphQL). */
const extractChecklistItemRole = (item: IChecklistItem & { idx_role?: { title?: string } }): unknown => {
    if (item.role != null && String(item.role).trim() !== '') {
        return item.role;
    }
    const t = item.idx_role?.title;
    if (t != null && String(t).trim() !== '') {
        return t;
    }
    return null;
};

/** Một user đại diện (id/chuỗi lưu trên Journey) theo mã vai trò checklist → WorkTask.assignee */
const getPrimaryJourneyAssigneeForRole = (journey: IJourney, assigneeRole: WorkTaskAssigneeRoleEnum2): string | undefined => {
    const first = (value: unknown): string | undefined => toUserList(value)[0];
    switch (assigneeRole) {
        case 'QL':
            return first(journey.pm_user);
        case 'KD':
            return first(journey.sale_users);
        case 'GS':
            return first(journey.supervisor_users);
        case 'KYT':
            return first(journey.technical_users);
        case 'KT':
        case 'HC':
            return first(journey.owner_user);
        case 'ADMIN':
            return first(journey.pm_user) ?? first(journey.owner_user);
        default:
            return undefined;
    }
};

const journeyStepLabel = (stepCode: string) => HEADER_STEP_CONFIG.find((s) => s.key === stepCode)?.label || stepCode;

type BuildWorkTasksResult =
    | { ok: true; tasks: ICreateWorkTaskInput[]; skippedRoles?: WorkTaskAssigneeRoleEnum2[] }
    | {
        ok: false;
        missingRoleOnChecklist: string[];
        missingAssigneeByRole: Map<WorkTaskAssigneeRoleEnum2, string>;
    }
    | { ok: false; reason: 'no_setting' | 'no_tasks' };

/** Clone mảng actions từ checklist (CustomerJourneySetting) → payload WorkTask. */
const cloneChecklistActionsToWorkTaskPayload = (
    actions?: IChecklistItem['actions']
): ICreateWorkTaskInput['actions'] => {
    if (!actions?.length) return undefined;
    return actions.map((a) => ({
        action_key: a.action_key,
        action_type: a.action_type,
        target_field: a.target_field,
        expected_value: a.expected_value,
        doc_type: a.doc_type,
        min_count: a.min_count,
        note: a.note,
    }));
};

/** Dựng payload WorkTask từ CustomerJourneySetting + journey (đã gộp form phân công). */
const buildWorkTasksFromSetting = (
    setting: ICustomerJourneySetting | null,
    journeyId: string,
    journey: IJourney
): BuildWorkTasksResult => {
    if (!setting?.steps?.length) {
        return { ok: false, reason: 'no_setting' };
    }

    const tasksToCreate: ICreateWorkTaskInput[] = [];
    const missingRoleOnChecklist: string[] = [];
    const missingAssigneeByRole = new Map<WorkTaskAssigneeRoleEnum2, string>();
    for (const stepConfig of setting.steps) {
        /** Cùng semantics với CustomerJourneySettingPage: thiếu field = coi như bật. */
        if (stepConfig.is_enabled === false || !stepConfig.checklist?.length) {
            continue;
        }
        const stepLabel = journeyStepLabel(String(stepConfig.step_code || ''));
        for (const item of stepConfig.checklist) {
            const assigneeRole = normalizeChecklistAssigneeRole(extractChecklistItemRole(item));
            if (!assigneeRole) {
                missingRoleOnChecklist.push(
                    `${stepLabel} — «${item.name || 'Nhiệm vụ'}»: thiếu vai trò (role) trên checklist`
                );
                continue;
            }
            const assignee = getPrimaryJourneyAssigneeForRole(journey, assigneeRole);
            if (!assignee) {
                if (!missingAssigneeByRole.has(assigneeRole)) {
                    missingAssigneeByRole.set(assigneeRole, JOURNEY_ASSIGNMENT_HINT_BY_ROLE[assigneeRole]);
                }
                continue;
            }
            tasksToCreate.push({
                journey_id: journeyId,
                journey_step_code: stepConfig.step_code as ICreateWorkTaskInput['journey_step_code'],
                title: item.name,
                description: item.description,
                is_required: item.is_required,
                status: 'pending',
                assignee_role: assigneeRole,
                assignee,
                actions: cloneChecklistActionsToWorkTaskPayload(item.actions),
            });
        }
    }

    if (missingRoleOnChecklist.length > 0) {
        return { ok: false, missingRoleOnChecklist, missingAssigneeByRole: new Map() };
    }
    if (tasksToCreate.length === 0) {
        return { ok: false, reason: 'no_tasks' };
    }
    // Proceed even when some roles have no assignee — skip those tasks and warn.
    return {
        ok: true,
        tasks: tasksToCreate,
        skippedRoles: missingAssigneeByRole.size > 0 ? [...missingAssigneeByRole.keys()] : undefined,
    };
};

const GO_NO_GO_CONFIG: Record<GoNoGoStatus, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    go: { label: 'Tiếp tục ✓', color: 'success' },
    no_go: { label: 'Dừng ✗', color: 'error' },
    on_hold: { label: 'Tạm hoãn', color: 'warning' },
    pending: { label: 'Chờ duyệt', color: 'processing' },
};
const PORTAL_CONFIG: Record<PortalPublishStatus, { label: string; color: string }> = {
    hidden: { label: 'Ẩn', color: 'default' },
    partial: { label: 'Một phần', color: 'blue' },
    published: { label: 'Đã publish', color: 'success' },
};

// HEADER_STEP_CONFIG is imported from shared components

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ', color: 'orange' },
    finished: { label: 'Xong', color: 'success' },
    skipped: { label: 'Bỏ qua', color: 'error' }
};

/** QL / PM: activeRole hoặc danh sách role context BAC (`availableRoles`). */
function hasRoleQlOrPm(role: string | null | undefined, availableRoles: string[] | undefined): boolean {
    const tokens: string[] = [...(availableRoles ?? []).map((r) => String(r).trim().toUpperCase())];
    if (role != null && String(role).trim()) {
        tokens.push(String(role).trim().toUpperCase());
    }
    return tokens.some((c) => c === 'QL' || c === 'PM');
}

const toUserList = (value: unknown): string[] => {
    if (!value) {
        return [];
    }

    const pickId = (item: unknown): string | null => {
        if (item == null || item === '') {
            return null;
        }
        if (typeof item === 'string' || typeof item === 'number') {
            const s = String(item).trim();
            return s.length > 0 ? s : null;
        }
        if (typeof item === 'object') {
            const o = item as Record<string, unknown>;
            const candidates = [o.username, o.userName, o.code, o._id, o.id];
            for (const c of candidates) {
                if (c == null || c === '') continue;
                const s = String(c).trim();
                if (s.length > 0) return s;
            }
        }
        return null;
    };

    if (Array.isArray(value)) {
        return value.map(pickId).filter((s): s is string => Boolean(s));
    }

    const one = pickId(value);
    return one ? [one] : [];
};

/** Thứ tự bước từ enum StepsStepCodeEnum */
const CUSTOMER_JOURNEY_SETTING_STEP_CODES = [
    'lead_new',
    'consult_contact',
    'site_survey',
    'solution_design',
    'quotation',
    'contract',
    'execution',
    'final_acceptance',
    'payment',
    'maintenance',
    'warranty',
    'after_sales'
] as const;

type JourneyHeaderStepCode = (typeof CUSTOMER_JOURNEY_SETTING_STEP_CODES)[number];

type JourneyTabAccessRule = {
    key: string;
    minStepCode: JourneyHeaderStepCode;
    currentStepCode?: JourneyHeaderStepCode;
    roleGroupCode?: string;
    alternateRoleGroupCodes?: string[];
    alwaysVisible?: boolean;
};

const JOURNEY_STEP_ORDER_INDEX = CUSTOMER_JOURNEY_SETTING_STEP_CODES.reduce<Record<string, number>>((acc, code, index) => {
    acc[code] = index;
    return acc;
}, {});

/** Quan hệ tích lũy giữa current_step của Journey và tab chức năng trên màn hình 360. */
const JOURNEY_TAB_ACCESS_RULES: JourneyTabAccessRule[] = [
    { key: 'GRP_01_INFO', minStepCode: 'lead_new', currentStepCode: 'lead_new', roleGroupCode: 'GRP_01_INFO', alwaysVisible: true },
    { key: 'GRP_02_CONTACT', minStepCode: 'lead_new', currentStepCode: 'consult_contact', roleGroupCode: 'GRP_02_CONTACT', alwaysVisible: true },
    { key: 'GRP_DOCUMENTS', minStepCode: 'lead_new', alwaysVisible: true },
    { key: 'GRP_08_CONSTRUCT', minStepCode: 'lead_new', alwaysVisible: true, currentStepCode: 'execution', roleGroupCode: 'GRP_08_CONSTRUCT' },
    { key: 'GRP_03_SURVEY', minStepCode: 'site_survey', currentStepCode: 'site_survey', roleGroupCode: 'GRP_03_SURVEY' },
    { key: 'GRP_04_SOLUTION', minStepCode: 'solution_design', currentStepCode: 'solution_design', roleGroupCode: 'GRP_04_SOLUTION' },
    { key: 'GRP_ESTIMATE', minStepCode: 'solution_design', roleGroupCode: 'GRP_05_QUOTE', alwaysVisible: true },
    { key: 'GRP_LABOR', minStepCode: 'quotation', roleGroupCode: 'GRP_05_QUOTE' },
    { key: 'GRP_MATERIALS', minStepCode: 'quotation', roleGroupCode: 'GRP_05_QUOTE' },
    { key: 'GRP_05_QUOTE', minStepCode: 'quotation', currentStepCode: 'quotation', roleGroupCode: 'GRP_05_QUOTE' },
    { key: 'GRP_06_CONTRACT', minStepCode: 'contract', currentStepCode: 'contract', roleGroupCode: 'GRP_06_CONTRACT' },
    { key: 'GRP_07_DEPOSIT', minStepCode: 'contract', roleGroupCode: 'GRP_07_DEPOSIT' },
    { key: 'GRP_ACCEPTANCE', minStepCode: 'final_acceptance', currentStepCode: 'final_acceptance', roleGroupCode: 'GRP_09_ACCEPTANCE', alternateRoleGroupCodes: ['GRP_08_CONSTRUCT'] },
    { key: 'GRP_10_PAYMENT', minStepCode: 'payment', currentStepCode: 'payment', roleGroupCode: 'GRP_10_PAYMENT' },
    { key: 'GRP_11_MAINTAIN', minStepCode: 'maintenance', currentStepCode: 'maintenance', roleGroupCode: 'GRP_11_MAINTAIN' },
    { key: 'GRP_12_WARRANTY', minStepCode: 'warranty', currentStepCode: 'warranty', roleGroupCode: 'GRP_12_WARRANTY' },
    { key: 'GRP_13_CARE', minStepCode: 'after_sales', currentStepCode: 'after_sales', roleGroupCode: 'GRP_13_CARE' },
];

/** Ánh xạ các tab được ưu tiên (highlight) theo từng bước hiện tại của Journey. */
const STEP_PRIORITY_TABS: Record<string, string[]> = {
    lead_new: ['GRP_01_INFO'],
    consult_contact: ['GRP_02_CONTACT'],
    site_survey: ['GRP_03_SURVEY'],
    solution_design: ['GRP_04_SOLUTION'],
    quotation: ['GRP_ESTIMATE', 'GRP_05_QUOTE'],
    contract: ['GRP_06_CONTRACT', 'GRP_07_DEPOSIT'],
    execution: ['GRP_08_CONSTRUCT'],
    final_acceptance: ['GRP_ACCEPTANCE'],
    payment: ['GRP_10_PAYMENT'],
    maintenance: ['GRP_11_MAINTAIN'],
    warranty: ['GRP_12_WARRANTY'],
    after_sales: ['GRP_13_CARE'],
};

const getJourneyStepOrderIndex = (stepCode: string | null | undefined): number => {
    if (!stepCode) return -1;
    return JOURNEY_STEP_ORDER_INDEX[String(stepCode)] ?? -1;
};

const isJourneyTabUnlockedByStep = (rule: JourneyTabAccessRule, currentStepIndex: number): boolean => {
    if (rule.alwaysVisible) return true;
    if (currentStepIndex < 0) return false;
    return getJourneyStepOrderIndex(rule.minStepCode) <= currentStepIndex;
};

const getPrimaryJourneyTabForStep = (stepCode: string | null | undefined): string => {
    const rule = JOURNEY_TAB_ACCESS_RULES.find((item) => item.currentStepCode === stepCode);
    return rule?.key || 'GRP_01_INFO';
};


const DOCUMENT_PERMISSION_VALUES = new Set(['edit', 'submit', 'commit']);

const normalizeRoleKey = (value: string | undefined) => (value || '').trim().toUpperCase();

type JourneyUserRoleConfig = {
    allowedGroupCodes: string[];
    editableGroupCodes: string[];
    finalizableGroupCodes: string[];
};

const canJourneyTabPassRole = (
    rule: JourneyTabAccessRule,
    userRoleConfig: JourneyUserRoleConfig,
    currentRole: string | null | undefined,
    isPmManager: boolean
): boolean => {
    if (rule.key === 'GRP_01_INFO' || rule.key === 'GRP_DOCUMENTS' || rule.key === 'GRP_08_CONSTRUCT') return true;
    if (isPmManager) return true;

    const activeRole = normalizeRoleKey(currentRole == null ? undefined : String(currentRole));
    if ((rule.key === 'GRP_LABOR' || rule.key === 'GRP_MATERIALS') && activeRole === 'KD') {
        return true;
    }

    const roleGroupCodes = [rule.roleGroupCode, ...(rule.alternateRoleGroupCodes ?? [])].filter((code): code is string => Boolean(code));
    if (!roleGroupCodes.length) return true;
    return roleGroupCodes.some((groupCode) => userRoleConfig.allowedGroupCodes.includes(groupCode));
};

const getSettingStepPayload = (setting: ICustomerJourneySetting | null, stepCode: string): IStepsItem | null => {
    if (!setting?.steps) {
        return null;
    }
    return setting.steps.find(s => s.step_code === stepCode) || null;
};


const permissionsAllowDocumentActions = (permissions: string[] | undefined): boolean => {
    if (!permissions?.length) {
        return false;
    }

    return permissions.some((permission) => DOCUMENT_PERMISSION_VALUES.has(String(permission).toLowerCase().trim()));
};

const hasRoleDocumentPermissionFromStepRoles = (roles: IRolesItem[] | undefined, userRole: string | undefined): boolean => {
    if (!roles?.length || !userRole) {
        return false;
    }

    const target = normalizeRoleKey(userRole);
    const row = roles.find((item) => {
        const code = (item.role || (item.idx_role as { title?: string } | undefined)?.title || '').toString().trim();
        if (!code) {
            return false;
        }

        return normalizeRoleKey(code) === target || code === userRole;
    });

    return row ? permissionsAllowDocumentActions(row.permissions) : false;
};

// formatDuration is imported from shared components

const JourneyDetail360: React.FC = () => {
    // Support both :journeyId and :id param names for backward compat across all role routes
    const params = useParams<{ journeyId?: string; id?: string }>();
    const journeyId = params.journeyId || params.id;
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'GRP_01_INFO';
    const navigate = useNavigate();
    const { role, isAdmin, user, availableRoles } = useAuth();
    /** PM trong app = mã QL (route /admin/ql); nhận thêm từ `availableRoles` khi `role` chưa sync. */
    const isPmManager =
        isAdmin ||
        (typeof role === 'string' && ['QL', 'PM'].includes(role.trim().toUpperCase())) ||
        hasRoleQlOrPm(typeof role === 'string' ? role : role != null ? String(role) : undefined, availableRoles);

    const [journey, setJourney] = useState<IJourney | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
    const [workTasks, setWorkTasks] = useState<IWorkTask[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [currentStepLog, setCurrentStepLog] = useState<IJourneyStepLog | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [selectedTaskStepCode, setSelectedTaskStepCode] = useState<string | null>(null);
    const [workTaskActionContext, setWorkTaskActionContext] = useState<WorkTaskActionDialogContext>(null);
    const [reportCountByTask, setReportCountByTask] = useState<Record<string, number>>({});
    const [journeyDocuments, setJourneyDocuments] = useState<IJourneyDocument[]>([]);

    const fetchJourney = async () => {
        if (!journeyId) return;
        setIsLoading(true);
        try {
            const data = await journeyService.findJourneyDto(journeyId);
            setJourney(data);
            if (data?.current_step) {
                fetchCurrentStepLog(journeyId, data.current_step);
            }
        } catch (error) {
            console.error('[API] Failed to fetch journey:', error);
            message.error('Không thể tải thông tin công trình');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrentStepLog = async (jId: string, stepCode: string) => {
        try {
            const res = await journeyStepLogService.queryJourneyStepLogsDto({
                group: {
                    operation: 'and',
                    children: [
                        { id: 'journey_id', operation: 'eq', value: jId },
                        { id: 'step_code', operation: 'eq', value: stepCode }
                    ]
                },
                sorted: [{ id: 'createdAt', desc: true }],
                limit: 1
            } as any);
            if (res.data?.[0]) {
                setCurrentStepLog(res.data[0]);
            } else {
                setCurrentStepLog(null);
            }
        } catch (error) {
            console.error('Failed to fetch current step log:', error);
        }
    };


    const fetchEmployees = async () => {
        try {
            const res = await employeeService.queryContent({ limit: 100 });
            if (res.data) {
                setEmployees(res.data.map(e => ({ label: e.name || 'N/A', value: e._id })));
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const fetchWorkTasks = async () => {
        if (!journeyId) return;
        setIsLoadingTasks(true);
        try {
            const res = await workTaskService.queryContent({
                group: { id: 'journey_id', operation: 'eq', value: journeyId }
            } as any);
            setWorkTasks(res.data || []);
            fetchReportCounts();
        } catch (error) {
            console.error('Failed to fetch work tasks:', error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const fetchReportCounts = async () => {
        if (!journeyId) return;
        try {
            const res = await siteReportService.querySiteReportsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId }
            } as any);
            const counts: Record<string, number> = {};
            res.data?.forEach(report => {
                if (report.worktaskId) {
                    counts[report.worktaskId] = (counts[report.worktaskId] || 0) + 1;
                }
            });
            setReportCountByTask(counts);
        } catch (error) {
            console.error('Failed to fetch report counts:', error);
        }
    };

    const fetchJourneyDocuments = async () => {
        if (!journeyId) return;
        try {
            const res = await journeyDocumentService.queryJourneyDocumentsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId }
            } as any);
            setJourneyDocuments(res.data || []);
        } catch (error) {
            console.error('Failed to fetch journey documents:', error);
        }
    };

    const handleResetJourneyStep = async () => {
        if (!journey?._id || !resetStepCode) return;
        setIsSubmitting(true);
        try {
            await journeyService.updateJourney(journey._id, { current_step: resetStepCode as any });
            message.success('Đã cập nhật lại bước cho công trình!');
            setResetStepCode(null);
            fetchJourney();
            setSelectedTaskStepCode(null);
        } catch (error) {
            console.error('Failed to reset journey step:', error);
            message.error('Lỗi khi cập nhật lại bước');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            await workTaskService.updateWorkTask(taskId, { status: newStatus as any });
            message.success('Đã cập nhật trạng thái công việc');
            fetchWorkTasks();
        } catch (error) {
            console.error('Failed to update status:', error);
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };

    useEffect(() => {
        fetchJourney();
        fetchEmployees();
        fetchWorkTasks();
        fetchJourneyDocuments();
    }, [journeyId]);

    useEffect(() => {
        const handleDocsRefresh = () => {
            fetchJourneyDocuments();
        };
        window.addEventListener('journey-documents-updated', handleDocsRefresh);
        return () => {
            window.removeEventListener('journey-documents-updated', handleDocsRefresh);
        };
    }, [journeyId]);

    useEffect(() => {
        const handleTaskRefresh = () => {
            fetchWorkTasks();
        };

        window.addEventListener('journey-tasks-updated', handleTaskRefresh);
        window.addEventListener('journey-site-reports-updated', handleTaskRefresh);
        return () => {
            window.removeEventListener('journey-tasks-updated', handleTaskRefresh);
            window.removeEventListener('journey-site-reports-updated', handleTaskRefresh);
        };
    }, [journeyId]);

    /** Step con (vd. Step01Info) yêu cầu đổi tab qua CustomEvent. */
    useEffect(() => {
        const onSwitchJourneyTab = (ev: Event) => {
            const tab = (ev as CustomEvent<string>).detail;
            if (typeof tab === 'string' && tab.length > 0) {
                setSearchParams({ tab });
            }
        };
        window.addEventListener('switch-journey-tab', onSwitchJourneyTab);
        return () => window.removeEventListener('switch-journey-tab', onSwitchJourneyTab);
    }, [setSearchParams]);

    useEffect(() => {
        let cancelled = false;
        void customerJourneySettingService.findSetting().then((data) => {
            if (!cancelled && data) {
                setCustomerJourneySetting(data);
            }
        }).catch(() => { });
        return () => {
            cancelled = true;
        };
    }, []);

    // Resolve template/steps
    const template = mockJourneyTemplates.find(t => t.id === 'default') || mockJourneyTemplates[0];
    const journeySteps = template?.steps || [];
    const currentStepCode = journey?.current_step || 'lead_new';
    const currentHeaderStepIndex = HEADER_STEP_CONFIG.findIndex((step) => step.key === currentStepCode);

    const [showDispatchWorkModal, setShowDispatchWorkModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showCreateDocModal, setShowCreateDocModal] = useState(false);
    const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
    const [isJourneyDrawerVisible, setIsJourneyDrawerVisible] = useState(false);
    const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
    const [chatDrawerLayoutMode, setChatDrawerLayoutMode] = useState<ChatPanelLayoutMode>('expanded');
    const [customerJourneySetting, setCustomerJourneySetting] = useState<ICustomerJourneySetting | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dispatchWorkError, setDispatchWorkError] = useState<string | null>(null);
    const [showEstimateInputModal, setShowEstimateInputModal] = useState(false);
    const [estimateInputForm] = Form.useForm();
    const [isSavingEstimateInput, setIsSavingEstimateInput] = useState(false);
    const [publishTab, setPublishTab] = useState('settings');
    const [dispatchWorkForm] = Form.useForm();
    const [priorityForm] = Form.useForm();
    const [followUpForm] = Form.useForm();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedTaskForReport, setSelectedTaskForReport] = useState<IWorkTask | null>(null);
    const [isCreateWorkTaskModalOpen, setIsCreateWorkTaskModalOpen] = useState(false);
    const [isCompletingStepFromModal, setIsCompletingStepFromModal] = useState(false);
    const [createWorkTaskForm] = Form.useForm();
    const [resetStepCode, setResetStepCode] = useState<string | null>(null);
    const [modal, modalContextHolder] = Modal.useModal();

    const openDispatchWorkModal = () => {
        if (!journey) return;
        dispatchWorkForm.setFieldsValue({
            pm_user: journey.pm_user,
            supervisor_users: journey.supervisor_users,
            technical_users: journey.technical_users,
            sale_users: journey.sale_users,
            delivery_note: journey.delivery_note,
        });
        setDispatchWorkError(null);
        setShowDispatchWorkModal(true);
    };

    /** Lưu phân công + tạo WorkTask (xóa task cũ, tạo mới từ checklist). Kiểm tra hợp lệ trước khi gọi API cập nhật journey. */
    const handleDispatchWorkModalOk = async () => {
        if (!journeyId || !journey) {
            message.error('Thiếu thông tin công trình.');
            return;
        }
        try {
            await dispatchWorkForm.validateFields();
        } catch {
            return;
        }
        const values = dispatchWorkForm.getFieldsValue();
        const mergedJourney: IJourney = {
            ...journey,
            pm_user: values.pm_user,
            supervisor_users: values.supervisor_users,
            technical_users: values.technical_users,
            sale_users: values.sale_users,
            delivery_note: values.delivery_note,
        };

        setDispatchWorkError(null);
        setIsSubmitting(true);
        try {
            const setting = await customerJourneySettingService.findSetting();
            const built = buildWorkTasksFromSetting(setting, journeyId, mergedJourney);
            if (!built.ok) {
                if ('reason' in built) {
                    setDispatchWorkError(
                        built.reason === 'no_setting'
                            ? 'Không tìm thấy cấu hình bước công việc (CustomerJourneySetting). Vui lòng kiểm tra mục Cài đặt.'
                            : 'Không có nhiệm vụ checklist nào được bật trong cấu hình. Vui lòng kiểm tra mục Cài đặt.'
                    );
                } else if (built.missingRoleOnChecklist.length > 0) {
                    setDispatchWorkError(
                        `Cấu hình checklist chưa đủ vai trò:\n• ${built.missingRoleOnChecklist.slice(0, 5).join('\n• ')}${built.missingRoleOnChecklist.length > 5 ? `\n… và ${built.missingRoleOnChecklist.length - 5} mục khác.` : ''}`
                    );
                }
                return;
            }

            await journeyService.updateJourney(journey._id, {
                pm_user: values.pm_user,
                supervisor_users: values.supervisor_users,
                technical_users: values.technical_users,
                sale_users: values.sale_users,
                delivery_note: values.delivery_note,
            });

            const res = await workTaskService.queryContent({
                group: { id: 'journey_id', operation: 'eq', value: journeyId },
                limit: 200
            } as any);
            if (res?.data?.length) {
                await workTaskService.deleteMultiWorkTask(res.data.map((t: IWorkTask) => t._id));
            }

            await workTaskService.saveManyWorkTasks(built.tasks);

            const skippedMsg = built.skippedRoles?.length
                ? ` (bỏ qua vai trò chưa gán: ${built.skippedRoles.join(', ')})`
                : '';
            message.success(`Đã cập nhật phân công và giao ${built.tasks.length} nhiệm vụ${skippedMsg}.`);
            setShowDispatchWorkModal(false);
            fetchJourney();
            await fetchWorkTasks();
            window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
        } catch (error) {
            console.error('Dispatch work error:', error);
            setDispatchWorkError('Lỗi khi giao việc: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    // Resolve which tabs/steps this user can see and edit
    const userRoleConfig = useMemo(() => {
        if (!role) return { allowedGroupCodes: [], editableGroupCodes: [], finalizableGroupCodes: [] };

        const allowedGroupCodes: string[] = [];
        const editableGroupCodes: string[] = [];
        const finalizableGroupCodes: string[] = [];

        if (isPmManager) {
            // Admin or PM (QL) sees everything, can edit and can finalize
            journeySteps.forEach(s => {
                if (s.standardProcedureGroupCd) {
                    allowedGroupCodes.push(s.standardProcedureGroupCd);
                    editableGroupCodes.push(s.standardProcedureGroupCd);
                    finalizableGroupCodes.push(s.standardProcedureGroupCd);
                }
            });
        } else {
            journeySteps.forEach(s => {
                const config = s.roleConfigurations?.find(rc => rc.roleId === role);
                if (config && s.standardProcedureGroupCd) {
                    allowedGroupCodes.push(s.standardProcedureGroupCd);
                    if (config.isEditable) {
                        editableGroupCodes.push(s.standardProcedureGroupCd);
                    }
                    if (config.isKeyRole) {
                        finalizableGroupCodes.push(s.standardProcedureGroupCd);
                    }
                }
            });

            /** Quyền ghi tài liệu theo CustomerJourneySetting: permissions chứa edit / submit / commit (Chịu trách nhiệm). */
            if (customerJourneySetting?.steps?.length && role) {
                customerJourneySetting.steps.forEach((stepConfig, index) => {
                    const roles = stepConfig.roles;
                    if (!hasRoleDocumentPermissionFromStepRoles(roles, role)) {
                        return;
                    }

                    // Map step index to standardProcedureGroupCd from mock templates or sequence
                    const groupCd = journeySteps[index]?.standardProcedureGroupCd;
                    if (!groupCd) {
                        return;
                    }

                    editableGroupCodes.push(groupCd);
                    if (!allowedGroupCodes.includes(groupCd)) {
                        allowedGroupCodes.push(groupCd);
                    }
                });
            }
        }

        return {
            allowedGroupCodes: [...new Set(allowedGroupCodes)],
            editableGroupCodes: [...new Set(editableGroupCodes)],
            finalizableGroupCodes: [...new Set(finalizableGroupCodes)]
        };
    }, [role, isPmManager, journeySteps, customerJourneySetting]);

    const visibleJourneyTabKeys = useMemo(
        () =>
            JOURNEY_TAB_ACCESS_RULES
                .filter((rule) => isJourneyTabUnlockedByStep(rule, currentHeaderStepIndex))
                .filter((rule) => canJourneyTabPassRole(rule, userRoleConfig, role, isPmManager))
                .map((rule) => rule.key),
        [currentHeaderStepIndex, userRoleConfig, role, isPmManager]
    );

    useEffect(() => {
        if (!journey || visibleJourneyTabKeys.length === 0 || visibleJourneyTabKeys.includes(activeTab)) {
            return;
        }
        setSearchParams({ tab: visibleJourneyTabKeys[0] });
    }, [activeTab, journey, setSearchParams, visibleJourneyTabKeys]);


    const canCreateJourneyDocument = useMemo(
        () => isPmManager || userRoleConfig.editableGroupCodes.length > 0,
        [isPmManager, userRoleConfig.editableGroupCodes],
    );

    const taskStatsByStep = useMemo(() => {
        const stats: Record<string, { total: number; finished: number; percentage: number }> = {};

        HEADER_STEP_CONFIG.forEach(step => {
            const stepTasks = workTasks.filter(t => t.journey_step_code === step.key);
            const total = stepTasks.length;
            const finished = stepTasks.filter(t => t.status === 'finished').length;
            const percentage = total > 0 ? Math.round((finished / total) * 100) : 0;

            stats[step.key] = { total, finished, percentage };
        });

        return stats;
    }, [workTasks]);

    const taskCountByStep = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.keys(taskStatsByStep).forEach(key => {
            counts[key] = taskStatsByStep[key].total;
        });
        return counts;
    }, [taskStatsByStep]);

    const selectedStepMeta = useMemo(() => {
        if (!selectedTaskStepCode) return null;

        // Strictly validate if the code is a standard step code
        const isStandard = JOURNEY_STEP_SEQUENCE.includes(selectedTaskStepCode as any);
        if (!isStandard) return null; // Treat S01_INFO and other non-standard codes as junk

        // Find standard metadata
        const staticMeta = HEADER_STEP_CONFIG.find((step) => step.key === selectedTaskStepCode);
        if (staticMeta) return staticMeta;

        // Fallback to dynamic steps only if they are confirmed standard
        const dynamicStep = journeySteps.find((s) => s.step_code === selectedTaskStepCode);
        if (dynamicStep) {
            return {
                key: dynamicStep.step_code,
                label: dynamicStep.step_name,
                icon: null,
            };
        }

        return null;
    }, [selectedTaskStepCode, journeySteps]);

    const selectedStepTasks = useMemo(
        () => workTasks.filter((task) => task.journey_step_code === selectedTaskStepCode),
        [selectedTaskStepCode, workTasks]
    );

    const taskModalStepIndex = useMemo(
        () => (selectedTaskStepCode ? HEADER_STEP_CONFIG.findIndex((s) => s.key === selectedTaskStepCode) : -1),
        [selectedTaskStepCode]
    );

    const isTaskModalReadOnly = taskModalStepIndex > currentHeaderStepIndex;

    /** Người đang đăng nhập là PM gán trên công trình — coi như quyền quản lý chốt bước. */
    const isCurrentUserJourneyPm = useMemo(() => {
        if (!user?._id || !journey?.pm_user) return false;
        return toUserList(journey.pm_user).some((id) => String(id) === String(user._id));
    }, [user, journey]);

    const hasPendingTasksForSelectedStep = useMemo(() => {
        if (!selectedTaskStepCode) return false;
        return workTasks.some(
            (task) => task.journey_step_code === selectedTaskStepCode && task.status === 'pending'
        );
    }, [workTasks, selectedTaskStepCode]);

    const canFinalizeStepInTaskModal = useMemo(() => {
        if (!journey?._id || !selectedTaskStepCode) return false;
        const selectedKey = String(selectedTaskStepCode).trim();
        const currentKey =
            journey.current_step != null && String(journey.current_step).trim() !== ''
                ? String(journey.current_step).trim()
                : '';
        if (!currentKey || selectedKey !== currentKey) return false;
        if (taskModalStepIndex > currentHeaderStepIndex) return false;
        const groupCd = headerStepKeyToStandardProcedureGroupCd(selectedKey, journeySteps);

        // Finalization allowed for PM/Admin or users with specific permissions for the step group
        if (isPmManager || isCurrentUserJourneyPm) return true;
        if (groupCd && userRoleConfig.finalizableGroupCodes.includes(groupCd)) return true;

        return false;
    }, [
        journey,
        selectedTaskStepCode,
        journeySteps,
        isPmManager,
        isCurrentUserJourneyPm,
        userRoleConfig.finalizableGroupCodes,
        taskModalStepIndex,
        currentHeaderStepIndex,
    ]);

    const canOverrideTaskStatusInModal = useMemo(() => {
        if (!isPmManager || !selectedTaskStepCode || !journey?.current_step) return false;
        if (isTaskModalReadOnly) return false;
        return String(selectedTaskStepCode).trim() === String(journey.current_step).trim();
    }, [isPmManager, selectedTaskStepCode, journey?.current_step, isTaskModalReadOnly]);

    const assignedPeopleCount = useMemo(() => {
        if (!journey) return 0;
        const ids = new Set<string>();
        const add = (value: unknown) => {
            toUserList(value).forEach((id) => {
                if (id) ids.add(String(id));
            });
        };
        add(journey.pm_user);
        add(journey.sale_users);
        add(journey.supervisor_users);
        add(journey.technical_users);
        return ids.size;
    }, [journey]);

    const currentStepWorkTaskCount = useMemo(
        () => taskStatsByStep[currentStepCode]?.total ?? 0,
        [taskStatsByStep, currentStepCode]
    );

    const currentStepDocumentCount = useMemo(
        () =>
            journeyDocuments.filter((doc) => doc.journey_step_code === currentStepCode).length,
        [journeyDocuments, currentStepCode]
    );

    const currentStepDisplayLabel = useMemo(
        () => HEADER_STEP_CONFIG.find((s) => s.key === currentStepCode)?.label || currentStepCode,
        [currentStepCode]
    );

    const currentStepCollaborators = useMemo(() => {
        if (!journey) return [];
        const result: { name: string; label: string }[] = [];
        const add = (users: any, label: string) => {
            toUserList(users).forEach((u) => {
                if (u && !result.find(r => r.name === u)) {
                    result.push({ name: u, label });
                }
            });
        };
        add(journey.pm_user, 'PM');
        const phase = currentStepCode;
        const isSales = ['lead_new', 'consult_contact', 'solution_design', 'quotation', 'contract'].includes(phase);
        const isTechnic = ['site_survey', 'execution', 'final_acceptance'].includes(phase);
        if (isSales) add(journey.sale_users, 'KD');
        if (isTechnic) {
            add(journey.supervisor_users, 'GS');
            add(journey.technical_users, 'KT');
        }
        return result;
    }, [journey, currentStepCode]);

    const chatToggleButton = (
        <Tooltip title="Trao đổi nhóm">
            <Badge count={journey?.unread_thread_count ?? 0} size="small" offset={[-6, 6]}>
                <Button icon={<MessageOutlined />} onClick={() => setIsChatDrawerVisible(true)}>
                    {isMobile ? '' : 'Trao đổi nhóm'}
                </Button>
            </Badge>
        </Tooltip>
    );

    const openTaskModal = (stepCode: string) => {
        setSelectedTaskStepCode(stepCode);
    };

    /** Điều hướng tab khi action không mở dialog (fallback). */
    const handleWorkTaskActionNavigate = useCallback(
        (_task: IWorkTask, action: IActionsItem) => {
            const tab = resolveJourneyTabForWorkTaskAction(action);
            if (tab) {
                setSearchParams({ tab });
                setSelectedTaskStepCode(null);
                setIsJourneyDrawerVisible(false);
                return;
            }
            message.info('Chưa ánh xạ tab cho thao tác này — vui lòng thao tác thủ công trên lộ trình.');
        },
        [setSearchParams]
    );

    /** Mở dialog theo nhóm action (field batch / document batch) hoặc điều hướng tab. */
    const handleWorkTaskActionClick = useCallback(
        (p: TaskActionClickPayload) => {
            if (!journey?._id) {
                message.warning('Chưa tải xong dữ liệu công trình.');
                return;
            }
            if (p.type === 'field_batch' && p.actions.length) {
                setWorkTaskActionContext({ mode: 'field_batch', task: p.task, actions: p.actions });
                return;
            }
            if (p.type === 'document_batch' && p.actions.length) {
                setWorkTaskActionContext({ mode: 'document_batch', task: p.task, actions: p.actions });
                return;
            }
            if (p.type === 'single') {
                handleWorkTaskActionNavigate(p.task, p.action);
            }
        },
        [journey?._id, handleWorkTaskActionNavigate]
    );

    const handleDeleteWorkTaskFromModal = async (task: IWorkTask) => {
        try {
            const ok = await workTaskService.deleteWorkTask(task._id);
            if (!ok) {
                throw new Error('delete failed');
            }
            message.success('Đã xóa công việc');
            await fetchWorkTasks();
            window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
        } catch (error) {
            console.error(error);
            message.error('Không thể xóa công việc');
        }
    };

    const handleSubmitNewWorkTask = async () => {
        if (!journeyId || !selectedTaskStepCode) return;
        try {
            const v = await createWorkTaskForm.validateFields();
            await workTaskService.createWorkTask({
                journey_id: journeyId,
                journey_step_code: selectedTaskStepCode as ICreateWorkTaskInput['journey_step_code'],
                title: v.title,
                description: v.description,
                assignee_role: v.assignee_role,
                is_required: Boolean(v.is_required),
                status: 'pending',
            });
            message.success('Đã tạo công việc');
            setIsCreateWorkTaskModalOpen(false);
            createWorkTaskForm.resetFields();
            await fetchWorkTasks();
            window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) return;
            console.error(error);
            message.error(error instanceof Error ? error.message : 'Không thể tạo công việc');
        }
    };

    const handleCompleteStepFromTaskModal = async () => {
        if (!journey?._id || !journey.current_step) {
            message.warning('Chưa tải đủ thông tin công trình để xác nhận hoàn thành bước.');
            return;
        }
        if (!selectedTaskStepCode || selectedTaskStepCode !== journey.current_step) {
            message.warning('Chỉ có thể xác nhận hoàn thành tại bước hiện tại của công trình.');
            return;
        }

        const unfinishedTasks = workTasks.filter(
            (task) => task.journey_step_code === journey.current_step && task.status === 'pending'
        );
        if (unfinishedTasks.length > 0) {
            modal.warning({
                title: 'Chưa thể hoàn thành bước',
                content: (
                    <div>
                        <div>
                            Còn <b>{unfinishedTasks.length}</b> công việc đang ở trạng thái <b>Chờ</b>:
                        </div>
                        <ul style={{ marginTop: 8, paddingLeft: 20, maxHeight: 220, overflow: 'auto' }}>
                            {unfinishedTasks.map((task) => (
                                <li key={task._id}>{task.title || 'Công việc chưa đặt tên'}</li>
                            ))}
                        </ul>
                        <div style={{ fontSize: 12 }}>
                            Bạn cần chuyển các công việc này sang trạng thái <b>Xong</b> hoặc <b>Bỏ qua</b> (nếu không bắt buộc) để tiếp tục.
                        </div>
                    </div>
                ),
                okText: 'Đã hiểu',
            });
            return;
        }
        setIsCompletingStepFromModal(true);
        try {
            const completedStepLabel = HEADER_STEP_CONFIG.find((s) => s.key === journey.current_step)?.label || journey.current_step;
            const completedStepIndex = HEADER_STEP_CONFIG.findIndex((s) => s.key === journey.current_step);
            const nextStepMeta = HEADER_STEP_CONFIG[completedStepIndex + 1];
            const r = await confirmAdvanceJourneyStep({
                journeyId: journey._id,
                actualStep: journey.current_step,
                workTasks,
                modalApi: modal,
            });
            if (r === 'advanced') {
                await fetchJourney();
                await fetchWorkTasks();
                if (journeyId && nextStepMeta?.key) {
                    await fetchCurrentStepLog(journeyId, nextStepMeta.key);
                }
                message.success(
                    nextStepMeta
                        ? `Đã hoàn thành bước ${completedStepLabel} và chuyển sang bước ${nextStepMeta.label}.`
                        : `Đã hoàn thành bước ${completedStepLabel}.`
                );
                setSelectedTaskStepCode(null);
                window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
                return;
            }
            if (r === 'blocked') {
                message.warning('Chưa thể chuyển bước vì vẫn còn công việc bắt buộc chưa hoàn thành.');
                return;
            }
            if (r === 'last') {
                await fetchJourney();
                await fetchWorkTasks();
                message.info('Công trình đang ở bước cuối cùng, không còn bước tiếp theo để chuyển.');
                return;
            }
            if (r === 'invalid') {
                message.error('Không xác định được bước hiện tại trong quy trình. Vui lòng kiểm tra cấu hình lộ trình.');
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi cập nhật trạng thái bước');
        } finally {
            setIsCompletingStepFromModal(false);
        }
    };

    const renderAssignmentTags = (users: string[], emptyText: string = 'Chưa gán') => {
        if (users.length === 0) {
            return <Text style={{ color: 'rgba(255,255,255,0.72)' }}>{emptyText}</Text>;
        }

        return (
            <Space size={[6, 6]} wrap>
                {users.map((user) => (
                    <Tag
                        key={user}
                        style={{
                            marginInlineEnd: 0,
                            background: 'rgba(255,255,255,0.14)',
                            borderColor: 'rgba(255,255,255,0.18)',
                            color: '#fff'
                        }}
                    >
                        {user}
                    </Tag>
                ))}
            </Space>
        );
    };

    const renderAssignmentPanel = (label: string, content: React.ReactNode, isNote: boolean = false) => (
        <div
            style={{
                height: '100%',
                padding: isMobile ? '12px 14px' : 0,
                borderRadius: isMobile ? 12 : 0,
                background: isMobile ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: isMobile ? '1px solid rgba(255,255,255,0.14)' : 'none'
            }}
        >
            <Text style={{ color: 'rgba(255,255,255,0.68)', display: 'block', marginBottom: 6 }}>{label}</Text>
            {isNote ? (
                <Text style={{ color: '#fff', display: 'block', lineHeight: 1.6 }}>
                    {content}
                </Text>
            ) : (
                content
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div style={{ padding: 100, textAlign: 'center' }}>
                <Spin size="large" tip="Đang tải thông tin công trình..." />
            </div>
        );
    }

    if (!journey) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy công trình" />
                <Button style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>
        );
    }

    const renderTabContent = (
        groupCode: string,
        stepCode: string,
        tabStepCode?: JourneyHeaderStepCode,
        options?: { canFinalize?: boolean }
    ) => {
        if (!journey) return null;
        const isEditable = userRoleConfig.editableGroupCodes.includes(groupCode);
        const isCurrentStepTab = Boolean(tabStepCode && tabStepCode === currentStepCode);
        const isFinalizable =
            options?.canFinalize !== false &&
            isCurrentStepTab &&
            userRoleConfig.finalizableGroupCodes.includes(groupCode);
        const stepLabel = tabStepCode
            ? HEADER_STEP_CONFIG.find(s => s.key === tabStepCode)?.label
            : HEADER_STEP_CONFIG.find(s => s.key === journey.current_step)?.label;
        return (
            <JourneyStepRenderer
                stepCode={stepCode}
                journeyId={journey._id}
                isEditable={isEditable}
                canFinalize={isFinalizable}
                journeyCurrentStep={journey.current_step}
                journeyProgress={journey.progress_pct}
                workTasks={workTasks}
                stepLabel={stepLabel}
                modalApi={modal}
                onRefresh={() => {
                    fetchJourney();
                    fetchWorkTasks();
                }}
            />
        );
    };

    const tabItems = [
        // 1. Tab Tổng quan (GRP_01_INFO) + Dự án data
        {
            key: 'GRP_01_INFO',
            label: <span><FormOutlined /> Tổng quan</span>,
            children: renderTabContent('GRP_01_INFO', 'S01_INFO'),
        },
        // 2. Tab Tạo lịch hẹn (GRP_02_CONTACT)
        {
            key: 'GRP_02_CONTACT',
            label: <span><CalendarOutlined /> Lịch hẹn</span>,
            children: renderTabContent('GRP_02_CONTACT', 'S02_CONSULT'),
        },
        // 3. Tab Khảo sát (GRP_03_SURVEY)
        {
            key: 'GRP_03_SURVEY',
            label: <span><FileSearchOutlined /> Khảo sát</span>,
            children: renderTabContent('GRP_03_SURVEY', 'S03_SURVEY'),
        },
        // 4. Tab Dự toán (GRP_04_SOLUTION)
        {
            key: 'GRP_04_SOLUTION',
            label: <span><CalculatorOutlined /> Dự toán</span>,
            children: renderTabContent('GRP_04_SOLUTION', 'S04_SOLUTION'),
        },
        // 5. Tab Nhân công
        {
            key: 'GRP_LABOR',
            label: <span><TeamOutlined /> Nhân công</span>,
            children: <StepLabor journeyId={journey._id} isEditable={userRoleConfig.editableGroupCodes.includes('GRP_05_QUOTE') || role === 'QL'} />,
        },
        // 6. Tab Báo giá/HĐ (GRP_05_QUOTE)
        {
            key: 'GRP_05_QUOTE',
            label: <span><FileTextOutlined /> Báo giá/HĐ</span>,
            children: renderTabContent('GRP_05_QUOTE', 'S05_QUOTE'),
        },
        // 7. Tab Vật tư
        {
            key: 'GRP_MATERIALS',
            label: <span><BoxPlotOutlined /> Vật tư</span>,
            children: <StepMaterials journeyId={journey._id} isEditable={userRoleConfig.editableGroupCodes.includes('GRP_05_QUOTE') || role === 'QL'} />,
        },
        // 9. Tab Thanh toán (GRP_07_DEPOSIT or GRP_10_PAYMENT)
        {
            key: 'GRP_07_DEPOSIT',
            label: <span><DollarOutlined /> Thanh toán</span>,
            children: renderTabContent('GRP_07_DEPOSIT', 'S07_ADVANCE'),
        },
        // 11. Tab Phát sinh (GRP_08_CONSTRUCT)
        {
            key: 'GRP_08_CONSTRUCT',
            label: <span><ExclamationCircleOutlined /> Nhật ký</span>,
            children: renderTabContent('GRP_08_CONSTRUCT', 'S08_CONSTRUCT'),
        },
        // 12. Tab Tài liệu (GRP_09_ACCEPTANCE or GRP_08_CONSTRUCT)
        {
            key: 'GRP_ACCEPTANCE',
            label: <span><PaperClipOutlined /> Bàn giao</span>,
            children: renderTabContent('GRP_09_ACCEPTANCE', 'S09_ACCEPTANCE'),
        },
        // 12b. Tab Tài liệu công trình - công khai, không giới hạn quyền
        {
            key: 'GRP_DOCUMENTS',
            label: <span><PaperClipOutlined /> Tài liệu công trình</span>,
            children: (
                <JourneyDocumentsTab
                    journeyId={journey._id}
                    isEditable={canCreateJourneyDocument}
                    journeyCurrentStep={journey.current_step}
                />
            ),
        },
    ].filter(item => {
        // Tab Tổng quan (GRP_01_INFO) luôn hiển thị cho tất cả vai trò
        if (item.key === 'GRP_01_INFO') return true;

        // Tab Nhật ký (GRP_08_CONSTRUCT) luôn hiển thị công khai cho tất cả vai trò
        if (item.key === 'GRP_08_CONSTRUCT') return true;

        // Tab Tài liệu công trình luôn hiển thị công khai cho tất cả vai trò
        if (item.key === 'GRP_DOCUMENTS') return true;

        // Filter tabs based on user visibility
        if (item.key === 'LOG') return role === 'QL' || role === 'KD';

        // Custom keys that don't match standardProcedureGroupCd exactly
        if (item.key === 'GRP_LABOR') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE') || role === 'QL' || role === 'KD';
        if (item.key === 'GRP_MATERIALS') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE') || role === 'QL' || role === 'KD';
        if (item.key === 'GRP_ACCEPTANCE') return userRoleConfig.allowedGroupCodes.includes('GRP_09_ACCEPTANCE') || userRoleConfig.allowedGroupCodes.includes('GRP_08_CONSTRUCT');

        return userRoleConfig.allowedGroupCodes.includes(item.key);
    });

    const canEditQuoteResources = userRoleConfig.editableGroupCodes.includes('GRP_05_QUOTE') || isPmManager;
    const stagedTabItems = JOURNEY_TAB_ACCESS_RULES
        .map((rule) => {
            if (!visibleJourneyTabKeys.includes(rule.key)) {
                return null;
            }

            switch (rule.key) {
                case 'GRP_01_INFO':
                    return {
                        key: rule.key,
                        label: <span><FormOutlined /> Tổng quan</span>,
                        children: renderTabContent('GRP_01_INFO', 'S01_INFO', 'lead_new'),
                    };
                case 'GRP_02_CONTACT':
                    return {
                        key: rule.key,
                        label: <span><CalendarOutlined /> Lịch hẹn</span>,
                        children: renderTabContent('GRP_02_CONTACT', 'S02_CONSULT', 'consult_contact'),
                    };
                case 'GRP_DOCUMENTS':
                    return {
                        key: rule.key,
                        label: <span><PaperClipOutlined /> Tài liệu</span>,
                        children: (
                            <JourneyDocumentsTab
                                journeyId={journey._id}
                                isEditable={canCreateJourneyDocument}
                                journeyCurrentStep={journey.current_step}
                            />
                        ),
                    };
                case 'GRP_03_SURVEY':
                    return {
                        key: rule.key,
                        label: <span><FileSearchOutlined /> Khảo sát</span>,
                        children: renderTabContent('GRP_03_SURVEY', 'S03_SURVEY', 'site_survey'),
                    };
                case 'GRP_04_SOLUTION':
                    return {
                        key: rule.key,
                        label: <span><CalculatorOutlined /> Giải pháp</span>, // Renaming from Dự toán to Giải pháp
                        children: renderTabContent('GRP_04_SOLUTION', 'S04_SOLUTION', 'solution_design'),
                    };
                case 'GRP_ESTIMATE':
                    return {
                        key: rule.key,
                        label: <span><CalculatorOutlined /> Dự toán & Chào thầu</span>,
                        children: <Step04SolutionOrchestration journeyId={journey._id} />,
                    };
                case 'GRP_LABOR':
                    return {
                        key: rule.key,
                        label: <span><TeamOutlined /> Nhân công</span>,
                        children: <StepLabor journeyId={journey._id} isEditable={canEditQuoteResources} />,
                    };
                case 'GRP_MATERIALS':
                    return {
                        key: rule.key,
                        label: <span><BoxPlotOutlined /> Vật tư</span>,
                        children: <StepMaterials journeyId={journey._id} isEditable={canEditQuoteResources} />,
                    };
                case 'GRP_05_QUOTE':
                    return {
                        key: rule.key,
                        label: <span><FileTextOutlined /> Báo giá</span>,
                        children: renderTabContent('GRP_05_QUOTE', 'S05_QUOTE', 'quotation'),
                    };
                case 'GRP_06_CONTRACT':
                    return {
                        key: rule.key,
                        label: <span><AuditOutlined /> Hợp đồng</span>,
                        children: renderTabContent('GRP_06_CONTRACT', 'S06_CONTRACT', 'contract'),
                    };
                case 'GRP_07_DEPOSIT':
                    return {
                        key: rule.key,
                        label: <span><DollarOutlined /> Tạm ứng</span>,
                        children: renderTabContent('GRP_07_DEPOSIT', 'S07_ADVANCE', undefined, { canFinalize: false }),
                    };
                case 'GRP_08_CONSTRUCT':
                    return {
                        key: rule.key,
                        label: <span><ExclamationCircleOutlined /> Nhật ký</span>,
                        children: renderTabContent('GRP_08_CONSTRUCT', 'S08_CONSTRUCT', 'execution'),
                    };
                case 'GRP_ACCEPTANCE':
                    return {
                        key: rule.key,
                        label: <span><PaperClipOutlined /> Bàn giao</span>,
                        children: renderTabContent('GRP_09_ACCEPTANCE', 'S09_ACCEPTANCE', 'final_acceptance'),
                    };
                case 'GRP_10_PAYMENT':
                    return {
                        key: rule.key,
                        label: <span><DollarOutlined /> Thanh toán</span>,
                        children: renderTabContent('GRP_10_PAYMENT', 'S10_PAYMENT', 'payment'),
                    };
                case 'GRP_11_MAINTAIN':
                    return {
                        key: rule.key,
                        label: <span><ToolOutlined /> Bảo trì</span>,
                        children: renderTabContent('GRP_11_MAINTAIN', 'S11_MAINTAIN', 'maintenance'),
                    };
                case 'GRP_12_WARRANTY':
                    return {
                        key: rule.key,
                        label: <span><CarryOutOutlined /> Bảo hành</span>,
                        children: renderTabContent('GRP_12_WARRANTY', 'S12_WARRANTY', 'warranty'),
                    };
                case 'GRP_13_CARE':
                    return {
                        key: rule.key,
                        label: <span><UserOutlined /> Chăm sóc</span>,
                        children: renderTabContent('GRP_13_CARE', 'S13_CARE', 'after_sales'),
                    };
                default:
                    return null;
            }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const resolvedActiveTab = visibleJourneyTabKeys.includes(activeTab) ? activeTab : (visibleJourneyTabKeys[0] || 'GRP_01_INFO');

    return (
        <div style={{ padding: isMobile ? '8px' : '24px', background: '#f5f7fa', minHeight: '100vh' }}>
            {modalContextHolder}
            {/* Back + Primary Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? 8 : 16, gap: 8, flexWrap: 'wrap' }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)} style={{ padding: isMobile ? '4px 8px' : undefined }}>
                    {!isMobile && 'Quay lại'}
                </Button>
                {isPmManager && (
                    <div style={isMobile ? { maxWidth: '100%', overflowX: 'auto', paddingBottom: 4 } : undefined}>
                        <Space size={isMobile ? 4 : 8} wrap={!isMobile}>
                            {(currentHeaderStepIndex < 0 || currentHeaderStepIndex < 5) &&
                                (isMobile ? (
                                    <Tooltip title="Giao việc & phân công">
                                        <Button
                                            icon={<PartitionOutlined />}
                                            onClick={openDispatchWorkModal}
                                            loading={isSubmitting}
                                            aria-label="Giao việc & phân công"
                                        />
                                    </Tooltip>
                                ) : (
                                    <Button
                                        icon={<PartitionOutlined />}
                                        onClick={openDispatchWorkModal}
                                        loading={isSubmitting}
                                    >
                                        Giao việc
                                    </Button>
                                ))}
                            {canCreateJourneyDocument && (
                                <Button icon={<FileTextOutlined />} onClick={() => { setEditingDoc(null); setShowCreateDocModal(true); }}>{isMobile ? '' : 'Tạo tài liệu'}</Button>
                            )}
                            <Button icon={<EditOutlined />} onClick={() => setIsEditDrawerVisible(true)}>{isMobile ? '' : 'Sửa công trình'}</Button>
                            <Button icon={<FlagOutlined />} onClick={() => setShowPriorityModal(true)}>{isMobile ? '' : 'Ưu tiên'}</Button>
                            <Button type="primary" icon={<SendOutlined />} onClick={() => setShowPublishModal(true)}>{isMobile ? 'Portal' : 'Publish Portal'}</Button>
                            {chatToggleButton}
                            <Tooltip title="Lịch sử các bước">
                                <Button icon={<HistoryOutlined />} onClick={() => setShowHistoryModal(true)} />
                            </Tooltip>
                        </Space>
                    </div>
                )}
                {role === 'KD' && (
                    <div style={isMobile ? { maxWidth: '100%', overflowX: 'auto', paddingBottom: 4 } : undefined}>
                        <Space size={isMobile ? 4 : 8} wrap={!isMobile}>
                            {canCreateJourneyDocument && (
                                <Button icon={<FileTextOutlined />} onClick={() => { setEditingDoc(null); setShowCreateDocModal(true); }}>{isMobile ? '' : 'Tạo tài liệu'}</Button>
                            )}
                            <Button icon={<MessageOutlined />} onClick={() => setShowLogModal(true)}>{isMobile ? '' : 'Ghi Log'}</Button>
                            <Button icon={<ClockCircleOutlined />} onClick={() => setShowFollowUpModal(true)}>{isMobile ? '' : 'Follow-up'}</Button>
                            {chatToggleButton}
                            <Tooltip title="Lịch sử các bước">
                                <Button icon={<HistoryOutlined />} onClick={() => setShowHistoryModal(true)} />
                            </Tooltip>
                        </Space>
                    </div>
                )}
                {role !== 'QL' && !isAdmin && role !== 'KD' && (
                    <div style={isMobile ? { maxWidth: '100%', overflowX: 'auto', paddingBottom: 4 } : undefined}>
                        <Space size={isMobile ? 4 : 8} wrap={!isMobile}>
                            {canCreateJourneyDocument && (
                                <Button icon={<FileTextOutlined />} onClick={() => { setEditingDoc(null); setShowCreateDocModal(true); }}>{isMobile ? '' : 'Tạo tài liệu'}</Button>
                            )}
                            {chatToggleButton}
                        </Space>
                    </div>
                )}
            </div>

            {/* Journey Header Card */}
            <Card variant="borderless" style={{ marginBottom: isMobile ? 8 : 16, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a5f 0%, #1976D2 100%)' }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} md={16}>
                        {isMobile ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                    marginBottom: 6,
                                    minWidth: 0,
                                }}
                            >
                                <Tag
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: '#fff',
                                        fontWeight: 700,
                                        margin: 0,
                                        flex: '1 1 auto',
                                        minWidth: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '56%',
                                    }}
                                >
                                    {journey.journey_code}
                                </Tag>
                                <Text
                                    style={{
                                        flexShrink: 0,
                                        fontSize: 11,
                                        color: 'rgba(255,255,255,0.92)',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {journey.planned_start_date
                                        ? dayjs(journey.planned_start_date).format('DD/MM/YYYY')
                                        : '—'}
                                    <span style={{ margin: '0 3px', opacity: 0.55 }}>→</span>
                                    {journey.planned_end_date
                                        ? dayjs(journey.planned_end_date).format('DD/MM/YYYY')
                                        : '—'}
                                </Text>
                            </div>
                        ) : (
                            <div style={{ marginBottom: 4 }}>
                                <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontWeight: 700 }}>
                                    {journey.journey_code}
                                </Tag>
                            </div>
                        )}
                        {isMobile ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                    margin: '6px 0 4px',
                                    minWidth: 0,
                                }}
                            >
                                <Title
                                    level={4}
                                    ellipsis={{ rows: 2 }}
                                    style={{
                                        color: '#fff',
                                        margin: 0,
                                        flex: '1 1 auto',
                                        minWidth: 0,
                                        marginBottom: 0,
                                    }}
                                >
                                    {journey.idx_customer_id?.title || journey.customer_full_name || 'Khách hàng ẩn danh'}
                                </Title>
                                <Tag
                                    color={SLA_CONFIG[journey.sla_status as SlaStatus]?.color || 'default'}
                                    style={{
                                        margin: 0,
                                        flexShrink: 0,
                                        fontWeight: 600,
                                        border: 'none',
                                        maxWidth: '42%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                    title={
                                        SLA_CONFIG[journey.sla_status as SlaStatus]?.label ||
                                        journey.sla_status ||
                                        undefined
                                    }
                                >
                                    SLA:{' '}
                                    {SLA_CONFIG[journey.sla_status as SlaStatus]?.label || journey.sla_status || '—'}
                                </Tag>
                            </div>
                        ) : (
                            <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>
                                {journey.idx_customer_id?.title || journey.customer_full_name || 'Khách hàng ẩn danh'}
                            </Title>
                        )}
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{journey.request_title}</Text>

                        {currentStepLog && (currentStepLog.sla_status === 'at_risk' || currentStepLog.sla_status === 'overdue') && (
                            <div style={{ marginTop: 12 }}>
                                <Alert
                                    type={currentStepLog.sla_status === 'overdue' ? 'error' : 'warning'}
                                    showIcon
                                    message={
                                        <Space split={<Text style={{ color: 'rgba(0,0,0,0.15)' }}>|</Text>}>
                                            <Text strong>{currentStepLog.sla_status === 'overdue' ? 'QUÁ HẠN BƯỚC HIỆN TẠI' : 'RỦI RO CHẬM TIẾN ĐỘ'}</Text>
                                            <Text>SLA: {currentStepLog.sla_hours_snapshot}h</Text>
                                            {currentStepLog.metadata?.breach_reason && (
                                                <Text>Lý do: {currentStepLog.metadata.breach_reason}</Text>
                                            )}
                                        </Space>
                                    }
                                    style={{
                                        borderRadius: 8,
                                        background: currentStepLog.sla_status === 'overdue' ? 'rgba(255, 77, 79, 0.1)' : 'rgba(250, 173, 20, 0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                        )}
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        {!isMobile && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: 8,
                                    flexWrap: 'wrap',
                                    marginBottom: 10,
                                    minWidth: 0,
                                }}
                            >
                                <CalendarOutlined style={{ color: 'rgba(255,255,255,0.72)', flexShrink: 0 }} />
                                <Text
                                    style={{
                                        color: 'rgba(255,255,255,0.92)',
                                        fontSize: 13,
                                        textAlign: 'right',
                                        minWidth: 0,
                                    }}
                                >
                                    <Text style={{ color: 'rgba(255,255,255,0.75)', marginRight: 6 }}>Kế hoạch:</Text>
                                    <Text strong style={{ color: '#fff' }}>
                                        {journey.planned_start_date
                                            ? dayjs(journey.planned_start_date).format('DD/MM/YYYY')
                                            : '—'}
                                    </Text>
                                    <span style={{ margin: '0 6px', opacity: 0.55 }}>→</span>
                                    <Text strong style={{ color: '#fff' }}>
                                        {journey.planned_end_date
                                            ? dayjs(journey.planned_end_date).format('DD/MM/YYYY')
                                            : '—'}
                                    </Text>
                                </Text>
                            </div>
                        )}
                        <Space wrap>
                            {currentStepLog && (
                                <Tooltip title={`SLA Bước ${HEADER_STEP_CONFIG.find(s => s.key === currentStepLog.step_code)?.label || currentStepLog.step_code}`}>
                                    <Tag
                                        icon={<ClockCircleOutlined />}
                                        color={SLA_CONFIG[currentStepLog.sla_status as string]?.color || 'default'}
                                        style={{ border: 'none', fontWeight: 600 }}
                                    >
                                        Step: {SLA_CONFIG[currentStepLog.sla_status as string]?.label || currentStepLog.sla_status}
                                    </Tag>
                                </Tooltip>
                            )}
                            {!isMobile && (
                                <Tag color={SLA_CONFIG[journey.sla_status as SlaStatus]?.color || 'default'}>
                                    Toàn trình: {SLA_CONFIG[journey.sla_status as SlaStatus]?.label || journey.sla_status}
                                </Tag>
                            )}
                            <Tag color={GO_NO_GO_CONFIG[journey.go_no_go_status as GoNoGoStatus]?.color || 'default'}>
                                {GO_NO_GO_CONFIG[journey.go_no_go_status as GoNoGoStatus]?.label || journey.go_no_go_status}
                            </Tag>
                        </Space>
                    </Col>
                </Row>

                <div
                    style={{
                        marginTop: isMobile ? 10 : 16,
                        padding: isMobile ? '8px 10px' : 16,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        overflow: isMobile ? 'hidden' : undefined,
                        maxWidth: '100%',
                    }}
                >
                    <div
                        style={{
                            marginBottom: isMobile ? 6 : 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            minWidth: 0,
                        }}
                    >
                        <Tooltip title="Nhấn để mở danh sách công việc của bước hiện tại">
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => openTaskModal(currentStepCode)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        openTaskModal(currentStepCode);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    marginBottom: 0,
                                    minWidth: 0,
                                    flex: '1 1 auto',
                                    outline: 'none',
                                }}
                            >
                                <Space size={12} wrap style={{ minWidth: 0 }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, flexShrink: 0 }}>
                                        Giai đoạn hiện tại:{' '}
                                        {currentHeaderStepIndex >= 0 && (
                                            <span style={{ fontWeight: 600 }} id="journey-step-indicator">
                                                <span style={{ color: '#ffec3d' }}>{currentHeaderStepIndex + 1}</span>/{HEADER_STEP_CONFIG.length}
                                            </span>
                                        )}
                                    </Text>
                                    <Space
                                        style={{
                                            marginBottom: 0,
                                            minWidth: 0,
                                            background: 'rgba(255,255,255,0.15)',
                                            border: '1px solid rgba(255,255,255,0.25)',
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                        }}
                                        size={8}
                                    >
                                        <NodeIndexOutlined style={{ color: '#fff', flexShrink: 0 }} />
                                        <Text
                                            strong
                                            style={{
                                                color: '#fff',
                                                minWidth: 0,
                                                ...(isMobile
                                                    ? {
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }
                                                    : {}),
                                            }}
                                        >
                                            {currentStepDisplayLabel}
                                        </Text>
                                    </Space>

                                    {currentStepCollaborators.length > 0 && (
                                        <Space size={6} wrap style={{ marginLeft: isMobile ? 0 : 4 }}>
                                            {currentStepCollaborators.map((c) => (
                                                <Tag
                                                    key={c.name}
                                                    style={{
                                                        marginInlineEnd: 0,
                                                        background: 'rgba(255,255,255,0.08)',
                                                        borderColor: 'rgba(165, 243, 252, 0.3)',
                                                        color: '#a5f3fc',
                                                        borderRadius: 4,
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        padding: '0 8px',
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7, fontSize: 10, marginRight: 4, color: 'rgba(255,255,255,0.85)' }}>{c.label}</span>
                                                    {c.name}
                                                </Tag>
                                            ))}
                                        </Space>
                                    )}
                                </Space>
                            </div>
                        </Tooltip>
                        <Button
                            type="primary"
                            ghost
                            size="small"
                            icon={<RocketOutlined />}
                            onClick={() => setIsJourneyDrawerVisible(true)}
                            style={{
                                flexShrink: 0,
                                borderRadius: 8,
                                borderColor: 'rgba(255,255,255,0.4)',
                                color: '#fff',
                                background: 'rgba(255,255,255,0.1)',
                            }}
                        >
                            Lộ trình
                        </Button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: isMobile ? 10 : 16,
                            marginBottom: isMobile ? 8 : 12,
                        }}
                    >
                        <Tooltip title="Tiến độ thi công dự án">
                            <div style={{ minWidth: isMobile ? '100%' : 160, marginRight: isMobile ? 0 : 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Tiến độ thi công</Text>
                                    <Text strong style={{ color: '#fff', fontSize: 11 }}>{journey.progress_pct || 0}%</Text>
                                </div>
                                <Progress
                                    percent={journey.progress_pct || 0}
                                    size="small"
                                    showInfo={false}
                                    strokeColor="#52c41a"
                                    trailColor="rgba(255,255,255,0.15)"
                                    strokeWidth={6}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip title="Số người phụ trách (PM, Kinh doanh, Giám sát, Kỹ thuật)">
                            <Space size={6} style={{ color: '#fff' }}>
                                <UserOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }} />
                                <Text strong style={{ color: '#fff', fontSize: 14 }}>
                                    {assignedPeopleCount}
                                </Text>
                            </Space>
                        </Tooltip>
                        <Tooltip title="Công việc (worktask) tại bước hiện tại — nhấn để mở danh sách">
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => openTaskModal(currentStepCode)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        openTaskModal(currentStepCode);
                                    }
                                }}
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', outline: 'none' }}
                            >
                                <Space size={6} style={{ color: '#fff' }}>
                                    <CarryOutOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }} />
                                    <Text strong style={{ color: '#fff', fontSize: 14 }}>
                                        {currentStepWorkTaskCount}
                                    </Text>
                                </Space>
                            </span>
                        </Tooltip>
                        <Tooltip title="Tài liệu (JourneyDocument) gắn bước hiện tại">
                            <Space size={6} style={{ color: '#fff' }}>
                                <FileTextOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }} />
                                <Text strong style={{ color: '#fff', fontSize: 14 }}>
                                    {currentStepDocumentCount}
                                </Text>
                            </Space>
                        </Tooltip>
                    </div>

                    {isMobile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {(
                                [
                                    {
                                        Icon: UserOutlined,
                                        label: 'Quản lý',
                                        value: toUserList(journey.pm_user).join(', ') || '—',
                                    },
                                    {
                                        Icon: ShopOutlined,
                                        label: 'Kinh doanh',
                                        value: toUserList(journey.sale_users).join(', ') || '—',
                                    },
                                    {
                                        Icon: AuditOutlined,
                                        label: 'Giám sát',
                                        value: toUserList(journey.supervisor_users).join(', ') || '—',
                                    },
                                    {
                                        Icon: ToolOutlined,
                                        label: 'Kỹ thuật',
                                        value: toUserList(journey.technical_users).join(', ') || '—',
                                    },
                                ]
                            ).map(({ Icon, label, value }) => (
                                <div
                                    key={label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 6,
                                        minWidth: 0,
                                        lineHeight: 1.35,
                                    }}
                                >
                                    <Icon style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                                    <div style={{ fontSize: 12, margin: 0, minWidth: 0, flex: 1, color: '#fff' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}: </span>
                                        <span
                                            style={{
                                                color: 'rgba(255,255,255,0.98)',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'anywhere',
                                            }}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, minWidth: 0, lineHeight: 1.3 }}>
                                <FileTextOutlined style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0 }}>Ghi chú:</Text>{' '}
                                    <Tooltip title={journey.delivery_note?.trim() ? journey.delivery_note : undefined}>
                                        <Text ellipsis style={{ fontSize: 12, color: '#fff', margin: 0, display: 'block', maxWidth: '100%' }}>
                                            {journey.delivery_note?.trim() ? journey.delivery_note : '—'}
                                        </Text>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Row gutter={[16, 12]} wrap>
                            <Col xs={24} sm={12} lg={6}>
                                {renderAssignmentPanel('PM', renderAssignmentTags(toUserList(journey.pm_user)))}
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                {renderAssignmentPanel('Giám sát', renderAssignmentTags(toUserList(journey.supervisor_users)))}
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                {renderAssignmentPanel('Kỹ thuật', renderAssignmentTags(toUserList(journey.technical_users)))}
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                {renderAssignmentPanel('Ghi chú bàn giao', journey.delivery_note || 'Chưa có ghi chú', true)}
                            </Col>
                        </Row>
                    )}
                </div>

                {/* Project Snapshot — estimate input fields */}
                {(journey.area_m2 || journey.execution_days || journey.complexity_level) && (
                    <div
                        style={{
                            marginTop: 10,
                            padding: isMobile ? '6px 10px' : '10px 16px',
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: isMobile ? 12 : 24,
                            alignItems: 'center',
                        }}
                    >
                        {journey.area_m2 != null && (
                            <div>
                                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Diện tích</Text>
                                <div>
                                    <Text strong style={{ color: '#fff', fontSize: 14 }}>{journey.area_m2} m²</Text>
                                </div>
                            </div>
                        )}
                        {journey.execution_days != null && (
                            <div>
                                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Thời gian thi công</Text>
                                <div>
                                    <Text strong style={{ color: '#fff', fontSize: 14 }}>{journey.execution_days} ngày</Text>
                                </div>
                            </div>
                        )}
                        {journey.complexity_level && (
                            <div>
                                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Mức độ phức tạp</Text>
                                <div>
                                    <Tag color={journey.complexity_level === 'standard' ? 'blue' : journey.complexity_level === 'difficult' ? 'orange' : 'purple'} style={{ marginTop: 2 }}>
                                        {journey.complexity_level.toUpperCase()}
                                    </Tag>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <Drawer
                title="Lộ trình Công trình"
                placement="right"
                onClose={() => setIsJourneyDrawerVisible(false)}
                open={isJourneyDrawerVisible}
                width={320}
                styles={{ body: { padding: '24px 16px' } }}
            >
                <Alert
                    message="Thông tin lộ trình"
                    description="Nhấp vào từng bước để xem danh sách nhiệm vụ chi tiết."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
                <Steps
                    direction="vertical"
                    size="small"
                    current={currentHeaderStepIndex >= 0 ? currentHeaderStepIndex : 0}
                    onChange={(index) => {
                        const step = HEADER_STEP_CONFIG[index];
                        if (step) {
                            openTaskModal(step.key);
                            setIsJourneyDrawerVisible(false);
                        }
                    }}
                    items={HEADER_STEP_CONFIG.map((step) => {
                        const stats = taskStatsByStep[step.key] || { total: 0, finished: 0, percentage: 0 };
                        let badgeColor = '#d9d9d9';
                        if (stats.total > 0) {
                            if (stats.percentage === 100) badgeColor = '#52c41a';
                            else if (stats.percentage > 50) badgeColor = '#faad14';
                            else badgeColor = '#1890ff';
                        }

                        return {
                            title: (
                                <span
                                    onClick={() => {
                                        openTaskModal(step.key);
                                        setTimeout(() => setIsJourneyDrawerVisible(false), 50);
                                    }}
                                    style={{
                                        color: stats.percentage === 100 ? '#52c41a' : 'inherit',
                                        fontWeight: stats.total > 0 ? 600 : 400,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {step.label}
                                </span>
                            ),
                            description: stats.total > 0 && (
                                <div
                                    onClick={() => {
                                        openTaskModal(step.key);
                                        setTimeout(() => setIsJourneyDrawerVisible(false), 50);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Space size={8} style={{ marginTop: 4 }}>
                                        <Badge
                                            count={stats.total}
                                            style={{
                                                backgroundColor: badgeColor,
                                                color: '#fff',
                                                fontSize: 10
                                            }}
                                        />
                                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                                            Hoàn thành {stats.finished}/{stats.total}
                                        </span>
                                    </Space>
                                </div>
                            )
                        };
                    })}
                />
            </Drawer>

            <Drawer
                placement="right"
                onClose={() => setIsChatDrawerVisible(false)}
                open={isChatDrawerVisible}
                closable={false}
                width={isMobile ? '100%' : chatDrawerLayoutMode === 'expanded' ? 920 : 420}
                styles={{
                    header: { display: 'none' },
                    body: {
                        padding: 0,
                        background: '#ffffff',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <ContentConversationPanel
                    schemaName="Journey"
                    contentId={journey._id}
                    title={`Công trình : ${(journey.request_title || '').trim() || journey.journey_code || '—'}`}
                    subtitle=""
                    onClose={() => setIsChatDrawerVisible(false)}
                    onLayoutModeChange={setChatDrawerLayoutMode}
                    style={{ minHeight: '100%', flex: 1, width: '100%' }}
                />
            </Drawer>

            {/* Estimate readiness warning — shown globally below header */}
            {!(journey.serviceTypeId && journey.area_m2 && journey.execution_days) && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 10 }}
                    message="Hồ sơ chưa đủ dữ liệu để tính dự toán tự động"
                    description={
                        <Space size={4} wrap>
                            <span>
                                Cần có:{' '}
                                {[
                                    !journey.serviceTypeId && 'Dịch vụ yêu cầu',
                                    !journey.area_m2 && 'Diện tích (m²)',
                                    !journey.execution_days && 'Số ngày thi công',
                                ].filter(Boolean).join(', ')}.
                            </span>
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    estimateInputForm.setFieldsValue({
                                        serviceTypeId: journey.serviceTypeId,
                                        area_m2: journey.area_m2,
                                        execution_days: journey.execution_days,
                                        complexity_level: journey.complexity_level || 'standard',
                                    });
                                    setShowEstimateInputModal(true);
                                }}
                            >
                                Bổ sung ngay
                            </Button>
                        </Space>
                    }
                />
            )}

            {/* 360 Tabs Header - Replaced standard Antd Tabs with custom buttons */}
            <Card
                variant="borderless"
                style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                styles={{ body: { padding: isMobile ? '12px' : '20px' } }}
            >
                {!isMobile ? (
                    <Space wrap size={[8, 12]}>
                        {stagedTabItems.map((item) => {
                            const isPriority = (STEP_PRIORITY_TABS[currentStepCode] || []).includes(item.key);
                            const isActive = resolvedActiveTab === item.key;

                            return (
                                <Button
                                    key={item.key}
                                    type={isActive ? 'primary' : 'default'}
                                    onClick={() => setSearchParams({ tab: item.key })}
                                    style={{
                                        borderRadius: 8,
                                        height: 38,
                                        fontWeight: (isActive || isPriority) ? 600 : 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        // Highlight style for priority items when not active
                                        ...(isPriority && !isActive ? {
                                            borderColor: '#fa8c16', // Orange-6
                                            color: '#d46b08', // Orange-7
                                            background: '#fff7e6', // Orange-1
                                            boxShadow: '0 0 4px rgba(250, 140, 22, 0.2)'
                                        } : {}),
                                        // If priority AND active, maybe add a subtle badge or just keep primary?
                                        // Keeping primary but maybe a border
                                        ...(isPriority && isActive ? {
                                            boxShadow: '0 0 0 2px rgba(250, 140, 22, 0.4)'
                                        } : {})
                                    }}
                                >
                                    {isPriority && !isActive && <RocketOutlined style={{ color: '#fa8c16' }} />}
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Space>
                ) : (
                    <Dropdown
                        menu={{
                            items: stagedTabItems.map((item) => {
                                const isPriority = (STEP_PRIORITY_TABS[currentStepCode] || []).includes(item.key);
                                return {
                                    key: item.key,
                                    label: (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <span>{item.label}</span>
                                            {isPriority && (
                                                <Tag color="orange" bordered={false} style={{ fontSize: 10, margin: 0 }}>
                                                    Ưu tiên
                                                </Tag>
                                            )}
                                        </div>
                                    ),
                                    onClick: () => setSearchParams({ tab: item.key }),
                                    style: { padding: '10px 16px' }
                                };
                            }),
                            selectedKeys: [resolvedActiveTab],
                        }}
                        trigger={['click']}
                        placement="bottom"
                    >
                        <Button
                            block
                            type="primary"
                            size="large"
                            style={{
                                borderRadius: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 44,
                                // If the active step is not a priority, but there IS a priority step elsewhere
                                // we might want to hint it here, but maybe it's too much.
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <MenuOutlined />
                                {stagedTabItems.find((t) => t.key === resolvedActiveTab)?.label || 'Chọn giai đoạn'}
                            </span>
                            <DownOutlined style={{ fontSize: 12 }} />
                        </Button>
                    </Dropdown>
                )}
            </Card>

            {/* Stage Content Panel */}
            <div style={{ marginBottom: 32 }}>
                {stagedTabItems.find((item) => item.key === resolvedActiveTab)?.children}
            </div>

            {/* Quick-edit modal for estimate input fields */}
            <Modal
                title={<Space><ExclamationCircleOutlined style={{ color: '#faad14' }} /> Bổ sung thông tin dự toán</Space>}
                open={showEstimateInputModal}
                onCancel={() => setShowEstimateInputModal(false)}
                confirmLoading={isSavingEstimateInput}
                okText="Lưu"
                cancelText="Hủy"
                onOk={async () => {
                    try {
                        await estimateInputForm.validateFields();
                    } catch {
                        return;
                    }
                    const vals = estimateInputForm.getFieldsValue();
                    setIsSavingEstimateInput(true);
                    try {
                        await journeyService.updateJourney(journey._id, {
                            serviceTypeId: vals.serviceTypeId,
                            area_m2: vals.area_m2,
                            execution_days: vals.execution_days,
                            complexity_level: vals.complexity_level,
                        });
                        message.success('Đã cập nhật thông tin dự toán.');
                        setShowEstimateInputModal(false);
                        fetchJourney();
                    } catch (err) {
                        message.error('Lỗi khi lưu: ' + (err instanceof Error ? err.message : 'Unknown'));
                    } finally {
                        setIsSavingEstimateInput(false);
                    }
                }}
                width={480}
                destroyOnHidden
            >
                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="3 trường bắt buộc để hệ thống tự động tính dự toán: Dịch vụ, Diện tích, Số ngày thi công."
                />
                <Form form={estimateInputForm} layout="vertical">
                    <Form.Item
                        label="Dịch vụ yêu cầu"
                        name="serviceTypeId"
                        rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
                    >
                        <MasterDataSelect
                            category="service_type"
                            placeholder="Chọn loại dịch vụ..."
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Diện tích (m²)"
                                name="area_m2"
                                rules={[{ required: true, message: 'Bắt buộc' }, { type: 'number', min: 1, message: '> 0' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="VD: 50" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số ngày thi công"
                                name="execution_days"
                                rules={[{ required: true, message: 'Bắt buộc' }, { type: 'number', min: 1, message: '> 0' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="VD: 30" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Mức độ phức tạp" name="complexity_level">
                        <Select>
                            <Select.Option value="standard">Standard — Tiêu chuẩn</Select.Option>
                            <Select.Option value="difficult">Difficult — Phức tạp</Select.Option>
                            <Select.Option value="very_difficult">Very Difficult — Rất phức tạp</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                .journey-dark-steps .ant-steps-item-wait .ant-steps-item-icon { background-color: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; }
                .journey-dark-steps .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon { color: rgba(255,255,255,0.4) !important; }
                .journey-dark-steps .ant-steps-item-process .ant-steps-item-icon { background-color: #1890ff !important; border-color: #1890ff !important; }
                .journey-dark-steps .ant-steps-item-process .ant-steps-item-title { color: #fff !important; }
                .journey-dark-steps .ant-steps-item-finish .ant-steps-item-icon { background-color: transparent !important; border-color: rgba(255,255,255,0.6) !important; }
                .journey-dark-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon { color: rgba(255,255,255,0.6) !important; }
            `}</style>

            {/* Modals for Sale */}
            {role === 'sale' && (
                <>
                    <Modal
                        title="Ghi log tư vấn"
                        open={showLogModal}
                        onCancel={() => setShowLogModal(false)}
                        footer={null}
                        width={600}
                    >
                        <ConsultationLogForm
                            onSubmit={(values) => {
                                console.log('Log submitted:', values);
                                message.success("Đã lưu log tư vấn!");
                                setShowLogModal(false);
                            }}
                            onCancel={() => setShowLogModal(false)}
                        />
                    </Modal>

                    <Modal
                        title="Ghi chú Follow-up"
                        open={showFollowUpModal}
                        onCancel={() => setShowFollowUpModal(false)}
                        onOk={() => {
                            followUpForm.validateFields().then(values => {
                                console.log('Follow-up values:', values);
                                message.success("Đã cập nhật follow-up!");
                                setShowFollowUpModal(false);
                            });
                        }}
                    >
                        <Form form={followUpForm} layout="vertical">
                            <Form.Item label="Thời điểm follow-up" name="follow_up_at" rules={[{ required: true }]}>
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Phản hồi của khách" name="customer_response" rules={[{ required: true }]}>
                                <TextArea rows={3} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}

            {/* Modals + drawer PM (mã vai trò: QL) */}
            {isPmManager && (
                <>
                    <Modal
                        title="Giao việc & phân công"
                        open={showDispatchWorkModal}
                        onCancel={() => setShowDispatchWorkModal(false)}
                        onOk={handleDispatchWorkModalOk}
                        okText="Giao việc"
                        okButtonProps={{ icon: <PartitionOutlined /> }}
                        cancelText="Hủy"
                        confirmLoading={isSubmitting}
                        width={560}
                        destroyOnHidden
                    >
                        <Alert
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                            message="Cập nhật phân công trên công trình, sau đó tạo lại danh sách WorkTask từ checklist (xóa toàn bộ nhiệm vụ hiện tại của công trình). Mỗi mục checklist cần khớp người phụ trách theo vai trò (assignee + assignee_role)."
                        />
                        {dispatchWorkError && (
                            <Alert
                                type="error"
                                showIcon
                                style={{ marginBottom: 16, whiteSpace: 'pre-line' }}
                                message="Không thể giao việc"
                                description={dispatchWorkError}
                                closable
                                onClose={() => setDispatchWorkError(null)}
                            />
                        )}
                        <Form form={dispatchWorkForm} layout="vertical">
                            <Form.Item label="Quản lý dự án — QL (PM)" name="pm_user">
                                <AuthorizedUserSelect allowMultiple={false} placeholder="Chọn PM" />
                            </Form.Item>
                            <Form.Item label="Kinh doanh — KD" name="sale_users">
                                <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Kinh doanh phụ trách" />
                            </Form.Item>
                            <Form.Item label="Giám sát — GS" name="supervisor_users">
                                <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Giám sát" />
                            </Form.Item>
                            <Form.Item label="Kỹ thuật — KYT" name="technical_users">
                                <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Kỹ thuật" />
                            </Form.Item>
                            <Form.Item label="Ghi chú bàn giao/phối hợp" name="delivery_note">
                                <TextArea rows={3} placeholder="Nhập ghi chú cho đội ngũ thực hiện..." />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Đổi mức ưu tiên"
                        open={showPriorityModal}
                        onCancel={() => setShowPriorityModal(false)}
                        onOk={() => {
                            priorityForm.validateFields().then(async values => {
                                setIsSubmitting(true);
                                try {
                                    await journeyService.updateJourney(journey._id, { priority: values.priority });
                                    message.success("Đã đổi mức ưu tiên!");
                                    setShowPriorityModal(false);
                                    fetchJourney();
                                } catch (error) {
                                    message.error("Lỗi khi cập nhật mức ưu tiên");
                                } finally {
                                    setIsSubmitting(false);
                                }
                            });
                        }}
                    >
                        <Form form={priorityForm} layout="vertical" initialValues={{ priority: journey.priority }}>
                            <Form.Item label="Mức ưu tiên" name="priority">
                                <Select>
                                    <Select.Option value="low">⚪ Thấp</Select.Option>
                                    <Select.Option value="medium">🔵 Trung bình</Select.Option>
                                    <Select.Option value="high">🟠 Cao</Select.Option>
                                    <Select.Option value="critical">🔴 Khẩn cấp</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Publish lên Portal"
                        open={showPublishModal}
                        onCancel={() => setShowPublishModal(false)}
                        onOk={() => { message.success("Publish thành công!"); setShowPublishModal(false); }}
                        width={publishTab === 'preview' ? 1000 : 600}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Tabs
                            activeKey={publishTab}
                            onChange={setPublishTab}
                            centered
                            style={{ marginBottom: 0 }}
                            items={[
                                {
                                    key: 'settings',
                                    label: 'Cấu hình Publish',
                                    children: (
                                        <div style={{ padding: 24 }}>
                                            <Alert
                                                type="info"
                                                showIcon
                                                message="Khách hàng sẽ thấy các thay đổi mới trên Portal sau khi bạn publish."
                                                style={{ marginBottom: 20 }}
                                            />
                                            <Form layout="vertical">
                                                <Form.Item label={<Text strong>Nội dung publish</Text>}>
                                                    <Checkbox.Group
                                                        options={['Tổng quan', 'Timeline', 'Tài liệu']}
                                                        defaultValue={['Tổng quan', 'Timeline']}
                                                    />
                                                </Form.Item>
                                                <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                                                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Link Portal khách hàng</Text>
                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                                                        <Text ellipsis style={{ flex: 1, color: '#1890ff' }}>
                                                            {`${window.location.origin}/portal/journeys/${journey._id}`}
                                                        </Text>
                                                        <Space>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<PaperClipOutlined />}
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${window.location.origin}/portal/journeys/${journey._id}`);
                                                                    message.success("Đã copy link portal!");
                                                                }}
                                                            >
                                                                Copy
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<SendOutlined />}
                                                                onClick={() => window.open(`/portal/journeys/${journey._id}`, '_blank')}
                                                            >
                                                                Mở
                                                            </Button>
                                                        </Space>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    )
                                },
                                {
                                    key: 'preview',
                                    label: 'Xem trước giao diện',
                                    children: (
                                        <div style={{
                                            padding: isMobile ? 8 : 24,
                                            background: '#f0f2f5',
                                            maxHeight: '70vh',
                                            overflowY: 'auto'
                                        }}>
                                            <PortalDashboard journey={journey as any} isPreview />
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Modal>

                    <JourneyUpsertDrawer
                        open={isEditDrawerVisible}
                        mode={role === 'KD' ? 'sale' : 'pm'}
                        journey={journey}
                        saving={isSubmitting}
                        currentUsername={user?.username || undefined}
                        onCancel={() => setIsEditDrawerVisible(false)}
                        onSubmit={async (values) => {
                            setIsSubmitting(true);
                            try {
                                await journeyService.updateJourney(journey._id, values);
                                message.success("Cập nhật công trình thành công!");
                                setIsEditDrawerVisible(false);
                                fetchJourney();
                            } catch (error) {
                                message.error("Lỗi khi cập nhật");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                    />
                </>
            )}

            <Modal
                title={selectedStepMeta ? `Danh sách công việc: ${selectedStepMeta.label}` : 'Danh sách công việc'}
                open={Boolean(selectedTaskStepCode)}
                onCancel={() => setSelectedTaskStepCode(null)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8 }}>
                        {canFinalizeStepInTaskModal ? (
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                loading={isCompletingStepFromModal}
                                disabled={hasPendingTasksForSelectedStep}
                                onClick={() => void handleCompleteStepFromTaskModal()}
                                style={
                                    !hasPendingTasksForSelectedStep
                                        ? { background: '#52c41a', borderColor: '#52c41a' }
                                        : {}
                                }
                            >
                                Xác nhận hoàn thành bước
                            </Button>
                        ) : null}
                        <Button onClick={() => setSelectedTaskStepCode(null)}>Đóng</Button>
                    </div>
                }
                width={720}
            >
                {isPmManager && !isLoading && (!selectedStepMeta || journey?.current_step !== selectedTaskStepCode) && (
                    <Alert
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        message="Hỗ trợ xử lý thông tin bước"
                        description={
                            <div style={{ marginTop: 8 }}>
                                <Text style={{ display: 'block', marginBottom: 12, fontSize: 13, color: 'rgba(0, 0, 0, 0.45)' }}>
                                    Bước hiện tại của hồ sơ có thể đang bị lỗi hoặc không khớp với dữ liệu quy chuẩn.
                                    Quản lý có quyền thiết lập lại về một bước hợp lệ trong quy trình.
                                </Text>
                                <Space wrap>
                                    <Select
                                        style={{ width: 280 }}
                                        placeholder="Chọn bước muốn chuyển đến..."
                                        value={resetStepCode}
                                        onChange={setResetStepCode}
                                        options={HEADER_STEP_CONFIG.map(s => ({ label: s.label, value: s.key }))}
                                    />
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={handleResetJourneyStep}
                                        disabled={!resetStepCode}
                                        loading={isSubmitting}
                                    >
                                        Cập nhật bước
                                    </Button>
                                </Space>
                            </div>
                        }
                        style={{ marginBottom: 16 }}
                    />
                )}
                <StepWorkTaskList
                    tasks={selectedStepTasks}
                    loading={isLoadingTasks}
                    reportCounts={reportCountByTask}
                    currentUserId={user?._id}
                    currentUserRoles={[...(availableRoles ?? []), role].filter((item): item is string => Boolean(item))}
                    onStatusUpdate={handleStatusUpdate}
                    onCreateReport={(task) => {
                        setSelectedTaskForReport(task);
                        setIsReportModalOpen(true);
                    }}
                    onViewReports={(task) => {
                        const primaryTaskTab = getPrimaryJourneyTabForStep(task.journey_step_code || selectedTaskStepCode);
                        const targetTab = visibleJourneyTabKeys.includes('GRP_08_CONSTRUCT')
                            ? 'GRP_08_CONSTRUCT'
                            : visibleJourneyTabKeys.includes(primaryTaskTab)
                                ? primaryTaskTab
                                : (visibleJourneyTabKeys[0] || 'GRP_01_INFO');
                        setSearchParams(
                            targetTab === 'GRP_08_CONSTRUCT'
                                ? { tab: targetTab, reportTaskId: task._id }
                                : { tab: targetTab }
                        );
                        setSelectedTaskStepCode(null);
                        setIsJourneyDrawerVisible(false);
                    }}
                    onTaskActionClick={handleWorkTaskActionClick}
                    readOnly={isTaskModalReadOnly}
                    canManageWorkTasks={isPmManager && !isTaskModalReadOnly}
                    canOverrideStatusUpdate={canOverrideTaskStatusInModal}
                    onAddWorkTask={() => setIsCreateWorkTaskModalOpen(true)}
                    onDeleteWorkTask={(task) => void handleDeleteWorkTaskFromModal(task)}
                />
            </Modal>

            <Modal
                title="Thêm công việc"
                open={isCreateWorkTaskModalOpen}
                onCancel={() => {
                    setIsCreateWorkTaskModalOpen(false);
                    createWorkTaskForm.resetFields();
                }}
                onOk={() => void handleSubmitNewWorkTask()}
                okText="Tạo"
                destroyOnClose
                width={480}
            >
                <Form
                    form={createWorkTaskForm}
                    layout="vertical"
                    preserve={false}
                    initialValues={{ is_required: false, assignee_role: 'QL' as WorkTaskAssigneeRoleEnum2 }}
                >
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                        <Input placeholder="Tên công việc" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Mô tả ngắn (tuỳ chọn)" />
                    </Form.Item>
                    <Form.Item
                        name="assignee_role"
                        label="Vai trò được giao"
                        rules={[{ required: true, message: 'Chọn vai trò' }]}
                    >
                        <Select
                            options={WORKTASK_ASSIGNEE_ROLES.map((r) => ({
                                value: r,
                                label: `${r} — ${JOURNEY_ASSIGNMENT_HINT_BY_ROLE[r] || r}`,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="is_required" label="Công việc bắt buộc" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

            <CreateJourneyDocumentModal
                open={showCreateDocModal}
                onCancel={() => {
                    setShowCreateDocModal(false);
                    setEditingDoc(null);
                }}
                onSuccess={() => {
                    setShowCreateDocModal(false);
                    setEditingDoc(null);
                    window.dispatchEvent(new CustomEvent('journey-documents-updated'));
                }}
                journeyId={journeyId!}
                stepCode={journey?.current_step}
                editingDoc={editingDoc}
            />

            <CreateSiteReportModal
                open={isReportModalOpen}
                onCancel={() => {
                    setIsReportModalOpen(false);
                    setSelectedTaskForReport(null);
                }}
                onSuccess={() => {
                    setIsReportModalOpen(false);
                    setSelectedTaskForReport(null);
                    fetchWorkTasks();
                    window.dispatchEvent(new CustomEvent('journey-site-reports-updated'));
                }}
                journeyId={journeyId!}
                stepCode={selectedTaskForReport?.journey_step_code || selectedTaskStepCode || ''}
                taskId={selectedTaskForReport?._id}
                taskTitle={selectedTaskForReport?.title}
            />

            <WorkTaskActionModals
                context={workTaskActionContext}
                journey={journey}
                onClose={() => setWorkTaskActionContext(null)}
                onJourneyUpdated={async () => {
                    await fetchJourney();
                    fetchWorkTasks();
                    window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
                }}
                onNavigateTab={(tab) => setSearchParams({ tab })}
            />

            <JourneyHistoryModal
                open={showHistoryModal}
                onCancel={() => setShowHistoryModal(false)}
                journeyId={journeyId}
                journeyCode={journey?.journey_code}
            />
        </div>
    );
};

export default JourneyDetail360;
