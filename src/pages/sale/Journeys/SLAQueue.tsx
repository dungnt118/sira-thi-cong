import React, { useState, useEffect } from 'react';
import {
    Card, Table, Tag, Button, Typography, Statistic,
    Row, Col, Modal, Space, notification, Avatar, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
    PhoneOutlined, ClockCircleOutlined, 
    ExclamationCircleOutlined, CheckCircleOutlined,
    UserOutlined, ArrowRightOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import { useNavigate } from 'react-router-dom';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';

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
                // Tương lai: truyền filter sla_status: [overdue, at_risk]
                const res = await journeyService.queryContent();
                if (res && res.data) {
                    setJourneys(res.data);
                }
            } catch (err: any) {
                notification.error({ message: 'Lỗi', description: 'Không thể tải danh sách SLA Queue.' });
            } finally {
                setLoading(false);
            }
        };
        fetchJourneys();
    }, []);

    const atRisk = journeys.filter(j => j.sla_status === 'at_risk');
    const overdue = journeys.filter(j => j.sla_status === 'overdue');
    const ontime = journeys.filter(j => j.sla_status === 'on_time' || (j.sla_status as any) === 'ontime');

    const columns: ColumnsType<IJourney> = [
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 300,
            render: (_, j: any) => {
                const customerName = j.idx_customer_id?.primary_text || 'Khách hàng ẩn';
                const customerPhone = j.idx_customer_id?.secondary_text || '';
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar icon={<UserOutlined />} style={{ flexShrink: 0, backgroundColor: '#f0f2f5', color: '#8c8c8c' }} />
                        <div>
                            <div 
                                style={{ fontWeight: 600, cursor: 'pointer', color: '#1890ff', fontSize: 14 }} 
                                onClick={() => navigate(`/sale/dashboard/${j._id}`)}
                            >
                                {customerName}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{customerPhone || '—'}</Text>
                        </div>
                    </div>
                );
            },
        },
        { 
            title: 'Hành trình', 
            key: 'journey',
            render: (_, j: any) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>{j.journey_code}</Text>
                    <div style={{ fontSize: 11, color: '#8c8c8c' }}>{j.request_title}</div>
                </div>
            )
        },
        { 
            title: 'Trạng thái SLA',
            key: 'sla',
            render: (_, j) => {
                const isOverdue = j.sla_status === 'overdue';
                const isAtRisk = j.sla_status === 'at_risk';
                return (
                    <Tag 
                        color={isOverdue ? 'error' : isAtRisk ? 'warning' : 'success'}
                        style={{ borderRadius: 4, fontWeight: 500 }}
                    >
                        {isOverdue ? 'Quá hạn' : isAtRisk ? 'Có rủi ro' : 'Đúng hạn'}
                    </Tag>
                );
            },
            sorter: (a, b) => {
                const order: any = { overdue: 0, at_risk: 1, on_time: 2, ontime: 2 };
                return (order[a.sla_status || ''] || 9) - (order[b.sla_status || ''] || 9);
            },
        },
        { 
            title: 'Hẹn xử lý', 
            key: 'deadline',
            render: (_, j: any) => {
                const date = j.next_milestone_due ? new Date(j.next_milestone_due).toLocaleDateString('vi-VN') : '—';
                const isUrgent = j.sla_status === 'overdue' || j.sla_status === 'at_risk';
                return <Text style={{ fontSize: 13, color: isUrgent ? '#cf1322' : 'inherit', fontWeight: isUrgent ? 600 : 400 }}>{date}</Text>;
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'right',
            render: (_, j) => (
                <Space>
                    <Tooltip title="Gọi điện">
                        <Button shape="circle" icon={<PhoneOutlined />} />
                    </Tooltip>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => { setSelectedJourney(j); setShowLogModal(true); }}
                        style={{ borderRadius: 6 }}
                    >
                        Ghi log
                    </Button>
                    <Button 
                        type="link" 
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(`/sale/dashboard/${j._id}`)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '4px 0' }}>
            <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Hệ thống Quản lý Bán hàng</Text>
                <Title level={2} style={{ margin: '4px 0 0', fontWeight: 700 }}>SLA Queue</Title>
                <Text type="secondary">Ưu tiên xử lý các hành trình cần phản hồi gấp để đảm bảo chất lượng dịch vụ.</Text>
            </div>

            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(255, 77, 79, 0.1)', background: '#fff1f0' }}>
                        <Statistic 
                            title={<span style={{ color: '#cf1322', fontWeight: 600 }}>Quá hạn</span>}
                            value={overdue.length} 
                            valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 28 }} 
                            prefix={<ExclamationCircleOutlined />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(250, 140, 22, 0.1)', background: '#fff7e6' }}>
                        <Statistic 
                            title={<span style={{ color: '#d46b08', fontWeight: 600 }}>Có rủi ro</span>}
                            value={atRisk.length} 
                            valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 28 }} 
                            prefix={<ClockCircleOutlined />} 
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(82, 196, 26, 0.1)', background: '#f6ffed' }}>
                        <Statistic 
                            title={<span style={{ color: '#389e0d', fontWeight: 600 }}>Cần chăm sóc</span>}
                            value={ontime.length} 
                            valueStyle={{ color: '#389e0d', fontWeight: 700, fontSize: 28 }} 
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }} bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={journeys}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10, position: ['bottomRight'] }}
                    style={{ borderRadius: 16, overflow: 'hidden' }}
                    className="premium-table"
                />
            </Card>

            <Modal
                title={
                    <div style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0 }}>Ghi log tư vấn</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Khách hàng: {(selectedJourney as any)?.idx_customer_id?.primary_text || 'Khách hàng ẩn'}</Text>
                    </div>
                }
                open={showLogModal}
                onCancel={() => { setShowLogModal(false); }}
                footer={null}
                width={600}
                centered
                style={{ borderRadius: 12 }}
            >
                <div style={{ paddingTop: 16 }}>
                    <ConsultationLogForm
                        onSubmit={() => {
                            notification.success({ message: 'Thành công', description: 'Đã lưu log tư vấn.' });
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
