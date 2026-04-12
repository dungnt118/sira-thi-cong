import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    message,
    Typography,
    Divider,
    Switch,
    InputNumber,
    Grid,
    Drawer,
    List,
    Avatar,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    DatabaseOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    StopOutlined,
    InfoCircleOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import masterDataItemService from 'services/core-contracts/services/masterDataItem.service';
import type {
    IMasterDataItem,
    ICreateMasterDataItemInput,
    MasterDataItemCategoryEnum,
} from 'services/core-contracts/types/masterDataItem.types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface IStaticCategory {
    name: string;
    value: MasterDataItemCategoryEnum;
    description: string;
    icon?: React.ReactNode;
}

const STATIC_CATEGORIES: IStaticCategory[] = [
    { name: 'Loại dịch vụ', value: 'service_type', description: 'Các loại dịch vụ chính cung cấp cho khách hàng' },
    { name: 'Kênh nguồn', value: 'source_channel', description: 'Nguồn khách hàng đến từ đâu' },
    { name: 'Loại công trình', value: 'construction_type', description: 'Phân loại các dự án thi công' },
    { name: 'Mức độ ưu tiên', value: 'priority_level', description: 'Độ ưu tiên của công việc/yêu cầu' },
    { name: 'Trạng thái Go/No-Go', value: 'go_no_go_status', description: 'Trạng thái đánh giá khả thi dự án' },
    { name: 'Trạng thái SLA', value: 'sla_status', description: 'Tình trạng cam kết chất lượng dịch vụ' },
    { name: 'Trạng thái Portal', value: 'portal_publish_status', description: 'Trạng thái hiển thị trên cổng thông tin' },
    { name: 'Trạng thái khảo sát', value: 'survey_status', description: 'Tiến độ thực hiện khảo sát' },
    { name: 'Trạng thái báo giá', value: 'quote_status', description: 'Các giai đoạn của báo giá' },
    { name: 'Trạng thái dự án', value: 'project_status', description: 'Vòng đời của một dự án' },
];

