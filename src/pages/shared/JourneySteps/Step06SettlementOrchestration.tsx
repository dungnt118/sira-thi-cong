import React from 'react';
import { Card, Table, Typography, Row, Col, Statistic, Tag, Divider, Empty, Spin, Progress, Alert } from 'antd';
import { 
    DollarOutlined, 
    ArrowUpOutlined, 
    ArrowDownOutlined, 
    CheckCircleOutlined, 
    WarningOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons';
import { useJourneySettlement } from '../../../hooks/useJourneySettlement';

const { Title, Text } = Typography;

export interface Step06SettlementOrchestrationProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step06SettlementOrchestration: React.FC<Step06SettlementOrchestrationProps> = ({ 
    journeyId, 
    isEditable = false 
}) => {
    const { summary, loading } = useJourneySettlement(journeyId);

    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const columns = [
        {
            title: 'Hạng mục / Vật tư',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Đ/V',
            dataIndex: 'unit',
            key: 'unit',
            width: 80
        },
        {
            title: 'Dự toán/Báo giá',
            children: [
                {
                    title: 'SL',
                    dataIndex: 'quotedQuantity',
                    key: 'qQty',
                    align: 'right' as const,
                },
                {
                    title: 'Đơn giá',
                    dataIndex: 'quotedPrice',
                    key: 'qPrice',
                    align: 'right' as const,
                    render: (val: number) => val > 0 ? formatVND(val) : '-'
                }
            ]
        },
        {
            title: 'Thực tế thi công',
            children: [
                {
                    title: 'SL Xuất',
                    dataIndex: 'actualQuantity',
                    key: 'aQty',
                    align: 'right' as const,
                    render: (val: number, record: any) => (
                        <Text type={val > record.quotedQuantity ? 'danger' : 'success'}>
                            {val}
                        </Text>
                    )
                },
                {
                    title: 'Đơn giá',
                    dataIndex: 'actualUnitCost',
                    key: 'aPrice',
                    align: 'right' as const,
                    render: (val: number) => val > 0 ? formatVND(val) : '-'
                }
            ]
        },
        {
            title: 'Chênh lệch',
            dataIndex: 'variance',
            key: 'variance',
            align: 'right' as const,
            render: (val: number) => {
                if (val === 0) return <Text type="secondary">0</Text>;
                return (
                    <Tag color={val > 0 ? 'volcano' : 'green'}>
                        {val > 0 ? `+${val}` : val}
                    </Tag>
                );
            }
        }
    ];

    if (loading) {
        return (
            <Card variant="borderless" className="ky-card" style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" tip="Đang tổng hợp số liệu quyết toán..." />
            </Card>
        );
    }

    if (!summary || (summary.items.length === 0 && summary.laborTasks.length === 0)) {
        return (
            <Card variant="borderless" className="ky-card">
                <Empty description="Chưa có dữ liệu quyết toán (Cần hoàn thành Báo giá và Xuất kho vật tư)" />
            </Card>
        );
    }

    return (
        <Card 
            title={<span><DashboardOutlined /> Settlement Orchestration</span>}
            variant="borderless" 
            className="ky-card orchestration-card"
        >
            <Alert
                message="Dashboard Chốt Quyết Toán"
                description="Hệ thống tự động đối soát giữa Báo giá (Doanh thu) và Phiếu xuất kho / Nhân công (Chi phí) để tính toán biên lợi nhuận thực tế."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small" variant="outlined" style={{ borderLeft: '4px solid #1890ff' }}>
                        <Statistic 
                            title="Tổng doanh thu (HĐ)" 
                            value={summary.totalRevenue} 
                            prefix={<DollarOutlined />} 
                            suffix="đ"
                            valueStyle={{ color: '#1890ff', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" variant="outlined" style={{ borderLeft: '4px solid #faad14' }}>
                        <Statistic 
                            title="Tổng chi phí thực tế" 
                            value={summary.totalCost} 
                            prefix={<DeploymentUnitOutlined />} 
                            suffix="đ"
                            valueStyle={{ color: '#faad14', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" variant="outlined" style={{ borderLeft: '4px solid #52c41a' }}>
                        <Statistic 
                            title="Lợi nhuận gộp" 
                            value={summary.marginAmount} 
                            prefix={summary.marginAmount >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} 
                            suffix="đ"
                            valueStyle={{ color: summary.marginAmount >= 0 ? '#3f8600' : '#cf1322', fontSize: 20 }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" variant="outlined" style={{ borderLeft: '4px solid #eb2f96' }}>
                        <Statistic 
                            title="Tỷ suất lợi nhuận" 
                            value={summary.marginPercent} 
                            precision={2}
                            suffix="%"
                            valueStyle={{ color: '#eb2f96', fontSize: 20 }}
                        />
                        <Progress 
                            percent={Math.max(0, Math.min(100, summary.marginPercent))} 
                            size="small" 
                            showInfo={false} 
                            strokeColor="#eb2f96"
                        />
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Đối soát Vật tư Công trình</Divider>
            <Table 
                dataSource={summary.items} 
                columns={columns} 
                pagination={false} 
                size="small" 
                bordered
                rowKey="id"
                footer={() => (
                    <div style={{ textAlign: 'right', padding: '8px 16px' }}>
                        <Text type="secondary">Lưu ý: Các mục hiển thị màu đỏ là vượt định mức dự toán.</Text>
                    </div>
                )}
            />

            {summary.laborTasks.length > 0 && (
                <>
                    <Divider orientation="left">Chi phí Nhân công / Thầu phụ</Divider>
                    <Table 
                        dataSource={summary.laborTasks} 
                        columns={[
                            { title: 'Nhiệm vụ', dataIndex: 'name', key: 'name' },
                            { title: 'Chi phí thực tế', dataIndex: 'actualAmount', key: 'amount', render: (val) => formatVND(val), align: 'right' as const }
                        ]} 
                        pagination={false} 
                        size="small" 
                        bordered
                        rowKey="id"
                    />
                </>
            )}

            <Divider />
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }} />
                <Title level={4}>Xác nhận chốt số liệu quyết toán</Title>
                <Text type="secondary">
                    Sau khi chốt, hệ thống sẽ sinh hồ sơ Quyết toán (ProjectSettlement) và khóa các thay đổi về chi phí vật tư của hành trình này.
                </Text>
            </div>
        </Card>
    );
};

export default Step06SettlementOrchestration;
