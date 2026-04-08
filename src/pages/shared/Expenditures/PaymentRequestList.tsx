import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Space, Typography,
    Statistic, Row, Col, Input, Select, Badge, Empty,
    Modal, Form, InputNumber, message, Popconfirm, Divider, Tooltip, Image, Grid, Tabs
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined, PlusOutlined, FilterOutlined,
    FileTextOutlined, SendOutlined, CheckCircleOutlined,
    CloseCircleOutlined, ClockCircleOutlined,
    EditOutlined, DeleteOutlined, SaveOutlined,
    CreditCardOutlined, UserOutlined, BankOutlined,
    WarningOutlined, StopOutlined, ShopOutlined,
    AccountBookOutlined, TeamOutlined, PropertySafetyOutlined,
    SwapOutlined, InfoCircleOutlined, ThunderboltOutlined,
    FieldTimeOutlined, DollarOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { UploadFilesEdit } from '@/components/files/UploadFiles';
import { paymentRequestService } from '@/services/core-contracts/services/paymentRequest.service';
import { companyBankAccountService } from '@/services/core-contracts/services/companyBankAccount.service';
import { beneficiaryBankContactService } from '@/services/core-contracts/services/beneficiaryBankContact.service';
import { getFileLink } from '@/services/storeService';
import type { IPaymentRequest, ICreatePaymentRequestInput } from '@/services/core-contracts/types/paymentRequest.types';
import type { ICompanyBankAccount } from '@/services/core-contracts/types/companyBankAccount.types';
import type { IBeneficiaryBankContact } from '@/services/core-contracts/types/beneficiaryBankContact.types';

