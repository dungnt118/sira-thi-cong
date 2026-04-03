import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Avatar, Input, Row, Col, Badge, Empty,
    Tooltip, Popconfirm, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, TeamOutlined, UserOutlined,
    PhoneOutlined, MailOutlined, BankOutlined,
    EditOutlined, DeleteOutlined, StarFilled,
    AppstoreOutlined, SolutionOutlined, IdcardOutlined
} from '@ant-design/icons';
import { beneficiaryBankContactService } from '../../../services/core-contracts/services/beneficiaryBankContact.service';
import type { IBeneficiaryBankContact } from '../../../services/core-contracts/types/beneficiaryBankContact.types';

const { Title, Text } = Typography;

const BeneficiaryContactList: React.FC = () => {
    const [data, setData] = useState<IBeneficiaryBankContact[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await beneficiaryBankContactService.queryBeneficiaryBankContactsDto({});
            if (response.code === 0 && response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch beneficiary contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item => {
        const matchesSearch = item.contact_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.bank_account_number?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.phone?.includes(searchText);
        return matchesSearch;
    });

    const getContactTypeTag = (type: string | undefined) => {
        switch (type) {
            case 'supplier': return <Tag color="blue" icon={<AppstoreOutlined />}>Nhà cung cấp</Tag>;
            case 'partner': return <Tag color="cyan" icon={<TeamOutlined />}>Đối tác</Tag>;
            case 'employee': return <Tag color="green" icon={<UserOutlined />}>Nhân viên</Tag>;
            case 'customer': return <Tag color="orange" icon={<SolutionOutlined />}>Khách hàng</Tag>;
            default: return <Tag color="default">{type}</Tag>;
        }
    };

    const columns: ColumnsType<IBeneficiaryBankContact> = [
        {
            title: 'Họ tên / Đơn vị',
            key: 'contact',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: record.is_frequent ? '#fadb14' : '#1890ff' }}
                        icon={record.is_frequent ? <StarFilled /> : <UserOutlined />}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 14 }}>{record.contact_name}</Text>
                        <Text type="secondary" size="small">{getContactTypeTag(record.contact_type)}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Liên hệ',
            key: 'contact_info',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.phone && <Text size="small"><PhoneOutlined /> {record.phone}</Text>}
                    {record.email && <Text type="secondary" size="small"><MailOutlined /> {record.email}</Text>}
                </Space>
            )
        },
        {
            title: 'Tài khoản ngân hàng',
            key: 'bank',
            width: 300,
            render: (_, record) => (
                <Space>
                    <div style={{ color: '#fa8c16', fontSize: 18 }}>
                        <BankOutlined />
                    </div>
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.bank_account_number}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.bank_name} - {record.bank_account_name}
                        </Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Định danh / MST',
            key: 'id_tax',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.identity_no && <Tooltip title="CMND/CCCD"><Tag icon={<IdcardOutlined />} variant="borderless">{record.identity_no}</Tag></Tooltip>}
                    {record.tax_code && <Tooltip title="Mã số thuế"><Tag color="purple" variant="borderless">MST: {record.tax_code}</Tag></Tooltip>}
                </Space>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge
                    status={status === 'active' ? 'success' : 'default'}
                    text={status === 'active' ? 'Sẵn sàng' : 'Tạm dừng'}
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} size="small" type="text" />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm title="Xác nhận xóa liên hệ thụ hưởng này?">
                            <Button icon={<DeleteOutlined />} size="small" type="text" danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>👥 Danh bạ Tài khoản thụ hưởng</Title>
                <Button type="primary" icon={<TeamOutlined />}>Thêm thụ hưởng mới</Button>
            </div>

            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Tìm tên, số tài khoản, điện thoại..."
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Badge count={data.filter(i => i.is_frequent).length} offset={[-2, 2]}>
                                <Tag color="gold" icon={<StarFilled />} style={{ cursor: 'pointer' }}>Thường xuyên</Tag>
                            </Badge>
                            <Text type="secondary">Tổng số: {data.length}</Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="_id"
                size="middle"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="Chưa có danh bạ người thụ hưởng" /> }}
            />
        </div>
    );
};

export default BeneficiaryContactList;
