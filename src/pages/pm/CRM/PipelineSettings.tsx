import React, { useState } from 'react';
import {
    Layout, Menu, Card, Button, Table, Modal, Form, Input, Select,
    Space, Typography, Tag, message, Popconfirm, ColorPicker, Grid
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined,
    ExclamationCircleOutlined, HolderOutlined
} from '@ant-design/icons';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockPipelines as defaultPipelines, mockServiceRequests as defaultServiceRequests } from '../../../data/mockData';
import type { Pipeline, PipelineStage, PipelineSystemStage, ServiceRequest } from '../../../types/v3';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const SYSTEM_STAGES: { value: PipelineSystemStage; label: string }[] = [
    { value: 'NEW', label: 'Lead Mới' },
    { value: 'IN_PROGRESS', label: 'Đang Xử Lý' },
    { value: 'WON', label: 'Thành Công (WON)' },
    { value: 'LOST', label: 'Thất Bại (LOST)' },
];

const PipelineSettings: React.FC = () => {
    const [mockPipelines, setMockPipelines] = useLocalStorageData<Pipeline[]>(demoDataService.KEYS.PIPELINES, defaultPipelines);
    const [mockServiceRequests] = useLocalStorageData<ServiceRequest[]>(demoDataService.KEYS.SERVICE_REQUESTS, defaultServiceRequests);
    
    const [selectedId, setSelectedId] = useState<string>(mockPipelines[0]?.id || '');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Modals
    const [isPipelineModalVisible, setIsPipelineModalVisible] = useState(false);
    const [isStageModalVisible, setIsStageModalVisible] = useState(false);
    const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
    const [pipelineForm] = Form.useForm();
    const [stageForm] = Form.useForm();

    const activePipeline = mockPipelines.find(p => p.id === selectedId);

    // --- PIPELINE HANDLERS ---
    const handleAddPipeline = () => {
        pipelineForm.resetFields();
        setIsPipelineModalVisible(true);
    };

    const handleSavePipeline = (values: any) => {
        const newPipeline: Pipeline = {
            id: `PPL-${Date.now()}`,
            name: values.name,
            isActive: true,
            isDefault: false,
            stages: [
                { id: `st-${Date.now()}-1`, name: 'Lead Mới', order: 1, color: '#1890ff', systemStage: 'NEW' },
                { id: `st-${Date.now()}-2`, name: 'Thành Công', order: 2, color: '#52c41a', systemStage: 'WON' },
                { id: `st-${Date.now()}-3`, name: 'Thất Bại', order: 3, color: '#ff4d4f', systemStage: 'LOST' }
            ]
        };
        setMockPipelines([...mockPipelines, newPipeline]);
        setSelectedId(newPipeline.id);
        setIsPipelineModalVisible(false);
        message.success('Đã tạo Pipeline mới');
    };

    const handleDeletePipeline = (id: string) => {
        const inUse = mockServiceRequests.some(c => c.pipelineId === id);
        if (inUse) {
            Modal.error({
                title: 'Không thể xóa',
                content: 'Pipeline này đang có Khách hàng. Vui lòng chuyển Khách hàng sang Pipeline khác trước.',
            });
            return;
        }
        const updated = mockPipelines.filter(p => p.id !== id);
        setMockPipelines(updated);
        if (selectedId === id) setSelectedId(updated[0]?.id || '');
        message.success('Đã xóa Pipeline');
    };

    // --- STAGE HANDLERS ---
    const handleAddStage = () => {
        setEditingStage(null);
        stageForm.resetFields();
        stageForm.setFieldsValue({ color: '#1890ff' });
        setIsStageModalVisible(true);
    };

    const handleEditStage = (stage: PipelineStage) => {
        setEditingStage(stage);
        stageForm.setFieldsValue({
            ...stage,
        });
        setIsStageModalVisible(true);
    };

    const handleSaveStage = (values: any) => {
        if (!activePipeline) return;

        const updatedStages = [...activePipeline.stages];
        const colorString = typeof values.color === 'string' ? values.color : values.color.toHexString();

        if (editingStage) {
            const idx = updatedStages.findIndex(s => s.id === editingStage.id);
            if (idx > -1) {
                updatedStages[idx] = { ...editingStage, ...values, color: colorString };
            }
        } else {
            updatedStages.push({
                id: `st-${Date.now()}`,
                name: values.name,
                order: updatedStages.length + 1,
                color: colorString,
                systemStage: values.systemStage
            });
        }

        updatedStages.sort((a, b) => a.order - b.order);

        setMockPipelines(mockPipelines.map(p =>
            p.id === activePipeline.id ? { ...p, stages: updatedStages } : p
        ));
        setIsStageModalVisible(false);
        message.success(editingStage ? 'Đã cập nhật Bước' : 'Đã thêm Bước mới');
    };

    const handleDeleteStage = (stage: PipelineStage) => {
        if (!activePipeline) return;
        if (stage.systemStage === 'WON' || stage.systemStage === 'LOST') {
            message.error('Không thể xóa bước Thành Công hoặc Thất Bại (System Stage).');
            return;
        }
        const inUse = mockServiceRequests.some(c => c.pipelineId === activePipeline.id && c.stageId === stage.id);
        if (inUse) {
            Modal.error({
                title: 'Không thể xóa Cột',
                content: `Cột "${stage.name}" đang chứa Khách hàng. Vui lòng chuyển Khách hàng sang cột khác trước khi xóa để đảm bảo an toàn dữ liệu.`,
            });
            return;
        }

        const updatedStages = activePipeline.stages.filter(s => s.id !== stage.id);
        setMockPipelines(mockPipelines.map(p =>
            p.id === activePipeline.id ? { ...p, stages: updatedStages } : p
        ));
        message.success('Đã xóa Bước');
    };

    const stageColumns = [
        {
            title: '',
            key: 'drag',
            width: 50,
            render: () => <HolderOutlined style={{ cursor: 'grab', color: '#999' }} />
        },
        {
            title: 'Bước (Stage)',
            dataIndex: 'name',
            key: 'name',
            width: isMobile ? 150 : undefined,
            render: (text: string, record: PipelineStage) => (
                <Space>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: record.color }} />
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'System Mapping',
            dataIndex: 'systemStage',
            key: 'systemStage',
            width: 140,
            render: (sys: PipelineSystemStage) => {
                const map: Record<string, any> = {
                    'NEW': { color: 'blue', text: 'Lead Mới' },
                    'IN_PROGRESS': { color: 'gold', text: 'Đang Xử Lý' },
                    'WON': { color: 'green', text: 'Thành Công (Khóa)' },
                    'LOST': { color: 'red', text: 'Thất Bại (Khóa)' },
                };
                return <Tag color={map[sys].color}>{map[sys].text}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            fixed: (isMobile ? 'right' : undefined) as 'right' | 'left' | undefined,
            render: (_: any, record: PipelineStage) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEditStage(record)} />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDeleteStage(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="left"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} disabled={record.systemStage === 'WON' || record.systemStage === 'LOST'} />
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    const sidebarContent = (
        <>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <Title level={5} style={{ margin: 0 }}>Hành Trình Khách Hàng</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Quản lý Pipeline & Kanban</Text>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[selectedId]}
                onClick={(e) => setSelectedId(e.key)}
                style={{ borderRight: 'none', padding: '8px 0' }}
                items={mockPipelines.map(p => ({
                    key: p.id,
                    icon: <SettingOutlined />,
                    label: (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text ellipsis style={{ maxWidth: isMobile ? '60%' : '100%' }}>
                                {p.name} {p.isDefault && <Tag color="blue" style={{ marginLeft: 8, fontSize: 10 }}>Mặc định</Tag>}
                            </Text>
                        </div>
                    )
                }))}
            />
            <div style={{ padding: 16 }}>
                <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddPipeline}>
                    Tạo Pipeline Mới
                </Button>
            </div>
        </>
    );

    return (
        <Layout style={{ minHeight: isMobile ? 'auto' : 'calc(100vh - 120px)', background: '#fff', borderRadius: 8, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
            {/* SIDER: Danh sách Pipelines */}
            {!isMobile ? (
                <Sider width={280} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                    {sidebarContent}
                </Sider>
            ) : (
                <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    {sidebarContent}
                </div>
            )}

            {/* CONTENT: Chi tiết Pipeline */}
            <Content style={{ padding: isMobile ? 8 : 24, background: '#fafafa' }}>
                {activePipeline ? (
                    <Card
                        title={<Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>Cấu hình các bước: {activePipeline.name}</Title>}
                        bodyStyle={{ padding: isMobile ? 8 : 24 }}
                        extra={
                            <Space wrap={isMobile}>
                                {!activePipeline.isDefault && (
                                    <Popconfirm title="Xóa Pipeline này?" onConfirm={() => handleDeletePipeline(activePipeline.id)}>
                                        <Button danger icon={<DeleteOutlined />} size={isMobile ? 'small' : 'middle'}>Xóa</Button>
                                    </Popconfirm>
                                )}
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStage} size={isMobile ? 'small' : 'middle'}>Thêm Cột</Button>
                            </Space>
                        }
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                Các cột Kanban sẽ hiển thị theo thứ tự dưới đây. Để xóa cột, cột đó phải không chứa bất kỳ Khách hàng nào.
                            </Text>
                        </div>

                        <Table
                            columns={stageColumns}
                            dataSource={activePipeline.stages}
                            rowKey="id"
                            pagination={false}
                            size={isMobile ? 'small' : 'middle'}
                            bordered
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: isMobile ? 40 : 100 }}>
                        <Text type="secondary">Vui lòng chọn hoặc tạo Pipeline</Text>
                    </div>
                )}
            </Content>

            {/* Modal Thêm Pipeline */}

            {/* Modal Thêm Pipeline */}
            <Modal
                title="Tạo Pipeline Mới"
                open={isPipelineModalVisible}
                onOk={() => pipelineForm.submit()}
                onCancel={() => setIsPipelineModalVisible(false)}
            >
                <Form form={pipelineForm} layout="vertical" onFinish={handleSavePipeline}>
                    <Form.Item name="name" label="Tên Hành Trình" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input placeholder="VD: Quy trình Thầu B2B" />
                    </Form.Item>
                    <Text type="secondary">Hệ thống sẽ tự tạo 3 bước mặc định: Lead Mới, Thành Công, Thất Bại. Bạn có thể thêm bước sau.</Text>
                </Form>
            </Modal>

            {/* Modal Sửa/Thêm Stage */}
            <Modal
                title={editingStage ? 'Sửa Bước (Stage)' : 'Thêm Bước Mới'}
                open={isStageModalVisible}
                onOk={() => stageForm.submit()}
                onCancel={() => setIsStageModalVisible(false)}
            >
                <Form form={stageForm} layout="vertical" onFinish={handleSaveStage}>
                    <Form.Item name="name" label="Tên Cột (Bước)" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input placeholder="VD: Đang Báo Giá" />
                    </Form.Item>

                    <Form.Item name="systemStage" label="Định danh hệ thống (System Mapping)" rules={[{ required: true }]}>
                        <Select disabled={editingStage?.systemStage === 'WON' || editingStage?.systemStage === 'LOST'}>
                            {SYSTEM_STAGES.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="color" label="Màu sắc nhận diện">
                        <ColorPicker format="hex" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default PipelineSettings;
