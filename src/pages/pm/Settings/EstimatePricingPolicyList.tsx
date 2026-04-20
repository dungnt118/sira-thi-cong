import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, Row, Col, Popconfirm, message, Tag, Tabs, Divider, Switch, Popover } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, DollarOutlined, ExperimentOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import estimatePricingPolicyService from '../../../services/core-contracts/services/estimatePricingPolicy.service';
import masterDataItemService from '../../../services/core-contracts/services/masterDataItem.service';
import { IEstimatePricingPolicy } from '../../../services/core-contracts/types/estimatePricingPolicy.types';
import { IMasterDataItem } from '../../../services/core-contracts/types/masterDataItem.types';

const { Text, Title } = Typography;
const { Option } = Select;

/** Danh sách điều kiện kích hoạt kịch bản định sẵn */
const TRIGGER_KEY_OPTIONS = [
    {
        group: 'Địa điểm & Vùng',
        options: [
            { value: 'region_type', label: 'Loại khu vực (Nội/Ngoại thành)', hint: 'Phân biệt công trình ở nội thành hay ngoại tỉnh. Ví dụ: ngoại tỉnh thường cộng phụ phí vận chuyển và lưu trú.' },
            { value: 'province_code', label: 'Tỉnh/Thành phố', hint: 'Mã tỉnh thành cụ thể. Dùng khi chính sách giá khác nhau theo từng địa phương.' },
        ]
    },
    {
        group: 'Đặc điểm thi công',
        options: [
            { value: 'floor_level', label: 'Tầng thi công', hint: 'Số tầng của hạng mục thi công. Tầng càng cao → chi phí vận chuyển vật liệu, an toàn lao động càng tốn kém.' },
            { value: 'time_shift', label: 'Ca thi công (Ngày/Đêm)', hint: 'Xác định thi công ban ngày hay ban đêm. Ca đêm thường áp phụ phí nhân công 30–50%.' },
            { value: 'access_difficulty', label: 'Độ khó tiếp cận', hint: 'Mức độ khó đưa người và vật liệu vào công trình (hẻm nhỏ, không có thang máy, mặt bằng chật hẹp...). Thang: easy / medium / hard.' },
            { value: 'work_area_m2', label: 'Diện tích thi công (m²)', hint: 'Tổng diện tích thực tế cần thi công. Có thể dùng để áp ngưỡng: diện tích nhỏ (<30m²) thường có chi phí cố định cao hơn theo tỷ lệ.' },
        ]
    },
    {
        group: 'Loại dự án & Hợp đồng',
        options: [
            { value: 'project_type', label: 'Loại công trình', hint: 'Phân loại dự án: nhà ở / thương mại / công nghiệp / bảo trì. Mỗi loại có hệ số rủi ro và chi phí khác nhau.' },
            { value: 'contract_duration_days', label: 'Thời gian hợp đồng (ngày)', hint: 'Tổng số ngày thực hiện hợp đồng. Hợp đồng quá ngắn (rush job) hoặc quá dài (trải nhiều mùa) đều có thể cần điều chỉnh giá.' },
            { value: 'customer_type', label: 'Loại khách hàng', hint: 'Phân loại khách: cá nhân / doanh nghiệp / đối tác chiến lược. Dùng để áp chính sách giá ưu đãi hoặc premium.' },
        ]
    },
    {
        group: 'Vật liệu & Hậu cần',
        options: [
            { value: 'material_transport_km', label: 'Khoảng cách vận chuyển VL (km)', hint: 'Khoảng cách từ kho đến công trình. Vượt ngưỡng (vd: >50km) thường cần cộng phụ phí vận chuyển.' },
            { value: 'special_material', label: 'Vật liệu đặc chủng', hint: 'Kịch bản dùng vật liệu đặc biệt (nhập khẩu, khan hiếm...). Giá trị: true / false.' },
        ]
    },
];

