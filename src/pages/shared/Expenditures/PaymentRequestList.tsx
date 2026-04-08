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
    FieldTimeOutlined, DollarOutlined, PaperClipOutlined,
    FileImageOutlined, EyeOutlined, DownloadOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import PaymentRequestDetailModal from './components/PaymentRequestDetailModal';
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
    const rawRoleStr = role?.toUpperCase() || '';
    const isAccountant = rawRoleStr === 'KT' || isAdmin;
    const isPM = rawRoleStr === 'PM' || rawRoleStr === 'QL' || isAdmin;
    const canManageAll = isAccountant || isPM;
    
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const [previewFile, setPreviewFile] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const isImageFile = (file: any) => {
        if (!file?.name) return false;
        const imgPattern = new RegExp(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i);
        return imgPattern.test(file.name);
    };

    const renderFileCell = (files: any[]) => {
        if (!files || files.length === 0) return <Text type="secondary" style={{ fontSize: 11 }}>Không có</Text>;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Space size={4} wrap>
                    {files.map((file, idx) => {
                        const url = getFileLink(file.file_id || file.url);
                        if (isImageFile(file)) {
                            return (
                                <Image
                                    key={file.file_id || idx}
                                    src={url}
                                    width={32}
                                    height={32}
                                    style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9' }}
                                    preview={{
                                        mask: <EyeOutlined style={{ fontSize: 10 }} />,
                                        src: url
                                    }}
                                />
                            );
                        }
                        return (
                            <Tooltip key={file.file_id || idx} title={file.name}>
                                <Button
                                    size="small"
                                    shape="circle"
                                    icon={<FileTextOutlined style={{ fontSize: 12 }} />}
                                    onClick={() => {
                                        setPreviewFile(file);
                                        setIsPreviewModalOpen(true);
                                    }}
                                    style={{ 
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Space>
                {files.length > 2 && <Text type="secondary" style={{ fontSize: 10 }}>+{files.length - 2} tệp khác</Text>}
            </div>
        );
    };

    const getBaseFilter = () => {
        const filter: any = { collection: 'paymentrequest' };
        if (!canManageAll && user?.username) {
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
        } else {
            setEditingRequest(null);
        }
        setIsModalOpen(true);
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
                    <Tooltip title="Số tiền">
                        <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 15 }}>
                            {amount?.toLocaleString('vi-VN')}
                        </div>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.currency?.toUpperCase() || 'VND'}</Text>
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Chứng từ',
            key: 'supporting_files',
            width: 140,
            render: (_, record) => renderFileCell(record.supporting_files || [])
        },
        {
            title: 'Minh chứng',
            key: 'payment_proof_files',
            width: 140,
            render: (_, record) => renderFileCell(record.payment_proof_files || [])
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => {
                const isOwner = record.requested_by === user?.username || (record as any).createdBy === user?.username;
                const canEdit = isAccountant || (isOwner && record.status === 'draft');

                return (
                    <Space size={4}>
                        <Tooltip title="Xem chi tiết & Xử lý">
                            <Button 
                                icon={<EyeOutlined />} 
                                size="small" 
                                type="text" 
                                onClick={() => handleOpenModal(record)} 
                            />
                        </Tooltip>
                        <Divider type="vertical" />
                        <Popconfirm 
                            title="Xóa yêu cầu này?" 
                            onConfirm={() => handleDelete(record._id)}
                            disabled={!canEdit}
                        >
                            <Button 
                                icon={<DeleteOutlined />} 
                                size="small" 
                                type="text" 
                                danger 
                                disabled={!canEdit}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
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
                    {canManageAll ? 'Quản lý Yêu cầu chi' : 'Yêu cầu chi của tôi'}
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

            <PaymentRequestDetailModal 
                isOpen={isModalOpen}
                request={editingRequest}
                companyAccounts={companyAccounts}
                beneficiaryContacts={beneficiaryContacts}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchData()}
                onBeneficiaryContactsRefresh={async () => {
                    const res = await beneficiaryBankContactService.queryBeneficiaryBankContactsDto({});
                    if (res.code === 0 && res.data) setBeneficiaryContacts(res.data);
                }}
            />

            {/* Preview Modal for non-image files */}
            <Modal
                title={'Xem tài liệu: ' + (previewFile?.name || '')}
                open={isPreviewModalOpen}
                onCancel={() => {
                    setIsPreviewModalOpen(false);
                    setPreviewFile(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setIsPreviewModalOpen(false);
                        setPreviewFile(null);
                    }}>Đóng</Button>,
                    <Button 
                        key="download" 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        onClick={() => {
                            const url = getFileLink(previewFile?.file_id || previewFile?.url);
                            window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                    >
                        Tải xuống
                    </Button>,
                ]}
                width={1000}
                styles={{ body: { height: '75vh', padding: 0 } }}
            >
                {previewFile && (
                    <iframe 
                        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(getFileLink(previewFile.file_id || previewFile.url) || '')}`} 
                        title={previewFile.name} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none', background: '#f5f5f5' }} 
                    />
                )}
            </Modal>
        </div>
    );
};

export default PaymentRequestList;
