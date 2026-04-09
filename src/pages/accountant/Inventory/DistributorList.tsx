import React, { useState, useEffect } from 'react';
import {
    Table, Button, Space, Modal, Form, Input, Select, Tag,
    Typography, Card, message, Grid
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    BankOutlined
} from '@ant-design/icons';
import { distributorService } from '../../../services/core-contracts/services/distributor.service';
import type { IDistributor } from '../../../services/core-contracts/types/distributor.types';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const DistributorList: React.FC = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [loading, setLoading] = useState(false);
    const [distributors, setDistributors] = useState<IDistributor[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState<IDistributor | null>(null);
    const [form] = Form.useForm();

    const fetchDistributors = async () => {
        setLoading(true);
        try {
            const res = await distributorService.queryDistributorsDto({});
            if (res.data) {
                setDistributors(res.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách nhà phân phối');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDistributors();
    }, []);

    const showModal = (distributor?: IDistributor) => {
        setEditingDistributor(distributor || null);
        if (distributor) {
            form.setFieldsValue(distributor);
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingDistributor) {
                await distributorService.updateDistributor(editingDistributor._id, values);
                message.success('Cập nhật nhà phân phối thành công');
            } else {
                await distributorService.createDistributor(values);
                message.success('Thêm nhà phân phối thành công');
            }
            setIsModalOpen(false);
            fetchDistributors();
        } catch (error) {
            message.error('Lỗi khi lưu thông tin nhà phân phối');
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nhà phân phối này?',
            onOk: async () => {
                try {
                    await distributorService.deleteDistributor(id);
                    message.success('Đã xóa nhà phân phối');
                    fetchDistributors();
                } catch (error) {
                    message.error('Lỗi khi xóa nhà phân phối');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Nhà phân phối',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: IDistributor) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.code}</Text>
                </Space>
            )
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_: any, record: IDistributor) => (
                <Space direction="vertical" size={0}>
                    <Text>{record.phone || '—'}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email || '—'}</Text>
                </Space>
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
                    {categories?.map(cat => (
                        <Tag color="blue" key={cat}>{cat}</Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_: any, record: IDistributor) => (
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
                        onClick={() => handleDelete(record._id)}
                    />
                </Space>
            )
        }
    ];

    const { Text } = Typography;

    return (
        <div style={{ paddingBottom: isMobile ? 12 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <Title level={4} style={{ margin: 0 }}><BankOutlined /> Quản lý Nhà phân phối</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm mới
                </Button>
            </div>

            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    loading={loading}
                    dataSource={distributors}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 15, size: 'small' }}
                    scroll={{ x: 'max-content' }}
                    size={isMobile ? 'small' : 'middle'}
                />
            </Card>

            <Modal
                title={editingDistributor ? 'Sửa nhà phân phối' : 'Thêm nhà phân phối mới'}
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                width={isMobile ? 'calc(100vw - 24px)' : 520}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên nhà phân phối"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input placeholder="Ví dụ: Công ty BAC" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="Số điện thoại liên hệ" />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input placeholder="Email liên hệ" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input.TextArea rows={2} placeholder="Địa chỉ văn phòng / kho" />
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