/** Popover hướng dẫn cho tab Quy tắc kịch bản */
const ScenarioGuidePopover: React.FC = () => {
    const content = (
        <div style={{ maxWidth: 340 }}>
            <Text strong>Kịch bản điều chỉnh giá là gì?</Text>
            <Text type="secondary" style={{ display: 'block', marginTop: 4, marginBottom: 12 }}>
                Mỗi kịch bản định nghĩa một điều kiện đặc thù. Khi điều kiện đó xảy ra ở dự án thực tế, hệ thống tự động điều chỉnh giá/chi phí tương ứng.
            </Text>
            <Text strong>Ví dụ thực tế:</Text>
            <ul style={{ paddingLeft: 16, marginTop: 6, marginBottom: 12 }}>
                <li><Text><b>Tầng thi công ≥ 5</b> → Tăng 15% (chi phí vận chuyển VL lên cao)</Text></li>
                <li><Text><b>Ca thi công = Đêm</b> → Tăng 35% (phụ phí nhân công ca đêm)</Text></li>
                <li><Text><b>Loại khu vực = Ngoại tỉnh</b> → Tăng 20% (lưu trú + vận chuyển)</Text></li>
                <li><Text><b>Diện tích ≤ 30</b> → Tăng 10% (chi phí cố định trải trên DT nhỏ)</Text></li>
            </ul>
            <Text strong>Cách dùng:</Text>
            <ol style={{ paddingLeft: 16, marginTop: 6, marginBottom: 0 }}>
                <li>Chọn <b>Điều kiện</b> từ danh sách</li>
                <li>Chọn <b>Toán tử</b> so sánh (=, &gt;, &lt;)</li>
                <li>Nhập <b>Giá trị</b> ngưỡng kích hoạt</li>
                <li>Chọn <b>Loại ảnh hưởng</b> và <b>mức %</b></li>
            </ol>
        </div>
    );
    return (
        <Popover content={content} title={null} trigger="click" placement="bottomLeft" overlayStyle={{ maxWidth: 360 }}>
            <Button type="text" size="small" icon={<QuestionCircleOutlined />} style={{ color: '#1890ff', padding: '0 4px' }}>
                Hướng dẫn
            </Button>
        </Popover>
    );
};

