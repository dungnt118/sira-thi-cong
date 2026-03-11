import React, { useState } from 'react';
import {
    Card, Table, Tag, Button, Space, Typography, Row, Col,
    Modal, Form, Input, Select, Switch, Badge, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined, CopyOutlined, StarOutlined, StarFilled, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockJourneyTemplates } from '../../../data/journeyMockData';
import type { JourneyTemplate } from '../../../types/journey';

const { Text } = Typography;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    active: { label: 'Hoạt động', color: 'success' },
    draft: { label: 'Nháp', color: 'warning' },
    inactive: { label: 'Ngừng', color: 'default' },
};

const TemplateList: React.FC = () => {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [cloneTarget, setCloneTarget] = useState<JourneyTemplate | null>(null);
    const [createForm] = Form.useForm();
    const [cloneForm] = Form.useForm();
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    const filtered = mockJourneyTemplates.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

    const columns: ColumnsType<JourneyTemplate> = [
        {
            title: 'Mã / Tên Template',
            key: 'name',
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
            render: v => <Tag>{v}</Tag>,
        },
        {
            title: 'Số bước',
            key: 'steps',
            render: (_, t) => (
                <Badge count={t.steps.length} style={{ background: '#1976D2' }} showZero />
            ),
            align: 'center',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, t) => {
                const s = STATUS_CONFIG[t.status];
                return <Tag color={s.color}>{s.label}</Tag>;
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'desc',
            render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v || '—'}</Text>,
        },
        {
            title: '',
            key: 'actions',
            width: 160,
            render: (_, t) => (
                <Space size={4}>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pm/journeys/templates/${t.id}`)}>
                        Chi tiết
                    </Button>
                    <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => { setCloneTarget(t); cloneForm.setFieldsValue({ source_template: t.template_name }); setShowCloneModal(true); }}
                    >
                        Clone
                    </Button>
                    {!t.is_default && (
                        <Tooltip title="Đặt làm mặc định">
                            <Button size="small" icon={<StarOutlined />} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Template Hành trình</h2>
                    <Text type="secondary">Quản lý các template quy trình dịch vụ</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
                    Tạo Template
                </Button>
            </div>

            <Card>
                <Row style={{ marginBottom: 16 }} gutter={12}>
                    <Col>
                        <Select
                            style={{ width: 160 }}
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
                    <Col flex="auto" />
                    <Col>
                        <Text type="secondary" style={{ fontSize: 12 }}>{filtered.length} template</Text>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={false}
                    size="middle"
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
                    onFinish={() => { setShowCreateModal(false); createForm.resetFields(); }}>
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
                    onFinish={() => { setShowCloneModal(false); cloneForm.resetFields(); }}>
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
