import React, { useState, useMemo } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form, Select,
    Row, Col, Typography, message, Divider,
    Popconfirm, Progress, Grid, Empty, Descriptions, Tabs, Statistic, Rate, InputNumber
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined,
    PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined,
    ProjectOutlined, DollarOutlined, FileTextOutlined, UserOutlined,
    CheckCircleOutlined, ToolOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import MapPicker from '../../../components/common/MapPicker';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const TeamDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [teams, setTeams] = useLocalStorageData<any[]>(demoDataService.KEYS.TEAMS_MASTER, []);
    const [workers, setWorkers] = useLocalStorageData<any[]>(demoDataService.KEYS.WORKERS_MASTER, []);
    const [priceConfigs] = useLocalStorageData<any[]>(demoDataService.KEYS.LABOR_PRICE_CONFIG, []);
    
    const team = useMemo(() => teams.find(t => t.id === id), [teams, id]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();
    const [workerCreateModalOpen, setWorkerCreateModalOpen] = useState(false);
    const [workerForm] = Form.useForm();

    if (!team) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy thông tin đội thợ</div>;
    }

    const teamMembers = workers.filter(w => (team.memberIds || []).includes(w.id));

    const handleSaveInfo = (values: any) => {
        const { mapLocation, ...rest } = values;
        const updatedTeams = teams.map(t => t.id === id ? { 
            ...t, 
            ...rest,
            lat: mapLocation?.lat,
            lng: mapLocation?.lng
        } : t);
        setTeams(updatedTeams);
        setIsEditing(false);
        message.success('Cập nhật thông tin đội thợ thành công!');
    };

    const handleToggleWorkerLink = (workerId: string) => {
        const currentMembers = team.memberIds || [];
        let newMembers;
        if (currentMembers.includes(workerId)) {
            newMembers = currentMembers.filter((mid: string) => mid !== workerId);
            message.info('Đã hủy liên kết thợ');
        } else {
            newMembers = [...currentMembers, workerId];
            message.success('Đã liên kết thợ mới');
        }
        
        const updatedTeams = teams.map(t => t.id === id ? { ...t, memberIds: newMembers } : t);
        setTeams(updatedTeams);
    };

    const handleCreateWorker = (values: any) => {
        const newWorkerId = `w-${Date.now()}`;
        const newWorker = {
            ...values,
            id: newWorkerId,
            avatar: `https://i.pravatar.cc/150?u=${newWorkerId}`,
            rating: 5,
            status: 'active'
        };

        // Update Workers Master
        setWorkers([...workers, newWorker]);

        // Automatically link to this team
        const currentMembers = team.memberIds || [];
        const newMembers = [...currentMembers, newWorkerId];
        const updatedTeams = teams.map(t => t.id === id ? { ...t, memberIds: newMembers } : t);
        setTeams(updatedTeams);

        setWorkerCreateModalOpen(false);
        workerForm.resetFields();
        message.success('Đã tạo thợ mới và liên kết vào đội thành công!');
    };

    const handleLevelChange = (level: string) => {
        const config = priceConfigs.find(c => c.level === level);
        if (config) {
            workerForm.setFieldsValue({ costPerHour: config.defaultPrice });
        }
    };

    const handleDeleteTeam = () => {
        setTeams(teams.filter(t => t.id !== id));
        message.success('Đã xóa đội thợ');
        navigate('/pm/teams/groups');
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

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
                            <Col xs={24} md={12}>
                                <Form.Item name="teamName" label="Tên đội thợ" rules={[{ required: true }]}><Input /></Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
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
                                <Descriptions.Item label="Tên">{team.teamName}</Descriptions.Item>
                                <Descriptions.Item label="Người liên hệ">{team.contactName}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {team.phone}</Descriptions.Item>
                                <Descriptions.Item label="Email"><MailOutlined /> {team.email || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Khu vực">{team.city}, {team.district}</Descriptions.Item>
                                <Descriptions.Item label="Phường/Xã">{team.ward || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ" span={2}><EnvironmentOutlined /> {team.address}</Descriptions.Item>
                                <Descriptions.Item label="Mã số thuế">{team.taxCode || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Ngân hàng">{team.bankAccount || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Chuyên môn" span={2}>
                                    {(team.specializations || []).map((s: string) => <Tag key={s} color="blue">{s}</Tag>)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tham gia">{team.joinDate || 'N/A'}</Descriptions.Item>
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
                                        <span>Tổng dự án</span><strong>{team.totalProjects || 0}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Hoàn thành</span><strong style={{ color: '#52c41a' }}>{team.completedProjects || 0}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Tỷ lệ HT</span>
                                        <strong>{team.totalProjects ? Math.round((team.completedProjects / team.totalProjects) * 100) : 0}%</strong>
                                    </div>
                                    <Progress
                                        percent={team.totalProjects ? Math.round((team.completedProjects / team.totalProjects) * 100) : 0}
                                        size="small"
                                        status="active"
                                        strokeColor="#52c41a"
                                    />
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
                    rowKey="id"
                    columns={[
                        {
                            title: 'Thợ', dataIndex: 'name', key: 'name',
                            render: (name: string, record: any) => (
                                <Space>
                                    <Avatar src={record.avatar} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{record.specialization}</div>
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
                            dataIndex: 'level', 
                            key: 'level',
                            render: (l: string) => {
                                const config = priceConfigs.find(c => c.level === l);
                                return <Tag color="blue">{config?.name || l}</Tag>;
                            }
                        },
                        { 
                            title: 'Công (VND/h)', 
                            dataIndex: 'costPerHour', 
                            key: 'costPerHour',
                            render: (c: number) => <Text strong color="red">{formatCurrency(c || 0)}/h</Text>
                        },
                        {
                            title: 'Trạng thái', dataIndex: 'status', key: 'status',
                            render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Ngừng'}</Tag>,
                        },
                        {
                            title: 'Thao tác', key: 'action',
                            render: (_: any, record: any) => (
                                <Popconfirm title="Hủy liên kết thợ này?" onConfirm={() => handleToggleWorkerLink(record.id)}>
                                    <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            ),
                        },
                    ]}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => navigate(`/pm/teams/workers/${record.id}`),
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
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pm/teams/groups')}>
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
                                <Statistic title="Dự án thực hiện" value={team.totalProjects || 0} prefix={<ProjectOutlined />} />
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
            >
                <Form
                    form={workerForm}
                    layout="vertical"
                    onFinish={handleCreateWorker}
                    initialValues={{ gender: 'Nam', level: 'junior', isInternal: false }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Giới tính"><Select options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]} /></Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dob" label="Ngày sinh"><Input type="date" /></Form.Item>
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
                            <Form.Item name="level" label="Cấp độ (Level)">
                                <Select 
                                    onChange={handleLevelChange}
                                    options={priceConfigs.map(c => ({ label: c.name, value: c.level }))} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="costPerHour" label="Công theo giờ (VND/h)" rules={[{ required: true }]}>
                                <InputNumber 
                                    style={{ width: '100%' }}
                                    formatter={(val: any) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(val: any) => val!.replace(/\$\s?|(,*)/g, '') as any}
                                    suffix="VND/h" 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="isInternal" label="Nhân viên nội bộ" valuePropName="checked">
                                <Select options={[{ label: 'Nội bộ', value: true }, { label: 'Cộng tác viên', value: false }]} />
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