/** Một dòng kịch bản điều chỉnh giá */
const ScenarioRuleCard: React.FC<{ fieldName: number; restField: any; onRemove: () => void }> = ({ fieldName, restField, onRemove }) => {
    const [selectedKey, setSelectedKey] = useState<string | undefined>();

    const allOptions = TRIGGER_KEY_OPTIONS.flatMap(g => g.options);
    const selectedOption = allOptions.find(o => o.value === selectedKey);

    // Gợi ý toán tử phù hợp theo loại điều kiện
    const numericTriggers = ['floor_level', 'work_area_m2', 'contract_duration_days', 'material_transport_km'];
    const isNumeric = selectedKey ? numericTriggers.includes(selectedKey) : false;

    return (
        <Card
            size="small"
            style={{ marginBottom: 12, borderColor: '#d9d9d9' }}
            extra={<Button type="link" danger size="small" onClick={onRemove}>Xóa</Button>}
        >
            <Row gutter={[8, 0]}>
                <Col xs={24} sm={14}>
                    <Form.Item
                        {...restField}
                        name={[fieldName, 'trigger_key']}
                        label={
                            <Space size={4}>
                                <span>Điều kiện kích hoạt</span>
                                {selectedOption && (
                                    <Popover
                                        content={<Text style={{ maxWidth: 260, display: 'block' }}>{selectedOption.hint}</Text>}
                                        title={selectedOption.label}
                                        trigger="hover"
                                        placement="right"
                                    >
                                        <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
                                    </Popover>
                                )}
                            </Space>
                        }
                        rules={[{ required: true, message: 'Chọn điều kiện kích hoạt' }]}
                    >
                        <Select
                            placeholder="Chọn điều kiện..."
                            showSearch
                            optionFilterProp="label"
                            onChange={(val) => setSelectedKey(val)}
                        >
                            {TRIGGER_KEY_OPTIONS.map(group => (
                                <Select.OptGroup key={group.group} label={group.group}>
                                    {group.options.map(opt => (
                                        <Option key={opt.value} value={opt.value} label={opt.label}>
                                            {opt.label}
                                        </Option>
                                    ))}
                                </Select.OptGroup>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={8} sm={4}>
                    <Form.Item {...restField} name={[fieldName, 'operator']} label="So sánh" initialValue="==">
                        <Select>
                            <Option value="==">= Bằng</Option>
                            {isNumeric && <Option value=">">{'>'} Lớn hơn</Option>}
                            {isNumeric && <Option value="<">{'<'} Nhỏ hơn</Option>}
                            {isNumeric && <Option value=">=">≥ Lớn hơn hoặc bằng</Option>}
                            {isNumeric && <Option value="<=">≤ Nhỏ hơn hoặc bằng</Option>}
                            {!isNumeric && <Option value="!=">≠ Khác</Option>}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={16} sm={6}>
                    <Form.Item
                        {...restField}
                        name={[fieldName, 'compare_value']}
                        label="Giá trị ngưỡng"
                        rules={[{ required: true, message: 'Nhập giá trị' }]}
                    >
                        {isNumeric
                            ? <InputNumber style={{ width: '100%' }} placeholder="vd: 5" />
                            : <Input placeholder={selectedKey === 'time_shift' ? 'night / day' : selectedKey === 'region_type' ? 'provincial / urban' : selectedKey === 'customer_type' ? 'individual / enterprise' : 'Nhập giá trị'} />
                        }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col xs={24} sm={9}>
                    <Form.Item {...restField} name={[fieldName, 'effect_type']} label="Loại điều chỉnh" rules={[{ required: true }]}>
                        <Select>
                            <Option value="increase_pct">📈 Tăng (%)</Option>
                            <Option value="decrease_pct">📉 Giảm (%)</Option>
                            <Option value="warning_only">⚠️ Cảnh báo</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                    <Form.Item
                        {...restField}
                        name={[fieldName, 'effect_value']}
                        label="Mức điều chỉnh (%)"
                        rules={[{ required: true, message: 'Nhập mức %' }]}
                    >
                        <InputNumber min={0} max={200} style={{ width: '100%' }} placeholder="vd: 15" suffix="%" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={9}>
                    <Form.Item {...restField} name={[fieldName, 'note']} label="Ghi chú giải trình">
                        <Input placeholder="vd: Phụ phí thi công ngoại tỉnh" />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export const EstimatePricingPolicyList: React.FC = () => {
    const [policies, setPolicies] = useState<IEstimatePricingPolicy[]>([]);
    const [loading, setLoading] = useState(false);
    const [serviceTypes, setServiceTypes] = useState<IMasterDataItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<IEstimatePricingPolicy | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const fetchPolicies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await estimatePricingPolicyService.queryContent();
            setPolicies(res.data || []);
        } catch (error) {
            console.error('Fetch policies error:', error);
            message.error('Không thể tải danh sách chính sách tính giá');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchServiceTypes = useCallback(async () => {
        try {
            const res = await masterDataItemService.queryContent({
                group: {
                    op: 'AND',
                    children: [{ id: 'category', operation: '==', value: 'service_type' }]
                } as any
            });
            setServiceTypes(res.data || []);
        } catch (error) {
            console.error('Fetch service types error:', error);
        }
    }, []);

    useEffect(() => {
        fetchPolicies();
        fetchServiceTypes();
    }, [fetchPolicies, fetchServiceTypes]);

    const handleOpenModal = (record?: IEstimatePricingPolicy) => {
        if (record) {
            setEditingPolicy(record);
            form.setFieldsValue({
                ...record,
                // Ensure nested objects exist to avoid undefined errors in form
                quote_suggestion_rule: record.quote_suggestion_rule || {},
                labor_policy: record.labor_policy || {},
                profit_policy: record.profit_policy || {},
            });
        } else {
            setEditingPolicy(null);
            form.resetFields();
            form.setFieldsValue({
                status: 'active',
                is_default: false,
                quote_suggestion_rule: { pricing_strategy: 'rate_factor' },
                profit_policy: { target_profit_pct_min: 20, target_profit_pct_max: 30, warning_threshold_pct: 15 }
            });
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await estimatePricingPolicyService.deleteEstimatePricingPolicy(id);
            message.success('Đã xóa chính sách');
            fetchPolicies();
        } catch (error) {
            message.error('Không thể xóa chính sách');
        }
    };

    const handleFinish = async (values: any) => {
        setSubmitting(true);
        try {
            if (editingPolicy) {
                await estimatePricingPolicyService.updateEstimatePricingPolicy(editingPolicy._id, values);
                message.success('Cập nhật chính sách thành công');
            } else {
                await estimatePricingPolicyService.createEstimatePricingPolicy(values);
                message.success('Thêm mới chính sách thành công');
            }
            setIsModalVisible(false);
            fetchPolicies();
        } catch (error: any) {
            message.error(error.message || 'Thao tác thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { title: 'Mã', dataIndex: 'code', key: 'code', width: 120 },
        { title: 'Tên Chính sách', dataIndex: 'name', key: 'name' },
        { 
            title: 'Loại dịch vụ', 
            dataIndex: 'service_type_id', 
            key: 'service_type_id',
            render: (id: string) => serviceTypes.find(s => s._id === id)?.label || id
        },
        { 
            title: 'Mặc định', 
            dataIndex: 'is_default', 
            key: 'is_default',
            render: (val: boolean) => val ? <Tag color="blue">Mặc định</Tag> : null
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => status === 'active' ? <Tag color="success">Hoạt động</Tag> : <Tag color="default">Ngừng</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_: any, record: IEstimatePricingPolicy) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Popconfirm title="Xóa chính sách này?" onConfirm={() => handleDelete(record._id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card title="Chính sách Tính giá & Lợi nhuận" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Tạo Chính Sách Mới</Button>
        } className="pm-card">
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Định nghĩa các quy tắc tính giá chào thầu, định mức lợi nhuận và hoa hồng nhân sự để hệ thống tự động hóa công tác lập dự toán.</Text>
            </div>
            <Table 
                columns={columns} 
                dataSource={policies} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 15 }} 
            />

            <Modal
                title={editingPolicy ? "Cấu hình Chính sách" : "Thêm Chính sách Tính giá"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={submitting}
                width="min(740px, 96vw)"
                style={{ top: 20 }}
            >
                <Form form={form} layout="vertical" name="pricing_policy_form" onFinish={handleFinish}>
                    <Tabs defaultActiveKey="basic">
                        <Tabs.TabPane tab={<span><SettingOutlined /> Thông tin chung</span>} key="basic">
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Mã Chính sách" name="code" rules={[{ required: true }]}>
                                        <Input placeholder="vd: PP-2026-01" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={16}>
                                    <Form.Item label="Tên Chính sách" name="name" rules={[{ required: true }]}>
                                        <Input placeholder="vd: Chính sách chuẩn 2026" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Loại dịch vụ" name="service_type_id" rules={[{ required: true }]}>
                                        <Select placeholder="Chọn dịch vụ...">
                                            {serviceTypes.map(s => <Option key={s._id} value={s._id}>{s.label}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Phân loại Quy mô" name="scale_type">
                                        <Select>
                                            <Option value="small">Nhỏ (Dưới 100m²)</Option>
                                            <Option value="medium">Vừa (100 - 500m²)</Option>
                                            <Option value="large">Lớn (Trên 500m²)</Option>
                                            <Option value="custom">Tùy biến</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Item label="Trạng thái" name="status">
                                        <Select>
                                            <Option value="active">Hoạt động</Option>
                                            <Option value="inactive">Tắt</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 0]}>
                                <Col xs={24}>
                                    <Form.Item label="Ghi chú" name="note">
                                        <Input.TextArea rows={2} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Đặt làm mặc định" name="is_default" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab={<span><DollarOutlined /> Quy tắc Chào thầu</span>} key="quote">
                            <Title level={5}>Gợi ý đơn giá chào thầu (m²)</Title>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Chiến lược tính" name={['quote_suggestion_rule', 'pricing_strategy']}>
                                        <Select>
                                            <Option value="rate_factor">Dựa trên Hệ số (%)</Option>
                                            <Option value="banded_rate">Dựa trên Khung diện tích</Option>
                                            <Option value="manual_formula">Công thức tùy biến</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Đơn giá m² cơ sở" name={['quote_suggestion_rule', 'base_quote_rate_m2']}>
                                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Sàn chào thầu tối thiểu" name={['quote_suggestion_rule', 'min_quote_floor']}>
                                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Hệ số Quy mô" name={['quote_suggestion_rule', 'scale_factor']}>
                                        <InputNumber step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Hệ số Phức tạp" name={['quote_suggestion_rule', 'complexity_factor']}>
                                        <InputNumber step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Hệ số Tiến độ" name={['quote_suggestion_rule', 'duration_factor']}>
                                        <InputNumber step={0.01} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab={<span><DollarOutlined /> Lợi nhuận & Hoa hồng</span>} key="profit">
                            <Title level={5}>Chính sách Lợi nhuận Gộp</Title>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Lợi nhuận mục tiêu Min (%)" name={['profit_policy', 'target_profit_pct_min']}>
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Lợi nhuận mục tiêu Max (%)" name={['profit_policy', 'target_profit_pct_max']}>
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Ngưỡng cảnh báo (%)" name={['profit_policy', 'warning_threshold_pct']}>
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Title level={5}>Chính sách Nhân công & Hoa hồng</Title>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Lương nội bộ TB/tháng" name={['labor_policy', 'internal_salary_monthly']}>
                                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Commission Kỹ thuật (%)" name={['labor_policy', 'technical_commission_pct']}>
                                        <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item label="Commission Giám sát (%)" name={['labor_policy', 'supervisor_commission_pct']}>
                                        <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab={<span><ExperimentOutlined /> Quy tắc kịch bản</span>} key="scenario">
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text type="secondary" style={{ flex: 1, marginRight: 8 }}>
                                    Điều chỉnh giá/chi phí tự động khi điều kiện đặc thù xảy ra (thi công đêm, ngoại tỉnh, tầng cao...).
                                </Text>
                                <ScenarioGuidePopover />
                            </div>
                            <Form.List name="scenario_rules">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <ScenarioRuleCard key={key} fieldName={name} restField={restField} onRemove={() => remove(name)} />
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm kịch bản điều chỉnh
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Tabs.TabPane>
                    </Tabs>
                </Form>
            </Modal>
        </Card>
    );
};

export default EstimatePricingPolicyList;
