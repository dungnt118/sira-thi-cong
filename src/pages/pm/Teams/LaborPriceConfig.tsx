import React, { useState, useEffect } from 'react';
import { 
    Table, Card, Button, InputNumber, Space, Typography, 
    message, Modal, Form, Input, Popconfirm, Divider 
} from 'antd';
import { 
    SaveOutlined, ReloadOutlined, DollarOutlined, 
    PlusOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { laborPriceConfigService } from '../../../services/core-contracts/services/laborPriceConfig.service';
import { ILaborPriceConfig } from '../../../services/core-contracts/types/laborPriceConfig.types';

const { Title, Text } = Typography;

const LaborPriceConfig: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<ILaborPriceConfig[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<ILaborPriceConfig | null>(null);
    const [form] = Form.useForm();

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const data = await laborPriceConfigService.queryContent();
            setConfig(data.data || []);
        } catch (error: any) {
            message.error('Không thể tải cấu hình trình độ thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const showModal = (item?: ILaborPriceConfig) => {
        form.resetFields();
        if (item) {
            setEditingItem(item);
            form.setFieldsValue(item);
        } else {
            setEditingItem(null);
            form.setFieldsValue({ pricePerDay: 300000 });
        }
        setIsModalVisible(true);
    };

    const handleSave = async (values: any) => {
        try {
            if (editingItem) {
                await laborPriceConfigService.updateLaborPriceConfig(editingItem._id, values);
                message.success('Cập nhật trình độ thành công');
            } else {
                await laborPriceConfigService.createLaborPriceConfig(values);
                message.success('Thêm trình độ mới thành công');
            }
            setIsModalVisible(false);
            fetchConfig();
        } catch (error: any) {
            message.error('Lỗi khi lưu dữ liệu: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await laborPriceConfigService.deleteLaborPriceConfig(id);
            message.success('Đã xoá trình độ');
            fetchConfig();
        } catch (error: any) {
            message.error('Lỗi khi xoá: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'Mã trình độ',
            dataIndex: 'levelCode',
            key: 'levelCode',
            render: (text: string) => <code style={{ color: '#1890ff' }}>{text || '(Tự động sinh)'}</code>,
            width: 150,
        },
        {
            title: 'Trình độ / Tay nghề',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Đơn giá đề xuất (VNĐ/công)',
            dataIndex: 'pricePerDay',
            key: 'pricePerDay',
            render: (value: number) => (
                <Text type="danger" strong>
                    {value?.toLocaleString()} VNĐ/công
                </Text>
            ),
            width: 250,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: ILaborPriceConfig) => (
                <Space>
                    <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xoá trình độ này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xoá"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Xoá
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 180,
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <DollarOutlined /> Cấu hình Trình độ & Giá công thợ
                </Title>
                <Space split={<Divider type="vertical" />}>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={fetchConfig}
                        loading={loading}
                    >
                        Tải lại
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => showModal()}
                    >
                        Thêm trình độ
                    </Button>
                </Space>
            </div>

            <Card loading={loading}>
                <Table
                    columns={columns}
                    dataSource={config}
                    rowKey="_id"
                    pagination={false}
                    bordered
                    locale={{ emptyText: <Text type="secondary">Chưa có dữ liệu cấu hình. Vui lòng bấm "Thêm trình độ".</Text> }}
                />
                <div style={{ marginTop: 24 }}>
                    <Text type="secondary">
                        * Mức giá này (tính theo công/ngày) sẽ được dùng để gợi ý khi bạn tạo hồ sơ thợ mới hoặc thay đổi trình độ thợ trong quản lý nhân sự.
                    </Text>
                </div>
            </Card>

            <Modal
                title={editingItem ? "Chỉnh sửa trình độ" : "Thêm trình độ thợ mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="levelCode"
                        label="Mã trình độ"
                        tooltip="Hệ thống sẽ tự sinh nếu để trống. Ví dụ: junior, middle, senior_plus"
                    >
                        <Input placeholder="ví dụ: veteran" disabled={!!editingItem} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên hiển thị"
                        rules={[{ required: true, message: 'Vui lòng nhập tên trình độ!' }]}
                    >
                        <Input placeholder="ví dụ: Thợ lâu năm / Tay nghề cao" />
                    </Form.Item>
                    <Form.Item
                        name="pricePerDay"
                        label="Đơn giá đề xuất (VNĐ/công)"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                            step={50000}
                        />
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LaborPriceConfig;

