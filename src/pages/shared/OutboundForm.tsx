import React, { useState, useEffect, useMemo } from 'react';
import { 
    Form, Input, Select, InputNumber, Button, Card, 
    Typography, Space, Row, Col, message,
    Table, Empty, Radio, Tag, Grid, Spin
} from 'antd';
import { 
    PlusOutlined, SaveOutlined, ArrowLeftOutlined, 
    DeleteOutlined, WarningOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../services/core-contracts/services/material.service';
import { materialGroupService } from '../../services/core-contracts/services/materialGroup.service';
import { journeyService } from '../../services/core-contracts/services/journey.service';
import { stockOrderService } from '../../services/core-contracts/services/stockOrder.service';
import type { IMaterial } from '../../services/core-contracts/types/material.types';
import type { IMaterialGroup } from '../../services/core-contracts/types/materialGroup.types';
import type { IJourney } from '../../services/core-contracts/types/journey.types';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const OutboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { user } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [materials, setMaterials] = useState<IMaterial[]>([]);
    const [groups, setGroups] = useState<IMaterialGroup[]>([]);
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [outMode, setOutMode] = useState<'FULL' | 'PARTIAL'>('FULL');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [mRes, gRes, jRes] = await Promise.all([
                materialService.queryMaterialsDto({}),
                materialGroupService.queryMaterialGroupsDto({}),
                journeyService.queryJourneysDto({})
            ]);
            setMaterials(mRes.data || []);
            setGroups(gRes.data || []);
            // Filter active/not_started journeys manually
            const activeJourneys = (jRes.data || []).filter(j => 
                ['active', 'not_started'].includes(j.project_status || '')
            );
            setJourneys(activeJourneys);
        } catch (error) {
            message.error('Không thể tải dữ liệu ban đầu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.material_id || !values.quantity) {
            message.warning('Vui lòng nhập vật tư và số lượng');
            return;
        }

        const material = materials.find(m => m._id === values.material_id);
        if (!material) return;
        const group = groups.find(g => g._id === material.group_id);

        const isPartial = outMode === 'PARTIAL';
        const unit = isPartial ? (group?.base_unit || material.unit) : material.unit;

        // Validation
        const capacity = material.capacity || 1;
        const partialStock = material.partial_stock || 0;
        const totalAvailable = ((material.current_stock || 0) * capacity) + partialStock;
        const requestedBase = isPartial ? values.quantity : values.quantity * capacity;

        if (requestedBase > totalAvailable) {
            message.error(`Số lượng yêu cầu (${requestedBase} ${unit}) vượt quá tồn kho khả dụng (${totalAvailable} ${unit})`);
            return;
        }

        const newItem = {
            key: Date.now(),
            material_id: material._id,
            material_name: `[${material.code}] ${group?.name || 'Vật tư'} - ${material.capacity}${group?.base_unit || ''}`,
            unit: unit,
            quantity: values.quantity,
            requested_quantity: values.quantity,
            issued_quantity: values.quantity,
            is_partial: isPartial,
            base_quantity: requestedBase, 
            unit_cost: material.unit_cost,
            total: isPartial 
                ? (values.quantity / capacity) * (material.unit_cost || 0) 
                : values.quantity * (material.unit_cost || 0)
        };

        if (selectedItems.some(i => i.material_id === newItem.material_id && i.is_partial === newItem.is_partial)) {
            message.warning('Vật tư này đã được thêm với cùng chế độ xuất');
            return;
        }

        setSelectedItems([...selectedItems, newItem]);
        form.setFieldsValue({ material_id: null, quantity: null });
    };

    const removeItem = (key: number) => {
        setSelectedItems(selectedItems.filter(item => item.key !== key));
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            message.error('Vui lòng thêm ít nhất một mặt hàng');
            return;
        }

        const formValues = form.getFieldsValue();
        if (!formValues.journey_id) {
            message.error('Vui lòng chọn hành trình tiếp nhận');
            return;
        }
        
        const journey = journeys.find(j => j._id === formValues.journey_id);
        setSubmitting(true);
        
        try {
            await stockOrderService.createStockOrder({
                type: 'out',
                journey_id: formValues.journey_id,
                journey_code: journey?.journey_code,
                journey_name: journey?.customer_full_name,
                items: selectedItems.map(item => ({
                    material_id: item.material_id,
                    material_name: item.material_name,
                    unit: item.unit,
                    quantity: item.quantity,
                    requested_quantity: item.requested_quantity,
                    issued_quantity: item.issued_quantity,
                    unit_cost: item.unit_cost,
                    is_partial: item.is_partial
                })),
                total_value: selectedItems.reduce((sum, item) => sum + (item.total || 0), 0),
                status: 'requested',
                notes: formValues.notes,
                created_at: new Date().toISOString()
            });

            message.success('Tạo phiếu xuất kho thành công. Chờ duyệt.');
            navigate(-1);
        } catch (error) {
            message.error('Lỗi khi tạo phiếu xuất kho');
        } finally {
            setSubmitting(false);
        }
    };

    const itemColumns = [
        { 
            title: 'Vật tư', 
            dataIndex: 'material_name', 
            key: 'name',
            render: (text: string) => <div style={{ minWidth: 150 }}>{text}</div>
        },
        { title: 'SL Xuất', dataIndex: 'quantity', key: 'qty', render: (val: number, record: any) => `${val} ${record.unit}` },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', render: (val: number) => (val || 0).toLocaleString('vi-VN') + 'đ' },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.key)} />
            )
        }
    ];

    if (loading) {
        return (
            <div style={{ padding: 100, textAlign: 'center' }}>
                <Spin tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? '8px' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: '16px' }} />
                <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>🚚 Phiếu Xuất Kho</Title>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card 
                        title="Chọn vật tư cấp phát" 
                        style={{ marginBottom: '16px' }}
                    >
                        <Form form={form} layout="vertical">
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary">Chế độ xuất: </Text>
                                <Radio.Group value={outMode} onChange={e => setOutMode(e.target.value)} size={isMobile ? "middle" : "small"}>
                                    <Radio.Button value="FULL">Nguyên thùng/lon</Radio.Button>
                                    <Radio.Button value="PARTIAL">Xuất lẻ (Kg/Lít)</Radio.Button>
                                </Radio.Group>
                            </div>

                            <Row gutter={16}>
                                <Col xs={24} sm={14}>
                                    <Form.Item name="material_id" label="Chọn vật tư">
                                        <Select 
                                            showSearch
                                            placeholder="Gõ mã hoặc tên"
                                            optionFilterProp="children"
                                            onChange={() => form.setFieldsValue({ quantity: null })}
                                            size={isMobile ? 'large' : 'middle'}
                                        >
                                            {materials.map(m => {
                                                const group = groups.find(g => g._id === m.group_id);
                                                const isLow = (m.current_stock || 0) <= (m.min_stock_alert || 0);
                                                return (
                                                    <Select.Option key={m._id} value={m._id} disabled={(m.current_stock || 0) <= 0 && (!m.partial_stock || m.partial_stock <= 0)}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
                                                            <span><Text strong>[{m.code}]</Text> {group?.name || 'Vật tư'} - {m.capacity}{group?.base_unit || ''}</span>
                                                            <span style={{ fontSize: 11, color: isLow ? '#ff4d4f' : '#888' }}>
                                                                Tồn: {m.current_stock || 0} {m.unit} {(m.partial_stock || 0) > 0 ? `(+ ${m.partial_stock} lẻ)` : ''}
                                                            </span>
                                                        </div>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={16} sm={6}>
                                    <Form.Item 
                                        name="quantity" 
                                        label={outMode === 'FULL' ? "Số lượng (Thùng/Lon)" : "Số lượng lẻ (Kg/Lít)"}
                                    >
                                        <InputNumber min={0.01} style={{ width: '100%' }} size={isMobile ? 'large' : 'middle'} />
                                    </Form.Item>
                                </Col>
                                <Col xs={8} sm={4} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />} 
                                        onClick={handleAddItem}
                                        block={isMobile}
                                        size={isMobile ? 'large' : 'middle'}
                                    >
                                        Thêm
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        <Table 
                            dataSource={selectedItems} 
                            columns={itemColumns} 
                            pagination={false} 
                            size="small"
                            scroll={{ x: 'max-content' }}
                            locale={{ emptyText: <Empty description="Chưa có vật tư nào được chọn" /> }}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card 
                        title="Thông tin tiếp nhận"
                        styles={{ body: { padding: isMobile ? '12px' : '24px' } }}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item 
                                name="journey_id" 
                                label="Hành trình / Công trình tiếp nhận"
                                rules={[{ required: true, message: 'Vui lòng chọn hành trình' }]}
                            >
                                <Select 
                                    placeholder="Chọn hành trình" 
                                    showSearch 
                                    optionFilterProp="children"
                                    size={isMobile ? 'large' : 'middle'}
                                >
                                    {journeys.map(j => (
                                        <Select.Option key={j._id} value={j._id}>
                                            <Space direction={isMobile ? 'vertical' : 'horizontal'} size={0}>
                                                <Tag color="blue" style={{fontSize: 11}}>{j.journey_code}</Tag>
                                                <Text style={{ fontSize: isMobile ? 12 : 14 }}>{j.customer_full_name} — {j.requested_service}</Text>
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="notes" label="Ghi chú xuất kho">
                                <Input.TextArea rows={isMobile ? 3 : 4} placeholder="Ví dụ: Cấp bù vật tư cho công trình, cho mượn máy khoan..." />
                            </Form.Item>

                            <div style={{ marginTop: isMobile ? '16px' : '24px' }}>
                                <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                                    <Text strong style={{ fontSize: isMobile ? '16px' : '18px' }}>
                                        Tổng giá trị: {selectedItems.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block 
                                    loading={submitting}
                                    icon={<SaveOutlined />} 
                                    onClick={handleSubmit}
                                    style={{ height: isMobile ? '50px' : 'auto' }}
                                >
                                    Tạo phiếu xuất kho
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '16px', border: '1px solid #ffe58f', background: '#fffbe6' }}>
                        <Space align="start">
                            <WarningOutlined style={{ color: '#faad14', marginTop: '4px' }} />
                            <Text style={{ fontSize: '12px' }}>
                                Phiếu xuất kho sau khi tạo sẽ ở trạng thái <strong>Chờ ký duyệt</strong>. 
                                Giám sát, PM hoặc Kế toán sẽ duyệt và nhận bàn giao vật tư trên ứng dụng.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OutboundForm;
