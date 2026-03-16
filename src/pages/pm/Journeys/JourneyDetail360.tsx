import React, { useState, useMemo } from 'react';
import {
    Card, Tabs, Tag, Button, Space, Typography, Row, Col,
    Badge, Statistic, Timeline, Descriptions, Modal,
    Form, Select, Alert, Checkbox, message, Steps, Empty
} from 'antd';
import {
    ArrowLeftOutlined, UserOutlined, FlagOutlined,
    SendOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
    ClockCircleOutlined, MessageOutlined,
    TeamOutlined,
    FormOutlined, PaperClipOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mockJourneys, mockPortalThreads, mockJourneyTemplates } from '../../../data/journeyMockData';
import type { GoNoGoStatus, SlaStatus, PortalPublishStatus } from '../../../types/journey';
import { useAuth } from '../../../hooks/useAuth';
import JourneyStepRenderer from '../../shared/JourneySteps/JourneyStepRenderer';

const { Text, Title } = Typography;

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

    const journey = mockJourneys.find(j => j.id === journeyId);
    const threads = mockPortalThreads.filter(t => t.journey_id === journeyId);
    
    // Resolve template/steps
    const template = mockJourneyTemplates.find(t => t.id === journey?.template_id) || mockJourneyTemplates[0];
    const journeySteps = template?.steps || [];
    const currentStepIndex = journeySteps.findIndex(s => s.step_code === journey?.current_step_code);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [assignForm] = Form.useForm();
    const [priorityForm] = Form.useForm();

    // Internal check for mobile
    const isMobile = window.innerWidth < 768;

    // Resolve which tabs/steps this user can see and edit
    const userRoleConfig = useMemo(() => {
        if (!role) return { allowedGroupCodes: [], editableGroupCodes: [] };

        const allowedGroupCodes: string[] = [];
        const editableGroupCodes: string[] = [];

        if (role === 'pm') {
            // PM sees everything and can edit everything
            journeySteps.forEach(s => {
                if (s.standardProcedureGroupCd) {
                    allowedGroupCodes.push(s.standardProcedureGroupCd);
                    editableGroupCodes.push(s.standardProcedureGroupCd);
                }
            });
        } else {
            journeySteps.forEach(s => {
                const config = s.roleConfigurations?.find(rc => rc.roleId === role);
                if (config && s.standardProcedureGroupCd) {
                    allowedGroupCodes.push(s.standardProcedureGroupCd);
                    if (config.isKeyRole) {
                        editableGroupCodes.push(s.standardProcedureGroupCd);
                    }
                }
            });
        }

        return { allowedGroupCodes: [...new Set(allowedGroupCodes)], editableGroupCodes: [...new Set(editableGroupCodes)] };
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
        const isEditable = userRoleConfig.editableGroupCodes.includes(groupCode);
        return <JourneyStepRenderer stepCode={stepCode} journeyId={journey.id!} isEditable={isEditable} />;
    };

    const tabItems = [
        // 1. Tab Yêu cầu (GRP_01_INFO) + Dự án data
        {
            key: 'GRP_01_INFO',
            label: <span><FormOutlined /> Yêu cầu</span>,
            children: (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {renderTabContent('GRP_01_INFO', 'S01_INFO')}
                    
                    <Card title="Thông tin Dự án (Gộp)" size="small">
                        <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Trạng thái DA">{journey.project_status}</Descriptions.Item>
                            <Descriptions.Item label="Mã DA">{journey.project_code || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu">{journey.plan_start || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">{journey.plan_end || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Tiến độ">{journey.progress_pct !== undefined ? `${journey.progress_pct}%` : '—'}</Descriptions.Item>
                            <Descriptions.Item label="Task bị block">{journey.blocked_task_count ?? '—'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Space>
            ),
        },
        // 2. Tab Tạo lịch hẹn (GRP_02_CONTACT)
        {
            key: 'GRP_02_CONTACT',
            label: <span>📅 Lịch hẹn</span>,
            children: renderTabContent('GRP_02_CONTACT', 'S02_CONSULT'),
        },
        // 3. Tab Khảo sát (GRP_03_SURVEY)
        {
            key: 'GRP_03_SURVEY',
            label: <span>🔍 Khảo sát</span>,
            children: renderTabContent('GRP_03_SURVEY', 'S03_SURVEY'),
        },
        // 4. Tab Dự toán (GRP_04_SOLUTION)
        {
            key: 'GRP_04_SOLUTION',
            label: <span>📐 Dự toán</span>,
            children: renderTabContent('GRP_04_SOLUTION', 'S04_SOLUTION'),
        },
        // 5. Tab Báo giá/HĐ (GRP_05_QUOTE)
        {
            key: 'GRP_05_QUOTE',
            label: <span>📄 Báo giá/HĐ</span>,
            children: renderTabContent('GRP_05_QUOTE', 'S05_QUOTE'),
        },
        // 6. Tab Nhân công (GRP_05_QUOTE - User asked for separate tab)
        {
            key: 'GRP_LABOR',
            label: <span><TeamOutlined /> Nhân công</span>,
            children: renderTabContent('GRP_05_QUOTE', 'S06_CONTRACT'), 
        },
        // 8. Tab Vật tư (GRP_05_QUOTE - User asked for separate tab)
        {
            key: 'GRP_MATERIALS',
            label: <span>📦 Vật tư</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Trạng thái vật tư">{journey.material_need_status || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Vật tư chính">{journey.key_material_summary || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Cảnh báo cung ứng">{journey.procurement_alert_count ?? '—'}</Descriptions.Item>
                    <Descriptions.Item label="Nhu cầu tài sản">{journey.asset_need_summary || '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        // 9. Tab Thanh toán (GRP_07_DEPOSIT or GRP_10_PAYMENT)
        {
            key: 'GRP_07_DEPOSIT',
            label: <span>💰 Thanh toán</span>,
            children: renderTabContent('GRP_07_DEPOSIT', 'S07_ADVANCE'),
        },
        // 10. Tab Log (PM only)
        {
            key: 'LOG',
            label: <span><ClockCircleOutlined /> Log</span>,
            children: (
                <Timeline
                    items={journey.activities.map(a => ({
                        dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                        children: (
                            <div>
                                <div>
                                    <Text strong>{a.activity_action}</Text>
                                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>{a.activity_time.split('T')[0]}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{a.activity_actor} · {a.activity_context}</Text>
                                <div style={{ fontSize: 13, marginTop: 2 }}>{a.activity_summary}</div>
                            </div>
                        ),
                    }))}
                />
            ),
        },
        // 11. Tab Phát sinh (GRP_08_CONSTRUCT)
        {
            key: 'GRP_08_CONSTRUCT',
            label: <span><ExclamationCircleOutlined /> Phát sinh</span>,
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
                        <Col span={12}><Statistic title="Publish Status" value={PORTAL_CONFIG[journey.portal_publish_status].label} /></Col>
                        <Col span={12}><Statistic title="Chưa đọc" value={journey.unread_thread_count ?? 0} valueStyle={{ color: journey.unread_thread_count ? '#ff4d4f' : '#52c41a' }} /></Col>
                    </Row>
                    {threads.map(t => (
                        <Card key={t.thread_id} size="small" style={{ marginBottom: 8, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong>{t.context_label}</Text>
                                <Badge status={t.status === 'open' ? 'processing' : 'default'} text={t.status} />
                            </div>
                            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                {t.messages[t.messages.length - 1]?.message_body}
                            </div>
                        </Card>
                    ))}
                </div>
            ),
        }
    ].filter(item => {
        // Filter tabs based on user visibility
        if (item.key === 'LOG') return role === 'pm';
        
        // Custom keys that don't match standardProcedureGroupCd exactly
        if (item.key === 'GRP_LABOR') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE');
        if (item.key === 'GRP_MATERIALS') return userRoleConfig.allowedGroupCodes.includes('GRP_05_QUOTE');
        if (item.key === 'GRP_DOCS') return userRoleConfig.allowedGroupCodes.includes('GRP_09_ACCEPTANCE') || userRoleConfig.allowedGroupCodes.includes('GRP_08_CONSTRUCT');

        return userRoleConfig.allowedGroupCodes.includes(item.key);
    });

    return (
        <div style={{ padding: isMobile ? '12px' : '24px' }}>
            {/* Back + Primary Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                {role === 'pm' && (
                    <Space wrap>
                        <Button icon={<UserOutlined />} onClick={() => setShowAssignModal(true)}>Phân công</Button>
                        <Button icon={<FlagOutlined />} onClick={() => setShowPriorityModal(true)}>Ưu tiên</Button>
                        <Button type="primary" icon={<SendOutlined />} onClick={() => setShowPublishModal(true)}>Publish Portal</Button>
                    </Space>
                )}
            </div>

            {/* Journey Header Card */}
            <Card style={{ marginBottom: 16, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a5f 0%, #1976D2 100%)', border: 'none' }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} md={16}>
                        <div style={{ marginBottom: 4 }}>
                            <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontWeight: 700 }}>
                                {journey.journey_code}
                            </Tag>
                        </div>
                        <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>{journey.customer_name}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{journey.request_title}</Text>
                        <div style={{ marginTop: 8 }}>
                            <Space size="large">
                                <UserOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                    Phụ trách: <Text strong style={{ color: '#fff' }}>{journey.owner_user}</Text>
                                </Text>
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space wrap>
                            <Tag color={SLA_CONFIG[journey.sla_status].color}>{SLA_CONFIG[journey.sla_status].label}</Tag>
                            <Tag color={GO_NO_GO_CONFIG[journey.go_no_go_status].color}>{GO_NO_GO_CONFIG[journey.go_no_go_status].label}</Tag>
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

            {/* Modals for PM */}
            {role === 'pm' && (
                <>
                    <Modal
                        title="Phân công phụ trách"
                        open={showAssignModal}
                        onCancel={() => setShowAssignModal(false)}
                        onOk={() => setShowAssignModal(false)}
                    >
                        <Form form={assignForm} layout="vertical">
                            <Form.Item label="Người phụ trách mới" name="owner_user_id">
                                <Select placeholder="Chọn PM/Sale">
                                    <Select.Option value="u-pm-01">Nguyễn Văn PM</Select.Option>
                                    <Select.Option value="u-sale-01">Trần Thị Sale</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Đổi mức ưu tiên"
                        open={showPriorityModal}
                        onCancel={() => setShowPriorityModal(false)}
                        onOk={() => setShowPriorityModal(false)}
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
                    >
                         <Alert type="info" message="Khách hàng sẽ thấy các thay đổi mới trên Portal sau khi bạn publish." style={{ marginBottom: 16 }} />
                         <Form layout="vertical">
                            <Form.Item label="Nội dung publish">
                                <Checkbox.Group options={['Tổng quan', 'Timeline', 'Tài liệu']} defaultValue={['Tổng quan', 'Timeline']} />
                            </Form.Item>
                         </Form>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default JourneyDetail360;
