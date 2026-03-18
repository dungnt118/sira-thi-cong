import React, { useState } from 'react';
import { 
    Form, Input, Select, Button, Card, 
    Typography, Space, Row, Col, message,
    Table, Empty, DatePicker
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    DeleteOutlined, WarningOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import type { Asset, AssetAllocation } from '../../../types/v3';
import mockAssetsData from '../../../data/mock/assets.json';
import { mockProjects, mockUsers } from '../../../data/mockData';

const { Title, Text } = Typography;

const AssetAllocationForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    
    const [assets] = useLocalStorageData<Asset[]>('ASSETS', (mockAssetsData as any).assets);
    const [allocations, setAllocations] = useLocalStorageData<AssetAllocation[]>('ASSET_ALLOCATIONS', []);
    
    const [selectedItems, setSelectedItems] = useState<Asset[]>([]);

    const handleAddItem = () => {
        const values = addForm.getFieldsValue();
        if (!values.assetId) {
            message.warning('Vui lòng chọn tài sản');
            return;
        }

        const asset = assets.find(a => a.id === values.assetId);
        if (!asset) return;
        
        if (selectedItems.find(i => i.id === asset.id)) {
            message.warning('Tài sản này đã được chọn');
            return;
        }

        setSelectedItems([...selectedItems, asset]);
        addForm.setFieldsValue({ assetId: null });
    };

    const removeItem = (id: string) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id));
    };

    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            message.error('Vui lòng chọn ít nhất một tài sản');
            return;
        }

        form.validateFields().then(values => {
            const newAllocations: AssetAllocation[] = selectedItems.map((asset, index) => ({
                id: `CP-${Date.now()}-${index}`,
                code: `CP-${new Date().getFullYear()}-${String(allocations.length + 1 + index).padStart(3, '0')}`,
                assetId: asset.id,
                assetName: asset.name,
                assetCode: asset.code,
                requestedBy: values.requestedBy,
                projectId: values.projectId,
                projectName: mockProjects.find(p => p.id === values.projectId)?.name,
                requestDate: new Date().toISOString(),
                expectedReturnDate: values.expectedReturnDate ? values.expectedReturnDate.toISOString() : undefined,
                status: 'REQUESTED',
                signatures: [],
                notes: values.notes,
                history: [{
                    status: 'REQUESTED',
                    updatedBy: 'Hệ thống (Web)',
                    updatedAt: new Date().toISOString()
                }]
            }));

            setAllocations([...newAllocations, ...allocations]);
            message.success(`Đã tạo ${newAllocations.length} yêu cầu cấp phát tài sản thành công. Chờ Kế toán duyệt.`);
            navigate('/accountant/assets/allocation-history');
        });
    };

    const itemColumns = [
        { title: 'Mã Tài sản', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên Tài sản', dataIndex: 'name', key: 'name' },
        { title: 'Nguyên giá', dataIndex: 'cost', key: 'cost', render: (val: number) => val.toLocaleString('vi-VN') + 'đ' },
        {
            title: '',
            key: 'action',
            render: (_: any, record: Asset) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} />
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/accountant/assets/allocation-history')} style={{ marginRight: '16px' }} />
                <Title level={4} style={{ margin: 0 }}>📋 Phiếu Yêu cầu Cấp phát Tài sản</Title>
            </div>

            <Row gutter={24}>
                <Col span={15}>
                    <Card title="Chọn tài sản cần cấp phát" style={{ marginBottom: '24px' }}>
                        <Form form={addForm} layout="vertical">
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item name="assetId" label="Tài sản (Chỉ hiển thị tài sản Sẵn sàng)">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã, serial hoặc tên tài sản"
                                            optionFilterProp="children"
                                        >
                                            {assets.filter(a => a.status === 'AVAILABLE').map(a => (
                                                <Select.Option key={a.id} value={a.id}>
                                                    <div>
                                                        <strong>[{a.code}]</strong> {a.name} 
                                                        {a.serialNumber && <Text type="secondary" style={{fontSize: 12, marginLeft: 8}}>SN: {a.serialNumber}</Text>}
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem}>
                                        Thêm vào phiếu
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        <Table 
                            dataSource={selectedItems} 
                            columns={itemColumns} 
                            pagination={false} 
                            size="small"
                            rowKey="id"
                            locale={{ emptyText: <Empty description="Chưa chọn tài sản nào" /> }}
                        />
                    </Card>
                </Col>

                <Col span={9}>
                    <Card title="Thông tin người nhận & Dự án">
                        <Form form={form} layout="vertical">
                            <Form.Item 
                                name="requestedBy" 
                                label="Người yêu cầu / Người nhận"
                                rules={[{ required: true, message: 'Vui lòng chọn người nhận' }]}
                            >
                                <Select placeholder="Chọn nhân viên mượn đồ" showSearch optionFilterProp="children">
                                    {mockUsers.map(u => (
                                        <Select.Option key={u.id} value={u.fullName}>
                                            {u.fullName} <Text type="secondary">({u.role})</Text>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item 
                                name="projectId" 
                                label="Dự án sử dụng (Nếu có)"
                            >
                                <Select placeholder="Chọn công trình / dự án" allowClear>
                                    {mockProjects.filter(p => !['CANCELLED', 'COMPLETED'].includes(p.status)).map(p => (
                                        <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="expectedReturnDate" label="Ngày dự kiến trả (Tùy chọn)">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
                            </Form.Item>

                            <Form.Item name="notes" label="Lý do / Ghi chú mượn đồ">
                                <Input.TextArea rows={3} placeholder="Ví dụ: Mượn máy khoan bê tông cho tầng 2..." />
                            </Form.Item>

                            <div style={{ marginTop: '24px' }}>
                                <Button type="primary" size="large" block icon={<SaveOutlined />} onClick={handleSubmit}>
                                    Tạo Phiếu Yêu Cầu
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '16px', border: '1px solid #ffe58f', background: '#fffbe6' }}>
                        <Space align="start">
                            <WarningOutlined style={{ color: '#faad14', marginTop: '4px' }} />
                            <Text style={{ fontSize: '13px' }}>
                                Yêu cầu cấp phát sẽ tự động chuyển sang <strong>Chờ Kế toán duyệt</strong>. 
                                Sau khi duyệt, người mượn cần ký xác nhận nhận bàn giao trên Lịch sử Cấp phát.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AssetAllocationForm;
