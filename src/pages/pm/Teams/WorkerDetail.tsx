import {
    ArrowLeftOutlined,
    CalendarOutlined,
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    HistoryOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    TeamOutlined,
    ToolOutlined,
    UploadOutlined,
    UserOutlined,
    VerifiedOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Empty,
    Form,
    Grid,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Rate,
    Row,
    Select,
    Space,
    Statistic,
    Tabs,
    Tag,
    Typography,
    Upload,
    Spin
} from 'antd';
import dayjs from 'dayjs';
import { UploadImageEdit } from '../../../components/files/UploadImage';
import { UploadFilesEdit } from '../../../components/files/UploadFiles';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MapPicker from '../../../components/common/MapPicker';
import { workerService } from '../../../services/core-contracts/services/worker.service';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import { workerTeamService } from '../../../services/core-contracts/services/workerTeam.service';
import { IWorker } from '../../../services/core-contracts/types/worker.types';
import { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';
import { IWorkerTeam } from '../../../services/core-contracts/types/workerTeam.types';
import { getFileLink } from '@/services/storeService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const WorkerDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [worker, setWorker] = useState<IWorker | null>(null);
    const [priceConfigs, setPriceConfigs] = useState<ILaborPriceConfig[]>([]);
    const [teams, setTeams] = useState<IWorkerTeam[]>([]);
    const [linkedTeam, setLinkedTeam] = useState<IWorkerTeam | null>(null);

    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [form] = Form.useForm();
    const watchedAddress = Form.useWatch('address', form);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [workerData, configsRes, teamsRes] = await Promise.all([
                workerService.findContent(id),
                laborPriceConfigService.queryContent(),
                workerTeamService.queryContent()
            ]);
            setWorker(workerData);
            setPriceConfigs(configsRes.data || []);
            setTeams(teamsRes.data || []);
            
            if (workerData.teamId) {
                try {
                    const teamData = await workerTeamService.findContent(workerData.teamId);
                    setLinkedTeam(teamData);
                } catch (e) {
                    console.error('Không tìm thấy đội:', e);
                }
            }
        } catch (error: any) {
            message.error('Lỗi khi tải thông tin thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const priceConfig = useMemo(() => 
        priceConfigs.find(c => c.levelCode === worker?.priceConfigId), 
    [priceConfigs, worker]);

    const handleLevelChange = (levelCode: string) => {
        const config = priceConfigs.find(c => c.levelCode === levelCode);
        if (config && config.defaultPrice !== undefined) {
            form.setFieldsValue({ costPerDay: config.defaultPrice });
            message.info(`Gợi ý đơn giá cho ${config.name}: ${config.defaultPrice.toLocaleString()} VNĐ/ngày`);
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
        form.validateFields().then(async values => {
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.toISOString() : null,
                lat: values.mapLocation?.lat,
                lng: values.mapLocation?.lng,
            };

            try {
                if (id) {
                    await workerService.updateWorker(id, formattedValues);
                    message.success('Cập nhật thông tin thợ thành công');
                    setIsEditModalVisible(false);
                    fetchData();
                }
            } catch (error: any) {
                message.error('Lỗi khi cập nhật: ' + error.message);
            }
        });
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            await workerService.deleteWorker(id);
            message.success('Đã xóa thợ khỏi danh sách');
            navigate('/admin/ql/teams/workers');
        } catch (error: any) {
            message.error('Lỗi khi xóa: ' + error.message);
        }
    };

    if (loading) {
        return <div style={{ padding: 100, textAlign: 'center' }}><Spin size="large" /></div>;
    }

    if (!worker) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy thông tin thợ" />
                <Button onClick={() => navigate('/admin/ql/teams/workers')}>Quay lại danh sách</Button>
            </div>
        );
    }

    const renderInfoTab = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} lg={16}>
                <Card title="Thông Tin Cá Nhân & Liên Hệ">
                    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                        <Descriptions.Item label="Mã thợ"><Text code>{worker.code || 'N/A'}</Text></Descriptions.Item>
                        <Descriptions.Item label="Họ và tên"><Text strong>{worker.name}</Text></Descriptions.Item>
                        <Descriptions.Item label="Giới tính">{worker.gender === 'male' ? 'Nam' : worker.gender === 'female' ? 'Nữ' : 'Khác'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh"><CalendarOutlined /> {worker.dob ? dayjs(worker.dob).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại"><PhoneOutlined /> {worker.phone || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Email"><MailOutlined /> {worker.email || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ cụ thể" span={2}><EnvironmentOutlined /> {worker.address || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Loại nhân sự">
                            <Tag color={worker.workerType === 'internal' ? 'blue' : 'orange'}>
                                {worker.workerType === 'internal' ? 'Nhân viên nội bộ' : 'Thợ ngoài / CTV'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trình độ">
                            <Tag color="cyan">{priceConfig?.name || worker.priceConfigId || 'N/A'}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá công (/ngày)">
                            <Text strong type="danger">{Number(worker.costPerDay || 0).toLocaleString()} VNĐ</Text>
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
                        {(worker.attachments || []).length > 0 ? (
                            worker.attachments?.map((file: any) => (
                                <Card size="small" hoverable style={{ background: '#fafafa' }} key={file._id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Space>
                                            <VerifiedOutlined style={{ color: '#52c41a' }} />
                                            <Text>{file.fileName || 'Tài liệu đính kèm'}</Text>
                                        </Space>
                                        <Button type="link" href={file.url} target="_blank">Xem</Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có hồ sơ đính kèm" />
                        )}
                    </Space>
                </Card>
            </Col>

            <Col xs={24} lg={8}>
                <Card style={{ background: '#f0f5ff', borderColor: '#adc6ff', textAlign: 'center' }}>
                    <Avatar 
                        size={100} 
                        src={(worker as any).avatar ? ((worker as any).avatar.includes('http') || (worker as any).avatar.includes('data:image') ? (worker as any).avatar : getFileLink((worker as any).avatar)) : undefined} 
                        icon={<UserOutlined />} 
                        style={{ background: '#1890ff', marginBottom: 16 }} 
                    />
                    <Title level={3} style={{ margin: 0 }}>{worker.name}</Title>
                    <Text type="secondary">{worker.position}</Text>

                    <Divider style={{ margin: '16px 0' }} />

                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic
                            title="Giá công đề xuất"
                            value={worker.costPerDay || 0}
                            suffix="VNĐ"
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
                                <Avatar icon={<TeamOutlined />} style={{ background: '#52c41a' }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{linkedTeam.teamName}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>{linkedTeam.contactName}</div>
                                </div>
                            </Space>
                            <Button type="link" onClick={() => navigate(`/admin/ql/teams/groups/${linkedTeam._id}`)}>Chi tiết</Button>
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
                style={{ top: 20 }}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} md={16}>
                            <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="code" label="Mã thợ (Auto)">
                                        <Input placeholder="Tự sinh nếu trống" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="name" label="Họ và tên thợ" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="workerType" label="Phân loại">
                                        <Select>
                                            <Select.Option value="internal">Nội bộ</Select.Option>
                                            <Select.Option value="external">Thuê ngoài</Select.Option>
                                            <Select.Option value="collaborator">Cộng tác viên</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="teamId" label="Đội nhóm (Team)">
                                        <Select placeholder="Chọn đội nhóm" allowClear>
                                            {teams.map(t => (
                                                <Select.Option key={t._id} value={t._id}>{t.teamName}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={12} sm={8}>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Select placeholder="Chọn">
                                            <Select.Option value="male">Nam</Select.Option>
                                            <Select.Option value="female">Nữ</Select.Option>
                                            <Select.Option value="other">Khác</Select.Option>
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
                                    {priceConfigs.map((c) => (
                                        <Select.Option key={c.levelCode} value={c.levelCode}>{c.name}</Select.Option>
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
                                <MapPicker address={watchedAddress} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Chứng chỉ & Hồ sơ</Divider>
                    <Form.Item name="attachments">
                        <UploadFilesEdit />
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
