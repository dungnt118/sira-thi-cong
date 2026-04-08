import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form, Select,
    Row, Col, Typography, message, Divider,
    Popconfirm, Progress, Grid, Empty, Descriptions, Tabs, Statistic, Rate, InputNumber, Spin, DatePicker
} from 'antd';
import dayjs from 'dayjs';
import {
    ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined,
    PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined,
    ProjectOutlined, DollarOutlined, FileTextOutlined, UserOutlined,
    CheckCircleOutlined, ToolOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MapPicker from '../../../components/common/MapPicker';
import { workerTeamService } from '../../../services/core-contracts/services/workerTeam.service';
import { workerService } from '../../../services/core-contracts/services/worker.service';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import { IWorkerTeam } from '../../../services/core-contracts/types/workerTeam.types';
import { IWorker } from '../../../services/core-contracts/types/worker.types';
import { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const TeamDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState<IWorkerTeam | null>(null);
    const [teamMembers, setTeamMembers] = useState<IWorker[]>([]);
    const [priceConfigs, setPriceConfigs] = useState<ILaborPriceConfig[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();
    const [workerCreateModalOpen, setWorkerCreateModalOpen] = useState(false);
    const [workerForm] = Form.useForm();

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [teamData, configsRes] = await Promise.all([
                workerTeamService.findContent(id),
                laborPriceConfigService.queryContent()
            ]);
            setTeam(teamData);
            setPriceConfigs(configsRes.data || []);
            
            // Fetch workers belonging to this team
            const workersRes = await workerService.queryContent({
                group: {
                    op: 'AND',
                    children: [
                        { id: 'teamId', operation: '==', value: id } as any
                    ]
                }
            });
            setTeamMembers(workersRes.data || []);
        } catch (error: any) {
            message.error('Lỗi khi tải thông tin đội thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSaveInfo = async (values: any) => {
        if (!id) return;
        const { mapLocation, ...rest } = values;
        const payload = {
            ...rest,
            lat: mapLocation?.lat,
            lng: mapLocation?.lng
        };
        try {
            await workerTeamService.updateWorkerTeam(id, payload);
            setIsEditing(false);
            message.success('Cập nhật thông tin đội thợ thành công!');
            fetchData();
        } catch (error: any) {
            message.error('Lỗi khi cập nhật: ' + error.message);
        }
    };

    const handleRemoveWorkerLink = async (workerId: string) => {
        try {
            // In the real service, we should update the worker's teamId to undefined
            await workerService.updateWorker(workerId, { teamId: undefined });
            message.success('Đã hủy liên kết thợ');
            fetchData();
        } catch (error: any) {
            message.error('Lỗi khi hủy liên kết: ' + error.message);
        }
    };

    const handleCreateWorker = async (values: any) => {
        if (!id) return;
        try {
            const payload = {
                ...values,
                teamId: id,
                status: 'active'
            };
            await workerService.createWorker(payload);
            setWorkerCreateModalOpen(false);
            workerForm.resetFields();
            message.success('Đã tạo thợ mới và liên kết vào đội thành công!');
            fetchData();
        } catch (error: any) {
            message.error('Lỗi khi tạo thợ: ' + error.message);
        }
    };

    const handleLevelChange = (levelCode: string) => {
        const config = priceConfigs.find(c => c.levelCode === levelCode);
        if (config && config.defaultPrice !== undefined) {
            workerForm.setFieldsValue({ costPerDay: config.defaultPrice });
        }
    };

    const handleDeleteTeam = async () => {
        if (!id) return;
        try {
            await workerTeamService.deleteWorkerTeam(id);
            message.success('Đã xóa đội thợ');
            navigate('/admin/ql/teams/groups');
        } catch (error: any) {
            message.error('Lỗi khi xóa đội thợ: ' + error.message);
        }
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    if (loading) {
        return <div style={{ padding: 100, textAlign: 'center' }}><Spin size="large" /></div>;
    }

    if (!team) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy thông tin đội thợ" />
                <Button onClick={() => navigate('/admin/ql/teams/groups')}>Quay lại danh sách</Button>
            </div>
        );
    }

    // ─── Render Tabs ──────────────────────────────────────────────────
    const renderInfoTab = () => (
        <div>
            <Card
                title="Thông Tin Cơ Bản"
                extra={
                    isEditing ? (
                        <Space>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button type="primary" onClick={() => editForm.submit()}>Lưu</Button>
                        </Space>
                    ) : (
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => {
                                setIsEditing(true);
                                editForm.setFieldsValue({
                                    ...team,
                                    mapLocation: { lat: team.lat || 10.7769, lng: team.lng || 106.7009 }
                                });
                            }}>Chỉnh sửa</Button>
                            <Popconfirm title="Xóa đội thợ này?" onConfirm={handleDeleteTeam}>
                                <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                            </Popconfirm>
                        </Space>
                    )
                }
            >
                {isEditing ? (
                    <Form form={editForm} layout="vertical" onFinish={handleSaveInfo}>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item name="code" label="Mã đội (Auto)"><Input placeholder="Hệ thống tự sinh" disabled /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="teamName" label="Tên đội thợ" rules={[{ required: true }]}><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="contactName" label="Người đại diện" rules={[{ required: true }]}><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input prefix={<PhoneOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="city" label="Thành phố"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="district" label="Quận/Huyện"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="ward" label="Phường/Xã"><Input /></Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="address" label="Địa chỉ chi tiết"><Input prefix={<EnvironmentOutlined />} /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="taxCode" label="Mã số thuế"><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="bankAccount" label="Tài khoản ngân hàng"><Input /></Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="specializations" label="Chuyên môn">
                                    <Select mode="tags" placeholder="Nhập chuyên môn" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="mapLocation" label="Vị trí trên bản đồ">
                                    <MapPicker />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                ) : (
                    <Row gutter={[24, 16]}>
                        <Col xs={24} lg={16}>
                            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                                <Descriptions.Item label="Mã Đội"><Text code>{team.code || 'N/A'}</Text></Descriptions.Item>
                                <Descriptions.Item label="Tên Đội">{team.teamName}</Descriptions.Item>
                                <Descriptions.Item label="Người liên hệ">{team.contactName}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {team.phone}</Descriptions.Item>
                                <Descriptions.Item label="Email"><MailOutlined /> {team.email || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Thành phố">{team.city || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Phường/Xã">{team.ward || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ" span={2}><EnvironmentOutlined /> {team.address}</Descriptions.Item>
                                <Descriptions.Item label="Mã số thuế">{team.taxCode || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Ngân hàng">{team.bankAccount || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Chuyên môn" span={2}>
                                    {(team.specializations || []).map((s: string) => <Tag key={s} color="blue">{s}</Tag>)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tham gia">{team.joinDate ? dayjs(team.joinDate).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Đánh giá">
                                    <Rate disabled value={team.rating} allowHalf style={{ fontSize: 14 }} />
                                    <span style={{ marginLeft: 8 }}>{team.rating}/5</span>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar size={80} icon={<TeamOutlined />} style={{ background: '#52c41a', marginBottom: 12 }} />
                                        <div style={{ fontWeight: 600, fontSize: 18 }}>{team.teamName}</div>
                                        <Tag color={team.status === 'active' ? 'green' : 'default'} style={{ marginTop: 8 }}>
                                            {team.status === 'active' ? 'Đang hoạt động' : 'Ngừng HĐ'}
                                        </Tag>
                                    </div>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Tổng thợ</span><strong>{teamMembers.length}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Đánh giá TB</span><strong>{team.rating}/5</strong>
                                    </div>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ marginBottom: 12, fontWeight: 500 }}>Vị trí đội thợ:</div>
                                    <MapPicker
                                        readOnly
                                        height={180}
                                        value={{ lat: team.lat || 10.7769, lng: team.lng || 106.7009 }}
                                    />
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Card>

            <Card
                title={<Space><ToolOutlined /> Thông Tin Thợ ({teamMembers.length})</Space>}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setWorkerCreateModalOpen(true)}>
                        Thêm thợ
                    </Button>
                }
                style={{ marginTop: 16 }}
            >
                <Table
                    dataSource={teamMembers}
                    rowKey="_id"
                    columns={[
                        {
                            title: 'Thợ', dataIndex: 'name', key: 'name',
                            render: (name: string, record: any) => (
                                <Space>
                                    <Avatar src={record.avatar} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{record.position}</div>
                                    </div>
                                </Space>
                            ),
                        },
                        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
                        { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
                        {
                            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
                            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 12 }} />,
                        },
                        {
                            title: 'Trình độ',
                            dataIndex: 'priceConfigId',
                            key: 'priceConfigId',
                            render: (l: string) => {
                                const config = priceConfigs.find(c => c.levelCode === l);
                                return <Tag color="blue">{config?.name || l}</Tag>;
                            }
                        },
                        {
                            title: 'Giá công (/ngày)',
                            dataIndex: 'costPerDay',
                            key: 'costPerDay',
                            render: (c: number) => <Text strong type="danger">{formatCurrency(c || 0)}</Text>
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status',
                            render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Ngừng'}</Tag>,
                        },
                        {
                            title: 'Thao tác', key: 'action',
                            render: (_: any, record: any) => (
                                <Popconfirm title="Hủy liên kết thợ này?" onConfirm={() => handleRemoveWorkerLink(record._id!)}>
                                    <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            ),
                        },
                    ]}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => navigate(`/admin/ql/teams/workers/${record._id}`),
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>
        </div>
    );

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/ql/teams/groups')}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={2} style={{ margin: 0 }}>Hồ Sơ Đội Thợ</Title>
                </Space>
                <Tag color={team.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {team.status === 'active' ? 'Đang hoạt động' : 'Ngừng HĐ'}
                </Tag>
            </Row>

            <Tabs
                type="card"
                items={[
                    {
                        key: 'info',
                        label: 'Thông tin',
                        icon: <UserOutlined />,
                        children: renderInfoTab(),
                    },
                    {
                        key: 'history',
                        label: 'Lịch sử DA & HĐ',
                        icon: <ProjectOutlined />,
                        children: (
                            <Card>
                                <Statistic title="Dự án thực hiện" value={0} prefix={<ProjectOutlined />} />
                                <Divider />
                                <Statistic title="Hợp đồng liên quan" value={3} prefix={<FileTextOutlined />} />
                                <div style={{ marginTop: 20 }}>
                                    <Text type="secondary">Tính năng lịch sử dự án chi tiết đang được phát triển...</Text>
                                </div>
                            </Card>
                        ),
                    },
                    {
                        key: 'resources',
                        label: 'Kho tài nguyên',
                        icon: <FileTextOutlined />,
                        children: (
                            <Card>
                                <Empty description="Chưa có tài liệu/ảnh tải lên cho đội thợ này" />
                            </Card>
                        ),
                    },
                    {
                        key: 'payments',
                        label: 'Lịch sử thanh toán',
                        icon: <DollarOutlined />,
                        children: (
                            <Card>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="Đã thanh toán" value={formatCurrency(450000000)} prefix={<CheckCircleOutlined />} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Công nợ hiện tại" value={formatCurrency(12000000)} prefix={<BankOutlined />} valueStyle={{ color: '#cf1322' }} />
                                    </Col>
                                </Row>
                                <Divider />
                                <div style={{ marginTop: 20 }}>
                                    <Text type="secondary">Tính năng lịch sử thanh toán chi tiết đang được phát triển...</Text>
                                </div>
                            </Card>
                        ),
                    }
                ]}
            />

            <Modal
                title="Tạo Hồ Sơ Thợ Mới"
                open={workerCreateModalOpen}
                onCancel={() => setWorkerCreateModalOpen(false)}
                onOk={() => workerForm.submit()}
                width={800}
                okText="Xác nhận"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form
                    form={workerForm}
                    layout="vertical"
                    onFinish={handleCreateWorker}
                    initialValues={{ gender: 'male', priceConfigId: 'junior', workerType: 'external' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Giới tính"><Select options={[{ label: 'Nam', value: 'male' }, { label: 'Nữ', value: 'female' }]} /></Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dob" label="Ngày sinh"><DatePicker style={{ width: '100%' }} /></Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="city" label="Thành phố"><Input /></Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="district" label="Quận/Huyện"><Input /></Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="ward" label="Phường/Xã"><Input /></Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="address" label="Địa chỉ chi tiết"><Input prefix={<EnvironmentOutlined />} /></Form.Item>

                    <Divider orientation="left">Nghiệp vụ & Chi phí</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="priceConfigId" label="Cấp độ (Level)">
                                <Select
                                    onChange={handleLevelChange}
                                    options={priceConfigs.map(c => ({ label: c.name, value: c.levelCode }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="costPerDay" label="Giá công (/ngày)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={(val: any) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(val: any) => val!.replace(/\$\s?|(,*)/g, '') as any}
                                    suffix=" VNĐ"
                                    step={50000}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="workerType" label="Phân loại">
                                <Select options={[{ label: 'Nội bộ', value: 'internal' }, { label: 'Thuê ngoài', value: 'external' }, { label: 'Cộng tác viên', value: 'collaborator' }]} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="position" label="Vị trí công việc"><Input placeholder="VD: Thợ chính, Phụ kho..." /></Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="skills" label="Kỹ năng">
                                <Select mode="tags" placeholder="Nhập kỹ năng" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TeamDetail;