const MasterDataManagement: React.FC = () => {
    // Categories State
    const [selectedCategory, setSelectedCategory] = useState<IStaticCategory | null>(STATIC_CATEGORIES[0]);
    const [catSearch, setCatSearch] = useState('');

    // Items State
    const [items, setItems] = useState<IMasterDataItem[]>([]);
    const [itemLoading, setItemLoading] = useState(false);

    // Modal State - Item
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IMasterDataItem | null>(null);
    const [itemSubmitting, setItemSubmitting] = useState(false);
    const [itemForm] = Form.useForm();

    // Mobile States
    const screens = useBreakpoint();
    const isMobile = !screens.lg;
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    // Filtered static categories
    const filteredCategories = STATIC_CATEGORIES.filter(c => 
        c.name.toLowerCase().includes(catSearch.toLowerCase()) || 
        c.value.toLowerCase().includes(catSearch.toLowerCase())
    );

    // Fetch Items for Selected Category
    const fetchItems = useCallback(async (categoryValue: MasterDataItemCategoryEnum) => {
        setItemLoading(true);
        try {
            const response = await masterDataItemService.queryContent({
                group: {
                    op: 'AND',
                    children: [
                        {
                            id: 'category',
                            operation: '==',
                            value: categoryValue,
                        }
                    ]
                } as any,
                sorted: [{ id: 'sortOrder', desc: false }, { id: 'label', desc: false }]
            });
            setItems(response.data || []);
        } catch (error) {
            console.error('Fetch items error:', error);
            message.error('Không thể tải danh sách mục dữ liệu.');
        } finally {
            setItemLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchItems(selectedCategory.value);
        } else {
            setItems([]);
        }
    }, [selectedCategory, fetchItems]);

    // Handler - Item CRUD
    const handleAddItem = () => {
        if (!selectedCategory) {
            message.warning('Vui lòng chọn một danh mục trước.');
            return;
        }
        setEditingItem(null);
        itemForm.resetFields();
        itemForm.setFieldsValue({ 
            category: selectedCategory.value, 
            isActive: true, 
            sortOrder: 0 
        });
        setIsItemModalOpen(true);
    };

    const handleEditItem = (item: IMasterDataItem) => {
        setEditingItem(item);
        itemForm.setFieldsValue({ ...item });
        setIsItemModalOpen(true);
    };

    const handleSaveItem = async () => {
        try {
            const values = await itemForm.validateFields();
            setItemSubmitting(true);

            if (editingItem) {
                await masterDataItemService.updateMasterDataItem(editingItem._id, values);
                message.success('Cập nhật mục dữ liệu thành công.');
            } else {
                await masterDataItemService.createMasterDataItem(values);
                message.success('Tạo mục dữ liệu mới thành công.');
            }

            setIsItemModalOpen(false);
            if (selectedCategory) fetchItems(selectedCategory.value);
        } catch (error: any) {
            message.error(error.message || 'Thao tác thất bại.');
        } finally {
            setItemSubmitting(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await masterDataItemService.deleteMasterDataItem(id);
            message.success('Đã xóa mục dữ liệu.');
            if (selectedCategory) fetchItems(selectedCategory.value);
        } catch (error: any) {
            message.error(error.message || 'Không thể xóa mục dữ liệu.');
        }
    };

    // Columns - Category
    const catColumns: ColumnsType<IStaticCategory> = [
        {
            title: 'Danh mục',
            key: 'name',
            render: (_, record) => (
                <div 
                    style={{ cursor: 'pointer', padding: isMobile ? '8px 0' : '0' }} 
                    onClick={() => {
                        setSelectedCategory(record);
                        if (isMobile) setIsDrawerVisible(false);
                    }}
                >
                    <div style={{ fontWeight: selectedCategory?.value === record.value ? 'bold' : 'normal', color: selectedCategory?.value === record.value ? '#1890ff' : 'inherit' }}>
                        {record.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{record.value}</div>
                </div>
            ),
        }
    ];

    // Columns - Item
    const itemColumns: ColumnsType<IMasterDataItem> = [
        {
            title: 'Nhãn (Label)',
            dataIndex: 'label',
            key: 'label',
            render: (text, record) => (
                <Space>
                    {record.color && <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: record.color }} />}
                    {record.faIcon && <i className={`fas ${record.faIcon}`} style={{ fontSize: 13, color: '#8c8c8c' }} />}
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Giá trị (Value)',
            dataIndex: 'value',
            key: 'value',
            render: (text) => <Tag>{text}</Tag>
        },
        {
            title: 'Thứ tự',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            width: 80,
            align: 'center'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (active) => (
                <Tag color={active ? 'success' : 'default'} icon={active ? <CheckCircleOutlined /> : <StopOutlined />}>
                    {active ? 'Bật' : 'Tắt'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditItem(record)}>Sửa</Button>
                    <Popconfirm title="Xóa mục này?" onConfirm={() => handleDeleteItem(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    const categoryView = (
        <Table
            columns={catColumns}
            dataSource={filteredCategories}
            rowKey="value"
            pagination={{ pageSize: 12, simple: true }}
            rowClassName={(record) => selectedCategory?.value === record.value ? 'ant-table-row-selected' : ''}
            showHeader={!isMobile}
        />
    );

    return (
        <div style={{ padding: '0px' }}>
            <div style={{ marginBottom: isMobile ? 12 : 24, background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', padding: isMobile ? '16px' : '24px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Row align="middle" gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Title level={isMobile ? 4 : 2} style={{ color: 'white', margin: 0 }}>
                            <DatabaseOutlined /> Master Data
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '12px' : '14px' }}>
                            Cấu hình danh mục hệ thống (Enum Based)
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space wrap>
                            {isMobile && (
                                <Button 
                                    icon={<PlusOutlined />} 
                                    onClick={() => setIsDrawerVisible(true)}
                                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'white' }}
                                >
                                    Chọn danh mục ({selectedCategory?.name || 'Tất cả'})
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </div>

            <Row gutter={isMobile ? [0, 12] : 24}>
                {/* Categories Panel - Desktop Only */}
                {!isMobile && (
                    <Col xs={24} lg={8} xl={7}>
                        <Card 
                            title={<Space><AppstoreOutlined /> Danh sách danh mục</Space>}
                            extra={<Search placeholder="Tìm..." onChange={e => setCatSearch(e.target.value)} style={{ width: 120 }} allowClear />}
                            bodyStyle={{ padding: 0 }}
                            className="glass-card"
                        >
                            {categoryView}
                        </Card>
                    </Col>
                )}

                {/* Items Panel */}
                <Col xs={24} lg={isMobile ? 24 : 16} xl={isMobile ? 24 : 17}>
                    <Card
                        title={
                            <Space wrap>
                                <OrderedListOutlined /> 
                                {selectedCategory ? `Dữ liệu: ${selectedCategory.name}` : 'Chi tiết mục dữ liệu'}
                            </Space>
                        }
                        extra={
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                onClick={handleAddItem} 
                                disabled={!selectedCategory}
                                size={isMobile ? 'small' : 'middle'}
                            >
                                Thêm Item
                            </Button>
                        }
                        className="glass-card"
                    >
                        {selectedCategory ? (
                            isMobile ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={items}
                                    loading={itemLoading}
                                    renderItem={(item) => (
                                        <List.Item
                                            actions={[
                                                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditItem(item)} />,
                                                <Popconfirm key="del" title="Xóa?" onConfirm={() => handleDeleteItem(item._id)}>
                                                    <Button type="text" danger icon={<DeleteOutlined />} />
                                                </Popconfirm>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar 
                                                        style={{ backgroundColor: item.color || '#1890ff' }}
                                                        icon={item.faIcon ? <i className={`fas ${item.faIcon}`} /> : null}
                                                    >
                                                        {!item.faIcon ? item.label?.charAt(0) : null}
                                                    </Avatar>
                                                }
                                                title={
                                                    <Space>
                                                        <Text strong>{item.label}</Text>
                                                        {!item.isActive && <Tag color="default">Tắt</Tag>}
                                                    </Space>
                                                }
                                                description={
                                                  <Space split={<Divider type="vertical" />} style={{ fontSize: '12px' }}>
                                                    <Tag>{item.value}</Tag>
                                                    <Text type="secondary">STT: {item.sortOrder}</Text>
                                                  </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Table
                                    columns={itemColumns}
                                    dataSource={items}
                                    rowKey="_id"
                                    loading={itemLoading}
                                    pagination={{ pageSize: 15 }}
                                    scroll={{ x: 'max-content' }}
                                />
                            )
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px 0', color: '#BFBFBF' }}>
                                <InfoCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                                <p>Cần chọn một danh mục trước khi quản lý các mục dữ liệu</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Mobile Drawer */}
            <Drawer
                title={<Space><AppstoreOutlined /> Chọn danh mục</Space>}
                placement="left"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                bodyStyle={{ padding: 0 }}
                width="80%"
                extra={<Search placeholder="Tìm..." onChange={e => setCatSearch(e.target.value)} style={{ width: 150 }} allowClear />}
            >
                {categoryView}
            </Drawer>

            {/* Item Modal */}
            <Modal
                title={editingItem ? 'Cập nhật mục dữ liệu' : 'Thêm mục dữ liệu mới'}
                open={isItemModalOpen}
                onOk={handleSaveItem}
                onCancel={() => setIsItemModalOpen(false)}
                confirmLoading={itemSubmitting}
                width={700}
                destroyOnClose
            >
                <Form form={itemForm} layout="vertical">
                    <Form.Item name="category" label="Danh mục (Enum)" rules={[{ required: true }]}>
                        <Select disabled>
                            {STATIC_CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="label" label="Nhãn hiển thị (Label)" rules={[{ required: true, message: 'Vui lòng nhập nhãn' }]}>
                                <Input placeholder="Ví dụ: Xi măng" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="value" label="Giá trị (Value)" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
                                <Input placeholder="Ví dụ: CEMENT" disabled={!!editingItem} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="shortLabel" label="Nhãn ngắn">
                                <Input placeholder="Ví dụ: XM" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="color" label="Màu sắc hiển thị (Hex)">
                                <Input placeholder="#1890ff" prefix={<div style={{ width: 14, height: 14, background: itemForm.getFieldValue('color') || '#ddd', border: '1px solid #ccc' }} />} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={isMobile ? 12 : 8}>
                            <Form.Item name="faIcon" label="Icon (FontAwesome)">
                                <Input placeholder="fa-cube" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 12 : 8}>
                            <Form.Item name="sortOrder" label="Thứ tự">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 8}>
                            <Form.Item name="isDefault" label="Là mặc định" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked">
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
                    </Form.Item>
                    <Form.Item name="description" label="Ghi chú / Mô tả">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(8px);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
                .ant-table-row-selected td {
                    background-color: #e6f7ff !important;
                }
                .ant-card-head {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
                    padding: 0 16px !important;
                }
                .ant-btn-primary {
                    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
                    border-radius: 6px;
                }
                .ant-list-item-meta-avatar {
                   display: flex;
                   align-items: center;
                }
            `}</style>
        </div>
    );
};

export default MasterDataManagement;
