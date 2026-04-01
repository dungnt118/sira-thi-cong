import React, { useState, useMemo, useEffect } from 'react';
import {
    Card, Tabs, Tag, Button, Space, Typography, Row, Col,
    Badge, Statistic, Timeline, Descriptions, Modal, Drawer,
    Form, Select, Alert, Checkbox, message, Steps, Empty,
    DatePicker, Input, Grid
} from 'antd';
import {
    CalendarOutlined, FileSearchOutlined, CalculatorOutlined, FileTextOutlined,
    BoxPlotOutlined, DollarOutlined,
    ArrowLeftOutlined, UserOutlined, FlagOutlined,
    SendOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
    ClockCircleOutlined, MessageOutlined,
    TeamOutlined,
    FormOutlined, PaperClipOutlined, EditOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { JourneyStepRenderer, StepLabor, StepMaterials } from '../../shared/JourneySteps';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import PortalDashboard from '../../../components/portal/PortalDashboard';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { employeeService } from '../../../services/core-contracts/services/employee.service';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import { mockJourneyTemplates } from '../../../data/journeyMockData';
import type { GoNoGoStatus, SlaStatus, PortalPublishStatus } from '../../../types/journey';
import JourneyForm from './JourneyForm';

const { Text, Title } = Typography;
const { TextArea } = Input;

const GO_NO_GO_CONFIG: Record<GoNoGoStatus, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    go: { label: 'GO ✓', color: 'success' },
    no_go: { label: 'NO-GO ✗', color: 'error' },
    on_hold: { label: 'Tạm hoãn', color: 'warning' },
    pending: { label: 'Chờ xét', color: 'processing' },
};
const SLA_CONFIG: Record<SlaStatus, { label: string; color: string }> = {
    ontime: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};
const PORTAL_CONFIG: Record<PortalPublishStatus, { label: string; color: string }> = {
    hidden: { label: 'Ẩn', color: 'default' },
    partial: { label: 'Một phần', color: 'blue' },
    published: { label: 'Đã publish', color: 'success' },
};

