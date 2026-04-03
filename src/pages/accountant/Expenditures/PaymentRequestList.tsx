import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Statistic, Row, Col, Input, Select, Badge, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, PlusOutlined, FilterOutlined,
    FileTextOutlined, SendOutlined, CheckCircleOutlined,
    CloseCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import type { IPaymentRequest } from '../../../services/core-contracts/types/paymentRequest.types';

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentRequestList: React.FC = () => {
    const [data, setData] = useState<IPaymentRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await paymentRequestService.queryPaymentRequestsDto({});
            if (response.code === 0 && response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch payment requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item => {
        const matchesSearch = item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.payment_content?.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalAmount = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);

    const getStatusTag = (status: string | undefined) => {
        switch (status) {
            case 'draft': return <Tag icon={<FileTextOutlined />} color="default">Nháp</Tag>;
            case 'pending_approval': return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ duyệt</Tag>;
            case 'approved': return <Tag icon={<CheckCircleOutlined />} color="processing">Đã duyệt</Tag>;
            case 'paid': return <Tag icon={<CheckCircleOutlined />} color="success">Đã chi</Tag>;
            case 'rejected': return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
            case 'cancelled': return <Tag icon={<CloseCircleOutlined />} color="default">Đã hủy</Tag>;
            default: return <Tag color="default">{status}</Tag>;
        }
    };

    const getPriorityTag = (priority: string | undefined) => {
        switch (priority) {
            case 'critical': return <Tag color="magenta">Khẩn cấp</Tag>;
            case 'urgent': return <Tag color="volcano">Gấp</Tag>;
            case 'normal': return <Tag color="blue">Bình thường</Tag>;
            default: return null;
        }
    };

    const columns: ColumnsType<IPaymentRequest> = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'code',
            key: 'code',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text}</Text>
                    {getPriorityTag(record.priority)}
                </Space>
            )
        },
        {
            title: 'Ngày yêu cầu',
            dataIndex: 'request_date',
            key: 'request_date',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '—'
        },
        {
            title: 'Nội dung chi',
            dataIndex: 'payment_content',
            key: 'payment_content',
            width: 300,
            ellipsis: true,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount, record) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {amount?.toLocaleString('vi-VN')} {record.currency?.toUpperCase() || 'VND'}
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" size="small">Chi tiết</Button>
                    {record.status === 'approved' && (
                        <Button type="primary" size="small" ghost>Xác nhận chi</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>💸 Quản lý Yêu cầu chi</Title>
                <Button type="primary" icon={<PlusOutlined />}>Tạo yêu cầu chi</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small" className="stat-card">
                        <Statistic
                            title="Tổng cộng (đang hiển thị)"
                            value={totalAmount}
                            suffix="VND"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Chờ duyệt"
                            value={data.filter(i => i.status === 'pending_approval').length}
                            suffix="Yêu cầu"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đã duyệt & Chờ chi"
                            value={data.filter(i => i.status === 'approved').length}
                            suffix="Yêu cầu"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16 }}>
                <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <Input
                            placeholder="Mã/Nội dung chi..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 150 }}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="draft">Nháp</Option>
                            <Option value="pending_approval">Chờ duyệt</Option>
                            <Option value="approved">Đã duyệt</Option>
                            <Option value="paid">Đã chi</Option>
                            <Option value="rejected">Từ chối</Option>
                        </Select>
                    </Space>
                    <Button icon={<FilterOutlined />}>Bộ lọc nâng cao</Button>
                </Space>
            </Card>

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="_id"
                size="middle"
                pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} mục` }}
                locale={{ emptyText: <Empty description="Không có dữ liệu yêu cầu chi" /> }}
            />
        </div>
    );
};

export default PaymentRequestList;
