/**
 * @deprecated
 * Giao diện chi tiết Journey dành riêng cho Sale đã được hợp nhất vào
 * `src/pages/shared/Journeys/JourneyDetail360.tsx`.
 * Route mới cho Sale: `/kd/journeys/:journeyId`.
 * File này giữ lại route cũ `/kd/dashboard/:journeyId` để backward-compatibility.
 */
import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Descriptions,
    Empty,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tabs,
    Tag,
    Typography,
} from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { pipelineStageService } from '../../../services/core-contracts/services/pipelineStage.service';
import { salesPipelineService } from '../../../services/core-contracts/services/salesPipeline.service';
import type { ICustomer } from '../../../services/core-contracts/types/customer.types';
import type { IJourney, ICreateJourneyInput } from '../../../services/core-contracts/types/journey.types';
import type { IPipelineStage } from '../../../services/core-contracts/types/pipelineStage.types';
import type { ISalesPipeline } from '../../../services/core-contracts/types/salesPipeline.types';
import { useAuth } from '../../../hooks/useAuth';
import JourneyUpsertDrawer from '../../../components/journey/JourneyUpsertDrawer';
import {
    formatJourneyDate,
    getJourneyStepLabel,
    getOptionLabel,
    JOURNEY_EMPTY_VALUE,
    JOURNEY_GO_NO_GO_OPTIONS,
    JOURNEY_PRIORITY_META,
    JOURNEY_SLA_META,
    JOURNEY_SOURCE_CHANNEL_OPTIONS,
} from './journeySaleMeta';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SaleJourneyContext: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'general';
    const navigate = useNavigate();
    const { user } = useAuth();

    const [journey, setJourney] = useState<IJourney | null>(null);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [pipelines, setPipelines] = useState<ISalesPipeline[]>([]);
    const [stages, setStages] = useState<IPipelineStage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [followForm] = Form.useForm();
    const [surveyForm] = Form.useForm();

    const loadJourneyContext = async () => {
        if (!journeyId) {
            return;
        }

        setLoading(true);
        try {
            const [journeyRes, customerRes, pipelineRes, stageRes] = await Promise.all([
                journeyService.findContent(journeyId),
                customerService.queryContent(),
                salesPipelineService.queryContent(),
                pipelineStageService.queryContent(),
            ]);

            setJourney(journeyRes);
            setCustomers(customerRes?.data || []);
            setPipelines(pipelineRes?.data || []);
            setStages(stageRes?.data || []);
        } catch (error) {
            console.error('Không thể tải hồ sơ Journey', error);
            message.error('Không thể tải thông tin Journey.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJourneyContext();
    }, [journeyId]);

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" tip="Đang tải hồ sơ yêu cầu dịch vụ..." />
            </div>
        );
    }

    if (!journey) {
        return (
            <Card style={{ marginTop: 40, textAlign: 'center', borderRadius: 20 }}>
                <Empty description="Không tìm thấy hồ sơ Journey." />
                <Button onClick={() => navigate('/kd/dashboard')}>Quay lại danh sách</Button>
            </Card>
        );
    }

    const customer = customers.find((item) => item._id === journey.customer_id);
    const customerName = journey.idx_customer_id?.primary_text || customer?.full_name || JOURNEY_EMPTY_VALUE;
    const customerPhone = journey.customer_phone || journey.idx_customer_id?.secondary_text || customer?.phone || JOURNEY_EMPTY_VALUE;
    const pipelineName = journey.idx_sales_pipeline_id?.primary_text || pipelines.find((item) => item._id === journey.sales_pipeline_id)?.name || JOURNEY_EMPTY_VALUE;
    const stageName = journey.idx_sales_stage_id?.primary_text || stages.find((item) => item._id === journey.sales_stage_id)?.name || JOURNEY_EMPTY_VALUE;
    const slaMeta = JOURNEY_SLA_META[journey.sla_status || ''] || { label: journey.sla_status || JOURNEY_EMPTY_VALUE, color: '#8c8c8c', background: '#fafafa' };
    const priorityMeta = JOURNEY_PRIORITY_META[journey.priority || ''] || { label: journey.priority || JOURNEY_EMPTY_VALUE, color: '#8c8c8c' };

    const handleUpdate = async (payload: ICreateJourneyInput) => {
        if (!journeyId) {
            return;
        }

        setSaving(true);
        try {
            await journeyService.updateJourney(journeyId, payload);
            message.success('Đã cập nhật hồ sơ Journey.');
            setShowEditDrawer(false);
            await loadJourneyContext();
        } catch (error) {
            console.error('Không thể cập nhật Journey', error);
            message.error('Không thể cập nhật hồ sơ Journey.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!journeyId) {
            return;
        }

        try {
            await journeyService.deleteJourney(journeyId);
            message.success('Đã xóa yêu cầu dịch vụ.');
            navigate('/kd/dashboard');
        } catch (error) {
            console.error('Không thể xóa Journey', error);
            message.error('Không thể xóa yêu cầu dịch vụ.');
        }
    };

    const tabItems = [
        {
            key: 'general',
            label: <span><InfoCircleOutlined /> Tổng quan</span>,
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} xl={14}>
                        <Card variant="borderless" style={{ borderRadius: 18 }}>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Mã hành trình">{journey.journey_code}</Descriptions.Item>
                                <Descriptions.Item label="Tiêu đề yêu cầu">{journey.request_title || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Khách hàng">{customerName}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{customerPhone}</Descriptions.Item>
                                <Descriptions.Item label="Email">{journey.customer_email || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Kênh tiếp nhận">{getOptionLabel(JOURNEY_SOURCE_CHANNEL_OPTIONS, journey.source_channel)}</Descriptions.Item>
                                <Descriptions.Item label="Loại dịch vụ">{journey.idx_serviceTypeId?.title || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ công trình">{journey.site_address || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả yêu cầu">{journey.request_description || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} xl={10}>
                        <Card bordered={false} style={{ borderRadius: 18, marginBottom: 20 }}>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Bước hiện tại">{getJourneyStepLabel(journey.current_step)}</Descriptions.Item>
                                <Descriptions.Item label="Quy trình bán hàng">{pipelineName}</Descriptions.Item>
                                <Descriptions.Item label="Giai đoạn bán hàng">{stageName}</Descriptions.Item>
                                <Descriptions.Item label="Sale phụ trách">{journey.sale_users || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Chủ sở hữu">{journey.owner_user || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Go / No-Go">{getOptionLabel(JOURNEY_GO_NO_GO_OPTIONS, journey.go_no_go_status)}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card variant="borderless" style={{ borderRadius: 18 }}>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="PM triển khai">{journey.pm_user || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Giám sát triển khai">{journey.supervisor_users || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Ngày bắt đầu dự kiến">{formatJourneyDate(journey.planned_start_date)}</Descriptions.Item>
                                <Descriptions.Item label="Ngày kết thúc dự kiến">{formatJourneyDate(journey.planned_end_date)}</Descriptions.Item>
                                <Descriptions.Item label="Ghi chú triển khai">{journey.delivery_note || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'survey',
            label: <span><SearchOutlined /> Khảo sát</span>,
            children: (
                <Card variant="borderless" style={{ borderRadius: 18 }}>
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <Space wrap>
                            <Text type="secondary">Tiến độ khảo sát:</Text>
                            <Tag color={journey.survey_status === 'completed' ? 'success' : 'processing'}>{journey.survey_status || 'not_started'}</Tag>
                        </Space>
                        <Text>Giám sát hiện trường: {journey.supervisor_users || journey.supervisor_name || JOURNEY_EMPTY_VALUE}</Text>
                        <Text>Khảo sát gần nhất: {formatJourneyDate(journey.latest_site_report_at, true)}</Text>
                        <Button type="primary" onClick={() => setShowSurveyModal(true)}>Đặt lịch khảo sát</Button>
                    </Space>
                </Card>
            ),
        },
        {
            key: 'finance',
            label: <span><DollarOutlined /> Báo giá và thanh toán</span>,
            children: (
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                        <Card variant="borderless" style={{ borderRadius: 18 }}>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Trạng thái báo giá">{journey.quote_status || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Giá trị hợp đồng">{journey.total_contract_value?.toLocaleString('vi-VN') || '0'} đ</Descriptions.Item>
                                <Descriptions.Item label="Đợt thanh toán tiếp theo">{journey.next_milestone_name || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                                <Descriptions.Item label="Hạn mốc tiếp theo">{formatJourneyDate(journey.next_milestone_due)}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card variant="borderless" style={{ borderRadius: 18 }}>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Đã thu">{journey.collected_amount?.toLocaleString('vi-VN') || '0'} đ</Descriptions.Item>
                                <Descriptions.Item label="Còn nợ">{journey.outstanding_amount?.toLocaleString('vi-VN') || '0'} đ</Descriptions.Item>
                                <Descriptions.Item label="Ghi chú thanh toán">{journey.last_payment_note || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'timeline',
            label: <span><FileTextOutlined /> Lịch sử và tương tác</span>,
            children: (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => setShowLogModal(true)}>Ghi log tư vấn</Button>
                    <Button onClick={() => setShowFollowUpModal(true)}>Ghi chú follow-up</Button>
                    <Card variant="borderless" style={{ borderRadius: 18 }}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Thread portal chưa đọc">{(journey.unread_thread_count || 0).toString()}</Descriptions.Item>
                            <Descriptions.Item label="Ngữ cảnh thread gần nhất">{journey.latest_thread_context || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái thread gần nhất">{journey.latest_thread_status || JOURNEY_EMPTY_VALUE}</Descriptions.Item>
                            <Descriptions.Item label="Hoạt động gần nhất">{formatJourneyDate(journey.last_activity_at, true)}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/kd/dashboard')} style={{ padding: 0 }}>
                    Quay lại danh sách yêu cầu dịch vụ
                </Button>
            </div>

            <Card variant="borderless" style={{ marginBottom: 24, borderRadius: 24, background: slaMeta.background }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={16}>
                        <Space size={[8, 8]} wrap>
                            <Tag color="blue">{journey.journey_code}</Tag>
                            <Tag color={priorityMeta.color}>{priorityMeta.label}</Tag>
                            <Tag color="processing">{getJourneyStepLabel(journey.current_step)}</Tag>
                            <Tag style={{ color: slaMeta.color, border: `1px solid ${slaMeta.color}22` }}>{slaMeta.label}</Tag>
                        </Space>
                        <Title level={3} style={{ margin: '12px 0 4px' }}>{customerName}</Title>
                        <Text style={{ display: 'block', fontSize: 16 }}>{journey.request_title || JOURNEY_EMPTY_VALUE}</Text>
                        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
                            Sale: {journey.sale_users || JOURNEY_EMPTY_VALUE} · Cập nhật: {formatJourneyDate(journey.last_activity_at, true)}
                        </Text>
                    </Col>
                    <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                        <Space wrap>
                            <Button icon={<EditOutlined />} onClick={() => setShowEditDrawer(true)}>Cập nhật</Button>
                            <Popconfirm
                                title="Xóa yêu cầu dịch vụ"
                                description="Hồ sơ Journey hiện tại sẽ bị xóa khỏi hệ thống."
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                                onConfirm={handleDelete}
                            >
                                <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setSearchParams({ tab: key })}
                items={tabItems}
                size="large"
                style={{ background: '#fff', padding: '0 24px 24px', borderRadius: 24 }}
            />

            <JourneyUpsertDrawer
                open={showEditDrawer}
                mode="sale"
                journey={journey}
                saving={saving}
                currentUsername={user?.username || undefined}
                onCancel={() => setShowEditDrawer(false)}
                onSubmit={handleUpdate}
            />

            <Modal title="Ghi log tư vấn khách hàng" open={showLogModal} footer={null} width={600} centered onCancel={() => setShowLogModal(false)}>
                <ConsultationLogForm
                    onSubmit={() => {
                        message.success('Đã lưu log tư vấn.');
                        setShowLogModal(false);
                    }}
                    onCancel={() => setShowLogModal(false)}
                />
            </Modal>

            <Modal
                title="Lên lịch khảo sát hiện trường"
                open={showSurveyModal}
                centered
                okText="Xác nhận lịch"
                cancelText="Hủy"
                onCancel={() => setShowSurveyModal(false)}
                onOk={() => {
                    message.success('Đã lưu lịch khảo sát.');
                    setShowSurveyModal(false);
                    surveyForm.resetFields();
                }}
            >
                <Form form={surveyForm} layout="vertical" style={{ paddingTop: 16 }}>
                    <Form.Item label="Thời gian khảo sát" name="survey_at" rules={[{ required: true, message: 'Vui lòng chọn thời gian khảo sát' }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Giám sát triển khai" name="surveyor" initialValue={journey.supervisor_users}>
                        <Input placeholder="Nhập username giám sát phụ trách" />
                    </Form.Item>
                    <Form.Item label="Địa điểm gặp" name="address" initialValue={journey.site_address}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ghi chú từ Sale" name="note">
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Ghi chú follow-up khách hàng"
                open={showFollowUpModal}
                centered
                okText="Lưu"
                cancelText="Hủy"
                onCancel={() => {
                    setShowFollowUpModal(false);
                    followForm.resetFields();
                }}
                onOk={() => {
                    message.success('Đã lưu follow-up.');
                    setShowFollowUpModal(false);
                    followForm.resetFields();
                }}
            >
                <Form form={followForm} layout="vertical" style={{ paddingTop: 16 }}>
                    <Form.Item label="Thời điểm follow-up" name="follow_up_at" rules={[{ required: true, message: 'Vui lòng chọn thời điểm follow-up' }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Phản hồi của khách" name="customer_response" rules={[{ required: true, message: 'Vui lòng ghi nhận phản hồi của khách hàng' }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Cam kết tiếp theo" name="next_commitment">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SaleJourneyContext;