const JourneyDetail360: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'GRP_01_INFO';
    const navigate = useNavigate();
    const { role } = useAuth();

    const [journey, setJourney] = useState<IJourney | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);

    const fetchJourney = async () => {
        if (!journeyId) return;
        setIsLoading(true);
        try {
            const data = await journeyService.findJourneyDto(journeyId);
            setJourney(data);
        } catch (error) {
            console.error('Failed to fetch journey:', error);
            message.error('Không thể tải thông tin hành trình');
        } finally {
            setIsLoading(false);
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

    useEffect(() => {
        fetchJourney();
        fetchEmployees();
    }, [journeyId]);

    // Resolve template/steps
    const template = mockJourneyTemplates.find(t => t.id === 'default') || mockJourneyTemplates[0];
    const journeySteps = template?.steps || [];
    const currentStepIndex = journeySteps.findIndex(s => s.step_code === journey?.current_step);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [publishTab, setPublishTab] = useState('settings');
    const [assignForm] = Form.useForm();
    const [priorityForm] = Form.useForm();
    const [followUpForm] = Form.useForm();

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    // Resolve which tabs/steps this user can see and edit
    const userRoleConfig = useMemo(() => {
        if (!role) return { allowedGroupCodes: [], editableGroupCodes: [], finalizableGroupCodes: [] };

        const allowedGroupCodes: string[] = [];
        const editableGroupCodes: string[] = [];
        const finalizableGroupCodes: string[] = [];

        if (role === 'pm') {
            // PM sees everything, can edit and can finalize
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
        }

        return {
            allowedGroupCodes: [...new Set(allowedGroupCodes)],
            editableGroupCodes: [...new Set(editableGroupCodes)],
            finalizableGroupCodes: [...new Set(finalizableGroupCodes)]
        };
    }, [role, journeySteps]);

    if (!journey) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy hành trình" />
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
                onRefresh={fetchJourney}
            />
        );
    };

    const tabItems = [
        // 1. Tab Yêu cầu (GRP_01_INFO) + Dự án data
        {
            key: 'GRP_01_INFO',
            label: <span><FormOutlined /> Yêu cầu</span>,
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
            children: <StepLabor journeyId={journey._id} isEditable={userRoleConfig.editableGroupCodes.includes('GRP_05_QUOTE') || role === 'pm'} />,
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
            children: <StepMaterials journeyId={journey._id} isEditable={userRoleConfig.editableGroupCodes.includes('GRP_05_QUOTE') || role === 'pm'} />,
        },
        // 9. Tab Thanh toán (GRP_07_DEPOSIT or GRP_10_PAYMENT)
        {
            key: 'GRP_07_DEPOSIT',
            label: <span><DollarOutlined /> Thanh toán</span>,
            children: renderTabContent('GRP_07_DEPOSIT', 'S07_ADVANCE'),
        },
        // 10. Tab Log (PM only)
        // {
        //     key: 'LOG',
        //     label: <span><ClockCircleOutlined /> Log</span>,
        //     children: (
        //         <Timeline
        //             items={(journey as any).activities?.map((a: any) => ({
        //                 dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        //                 children: (
        //                     <div>
        //                         <div>
        //                             <Text strong>{a.activity_action}</Text>
        //                             <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>{a.activity_time?.split('T')[0]}</Text>
        //                         </div>
        //                         <Text type="secondary" style={{ fontSize: 12 }}>{a.activity_actor} · {a.activity_context}</Text>
        //                         <div style={{ fontSize: 13, marginTop: 2 }}>{a.activity_summary}</div>
        //                     </div>
        //                 ),
        //             })) || []}
        //         />
        //     ),
        // },
        // 11. Tab Phát sinh (GRP_08_CONSTRUCT)
        {
            key: 'GRP_08_CONSTRUCT',
            label: <span><ExclamationCircleOutlined /> Nhật ký thi công</span>,
            children: renderTabContent('GRP_08_CONSTRUCT', 'S08_CONSTRUCT'),
        },
        // 12. Tab Tài liệu (GRP_09_ACCEPTANCE or GRP_08_CONSTRUCT)
        {
            key: 'GRP_DOCS',
            label: <span><PaperClipOutlined /> Tài liệu</span>,
            children: renderTabContent('GRP_09_ACCEPTANCE', 'S09_ACCEPTANCE'),
        },
        // 13. Tab Portal/Chat (GRP_06_CONTRACT)
        {
            key: 'GRP_06_CONTRACT',
            label: <span><MessageOutlined /> Portal/Chat</span>,
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}><Statistic title="Publish Status" value={journey.portal_publish_status || 'hidden'} /></Col>
                        <Col span={12}><Statistic title="Chưa đọc" value={journey.unread_thread_count ?? 0} valueStyle={{ color: journey.unread_thread_count ? '#ff4d4f' : '#52c41a' }} /></Col>
                    </Row>
                    <Empty description="Tính năng Chat Portal đang được kết nối với backend..." />
                </div>
            ),
        }
    ].filter(item => {
        // Filter tabs based on user visibility
        if (item.key === 'LOG') return role === 'pm' || role === 'sale';

        // Custom keys that don't match standardProcedureGroupCd exactly
        if (item.key === 'GRP_LABOR') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE') || role === 'pm' || role === 'sale';
        if (item.key === 'GRP_MATERIALS') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE') || role === 'pm' || role === 'sale';
        if (item.key === 'GRP_DOCS') return userRoleConfig.allowedGroupCodes.includes('GRP_09_ACCEPTANCE') || userRoleConfig.allowedGroupCodes.includes('GRP_08_CONSTRUCT');

        return userRoleConfig.allowedGroupCodes.includes(item.key);
    });

    return (
        <div style={{ padding: isMobile ? '4px 0' : '24px' }}>
            {/* Back + Primary Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 8 : 16 }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)} style={{ padding: isMobile ? '4px 8px' : undefined }}>
                    {!isMobile && 'Quay lại'}
                </Button>
                {role === 'pm' && (
                    <Space size={isMobile ? 4 : 8} wrap={isMobile}>
                        <Button icon={<EditOutlined />} onClick={() => setIsEditDrawerVisible(true)}>{isMobile ? '' : 'Sửa hành trình'}</Button>
                        <Button icon={<UserOutlined />} onClick={() => setShowAssignModal(true)}>{isMobile ? '' : 'Phân công'}</Button>
                        <Button icon={<FlagOutlined />} onClick={() => setShowPriorityModal(true)}>{isMobile ? '' : 'Ưu tiên'}</Button>
                        <Button type="primary" icon={<SendOutlined />} onClick={() => setShowPublishModal(true)}>Publish Portal</Button>
                    </Space>
                )}
                {role === 'sale' && (
                    <Space size={isMobile ? 4 : 8} wrap={isMobile}>
                        <Button icon={<MessageOutlined />} onClick={() => setShowLogModal(true)}>{isMobile ? '' : 'Ghi Log'}</Button>
                        <Button icon={<ClockCircleOutlined />} onClick={() => setShowFollowUpModal(true)}>{isMobile ? '' : 'Follow-up'}</Button>
                    </Space>
                )}
            </div>

            {/* Journey Header Card */}
            <Card style={{ marginBottom: isMobile ? 8 : 16, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a5f 0%, #1976D2 100%)', border: 'none' }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} md={16}>
                        <div style={{ marginBottom: 4 }}>
                            <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontWeight: 700 }}>
                                {journey.journey_code}
                            </Tag>
                        </div>
                        <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>{journey.idx_customer_id?.title || journey.customer_full_name || 'Khách hàng ẩn danh'}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{journey.request_title}</Text>
                        <div style={{ marginTop: 8 }}>
                            <Space size="large">
                                <UserOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                    Phụ trách: <Text strong style={{ color: '#fff' }}>{journey.supervisor_name || 'Chưa gán'}</Text>
                                </Text>
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space wrap>
                            <Tag color={SLA_CONFIG[journey.sla_status as SlaStatus]?.color || 'default'}>
                                {SLA_CONFIG[journey.sla_status as SlaStatus]?.label || journey.sla_status}
                            </Tag>
                            <Tag color={GO_NO_GO_CONFIG[journey.go_no_go_status as GoNoGoStatus]?.color || 'default'}>
                                {GO_NO_GO_CONFIG[journey.go_no_go_status as GoNoGoStatus]?.label || journey.go_no_go_status}
                            </Tag>
                        </Space>
                    </Col>
                </Row>

                {journeySteps.length > 0 && !isMobile && (
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
                        <Steps
                            size="small"
                            current={currentStepIndex >= 0 ? currentStepIndex : 0}
                            items={journeySteps.map(s => ({
                                title: <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, whiteSpace: 'nowrap' }}>{s.step_name}</span>,
                            }))}
                            className="journey-dark-steps"
                        />
                    </div>
                )}
            </Card>

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

            {/* Modals for PM */}
            {role === 'pm' && (
                <>
                    <Modal
                        title="Phân công phụ trách"
                        open={showAssignModal}
                        onCancel={() => setShowAssignModal(false)}
                        onOk={() => {
                            assignForm.validateFields().then(async values => {
                                setIsSubmitting(true);
                                try {
                                    await journeyService.updateJourney(journey._id, { owner_user_id: values.owner_user_id });
                                    message.success("Đã phân công phụ trách!");
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
                        <Form form={assignForm} layout="vertical">
                            <Form.Item label="Người phụ trách mới" name="owner_user_id" rules={[{ required: true }]}>
                                <Select placeholder="Chọn PM/Sale" options={employees} />
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
                                                            {`${window.location.origin}/portal/${journey.journey_code}`}
                                                        </Text>
                                                        <Space>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<PaperClipOutlined />}
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${window.location.origin}/portal/${journey.journey_code}`);
                                                                    message.success("Đã copy link portal!");
                                                                }}
                                                            >
                                                                Copy
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                icon={<SendOutlined />}
                                                                onClick={() => window.open(`/portal/${journey.journey_code}`, '_blank')}
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

                    <Drawer
                        title="Chỉnh sửa Hành trình"
                        width={720}
                        onClose={() => setIsEditDrawerVisible(false)}
                        open={isEditDrawerVisible}
                        destroyOnClose
                    >
                        {journey && (
                            <JourneyForm
                                initialValues={journey as any}
                                onSubmit={async (values) => {
                                    setIsSubmitting(true);
                                    try {
                                        await journeyService.updateJourney(journey._id, values);
                                        message.success("Cập nhật hành trình thành công!");
                                        setIsEditDrawerVisible(false);
                                        fetchJourney();
                                    } catch (error) {
                                        message.error("Lỗi khi cập nhật");
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                                onCancel={() => setIsEditDrawerVisible(false)}
                                isLoading={isSubmitting}
                            />
                        )}
                    </Drawer>
                </>
            )}
        </div>
    );
};

export default JourneyDetail360;
