import React, { useState } from 'react';
import { Card, Form, Input, Button, List, Tag, Typography, DatePicker, message } from 'antd';
import { SaveOutlined, FieldTimeOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface DiaryEntry {
    id: string;
    date: string;
    weather: string;
    activities: string;
    manpower: string;
    notes?: string;
    timestamp: string;
}

export const ProjectDiary: React.FC = () => {
    const [entries, setEntries] = useState<DiaryEntry[]>([
        {
            id: '1',
            date: '2026-03-17',
            weather: 'Nắng ráo',
            activities: 'Thi công xong rãnh thoát nước, bắt đầu lắp đặt ống.',
            manpower: '5 người (2 thợ chính, 3 phụ)',
            timestamp: '2026-03-17 10:30'
        },
        {
            id: '2',
            date: '2026-03-16',
            weather: 'Mưa nhẹ buổi chiều',
            activities: 'Đào móng, tập kết vật tư ống nước.',
            manpower: '4 người',
            timestamp: '2026-03-16 16:45'
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            date: values.date.format('YYYY-MM-DD'),
            weather: values.weather,
            activities: values.activities,
            manpower: values.manpower,
            notes: values.notes,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm')
        };
        setEntries([newEntry, ...entries]);
        setIsAdding(false);
        form.resetFields();
        message.success('Đã lưu nhật ký hiện trường');
    };

    return (
        <div className="project-diary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Nhật ký hiện trường</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? 'Hủy' : 'Ghi nhật ký'}
                </Button>
            </div>

            {isAdding && (
                <Card className="gs-card" style={{ marginBottom: 20 }}>
                    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ date: dayjs(), weather: 'Nắng ráo' }}>
                        <Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="weather" label="Thời tiết" rules={[{ required: true }]}>
                            <Input placeholder="Nắng, mưa, mát mẻ..." />
                        </Form.Item>
                        <Form.Item name="manpower" label="Nhân lực hiện trường" rules={[{ required: true }]}>
                            <Input placeholder="Số lượng thợ, phụ..." />
                        </Form.Item>
                        <Form.Item name="activities" label="Nội dung công việc" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Mô tả chi tiết các hạng mục đã làm..." />
                        </Form.Item>
                        <Form.Item name="notes" label="Ghi chú thêm (Nếu có)">
                            <TextArea rows={2} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block icon={<SaveOutlined />}>
                            Lưu nhật ký hôm nay
                        </Button>
                    </Form>
                </Card>
            )}

            <List
                dataSource={entries}
                renderItem={(item) => (
                    <Card size="small" className="gs-card" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Tag color="blue">{item.date}</Tag>
                                <Tag color="orange">{item.weather}</Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                <FieldTimeOutlined /> {item.timestamp}
                            </Text>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>Công việc:</div>
                            <div style={{ whiteSpace: 'pre-wrap', color: '#555' }}>{item.activities}</div>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 13 }}>
                            <span style={{ fontWeight: 600 }}>Nhân sự:</span> {item.manpower}
                        </div>
                        {item.notes && (
                            <div style={{ marginTop: 8, padding: '8px', background: '#f5f5f5', borderRadius: 4, fontSize: 12 }}>
                                <Text type="secondary">Lưu ý: {item.notes}</Text>
                            </div>
                        )}
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <Button size="small" type="link" icon={<EnvironmentOutlined />}>Gắn vị trí</Button>
                        </div>
                    </Card>
                )}
            />
        </div>
    );
};

export default ProjectDiary;
