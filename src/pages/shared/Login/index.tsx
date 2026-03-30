import React, { useState } from 'react';
import { Card, Button, Typography, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../../../utils/authUtils';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import { gql } from '@apollo/client';
import { query } from '../../../services/graphqlService';
import { GET_USER_SESSION_INFO_QUERY, get, CLIENTS } from '../../../services/storeService';
import elsagaService from '../../../services/elsagaService';
import './Login.css';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            console.log('Login values:', values);
            const clients = get(CLIENTS);
            const clientInfo = Array.isArray(clients) && clients.length > 0 ? clients[0] : null;

            if (!clientInfo) {
                message.error('Chưa có cấu hình OAuth Client (CLIENTS) trong env.js!');
                setLoading(false);
                return;
            }

            // Thực hiện gọi API đăng nhập theo OIDC/OAuth REST
            await elsagaService.signInWithEmailAndPassword(values.username, values.password, clientInfo, () => setLoading(false));
            
            // Xây dựng GraphQL query để lấy user profile sau khi access_token đã tự động set vào Header
            const sessionQuery = gql(GET_USER_SESSION_INFO_QUERY());
            const sessionRes = await query(sessionQuery, { tenantId: null });

            if (sessionRes && sessionRes.code === 0 && sessionRes.data) {
                const userData = sessionRes.data;
                const userRoles = Array.isArray(userData.roles) ? userData.roles : ['sale'];

                const primaryRole = (userRoles.length > 0 ? userRoles[0] : 'sale').toLowerCase();

                const loginUserData = {
                    username: userData.username || values.username,
                    role: primaryRole,
                    roles: userRoles
                };

                setUserData(loginUserData);
                message.success('Đăng nhập thành công!');

                // Điều hướng theo role ưu tiên
                let targetDashboard = '/admin-v2/dashboard';
                if (primaryRole === 'sale') targetDashboard = '/sale/dashboard';
                else if (primaryRole === 'pm') targetDashboard = '/pm/dashboard';
                else if (primaryRole === 'accountant') targetDashboard = '/accountant/dashboard';
                else if (primaryRole === 'supervisor' || primaryRole === 'giam-sat') targetDashboard = '/supervisor/dashboard';
                else if (primaryRole === 'ky-thuat') targetDashboard = '/ky-thuat/dashboard';

                navigate(targetDashboard);
            } else {
                message.error(sessionRes?.message || 'Không thể lấy thông tin người dùng từ máy chủ GraphQL.');
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            message.error(typeof error === 'string' ? error : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Card className="login-card" variant={'borderless'}>
                    <div className="login-header">
                        <Title level={1} className="login-title">
                            SIRA Thi Công
                        </Title>
                        <Text className="login-subtitle">
                            Hệ Thống Quản Lý Thi Công Xây Dựng
                        </Text>
                    </div>

                    <Form
                        name="login_form"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Tên đăng nhập" 
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="login-button" 
                                block 
                                loading={loading}
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>

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

