import { AppBrandLogo } from '@/components/common/AppBrandLogo';
import { loadUserData } from '@/pages/shared/auth/store/actions/user.actions';
import { useAppDispatch } from '@/store/hooks';
import { BookOutlined, GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import elsagaService from '../../../services/authenticationService';
import { CLIENTS, get } from '../../../services/storeService';
import { buildDocumentationPath } from '../../../utils/documentation';
import './Login.css';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);

        try {
            const clients = get(CLIENTS);
            const clientInfo = Array.isArray(clients) && clients.length > 0 ? clients[0] : null;

            if (!clientInfo) {
                message.error('Chưa có cấu hình OAuth Client (CLIENTS) trong env.js!');
                setLoading(false);
                return;
            }

            const session = await elsagaService.signInWithEmailAndPassword(
                values.username,
                values.password,
                clientInfo,
                () => setLoading(false)
            );

            if (session) {
                message.success('Đăng nhập thành công, đang tải thông tin người dùng...');
                await dispatch(loadUserData(''));
            }
        } catch (error: unknown) {
            console.error('Lỗi đăng nhập:', error);
            message.error(
                typeof error === 'string'
                    ? error
                    : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Card className="login-card" variant="borderless">
                    <div className="login-header">
                        <div className="login-logo-wrap">
                            <AppBrandLogo size="xl" />
                        </div>
                        <Title level={1} className="login-title">
                            BAC GROUP
                        </Title>
                        <Text className="login-subtitle">
                            Hệ thống quản lý thi công xây dựng
                        </Text>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                type="link"
                                icon={<BookOutlined />}
                                className="login-document-link"
                                onClick={() => navigate(buildDocumentationPath())}
                            >
                                Xem BAC Document
                            </Button>
                            <Button
                                type="link"
                                icon={<GlobalOutlined />}
                                className="login-portal-link"
                                onClick={() => navigate('/portal')}
                            >
                                Dành cho Khách hàng
                            </Button>
                        </div>
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
                                Đăng nhập
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

export default Login;
