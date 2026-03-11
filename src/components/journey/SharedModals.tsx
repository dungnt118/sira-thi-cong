import React from 'react';
import {
    Form, Select, DatePicker, Input, Button, Upload,
    Space, Typography, Row, Col, Alert, Tag
} from 'antd';
import {
    UploadOutlined, PhoneOutlined, MessageOutlined,
    MailOutlined, TeamOutlined, WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

// --- DLG-11 Consultation Log Form (Inline / Modal use) ---
export interface ConsultationLogProps {
    onSubmit?: (values: any) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export const ConsultationLogForm: React.FC<ConsultationLogProps> = ({ onSubmit, onCancel, isLoading }) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="Thời điểm liên hệ" name="interaction_at" rules={[{ required: true }]}
                        initialValue={dayjs()}>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Kênh" name="channel" rules={[{ required: true }]} initialValue="call">
                        <Select options={[
                            { value: 'call', label: <span><PhoneOutlined /> Gọi điện</span> },
                            { value: 'zalo', label: <span><MessageOutlined /> Zalo</span> },
                            { value: 'email', label: <span><MailOutlined /> Email</span> },
                            { value: 'meeting', label: <span><TeamOutlined /> Gặp mặt</span> },
                        ]} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Kết quả" name="outcome" rules={[{ required: true }]}>
                <Select options={[
                    { value: 'connected', label: 'Tư vấn thành công' },
                    { value: 'no-answer', label: 'Không nghe máy' },
                    { value: 'qualified', label: 'Chốt lịch khảo sát' },
                    { value: 'not-interested', label: 'Chưa có nhu cầu' },
                ]} />
            </Form.Item>

            <Form.Item label="Tóm tắt nội dung" name="summary" rules={[{ required: true }]}>
                <TextArea rows={3} placeholder="Ghi chú nội dung trao đổi chính..." />
            </Form.Item>

            <Form.Item label="Hành động tiếp theo" name="next_action">
                <Input placeholder="VD: Gửi báo giá màng khò..." />
            </Form.Item>

            <Form.Item label="Lịch follow-up" name="next_follow_up_at">
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Đính kèm" name="attachments">
                <Upload>
                    <Button icon={<UploadOutlined />}>Tải lên file/ảnh</Button>
                </Upload>
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Space>
                    {onCancel && <Button onClick={onCancel}>Hủy</Button>}
                    <Button type="primary" htmlType="submit" loading={isLoading}>Lưu Log</Button>
                </Space>
            </div>
        </Form>
    );
};

// --- DLG-06 Blocker Strip ---
export interface BlockerDef {
    type: string;
    summary: string;
    owner: string;
    due?: string;
}

export interface BlockerStripProps {
    blockers: BlockerDef[];
    onResolve?: (index: number) => void;
}

export const BlockerStrip: React.FC<BlockerStripProps> = ({ blockers, onResolve }) => {
    if (!blockers || blockers.length === 0) return null;

    return (
        <div style={{ marginBottom: 16 }}>
            {blockers.map((b, idx) => (
                <Alert
                    key={idx}
                    type="error"
                    showIcon
                    icon={<WarningOutlined />}
                    message={
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <span>
                                <Text strong>[{b.type}]</Text> {b.summary} 
                            </span>
                            <Space size={16}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Owner: {b.owner}</Text>
                                {b.due && <Tag color="error">Due: {b.due}</Tag>}
                                {onResolve && <Button size="small" danger onClick={() => onResolve(idx)}>Xử lý</Button>}
                            </Space>
                        </Space>
                    }
                    style={{ marginBottom: 8 }}
                />
            ))}
        </div>
    );
};
