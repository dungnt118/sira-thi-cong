import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Row, Col, Statistic, Tooltip, Badge, Empty,
    Popconfirm, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, BankOutlined, CreditCardOutlined,
    EditOutlined, DeleteOutlined, InfoCircleOutlined,
    CheckCircleFilled, MinusCircleFilled
} from '@ant-design/icons';
import { companyBankAccountService } from '../../../services/core-contracts/services/companyBankAccount.service';
import type { ICompanyBankAccount } from '../../../services/core-contracts/types/companyBankAccount.types';

const { Title, Text } = Typography;

const CompanyBankAccountList: React.FC = () => {
    const [data, setData] = useState<ICompanyBankAccount[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await companyBankAccountService.queryCompanyBankAccountsDto({});
            if (response.code === 0 && response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch bank accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const success = await companyBankAccountService.deleteCompanyBankAccount(id);
            if (success) {
                message.success('Đã xóa tài khoản ngân hàng');
                fetchData();
            }
        } catch (error) {
            message.error('Không thể xóa tài khoản');
        }
    };

    const columns: ColumnsType<ICompanyBankAccount> = [
        {
            title: 'Tài khoản',
            key: 'account',
            width: 300,
            render: (_, record) => (
                <Space>
                    <div style={{
                        width: 40, height: 40, background: '#f5f5f5', borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, color: '#1890ff'
                    }}>
                        <BankOutlined />
                    </div>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 15 }}>{record.account_name}</Text>
                        <Text type="secondary" size="small">{record.bank_name}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'account_number',
            key: 'account_number',
            render: (text) => <Text code>{text}</Text>
        },
        {
            title: 'Tiền tệ',
            dataIndex: 'currency',
            key: 'currency',
            render: (currency) => <Tag color="blue">{currency?.toUpperCase()}</Tag>
        },
        {
            title: 'Mặc định',
            dataIndex: 'is_default',
            key: 'default',
            render: (isDefault) => isDefault ? <Tag color="green" icon={<CheckCircleFilled />}>Mặc định</Tag> : null
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge
                    status={status === 'active' ? 'success' : 'default'}
                    text={status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} size="small" type="text" />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa tài khoản này?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} size="small" type="text" danger />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Xem thông tin chi tiết">
                        <Button icon={<InfoCircleOutlined />} size="small" type="text" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>🏦 Tài khoản Ngân hàng Công ty</Title>
                <Button type="primary" icon={<PlusOutlined />}>Thêm tài khoản mới</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Card size="small" className="stat-card">
                        <Statistic
                            title="Tổng số tài khoản"
                            value={data.length}
                            prefix={<CreditCardOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Tài khoản hoạt động"
                            value={data.filter(i => i.status === 'active').length}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleFilled />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đang tạm ngưng"
                            value={data.filter(i => i.status === 'inactive').length}
                            valueStyle={{ color: '#d9d9d9' }}
                            prefix={<MinusCircleFilled />}
                        />
                    </Card>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="_id"
                size="middle"
                pagination={false}
                locale={{ emptyText: <Empty description="Chưa có thông tin tài khoản ngân hàng" /> }}
            />
        </div>
    );
};

export default CompanyBankAccountList;
