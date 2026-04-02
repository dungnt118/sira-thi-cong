import React, { useState, useEffect } from 'react';
import {
    Card, Button, Tag, Typography, Row, Col, Space, Modal,
    Form, Input, DatePicker, Select, Tabs, Spin, message, Tooltip,
    Badge, Empty
} from 'antd';
import {
    CalendarOutlined, PlusOutlined, PhoneOutlined,
    UserOutlined, EnvironmentOutlined, BellOutlined, HistoryOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import { surveyAppointmentService } from '../../../services/core-contracts/services/surveyAppointment.service';
import { employeeService } from '../../../services/core-contracts/services/employee.service';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const SurveyCoordination: React.FC = () => {
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
    const [scheduleForm] = Form.useForm();
    const [rescheduleForm] = Form.useForm();

    const [scheduled, setScheduled] = useState<any[]>([]);
    const [unscheduled, setUnscheduled] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, journeysRes, employeesRes] = await Promise.all([
                surveyAppointmentService.queryContent(),
                journeyService.queryContent(),
                employeeService.queryContent()
            ]);
            
            if (appointmentsRes && appointmentsRes.data) {
                setScheduled(appointmentsRes.data.filter((s: any) => !s.is_cancelled));
            }
            if (journeysRes && journeysRes.data) {
                setUnscheduled(journeysRes.data.filter((j: any) => j.survey_status === 'not_started' || !j.survey_status));
            }
            if (employeesRes && employeesRes.data) {
                setEmployees(employeesRes.data);
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi tải dữ liệu điều phối khảo sát');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (values: any) => {
        try {
            await surveyAppointmentService.createSurveyAppointment({
                ...values,
                scheduled_date: values.scheduled_date.toISOString(),
            });
            message.success('Đã đặt lịch khảo sát thành công');
            setShowScheduleModal(false);
            scheduleForm.resetFields();
            loadData();
        } catch (err) {
            message.error('Không thể đặt lịch');
        }
    };

    return (
        <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Quản lý Vận hành</Text>
                    <Title level={2} style={{ margin: '4px 0 0', fontWeight: 700 }}>Điều phối Khảo sát</Title>
                </div>
                <Button type="primary" size="large" shape="round" icon={<PlusOutlined />} onClick={() => setShowScheduleModal(true)}>
                    Đặt lịch khảo sát
                </Button>
            </div>

            <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '8px 16px' } }}>
                <Tabs
                    size="large"
                    items={[
                        {
                            key: 'scheduled',
                            label: <span><CalendarOutlined /> Đã lên lịch <Badge count={scheduled.length} offset={[12, -2]} style={{ backgroundColor: '#1890ff' }} /></span>,
                            children: (
                                <Spin spinning={loading}>
                                    <div style={{ padding: '16px 0', minHeight: 300 }}>
                                        {scheduled.length === 0 && <Empty description="Chưa có lịch khảo sát nào" />}
                                        <Row gutter={[16, 16]}>
                                            {scheduled.map(s => (
                                                <Col xs={24} lg={12} key={s._id || s.id}>
                                                    <Card size="small" style={{ borderRadius: 12, border: '1px solid #f0f0f0', transition: 'all 0.3s' }} hoverable>
                                                        <Row gutter={12} align="middle">
                                                            <Col flex="auto">
                                                                <div style={{ marginBottom: 8 }}>
                                                                    <Tag color="processing" style={{ borderRadius: 4 }}>
                                                                        <ClockCircleOutlined /> {dayjs(s.scheduled_date).format('DD/MM/YYYY HH:mm')}
                                                                    </Tag>
                                                                    <Tag style={{ borderRadius: 4, background: '#f5f5f5', border: 'none' }}>
                                                                        <UserOutlined /> {s.assigned_to_name || s.giam_sat_user || 'Chưa rõ'}
                                                                    </Tag>
                                                                </div>
                                                                <Title level={5} style={{ margin: '0 0 4px' }}>{s.customer_name || 'Khách hàng ẩn'}</Title>
                                                                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>
                                                                    <EnvironmentOutlined /> {s.meeting_address || 'Tầng 1, Tòa nhà SIRA'}
                                                                </div>
                                                                <Space style={{ fontSize: 12, color: '#595959' }}>
                                                                    <Text strong>{s.contact_name}</Text>
                                                                    <span style={{ color: '#d9d9d9' }}>|</span>
                                                                    <a href={`tel:${s.contact_phone}`} style={{ color: '#1890ff' }}>{s.contact_phone}</a>
                                                                </Space>
                                                            </Col>
                                                            <Col>
                                                                <Space direction="vertical" size={8}>
                                                                    <Tooltip title="Đổi lịch">
                                                                        <Button shape="circle" icon={<HistoryOutlined />} onClick={() => { setSelectedSurvey(s); setShowRescheduleModal(true); }} />
                                                                    </Tooltip>
                                                                    <Tooltip title="Gọi điện">
                                                                        <Button shape="circle" type="primary" ghost icon={<PhoneOutlined />} />
                                                                    </Tooltip>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Spin>
                            ),
                        },
                        {
                            key: 'unscheduled',
                            label: <span>Chờ lên lịch <Badge count={unscheduled.length} offset={[12, -2]} style={{ backgroundColor: '#fa8c16' }} /></span>,
                            children: (
                                <Spin spinning={loading}>
                                    <div style={{ padding: '16px 0', minHeight: 300 }}>
                                        {unscheduled.length === 0 && <Empty description="Tất cả hành trình đã được lên lịch" />}
                                        <Row gutter={[12, 12]}>
                                            {unscheduled.map(j => (
                                                <Col xs={24} md={12} lg={8} key={j._id || j.id}>
                                                    <Card size="small" style={{ borderRadius: 12, border: '1px solid #fff7e6', background: '#fffcf6' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <Text strong style={{ color: '#fa8c16', fontSize: 12 }}>{j.journey_code}</Text>
                                                                <Title level={5} style={{ margin: '2px 0' }}>{j.idx_customer_id?.primary_text || j.customer_name || 'Khách hàng ẩn'}</Title>
                                                                <Text type="secondary" style={{ fontSize: 12 }}>{j.requested_service}</Text>
                                                            </div>
                                                            <Button
                                                                shape="round"
                                                                size="small"
                                                                type="primary"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => {
                                                                    scheduleForm.setFieldsValue({
                                                                        customer_name: j.idx_customer_id?.primary_text,
                                                                        journey_id: j._id,
                                                                        contact_name: j.idx_customer_id?.primary_text,
                                                                        contact_phone: j.idx_customer_id?.secondary_text
                                                                    });
                                                                    setShowScheduleModal(true);
                                                                }}
                                                            >
                                                                Lên lịch
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Spin>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Đặt lịch khảo sát mới</Title>}
                open={showScheduleModal}
                onCancel={() => { setShowScheduleModal(false); scheduleForm.resetFields(); }}
                onOk={() => scheduleForm.submit()}
                okText="Xác nhận đặt lịch"
                cancelText="Hủy"
                centered
                width={560}
            >
                <Form form={scheduleForm} layout="vertical" onFinish={handleSchedule} style={{ paddingTop: 16 }}>
                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item label="Thời gian khảo sát" name="scheduled_date" rules={[{ required: true }]}>
                                <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn ngày và giờ" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Giám sát phụ trách" name="assigned_to" rules={[{ required: true }]}>
                                <Select 
                                    placeholder="Chọn nhân sự"
                                    options={employees.map(e => ({ value: e._id, label: e.full_name }))} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item label="Địa điểm gặp khách" name="meeting_address" rules={[{ required: true }]}>
                        <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder="Địa chỉ cụ thể" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Người đón tiếp" name="contact_name" rules={[{ required: true }]}>
                                <Input placeholder="Tên khách hàng/người thân" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số điện thoại liên hệ" name="contact_phone" rules={[{ required: true }]}>
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Nhắc lịch tự động" name="remind_before_minutes" initialValue={30}>
                        <Select prefix={<BellOutlined />} options={[
                            { value: 15, label: 'Trước 15 phút' },
                            { value: 30, label: 'Trước 30 phút' },
                            { value: 60, label: 'Trước 1 tiếng' },
                            { value: 1440, label: 'Trước 1 ngày' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Yêu cầu cụ thể của Sale cho KTV" name="note">
                        <TextArea rows={3} placeholder="Ví dụ: Khách chỉ rảnh buổi sáng, cần mang theo máy đo độ ẩm..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Reschedule Modal */}
            <Modal
                title={`Đổi lịch khảo sát – ${selectedSurvey?.customer_name || ''}`}
                open={showRescheduleModal}
                onCancel={() => { setShowRescheduleModal(false); rescheduleForm.resetFields(); }}
                onOk={() => rescheduleForm.submit()}
                okText="Cập nhật lịch"
                cancelText="Hủy"
                centered
            >
                <Form form={rescheduleForm} layout="vertical" onFinish={() => { setShowRescheduleModal(false); rescheduleForm.resetFields(); }} style={{ paddingTop: 16 }}>
                    <Form.Item label="Lý do thay đổi" name="reschedule_reason" rules={[{ required: true }]}>
                         <Select options={[
                             { value: 'customer_request', label: 'Khách hàng yêu cầu' },
                             { value: 'staff_unavailable', label: 'Nhân viên kẹt lịch' },
                             { value: 'weather', label: 'Thời tiết xấu' },
                             { value: 'other', label: 'Lý do khác' },
                         ]} />
                    </Form.Item>
                    <Form.Item label="Thời gian mới" name="new_scheduled_datetime" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default SurveyCoordination;