const { Title, Text } = Typography;
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
    const [counts, setCounts] = useState<Record<string, number>>({});
    
    const { user, role, isAdmin } = useAuth();
    const isAccountant = role === 'KT' || isAdmin;
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const [isConfirmPayModalOpen, setIsConfirmPayModalOpen] = useState(false);
    const [confirmingRecord, setConfirmingRecord] = useState<IPaymentRequest | null>(null);
    const [confirmPayForm] = Form.useForm();

    const getBaseFilter = () => {
        const filter: any = { collection: 'paymentrequest' };
        if (!isAccountant && user?.username) {
            filter.group = {
                op: 'OR',
                children: [
                    { id: 'createdBy', operation: '==', value: user.username, propType: 'TEXT' },
                    { id: 'requested_by', operation: '==', value: user.username, propType: 'TEXT' }
                ]
            };
        }
        return filter;
    };

    const fetchCounts = async () => {
        try {
            const baseFilter = getBaseFilter();
            const statuses = ['pending_approval', 'draft', 'approved', 'paid', 'rejected'];
            
            const countPromises = statuses.map(status => {
                const statusFilter = {
                    ...baseFilter,
                    group: {
                        op: 'AND',
                        children: [
                            ...(baseFilter.group ? [baseFilter.group] : []),
                            { id: 'status', operation: '==', value: status }
                        ]
                    }
                };
                return paymentRequestService.countContent(statusFilter);
            });

            const results = await Promise.all(countPromises);
            const newCounts: Record<string, number> = {};
            statuses.forEach((status, index) => {
                newCounts[status] = results[index];
            });
            
            // Total count (All)
            newCounts['all'] = await paymentRequestService.countContent(baseFilter);
            
            setCounts(newCounts);
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const fetchData = async (statusOverride?: string) => {
        setLoading(true);
        try {
            const filter = getBaseFilter();
            const currentStatus = statusOverride || statusFilter;

            if (currentStatus !== 'all') {
                filter.group = {
                    op: 'AND',
                    children: [
                        ...(filter.group ? [filter.group] : []),
                        { id: 'status', operation: '==', value: currentStatus }
                    ]
                };
            }

            const [prRes, caRes, bcRes] = await Promise.all([
                paymentRequestService.queryPaymentRequestsDto(filter),
                companyBankAccountService.queryCompanyBankAccountsDto({}),
                beneficiaryBankContactService.queryBeneficiaryBankContactsDto({})
            ]);

            if (prRes.code === 0 && prRes.data) setData(prRes.data);
            if (caRes.code === 0 && caRes.data) setCompanyAccounts(caRes.data);
            if (bcRes.code === 0 && bcRes.data) setBeneficiaryContacts(bcRes.data);
            
            await fetchCounts();
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
            form.setFieldsValue({
                ...request,
                supporting_files: request.supporting_files || []
            });
        } else {
            const defaultValues: any = {
                status: 'pending_approval',
                priority: 'normal',
                currency: 'vnd',
                request_date: new Date().toISOString(),
                supporting_files: []
            };

            if (!isAccountant && user) {
                const userDisplayName = user.display_name || user.username;
                const contact = beneficiaryContacts.find(c => 
                    c.contact_name?.toLowerCase().includes(user.username?.toLowerCase() || '') ||
                    c.contact_name?.toLowerCase().includes(user.display_name?.toLowerCase() || '')
                );
                if (contact) {
                    defaultValues.beneficiary_bank_contact_id = contact._id;
                } else {
                    // Fallback to username if no contact found yet
                    // Note: System might require a contact ID, but we fill what we can
                    defaultValues.beneficiary_name_snapshot = userDisplayName;
                }
            }

            form.setFieldsValue(defaultValues);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

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
                values.requested_by = user?.username || 'unknown';
                values.submitted_at = new Date().toISOString();
                
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

    const handleConfirmPaid = async () => {
        if (!confirmingRecord) return;
        try {
            const values = await confirmPayForm.validateFields();
            setLoading(true);
            await paymentRequestService.updatePaymentRequest(confirmingRecord._id, {
                status: 'paid',
                paid_at: new Date().toISOString(),
                paid_by: user?.username || 'Accountant',
                bank_transaction_ref: values.bank_transaction_ref,
                payment_proof_note: values.payment_proof_note,
                payment_proof_files: values.payment_proof_files
            });
            message.success(`Đã xác nhận chi cho yêu cầu ${confirmingRecord.code}`);
            setIsConfirmPayModalOpen(false);
            setConfirmingRecord(null);
            confirmPayForm.resetFields();
            fetchData();
        } catch (error) {
            console.error('Failed to confirm paid:', error);
            message.error('Không thể xác nhận chi');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (record: IPaymentRequest) => {
        try {
            setLoading(true);
            await paymentRequestService.updatePaymentRequest(record._id, {
                status: 'approved',
                approved_at: new Date().toISOString(),
                approved_by: user?.display_name || user?.username || 'Approver'
            });
            message.success(`Đã phê duyệt yêu cầu ${record.code}`);
            fetchData();
        } catch (error) {
            message.error('Không thể phê duyệt yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = (record: IPaymentRequest) => {
        Modal.confirm({
            title: 'Từ chối yêu cầu chi',
            icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
            content: (
                <Form layout="vertical" id="rejectForm" style={{ marginTop: 16 }}>
                    <Form.Item name="rejection_reason" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                        <Input.TextArea rows={3} placeholder="Nhập lý do từ chối..." />
                    </Form.Item>
                </Form>
            ),
            okText: 'Xác nhận từ chối',
            okButtonProps: { danger: true },
            onOk: async () => {
                const rejection_reason = (document.getElementById('rejectForm_rejection_reason') as HTMLTextAreaElement)?.value;
                if (!rejection_reason) {
                    message.warning('Vui lòng nhập lý do từ chối');
                    return Promise.reject();
                }
                try {
                    await paymentRequestService.updatePaymentRequest(record._id, {
                        status: 'rejected',
                        rejected_at: new Date().toISOString(),
                        rejection_reason
                    });
                    message.success(`Đã từ chối yêu cầu ${record.code}`);
                    fetchData();
                } catch (error) {
                    message.error('Không thể từ chối yêu cầu');
                }
            }
        });
    };

    const filteredData = data.filter(item => {
        const matchesSearch = item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.payment_content?.toLowerCase().includes(searchText.toLowerCase());
        return matchesSearch;
    });

    const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);

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

    const isImageFile = (file: any) => {
        if (!file?.name) return false;
        const imgPattern = new RegExp(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i);
        return imgPattern.test(file.name);
    };

    const columns: ColumnsType<IPaymentRequest> = [
        {
            title: 'Mã Yêu cầu',
            key: 'code',
            width: 180,
            render: (_, record) => (
                <div style={{ paddingLeft: 8 }}>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 13 }}>{record.code || 'CHƯA CÓ MÃ'}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            {record.request_date ? new Date(record.request_date).toLocaleDateString('vi-VN') : '—'}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                            {getStatusTag(record.status)}
                        </div>
                    </Space>
                </div>
            )
        },
        {
            title: 'Loại & Nội dung',
            key: 'type_content',
            width: 220,
            render: (_, record) => {
                const getRequestTypeLabel = (type: string | undefined) => {
                    switch (type) {
                        case 'supplier_payment': return <Space size={4}><ShopOutlined />Thanh toán NCC</Space>;
                        case 'expense_reimbursement': return <Space size={4}><AccountBookOutlined />Hoàn ứng/Công tác phí</Space>;
                        case 'salary_payment': return <Space size={4}><TeamOutlined />Chi lương/Thưởng</Space>;
                        case 'tax_payment': return <Space size={4}><PropertySafetyOutlined />Nộp thuế/Lệ phí</Space>;
                        case 'internal_transfer': return <Space size={4}><SwapOutlined />Chuyển khoản nội bộ</Space>;
                        case 'other': return <Space size={4}><InfoCircleOutlined />Chi khác</Space>;
                        default: return <Space size={4}><InfoCircleOutlined />{type?.toUpperCase().replace('_', ' ')}</Space>;
                    }
                };

                return (
                    <div style={{ paddingLeft: 8 }}>
                        <Space direction="vertical" size={2}>
                            <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>{getRequestTypeLabel(record.request_type)}</Tag>
                            <Text strong style={{ fontSize: 13 }}>{record.payment_content}</Text>
                            {record.request_note && <Text type="secondary" style={{ fontSize: 11 }} italic>"{record.request_note}"</Text>}
                        </Space>
                    </div>
                );
            }
        },
        {
            title: 'Đối tượng nhận',
            key: 'people',
            width: 200,
            render: (_, record) => (
                <div style={{ paddingLeft: 8 }}>
                    <Space direction="vertical" size={4}>
                        <Space size={4}>
                            <UserOutlined style={{ color: '#8c8c8c' }} />
                            <Text style={{ fontSize: 12 }}>{record.beneficiary_name_snapshot || '—'}</Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>({record.beneficiary_bank_name_snapshot})</Text>
                        </Space>
                        <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                            <div><Text type="secondary">Tạo bởi:</Text> {record.requested_by?.display_name || record.requested_by || '—'}</div>
                        </div>
                    </Space>
                </div>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            width: 140,
            render: (amount, record) => (
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 15 }}>
                        {amount?.toLocaleString('vi-VN')}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.currency?.toUpperCase() || 'VND'}</Text>
                </div>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 160,
            render: (_, record) => (
                <Space size={4}>
                    {isAccountant && record.status === 'pending_approval' && (
                        <>
                            <Tooltip title="Phê duyệt">
                                <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)} ghost />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleReject(record)} ghost />
                            </Tooltip>
                        </>
                    )}
                    {isAccountant && record.status === 'approved' && (
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<CheckCircleOutlined />} 
                            onClick={() => {
                                setConfirmingRecord(record);
                                setIsConfirmPayModalOpen(true);
                            }}
                        >
                            Chi trả
                        </Button>
                    )}
                    <Divider type="vertical" />
                    <Tooltip title={(record.status === 'paid' || (!isAccountant && record.status !== 'pending_approval' && record.status !== 'draft')) ? "Không thể sửa" : "Chỉnh sửa"}>
                        <Button 
                            icon={<EditOutlined />} 
                            size="small" 
                            type="text" 
                            onClick={() => handleOpenModal(record)} 
                            disabled={record.status === 'paid' || (!isAccountant && record.status !== 'pending_approval' && record.status !== 'draft')}
                        />
                    </Tooltip>
                    <Popconfirm 
                        title="Xóa yêu cầu này?" 
                        onConfirm={() => handleDelete(record._id)}
                        disabled={record.status === 'paid' || (!isAccountant && record.status !== 'pending_approval' && record.status !== 'draft')}
                    >
                        <Button 
                            icon={<DeleteOutlined />} 
                            size="small" 
                            type="text" 
                            danger 
                            disabled={record.status === 'paid' || (!isAccountant && record.status !== 'pending_approval' && record.status !== 'draft')}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: isMobile ? '8px' : '24px' }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: 24 
            }}>
                <Title level={4} style={{ margin: 0 }}>
                    <CreditCardOutlined style={{ marginRight: 8, color: '#1890ff' }} />  
                    {isAccountant ? 'Quản lý Yêu cầu chi' : 'Yêu cầu chi của tôi'}
                </Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => handleOpenModal()}
                    style={{ width: 'auto' }}
                >
                    Tạo yêu cầu chi
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small" className="stat-card">
                        <Statistic
                            title="Tổng số tiền yêu cầu"
                            value={totalAmount}
                            suffix="VND"
                            prefix={<CreditCardOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Chờ duyệt"
                            value={counts['pending_approval'] || 0}
                            suffix="Yêu cầu"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đã chi"
                            value={counts['paid'] || 0}
                            suffix="Yêu cầu"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Tabs
                activeKey={statusFilter}
                onChange={(key) => {
                    setStatusFilter(key);
                    fetchData(key);
                }}
                items={[
                    {
                        key: 'pending_approval',
                        label: (
                            <Space>
                                <ClockCircleOutlined style={{ color: '#faad14' }} />
                                <span>Chờ duyệt</span>
                                <Badge count={counts['pending_approval'] || 0} overflowCount={999} style={{ backgroundColor: '#faad14' }} />
                            </Space>
                        ),
                    },
                    {
                        key: 'draft',
                        label: (
                            <Space>
                                <FileTextOutlined style={{ color: '#8c8c8c' }} />
                                <span>Nháp</span>
                                <Badge count={counts['draft'] || 0} overflowCount={999} />
                            </Space>
                        ),
                    },
                    {
                        key: 'approved',
                        label: (
                            <Space>
                                <CheckCircleOutlined style={{ color: '#1890ff' }} />
                                <span>Đã duyệt</span>
                                <Badge count={counts['approved'] || 0} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />
                            </Space>
                        ),
                    },
                    {
                        key: 'paid',
                        label: (
                            <Space>
                                <SendOutlined style={{ color: '#52c41a' }} />
                                <span>Đã chi</span>
                                <Badge count={counts['paid'] || 0} overflowCount={999} style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        ),
                    },
                    {
                        key: 'rejected',
                        label: (
                            <Space>
                                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                <span>Từ chối</span>
                                <Badge count={counts['rejected'] || 0} overflowCount={999} style={{ backgroundColor: '#ff4d4f' }} />
                            </Space>
                        ),
                    },
                    {
                        key: 'all',
                        label: (
                            <Space>
                                <FilterOutlined style={{ color: '#1890ff' }} />
                                <span>Tất cả</span>
                                <Badge count={counts['all'] || 0} overflowCount={999} style={{ backgroundColor: '#8c8c8c' }} />
                            </Space>
                        ),
                    },
                ]}
                tabBarExtraContent={
                    <Input
                        placeholder="Mã/Nội dung chi..."
                        prefix={<SearchOutlined />}
                        style={{ width: isMobile ? '100%' : 250 }}
                        allowClear
                        onChange={e => setSearchText(e.target.value)}
                    />
                }
                style={{ marginBottom: 16 }}
            />

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="_id"
                size="middle"
                pagination={{ pageSize: 10, size: 'small' }}
                scroll={{ x: 1000 }}
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
                width="95%"
                style={{ maxWidth: 850 }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        {isAccountant && (
                            <Col xs={24} sm={8}>
                                <Form.Item name="code" label="Mã yêu cầu">
                                    <Input placeholder="VD: YCC-2026-001" />
                                </Form.Item>
                            </Col>
                        )}
                        <Col xs={24} sm={8}>
                            <Form.Item name="request_type" label="Loại yêu cầu" rules={[{ required: true }]}>
                                <Select style={{ width: '100%' }}>
                                    <Option value="supplier_payment">Thanh toán NCC</Option>
                                    <Option value="expense_reimbursement">Hoàn ứng / Công tác phí</Option>
                                    <Option value="salary_payment">Chi lương / Thưởng</Option>
                                    <Option value="tax_payment">Nộp thuế / Lệ phí</Option>
                                    <Option value="internal_transfer">Chuyển khoản nội bộ</Option>
                                    <Option value="other">Chi khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
                                <Select style={{ width: '100%' }}>
                                    <Option value="normal">
                                        <Space><FieldTimeOutlined />Bình thường</Space>
                                    </Option>
                                    <Option value="urgent">
                                        <Space><ThunderboltOutlined style={{ color: '#faad14' }} />Gấp</Space>
                                    </Option>
                                    <Option value="critical">
                                        <Space><WarningOutlined style={{ color: '#ff4d4f' }} />Khẩn cấp</Space>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="payment_content" label="Nội dung thanh toán" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} placeholder="Nhập chi tiết nội dung cần chi..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="amount" label="Số tiền yêu cầu" rules={[{ required: true, type: 'number', min: 1000 }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="0 VNĐ"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="currency" label="Tiền tệ" rules={[{ required: true }]}>
                                <Select style={{ width: '100%' }}>
                                    <Option value="vnd"><Space><DollarOutlined />VND - Việt Nam Đồng</Space></Option>
                                    <Option value="usd"><Space><DollarOutlined />USD - Đô la Mỹ</Space></Option>
                                    <Option value="eur"><Space><DollarOutlined />EUR - Đồng Euro</Space></Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin thanh toán</Divider>

                    <Row gutter={16}>
                        {isAccountant && (
                            <Col xs={24} sm={12}>
                                <Form.Item name="company_bank_account_id" label="Tài khoản nguồn (Công ty)" rules={[{ required: isAccountant }]}>
                                    <Select placeholder="Chọn tài khoản chi" showSearch optionFilterProp="children" style={{ width: '100%' }}>
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
                        )}
                        <Col xs={24} sm={12}>
                            <Form.Item name="beneficiary_bank_contact_id" label="Người nhận (Thụ hưởng)" rules={[{ required: true }]}>
                                <Select placeholder="Chọn người nhận" showSearch optionFilterProp="children" style={{ width: '100%' }}>
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

                    <Form.Item name="supporting_files" label="Tài liệu đính kèm (Hợp đồng, Hóa đơn...)">
                        <UploadFilesEdit 
                            value={form.getFieldValue('supporting_files')}
                            onChange={(val) => form.setFieldsValue({ supporting_files: val })}
                        />
                    </Form.Item>

                    <Form.Item name="status" hidden><Input /></Form.Item>
                    <Form.Item name="request_date" hidden><Input /></Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Xác nhận đã chi: ${confirmingRecord?.code}`}
                open={isConfirmPayModalOpen}
                onCancel={() => {
                    setIsConfirmPayModalOpen(false);
                    setConfirmingRecord(null);
                    confirmPayForm.resetFields();
                }}
                onOk={handleConfirmPaid}
                confirmLoading={loading}
                width="95%"
                style={{ maxWidth: 600 }}
            >
                <Form form={confirmPayForm} layout="vertical" initialValues={{ payment_proof_files: [] }}>
                    <Form.Item name="bank_transaction_ref" label="Mã giao dịch ngân hàng" rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch' }]}>
                        <Input placeholder="VD: FT260403..." />
                    </Form.Item>
                    <Form.Item name="payment_proof_note" label="Ghi chú chi tiền">
                        <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)..." />
                    </Form.Item>
                    <Form.Item 
                        name="payment_proof_files" 
                        label="Minh chứng chi tiền (Ảnh chụp màn hình, UNC...)"
                        rules={[{ 
                            required: true, 
                            validator: (_, value) => (value && value.length > 0) ? Promise.resolve() : Promise.reject('Vui lòng upload ảnh minh chứng chi tiền')
                        }]}
                    >
                        <UploadFilesEdit 
                            value={confirmPayForm.getFieldValue('payment_proof_files')}
                            onChange={(val) => {
                                confirmPayForm.setFieldsValue({ payment_proof_files: val });
                                confirmPayForm.validateFields(['payment_proof_files']);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PaymentRequestList;
