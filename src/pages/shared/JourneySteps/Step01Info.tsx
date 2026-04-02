import React, { useState, useEffect, useMemo } from 'react';
import { 
    Card, Form, Input, Button, Space, Typography, Row, Col, 
    Descriptions, Tag, message, Divider, Select, Empty,
    Avatar, Collapse, List, Badge, Modal, DatePicker 
} from 'antd';
import dayjs from 'dayjs';
import { 
    SaveOutlined, EditOutlined, EyeOutlined, UserOutlined, HomeOutlined,
    LoadingOutlined, InfoCircleOutlined, EnvironmentOutlined, FlagOutlined, RocketOutlined, TeamOutlined,
    CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UnorderedListOutlined,
    PaperClipOutlined, FileTextOutlined, CalendarOutlined
} from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { customerService } from '../../../services/core-contracts/services/customer.service';
import { workTaskService } from '../../../services/core-contracts/services/workTask.service';
import { IJourney } from '../../../services/core-contracts/types/journey.types';
import { ICustomer } from '../../../services/core-contracts/types/customer.types';
import { IWorkTask } from '../../../services/core-contracts/types/workTask.types';
import { IJourneyDocument } from '../../../services/core-contracts/types/journeyDocument.types';
import { journeyDocumentService } from '../../../services/core-contracts/services/journeyDocument.service';
import { AuthorizedUserSelect } from '../../../components/authorizedusers/AuthorizedUser';
import { CreateJourneyDocumentModal } from '../../../components/journey/CreateJourneyDocumentModal';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step01InfoProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'blue' },
    high: { label: 'Cao', color: 'orange' },
    critical: { label: 'Khẩn cấp', color: 'red' },
};

const SOURCE_CHANNEL_CONFIG: Record<string, string> = {
    marketing: 'Marketing',
    hotline: 'Hotline',
    referral: 'Giới thiệu',
    direct: 'Trực tiếp'
};

const GO_NO_GO_CONFIG: Record<string, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    go: { label: 'GO ✓', color: 'success' },
    no_go: { label: 'NO-GO ✗', color: 'error' },
    on_hold: { label: 'Tạm hoãn', color: 'warning' },
    pending: { label: 'Chờ xét', color: 'processing' },
};

const PROJECT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    not_started: { label: 'Chưa bắt đầu', color: 'default' },
    active: { label: 'Đang triển khai', color: 'processing' },
    completed: { label: 'Hoàn thành', color: 'success' },
    cancelled: { label: 'Đã hủy', color: 'error' },
};

const SLA_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    on_time: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};

const STEP_NAME_MAPPING: Record<string, string> = {
    lead_intake: '1. Tiếp nhận (Lead Intake)',
    qualification: '2. Thẩm định (Qualification)',
    survey_planning: '3. Lập phương án KS (Survey Planning)',
    site_survey: '4. Khảo sát (Site Survey)',
    survey_review: '5. Duyệt khảo sát (Survey Review)',
    estimate_preparation: '6. Lập dự toán (Estimate)',
    quotation_preparation: '7. Lập báo giá (Quotation)',
    quotation_sent: '8. Gửi báo giá',
    quotation_approved: '9. Khách duyệt',
    contract_signing: '10. Ký hợp đồng',
    project_execution: '11. Thi công',
    handover_acceptance: '12. Nghiệm thu bàn giao',
    warranty_aftercare: '13. Bảo hành/CSKH'
};

