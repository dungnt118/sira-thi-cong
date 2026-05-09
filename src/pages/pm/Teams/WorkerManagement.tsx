import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form, Select,
    Row, Col, Typography, message, Divider, Tooltip, InputNumber, DatePicker, Rate
} from 'antd';
import {
    PlusOutlined, SearchOutlined, UserOutlined,
    PhoneOutlined, SafetyCertificateOutlined,
    EnvironmentOutlined, DollarOutlined,
    IdcardOutlined, EditOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { workerService } from '../../../services/core-contracts/services/worker.service';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import { IWorker } from '../../../services/core-contracts/types/worker.types';
import { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';
import { workerTeamService } from '../../../services/core-contracts/services/workerTeam.service';
import { IWorkerTeam } from '../../../services/core-contracts/types/workerTeam.types';
import { UploadImageEdit } from '../../../components/files/UploadImage';
import { UploadFilesEdit } from '../../../components/files/UploadFiles';
import MapPicker from '../../../components/common/MapPicker';

const { Title, Text } = Typography;
const { Option } = Select;

const WorkerManagement: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [levels, setLevels] = useState<ILaborPriceConfig[]>([]);
    const [teams, setTeams] = useState<IWorkerTeam[]>([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWorker, setEditingWorker] = useState<IWorker | null>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const response = await workerService.queryContent();
            setWorkers(response.data || []);
        } catch (error: any) {
            message.error('Lỗi khi tải danh sách thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLevels = async () => {
        try {
            const response = await laborPriceConfigService.queryContent();
            setLevels(response.data || []);
        } catch (error: any) {
            console.error('Lỗi khi tải danh sách trình độ:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await workerTeamService.queryContent();
            setTeams(response.data || []);
        } catch (error: any) {
            console.error('Lỗi khi tải danh sách nhóm:', error);
        }
    };

    useEffect(() => {
        fetchWorkers();
        fetchLevels();
        fetchTeams();
    }, []);

    const filteredWorkers = useMemo(() => {
        return workers.filter(w =>
            (w.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (w.phone || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (w.skills || []).some(s => s.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [workers, searchText]);

    const showModal = (worker?: IWorker) => {
        if (worker) {
            setEditingWorker(worker);
            form.setFieldsValue(worker);
        } else {
            setEditingWorker(null);
            form.resetFields();
            form.setFieldsValue({ status: 'active', rating: 5 });
        }
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(async values => {
            try {
                if (editingWorker) {
                    await workerService.updateWorker(editingWorker._id, values);
                    message.success('Cập nhật thông tin thợ thành công');
                } else {
                    await workerService.createWorker(values);
                    message.success('Thêm thợ mới thành công');
                }
                setIsModalVisible(false);
                fetchWorkers();
            } catch (error: any) {
                message.error('Lỗi khi lưu thợ: ' + (error.message || error.response?.data?.message || 'Có lỗi hệ thống xảy ra'));
            }
        });
    };

    const handleLevelChange = (levelId: string) => {
        const level = levels.find(l => l._id === levelId);
        if (level) {
            form.setFieldsValue({
                costPerDay: level.defaultPrice
            });
        }
    };

    const workerColumns = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: IWorker) => (
                <Space>
                    <Avatar src={(record as any).avatar} icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                            {record.code} • {levels.find(l => l.levelCode === record.priceConfigId)?.name || 'Chưa xếp loại'}
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Kỹ năng',
            dataIndex: 'skills',
            key: 'skills',
            render: (skills: string[]) => (
                <Space wrap>
                    {(skills || []).map(s => <Tag key={s} color="blue">{s}</Tag>)}
                </Space>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => (
                <Space>
                    <PhoneOutlined style={{ color: '#52c41a' }} />
                    <Text>{phone}</Text>
                </Space>
            )
        },
        {
            title: 'Giá công (/ngày)',
            dataIndex: 'costPerDay',
            key: 'costPerDay',
            render: (price: number) => (
                <Text strong style={{ color: '#f5222d' }}>
                    {price ? `${price.toLocaleString()}đ` : '-'}
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'orange'}>
                    {status === 'active' ? 'Sẵn sàng' : 'Đang bận'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: IWorker) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button
                            type="text"
                            icon={<SearchOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/ql/teams/workers/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                showModal(record);
                            }}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '0 0px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}><UserOutlined /> Quản lý Thợ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Thợ mới
                </Button>
            </div>

            <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px 24px' }}>
                <Input
                    placeholder="Tìm kiếm theo tên, số điện thoại, kỹ năng..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />
            </Card>

            <Table
                columns={workerColumns}
                dataSource={filteredWorkers}
                rowKey="_id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => navigate(`/admin/ql/teams/workers/${record._id}`),
                    style: { cursor: 'pointer' }
                })}
            />

            <Modal
                title={editingWorker ? 'Chỉnh sửa thông tin thợ' : 'Thêm thợ mới'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={900}
                okText="Xác nhận"
                cancelText="Hủy"
                style={{ top: 20 }}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[24, 0]}>
                        <Col xs={24} md={16}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                        <Input prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="idNumber" label="Số CCCD">
                                        <Input prefix={<IdcardOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="workerType" label="Loại thợ">
                                        <Select placeholder="Chọn loại thợ">
                                            <Option value="internal">Nội bộ</Option>
                                            <Option value="external">Thuê ngoài</Option>
                                            <Option value="collaborator">Cộng tác viên</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="teamId" label="Đội nhóm (Team)">
                                        <Select placeholder="Chọn đội nhóm" allowClear>
                                            {teams.map(t => (
                                                <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={12} sm={8}>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Select placeholder="Chọn">
                                            <Option value="male">Nam</Option>
                                            <Option value="female">Nữ</Option>
                                            <Option value="other">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Form.Item name="dob" label="Ngày sinh">
                                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="rating" label="Đánh giá">
                                        <Rate style={{ fontSize: 16 }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                            <Form.Item name="avatar" label="Ảnh đại diện">
                                <UploadImageEdit />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin Chuyên môn & Chi phí</Divider>
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item name="priceConfigId" label="Trình độ" rules={[{ required: true }]}>
                                <Select onChange={handleLevelChange} placeholder="Chọn trình độ">
                                    {levels.map((c) => (
                                        <Option key={c.levelCode} value={c.levelCode}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="costPerDay" label="Giá công/ngày (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                                    step={50000}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="position" label="Vị trí công tác">
                                <Input placeholder="VD: Thợ chống thấm, Kỹ thuật..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="skills" label="Kỹ năng cụ thể">
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập kỹ năng và nhấn Enter" />
                    </Form.Item>

                    <Divider orientation="left">Thông tin liên hệ & Vị trí</Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={16}>
                            <Form.Item name="address" label="Địa chỉ cụ thể">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="mapLocation" label="Vị trí bản đồ">
                                <MapPicker />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Chứng chỉ & Hồ sơ</Divider>
                    <Form.Item name="attachments">
                        <UploadFilesEdit />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkerManagement;
