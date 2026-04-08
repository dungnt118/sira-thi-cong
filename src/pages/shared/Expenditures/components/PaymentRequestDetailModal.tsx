import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Select, Button, Space, Typography,
    Row, Col, InputNumber, Divider, Descriptions, Badge,
    Tag, message, Upload, Steps, Image, Card
} from 'antd';
import {
    SaveOutlined, SendOutlined, CheckCircleOutlined,
    CloseCircleOutlined, StopOutlined, FieldTimeOutlined,
    ThunderboltOutlined, WarningOutlined, DollarOutlined,
    BankOutlined, UserOutlined, DownloadOutlined, EyeOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { UploadFilesEdit } from '@/components/files/UploadFiles';
import { paymentRequestService } from '@/services/core-contracts/services/paymentRequest.service';
import { beneficiaryBankContactService } from '@/services/core-contracts/services/beneficiaryBankContact.service';
import { getFileLink } from '@/services/storeService';
import type { IPaymentRequest, ICreatePaymentRequestInput } from '@/services/core-contracts/types/paymentRequest.types';
import type { ICompanyBankAccount } from '@/services/core-contracts/types/companyBankAccount.types';
import type { IBeneficiaryBankContact } from '@/services/core-contracts/types/beneficiaryBankContact.types';
import moment from 'moment';

const { Option } = Select;
const { Text, Title } = Typography;
const { Step } = Steps;

interface PaymentRequestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    request: IPaymentRequest | null;
    companyAccounts: ICompanyBankAccount[];
    beneficiaryContacts: IBeneficiaryBankContact[];
    onBeneficiaryContactsRefresh: () => void; // call this to update list if a new one is auto-created
}

const renderStatus = (status?: string) => {
    switch (status) {
        case 'draft': return <Tag color="default">Nháp</Tag>;
        case 'pending_approval': return <Tag color="warning">Chờ duyệt</Tag>;
        case 'approved': return <Tag color="processing">Đã duyệt</Tag>;
        case 'paid': return <Tag color="success">Đã chi</Tag>;
        case 'rejected': return <Tag color="error">Từ chối</Tag>;
        case 'cancelled': return <Tag color="default">Đã hủy</Tag>;
        default: return <Tag color="default">Không xác định</Tag>;
    }
};

