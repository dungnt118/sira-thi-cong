/*
 * Phiên bản mock cũ được giữ tạm trong comment để đối chiếu migration.
 * Runtime bên dưới sử dụng SurveyAppointment service chuẩn theo core-contracts.
 *
import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Table, Tag, Row, Col, DatePicker, TimePicker, Select, Divider, message, Descriptions } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined, PlusOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

export interface Appointment {
    id: string;
    date: string;
    time: string;
    surveyor: string;
    status: 'SCHEDULED' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    reason?: string;
    notes?: string;
}

export interface Step02ConsultProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step02Consult: React.FC<Step02ConsultProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    console.log(`Rendering Step02Consult for journey: ${journeyId}`);
    const [activeMode, setActiveMode] = useState<'list' | 'edit' | 'view'>('list');
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: '1', date: '2026-03-15', time: '09:00', surveyor: 'Nguyễn Văn Giám sát', status: 'SUCCESS', notes: 'Đã khảo sát xong, khách hàng rất nhiệt tình' },
        { id: '2', date: '2026-03-10', time: '14:30', surveyor: 'Bùi Văn Kỹ Thuật', status: 'FAILED', reason: 'Khách hàng bận đột xuất', notes: 'Cần hẹn lại vào tuần sau' },
    ]);

    const handleBackToList = () => {
        setActiveMode('list');
        setSelectedAppt(null);
        form.resetFields();
    };

    const handleCreate = () => {
        setSelectedAppt(null);
        form.resetFields();
        form.setFieldsValue({ status: 'SCHEDULED', surveyor: 'Nguyễn Văn Giám sát' });
        setActiveMode('edit');
        if (onEditStateChange) onEditStateChange(true);
    };

    const handleEdit = (record: Appointment) => {
        setSelectedAppt(record);
        form.setFieldsValue({
            ...record,
            date: dayjs(record.date),
            time: dayjs(record.time, 'HH:mm'),
        });
        setActiveMode('edit');
        if (onEditStateChange) onEditStateChange(true);
    };

    const handleView = (record: Appointment) => {
        setSelectedAppt(record);
        setActiveMode('view');
    };

    const handleFinish = (values: any) => {
        const payload = {
            ...values,
            id: selectedAppt ? selectedAppt.id : Math.random().toString(36).substr(2, 9),
            date: values.date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm'),
        };

        if (selectedAppt) {
            setAppointments(appointments.map(a => a.id === selectedAppt.id ? payload : a));
            message.success('Cập nhật lịch hẹn thành công');
        } else {
            setAppointments([payload, ...appointments]);
            message.success('Thêm lịch hẹn mới thành công');
        }

        if (onSave) onSave(payload);
        handleBackToList();
    };

    const getStatusTag = (status: string) => {
        const config: any = {
            SCHEDULED: { color: 'blue', text: 'Đã đặt lịch' },
            SUCCESS: { color: 'green', text: 'Thành công' },
            FAILED: { color: 'red', text: 'Thất bại' },
            CANCELLED: { color: 'default', text: 'Đã hủy' },
        };
        const item = config[status] || config.SCHEDULED;
        return <Tag color={item.color}>{item.text}</Tag>;
    };

    const columns = [
        {
            title: 'Ngày/Giờ',
            key: 'datetime',
            render: (_: any, r: Appointment) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.date}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{r.time}</Text>
                </Space>
            )
        },
        { title: 'Người khảo sát', dataIndex: 'surveyor', key: 'surveyor' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => getStatusTag(s)
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, r: Appointment) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => handleView(r)} />
                    {isEditable && <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)} />}
                </Space>
            )
        }
    ];

    const renderList = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <Text type="secondary">Danh sách các lần hẹn liên hệ và khảo sát tại công trình.</Text>
                {isEditable && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Đặt lịch mới
                    </Button>
                )}
            </div>
            <Table 
                dataSource={appointments} 
                columns={columns} 
                rowKey="id" 
                size="small" 
                pagination={false}
                locale={{ emptyText: 'Chưa có lịch hẹn nào được ghi nhận' }}
            />
        </div>
    );

    const renderView = () => {
        if (!selectedAppt) return null;
        return (
            <div>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList} style={{ marginBottom: 16 }}>
                    Quay lại danh sách
                </Button>
                <Descriptions title="Chi tiết lịch hẹn" bordered column={1} size="small">
                    <Descriptions.Item label="Ngày hẹn">{selectedAppt.date}</Descriptions.Item>
                    <Descriptions.Item label="Giờ hẹn">{selectedAppt.time}</Descriptions.Item>
                    <Descriptions.Item label="Người khảo sát">{selectedAppt.surveyor}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getStatusTag(selectedAppt.status)}</Descriptions.Item>
                    {selectedAppt.status === 'FAILED' && (
                        <Descriptions.Item label="Lý do thất bại">{selectedAppt.reason || '—'}</Descriptions.Item>
                    )}
                    <Descriptions.Item label="Ghi chú">{selectedAppt.notes || '—'}</Descriptions.Item>
                </Descriptions>
                {isEditable && (
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(selectedAppt)}
                        style={{ marginTop: 16 }}
                    >
                        Chỉnh sửa
                    </Button>
                )}
            </div>
        );
    };

    const renderEdit = () => (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList} type="text" />
                <Title level={5} style={{ margin: 0 }}>
                    {selectedAppt ? 'Cập nhật lịch hẹn' : 'Đặt lịch hẹn khảo sát mới'}
                </Title>
            </div>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Ngày hẹn" name="date" rules={[{ required: true, message: 'Chọn ngày' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giờ hẹn" name="time" rules={[{ required: true, message: 'Chọn giờ' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Người khảo sát" name="surveyor" rules={[{ required: true }]}>
                            <Input placeholder="Tên nhân viên khảo sát" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
                            <Select>
                                <Option value="SCHEDULED">Đã đặt lịch</Option>
                                <Option value="SUCCESS">Thành công</Option>
                                <Option value="FAILED">Thất bại</Option>
                                <Option value="CANCELLED">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.status !== curr.status}>
                        {({ getFieldValue }) => getFieldValue('status') === 'FAILED' ? (
                            <Col span={24}>
                                <Form.Item label="Lý do thất bại" name="reason" rules={[{ required: true }]}>
                                    <Input placeholder="VD: Khách hàng bận, Không liên lạc được..." />
                                </Form.Item>
                            </Col>
                        ) : null}
                    </Form.Item>
                    <Col span={24}>
                        <Form.Item label="Ghi chú chi tiết" name="notes">
                            <TextArea rows={3} placeholder="Mô tả thêm về nội dung cuộc hẹn..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={handleBackToList}>Hủy</Button>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        {selectedAppt ? 'Cập nhật' : 'Tạo lịch hẹn'}
                    </Button>
                </Space>
            </Form>
        </div>
    );

    return (
        <Card 
            title={
                <span>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {activeMode === 'list' ? 'Quản lý lịch hẹn khảo sát' : 
                     activeMode === 'edit' ? (selectedAppt ? 'Cập nhật lịch hẹn' : 'Đăng ký lịch hẹn') : 
                     'Chi tiết lịch hẹn'}
                </span>
            } 
            variant="borderless" 
            className="ky-card"
        >
            {activeMode === 'list' && renderList()}
            {activeMode === 'view' && renderView()}
            {activeMode === 'edit' && renderEdit()}
        </Card>
    );
};

export default Step02Consult;
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Empty,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Table,
    Tag,
    TimePicker,
    Tooltip,
    Typography
} from 'antd';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SaveOutlined,
    StopOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { AuthorizedUserSelect, AuthorizedUserView } from '../../../components/authorizedusers/AuthorizedUser';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { surveyAppointmentService } from '../../../services/core-contracts/services/surveyAppointment.service';
import type { IJourney } from '../../../services/core-contracts/types/journey.types';
import type {
    ICreateSurveyAppointmentInput,
    ISurveyAppointment,
    SurveyAppointmentAppointmentStatusEnum2,
    SurveyAppointmentJourneyStepCodeEnum2
} from '../../../services/core-contracts/types/surveyAppointment.types';

const { TextArea } = Input;
const { Text, Title } = Typography;

type ActiveMode = 'list' | 'edit' | 'view';

type AppointmentFormValues = {
    appointment_date: Dayjs;
    appointment_time: Dayjs;
    journey_step_code: SurveyAppointmentJourneyStepCodeEnum2;
    appointment_status: SurveyAppointmentAppointmentStatusEnum2;
    assigned_user?: unknown;
    confirmed_by_customer?: boolean;
    reschedule_reason?: string;
    note?: string;
};

const APPOINTMENT_STATUS_CONFIG: Record<SurveyAppointmentAppointmentStatusEnum2, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Nháp' },
    scheduled: { color: 'blue', text: 'Đã đặt lịch' },
    confirmed: { color: 'green', text: 'Khách đã xác nhận' },
    rescheduled: { color: 'gold', text: 'Đã dời lịch' },
    cancelled: { color: 'red', text: 'Đã hủy' },
};

const APPOINTMENT_STEP_OPTIONS: { value: SurveyAppointmentJourneyStepCodeEnum2; label: string }[] = [
    { value: 'consult_contact', label: 'Tư vấn & hẹn lịch' },
    { value: 'site_survey', label: 'Khảo sát hiện trường' },
];

export interface Step02ConsultProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

function getAppointmentStatusTag(status?: string) {
    const key = (status || 'scheduled') as SurveyAppointmentAppointmentStatusEnum2;
    const config = APPOINTMENT_STATUS_CONFIG[key] || APPOINTMENT_STATUS_CONFIG.scheduled;
    return <Tag color={config.color}>{config.text}</Tag>;
}

function formatAppointmentDateTime(value?: string | Date, format = 'HH:mm DD/MM/YYYY') {
    if (!value) return '—';
    const d = dayjs(value);
    return d.isValid() ? d.format(format) : '—';
}

function getAssignedUserText(value: unknown) {
    if (value == null || value === '') return 'Chưa phân công';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        const source = value as Record<string, unknown>;
        const label = source.fullName ?? source.displayName ?? source.name ?? source.username ?? source.email ?? source._id ?? source.id;
        return label != null && String(label).trim() ? String(label) : 'Chưa phân công';
    }
    return String(value);
}

function buildScheduledAt(dateValue: Dayjs, timeValue: Dayjs) {
    return dateValue
        .hour(timeValue.hour())
        .minute(timeValue.minute())
        .second(0)
        .millisecond(0)
        .toDate();
}

export const Step02Consult: React.FC<Step02ConsultProps> = ({
    journeyId,
    isEditable = false,
    onSave,
    onEditStateChange
}) => {
    const [form] = Form.useForm<AppointmentFormValues>();
    const [activeMode, setActiveMode] = useState<ActiveMode>('list');
    const [selectedAppt, setSelectedAppt] = useState<ISurveyAppointment | null>(null);
    const [appointments, setAppointments] = useState<ISurveyAppointment[]>([]);
    const [journey, setJourney] = useState<IJourney | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAppointments = useCallback(async () => {
        if (!journeyId) return;
        setIsLoading(true);
        try {
            const response = await surveyAppointmentService.querySurveyAppointmentsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId },
                sorted: [{ id: 'scheduled_at', desc: true }],
                limit: 100
            } as any);
            setAppointments(response.data || []);
        } catch (error) {
            console.error('Failed to fetch survey appointments:', error);
            message.error('Không thể tải danh sách lịch hẹn');
        } finally {
            setIsLoading(false);
        }
    }, [journeyId]);

    const fetchJourney = useCallback(async () => {
        if (!journeyId) return;
        try {
            const data = await journeyService.findJourneyDto(journeyId);
            setJourney(data);
        } catch (error) {
            console.error('Failed to fetch journey for appointments:', error);
        }
    }, [journeyId]);

    useEffect(() => {
        void fetchJourney();
        void fetchAppointments();
    }, [fetchJourney, fetchAppointments]);

    const activeAppointment = useMemo(
        () =>
            appointments.find((item) =>
                ['scheduled', 'confirmed', 'rescheduled'].includes(String(item.appointment_status || ''))
            ) || null,
        [appointments]
    );

    const handleBackToList = () => {
        setActiveMode('list');
        setSelectedAppt(null);
        form.resetFields();
        onEditStateChange?.(false);
    };

    const handleCreate = () => {
        setSelectedAppt(null);
        form.resetFields();
        const nextHour = dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0);
        const supervisorUsers = Array.isArray(journey?.supervisor_users) ? journey?.supervisor_users : [];
        const technicalUsers = Array.isArray(journey?.technical_users) ? journey?.technical_users : [];
        form.setFieldsValue({
            appointment_date: nextHour,
            appointment_time: nextHour,
            journey_step_code: 'consult_contact',
            appointment_status: 'scheduled',
            assigned_user: supervisorUsers[0] || technicalUsers[0],
            confirmed_by_customer: false,
        });
        setActiveMode('edit');
        onEditStateChange?.(true);
    };

    const handleEdit = (record: ISurveyAppointment) => {
        const scheduledAt = record.scheduled_at ? dayjs(record.scheduled_at) : dayjs();
        setSelectedAppt(record);
        form.setFieldsValue({
            appointment_date: scheduledAt,
            appointment_time: scheduledAt,
            journey_step_code: record.journey_step_code || 'consult_contact',
            appointment_status: record.appointment_status || 'scheduled',
            assigned_user: record.assigned_user,
            confirmed_by_customer: Boolean(record.confirmed_by_customer),
            reschedule_reason: record.reschedule_reason,
            note: record.note,
        });
        setActiveMode('edit');
        onEditStateChange?.(true);
    };

    const handleView = (record: ISurveyAppointment) => {
        setSelectedAppt(record);
        setActiveMode('view');
        onEditStateChange?.(false);
    };

    const buildPayload = (values: AppointmentFormValues): ICreateSurveyAppointmentInput => {
        const scheduledAt = buildScheduledAt(values.appointment_date, values.appointment_time);
        const isConfirmed = values.appointment_status === 'confirmed' || Boolean(values.confirmed_by_customer);
        return {
            journey_id: journeyId,
            journey_step_code: values.journey_step_code || 'consult_contact',
            customer_id: journey?.customer_id,
            scheduled_at: scheduledAt,
            appointment_status: values.appointment_status,
            assigned_user: values.assigned_user,
            confirmed_by_customer: isConfirmed,
            confirmed_at: isConfirmed ? (selectedAppt?.confirmed_at || new Date()) : undefined,
            reschedule_reason: values.reschedule_reason,
            note: values.note,
        };
    };

    const handleFinish = async (values: AppointmentFormValues) => {
        setIsSubmitting(true);
        try {
            const payload = buildPayload(values);
            let saved: ISurveyAppointment;
            if (selectedAppt?._id) {
                saved = await surveyAppointmentService.updateSurveyAppointment(selectedAppt._id, payload);
                message.success('Đã cập nhật lịch hẹn');
            } else {
                saved = await surveyAppointmentService.createSurveyAppointment(payload);
                message.success('Đã đặt lịch hẹn mới');
            }

            if (payload.appointment_status && ['scheduled', 'confirmed', 'rescheduled'].includes(payload.appointment_status)) {
                await journeyService.updateJourney(journeyId, { survey_status: 'scheduled' });
            }

            onSave?.(saved);
            handleBackToList();
            await fetchAppointments();
        } catch (error) {
            console.error('Failed to save survey appointment:', error);
            message.error(error instanceof Error ? error.message : 'Không thể lưu lịch hẹn');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmCustomer = async (record: ISurveyAppointment) => {
        setIsSubmitting(true);
        try {
            await surveyAppointmentService.updateSurveyAppointment(record._id, {
                appointment_status: 'confirmed',
                confirmed_by_customer: true,
                confirmed_at: new Date(),
            });
            await journeyService.updateJourney(journeyId, { survey_status: 'scheduled' });
            message.success('Đã xác nhận lịch với khách hàng');
            await fetchAppointments();
        } catch (error) {
            console.error('Failed to confirm appointment:', error);
            message.error('Không thể xác nhận lịch hẹn');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelAppointment = (record: ISurveyAppointment) => {
        Modal.confirm({
            title: 'Hủy lịch hẹn này?',
            content: 'Lịch hẹn sẽ chuyển sang trạng thái đã hủy và được giữ lại trong lịch sử.',
            okText: 'Hủy lịch',
            cancelText: 'Không',
            okButtonProps: { danger: true },
            onOk: async () => {
                await surveyAppointmentService.updateSurveyAppointment(record._id, {
                    appointment_status: 'cancelled',
                    confirmed_by_customer: false,
                });
                message.success('Đã hủy lịch hẹn');
                await fetchAppointments();
            },
        });
    };

    const columns = [
        {
            title: 'Ngày/Giờ',
            key: 'scheduled_at',
            render: (_: unknown, record: ISurveyAppointment) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{formatAppointmentDateTime(record.scheduled_at, 'DD/MM/YYYY')}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{formatAppointmentDateTime(record.scheduled_at, 'HH:mm')}</Text>
                </Space>
            )
        },
        {
            title: 'Người phụ trách',
            dataIndex: 'assigned_user',
            key: 'assigned_user',
            render: (value: unknown) => <Text>{getAssignedUserText(value)}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'appointment_status',
            key: 'appointment_status',
            render: (status: string, record: ISurveyAppointment) => (
                <Space direction="vertical" size={2}>
                    {getAppointmentStatusTag(status)}
                    {record.confirmed_by_customer ? <Text type="secondary" style={{ fontSize: 12 }}>Khách đã xác nhận</Text> : null}
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: ISurveyAppointment) => {
                const canConfirm = isEditable && record.appointment_status !== 'confirmed' && record.appointment_status !== 'cancelled';
                const canChange = isEditable && record.appointment_status !== 'cancelled';
                return (
                    <Space wrap>
                        <Tooltip title="Xem chi tiết">
                            <Button size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                        </Tooltip>
                        {canChange ? (
                            <Tooltip title="Chỉnh sửa / dời lịch">
                                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                            </Tooltip>
                        ) : null}
                        {canConfirm ? (
                            <Tooltip title="Xác nhận khách hàng đã đồng ý lịch">
                                <Button
                                    size="small"
                                    icon={<CheckCircleOutlined />}
                                    loading={isSubmitting}
                                    onClick={() => void handleConfirmCustomer(record)}
                                />
                            </Tooltip>
                        ) : null}
                        {canChange ? (
                            <Tooltip title="Hủy lịch">
                                <Button
                                    size="small"
                                    danger
                                    icon={<StopOutlined />}
                                    onClick={() => handleCancelAppointment(record)}
                                />
                            </Tooltip>
                        ) : null}
                    </Space>
                );
            }
        }
    ];

    const renderList = () => (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Row gutter={[16, 12]} align="middle" justify="space-between">
                <Col xs={24} md={14}>
                    <Text type="secondary">
                        Danh sách lịch hẹn liên hệ và khảo sát được lưu theo SurveyAppointment.
                    </Text>
                    {activeAppointment ? (
                        <div style={{ marginTop: 8 }}>
                            <Tag color="processing" icon={<ClockCircleOutlined />}>
                                Lịch đang xử lý: {formatAppointmentDateTime(activeAppointment.scheduled_at)}
                            </Tag>
                        </div>
                    ) : null}
                </Col>
                <Col xs={24} md={10} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button icon={<ReloadOutlined />} onClick={() => void fetchAppointments()} loading={isLoading}>
                        Tải lại
                    </Button>
                    {isEditable ? (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            Đặt lịch mới
                        </Button>
                    ) : null}
                </Col>
            </Row>

            <Table
                dataSource={appointments}
                columns={columns}
                rowKey="_id"
                size="small"
                loading={isLoading}
                pagination={{ pageSize: 8, hideOnSinglePage: true }}
                scroll={{ x: 760 }}
                locale={{ emptyText: <Empty description="Chưa có lịch hẹn nào được ghi nhận" /> }}
            />
        </Space>
    );

    const renderView = () => {
        if (!selectedAppt) return null;
        return (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList}>
                    Quay lại danh sách
                </Button>
                <Descriptions title="Chi tiết lịch hẹn" bordered column={1} size="small">
                    <Descriptions.Item label="Mã lịch hẹn">{selectedAppt.code || selectedAppt._id}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian">{formatAppointmentDateTime(selectedAppt.scheduled_at)}</Descriptions.Item>
                    <Descriptions.Item label="Giai đoạn">
                        {APPOINTMENT_STEP_OPTIONS.find((item) => item.value === selectedAppt.journey_step_code)?.label || selectedAppt.journey_step_code || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người phụ trách">
                        <AuthorizedUserView value={selectedAppt.assigned_user} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getAppointmentStatusTag(selectedAppt.appointment_status)}</Descriptions.Item>
                    <Descriptions.Item label="Khách xác nhận">
                        {selectedAppt.confirmed_by_customer ? `Đã xác nhận lúc ${formatAppointmentDateTime(selectedAppt.confirmed_at)}` : 'Chưa xác nhận'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lý do dời/hủy">{selectedAppt.reschedule_reason || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{selectedAppt.note || '—'}</Descriptions.Item>
                </Descriptions>
                {isEditable && selectedAppt.appointment_status !== 'cancelled' ? (
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(selectedAppt)}>
                        Chỉnh sửa lịch hẹn
                    </Button>
                ) : null}
            </Space>
        );
    };

    const renderEdit = () => (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList} type="text" />
                <Title level={5} style={{ margin: 0 }}>
                    {selectedAppt ? 'Cập nhật / dời lịch hẹn' : 'Đặt lịch hẹn mới'}
                </Title>
            </div>

            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Lịch hẹn được lưu vào SurveyAppointment; kết quả khảo sát thực tế được xử lý ở bước Khảo sát."
            />

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Ngày hẹn" name="appointment_date" rules={[{ required: true, message: 'Chọn ngày hẹn' }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giờ hẹn" name="appointment_time" rules={[{ required: true, message: 'Chọn giờ hẹn' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giai đoạn áp dụng" name="journey_step_code" rules={[{ required: true, message: 'Chọn giai đoạn' }]}>
                            <Select options={APPOINTMENT_STEP_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Trạng thái lịch hẹn" name="appointment_status" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
                            <Select
                                options={[
                                    { value: 'draft', label: 'Nháp' },
                                    { value: 'scheduled', label: 'Đã đặt lịch' },
                                    { value: 'confirmed', label: 'Khách đã xác nhận' },
                                    { value: 'rescheduled', label: 'Đã dời lịch' },
                                    { value: 'cancelled', label: 'Đã hủy' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Người phụ trách" name="assigned_user" rules={[{ required: true, message: 'Chọn người phụ trách' }]}>
                            <AuthorizedUserSelect placeholder="Chọn người phụ trách lịch hẹn" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Khách hàng đã xác nhận" name="confirmed_by_customer">
                            <Select
                                options={[
                                    { value: false, label: 'Chưa xác nhận' },
                                    { value: true, label: 'Đã xác nhận' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.appointment_status !== curr.appointment_status}>
                        {({ getFieldValue }) => ['rescheduled', 'cancelled'].includes(getFieldValue('appointment_status')) ? (
                            <Col span={24}>
                                <Form.Item label="Lý do dời/hủy lịch" name="reschedule_reason" rules={[{ required: true, message: 'Nhập lý do' }]}>
                                    <Input placeholder="Ví dụ: Khách bận đột xuất, cần đổi sang khung giờ khác..." />
                                </Form.Item>
                            </Col>
                        ) : null}
                    </Form.Item>
                    <Col span={24}>
                        <Form.Item label="Ghi chú chi tiết" name="note">
                            <TextArea rows={3} placeholder="Nội dung trao đổi, yêu cầu chuẩn bị, địa điểm gặp..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
                    <Button onClick={handleBackToList}>Hủy</Button>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>
                        {selectedAppt ? 'Cập nhật' : 'Tạo lịch hẹn'}
                    </Button>
                </Space>
            </Form>
        </div>
    );

    return (
        <Card
            title={
                <span>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {activeMode === 'list'
                        ? 'Quản lý lịch hẹn khảo sát'
                        : activeMode === 'edit'
                          ? (selectedAppt ? 'Cập nhật lịch hẹn' : 'Đăng ký lịch hẹn')
                          : 'Chi tiết lịch hẹn'}
                </span>
            }
            variant="borderless"
            className="ky-card"
        >
            {activeMode === 'list' && renderList()}
            {activeMode === 'view' && renderView()}
            {activeMode === 'edit' && renderEdit()}
        </Card>
    );
};

export default Step02Consult;

