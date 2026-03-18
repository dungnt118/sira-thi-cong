import React, { useState, useMemo } from 'react';
import { 
    Typography, Table, Button, Tag, Card, Row, Col, 
    Statistic, Input, Steps, Space, Badge
} from 'antd';
import { 
    ClockCircleOutlined, CheckCircleOutlined, 
    CarryOutOutlined, SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import type { Asset, AssetAllocation } from '../../../types/v3';
import mockAssetsData from '../../../data/mock/assets.json';

const { Title, Text } = Typography;

const AssetAllocationHistory: React.FC = () => {
    const navigate = useNavigate();
    const [allocations] = useLocalStorageData<AssetAllocation[]>('ASSET_ALLOCATIONS', []);

    const [activeStep, setActiveStep] = useState('ALL');
    const [searchText, setSearchText] = useState('');

    const stats = useMemo(() => {
        let requested = 0;
        let approved = 0;
        let received = 0;
        allocations.forEach(a => {
            if (a.status === 'REQUESTED') requested++;
            if (a.status === 'APPROVED') approved++;
            if (a.status === 'RECEIVED') received++;
        });
        return { total: allocations.length, requested, approved, received };
    }, [allocations]);

    const stepCounts = useMemo(() => {
        const counts: Record<string, number> = {
            ALL: allocations.length,
            REQUESTED: 0,
            APPROVED: 0,
            RECEIVED: 0,
            COMPLETED: 0,
            RETURNED: 0,
            REJECTED: 0,
        };
        allocations.forEach(a => {
            if (counts[a.status] !== undefined) {
                counts[a.status]++;
            }
        });
        return counts;
    }, [allocations]);

    const finalList = useMemo(() => {
        let list = allocations;
        if (activeStep !== 'ALL') {
            list = list.filter(o => o.status === activeStep);
        }
        if (searchText) {
            const lower = searchText.toLowerCase();
            list = list.filter(o => 
                (o.code && o.code.toLowerCase().includes(lower)) ||
                (o.assetName && o.assetName.toLowerCase().includes(lower)) ||
                (o.requestedBy && o.requestedBy.toLowerCase().includes(lower))
            );
        }
        return list;
    }, [allocations, activeStep, searchText]);

    const STATUS_STEPS = [
        { key: 'ALL', title: 'Tất cả' },
        { key: 'REQUESTED', title: 'Chờ duyệt' },
        { key: 'APPROVED', title: 'Đã duyệt (Chờ nhận)' },
        { key: 'RECEIVED', title: 'Đang sử dụng' },
        { key: 'RETURNED', title: 'Đã hoàn trả' },
    ];
    const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === activeStep);

    const columns = [
        { title: 'Mã phiếu', dataIndex: 'code', key: 'code', render: (t: string) => <Text strong>{t}</Text> },
        { title: 'Tài sản', key: 'asset', render: (_: any, r: AssetAllocation) => <Space direction="vertical" size={0}><Text strong>{r.assetName}</Text><Text type="secondary" style={{fontSize: 12}}>{r.assetCode}</Text></Space> },
        { title: 'Người yêu cầu', dataIndex: 'requestedBy', key: 'reqBy' },
        { title: 'Dự án (nếu có)', dataIndex: 'projectName', key: 'proj', render: (v: string) => v || '—' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'st',
            render: (s: string) => {
                const colors: Record<string, string> = {
                    'REQUESTED': 'processing',
                    'APPROVED': 'cyan',
                    'RECEIVED': 'blue',
                    'RETURNED': 'success',
                };
                return <Tag color={colors[s] || 'default'}>{s}</Tag>;
            }
        },
        { title: 'Ngày yêu cầu', dataIndex: 'requestDate', key: 'date', render: (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, r: AssetAllocation) => (
                <Button 
                    type={r.status === 'REQUESTED' || r.status === 'APPROVED' ? 'primary' : 'default'} 
                    size="small" 
                    icon={r.status === 'REQUESTED' || r.status === 'APPROVED' ? <EditOutlined /> : <EyeOutlined />}
                    onClick={() => navigate(`/accountant/assets/allocation/${r.id}`)}
                >
                    {r.status === 'REQUESTED' ? 'Duyệt' : (r.status === 'APPROVED' ? 'Ký nhận' : 'Xem')}
                </Button>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>🔄 Lịch sử Quản lý Cấp phát & Mượn tài sản</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/accountant/assets/allocation')}>
                    Tạo yêu cầu mượn
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Cần Kế toán duyệt" value={stats.requested} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>Chờ xác nhận xuất</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Chờ người mượn nhận" value={stats.approved} valueStyle={{ color: '#eb2f96' }} prefix={<CarryOutOutlined />} />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>Kế toán đã duyệt</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ borderRadius: 8 }}>
                        <Statistic title="Đang cấp phát (Sử dụng)" value={stats.received} valueStyle={{ color: '#1890ff' }} prefix={<CheckCircleOutlined />} />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>Người mượn đã nhận</div>
                    </Card>
                </Col>
            </Row>

            <Card bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                    <Col flex="1">
                        <Steps 
                            type="navigation"
                            size="small"
                            current={currentStepIndex !== -1 ? currentStepIndex : 0}
                            onChange={idx => setActiveStep(STATUS_STEPS[idx].key)}
                            style={{ borderBottom: 'none' }}
                            items={STATUS_STEPS.map((s, index) => {
                                const count = stepCounts[s.key] || 0;
                                const isActive = currentStepIndex === index;
                                return { 
                                    title: (
                                        <Space size="small">
                                            {s.title}
                                            <Badge count={count} showZero style={{ 
                                                backgroundColor: isActive ? '#1890ff' : '#f0f0f0',
                                                color: isActive ? '#fff' : '#8c8c8c',
                                                boxShadow: 'none'
                                            }} />
                                        </Space>
                                    ),
                                    icon: <div style={{ width: 0, overflow: 'hidden' }} />
                                };
                            })}
                        />
                    </Col>
                    <Col>
                        <Input
                            placeholder="Tìm mã phiếu, tài sản, người mượn..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                    </Col>
                </Row>

                <Table
                    rowKey="id"
                    dataSource={finalList}
                    size="small"
                    columns={columns}
                    pagination={{ pageSize: 15 }}
                />
            </Card>
        </div>
    );
};

export default AssetAllocationHistory;
