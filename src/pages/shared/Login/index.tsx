import React from 'react';
import { Card, Button, Typography, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setUserData, resetCurrentRole } from '../../../utils/authUtils';
import {
    UserOutlined,
    EyeOutlined,
    ProjectOutlined,
    DollarOutlined,
    TeamOutlined,
    CustomerServiceOutlined,
    BankOutlined
} from '@ant-design/icons';
import './Login.css';

const { Title, Text } = Typography;

interface RoleCard {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    color: string;
}

export const Login: React.FC = () => {
    const navigate = useNavigate();

    const roles: RoleCard[] = [
        {
            key: 'admin',
            title: 'Quản Trị Viên',
            description: 'Quản lý hệ thống, người dùng, cấu hình',
            icon: <UserOutlined />,
            path: '/admin-v2/dashboard',
            color: '#1890ff',
        },
        {
            key: 'hanh-chinh',
            title: 'Hành Chính',
            description: 'Công tác văn thư, nhân sự, hành chính',
            icon: <BankOutlined />,
            path: '/admin-v2/dashboard',
            color: '#2f54eb',
        },
        {
            key: 'sale',
            title: 'Kinh Doanh (Sale)',
            description: 'Quản lý thông tin, khách hàng và báo giá',
            icon: <CustomerServiceOutlined />,
            path: '/sale/dashboad',
            color: '#eb2f96',
        },
        {
            key: 'supervisor',
            title: 'Giám Sát',
            description: 'Giám sát dự án, kiểm tra chất lượng',
            icon: <EyeOutlined />,
            path: '/supervisor/dashboard',
            color: '#52c41a',
        },
        {
            key: 'ky-thuat',
            title: 'Kỹ Thuật',
            description: 'Khảo sát hiện trường, thi công, bảo hành',
            icon: <ProjectOutlined />, // Using ProjectOutlined for now or ToolOutlined
            path: '/ky-thuat/dashboard',
            color: '#13a8a8',
        },
        {
            key: 'pm',
            title: 'Quản Lý Dự Án',
            description: 'Quản lý dự án, đội nhóm, khách hàng',
            icon: <ProjectOutlined />,
            path: '/pm/dashboard',
            color: '#722ed1',
        },
        {
            key: 'accountant',
            title: 'Kế Toán',
            description: 'Quản lý tài chính, thanh toán',
            icon: <DollarOutlined />,
            path: '/accountant/dashboard',
            color: '#fa8c16',
        },
        {
            key: 'partner',
            title: 'Đối Tác Thi Công',
            description: 'Quản lý công việc, tải minh chứng',
            icon: <TeamOutlined />,
            path: '/partner/dashboard',
            color: '#13c2c2',
        },
    ];

    React.useEffect(() => {
        // Reset CURRENT role but keep the object if user lands here
        resetCurrentRole();
    }, []);

    const handleRoleSelect = (roleKey: string, path: string) => {
        setUserData({
            username: 'test-user',
            role: roleKey,
            roles: roles.map(r => r.key)
        });
        navigate(path);
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Card className="login-card" bordered={false}>
                    <div className="login-header">
                        <Title level={1} className="login-title">
                            SIRA Thi Công
                        </Title>
                        <Text className="login-subtitle">
                            Hệ Thống Quản Lý Thi Công Xây Dựng
                        </Text>
                    </div>

                    <div className="role-selection-section">
                        <Title level={3} className="section-title">
                            Chọn Vai Trò Của Bạn
                        </Title>
                        <Text type="secondary" className="section-description">
                            Vui lòng chọn vai trò để truy cập vào hệ thống
                        </Text>

                        <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                            {roles.map((role) => (
                                <Col xs={24} sm={12} key={role.key}>
                                    <Card
                                        className="role-card"
                                        hoverable
                                        onClick={() => handleRoleSelect(role.key, role.path)}
                                        style={{ borderLeft: `4px solid ${role.color}` }}
                                    >
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            <div
                                                className="role-icon"
                                                style={{ color: role.color, fontSize: 32 }}
                                            >
                                                {role.icon}
                                            </div>
                                            <Title level={4} style={{ margin: 0 }}>
                                                {role.title}
                                            </Title>
                                            <Text type="secondary">{role.description}</Text>
                                            <Button
                                                type="primary"
                                                block
                                                style={{ marginTop: 16, backgroundColor: role.color }}
                                            >
                                                Truy Cập
                                            </Button>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="login-footer">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            © 2026 SIRA Construction Management System
                        </Text>
                    </div>
                </Card>
            </div>
        </div>
    );
};
