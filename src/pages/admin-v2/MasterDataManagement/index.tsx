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
    SettingOutlined,
    MenuOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import masterDataCategoryService from 'services/core-contracts/services/masterDataCategory.service';
import masterDataItemService from 'services/core-contracts/services/masterDataItem.service';
import type {
    IMasterDataCategory,
    ICreateMasterDataCategoryInput,
    MasterDataCategoryModuleEnum,
} from 'services/core-contracts/types/masterDataCategory.types';
import type {
    IMasterDataItem,
    ICreateMasterDataItemInput,
} from 'services/core-contracts/types/masterDataItem.types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const MODULE_OPTIONS: { label: string; value: MasterDataCategoryModuleEnum }[] = [
    { label: 'Cơ bản (Foundation)', value: 'foundation' },
    { label: 'CRM', value: 'crm' },
    { label: 'Dự án (Project)', value: 'project' },
    { label: 'Thi công (Execution)', value: 'execution' },
    { label: 'Kho (Inventory)', value: 'inventory' },
    { label: 'Tài chính (Finance)', value: 'finance' },
    { label: 'Tài liệu (Document)', value: 'document' },
];

const MasterDataManagement: React.FC = () => {
    // Categories State
    const [categories, setCategories] = useState<IMasterDataCategory[]>([]);
    const [catLoading, setCatLoading] = useState(false);
    const [catSearch, setCatSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<IMasterDataCategory | null>(null);

    // Items State
    const [items, setItems] = useState<IMasterDataItem[]>([]);
    const [itemLoading, setItemLoading] = useState(false);

    // Modal State - Category
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<IMasterDataCategory | null>(null);
    const [catSubmitting, setCatSubmitting] = useState(false);
    const [catForm] = Form.useForm();

    // Modal State - Item
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IMasterDataItem | null>(null);
    const [itemSubmitting, setItemSubmitting] = useState(false);
    const [itemForm] = Form.useForm();

    // Mobile States
    const screens = useBreakpoint();
    const isMobile = !screens.lg;
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    // Fetch Categories
    const fetchCategories = useCallback(async () => {
        setCatLoading(true);
        try {
            const response = await masterDataCategoryService.queryContent({
                text: catSearch || undefined,
                sorted: [{ id: 'sortOrder', desc: false }, { id: 'name', desc: false }]
            });
            setCategories(response.data || []);
        } catch (error) {
            console.error('Fetch categories error:', error);
            message.error('Không thể tải danh sách danh mục.');
        } finally {
            setCatLoading(false);
        }
    }, [catSearch]);

    // Fetch Items for Selected Category
    const fetchItems = useCallback(async (categoryId: string) => {
        setItemLoading(true);
        try {
            const response = await masterDataItemService.queryContent({
                group: {
                    id: 'categoryId',
                    operation: '==',
                    value: categoryId,
                    children: []
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
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (selectedCategory) {
            fetchItems(selectedCategory._id);
        } else {
            setItems([]);
        }
    }, [selectedCategory, fetchItems]);

    // Handler - Category CRUD
    const handleAddCategory = () => {
        setEditingCat(null);
        catForm.resetFields();
        catForm.setFieldsValue({ isActive: true, sortOrder: 0, module: 'foundation' });
        setIsCatModalOpen(true);
    };

    const handleEditCategory = (cat: IMasterDataCategory) => {
        setEditingCat(cat);
        catForm.setFieldsValue({ ...cat });
        setIsCatModalOpen(true);
    };

    const handleSaveCategory = async () => {
        try {
            const values = await catForm.validateFields();
            setCatSubmitting(true);

            if (editingCat) {
                await masterDataCategoryService.updateMasterDataCategory(editingCat._id, values);
                message.success('Cập nhật danh mục thành công.');
            } else {
                await masterDataCategoryService.createMasterDataCategory(values);
                message.success('Tạo danh mục mới thành công.');
            }

            setIsCatModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            message.error(error.message || 'Thao tác thất bại.');
        } finally {
            setCatSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await masterDataCategoryService.deleteMasterDataCategory(id);
            message.success('Đã xóa danh mục.');
            if (selectedCategory?._id === id) {
                setSelectedCategory(null);
            }
            fetchCategories();
        } catch (error: any) {
            message.error(error.message || 'Không thể xóa danh mục.');
        }
    };

    // Handler - Item CRUD
    const handleAddItem = () => {
        if (!selectedCategory) {
            message.warning('Vui lòng chọn một danh mục trước.');
            return;
        }
        setEditingItem(null);
        itemForm.resetFields();
        itemForm.setFieldsValue({ 
            categoryId: selectedCategory._id, 
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
            if (selectedCategory) fetchItems(selectedCategory._id);
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
            if (selectedCategory) fetchItems(selectedCategory._id);
        } catch (error: any) {
            message.error(error.message || 'Không thể xóa mục dữ liệu.');
        }
    };

    // Columns - Category
    const catColumns: ColumnsType<IMasterDataCategory> = [
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
                    <div style={{ fontWeight: selectedCategory?._id === record._id ? 'bold' : 'normal', color: selectedCategory?._id === record._id ? '#1890ff' : 'inherit' }}>
                        {record.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{record.code}</div>
                </div>
            ),
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            width: 100,
            responsive: ['md'],
            render: (val: MasterDataCategoryModuleEnum) => (
                <Tag color="cyan">{val}</Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 80,
            render: (_, record) => (
                <Space size="small" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Sửa">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEditCategory(record); }} />
                    </Tooltip>
                    <Popconfirm title="Xóa danh mục này?" onConfirm={(e) => { e?.stopPropagation(); handleDeleteCategory(record._id); }} okText="Xóa" cancelText="Hủy">
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                    </Popconfirm>
                </Space>
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
            dataSource={categories}
            rowKey="_id"
            loading={catLoading}
            pagination={{ pageSize: 10, simple: true }}
            rowClassName={(record) => selectedCategory?._id === record._id ? 'ant-table-row-selected' : ''}
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
                            Cấu hình danh mục dùng chung hệ thống
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space wrap>
                            {isMobile && (
                                <Button 
                                    icon={<MenuOutlined />} 
                                    onClick={() => setIsDrawerVisible(true)}
                                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'white' }}
                                >
                                    Danh mục ({selectedCategory?.name || 'Tất cả'})
                                </Button>
                            )}
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory} ghost style={{ color: 'white', borderColor: 'white' }}>
                                Thêm danh mục
                            </Button>
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
                            extra={<Search placeholder="Tìm..." onSearch={setCatSearch} style={{ width: 120 }} allowClear />}
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
                extra={<Search placeholder="Tìm..." onSearch={setCatSearch} style={{ width: 150 }} allowClear />}
            >
                {categoryView}
            </Drawer>

            {/* Category Modal */}
            <Modal
                title={editingCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                open={isCatModalOpen}
                onOk={handleSaveCategory}
                onCancel={() => setIsCatModalOpen(false)}
                confirmLoading={catSubmitting}
                width={600}
                destroyOnClose
            >
                <Form form={catForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}>
                                <Input placeholder="Ví dụ: Loại vật tư" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="code" label="Mã danh mục (Code)" rules={[{ required: true, message: 'Vui lòng nhập mã danh mục' }]}>
                                <Input placeholder="Ví dụ: MATERIAL_TYPE" disabled={!!editingCat} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="module" label="Module sử dụng" rules={[{ required: true }]}>
                                <Select placeholder="Chọn module">
                                    {MODULE_OPTIONS.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="sortOrder" label="Thứ tự hiển thị">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked">
                                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                            </Form.Item>
                        </Col>
                        <Col span={isMobile ? 24 : 12}>
                            <Form.Item name="allowCustomItem" label="Cho phép tạo Item tùy chỉnh" valuePropName="checked">
                                <Switch checkedChildren="Cho phép" unCheckedChildren="Không" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Mô tả về tác dụng của danh mục này..." />
                    </Form.Item>
                </Form>
            </Modal>

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
                    <Form.Item name="categoryId" hidden><Input /></Form.Item>
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