const PaymentRequestDetailModal: React.FC<PaymentRequestDetailModalProps> = ({
    isOpen, onClose, onSuccess, request, companyAccounts, beneficiaryContacts, onBeneficiaryContactsRefresh
}) => {
    const [form] = Form.useForm();
    const [rejectForm] = Form.useForm();
    const [confirmPayForm] = Form.useForm();

    const [saving, setSaving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isConfirmingPay, setIsConfirmingPay] = useState(false);

    const { user, role, isAdmin } = useAuth();
    
    // Roles extraction
    const rawRoleStr = role?.toUpperCase() || '';
    const isAccountant = rawRoleStr === 'KT' || isAdmin;
    const isPM = rawRoleStr === 'PM' || rawRoleStr === 'QL' || isAdmin;
    
    const isOwner = request?.requested_by === user?.username || (request as any)?.createdBy === user?.username;
    
    // Form can edit if it's new (null request), or if it's draft and user is owner
    const canEdit = !request || (request.status === 'draft' && isOwner) || isAccountant;
    // Detail View mode (hide inputs, show Descriptions)
    const isDetailMode = !!request && !canEdit;

    const selectedContactId = Form.useWatch('beneficiary_bank_contact_id', form);

    useEffect(() => {
        if (isOpen) {
            form.resetFields();
            rejectForm.resetFields();
            confirmPayForm.resetFields();

            if (request) {
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
                        c.contact_name?.toLowerCase().includes(user?.username?.toLowerCase() || '') ||
                        c.contact_name?.toLowerCase().includes(user?.display_name?.toLowerCase() || '')
                    );
                    if (contact) {
                        defaultValues.beneficiary_bank_contact_id = contact._id;
                    } else {
                        defaultValues.beneficiary_name_snapshot = userDisplayName;
                    }
                }
                form.setFieldsValue(defaultValues);
            }
        }
    }, [isOpen, request, beneficiaryContacts, form, rejectForm, confirmPayForm, isAccountant, user]);

    useEffect(() => {
        if (selectedContactId && canEdit) {
            const contact = beneficiaryContacts.find(c => c._id === selectedContactId);
            if (contact) {
                form.setFieldsValue({
                    beneficiary_name_snapshot: contact.bank_account_name || contact.contact_name,
                    beneficiary_account_number_snapshot: contact.bank_account_number,
                    beneficiary_bank_name_snapshot: contact.bank_name,
                    beneficiary_branch_snapshot: contact.branch_name
                });
            }
        }
    }, [selectedContactId, beneficiaryContacts, form, canEdit]);

    const handleSave = async (statusOverride?: string) => {
        try {
            const values = await form.validateFields();
            if (statusOverride) {
                values.status = statusOverride;
            }
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

            if (request) {
                await paymentRequestService.updatePaymentRequest(request._id, values);
                message.success('Cập nhật yêu cầu thành công');
            } else {
                // Auto create contact if manual info is provided without a selected ID
                if (!values.beneficiary_bank_contact_id && values.beneficiary_account_number_snapshot) {
                    try {
                        const newContact = await beneficiaryBankContactService.createBeneficiaryBankContact({
                            contact_name: values.beneficiary_name_snapshot,
                            bank_account_name: values.beneficiary_name_snapshot,
                            bank_account_number: values.beneficiary_account_number_snapshot,
                            bank_name: values.beneficiary_bank_name_snapshot,
                            branch_name: values.beneficiary_branch_snapshot,
                            contact_type: 'other',
                            status: 'active'
                        });
                        values.beneficiary_bank_contact_id = newContact._id;
                        onBeneficiaryContactsRefresh();
                    } catch (err) {
                        console.error('Failed to auto-create contact:', err);
                    }
                }

                values.requested_by = user?.username || 'unknown';
                values.submitted_at = new Date().toISOString();
                
                await paymentRequestService.createPaymentRequest(values as ICreatePaymentRequestInput);
                message.success('Tạo yêu cầu chi mới thành công');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save payment request:', error);
            message.error('Có lỗi xảy ra khi lưu yêu cầu');
        } finally {
            setSaving(false);
        }
    };

    const handleApprove = async () => {
        if (!request) return;
        try {
            setSaving(true);
            await paymentRequestService.updatePaymentRequest(request._id, {
                status: 'approved',
                approved_at: new Date().toISOString(),
                approved_by: user?.display_name || user?.username || 'Approver'
            });
            message.success(`Đã phê duyệt yêu cầu ${request.code}`);
            onSuccess();
            onClose();
        } catch (error) {
            message.error('Không thể phê duyệt yêu cầu');
        } finally {
            setSaving(false);
        }
    };

    const submitReject = async () => {
        if (!request) return;
        try {
            const values = await rejectForm.validateFields();
            setIsRejecting(true);
            await paymentRequestService.updatePaymentRequest(request._id, {
                status: 'rejected',
                rejected_at: new Date().toISOString(),
                rejected_by: user?.username || 'unknown',
                rejection_reason: values.rejection_reason
            });
            message.success('Đã từ chối yêu cầu chi');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Form validate error or save error', error);
        } finally {
            setIsRejecting(false);
            rejectForm.resetFields();
        }
    };

    const submitConfirmPay = async () => {
        if (!request) return;
        try {
            const values = await confirmPayForm.validateFields();
            setIsConfirmingPay(true);
            await paymentRequestService.updatePaymentRequest(request._id, {
                status: 'paid',
                paid_at: new Date().toISOString(),
                paid_by: user?.username || 'Accountant',
                bank_transaction_ref: values.bank_transaction_ref,
                payment_proof_note: values.payment_proof_note,
                payment_proof_files: values.payment_proof_files
            });
            message.success(`Đã xác nhận chi tiền`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to confirm paid', error);
        } finally {
            setIsConfirmingPay(false);
        }
    };

    const [previewFile, setPreviewFile] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const getStepConfig = (status?: string) => {
        let current = 0;
        let stepStatus: 'wait' | 'process' | 'finish' | 'error' = 'process';

        switch (status) {
            case 'draft':
            case 'pending_approval':
                current = 0;
                break;
            case 'approved':
                current = 1;
                break;
            case 'paid':
                current = 2;
                stepStatus = 'finish';
                break;
            case 'rejected':
                current = 1;
                stepStatus = 'error';
                break;
            case 'cancelled':
                current = 0;
                stepStatus = 'error';
                break;
            default:
                current = 0;
        }

        return { current, stepStatus };
    };

    const renderFileItem = (file: any) => {
        const isImage = (f: any) => {
            const name = f.name?.toLowerCase() || '';
            return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif') || name.endsWith('.webp');
        };

        const url = getFileLink(file.file_id || file.url);

        return (
            <Card 
                size="small" 
                hoverable 
                style={{ width: 140, marginBottom: 8 }}
                cover={
                    isImage(file) ? (
                        <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', overflow: 'hidden' }}>
                            <Image 
                                src={url} 
                                alt={file.name} 
                                style={{ maxHeight: 100, maxWidth: '100%' }}
                                preview={{
                                    mask: <EyeOutlined />
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', cursor: 'pointer' }}
                            onClick={() => {
                                setPreviewFile(file);
                                setIsPreviewModalOpen(true);
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
                        </div>
                    )
                }
                bodyStyle={{ padding: 8 }}
            >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                    <Text title={file.name}>{file.name}</Text>
                </div>
                {!isImage(file) && (
                    <Button 
                        type="link" 
                        size="small" 
                        icon={<DownloadOutlined />} 
                        style={{ padding: 0, height: 'auto', marginTop: 4 }}
                        onClick={() => window.open(url, '_blank')}
                    >
                        Tải xuống
                    </Button>
                )}
            </Card>
        );
    };

    const renderFooter = () => {
        const actions = [];
        actions.push(<Button key="close" onClick={onClose}>Đóng</Button>);

        if (!request || (request.status === 'draft' && isOwner)) {
            actions.push(<Button key="draft" onClick={() => handleSave('draft')} loading={saving}>Lưu nháp</Button>);
            actions.push(<Button key="submit" type="primary" onClick={() => handleSave('pending_approval')} loading={saving}>Gửi duyệt</Button>);
        }

        // Logic requiring request
        if (request) {
            // PM logic
            if (request.status === 'pending_approval' && isPM) {
                actions.push(
                    <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => {
                        rejectForm.resetFields();
                        Modal.confirm({
                            title: 'Từ chối yêu cầu chi',
                            icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
                            content: (
                                <Form form={rejectForm} layout="vertical" style={{ marginTop: 16 }}>
                                    <Form.Item name="rejection_reason" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                                        <Input.TextArea rows={3} placeholder="Nhập lý do từ chối..." />
                                    </Form.Item>
                                </Form>
                            ),
                            okText: 'Xác nhận từ chối',
                            okButtonProps: { danger: true },
                            onOk: submitReject
                        });
                    }}>Từ chối</Button>
                );
                actions.push(
                    <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={handleApprove} loading={saving}>
                        Duyệt chi
                    </Button>
                );
            }

            // Accountant pay logic
            if (request.status === 'approved' && isAccountant) {
                actions.push(
                    <Button key="reject_acc" danger icon={<CloseCircleOutlined />} onClick={() => {
                        rejectForm.resetFields();
                        Modal.confirm({
                            title: 'Từ chối yêu cầu chi',
                            icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
                            content: (
                                <Form form={rejectForm} layout="vertical" style={{ marginTop: 16 }}>
                                    <Form.Item name="rejection_reason" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                                        <Input.TextArea rows={3} placeholder="Nhập lý do từ chối..." />
                                    </Form.Item>
                                </Form>
                            ),
                            okText: 'Xác nhận từ chối',
                            okButtonProps: { danger: true },
                            onOk: submitReject
                        });
                    }}>Từ chối chi</Button>
                );
                actions.push(
                    <Button key="pay" type="primary" icon={<SendOutlined />} onClick={() => {
                        Modal.confirm({
                            title: 'Xác nhận đã chi tiền',
                            icon: <DollarOutlined style={{ color: '#52c41a' }} />,
                            width: 500,
                            content: (
                                <Form form={confirmPayForm} layout="vertical" style={{ marginTop: 16 }} initialValues={{ payment_proof_files: [] }}>
                                    <Form.Item name="bank_transaction_ref" label="Mã giao dịch ngân hàng" rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch' }]}>
                                        <Input placeholder="VD: FT260403..." />
                                    </Form.Item>
                                    <Form.Item name="payment_proof_note" label="Ghi chú chi tiền">
                                        <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)..." />
                                    </Form.Item>
                                    <Form.Item name="payment_proof_files" label="Minh chứng chi tiền" rules={[{ required: true, validator: (_, value) => (value && value.length > 0) ? Promise.resolve() : Promise.reject('Vui lòng đính kèm minh chứng') }]}>
                                        <UploadFilesEdit value={confirmPayForm.getFieldValue('payment_proof_files')} onChange={(val) => {
                                            confirmPayForm.setFieldsValue({ payment_proof_files: val });
                                            confirmPayForm.validateFields(['payment_proof_files']);
                                        }} />
                                    </Form.Item>
                                </Form>
                            ),
                            okText: 'Hoàn tất chi tiền',
                            onOk: submitConfirmPay
                        });
                    }}>
                        Xác nhận chi
                    </Button>
                );
            }

            // Just accountant modifying a draft
            if (canEdit && request.status === 'draft' && isAccountant) {
                actions.push(<Button key="save" type="primary" onClick={() => handleSave()} loading={saving}>Lưu yêu cầu</Button>);
            }
        }

        return <Space>{actions}</Space>;
    };

    const renderReadOnlyView = () => {
        if (!request) return null;
        const { current, stepStatus } = getStepConfig(request.status);

        return (
            <div className="payment-request-detail">
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <div style={{ marginBottom: 24, padding: '0 12px' }}>
                            <Steps current={current} status={stepStatus} size="small">
                                <Step 
                                    title="Khởi tạo" 
                                    description={
                                        <div style={{ fontSize: 11 }}>
                                            <div>{request.requested_by?.display_name || request.requested_by || 'Khách'}</div>
                                            <div>{moment(request.request_date).format('DD/MM/YYYY')}</div>
                                        </div>
                                    } 
                                />
                                <Step 
                                    title={request.status === 'rejected' ? 'Từ chối' : 'Phê duyệt'} 
                                    description={
                                        request.approved_at ? (
                                            <div style={{ fontSize: 11 }}>
                                                <div>{request.approved_by?.display_name || request.approved_by}</div>
                                                <div>{moment(request.approved_at).format('DD/MM/YYYY HH:mm')}</div>
                                            </div>
                                        ) : request.status === 'rejected' ? (
                                            <div style={{ fontSize: 11, color: '#ff4d4f' }}>
                                                <div>{request.rejected_by?.display_name || request.rejected_by}</div>
                                                <div>{request.rejected_at ? moment(request.rejected_at).format('DD/MM/YYYY HH:mm') : ''}</div>
                                                {request.rejection_reason && <Text type="danger" style={{ fontSize: 11 }}>Lý do: {request.rejection_reason}</Text>}
                                            </div>
                                        ) : 'Đang chờ...'
                                    } 
                                />
                                <Step 
                                    title="Thanh toán" 
                                    description={
                                        request.paid_at ? (
                                            <div style={{ fontSize: 11 }}>
                                                <div>{request.paid_by?.display_name || request.paid_by}</div>
                                                <div>{moment(request.paid_at).format('DD/MM/YYYY HH:mm')}</div>
                                            </div>
                                        ) : '—'
                                    } 
                                />
                            </Steps>
                        </div>
                    </Col>

                    <Col span={24}>
                        <div style={{ padding: '16px 20px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0', marginBottom: 16 }}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {request.code || 'Chưa định danh'}
                                    </Title>
                                    <Space size="middle" style={{ marginTop: 8 }}>
                                        <Text type="secondary">Mức độ: 
                                            {request.priority === 'urgent' ? <Tag color="warning">Gấp</Tag> : 
                                             request.priority === 'critical' ? <Tag color="error">Khẩn cấp</Tag> : 
                                             <Tag color="cyan">Bình thường</Tag>}
                                        </Text>
                                        <Text type="secondary">Cập nhật: {moment(request.submitted_at || request.request_date).format('DD/MM/YYYY HH:mm')}</Text>
                                    </Space>
                                </Col>
                                <Col>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Tổng tiền đề nghị</Text>
                                        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                            {request.amount?.toLocaleString('vi-VN')} <span style={{ fontSize: 16 }}>{request.currency?.toUpperCase()}</span>
                                        </Title>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    
                    <Col span={24}>
                        <Descriptions title="Nội dung yêu cầu" bordered column={2} size="small">
                            <Descriptions.Item label="Loại yêu cầu">{
                                request.request_type === 'supplier_payment' ? 'Thanh toán NCC' :
                                request.request_type === 'expense_reimbursement' ? 'Hoàn ứng/Công tác phí' :
                                request.request_type === 'salary_payment' ? 'Chi lương/Thưởng' :
                                request.request_type === 'tax_payment' ? 'Nộp thuế' :
                                request.request_type === 'internal_transfer' ? 'Chuyển khoản nội bộ' : 'Khác'
                            }</Descriptions.Item>
                            <Descriptions.Item label="Ghi chú thêm">{request.request_note || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Nội dung chi tiết" span={2}>{request.payment_content}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    
                    <Col span={24}>
                        <Descriptions title="Tài khoản thụ hưởng" bordered column={2} size="small">
                            <Descriptions.Item label="Tên người nhận"><b>{request.beneficiary_name_snapshot}</b></Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản"><b>{request.beneficiary_account_number_snapshot}</b></Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng">{request.beneficiary_bank_name_snapshot}</Descriptions.Item>
                            <Descriptions.Item label="Chi nhánh">{request.beneficiary_branch_snapshot || '-'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    
                    {request.status === 'paid' && (
                        <Col span={24}>
                            <Descriptions title="Thông tin thanh toán (KT xác nhận)" bordered column={2} size="small" style={{ backgroundColor: '#f6ffed' }}>
                                <Descriptions.Item label="Tài khoản chi">{request.source_bank_name_snapshot}</Descriptions.Item>
                                <Descriptions.Item label="Mã giao dịch"><b>{request.bank_transaction_ref}</b></Descriptions.Item>
                                <Descriptions.Item label="Người thực hiện">{request.paid_by}</Descriptions.Item>
                                <Descriptions.Item label="Ngày thực hiện">{request.paid_at ? moment(request.paid_at).format('DD/MM/YYYY HH:mm') : '-'}</Descriptions.Item>
                                {request.payment_proof_note && <Descriptions.Item label="Ghi chú chi" span={2}>{request.payment_proof_note}</Descriptions.Item>}
                            </Descriptions>
                        </Col>
                    )}

                    <Col span={24}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Divider orientation="left" style={{ margin: '12px 0' }}>Chứng từ đính kèm</Divider>
                                <div style={{ minHeight: 60 }}>
                                    {!request.supporting_files || request.supporting_files.length === 0 ? <Text type="secondary" italic>Không có tài liệu</Text> : (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                            {request.supporting_files.map((file, idx) => renderFileItem(file))}
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col span={12}>
                                <Divider orientation="left" style={{ margin: '12px 0' }}>Minh chứng chi tiền</Divider>
                                <div style={{ minHeight: 60 }}>
                                    {!request.payment_proof_files || request.payment_proof_files.length === 0 ? <Text type="secondary" italic>Chưa có minh chứng</Text> : (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                            {request.payment_proof_files.map((file, idx) => renderFileItem(file))}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <Modal
            title={!request ? "Tạo yêu cầu chi mới" : isDetailMode ? "Chi tiết phiếu đề nghị chi" : "Cập nhật yêu cầu chi"}
            open={isOpen}
            onCancel={onClose}
            footer={renderFooter()}
            width="95%"
            style={{ maxWidth: 900 }}
            destroyOnClose
        >
            {isDetailMode ? renderReadOnlyView() : (
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        {isAccountant && (
                            <Col xs={24} sm={24}>
                                <Form.Item name="code" label="Mã yêu cầu">
                                    <Input placeholder="VD: YCC-2026-001" />
                                </Form.Item>
                            </Col>
                        )}
                        <Col xs={24} sm={12}>
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
                        <Col xs={24} sm={12}>
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
                            <Form.Item name="beneficiary_bank_contact_id" label="Người nhận (Thụ hưởng)">
                                <Select 
                                    placeholder="Chọn người nhận" 
                                    showSearch 
                                    optionFilterProp="children" 
                                    style={{ width: '100%' }}
                                    allowClear
                                >
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

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="beneficiary_name_snapshot" 
                                label="Tên người nhận (Thụ hưởng)" 
                                rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
                            >
                                <Input placeholder="Tên chủ tài khoản" disabled={!!selectedContactId} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="beneficiary_account_number_snapshot" 
                                label="Số tài khoản" 
                                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
                            >
                                <Input placeholder="Số tài khoản ngân hàng" disabled={!!selectedContactId} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="beneficiary_bank_name_snapshot" 
                                label="Ngân hàng" 
                                rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
                            >
                                <Input placeholder="Tên ngân hàng (Vd: MBBank)" disabled={!!selectedContactId} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="beneficiary_branch_snapshot" label="Chi nhánh">
                                <Input placeholder="Chi nhánh ngân hàng (nếu có)" disabled={!!selectedContactId} />
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
            )}

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
        </Modal>
    );
};

export default PaymentRequestDetailModal;
