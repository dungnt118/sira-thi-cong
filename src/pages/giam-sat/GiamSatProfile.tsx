import React from 'react';
import { Card, Avatar, List, Typography, Switch, Button } from 'antd';
import { 
    UserOutlined, 
    BellOutlined, 
    SafetyCertificateOutlined, 
    QuestionCircleOutlined,
    RightOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const GiamSatProfile: React.FC = () => {
    return (
        <div className="giam-sat-profile">
            <Title level={4} style={{ marginBottom: 20 }}>Cá nhân</Title>
            
            <Card className="gs-card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} style={{ background: '#fa8c16' }} />
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0 }}>GS Trần Văn Tuấn</Title>
                        <Text type="secondary">Giám sát hiện trường • BAC002</Text>
                    </div>
                    <Button type="text" icon={<SettingOutlined />} />
                </div>
            </Card>

            <Card className="gs-card" bodyStyle={{ padding: 0 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { icon: <BellOutlined style={{ color: '#1890ff' }} />, label: 'Thông báo', extra: <Switch defaultChecked size="small" /> },
                        { icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />, label: 'Bảo mật tài khoản', extra: <RightOutlined style={{ color: '#ccc' }} /> },
                        { icon: <QuestionCircleOutlined style={{ color: '#faad14' }} />, label: 'Trung tâm trợ giúp', extra: <RightOutlined style={{ color: '#ccc' }} /> },
                    ]}
                    renderItem={(item) => (
                        <List.Item style={{ padding: '12px 16px' }} extra={item.extra}>
                            <List.Item.Meta
                                avatar={item.icon}
                                title={<Text strong>{item.label}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </Card>

            <div style={{ marginTop: 24 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center' }}>
                    SIRA Service Platform v4.0.0
                </Text>
            </div>
        </div>
    );
};

export default GiamSatProfile;
