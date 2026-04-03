import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Avatar, Input, Row, Col, Badge, Empty,
    Tooltip, Popconfirm, message, Modal, Form, Select, Switch
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, TeamOutlined, UserOutlined,
    PhoneOutlined, MailOutlined, BankOutlined,
    EditOutlined, DeleteOutlined, StarFilled,
    AppstoreOutlined, SolutionOutlined, IdcardOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { beneficiaryBankContactService } from '../../../services/core-contracts/services/beneficiaryBankContact.service';
import type { IBeneficiaryBankContact, ICreateBeneficiaryBankContactInput } from '../../../services/core-contracts/types/beneficiaryBankContact.types';

const { Title, Text } = Typography;
const { Option } = Select;

const BeneficiaryContactList: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<IBeneficiaryBankContact[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<IBeneficiaryBankContact | null>(null);
    const [saving, setSaving] = useState(false);

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

    const handleOpenModal = (contact?: IBeneficiaryBankContact) => {
        if (contact) {
            setEditingContact(contact);
            form.setFieldsValue(contact);
        } else {
            setEditingContact(null);
            form.resetFields();
            form.setFieldsValue({ status: 'active', contact_type: 'supplier', is_frequent: false });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            if (editingContact) {
                await beneficiaryBankContactService.updateBeneficiaryBankContact(editingContact._id, values);
                message.success('Cập nhật người thụ hưởng thành công');
            } else {
                await beneficiaryBankContactService.createBeneficiaryBankContact(values as ICreateBeneficiaryBankContactInput);
                message.success('Thêm người thụ hưởng mới thành công');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save beneficiary contact:', error);
            message.error('Có lỗi xảy ra khi lưu thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const success = await beneficiaryBankContactService.deleteBeneficiaryBankContact(id);
            if (success) {
                message.success('Đã xóa thông tin thụ hưởng');
                fetchData();
            }
        } catch (error) {
            message.error('Không thể xóa mục này');
        }
    };

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
                        <Text type="secondary" style={{ fontSize: 11 }}>{getContactTypeTag(record.contact_type)}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Liên hệ',
            key: 'contact_info',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.phone && <Text style={{ fontSize: 12 }}><PhoneOutlined /> {record.phone}</Text>}
                    {record.email && <Text type="secondary" style={{ fontSize: 12 }}><MailOutlined /> {record.email}</Text>}
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
                    {record.identity_no && <Tooltip title="CMND/CCCD"><Tag icon={<IdcardOutlined />} bordered={false}>{record.identity_no}</Tag></Tooltip>}
                    {record.tax_code && <Tooltip title="Mã số thuế"><Tag color="purple" bordered={false}>MST: {record.tax_code}</Tag></Tooltip>}
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
                        <Button icon={<EditOutlined />} size="small" type="text" onClick={() => handleOpenModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm title="Xác nhận xóa liên hệ thụ hưởng này?" onConfirm={() => handleDelete(record._id)}>
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
                <Button type="primary" icon={<TeamOutlined />} onClick={() => handleOpenModal()}>Thêm thụ hưởng mới</Button>
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

            <Modal
                title={editingContact ? "Cập nhật liên hệ thụ hưởng" : "Thêm liên hệ thụ hưởng mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>Lưu danh bạ</Button>
                ]}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="contact_name" label="Họ tên / Đơn vị thụ hưởng" rules={[{ required: true }]}>
                                <Input placeholder="VD: Nguyễn Văn A, Công ty X..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="contact_type" label="Phân loại" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="supplier">Nhà cung cấp</Option>
                                    <Option value="partner">Đối tác</Option>
                                    <Option value="employee">Nhân viên</Option>
                                    <Option value="customer">Khách hàng</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại">
                                <Input placeholder="0901234xxx" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                <Input placeholder="example@gmail.com" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={5} style={{ marginTop: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>Thông tin Ngân hàng</Title>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="bank_name" label="Tên ngân hàng" rules={[{ required: true }]}>
                                <Input placeholder="VD: Vietcombank, MB Bank..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="branch_name" label="Chi nhánh">
                                <Input placeholder="VD: CN Gia Định" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="bank_account_number" label="Số tài khoản" rules={[{ required: true }]}>
                                <Input placeholder="Nhập số tài khoản thụ hưởng" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="bank_account_name" label="Tên chủ tài khoản" rules={[{ required: true }]}>
                                <Input placeholder="VD: NGUYEN VAN A" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="identity_no" label="Số CMND/CCCD/Hộ chiếu">
                                <Input placeholder="Nhập số định danh" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tax_code" label="Mã số thuế">
                                <Input placeholder="Nhập MST (nếu có)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="active">Sẵn sàng</Option>
                                    <Option value="inactive">Tạm dừng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="is_frequent" label="Liên hệ thường xuyên" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default BeneficiaryContactList;
