import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Modal,
    notification,
    Row,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    HistoryOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text, Title } = Typography;

const SLAQueue: React.FC = () => {
    const navigate = useNavigate();
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<IJourney | null>(null);
    const [loading, setLoading] = useState(false);
    const [journeys, setJourneys] = useState<IJourney[]>([]);

    useEffect(() => {
        const fetchJourneys = async () => {
            setLoading(true);

            try {
                const response = await journeyService.queryContent();
                setJourneys(response?.data || []);
            } catch (error) {
                console.error('Không thể tải danh sách cảnh báo tiến độ', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách cảnh báo tiến độ.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchJourneys();
    }, []);

    const resolveCustomerName = (journey: IJourney) =>
        journey.idx_customer_id?.primary_text || 'Khách hàng ẩn';

    const resolveCustomerPhone = (journey: IJourney) =>
        journey.idx_customer_id?.secondary_text || journey.contact_phone || '—';

    const overdueJourneys = journeys.filter((journey) => journey.sla_status === 'overdue');
    const atRiskJourneys = journeys.filter((journey) => journey.sla_status === 'at_risk');
    const healthyJourneys = journeys.filter((journey) => journey.sla_status === 'on_time');
    const attentionJourneys = journeys.filter(
        (journey) => journey.sla_status === 'overdue' || journey.sla_status === 'at_risk',
    );

    const columns: ColumnsType<IJourney> = [
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 300,
            render: (_, journey) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ flexShrink: 0, backgroundColor: '#f0f2f5', color: '#8c8c8c' }}
                    />
                    <div>
                        <div
                            style={{
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: '#1677ff',
                                fontSize: 14,
                            }}
                            onClick={() => navigate(`/sale/dashboard/${journey._id}`)}
                        >
                            {resolveCustomerName(journey)}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {resolveCustomerPhone(journey)}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Yêu cầu dịch vụ',
            key: 'journey',
            render: (_, journey) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>
                        {journey.journey_code}
                    </Text>
                    <div style={{ fontSize: 11, color: '#8c8c8c' }}>{journey.request_title}</div>
                </div>
            ),
        },
        {
            title: 'Trạng thái cảnh báo',
            key: 'sla',
            render: (_, journey) => {
                const isOverdue = journey.sla_status === 'overdue';

                return (
                    <Tag
                        color={isOverdue ? 'error' : 'warning'}
                        style={{ borderRadius: 4, fontWeight: 500 }}
                    >
                        {isOverdue ? 'Quá hạn' : 'Có rủi ro'}
                    </Tag>
                );
            },
            sorter: (left, right) => {
                const order: Record<string, number> = {
                    overdue: 0,
                    at_risk: 1,
                    on_time: 2,
                };

                return (order[left.sla_status || ''] ?? 9) - (order[right.sla_status || ''] ?? 9);
            },
        },
        {
            title: 'Hạn mốc gần nhất',
            key: 'deadline',
            render: (_, journey) => {
                const deadline = journey.next_milestone_due
                    ? new Date(journey.next_milestone_due).toLocaleDateString('vi-VN')
                    : '—';
                const isUrgent =
                    journey.sla_status === 'overdue' || journey.sla_status === 'at_risk';

                return (
                    <Text
                        style={{
                            fontSize: 13,
                            color: isUrgent ? '#cf1322' : 'inherit',
                            fontWeight: isUrgent ? 600 : 400,
                        }}
                    >
                        {deadline}
                    </Text>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'right',
            render: (_, journey) => (
                <Space>
                    <Tooltip title="Gọi điện">
                        <Button shape="circle" icon={<PhoneOutlined />} />
                    </Tooltip>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => {
                            setSelectedJourney(journey);
                            setShowLogModal(true);
                        }}
                        style={{ borderRadius: 6 }}
                    >
                        Ghi log
                    </Button>
                    <Button
                        type="link"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(`/sale/dashboard/${journey._id}`)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '4px 0' }}>
            <div style={{ marginBottom: 24 }}>
                <Text
                    type="secondary"
                    style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                    Hệ thống quản lý bán hàng
                </Text>
                <Title level={2} style={{ margin: '4px 0 0', fontWeight: 700 }}>
                    Cảnh báo tiến độ
                </Title>
                <Text type="secondary">
                    Ưu tiên xử lý các hành trình đang trễ hạn hoặc có rủi ro để đội Sale chủ động
                    phản hồi khách hàng.
                </Text>
            </div>

            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            borderRadius: 16,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.1)',
                            background: '#fff1f0',
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#cf1322', fontWeight: 600 }}>Quá hạn</span>}
                            value={overdueJourneys.length}
                            valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 28 }}
                            prefix={<ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            borderRadius: 16,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(250, 140, 22, 0.1)',
                            background: '#fff7e6',
                        }}
                    >
                        <Statistic
                            title={
                                <span style={{ color: '#d46b08', fontWeight: 600 }}>Có rủi ro</span>
                            }
                            value={atRiskJourneys.length}
                            valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 28 }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            borderRadius: 16,
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.1)',
                            background: '#f6ffed',
                        }}
                    >
                        <Statistic
                            title={
                                <span style={{ color: '#389e0d', fontWeight: 600 }}>
                                    Đúng tiến độ
                                </span>
                            }
                            value={healthyJourneys.length}
                            valueStyle={{ color: '#389e0d', fontWeight: 700, fontSize: 28 }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                style={{
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: 'none',
                }}
                bodyStyle={{ padding: 0 }}
            >
                <Table
                    columns={columns}
                    dataSource={attentionJourneys}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10, position: ['bottomRight'] }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Hiện chưa có hành trình nào cần cảnh báo tiến độ."
                            />
                        ),
                    }}
                    style={{ borderRadius: 16, overflow: 'hidden' }}
                    className="premium-table"
                />
            </Card>

            <Modal
                title={
                    <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Ghi log tư vấn
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Khách hàng: {selectedJourney ? resolveCustomerName(selectedJourney) : 'Khách hàng ẩn'}
                        </Text>
                    </div>
                }
                open={showLogModal}
                onCancel={() => setShowLogModal(false)}
                footer={null}
                width={600}
                centered
                style={{ borderRadius: 12 }}
            >
                <div style={{ paddingTop: 16 }}>
                    <ConsultationLogForm
                        onSubmit={() => {
                            notification.success({
                                message: 'Thành công',
                                description: 'Đã lưu log tư vấn.',
                            });
                            setShowLogModal(false);
                        }}
                        onCancel={() => setShowLogModal(false)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default SLAQueue;
