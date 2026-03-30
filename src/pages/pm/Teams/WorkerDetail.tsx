import React, { useMemo } from 'react';
import {
    Card, Button, Tag, Avatar, Row, Col, Typography, 
    Divider, Rate, Grid, Space, Descriptions, Tabs, Statistic, Empty,
    Modal, Form, Input, Select, DatePicker, Switch, InputNumber, Upload, message, Popconfirm
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, PhoneOutlined, MailOutlined, 
    EnvironmentOutlined, UserOutlined, CalendarOutlined, 
    VerifiedOutlined, ToolOutlined, FileTextOutlined, 
    HistoryOutlined, DeleteOutlined, PlusOutlined, UploadOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import MapPicker from '../../../components/common/MapPicker';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const WorkerDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [workers, setWorkers] = useLocalStorageData<any[]>(demoDataService.KEYS.WORKERS_MASTER, []);
    const [priceConfigs] = useLocalStorageData<any[]>(demoDataService.KEYS.LABOR_PRICE_CONFIG, []);
    const [teams] = useLocalStorageData<any[]>(demoDataService.KEYS.TEAMS_MASTER, []);
    
    const worker = useMemo(() => workers.find(w => w.id === id), [workers, id]);
    const priceConfig = useMemo(() => priceConfigs.find(c => c.level === worker?.level), [priceConfigs, worker]);
    const linkedTeam = useMemo(() => teams.find(t => (t.memberIds || []).includes(id)), [teams, id]);

    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    const handleLevelChange = (level: string) => {
        const config = priceConfigs.find(c => c.level === level);
        if (config) {
            form.setFieldsValue({ costPerHour: config.defaultPrice });
            message.info(`Gợi ý đơn giá cho ${config.name}: ${config.defaultPrice.toLocaleString()} VNĐ/h`);
        }
    };

    const showEditModal = () => {
        if (worker) {
            form.setFieldsValue({
                ...worker,
                dob: worker.dob ? dayjs(worker.dob) : null,
                mapLocation: { lat: worker.lat || 0, lng: worker.lng || 0 }
            });
            setIsEditModalVisible(true);
        }
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...worker,
                ...values,
                dob: values.dob ? values.dob.toISOString() : null,
                lat: values.mapLocation?.lat,
                lng: values.mapLocation?.lng,
            };

            setWorkers(workers.map(w => w.id === id ? formattedValues : w));
            message.success('Cập nhật thông tin thợ thành công');
            setIsEditModalVisible(false);
        });
    };

    const handleDelete = () => {
        setWorkers(workers.filter(w => w.id !== id));
        message.success('Đã xóa thợ khỏi danh sách');
        navigate('/pm/teams/workers');
    };

    if (!worker) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy thông tin thợ" />
                <Button onClick={() => navigate('/pm/teams/workers')}>Quay lại danh sách</Button>
            </div>
        );
    }

    /* const formatCurrency = (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val); */

    const renderInfoTab = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} lg={16}>
                <Card title="Thông Tin Cá Nhân & Liên Hệ">
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                        <Descriptions.Item label="Họ và tên" span={2}><Text strong>{worker.name}</Text></Descriptions.Item>
                        <Descriptions.Item label="Giới tính">{worker.gender === 'male' ? 'Nam' : 'Nữ'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh"><CalendarOutlined /> {worker.dob ? dayjs(worker.dob).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {worker.phone || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Email"><MailOutlined /> {worker.email || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Khu vực">{worker.city || 'N/A'}, {worker.ward || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ cụ thể" span={2}><EnvironmentOutlined /> {worker.address || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Loại nhân sự">
                            <Tag color={worker.isInternal ? 'blue' : 'orange'}>
                                {worker.isInternal ? 'Nhân viên nội bộ' : 'Thợ ngoài / CTV'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trình độ">
                            <Tag color="cyan">{priceConfig?.name || worker.level}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Công theo giờ">
                            <Text strong type="danger">{Number(worker.costPerHour || 0).toLocaleString()}đ/h</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Kỹ năng & Chuyên môn" style={{ marginTop: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">Vị trí công tác:</Text> <Text strong>{worker.position || 'Chưa xác định'}</Text>
                    </div>
                    <Space size={[0, 8]} wrap>
                        {(worker.skills || []).map((s: string) => (
                            <Tag key={s} color="processing" style={{ padding: '4px 12px', borderRadius: 12 }}>{s}</Tag>
                        ))}
                    </Space>
                    
                    <Divider orientation="left" style={{ fontSize: 13, color: '#888' }}>
                        <FileTextOutlined /> Chứng chỉ & Hồ sơ
                    </Divider>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card size="small" hoverable style={{ background: '#fafafa' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space>
                                    <VerifiedOutlined style={{ color: '#52c41a' }} />
                                    <Text>Chứng chỉ tay nghề Chống thấm (SIRA Certified)</Text>
                                </Space>
                                <Button type="link">Xem</Button>
                            </div>
                        </Card>
                        <Card size="small" hoverable style={{ background: '#fafafa' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space>
                                    <VerifiedOutlined style={{ color: '#52c41a' }} />
                                    <Text>Hợp đồng CTV lao động 2024</Text>
                                </Space>
                                <Button type="link">Xem</Button>
                            </div>
                        </Card>
                    </Space>
                </Card>
            </Col>

            <Col xs={24} lg={8}>
                <Card style={{ background: '#f0f5ff', borderColor: '#adc6ff', textAlign: 'center' }}>
                    <Avatar size={100} src={worker.avatar} icon={<UserOutlined />} style={{ background: '#1890ff', marginBottom: 16 }} />
                    <Title level={3} style={{ margin: 0 }}>{worker.name}</Title>
                    <Text type="secondary">{worker.position}</Text>
                    
                    <Divider style={{ margin: '16px 0' }} />
                    
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic 
                            title="Công theo giờ" 
                            value={worker.costPerHour || 0} 
                            suffix="đ/h"
                            valueStyle={{ color: '#cf1322' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">Đánh giá:</Text>
                            <div><Rate disabled value={worker.rating} allowHalf /></div>
                            <Text strong>{worker.rating}/5.0</Text>
                        </div>
                    </Space>
                </Card>

                <Card title="Đội nhóm liên kết" style={{ marginTop: 24 }}>
                    {linkedTeam ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Space>
                                <Avatar icon={<HistoryOutlined />} style={{ background: '#52c41a' }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{linkedTeam.teamName}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>{linkedTeam.contactName}</div>
                                </div>
                            </Space>
                            <Button type="link" onClick={() => navigate(`/pm/teams/groups/${linkedTeam.id}`)}>Chi tiết</Button>
                        </div>
                    ) : (
                        <Empty description="Chưa thuộc đội nhóm nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </Card>

                <Card title="Vị trí thường trú" style={{ marginTop: 24 }}>
                    <MapPicker 
                        readOnly 
                        height={180} 
                        value={{ lat: worker.lat || 10.7769, lng: worker.lng || 106.7009 }} 
                    />
                </Card>
            </Col>
        </Row>
    );

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={2} style={{ margin: 0 }}>Hồ Sơ Thợ Chi Tiết</Title>
                </Space>
                <Space>
                    <Button icon={<EditOutlined />} onClick={showEditModal}>Chỉnh sửa</Button>
                    <Popconfirm
                        title="Xác nhận xóa hồ sơ?"
                        description="Bạn có chắc chắn muốn xóa hồ sơ thợ này? Hành động này không thể hoàn tác."
                        onConfirm={handleDelete}
                        okText="Xóa ngay"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />}>Xóa hồ sơ</Button>
                    </Popconfirm>
                    <Tag color={worker.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                        {worker.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Tag>
                </Space>
            </Row>

            <Modal
                title="Chỉnh sửa hồ sơ thợ"
                open={isEditModalVisible}
                onOk={handleSave}
                onCancel={() => setIsEditModalVisible(false)}
                width={800}
                okText="Lưu thay đổi"
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
                                            <Select.Option value="male">Nam</Select.Option>
                                            <Select.Option value="female">Nữ</Select.Option>
                                            <Select.Option value="other">Khác</Select.Option>
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
                                    {priceConfigs.map((c: any) => (
                                        <Select.Option key={c.level} value={c.level}>{c.name}</Select.Option>
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

            <Tabs
                type="card"
                items={[
                    {
                        key: 'info',
                        label: 'Thông tin chung',
                        icon: <UserOutlined />,
                        children: renderInfoTab(),
                    },
                    {
                        key: 'history',
                        label: 'Lịch sử công việc',
                        icon: <HistoryOutlined />,
                        children: (
                            <Card>
                                <Statistic title="Dự án đã tham gia" value={5} prefix={<ToolOutlined />} />
                                <Divider />
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <HistoryOutlined style={{ fontSize: 40, color: '#d9d9d9', marginBottom: 16 }} />
                                    <p style={{ color: '#999' }}>Tính năng lịch sử công việc chi tiết đang được phát triển...</p>
                                </div>
                            </Card>
                        ),
                    }
                ]}
            />
        </div>
    );
};

export default WorkerDetail;
