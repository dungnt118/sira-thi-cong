import React, { useState, useEffect } from 'react';
import {
    Card, Table, Tag, Button, Typography, Statistic,
    Row, Col, Modal, Space, notification
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import { useNavigate } from 'react-router-dom';
import { ConsultationLogForm } from '../../../components/journey/SharedModals';

const { Text } = Typography;

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
            render: (_, j: any) => {
                const customerName = j.idx_customer_id?.primary_text || 'Khách hàng ẩn';
                const customerPhone = j.idx_customer_id?.secondary_text || '';
                return (
                    <div>
                        <div style={{ fontWeight: 600, cursor: 'pointer', color: '#1976D2' }} onClick={() => navigate(`/sale/dashboard/${j._id}`)}>{customerName}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{customerPhone}</Text>
                    </div>
                );
            },
        },
        { title: 'Tên yêu cầu', dataIndex: 'request_title', key: 'title', render: v => <Text style={{ fontSize: 12 }}>{v}</Text> },
        { title: 'Nguồn KH', dataIndex: 'source_channel', key: 'channel', render: v => <Tag>{v}</Tag> },
        {
            title: 'SLA',
            key: 'sla',
            render: (_, j) => (
                <Tag color={j.sla_status === 'overdue' ? 'error' : j.sla_status === 'at_risk' ? 'warning' : 'success'}>
                    {j.sla_status === 'overdue' ? 'Quá hạn' : j.sla_status === 'at_risk' ? 'Có rủi ro' : 'Đúng hạn'}
                </Tag>
            ),
            sorter: (a, b) => {
                const order: any = { overdue: 0, at_risk: 1, on_time: 2, ontime: 2 };
                return (order[a.sla_status || ''] || 9) - (order[b.sla_status || ''] || 9);
            },
        },
        { title: 'Cập nhật gần nhất', key: 'updated', render: (_, j: any) => <Text style={{ fontSize: 11 }}>{j.last_activity_at ? j.last_activity_at.split('T')[0] : '—'}</Text> },
        {
            title: '',
            key: 'actions',
            render: (_, j) => (
                <Space>
                    <Button size="small" icon={<PhoneOutlined />}>Gọi</Button>
                    <Button
                        size="small" type="primary" ghost
                        onClick={() => { setSelectedJourney(j); setShowLogModal(true); }}
                    >
                        Ghi log
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>SLA Queue</h2>
                <Text type="secondary">Ưu tiên xử lý các cuộc gọi theo SLA</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #ff4d4f', borderRadius: 8 }}>
                        <Statistic title="Quá hạn" value={overdue.length} valueStyle={{ color: '#ff4d4f' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #fa8c16', borderRadius: 8 }}>
                        <Statistic title="Có rủi ro" value={atRisk.length} valueStyle={{ color: '#fa8c16' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small" style={{ borderLeft: '4px solid #52c41a', borderRadius: 8 }}>
                        <Statistic title="Đúng hạn" value={ontime.length} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Table
                    columns={columns}
                    dataSource={journeys}
                    rowKey="_id"
                    size="small"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={`Ghi log tư vấn – ${(selectedJourney as any)?.idx_customer_id?.primary_text || 'Khách hàng ẩn'}`}
                open={showLogModal}
                onCancel={() => { setShowLogModal(false); }}
                footer={null}
                width={600}
            >
                <ConsultationLogForm
                    onSubmit={() => {
                        // handle submit logic here
                        setShowLogModal(false);
                    }}
                    onCancel={() => setShowLogModal(false)}
                />
            </Modal>
        </div>
    );
};

export default SLAQueue;
