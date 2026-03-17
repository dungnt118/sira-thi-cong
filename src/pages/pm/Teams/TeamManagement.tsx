import React, { useState, useMemo } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form,
    Row, Col, Typography, message, Divider, Rate, Empty, Breadcrumb, List
} from 'antd';
import {
    PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
    TeamOutlined, EnvironmentOutlined, UserOutlined, LinkOutlined,
    PhoneOutlined, MailOutlined, MessageOutlined
} from '@ant-design/icons';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';

const { Title, Text } = Typography;

// Mock Map Picker
const MapPickerMock: React.FC<{ value?: { lat: number, lng: number }, onChange: (val: { lat: number, lng: number }) => void }> = ({ value, onChange }) => (
    <div style={{ padding: 12, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fafafa', textAlign: 'center' }}>
        <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
        <div>{value ? `Vị trí: ${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}` : 'Chưa chọn vị trí'}</div>
        <Button size="small" style={{ marginTop: 8 }} onClick={() => onChange({ lat: 10.7769, lng: 106.7009 })}>
            Mô phỏng chọn vị trí
        </Button>
    </div>
);

const TeamManagement: React.FC = () => {
    const [teams, setTeams] = useLocalStorageData<any[]>(demoDataService.KEYS.TEAMS_MASTER, []);
    const [workers] = useLocalStorageData<any[]>(demoDataService.KEYS.WORKERS_MASTER, []);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isWorkerLinkVisible, setIsWorkerLinkVisible] = useState(false);
    
    const [editingTeam, setEditingTeam] = useState<any>(null);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const filteredTeams = useMemo(() => {
        return teams.filter(t => 
            t.teamName.toLowerCase().includes(searchText.toLowerCase()) ||
            t.contactName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [teams, searchText]);

    const showModal = (team?: any) => {
        if (team) {
            setEditingTeam(team);
            form.setFieldsValue({
                ...team,
                mapLocation: { lat: team.lat || 0, lng: team.lng || 0 }
            });
        } else {
            setEditingTeam(null);
            form.resetFields();
            form.setFieldsValue({ rating: 5 });
        }
        setIsModalVisible(true);
    };

    const showDetail = (team: any) => {
        setSelectedTeam(team);
        setIsDetailVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                id: editingTeam?.id || `t-${Date.now()}`,
                lat: values.mapLocation?.lat,
                lng: values.mapLocation?.lng,
                memberIds: editingTeam?.memberIds || []
            };

            if (editingTeam) {
                setTeams(teams.map(t => t.id === editingTeam.id ? formattedValues : t));
                message.success('Cập nhật thông tin đội thợ thành công');
            } else {
                setTeams([...teams, formattedValues]);
                message.success('Thêm đội thợ mới thành công');
            }
            setIsModalVisible(false);
        });
    };

    const handleDelete = (id: string) => {
        setTeams(teams.filter(t => t.id !== id));
        message.success('Đã xóa đội thợ khỏi danh sách');
    };

    const toggleWorkerLink = (workerId: string) => {
        const currentMembers = selectedTeam.memberIds || [];
        let newMembers;
        if (currentMembers.includes(workerId)) {
            newMembers = currentMembers.filter((id: string) => id !== workerId);
        } else {
            newMembers = [...currentMembers, workerId];
        }
        
        const updatedTeam = { ...selectedTeam, memberIds: newMembers };
        setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
        setSelectedTeam(updatedTeam);
    };

    const teamColumns = [
        {
            title: 'Tên Đội thợ',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text: string, record: any) => (
                <Space>
                    <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#87d068' }} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                            <LinkOutlined /> {(record.memberIds || []).length} thợ liên kết
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Người Đại Diện',
            dataIndex: 'contactName',
            key: 'contactName',
            render: (text: string, record: any) => (
                <div>
                    <div>{text}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{record.phone}</div>
                </div>
            )
        },
        {
            title: 'Khu vực',
            dataIndex: 'city',
            key: 'city',
            render: (city: string, record: any) => (
                <div>{city}{record.district ? `, ${record.district}` : ''}</div>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (val: number) => <Rate disabled value={val} style={{ fontSize: 12 }} />
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" size="small" ghost onClick={() => showDetail(record)}>Chi tiết / Thợ</Button>
                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    const teamMembers = useMemo(() => {
        if (!selectedTeam) return [];
        return workers.filter(w => (selectedTeam.memberIds || []).includes(w.id));
    }, [selectedTeam, workers]);

    return (
        <div style={{ padding: 24 }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>Quản lý Đội/Thợ</Breadcrumb.Item>
                <Breadcrumb.Item>Quản lý Đội thợ</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}><TeamOutlined /> Quản lý Đội thợ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Đội mới
                </Button>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Input
                    placeholder="Tìm kiếm đội thợ theo tên, người đại diện..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />
            </Card>

            <Table 
                columns={teamColumns} 
                dataSource={filteredTeams} 
                rowKey="id" 
                pagination={{ pageSize: 10 }}
            />

            {/* Modal: Create/Edit Team */}
            <Modal
                title={editingTeam ? 'Chỉnh sửa Đội thợ' : 'Thêm Đội thợ mới'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={700}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="teamName" label="Tên Đội thợ" rules={[{ required: true }]}>
                                <Input placeholder="VD: Đội Thi Công Số 1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="rating" label="Đánh giá">
                                <Rate style={{ fontSize: 16 }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin Liên hệ</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="contactName" label="Người đại diện" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="email" label="Email">
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="zalo" label="Số Zalo">
                                <Input prefix={<MessageOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Vị trí & Bản đồ</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="city" label="Thành phố">
                                <Input />
                            </Form.Item>
                            <Form.Item name="district" label="Quận/Huyện">
                                <Input />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ chi tiết">
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="mapLocation" label="Vị trí bản đồ">
                                <MapPickerMock onChange={(val) => form.setFieldsValue({ mapLocation: val })} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Modal: Team Detail & Linked Workers */}
            <Modal
                title={`Chi tiết Đội: ${selectedTeam?.teamName}`}
                open={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                width={900}
                footer={[
                    <Button key="close" onClick={() => setIsDetailVisible(false)}>Đóng</Button>
                ]}
            >
                {selectedTeam && (
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card title="Thông tin Đội" size="small">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text><UserOutlined /> <b>Đại diện:</b> {selectedTeam.contactName}</Text>
                                    <Text><PhoneOutlined /> <b>SĐT:</b> {selectedTeam.phone}</Text>
                                    {selectedTeam.email && <Text><MailOutlined /> <b>Email:</b> {selectedTeam.email}</Text>}
                                    {selectedTeam.zalo && <Text><MessageOutlined /> <b>Zalo:</b> {selectedTeam.zalo}</Text>}
                                    <Text><EnvironmentOutlined /> <b>Địa chỉ:</b> {selectedTeam.address}, {selectedTeam.district}, {selectedTeam.city}</Text>
                                    <Rate disabled value={selectedTeam.rating} style={{ fontSize: 14 }} />
                                </Space>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Title level={4} style={{ margin: 0 }}>Danh sách Thợ liên kết</Title>
                                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsWorkerLinkVisible(true)}>
                                    Quản lý Liên kết Thợ
                                </Button>
                            </div>
                            <Table
                                dataSource={teamMembers}
                                size="small"
                                pagination={false}
                                rowKey="id"
                                columns={[
                                    {
                                        title: 'Thợ',
                                        dataIndex: 'name',
                                        render: (text: string, record: any) => (
                                            <Space>
                                                <Avatar size="small" src={record.avatar} icon={<UserOutlined />} />
                                                <Text>{text}</Text>
                                            </Space>
                                        )
                                    },
                                    { title: 'Vị trí', dataIndex: 'position' },
                                    { title: 'Trình độ', dataIndex: 'level', render: (l: string) => <Tag>{l}</Tag> },
                                    {
                                        title: 'Hành động',
                                        render: (_: any, record: any) => (
                                            <Button type="text" danger size="small" onClick={() => toggleWorkerLink(record.id)}>Hủy liên kết</Button>
                                        )
                                    }
                                ]}
                                locale={{ emptyText: <Empty description="Chưa có thợ nào được liên kết với đội này." /> }}
                            />
                        </Col>
                    </Row>
                )}
            </Modal>

            {/* Modal: Link Workers to Team */}
            <Modal
                title="Quản lý Liên kết Thợ vào Đội"
                open={isWorkerLinkVisible}
                onCancel={() => setIsWorkerLinkVisible(false)}
                onOk={() => setIsWorkerLinkVisible(false)}
                footer={[<Button key="done" type="primary" onClick={() => setIsWorkerLinkVisible(false)}>Xong</Button>]}
            >
                <List
                    dataSource={workers}
                    renderItem={(worker: any) => {
                        const isLinked = (selectedTeam?.memberIds || []).includes(worker.id);
                        return (
                            <List.Item
                                actions={[
                                    <Button 
                                        type={isLinked ? 'default' : 'primary'} 
                                        size="small" 
                                        danger={isLinked}
                                        onClick={() => toggleWorkerLink(worker.id)}
                                    >
                                        {isLinked ? 'Hủy liên kết' : 'Liên kết'}
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} src={worker.avatar} />}
                                    title={worker.name}
                                    description={`${worker.position} - ${worker.level}`}
                                />
                            </List.Item>
                        );
                    }}
                />
            </Modal>
        </div>
    );
};

export default TeamManagement;
