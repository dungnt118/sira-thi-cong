import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import {
    Card, Tabs, Tag, Button, Space, Typography, Row, Col,
    Badge, Statistic, Timeline, Descriptions, Modal, Drawer,
    Form, Select, Alert, Checkbox, message, Steps, Empty,
    DatePicker, Input, Grid, List, Tooltip, Avatar, Divider
} from 'antd';
import {
    CalendarOutlined, FileSearchOutlined, CalculatorOutlined, FileTextOutlined,
    BoxPlotOutlined, DollarOutlined,
    ArrowLeftOutlined, UserOutlined, FlagOutlined,
    SendOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
    ClockCircleOutlined, MessageOutlined, CloseCircleOutlined,
    TeamOutlined,
    FormOutlined, PaperClipOutlined, EditOutlined, RocketOutlined, PlusOutlined,
    AuditOutlined, ProjectOutlined, HistoryOutlined, ArrowRightOutlined,
    ShopOutlined, ToolOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { JourneyStepRenderer, StepLabor, StepMaterials } from '../JourneySteps';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import { CreateJourneyDocumentModal } from '../../../components/journey/CreateJourneyDocumentModal';
import { CreateSiteReportModal } from '../../../components/journey/CreateSiteReportModal';
import { ContentConversationPanel, type ChatPanelLayoutMode } from '../../../components/chatbox';
import PortalDashboard from '../../../components/portal/PortalDashboard';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import { siteReportService } from '../../../services/core-contracts/services/siteReport.service';
import { customerJourneySettingService } from '../../../services/core-contracts/services/customerJourneySetting.service';
import { employeeService } from '../../../services/core-contracts/services/employee.service';
import { journeyStepLogService } from '../../../services/core-contracts/services/journeyStepLog.service';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import type { ICustomerJourneySetting, IRolesItem } from '../../../services/core-contracts/types/customerJourneySetting.types';
import { IWorkTask } from '../../../services/core-contracts/types/workTask.types';
import { IJourneyStepLog } from '../../../services/core-contracts/types/journeyStepLog.types';
import { AuthorizedUserSelect } from '../../../components/authorizedusers/AuthorizedUser';
import { mockJourneyTemplates } from '../../../data/journeyMockData';
import type { GoNoGoStatus, SlaStatus, PortalPublishStatus } from '../../../types/journey';
import JourneyUpsertDrawer from '../../../components/journey/JourneyUpsertDrawer';
import { StepWorkTaskList } from '../../../components/journey/StepWorkTaskList';
import { JourneyDocumentsTab } from '../../../components/journey/JourneyDocumentsTab';

const { Text, Title } = Typography;
const { TextArea } = Input;

import {
    JourneyHistoryModal,
    SLA_CONFIG,
    HEADER_STEP_CONFIG
} from './components/JourneyHistoryModal';

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

const toUserList = (value: unknown): string[] => {
    if (!value) {
        return [];
    }

    return Array.isArray(value)
        ? value.filter((item): item is string => Boolean(item)).map((item) => String(item))
        : [String(value)];
};

/** Thứ tự bước trùng `CustomerJourneySetting` — ghép cùng chỉ số với `journeySteps` (mock template). */
const CUSTOMER_JOURNEY_SETTING_STEP_CODES = [
    'lead_intake',
    'qualification',
    'survey_planning',
    'site_survey',
    'survey_review',
    'estimate_preparation',
    'quotation_preparation',
    'quotation_sent',
    'quotation_approved',
    'contract_signing',
    'project_execution',
    'handover_acceptance',
    'warranty_aftercare',
] as const;

const DOCUMENT_PERMISSION_VALUES = new Set(['edit', 'submit', 'commit']);

const normalizeRoleKey = (value: string | undefined) => (value || '').trim().toUpperCase();

const getSettingStepPayload = (setting: ICustomerJourneySetting | null, stepCode: string): unknown => {
    if (!setting) {
        return null;
    }

    const fieldData = (setting as unknown as Record<string, unknown>)[stepCode];
    if (Array.isArray(fieldData)) {
        return fieldData[0] ?? null;
    }

    return fieldData ?? null;
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
    const { role, isAdmin, user } = useAuth();
    /** PM trong app = mã QL (route /admin/ql); từng có nhầm `role === 'pm'` nên modal không mount. */
    const isPmManager =
        isAdmin ||
        (typeof role === 'string' && ['QL', 'PM'].includes(role.toUpperCase()));

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
    const [reportCountByTask, setReportCountByTask] = useState<Record<string, number>>({});

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
            console.error('Failed to fetch journey:', error);
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

    useEffect(() => {
        if (activeTab === 'GRP_06_CONTRACT') {
            setSearchParams({ tab: 'GRP_01_INFO' });
        }
    }, [activeTab, setSearchParams]);

    useEffect(() => {
        let cancelled = false;
        void customerJourneySettingService.findSetting().then((data) => {
            if (!cancelled && data) {
                setCustomerJourneySetting(data);
            }
        }).catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    // Resolve template/steps
    const template = mockJourneyTemplates.find(t => t.id === 'default') || mockJourneyTemplates[0];
    const journeySteps = template?.steps || [];
    const currentStepCode = journey?.current_step || 'lead_new';
    const currentHeaderStepIndex = HEADER_STEP_CONFIG.findIndex((step) => step.key === currentStepCode);

    const [showAssignModal, setShowAssignModal] = useState(false);
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
    const [publishTab, setPublishTab] = useState('settings');
    const [assignForm] = Form.useForm();
    const [priorityForm] = Form.useForm();
    const [followUpForm] = Form.useForm();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedTaskForReport, setSelectedTaskForReport] = useState<IWorkTask | null>(null);
    const [modal, modalContextHolder] = Modal.useModal();

    /** Xử lý khởi tạo nhiệm vụ hàng loạt theo cấu hình */
    const handleInitializeTasks = () => {
        console.log("handleInitializeTasks triggered");
        modal.confirm({
            title: 'Khởi tạo danh sách công việc?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hệ thống sẽ XÓA các nhiệm vụ hiện tại (nếu có) của công trình này và tạo mới dựa trên cấu hình mẫu. Bạn có chắc chắn?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                console.log("Initialization confirmed");
                setIsSubmitting(true);
                try {
                    // 1. Fetch singleton setting
                    const setting = await customerJourneySettingService.findSetting();
                    if (!setting) {
                        message.error("Không tìm thấy cấu hình mẫu (CustomerJourneySetting)");
                        return;
                    }

                    // 2. Clear old tasks for this journey (using high limit to ensure all are found)
                    const res = await workTaskService.queryContent({
                        group: { id: 'journey_id', operation: 'eq', value: journeyId },
                        limit: 200
                    } as any);
                    if (res?.data?.length) {
                        console.log(`Found ${res.data.length} old tasks to delete`);
                        await workTaskService.deleteMultiWorkTask(res.data.map(t => t._id));
                    }

                    // 3. Batch create new tasks from setting checklist
                    const stages = [
                        { code: 'lead_intake', data: setting.lead_intake },
                        { code: 'qualification', data: setting.qualification },
                        { code: 'survey_planning', data: setting.survey_planning },
                        { code: 'site_survey', data: setting.site_survey },
                        { code: 'survey_review', data: setting.survey_review },
                        { code: 'estimate_preparation', data: setting.estimate_preparation },
                        { code: 'quotation_preparation', data: setting.quotation_preparation },
                        { code: 'quotation_sent', data: setting.quotation_sent },
                        { code: 'quotation_approved', data: setting.quotation_approved },
                        { code: 'contract_signing', data: setting.contract_signing },
                        { code: 'project_execution', data: setting.project_execution },
                        { code: 'handover_acceptance', data: setting.handover_acceptance },
                        { code: 'warranty_aftercare', data: setting.warranty_aftercare },
                    ];

                    const tasksToCreate: any[] = [];
                    for (const stage of stages) {
                        if (stage.data?.is_enabled && stage.data.checklist?.length) {
                            for (const item of stage.data.checklist) {
                                tasksToCreate.push({
                                    journey_id: journeyId,
                                    journey_step_code: stage.code,
                                    title: item.name,
                                    description: item.description,
                                    is_required: item.is_required,
                                    status: 'pending'
                                });
                            }
                        }
                    }

                    if (tasksToCreate.length > 0) {
                        console.log(`Sending ${tasksToCreate.length} tasks to bulk create`);
                        await workTaskService.saveManyWorkTasks(tasksToCreate);
                    }

                    console.log(`Successfully initialized ${tasksToCreate.length} tasks`);
                    message.success(`Đã khởi tạo ${tasksToCreate.length} nhiệm vụ công việc thành công!`);

                    fetchJourney();
                    // Dispatch event for components to refresh
                    window.dispatchEvent(new CustomEvent('journey-tasks-updated'));
                } catch (error) {
                    console.error("Initialize tasks error:", error);
                    message.error("Lỗi khi khởi tạo công việc: " + (error instanceof Error ? error.message : "Unknown error"));
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
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
            if (customerJourneySetting && role) {
                CUSTOMER_JOURNEY_SETTING_STEP_CODES.forEach((stepCode, index) => {
                    const stepPayload = getSettingStepPayload(customerJourneySetting, stepCode);
                    if (!stepPayload || typeof stepPayload !== 'object') {
                        return;
                    }

                    const roles = (stepPayload as { roles?: IRolesItem[] }).roles;
                    if (!hasRoleDocumentPermissionFromStepRoles(roles, role)) {
                        return;
                    }

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

    const selectedStepMeta = useMemo(
        () => HEADER_STEP_CONFIG.find((step) => step.key === selectedTaskStepCode) || null,
        [selectedTaskStepCode]
    );

    const selectedStepTasks = useMemo(
        () => workTasks.filter((task) => task.journey_step_code === selectedTaskStepCode),
        [selectedTaskStepCode, workTasks]
    );

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

    const renderTabContent = (groupCode: string, stepCode: string) => {
        if (!journey) return null;
        const isEditable = userRoleConfig.editableGroupCodes.includes(groupCode);
        const isFinalizable = userRoleConfig.finalizableGroupCodes.includes(groupCode);
        return (
            <JourneyStepRenderer
                stepCode={stepCode}
                journeyId={journey._id}
                isEditable={isEditable}
                canFinalize={isFinalizable}
                journeyCurrentStep={journey.current_step}
                workTasks={workTasks}
                stepLabel={HEADER_STEP_CONFIG.find(s => s.key === journey.current_step)?.label}
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
            label: <span><ExclamationCircleOutlined /> Nhật ký thi công</span>,
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
                            {canCreateJourneyDocument && (
                                <Button icon={<FileTextOutlined />} onClick={() => { setEditingDoc(null); setShowCreateDocModal(true); }}>{isMobile ? '' : 'Tạo tài liệu'}</Button>
                            )}
                            {(currentHeaderStepIndex < 0 || currentHeaderStepIndex < 5) && (
                                <Button
                                    icon={<RocketOutlined />}
                                    onClick={handleInitializeTasks}
                                    loading={isSubmitting}
                                >
                                    {isMobile ? '' : 'Khởi tạo công việc'}
                                </Button>
                            )}
                            <Button icon={<EditOutlined />} onClick={() => setIsEditDrawerVisible(true)}>{isMobile ? '' : 'Sửa công trình'}</Button>
                            <Button icon={<UserOutlined />} onClick={() => setShowAssignModal(true)}>{isMobile ? '' : 'Phân công'}</Button>
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

                        {!isMobile && (
                            <div style={{ marginTop: 12 }}>
                                <Space size="middle">
                                    <CalendarOutlined style={{ color: 'rgba(255,255,255,0.6)' }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                                        Kế hoạch: <Text strong style={{ color: '#fff', marginLeft: 4 }}>
                                            {journey.planned_start_date ? dayjs(journey.planned_start_date).format('DD/MM/YYYY') : 'Chưa định ngày'}
                                        </Text>
                                        <Text style={{ margin: '0 8px', color: 'rgba(255,255,255,0.4)' }}>➔</Text>
                                        <Text strong style={{ color: '#fff' }}>
                                            {journey.planned_end_date ? dayjs(journey.planned_end_date).format('DD/MM/YYYY') : 'Chưa định ngày'}
                                        </Text>
                                    </Text>
                                </Space>
                            </div>
                        )}

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
                        <Space style={{ marginBottom: 0, minWidth: 0, flex: '1 1 auto' }} size={8}>
                            <TeamOutlined style={{ color: '#fff', flexShrink: 0 }} />
                            <Text
                                strong
                                style={{
                                    color: '#fff',
                                    minWidth: 0,
                                    ...(isMobile
                                        ? { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                                        : {}),
                                }}
                            >
                                Điều phối nhân sự
                            </Text>
                        </Space>
                        {isMobile && (
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
                        )}
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

                {HEADER_STEP_CONFIG.length > 0 && !isMobile && (
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
                        <Steps
                            size="small"
                            current={currentHeaderStepIndex >= 0 ? currentHeaderStepIndex : 0}
                            onChange={(index) => {
                                const step = HEADER_STEP_CONFIG[index];
                                if (step) {
                                    openTaskModal(step.key);
                                }
                            }}
                            items={HEADER_STEP_CONFIG.map((step) => {
                                const stats = taskStatsByStep[step.key] || { total: 0, finished: 0, percentage: 0 };
                                let badgeColor = 'rgba(255,255,255,0.25)';
                                if (stats.total > 0) {
                                    if (stats.percentage === 100) badgeColor = '#52c41a';
                                    else if (stats.percentage > 50) badgeColor = '#faad14';
                                    else badgeColor = '#1890ff';
                                }

                                return {
                                    title: (
                                        <span
                                            onClick={() => openTaskModal(step.key)}
                                            style={{
                                                color: stats.percentage === 100 ? '#52c41a' : 'rgba(255,255,255,0.85)',
                                                fontSize: 12,
                                                whiteSpace: 'nowrap',
                                                fontWeight: stats.total > 0 ? 600 : 400,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {step.label}
                                        </span>
                                    ),
                                    description: stats.total > 0 ? (
                                        <div
                                            onClick={() => openTaskModal(step.key)}
                                            style={{ marginTop: -4, cursor: 'pointer' }}
                                        >
                                            <Space size={4} align="center">
                                                <Badge
                                                    count={stats.total}
                                                    overflowCount={99}
                                                    style={{
                                                        backgroundColor: badgeColor,
                                                        color: '#fff',
                                                        boxShadow: 'none',
                                                        fontSize: 9,
                                                        height: 14,
                                                        lineHeight: '14px',
                                                        minWidth: 14,
                                                        padding: '0 4px'
                                                    }}
                                                />
                                                <span style={{
                                                    color: 'rgba(255,255,255,0.6)',
                                                    fontSize: 10,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {stats.finished}/{stats.total}
                                                </span>
                                            </Space>
                                        </div>
                                    ) : null
                                };
                            })}
                            className="journey-dark-steps"
                        />
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

            {/* 360 Tabs */}
            <Card style={{ borderRadius: 10 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setSearchParams({ tab: key })}
                    items={tabItems}
                    size="small"
                />
            </Card>

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
                        title="Phân công phụ trách"
                        open={showAssignModal}
                        onCancel={() => setShowAssignModal(false)}
                        onOk={() => {
                            assignForm.validateFields().then(async values => {
                                setIsSubmitting(true);
                                try {
                                    await journeyService.updateJourney(journey._id, {
                                        pm_user: values.pm_user,
                                        supervisor_users: values.supervisor_users,
                                        technical_users: values.technical_users,
                                        delivery_note: values.delivery_note
                                    });
                                    message.success("Đã phân công nhân sự!");
                                    setShowAssignModal(false);
                                    fetchJourney();
                                } catch (error) {
                                    message.error("Lỗi khi phân công");
                                } finally {
                                    setIsSubmitting(false);
                                }
                            });
                        }}
                    >
                        <Form form={assignForm} layout="vertical" initialValues={{
                            pm_user: journey.pm_user,
                            supervisor_users: journey.supervisor_users,
                            technical_users: journey.technical_users,
                            delivery_note: journey.delivery_note
                        }}>
                            <Form.Item label="Quản lý dự án (PM)" name="pm_user">
                                <AuthorizedUserSelect allowMultiple={false} placeholder="Chọn PM" />
                            </Form.Item>
                            <Form.Item label="Giám sát (Supervisors)" name="supervisor_users">
                                <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Giám sát" />
                            </Form.Item>
                            <Form.Item label="Kỹ thuật (Technical)" name="technical_users">
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
                                                            {`${window.location.origin}/portal/journeys/${journey.journey_code}`}
                                                        </Text>
                                                        <Space>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<PaperClipOutlined />}
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${window.location.origin}/portal/journeys/${journey.journey_code}`);
                                                                    message.success("Đã copy link portal!");
                                                                }}
                                                            >
                                                                Copy
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<SendOutlined />}
                                                                onClick={() => window.open(`/portal/journeys/${journey.journey_code}`, '_blank')}
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
                footer={null}
                width={720}
            >
                {(() => {
                    const selectedTaskStepIndex = HEADER_STEP_CONFIG.findIndex((s) => s.key === selectedTaskStepCode);
                    const isTaskReadOnly = selectedTaskStepIndex > currentHeaderStepIndex;
                    return (
                        <StepWorkTaskList
                            tasks={selectedStepTasks}
                            loading={isLoadingTasks}
                            reportCounts={reportCountByTask}
                            onStatusUpdate={handleStatusUpdate}
                            onCreateReport={(task) => {
                                setSelectedTaskForReport(task);
                                setIsReportModalOpen(true);
                            }}
                            onViewReports={() => {
                                setSearchParams({ tab: 'GRP_08_CONSTRUCT' });
                                setSelectedTaskStepCode(null);
                                setIsJourneyDrawerVisible(false);
                            }}
                            readOnly={isTaskReadOnly}
                        />
                    );
                })()}
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

