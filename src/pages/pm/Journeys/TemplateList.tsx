import React, { useState } from 'react';
import {
    Card, Table, Tag, Button, Space, Typography, Row, Col,
    Modal, Form, Input, Select, Switch, Badge, Tooltip, Popconfirm, Grid, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, CopyOutlined, StarFilled, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockJourneyTemplates as defaultTemplates } from '../../../data/journeyMockData';
import type { JourneyTemplate } from '../../../types/journey';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    active: { label: 'Hoạt động', color: 'success' },
    draft: { label: 'Nháp', color: 'warning' },
    inactive: { label: 'Ngừng', color: 'default' },
};

const TemplateList: React.FC = () => {
    const navigate = useNavigate();
    const [mockJourneyTemplates, setMockJourneyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, defaultTemplates);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [_cloneTarget, setCloneTarget] = useState<JourneyTemplate | null>(null);
    const [createForm] = Form.useForm();
    const [cloneForm] = Form.useForm();
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const filtered = mockJourneyTemplates.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

    const columns: ColumnsType<JourneyTemplate> = [
        {
            title: 'Mã / Tên Template',
            key: 'name',
            fixed: (isMobile ? 'left' : undefined) as 'left' | 'right' | undefined,
            width: isMobile ? 180 : undefined,
            render: (_, t) => (
                <div>
                    <Space>
                        <Text strong style={{ color: '#1976D2', cursor: 'pointer' }}
                            onClick={() => navigate(`/pm/journeys/templates/${t.id}`)}>
                            {t.template_name}
                        </Text>
                        {t.is_default && <Tooltip title="Mặc định"><StarFilled style={{ color: '#fa8c16' }} /></Tooltip>}
                    </Space>
                    <div><Text type="secondary" style={{ fontSize: 11 }}>{t.template_code} · {t.version_label}</Text></div>
                </div>
            ),
        },
        {
            title: 'Loại dịch vụ',
            dataIndex: 'service_type',
            key: 'service',
            width: 120,
            render: v => <Tag>{v}</Tag>,
        },
        {
            title: 'Số bước',
            key: 'steps',
            width: 80,
            responsive: ['sm'],
            render: (_, t) => (
                <Badge count={t.steps.length} style={{ background: '#1976D2' }} showZero />
            ),
            align: 'center',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 100,
            render: (_, t) => {
                const s = STATUS_CONFIG[t.status];
                return <Tag color={s.color}>{s.label}</Tag>;
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'desc',
            responsive: ['lg'],
            render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v || '—'}</Text>,
        },
        {
            title: '',
            key: 'actions',
            width: isMobile ? 120 : 160,
            fixed: 'right',
            render: (_, t) => (
                <Space size={4}>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pm/journeys/templates/${t.id}`)} />
                    <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => { setCloneTarget(t); cloneForm.setFieldsValue({ source_template: t.template_name }); setShowCloneModal(true); }}
                    />
                    <Popconfirm title="Đặt làm quy trình chuẩn?">
                        <Switch size="small" checked={t.is_default} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                marginBottom: isMobile ? 16 : 24,
                gap: 12
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }}>Template Hành trình</h2>
                    <Text type="secondary">Quản lý các template quy trình dịch vụ</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setShowCreateModal(true)}
                    block={isMobile}
                >
                    Tạo Template
                </Button>
            </div>

            <Card bodyStyle={{ padding: isMobile ? 8 : 24 }}>
                <Row style={{ marginBottom: 16 }} gutter={[8, 8]} align="middle">
                    <Col xs={24} sm={12}>
                        <Select
                            style={{ width: '100%', maxWidth: 160 }}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={[
                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                { value: 'active', label: 'Hoạt động' },
                                { value: 'draft', label: 'Nháp' },
                                { value: 'inactive', label: 'Ngừng' },
                            ]}
                        />
                    </Col>
                    <Col sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{filtered.length} template</Text>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={false}
                    size={isMobile ? 'small' : 'middle'}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Create Template Modal */}
            <Modal
                title="Tạo Template mới"
                open={showCreateModal}
                onCancel={() => { setShowCreateModal(false); createForm.resetFields(); }}
                onOk={() => createForm.submit()}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form form={createForm} layout="vertical"
                    onFinish={(values) => { 
                    const newId = `TPL-NEW-${Date.now()}`;
                    const newTpl: JourneyTemplate = {
                        id: newId,
                        ...values,
                        status: 'active',
                        updated_at: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        steps: [],
                    };
                    setMockJourneyTemplates([...mockJourneyTemplates, newTpl]);
                    setShowCreateModal(false); 
                    createForm.resetFields();
                    message.success('Đã tạo template mới. Đang chuyển đến trang thiết kế bước...');
                    setTimeout(() => {
                        navigate(`/pm/journeys/templates/${newId}`);
                    }, 800);
                }}>
                    <Form.Item label="Mã template" name="template_code" rules={[{ required: true }]}>
                        <Input placeholder="VD: TMPL-CT-004" />
                    </Form.Item>
                    <Form.Item label="Tên template" name="template_name" rules={[{ required: true }]}>
                        <Input placeholder="VD: Chống thấm cao cấp" />
                    </Form.Item>
                    <Form.Item label="Loại dịch vụ" name="service_type" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'Chống thấm', label: 'Chống thấm' },
                            { value: 'Sơn', label: 'Sơn' },
                            { value: 'Chống thấm + Sơn', label: 'Chống thấm + Sơn' },
                        ]} />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Phiên bản" name="version_label" rules={[{ required: true }]}>
                                <Input placeholder="v1.0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Mặc định" name="is_default" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Clone Template Modal */}
            <Modal
                title="Clone Template"
                open={showCloneModal}
                onCancel={() => { setShowCloneModal(false); cloneForm.resetFields(); }}
                onOk={() => cloneForm.submit()}
                okText="Clone"
                cancelText="Hủy"
            >
                <Form form={cloneForm} layout="vertical"
                    onFinish={(values) => { 
                    if (!_cloneTarget) return;
                    const newId = `TPL-CLONE-${Date.now()}`;
                    const newTpl: JourneyTemplate = {
                        ..._cloneTarget,
                        id: newId,
                        template_code: values.new_template_code,
                        template_name: values.new_template_name,
                        status: 'draft',
                        updated_at: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        is_default: false,
                    };
                    setMockJourneyTemplates([...mockJourneyTemplates, newTpl]);
                    setShowCloneModal(false); 
                    cloneForm.resetFields(); 
                    message.success('Đã clone template thành công');
                    setTimeout(() => {
                        navigate(`/pm/journeys/templates/${newId}`);
                    }, 800);
                }}>
                    <Form.Item label="Template nguồn" name="source_template">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Mã mới" name="new_template_code" rules={[{ required: true }]}>
                        <Input placeholder="VD: TMPL-CT-005" />
                    </Form.Item>
                    <Form.Item label="Tên mới" name="new_template_name" rules={[{ required: true }]}>
                        <Input placeholder="Tên template mới..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TemplateList;
