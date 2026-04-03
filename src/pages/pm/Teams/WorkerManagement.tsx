import React, { useState, useMemo } from 'react';
import {
    Table, Card, Button, Input, Space, Tag, Avatar, Modal, Form, Select,
    DatePicker, InputNumber, Row, Col, Typography, message,
    Divider, Upload, Rate, Switch, Empty
} from 'antd';
import {
    PlusOutlined, SearchOutlined,
    UserOutlined, UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import MapPicker from '../../../components/common/MapPicker';

const { Title, Text } = Typography;
const { Option } = Select;

// MapPicker component is now imported from common components

const WorkerManagement: React.FC = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useLocalStorageData<any[]>(demoDataService.KEYS.WORKERS_MASTER, []);
    const [priceConfig] = useLocalStorageData<any[]>(demoDataService.KEYS.LABOR_PRICE_CONFIG, []);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWorker, setEditingWorker] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const filteredWorkers = useMemo(() => {
        return workers.filter(w =>
            w.name.toLowerCase().includes(searchText.toLowerCase()) ||
            w.position.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [workers, searchText]);

    const handleLevelChange = (level: string) => {
        const config = priceConfig.find(c => c.level === level);
        if (config) {
            form.setFieldsValue({ costPerHour: config.defaultPrice });
            message.info(`Gợi ý đơn giá cho ${config.name}: ${config.defaultPrice.toLocaleString()} VNĐ/h`);
        }
    };

    const showModal = (worker?: any) => {
        if (worker) {
            setEditingWorker(worker);
            form.setFieldsValue({
                ...worker,
                dob: worker.dob ? dayjs(worker.dob) : null,
                mapLocation: { lat: worker.lat || 0, lng: worker.lng || 0 }
            });
        } else {
            setEditingWorker(null);
            form.resetFields();
            form.setFieldsValue({ rating: 5, isInternal: true });
        }
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                id: editingWorker?.id || `w-${Date.now()}`,
                dob: values.dob ? values.dob.toISOString() : null,
                lat: values.mapLocation?.lat,
                lng: values.mapLocation?.lng,
            };

            if (editingWorker) {
                setWorkers(workers.map(w => w.id === editingWorker.id ? formattedValues : w));
                message.success('Cập nhật thông tin thợ thành công');
            } else {
                setWorkers([...workers, formattedValues]);
                message.success('Thêm thợ mới thành công');
            }
            setIsModalVisible(false);
        });
    };



    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{record.position}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Loại',
            dataIndex: 'isInternal',
            key: 'isInternal',
            render: (isInternal: boolean) => (
                <Tag color={isInternal ? 'blue' : 'orange'}>
                    {isInternal ? 'Nội bộ' : 'Ngoài'}
                </Tag>
            )
        },
        {
            title: 'Trình độ',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                const config = priceConfig.find(c => c.level === level);
                return <Tag color="cyan">{config?.name || level}</Tag>;
            }
        },
        {
            title: 'Công theo giờ',
            dataIndex: 'costPerHour',
            key: 'costPerHour',
            render: (val: number) => <Text strong color="red">{val?.toLocaleString()}đ/h</Text>
        },
        {
            title: 'Kỹ năng',
            dataIndex: 'skills',
            key: 'skills',
            render: (skills: string[]) => (
                <div style={{ maxWidth: 200 }}>
                    {skills?.map(s => <Tag key={s} style={{ marginBottom: 4 }}>{s}</Tag>)}
                </div>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (val: number) => <Rate disabled value={val} style={{ fontSize: 12 }} />
        }
    ];

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}><UserOutlined /> Hồ sơ Danh sách Thợ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm thợ mới
                </Button>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Input
                    placeholder="Tìm kiếm thợ theo tên, vị trí..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredWorkers}
                    rowKey="id"
                    locale={{ emptyText: <Empty description="Chưa có dữ liệu thợ. Hãy thêm mới!" /> }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/ql/teams/workers/${record.id}`),
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>

            <Modal
                title={editingWorker ? 'Chỉnh sửa hồ sơ thợ' : 'Thêm hồ sơ thợ mới'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={800}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="name" label="Họ và tên thợ" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="isInternal" label="Phân loại" valuePropName="checked">
                                        <Switch checkedChildren="Nội bộ" unCheckedChildren="Thuê ngoài" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Select placeholder="Chọn">
                                            <Option value="male">Nam</Option>
                                            <Option value="female">Nữ</Option>
                                            <Option value="other">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="dob" label="Ngày sinh">
                                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="rating" label="Đánh giá">
                                        <Rate style={{ fontSize: 16 }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <Form.Item name="avatar" label="Ảnh đại diện">
                                <Upload listType="picture-card" showUploadList={false}>
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thông tin Chuyên môn & Chi phí</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}>
                                <Select onChange={handleLevelChange}>
                                    {priceConfig.map((c: any) => (
                                        <Option key={c.level} value={c.level}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="costPerHour" label="Chi phí theo giờ (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        <Col span={16}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="city" label="Thành phố">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="ward" label="Phường / Xã">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="address" label="Địa chỉ cụ thể">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="mapLocation" label="Vị trí bản đồ">
                                <MapPicker />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="certificates" label="Chứng chỉ (Mock Upload)">
                        <Upload>
                            <Button icon={<UploadOutlined />}>Bấm để tải chứng chỉ lên</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkerManagement;
