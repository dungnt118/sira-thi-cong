import React, { useState } from 'react';
import { Card, Button, Typography, Form, Input, message } from 'antd';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import { get, CLIENTS } from '../../../services/storeService';
import elsagaService from '../../../services/authenticationService';
import './Login.css';

const { Title, Text } = Typography;

import { useAppDispatch } from '@/store/hooks';
import { loadUserData } from '@/pages/shared/auth/store/actions/user.actions';

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();
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
            const session = await elsagaService.signInWithEmailAndPassword(values.username, values.password, clientInfo, () => setLoading(false));

            if (session) {
                message.success('Đăng nhập thành công, đang tải thông tin người dùng...');
                // Gọi loadUserData để lấy thông tin profile qua GraphQL và điều hướng
                await dispatch(loadUserData());
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

