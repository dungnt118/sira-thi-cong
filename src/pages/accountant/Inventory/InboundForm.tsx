import React, { useState, useMemo, useEffect } from 'react';
import {
    Form, Input, Select, InputNumber, Button, Card,
    Typography, Space, Row, Col, message,
    Radio, Table, Divider, Tag, Grid
} from 'antd';
import {
    PlusOutlined, SaveOutlined, ArrowLeftOutlined,
    InfoCircleOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../../services/core-contracts/services/material.service';
import { materialGroupService } from '../../../services/core-contracts/services/materialGroup.service';
import { distributorService } from '../../../services/core-contracts/services/distributor.service';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import { journeyService } from '../../../services/core-contracts/services/journey.service';
import type { IMaterial } from '../../../services/core-contracts/types/material.types';
import type { IMaterialGroup } from '../../../services/core-contracts/types/materialGroup.types';
import type { IDistributor } from '../../../services/core-contracts/types/distributor.types';
import type { IStockOrder, IItemsItem } from '../../../services/core-contracts/types/stockOrder.types';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const InboundForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { user } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [sourceType, setSourceType] = useState<'distributor' | 'journey'>('distributor');

    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<IMaterial[]>([]);
    const [groups, setGroups] = useState<IMaterialGroup[]>([]);
    const [distributors, setDistributors] = useState<IDistributor[]>([]);
    const [journeys, setJourneys] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    // Watch form fields for reactivity and calculation
    const watchedQuantity = Form.useWatch('quantity', form);
    const watchedRemainingQuantity = Form.useWatch('remaining_quantity', form);
    const watchedUnitCost = Form.useWatch('unit_cost', form);
    const watchedIsPartial = Form.useWatch('is_partial', form);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [matRes, grpRes, distRes, jrnRes] = await Promise.all([
                    materialService.queryMaterialsDto({}),
                    materialGroupService.queryMaterialGroupsDto({}),
                    distributorService.queryDistributorsDto({}),
                    journeyService.queryJourneysDto({})
                ]);
                if (matRes.data) setMaterials(matRes.data);
                if (grpRes.data) setGroups(grpRes.data);
                if (distRes.data) setDistributors(distRes.data);
                if (jrnRes.data) setJourneys(jrnRes.data);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu khởi tạo');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Calculate temporary total for the current input
    const tempTotal = useMemo(() => {
        const qty = watchedIsPartial ? (watchedRemainingQuantity || 0) : (watchedQuantity || 0);
        const cost = watchedUnitCost || 0;
        return qty * cost;
    }, [watchedIsPartial, watchedQuantity, watchedRemainingQuantity, watchedUnitCost]);

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.material_id || (!values.quantity && !values.remaining_quantity)) {
            message.warning('Vui lòng chọn vật tư và nhập số lượng');
            return;
        }

        const material = materials.find(m => m._id === values.material_id);
        if (!material) return;
        const group = groups.find(g => g._id === material.group_id);

        const is_partial = values.is_partial && sourceType === 'journey';
        const qty = is_partial ? 0 : (values.quantity || 0);
        const remQty = values.remaining_quantity || 0;
        const cost = values.unit_cost || material.unit_cost || 0;

        const newItem = {
            key: Date.now(),
            material_id: material._id,
            material_name: `[${material.code}] ${group?.name || 'Vật tư'} - quy cách ${material.capacity}${group?.base_unit || ''}`,
            base_unit: group?.base_unit || 'đơn vị',
            unit: material.unit,
            quantity: qty,
            requested_quantity: qty,
            issued_quantity: qty,
            is_partial: is_partial,
            remaining_quantity: remQty,
            unit_cost: cost,
            total: is_partial ? (remQty * cost) : (qty * cost),
        };

        setSelectedItems([...selectedItems, newItem]);
        form.setFieldsValue({ material_id: null, quantity: null, unit_cost: null, is_partial: false, remaining_quantity: null });
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

        try {
            const newStockOrder: any = {
                type: 'in',
                status: 'completed',
                source: sourceType,
                distributor_source_id: sourceType === 'distributor' ? formValues.distributor_id : undefined,
                journey_source_id: sourceType === 'journey' ? formValues.journey_id : undefined,
                items: selectedItems.map(item => ({
                    material_id: item.material_id,
                    material_name: item.material_name,
                    unit: item.unit as any,
                    quantity: item.quantity,
                    requested_quantity: item.requested_quantity,
                    issued_quantity: item.issued_quantity,
                    unit_cost: item.unit_cost,
                    is_partial: item.is_partial,
                    remaining_percent: item.is_partial ? (item.remaining_quantity * 100 / (materials.find(m => m._id === item.material_id)?.capacity || 1)) : 100
                })),
                total_value: selectedItems.reduce((sum, item) => sum + (item.total || 0), 0),
                notes: formValues.notes,
                created_at: new Date().toISOString()
            };

            await stockOrderService.createStockOrder(newStockOrder);
            message.success('Nhập kho thành công');
            navigate('/admin/kt/inventory');
        } catch (error) {
            message.error('Lỗi khi tạo phiếu nhập kho');
        }
    };

    const itemColumns = [
        {
            title: 'Vật tư', dataIndex: 'material_name', key: 'name', render: (val: string, record: any) => (
                <div>
                    <div>{val}</div>
                    {record.is_partial && <Tag color="warning" style={{ fontSize: 10 }}>Hàng dở dang</Tag>}
                </div>
            )
        },
        {
            title: 'Quy cách',
            dataIndex: 'material_id',
            key: 'sku',
            render: (_: string, record: any) => {
                const materialsMatch = materials.find(m => m._id === record.material_id);
                return <Tag color="blue">{materialsMatch?.unit || 'đơn vị'}</Tag>;
            }
        },
        {
            title: 'SL Nhập',
            key: 'qty',
            render: (_: any, record: any) => record.isPartial ? `${record.remainingQuantity} (${record.baseUnit} lẻ)` : `${record.quantity} ${record.unit}`
        },
        { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', render: (val: number) => (val || 0).toLocaleString('vi-VN') + 'đ' },
        { title: 'Thành tiền', dataIndex: 'total', key: 'total', render: (val: number) => (val || 0).toLocaleString('vi-VN') + 'đ' },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.key)} />
            )
        }
    ];

    return (
        <div style={{ padding: isMobile ? '0 0 12px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/inventory')} style={{ marginRight: isMobile ? 0 : 16 }} />
                <Title level={4} style={{ margin: 0 }}>📋 Phiếu Nhập Kho</Title>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={17}>
                    <Card title="Thông tin mặt hàng" style={{ marginBottom: '24px' }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={[12, 12]}>
                                <Col xs={24} lg={10}>
                                    <Form.Item name="material_id" label="Chọn vật tư">
                                        <Select
                                            showSearch
                                            placeholder="Gõ mã SKU hoặc tên"
                                            optionFilterProp="children"
                                            loading={loading}
                                            onChange={(val) => {
                                                const mat = materials.find(m => m._id === val);
                                                if (mat) form.setFieldsValue({ unit_cost: mat.unit_cost });
                                            }}
                                        >
                                            {materials
                                                .filter(m => {
                                                    const g = groups.find(group => group._id === m.group_id);
                                                    return g?.type === 'CONSUMABLE';
                                                })
                                                .map(m => {
                                                    const group = groups.find(g => g._id === m.group_id);
                                                    return (
                                                        <Select.Option key={m._id} value={m._id}>
                                                            <Text strong>[{m.code}]</Text> {group?.name} - quy cách {m.capacity}{group?.base_unit}
                                                        </Select.Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} lg={14}>
                                    <Row gutter={[8, 8]} align="bottom">
                                        {sourceType === 'journey' && (
                                            <Col xs={24} sm={8} md={6}>
                                                <Form.Item name="is_partial" valuePropName="checked" label=" ">
                                                    <Button
                                                        type={Form.useWatch('is_partial', form) ? 'primary' : 'default'}
                                                        onClick={() => form.setFieldsValue({ is_partial: !form.getFieldValue('is_partial') })}
                                                        block
                                                    >
                                                        {Form.useWatch('is_partial', form) ? '📦 Hàng lẻ' : '📦 Nguyên'}
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        )}
                                        <Col xs={12} sm={8} md={sourceType === 'journey' && Form.useWatch('is_partial', form) ? 5 : 6}>
                                            {Form.useWatch('is_partial', form) ? (
                                                <Form.Item name="remaining_quantity" label="Lượng lẻ" rules={[{ required: true }]}>
                                                    <InputNumber min={0.1} style={{ width: '100%' }} placeholder="Kg/Lit" />
                                                </Form.Item>
                                            ) : (
                                                <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                                                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Thùng/Lon" />
                                                </Form.Item>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={8} md={6}>
                                            <Form.Item name="unit_cost" label="Đơn giá nhập">
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={8} md={6}>
                                            <Form.Item label="Thành tiền VNĐ">
                                                <InputNumber
                                                    disabled
                                                    value={
                                                        Form.useWatch('is_partial', form)
                                                            ? (Form.useWatch('remaining_quantity', form) || 0) * (Form.useWatch('unit_cost', form) || 0)
                                                            : (Form.useWatch('quantity', form) || 0) * (Form.useWatch('unit_cost', form) || 0)
                                                    }
                                                    style={{ width: '100%', background: '#f5f5f5', color: '#333', fontWeight: 'bold' }}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddItem} style={{ marginTop: 8 }}>
                                Thêm vào danh sách
                            </Button>
                        </Form>

                        <Divider style={{ margin: '24px 0' }} />

                        <Table
                            dataSource={selectedItems}
                            columns={itemColumns}
                            pagination={false}
                            size="small"
                            scroll={{ x: 'max-content' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={7}>
                    <Card title="Nguồn nhập" size="small">
                        <Form form={form} layout="vertical">
                            <Form.Item label="Hình thức">
                                <Radio.Group value={sourceType} onChange={e => setSourceType(e.target.value)} size={isMobile ? 'middle' : 'small'} style={{ width: '100%', textAlign: 'center' }}>
                                    <Radio.Button value="distributor" style={{ width: '50%' }}>Từ NPP</Radio.Button>
                                    <Radio.Button value="journey" style={{ width: '50%' }}>Hành trình</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            {sourceType === 'distributor' ? (
                                <Form.Item
                                    name="distributor_id"
                                    label="Nhà phân phối"
                                    rules={[{ required: true, message: 'Chọn NPP' }]}
                                >
                                    <Select placeholder="Chọn NPP" style={{ width: '100%' }} loading={loading}>
                                        {distributors.map(d => (
                                            <Select.Option key={d._id} value={d._id}>{d.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="journey_id"
                                    label="Hành trình / Công trình"
                                    rules={[{ required: true, message: 'Chọn công trình' }]}
                                >
                                    <Select placeholder="Chọn công trình" style={{ width: '100%' }} loading={loading} showSearch optionFilterProp="children">
                                        {journeys.map(j => (
                                            <Select.Option key={j._id} value={j._id}>
                                                [{j.journey_code}] {j.customer_name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item name="notes" label="Ghi chú">
                                <Input.TextArea rows={2} placeholder="Ghi chú..." />
                            </Form.Item>

                            <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
                                    <Text type="secondary">Tổng tiền:</Text>
                                    <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
                                        {selectedItems.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                                <Button type="primary" block size="large" icon={<SaveOutlined />} onClick={handleSubmit} style={{ minHeight: isMobile ? 48 : undefined }}>
                                    Hoàn tất
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card size="small" style={{ marginTop: '12px', background: '#fffbe6', border: '1px solid #ffe58f' }}>
                        <Space align="start">
                            <InfoCircleOutlined style={{ color: '#faad14', marginTop: '4px' }} />
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                Nhập lẻ: VD 2L từ thùng 10L, nhập 2 vào ô Lượng lẻ.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InboundForm;
