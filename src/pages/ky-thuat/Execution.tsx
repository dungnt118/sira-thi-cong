import React from 'react';
import { Card, Typography, Button, Tag, Steps, Upload, Input } from 'antd';
import { CheckCircleOutlined, CameraOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const Execution: React.FC = () => {
    return (
        <div style={{ paddingBottom: 24 }}>
            <Title level={4} className="ky-thuat-page-title">Nhật ký thi công</Title>

            <Card className="ky-card" bodyStyle={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Title level={5} style={{ margin: 0 }}>Biệt thự Bác Nam (Ngày 3)</Title>
                    <Tag color="processing">Đang thực hiện</Tag>
                </div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Hạng mục: Chống thấm tường ngoài</Text>

                <Steps
                    direction="vertical"
                    size="small"
                    current={1}
                    items={[
                        {
                            title: 'Chuẩn bị bề mặt',
                            description: 'Đã hoàn thành lúc 09:30',
                            status: 'finish'
                        },
                        {
                            title: 'Phủ lớp lót PU',
                            description: 'Đang triển khai',
                            status: 'process'
                        },
                        {
                            title: 'Thi công lớp chống thấm',
                            description: 'Chiều 14:00',
                            status: 'wait'
                        }
                    ]}
                />
            </Card>

            <Title level={5} style={{ margin: '16px 0' }}>Báo cáo cuối ngày</Title>

            <Card className="ky-card" bodyStyle={{ padding: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>1. Ảnh thi công</Text>
                <Upload listType="picture-card" beforeUpload={() => false}>
                    <div>
                        <CameraOutlined style={{ fontSize: 24, color: '#13a8a8' }} />
                        <div style={{ marginTop: 8 }}>Chụp ảnh</div>
                    </div>
                </Upload>

                <Text strong style={{ display: 'block', marginTop: 16, marginBottom: 8 }}>2. Vật tư hao hụt</Text>
                <TextArea rows={2} placeholder="Nhập vật tư đã phát sinh thêm so với định mức..." />
                
                <Text strong style={{ display: 'block', marginTop: 16, marginBottom: 8 }}>3. Ghi chú cho Giám Sát</Text>
                <TextArea rows={2} placeholder="Sự cố công trình hoặc đề xuất ngày mai..." />

                <Button 
                    type="primary" 
                    block 
                    icon={<CheckCircleOutlined />} 
                    style={{ marginTop: 24, backgroundColor: '#1890ff' }}
                >
                    Gửi Nhật Ký Thi Công
                </Button>
            </Card>
        </div>
    );
};

export default Execution;
