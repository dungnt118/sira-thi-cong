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
            bordered={false} 
            className="ky-card"
        >
            {activeMode === 'list' && renderList()}
            {activeMode === 'view' && renderView()}
            {activeMode === 'edit' && renderEdit()}
        </Card>
    );
};

export default Step02Consult;
