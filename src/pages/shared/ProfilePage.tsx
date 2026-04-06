import React from 'react';
import {
    Alert,
    Avatar,
    Button,
    Card,
    Empty,
    Form,
    Input,
    List,
    Modal,
    Space,
    Switch,
    Typography,
    message,
} from 'antd';
import {
    BellOutlined,
    CloseOutlined,
    LockOutlined,
    QuestionCircleOutlined,
    RightOutlined,
    SaveOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { mutate } from '@/services/graphqlService';
import { getFileLink } from '@/services/storeService';
import { loadUserData } from '@/pages/shared/auth/store/actions/user.actions';
import { globalUserService } from '@/services/users/global-users/global-user.service';
import { ROLE_LABEL_MAP } from '@/services/users/user.constants';
import type { AuthorizedUser } from '@/services/users/authorized-users/authorizedusers.types';

const { Title, Text } = Typography;

const CHANGE_PASSWORD = gql`
    mutation ChangePassword($oldPass: String, $newPass: String) {
        response: change_password(old_pw: $oldPass, new_pw: $newPass) {
            code
            message
            data
        }
    }
`;

const PROFILE_NOTIFICATION_KEY_PREFIX = 'bac-group:profile-notifications:';

type ProfileFormValues = {
    fullName: string;
    phoneNumber?: string;
    username?: string;
    email?: string;
};

type PasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type ProfileActionItem = {
    key: string;
    icon: React.ReactNode;
    label: string;
    extra?: React.ReactNode;
    onClick?: () => void;
};

const getNotificationStorageKey = (role?: string | null) =>
    `${PROFILE_NOTIFICATION_KEY_PREFIX}${role?.toUpperCase() ?? 'guest'}`;

const getInitials = (fullName?: string | null, username?: string | null) => {
    const source = fullName?.trim() || username?.trim() || 'U';
    return source
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'U';
};

const readNotificationPreference = (role?: string | null) => {
    if (typeof window === 'undefined') {
        return true;
    }

    const rawValue = window.localStorage.getItem(getNotificationStorageKey(role));
    if (rawValue === null) {
        return true;
    }

    return rawValue === 'true';
};

const persistNotificationPreference = (role: string | null | undefined, enabled: boolean) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(getNotificationStorageKey(role), String(enabled));
};