export const Step01Info: React.FC<Step01InfoProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [journeyData, setJourneyData] = useState<IJourney | null>(null);
    const [customerData, setCustomerData] = useState<ICustomer | null>(null);
    const [workTasks, setWorkTasks] = useState<IWorkTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [documents, setDocuments] = useState<IJourneyDocument[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [editingDoc, setEditingDoc] = useState<IJourneyDocument | null>(null);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const journey = await journeyService.findJourneyDto(journeyId);
            if (journey) {
                setJourneyData(journey);
                
                let combinedData: any = { ...journey };
                
                if (journey.idx_customer_id?._id) {
                    const customer = await customerService.findCustomerDto(journey.idx_customer_id._id);
                    if (customer) {
                        setCustomerData(customer);
                        Object.assign(combinedData, {
                            full_name: customer.full_name,
                            phone: customer.phone,
                            email: customer.email,
                            customer_code: customer.code,
                            customer_address: customer.address,
                            district: customer.district,
                            city: customer.city,
                            customer_notes: customer.notes
                        });
                    }
                } else {
                    Object.assign(combinedData, {
                        full_name: journey.customer_full_name,
                        phone: journey.customer_phone,
                        email: journey.customer_email,
                        customer_address: journey.customer_address,
                        city: journey.customer_province
                    });
                }
                
                // Convert date strings to dayjs for form binding
                if (journey.planned_start_date) combinedData.planned_start_date = dayjs(journey.planned_start_date);
                if (journey.planned_end_date) combinedData.planned_end_date = dayjs(journey.planned_end_date);

                // Use a small delay or ensure component is rendered to avoid "form not connected" warning
                setTimeout(() => {
                    form.setFieldsValue(combinedData);
                }, 0);
            }
        } catch (error) {
            console.error('Step01Info Fetch Error:', error);
            message.error('Không thể tải thông tin hồ sơ');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async () => {
        setIsLoadingTasks(true);
        try {
            console.log("Fetching tasks for journey:", journeyId);
            const res = await workTaskService.queryWorkTasksDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId }
            } as any);
            if (res.data) {
                console.log(`Fetched ${res.data.length} tasks`);
                setWorkTasks(res.data);
            }
        } catch (error) {
            console.error("Fetch tasks error:", error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const fetchDocuments = async () => {
        setIsLoadingDocs(true);
        try {
            const res = await journeyDocumentService.queryJourneyDocumentsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId }
            } as any);
            if (res.data) {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error("Fetch documents error:", error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchTasks();
        fetchDocuments();

        // Listen for task updates from other components
        const handleRefresh = () => {
            console.log("Refresh event received");
            fetchTasks();
            fetchDocuments();
        };

        window.addEventListener('journey-tasks-updated', handleRefresh);
        window.addEventListener('journey-documents-updated', handleRefresh);
        return () => {
            window.removeEventListener('journey-tasks-updated', handleRefresh);
            window.removeEventListener('journey-documents-updated', handleRefresh);
        };
    }, [journeyId]);

    const handleFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const journeyUpdate = {
                request_title: values.request_title,
                requested_service: values.requested_service,
                site_address: values.site_address,
                source_channel: values.source_channel,
                priority: values.priority,
                request_description: values.request_description,
                customer_province: values.city,
                go_no_go_status: values.go_no_go_status,
                project_status: values.project_status,
                planned_start_date: values.planned_start_date ? (typeof values.planned_start_date === 'string' ? values.planned_start_date : values.planned_start_date.toISOString()) : null,
                planned_end_date: values.planned_end_date ? (typeof values.planned_end_date === 'string' ? values.planned_end_date : values.planned_end_date.toISOString()) : null,
            };
            
            await journeyService.updateJourney(journeyId, journeyUpdate);

            if (journeyData?.idx_customer_id?._id) {
                await customerService.updateCustomer(journeyData.idx_customer_id._id, {
                    full_name: values.full_name,
                    phone: values.phone,
                    email: values.email,
                    address: values.customer_address,
                    district: values.district,
                    city: values.city,
                    notes: values.customer_notes
                });
            }

            setIsEditing(false);
            if (onEditStateChange) onEditStateChange(false);
            message.success('Cập nhật thành công');
            
            await fetchData();
            if (onSave) onSave(values);
        } catch (error) {
            console.error('Step01Info Save Error:', error);
            message.error('Lỗi khi lưu thông tin');
        } finally {
            setIsLoading(false);
        }
    };

    const priorityCfg = useMemo(() => {
        const key = journeyData?.priority || '';
        return PRIORITY_CONFIG[key] || { label: key || '—', color: 'default' };
    }, [journeyData?.priority]);

    return (
        <Card 
            title={
                <Space>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: 16 }}>
                        {isEditing ? "Hiệu chỉnh Tổng quan Hồ sơ" : "Thông tin Tổng quan Hồ sơ"}
                    </span>
                </Space>
            } 
            bordered={false} 
            className="ky-card-detail"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: 12 }}
            extra={isEditable && (
                <Button 
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const nextState = !isEditing;
                        setIsEditing(nextState);
                        if (onEditStateChange) onEditStateChange(nextState);
                    }}
                >
                    {isEditing ? "Hủy sửa" : "Chỉnh sửa"}
                </Button>
            )}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{}}>
                {isLoading && !journeyData ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <LoadingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        <div style={{ marginTop: 16 }}>Đang chuẩn bị hồ sơ...</div>
                    </div>
                ) : !journeyData ? (
                    <Empty description="Không tìm thấy dữ liệu" />
                ) : isEditing ? (
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Divider orientation="left" plain><RocketOutlined /> Yêu cầu</Divider>
                            <Form.Item label="Tiêu đề yêu cầu" name="request_title" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input placeholder="Tên dịch vụ/yêu cầu..." />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Dịch vụ" name="requested_service">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Kênh" name="source_channel">
                                        <Select options={Object.entries(SOURCE_CHANNEL_CONFIG).map(([k, v]) => ({ value: k, label: v }))} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ưu tiên" name="priority">
                                <Select options={Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Ngày bắt đầu (Dự kiến)" name="planned_start_date">
                                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ngày kết thúc (Dự kiến)" name="planned_end_date">
                                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Địa chỉ thi công" name="site_address">
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                            <Form.Item label="Mô tả chi tiết" name="request_description">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            <Divider orientation="left" plain><UserOutlined /> Khách hàng</Divider>
                            <Form.Item label="Tên khách hàng" name="full_name" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="SĐT" name="phone" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Địa chỉ" name="customer_address">
                                <Input prefix={<HomeOutlined />} />
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Quận/Huyện" name="district">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Tỉnh/Thành" name="city">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ghi chú nghiệp vụ" name="customer_notes">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>

                        <Col span={24} style={{ display: 'none' }}>
                            <Divider orientation="left" plain><TeamOutlined /> Điều phối nhân sự</Divider>
                            <Row gutter={24}>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Quản lý dự án (PM)" name="pm_user">
                                        <AuthorizedUserSelect allowMultiple={false} placeholder="Chọn PM" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Giám sát (Supervisors)" name="supervisor_users">
                                        <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Giám sát" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Kỹ thuật (Technical)" name="technical_users">
                                        <AuthorizedUserSelect allowMultiple={true} placeholder="Chọn Kỹ thuật" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Ghi chú bàn giao/phối hợp" name="delivery_note">
                                <TextArea rows={2} placeholder="Nhập ghi chú cho đội ngũ thực hiện..." />
                            </Form.Item>

                            <Divider />
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Trạng thái Go/No-Go" name="go_no_go_status">
                                        <Select options={Object.entries(GO_NO_GO_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Trạng thái triển khai" name="project_status">
                                        <Select options={Object.entries(PROJECT_STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
                                <Button onClick={() => { setIsEditing(false); onEditStateChange?.(false); }}>Hủy</Button>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                    Lưu thay đổi
                                </Button>
                            </Space>
                        </Col>

                        <Col span={24}>
                            <Divider orientation="left" plain><FlagOutlined /> Trạng thái điều hành</Divider>
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Trạng thái Go/No-Go" name="go_no_go_status">
                                        <Select options={Object.entries(GO_NO_GO_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Trạng thái triển khai" name="project_status">
                                        <Select options={Object.entries(PROJECT_STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
                                <Button onClick={() => { setIsEditing(false); onEditStateChange?.(false); }}>Hủy</Button>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                    Lưu thay đổi
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Title level={5}><RocketOutlined style={{ color: '#1890ff', marginRight: 8 }} /> Yêu cầu & Dịch vụ</Title>
                                <Descriptions bordered size="small" column={1}>
                                    <Descriptions.Item label="Tiêu đề">{journeyData.request_title || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Dịch vụ"><Tag color="blue">{journeyData.requested_service || '—'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="Thi công">{journeyData.site_address || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Kênh">{SOURCE_CHANNEL_CONFIG[journeyData.source_channel || ''] || journeyData.source_channel || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Ưu tiên"><Tag color={priorityCfg.color}>{priorityCfg.label}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="Go/No-Go">
                                        <Tag color={GO_NO_GO_CONFIG[journeyData.go_no_go_status || '']?.color}>{GO_NO_GO_CONFIG[journeyData.go_no_go_status || '']?.label || '—'}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="SLA">
                                        <Tag color={SLA_STATUS_CONFIG[journeyData.sla_status || '']?.color}>{SLA_STATUS_CONFIG[journeyData.sla_status || '']?.label || '—'}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Triển khai">
                                        <Tag color={PROJECT_STATUS_CONFIG[journeyData.project_status || '']?.color}>{PROJECT_STATUS_CONFIG[journeyData.project_status || '']?.label || '—'}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thời gian dự kiến">
                                        <Space split={<Text type="secondary">➔</Text>}>
                                            <Space size={4}>
                                                <CalendarOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                                                <Text>{journeyData.planned_start_date ? dayjs(journeyData.planned_start_date).format('DD/MM/YYYY') : '—'}</Text>
                                            </Space>
                                            <Space size={4}>
                                                <CalendarOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                                                <Text>{journeyData.planned_end_date ? dayjs(journeyData.planned_end_date).format('DD/MM/YYYY') : '—'}</Text>
                                            </Space>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mô tả">
                                        <div style={{ whiteSpace: 'pre-wrap', color: '#666', minHeight: 40 }}>{journeyData.request_description || '...'}</div>
                                    </Descriptions.Item>
                                </Descriptions>

                                <div style={{ display: 'none' }}>
                                <Divider orientation="left" plain style={{ marginTop: 24 }}><TeamOutlined /> Điều phối nhân sự</Divider>
                                <Descriptions bordered size="small" column={1} style={{ display: 'none' }}>
                                    <Descriptions.Item label="PM">
                                        {journeyData.pm_user ? <Typography.Text>{journeyData.pm_user}</Typography.Text> : '—'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Giám sát">
                                        {journeyData.supervisor_users?.length ? <Typography.Text>{journeyData.supervisor_users.join(', ')}</Typography.Text> : '—'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Kỹ thuật">
                                        {journeyData.technical_users?.length ? <Typography.Text>{journeyData.technical_users.join(', ')}</Typography.Text> : '—'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú bàn giao">
                                        <div style={{ color: '#888', fontStyle: 'italic' }}>{journeyData.delivery_note || 'Chưa gán'}</div>
                                    </Descriptions.Item>
                                </Descriptions>
                                </div>
                            </Col>
                            
                            <Col xs={24} lg={12}>
                                <Title level={5}><UserOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Hồ sơ Khách hàng</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '8px 0' }}>
                                    <Avatar size={48} style={{ backgroundColor: '#f6ffed' }} icon={<UserOutlined style={{ color: '#52c41a' }} />} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 16 }}>{customerData?.full_name || journeyData.customer_full_name || 'Khách hàng ẩn danh'}</div>
                                        <Tag color="green">{customerData?.code || 'PRE-LINKED'}</Tag>
                                    </div>
                                </div>
                                <Descriptions bordered size="small" column={1}>
                                    <Descriptions.Item label="Điện thoại"><strong>{customerData?.phone || journeyData.customer_phone || '—'}</strong></Descriptions.Item>
                                    <Descriptions.Item label="Email">{customerData?.email || journeyData.customer_email || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">
                                        {[
                                            customerData?.address || journeyData.customer_address,
                                            customerData?.district,
                                            customerData?.city || journeyData.customer_province
                                        ].filter(Boolean).join(', ') || '—'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày tạo">{customerData?.createdAt ? new Date(customerData.createdAt).toLocaleDateString('vi-VN') : '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú">
                                        <div style={{ fontSize: 13, color: '#888' }}>{customerData?.notes || 'Chưa có ghi chú'}</div>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col span={24}>
                                <Divider orientation="left" plain><UnorderedListOutlined style={{ marginRight: 8 }} /> Nhiệm vụ công việc</Divider>
                                {workTasks.length === 0 ? (
                                    <Empty description="Chưa có nhiệm vụ nào được khởi tạo" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                ) : (
                                    <Collapse 
                                        ghost 
                                        expandIconPosition="end"
                                        defaultActiveKey={Object.keys(STEP_NAME_MAPPING)}
                                    >
                                        {Object.entries(STEP_NAME_MAPPING).map(([stepCode, stepName]) => {
                                            const stepTasks = workTasks.filter(t => t.journey_step_code === stepCode);
                                            if (stepTasks.length === 0) return null;
                                            
                                            const finishedCount = stepTasks.filter(t => t.status === 'finished').length;
                                            const totalCount = stepTasks.length;
                                            
                                            return (
                                                <Collapse.Panel 
                                                    header={
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: 24 }}>
                                                            <Text strong>{stepName}</Text>
                                                            <Space>
                                                                <Badge 
                                                                    count={`${finishedCount}/${totalCount}`} 
                                                                    style={{ backgroundColor: finishedCount === totalCount ? '#52c41a' : '#1890ff' }} 
                                                                />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>nhiệm vụ</Text>
                                                            </Space>
                                                        </div>
                                                    } 
                                                    key={stepCode}
                                                >
                                                    <List
                                                        size="small"
                                                        dataSource={stepTasks}
                                                        renderItem={task => (
                                                            <List.Item style={{ padding: '8px 16px' }}>
                                                                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12 }}>
                                                                    <div>
                                                                        {task.status === 'finished' ? (
                                                                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                                                        ) : task.status === 'skipped' ? (
                                                                            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                                                        ) : (
                                                                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                                                                        )}
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ fontWeight: 500, textDecoration: task.status === 'finished' ? 'line-through' : 'none', color: task.status === 'finished' ? '#888' : 'inherit' }}>
                                                                            {task.title}
                                                                            {task.is_required && <Tag color="red" style={{ marginLeft: 8, fontSize: 10 }}>Bắt buộc</Tag>}
                                                                        </div>
                                                                        {task.description && <div style={{ fontSize: 12, color: '#999' }}>{task.description}</div>}
                                                                    </div>
                                                                    <div>
                                                                        <Tag color={task.status === 'finished' ? 'success' : task.status === 'skipped' ? 'error' : 'orange'}>
                                                                            {task.status === 'finished' ? 'Xong' : task.status === 'skipped' ? 'Bỏ qua' : 'Chờ'}
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Collapse.Panel>
                                            );
                                        })}
                                    </Collapse>
                                )}
                            </Col>
                        </Row>

                        <Divider orientation="left" plain>
                            <Space>
                                <PaperClipOutlined />
                                <Text strong>Tài liệu công trình</Text>
                                <Badge count={documents.length} style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        </Divider>

                        <List
                            loading={isLoadingDocs}
                            dataSource={documents}
                            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                            renderItem={doc => (
                                <List.Item>
                                    <Card size="small" hoverable actions={[
                                        <EditOutlined key="edit" onClick={() => { setEditingDoc(doc); setIsDocModalOpen(true); }} />,
                                        <Divider type="vertical" />,
                                        <Button type="text" danger icon={<CloseCircleOutlined />} onClick={async () => {
                                            Modal.confirm({
                                                title: 'Xóa tài liệu',
                                                content: 'Bạn có chắc chắn muốn xóa tài liệu này?',
                                                onOk: async () => {
                                                    await journeyDocumentService.deleteJourneyDocument(doc._id);
                                                    message.success("Đã xóa tài liệu");
                                                    fetchDocuments();
                                                }
                                            });
                                        }} />
                                    ]}>
                                        <Card.Meta
                                            avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                                            title={<Text ellipsis={{ tooltip: doc.description }}>{doc.description || 'Không có mô tả'}</Text>}
                                            description={
                                                <Space direction="vertical" size={2}>
                                                    <Tag color="cyan">{doc.context_type?.toUpperCase()}</Tag>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        {doc.files && doc.files.length > 0 ? (
                                                            <Space wrap>
                                                                {doc.files.map((f, i) => (
                                                                    <Button key={i} size="small" type="link" href={f.url} target="_blank" style={{ padding: 0 }}>
                                                                        File {i+1}
                                                                    </Button>
                                                                ))}
                                                            </Space>
                                                        ) : 'Không có file'}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </List.Item>
                            )}
                            locale={{ emptyText: <Empty description="Chưa có tài liệu nào được tải lên" /> }}
                        />
                    </>
                )}
            </Form>

            <CreateJourneyDocumentModal
                open={isDocModalOpen}
                onCancel={() => { setIsDocModalOpen(false); setEditingDoc(null); }}
                onSuccess={() => {
                    setIsDocModalOpen(false);
                    setEditingDoc(null);
                    fetchDocuments();
                }}
                journeyId={journeyId!}
                editingDoc={editingDoc}
            />
        </Card>
    );
};

export default Step01Info;
