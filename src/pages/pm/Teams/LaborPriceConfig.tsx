import React, { useState } from 'react';
import { 
    Table, Card, Button, InputNumber, Space, Typography, 
    Breadcrumb, message, Modal, Form, Input, Popconfirm, Divider 
} from 'antd';
import { 
    SaveOutlined, ReloadOutlined, DollarOutlined, 
    PlusOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';

const { Title, Text } = Typography;

interface PriceConfig {
    level: string;
    name: string;
    defaultPrice: number;
}

const LaborPriceConfig: React.FC = () => {
    // Use initial mock data if available
    const initialMock = demoDataService.getDataMapping()[demoDataService.KEYS.LABOR_PRICE_CONFIG] || [];

    const [config, setConfig] = useLocalStorageData<PriceConfig[]>(
        demoDataService.KEYS.LABOR_PRICE_CONFIG,
        initialMock
    );
    const [editingData, setEditingData] = useState<PriceConfig[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (config) {
            setEditingData(JSON.parse(JSON.stringify(config)));
        }
    }, [config]);

    const handlePriceChange = (level: string, value: number | null) => {
        const newData = editingData.map(item => 
            item.level === level ? { ...item, defaultPrice: value || 0 } : item
        );
        setEditingData(newData);
        setIsChanged(true);
    };

    const handleDelete = (level: string) => {
        const newData = editingData.filter(item => item.level !== level);
        setEditingData(newData);
        setIsChanged(true);
        message.warning('Đã tạm xoá trình độ này. Vui lòng bấm "Lưu thay đổi" để xác nhận.');
    };

    const handleAdd = (values: any) => {
        // Check if level already exists
        if (editingData.find(i => i.level === values.level)) {
            message.error('Mã trình độ đã tồn tại!');
            return;
        }

        const newItem: PriceConfig = {
            level: values.level,
            name: values.name,
            defaultPrice: values.defaultPrice || 0
        };

        setEditingData([...editingData, newItem]);
        setIsChanged(true);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Đã thêm trình độ mới vào danh sách tạm');
    };

    const handleSave = () => {
        setConfig(editingData);
        setIsChanged(false);
        message.success('Đã lưu bảng giá thợ mới');
    };

    const handleReset = () => {
        if (config) {
            setEditingData(JSON.parse(JSON.stringify(config)));
        }
        setIsChanged(false);
        message.info('Đã tải lại dữ liệu từ bộ nhớ');
    };

    const columns = [
        {
            title: 'Mã (Level)',
            dataIndex: 'level',
            key: 'level',
            render: (text: string) => <code style={{ color: '#1890ff' }}>{text}</code>,
            width: 120,
        },
        {
            title: 'Trình độ / Tay nghề',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Đơn giá đề xuất (VNĐ/giờ)',
            dataIndex: 'defaultPrice',
            key: 'defaultPrice',
            render: (value: number, record: PriceConfig) => (
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                    value={value}
                    onChange={(val) => handlePriceChange(record.level, val as number)}
                    step={5000}
                />
            ),
            width: 250,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: PriceConfig) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xoá trình độ này?"
                    onConfirm={() => handleDelete(record.level)}
                    okText="Xoá"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                        Xoá
                    </Button>
                </Popconfirm>
            ),
            width: 120,
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>Quản lý Đội/Thợ</Breadcrumb.Item>
                <Breadcrumb.Item>Bảng giá thợ</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <DollarOutlined /> Cấu hình Bảng giá công thợ
                </Title>
                <Space split={<Divider type="vertical" />}>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={handleReset}
                    >
                        Tải lại
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setIsModalVisible(true)}
                    >
                        Thêm trình độ
                    </Button>
                    <Button 
                        type="primary" 
                        danger
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        disabled={!isChanged}
                    >
                        Lưu thay đổi
                    </Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={editingData}
                    rowKey="level"
                    pagination={false}
                    bordered
                    locale={{ emptyText: <Text type="secondary">Chưa có dữ liệu cấu hình. Vui lòng bấm "Thêm trình độ".</Text> }}
                />
                <div style={{ marginTop: 24 }}>
                    <Text type="secondary">
                        * Mức giá này sẽ được dùng để gợi ý khi bạn tạo hồ sơ thợ mới hoặc thay đổi trình độ thợ trong quản lý nhân sự.
                    </Text>
                </div>
            </Card>

            <Modal
                title="Thêm trình độ thợ mới"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
                    initialValues={{ defaultPrice: 50000 }}
                >
                    <Form.Item
                        name="level"
                        label="Mã trình độ (Key)"
                        tooltip="Dùng làm mã định danh, ví dụ: junior, middle, senior_plus"
                        rules={[{ required: true, message: 'Vui lòng nhập mã trình độ!' }]}
                    >
                        <Input placeholder="ví dụ: veteran" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên hiển thị"
                        rules={[{ required: true, message: 'Vui lòng nhập tên trình độ!' }]}
                    >
                        <Input placeholder="ví dụ: Thợ lâu năm / Tay nghề cao" />
                    </Form.Item>
                    <Form.Item
                        name="defaultPrice"
                        label="Đơn giá đề xuất (VNĐ/giờ)"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                            step={5000}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LaborPriceConfig;