export const SharedProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, role, session, logout } = useAuth();
    const typedUser = (user as AuthorizedUser | null) ?? null;

    const [profileForm] = Form.useForm<ProfileFormValues>();
    const [passwordForm] = Form.useForm<PasswordFormValues>();
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const [isSavingProfile, setIsSavingProfile] = React.useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(() => readNotificationPreference(role));

    React.useEffect(() => {
        setNotificationsEnabled(readNotificationPreference(role));
    }, [role]);

    const displayName =
        typedUser?.fullName?.trim() ||
        session?.employee?.fullName ||
        typedUser?.username ||
        'Người dùng';

    const roleLabel = role ? ROLE_LABEL_MAP[role.toUpperCase()] ?? role.toUpperCase() : 'Người dùng';
    const subtitleParts = [
        roleLabel,
        session?.employee?.employeeCode || typedUser?.username || undefined,
    ].filter(Boolean);
    const subtitle = subtitleParts.join(' • ');
    const avatarSrc = typedUser?.avatarId ? getFileLink(typedUser.avatarId) : undefined;

    const syncProfileForm = React.useCallback(() => {
        profileForm.setFieldsValue({
            fullName: displayName,
            phoneNumber: typedUser?.phoneNumber ?? '',
            username: typedUser?.username ?? '',
            email: typedUser?.email ?? '',
        });
    }, [displayName, profileForm, typedUser?.email, typedUser?.phoneNumber, typedUser?.username]);

    const handleStartEdit = () => {
        syncProfileForm();
        setIsEditingProfile(true);
    };

    const handleCancelEdit = () => {
        syncProfileForm();
        setIsEditingProfile(false);
    };

    const handleNotificationChange = (checked: boolean) => {
        setNotificationsEnabled(checked);
        persistNotificationPreference(role, checked);
    };

    const handleSaveProfile = async () => {
        const targetUserId = typedUser?.globalUserId ?? typedUser?._id;

        if (!targetUserId) {
            message.error('Không tìm thấy thông tin tài khoản để cập nhật hồ sơ.');
            return;
        }

        try {
            const values = await profileForm.validateFields();
            setIsSavingProfile(true);

            const isUpdated = await globalUserService.updateUser({
                userId: targetUserId,
                fullName: values.fullName.trim(),
                phoneNumber: values.phoneNumber?.trim() || undefined,
            });

            if (!isUpdated) {
                throw new Error('Không thể cập nhật hồ sơ cá nhân.');
            }

            await dispatch(loadUserData(role ?? undefined) as any);
            message.success('Đã cập nhật hồ sơ cá nhân.');
            setIsEditingProfile(false);
        } catch (error) {
            if (error instanceof Error && error.message) {
                message.error(error.message);
            } else {
                message.error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSubmitPassword = async () => {
        try {
            const values = await passwordForm.validateFields();
            setIsChangingPassword(true);

            const response = await mutate(CHANGE_PASSWORD, {
                oldPass: values.currentPassword,
                newPass: values.newPassword,
            });

            if (response.code !== 0) {
                throw new Error(response.message || 'Đổi mật khẩu thất bại.');
            }

            message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
            setIsPasswordModalOpen(false);
            passwordForm.resetFields();

            window.setTimeout(() => {
                logout();
            }, 1200);
        } catch (error) {
            if (error instanceof Error && error.message) {
                message.error(error.message);
            } else {
                message.error('Không thể đổi mật khẩu. Vui lòng thử lại.');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const actionItems: ProfileActionItem[] = [
        {
            key: 'notifications',
            icon: <BellOutlined style={{ color: '#1677ff' }} />,
            label: 'Thông báo',
            extra: (
                <div onClick={(event) => event.stopPropagation()}>
                    <Switch
                        size="small"
                        checked={notificationsEnabled}
                        onChange={handleNotificationChange}
                    />
                </div>
            ),
        },
        {
            key: 'password',
            icon: <LockOutlined style={{ color: '#52c41a' }} />,
            label: 'Đổi mật khẩu',
            extra: <RightOutlined style={{ color: '#bfbfbf' }} />,
            onClick: () => setIsPasswordModalOpen(true),
        },
        {
            key: 'help',
            icon: <QuestionCircleOutlined style={{ color: '#faad14' }} />,
            label: 'Trung tâm trợ giúp',
            extra: <RightOutlined style={{ color: '#bfbfbf' }} />,
            onClick: () => navigate('/documents'),
        },
    ];

    if (!typedUser) {
        return (
            <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%', padding: '24px 16px 40px' }}>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Cá nhân
                </Title>
                <Card style={{ borderRadius: 12 }}>
                    <Empty description="Chưa có thông tin hồ sơ cá nhân." />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%', padding: '24px 16px 40px' }}>
            <Title level={4} style={{ marginBottom: 20 }}>
                Cá nhân
            </Title>

            <Card
                style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
                bodyStyle={{ padding: 24 }}
            >
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Avatar
                        size={64}
                        src={avatarSrc}
                        icon={!avatarSrc ? <UserOutlined /> : undefined}
                        style={{ backgroundColor: avatarSrc ? undefined : '#fa8c16', flexShrink: 0 }}
                    >
                        {!avatarSrc ? getInitials(displayName, typedUser.username) : null}
                    </Avatar>

                    <div style={{ flex: 1, minWidth: 260 }}>
                        {!isEditingProfile ? (
                            <>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>
                                            {displayName}
                                        </Title>
                                        <Text type="secondary">{subtitle || 'Hồ sơ cá nhân'}</Text>
                                    </div>
                                    <Button type="text" icon={<SettingOutlined />} onClick={handleStartEdit} />
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 12,
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    }}
                                >
                                    <div>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                            Tài khoản
                                        </Text>
                                        <Text strong>{typedUser.username || 'Chưa cập nhật'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                            Email
                                        </Text>
                                        <Text strong>{typedUser.email || 'Chưa cập nhật'}</Text>
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                            Số điện thoại
                                        </Text>
                                        <Text strong>{typedUser.phoneNumber || 'Chưa cập nhật'}</Text>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>
                                            Cập nhật hồ sơ
                                        </Title>
                                        <Text type="secondary">
                                            Bạn có thể chỉnh sửa các thông tin hồ sơ đang được backend hỗ trợ.
                                        </Text>
                                    </div>
                                    <Button type="text" icon={<CloseOutlined />} onClick={handleCancelEdit} />
                                </div>

                                <Alert
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                    message="Ảnh đại diện hiện đang ở chế độ chỉ xem."
                                    description="Frontend hiện chưa có API lưu avatar cho hồ sơ cá nhân nên mình tạm thời chưa bật thao tác đổi ảnh tại màn hình này."
                                />

                                <Form form={profileForm} layout="vertical">
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập họ và tên.' },
                                            {
                                                validator: (_, value: string | undefined) => {
                                                    if (!value?.trim()) {
                                                        return Promise.reject(new Error('Họ và tên không được để trống.'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập họ và tên" />
                                    </Form.Item>

                                    <Form.Item name="phoneNumber" label="Số điện thoại">
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>

                                    <Form.Item name="username" label="Tên tài khoản">
                                        <Input disabled />
                                    </Form.Item>

                                    <Form.Item name="email" label="Email">
                                        <Input disabled />
                                    </Form.Item>

                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            loading={isSavingProfile}
                                            onClick={handleSaveProfile}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                        <Button onClick={handleCancelEdit}>Hủy</Button>
                                    </Space>
                                </Form>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            <Card
                style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
                bodyStyle={{ padding: 0 }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={actionItems}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                padding: '14px 16px',
                                cursor: item.onClick ? 'pointer' : 'default',
                            }}
                            extra={item.extra}
                            onClick={item.onClick}
                        >
                            <List.Item.Meta
                                avatar={item.icon}
                                title={<Text strong>{item.label}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </Card>

            <div style={{ marginTop: 24 }}>
                <Text
                    type="secondary"
                    style={{ fontSize: 12, display: 'block', textAlign: 'center' }}
                >
                    SIRA Service Platform v4.0.0
                </Text>
            </div>

            <Modal
                title="Đổi mật khẩu"
                open={isPasswordModalOpen}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                onOk={handleSubmitPassword}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={isChangingPassword}
            >
                <Form form={passwordForm} layout="vertical">
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại.' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Nhập lại mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu mới.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận chưa khớp.'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SharedProfilePage;
