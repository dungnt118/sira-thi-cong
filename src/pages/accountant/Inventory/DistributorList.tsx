import React, { useState } from 'react';
import { 
    Table, Button, Space, Modal, Form, Input, Select, Tag, 
    Typography, Card, message 
} from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    BankOutlined 
} from '@ant-design/icons';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import { Distributor } from '../../../types/v3';
import mockDistributors from '../../../data/mock/distributors.json';

const { Title } = Typography;

const DistributorList: React.FC = () => {
    const [distributors, setDistributors] = useLocalStorageData<Distributor[]>('DISTRIBUTORS', mockDistributors as Distributor[]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
    const [form] = Form.useForm();

    const showModal = (distributor?: Distributor) => {
        setEditingDistributor(distributor || null);
        if (distributor) {
            form.setFieldsValue(distributor);
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editingDistributor) {
                setDistributors(prev => prev.map(d => d.id === editingDistributor.id ? { ...d, ...values } : d));
                message.success('Cập nhật nhà phân phối thành công');
            } else {
                const newDistributor: Distributor = {
                    ...values,
                    id: `DIST-${Date.now()}`,
                    code: `NCC-${values.name.split(' ').map((s: string) => s[0]).join('').toUpperCase()}`
                };
                setDistributors(prev => [...prev, newDistributor]);
                message.success('Thêm nhà phân phối thành công');
            }
            setIsModalOpen(false);
        });
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nhà phân phối này?',
            onOk: () => {
                setDistributors(prev => prev.filter(d => d.id !== id));
                message.success('Đã xóa nhà phân phối');
            }
        });
    };

    const columns = [
        {
            title: 'Nhà phân phối',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Distributor) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{record.code}</div>
                </div>
            )
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_: any, record: Distributor) => (
                <div>
                    <div>{record.phone}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
                </div>
            )
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories: string[]) => (
                <>
                    {categories.map(cat => (
                        <Tag color="blue" key={cat}>{cat}</Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_: any, record: Distributor) => (
                <Space>
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => showModal(record)} 
                    />
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record.id)} 
                    />
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Title level={4}><BankOutlined /> Quản lý Nhà phân phối</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm mới
                </Button>
            </div>

            <Card bodyStyle={{ padding: 0 }}>
                <Table 
                    dataSource={distributors} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingDistributor ? 'Sửa nhà phân phối' : 'Thêm nhà phân phối mới'}
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="name" 
                        label="Tên nhà phân phối" 
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input placeholder="Ví dụ: Công ty SIRA" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="categories" label="Lĩnh vực cung cấp">
                        <Select mode="tags" placeholder="Chọn hoặc nhập lĩnh vực">
                            <Select.Option value="Sơn chống thấm">Sơn chống thấm</Select.Option>
                            <Select.Option value="Sơn lót">Sơn lót</Select.Option>
                            <Select.Option value="Vật liệu trám">Vật liệu trám</Select.Option>
                            <Select.Option value="Dụng cụ thi công">Dụng cụ thi công</Select.Option>
                            <Select.Option value="Máy móc thiết bị">Máy móc thiết bị</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DistributorList;
