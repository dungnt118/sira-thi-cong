import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Statistic, Row, Col, Input, Select, Badge, Empty,
    Modal, Form, InputNumber, message, Popconfirm, Divider
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, PlusOutlined, FilterOutlined,
    FileTextOutlined, SendOutlined, CheckCircleOutlined,
    CloseCircleOutlined, ClockCircleOutlined,
    EditOutlined, DeleteOutlined, SaveOutlined,
    CreditCardOutlined, UserOutlined, BankOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { paymentRequestService } from '../../../services/core-contracts/services/paymentRequest.service';
import { companyBankAccountService } from '../../../services/core-contracts/services/companyBankAccount.service';
import { beneficiaryBankContactService } from '../../../services/core-contracts/services/beneficiaryBankContact.service';
import type { IPaymentRequest, ICreatePaymentRequestInput } from '../../../services/core-contracts/types/paymentRequest.types';
import type { ICompanyBankAccount } from '../../../services/core-contracts/types/companyBankAccount.types';
import type { IBeneficiaryBankContact } from '../../../services/core-contracts/types/beneficiaryBankContact.types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PaymentRequestList: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<IPaymentRequest[]>([]);
    const [companyAccounts, setCompanyAccounts] = useState<ICompanyBankAccount[]>([]);
    const [beneficiaryContacts, setBeneficiaryContacts] = useState<IBeneficiaryBankContact[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<IPaymentRequest | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prRes, caRes, bcRes] = await Promise.all([
                paymentRequestService.queryPaymentRequestsDto({}),
                companyBankAccountService.queryCompanyBankAccountsDto({}),
                beneficiaryBankContactService.queryBeneficiaryBankContactsDto({})
            ]);

            if (prRes.code === 0 && prRes.data) setData(prRes.data);
            if (caRes.code === 0 && caRes.data) setCompanyAccounts(caRes.data);
            if (bcRes.code === 0 && bcRes.data) setBeneficiaryContacts(bcRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (request?: IPaymentRequest) => {
        if (request) {
            setEditingRequest(request);
            form.setFieldsValue(request);
        } else {
            setEditingRequest(null);
            form.resetFields();
            form.setFieldsValue({
                status: 'pending_approval',
                priority: 'normal',
                currency: 'vnd',
                request_date: new Date().toISOString()
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            // Auto-fill snapshots for history/tracking
            if (values.company_bank_account_id) {
                const account = companyAccounts.find(a => a._id === values.company_bank_account_id);
                if (account) {
                    values.source_account_name_snapshot = account.account_name;
                    values.source_account_number_snapshot = account.account_number;
                    values.source_bank_name_snapshot = account.bank_name;
                }
            }

            if (values.beneficiary_bank_contact_id) {
                const contact = beneficiaryContacts.find(c => c._id === values.beneficiary_bank_contact_id);
                if (contact) {
                    values.beneficiary_name_snapshot = contact.contact_name;
                    values.beneficiary_account_number_snapshot = contact.bank_account_number;
                    values.beneficiary_bank_name_snapshot = contact.bank_name;
                    values.beneficiary_branch_snapshot = contact.branch_name;
                }
            }

            if (editingRequest) {
                await paymentRequestService.updatePaymentRequest(editingRequest._id, values);
                message.success('Cập nhật yêu cầu thành công');
            } else {
                await paymentRequestService.createPaymentRequest(values as ICreatePaymentRequestInput);
                message.success('Tạo yêu cầu chi mới thành công');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save payment request:', error);
            message.error('Có lỗi xảy ra khi lưu yêu cầu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const success = await paymentRequestService.deletePaymentRequest(id);
            if (success) {
                message.success('Đã xóa yêu cầu chi');
                fetchData();
            }
        } catch (error) {
            message.error('Không thể xóa yêu cầu');
        }
    };

    const handleConfirmPaid = async (record: IPaymentRequest) => {
        try {
            setLoading(true);
            await paymentRequestService.updatePaymentRequest(record._id, {
                status: 'paid',
                paid_at: new Date().toISOString(),
                paid_by: 'Current Accountant' // In real app, get from auth context
            });
            message.success(`Đã xác nhận chi cho yêu cầu ${record.code}`);
            fetchData();
        } catch (error) {
            message.error('Không thể xác nhận chi');
        } finally {
            setLoading(false);
        }
    };

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
            title: 'Yêu cầu',
            key: 'code',
            width: 150,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.code || 'CHƯA CÓ MÃ'}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {record.request_date ? new Date(record.request_date).toLocaleDateString('vi-VN') : '—'}
                    </Text>
                    {getPriorityTag(record.priority)}
                </Space>
            )
        },
        {
            title: 'Nội dung & Đối tượng',
            key: 'content',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text style={{ fontWeight: 500 }}>{record.payment_content}</Text>
                    <Space style={{ fontSize: 12 }}>
                        <Tag icon={<UserOutlined />} variant="borderless">{record.beneficiary_name_snapshot || 'Chưa chọn người nhận'}</Tag>
                        <Text type="secondary">→ {record.source_bank_name_snapshot || 'Nguồn: ?'}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            width: 150,
            render: (amount, record) => (
                <Text strong style={{ color: '#1890ff', fontSize: 15 }}>
                    {amount?.toLocaleString('vi-VN')} {record.currency?.toUpperCase() || 'VND'}
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Space>
                    {record.status === 'approved' && (
                        <Popconfirm title="Xác nhận đã thực hiện chuyển tiền thành công?" onConfirm={() => handleConfirmPaid(record)}>
                            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>Chi trả</Button>
                        </Popconfirm>
                    )}
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} size="small" type="text" onClick={() => handleOpenModal(record)} />
                    </Tooltip>
                    <Popconfirm title="Xóa yêu cầu này?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} size="small" type="text" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>💸 Quản lý Yêu cầu chi</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Tạo yêu cầu chi</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small" className="stat-card">
                        <Statistic
                            title="Số dư khả dụng (Ước tính)"
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
                            title="Đã duyệt & Đang chi"
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
                            allowClear
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 170 }}
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
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="Không có dữ liệu yêu cầu chi" /> }}
            />

            <Modal
                title={editingRequest ? "Cập nhật yêu cầu chi" : "Tạo yêu cầu chi mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>Lưu yêu cầu</Button>
                ]}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="code" label="Mã yêu cầu (Hệ thống tự tạo nếu trống)">
                                <Input placeholder="VD: YCC-2026-001" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="request_type" label="Loại yêu cầu" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="supplier_payment">Thanh toán NCC</Option>
                                    <Option value="expense_reimbursement">Hoàn ứng / Công tác phí</Option>
                                    <Option value="salary_payment">Chi lương / Thưởng</Option>
                                    <Option value="tax_payment">Nộp thuế / Lệ phí</Option>
                                    <Option value="internal_transfer">Chuyển khoản nội bộ</Option>
                                    <Option value="other">Chi khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="normal">Bình thường</Option>
                                    <Option value="urgent">Gấp</Option>
                                    <Option value="critical">Khẩn cấp</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="payment_content" label="Nội dung thanh toán" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} placeholder="Nhập chi tiết nội dung cần chi..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="amount" label="Số tiền yêu cầu" rules={[{ required: true, type: 'number', min: 1000 }]}>
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="0 VNĐ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="currency" label="Tiền tệ" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="vnd">VND - Việt Nam Đồng</Option>
                                    <Option value="usd">USD - Đô la Mỹ</Option>
                                    <Option value="eur">EUR - Đồng Euro</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin thanh toán (Linking)</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="company_bank_account_id" label="Tài khoản nguồn (Công ty)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn tài khoản chi" showSearch optionFilterProp="children">
                                    {companyAccounts.map(a => (
                                        <Option key={a._id} value={a._id}>
                                            <Space>
                                                <BankOutlined />
                                                {a.bank_name} - {a.account_number} ({a.account_name})
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="beneficiary_bank_contact_id" label="Người nhận (Thụ hưởng)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn người nhận" showSearch optionFilterProp="children">
                                    {beneficiaryContacts.map(c => (
                                        <Option key={c._id} value={c._id}>
                                            <Space>
                                                <UserOutlined />
                                                {c.contact_name} ({c.bank_name} - {c.bank_account_number})
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="request_note" label="Ghi chú thêm">
                        <Input.TextArea rows={2} placeholder="..." />
                    </Form.Item>

                    <Form.Item name="status" hidden><Input /></Form.Item>
                    <Form.Item name="request_date" hidden><Input /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PaymentRequestList;
