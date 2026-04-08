import React, { useState, useMemo, useEffect } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form, Select,
    Row, Col, Typography, message, Divider, Rate
} from 'antd';
import {
    PlusOutlined, SearchOutlined,
    TeamOutlined, EnvironmentOutlined, UserOutlined,
    PhoneOutlined, MailOutlined, MessageOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { workerTeamService } from '../../../services/core-contracts/services/workerTeam.service';
import { IWorkerTeam } from '../../../services/core-contracts/types/workerTeam.types';

const { Title } = Typography;

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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState<IWorkerTeam[]>([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTeam, setEditingTeam] = useState<IWorkerTeam | null>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await workerTeamService.queryContent();
            setTeams(response.data || []);
        } catch (error: any) {
            message.error('Lỗi khi tải danh sách đội thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const filteredTeams = useMemo(() => {
        return teams.filter(t =>
            (t.teamName || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (t.contactName || '').toLowerCase().includes(searchText.toLowerCase())
        );
    }, [teams, searchText]);

    const showModal = (team?: IWorkerTeam) => {
        if (team) {
            setEditingTeam(team);
            form.setFieldsValue({
                ...team,
                mapLocation: { lat: team.lat || 0, lng: team.lng || 0 }
            });
        } else {
            setEditingTeam(null);
            form.resetFields();
            form.setFieldsValue({ rating: 5, status: 'active' });
        }
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(async values => {
            const formattedValues = {
                ...values,
                lat: values.mapLocation?.lat,
                lng: values.mapLocation?.lng,
            };

            try {
                if (editingTeam) {
                    await workerTeamService.updateWorkerTeam(editingTeam._id, formattedValues);
                    message.success('Cập nhật thông tin đội thợ thành công');
                } else {
                    await workerTeamService.createWorkerTeam(formattedValues);
                    message.success('Thêm đội thợ mới thành công');
                }
                setIsModalVisible(false);
                fetchTeams();
            } catch (error: any) {
                message.error('Lỗi khi lưu đội thợ: ' + error.message);
            }
        });
    };

    const teamColumns = [
        {
            title: 'Tên Đội thợ',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text: string, record: IWorkerTeam) => (
                <Space>
                    <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#87d068' }} />
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                            {record.contactName} • {record.phone}
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Chuyên môn',
            dataIndex: 'specializations',
            key: 'specializations',
            render: (specs: string[]) => (
                <Space wrap>
                    {(specs || []).map(s => <Tag key={s} color="blue">{s}</Tag>)}
                </Space>
            )
        },
        {
            title: 'Khu vực',
            dataIndex: 'city',
            key: 'city',
            render: (city: string, record: IWorkerTeam) => (
                <div>{city}{record.address ? `, ${record.address}` : ''}</div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (val: number) => <Rate disabled value={val} style={{ fontSize: 12 }} />
        },
        {
            title: '',
            key: 'view',
            render: () => <ArrowRightOutlined style={{ color: '#bfbfbf' }} />
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}><TeamOutlined /> Quản lý Đội thợ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Đội mới
                </Button>
            </div>

            <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px 24px' }}>
                <Input
                    placeholder="Tìm kiếm đội thợ theo tên, người đại diện..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />
            </Card>

            <Card loading={loading}>
                <Table
                    columns={teamColumns}
                    dataSource={filteredTeams}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/admin/ql/teams/groups/${record._id}`),
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>

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
                        <Col span={8}>
                            <Form.Item name="code" label="Mã Đội (Auto)">
                                <Input placeholder="Tự sinh nếu trống" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="teamName" label="Tên Đội thợ" rules={[{ required: true }]}>
                                <Input placeholder="VD: Đội Thi Công Số 1" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                                <Select options={[
                                    { label: 'Hoạt động', value: 'active' },
                                    { label: 'Tạm dừng', value: 'inactive' }
                                ]} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="specializations" label="Chuyên môn">
                                <Select mode="tags" placeholder="VD: Chống thấm, Xây trát" />
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
        </div>
    );
};

export default TeamManagement;
