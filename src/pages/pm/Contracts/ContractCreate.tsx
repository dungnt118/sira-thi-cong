import React, { useState } from 'react';
import {
    Card, Form, Input, Select, DatePicker, Steps, Button, Row, Col,
    message, InputNumber, Upload, Space, Table, Typography, Grid, Divider,
} from 'antd';
import {
    ArrowLeftOutlined, SaveOutlined, FileTextOutlined,
    DollarOutlined, PlusOutlined, DeleteOutlined, UploadOutlined,
    SettingOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const steps = [
    { title: 'Thông tin HĐ', icon: <FileTextOutlined /> },
    { title: 'Phạm vi', icon: <SettingOutlined /> },
    { title: 'Thanh toán', icon: <DollarOutlined /> },
    { title: 'Tài liệu', icon: <UploadOutlined /> },
];

const mockCustomers = [
    { id: '1', name: 'Sunshine Group' },
    { id: '2', name: 'Vinhomes' },
    { id: '3', name: 'The Manor' },
    { id: '4', name: 'Landmark 81' },
];

interface PaymentMilestone {
    key: string;
    name: string;
    percentage: number;
    amount: number;
    dueDate: string;
    description: string;
}

const ContractCreate: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [milestones, setMilestones] = useState<PaymentMilestone[]>([
        { key: '1', name: 'Tạm ứng', percentage: 30, amount: 0, dueDate: '', description: 'Tạm ứng khi ký hợp đồng' },
        { key: '2', name: 'Nghiệm thu giai đoạn 1', percentage: 30, amount: 0, dueDate: '', description: '' },
        { key: '3', name: 'Thanh toán cuối', percentage: 40, amount: 0, dueDate: '', description: 'Thanh toán sau nghiệm thu hoàn công' },
    ]);

    const handleFinish = () => {
        message.success('Hợp đồng đã được tạo thành công!');
        navigate('/ql/contracts/all');
    };

    const handleSaveDraft = () => {
        message.info('Đã lưu bản nháp hợp đồng.');
    };

    const addMilestone = () => {
        setMilestones((prev) => [...prev, {
            key: Date.now().toString(),
            name: `Đợt ${prev.length + 1}`,
            percentage: 0,
            amount: 0,
            dueDate: '',
            description: '',
        }]);
    };

    const removeMilestone = (key: string) => {
        setMilestones((prev) => prev.filter((m) => m.key !== key));
    };

    // Step 0: Contract Info
    const renderStep0 = () => (
        <Card title={<Space><FileTextOutlined /> Thông Tin Hợp Đồng</Space>} bordered={false} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="contractCode" label="Mã hợp đồng" rules={[{ required: true }]}>
                        <Input placeholder="Tự động: HD-2025-XXX" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="contractName" label="Tên hợp đồng" rules={[{ required: true }]}>
                        <Input placeholder="VD: HĐ Sửa chữa tầng 5" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
                        <Select placeholder="Chọn khách hàng" showSearch>
                            {mockCustomers.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="contractType" label="Loại hợp đồng" rules={[{ required: true }]}>
                        <Select placeholder="Chọn loại">
                            <Option value="fixed">Trọn gói</Option>
                            <Option value="time_material">Theo thời gian vật tư</Option>
                            <Option value="maintenance">Bảo trì định kỳ</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="contractValue" label="Giá trị hợp đồng (VNĐ)" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(v) => v?.replace(/,/g, '') as unknown as number}
                            placeholder="1,500,000,000"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Form.Item name="signDate" label="Ngày ký" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    // Step 1: Scope of Work
    const renderStep1 = () => (
        <Card title={<Space><SettingOutlined /> Phạm Vi Công Việc</Space>} bordered={false} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
                <Col xs={24}>
                    <Form.Item name="scopeDescription" label="Mô tả phạm vi" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Mô tả chi tiết phạm vi công việc trong hợp đồng..." />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item name="deliverables" label="Bàn giao sản phẩm">
                        <TextArea rows={3} placeholder="Liệt kê các sản phẩm/kết quả cần bàn giao..." />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item name="exclusions" label="Ngoại trừ (không nằm trong HĐ)">
                        <TextArea rows={2} placeholder="Những hạng mục không nằm trong hợp đồng..." />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item name="warranty" label="Điều khoản bảo hành">
                        <TextArea rows={2} placeholder="VD: 12 tháng sau nghiệm thu..." />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    // Step 2: Payment Milestones
    const renderStep2 = () => {
        const milestoneColumns = [
            { title: 'Đợt thanh toán', dataIndex: 'name', key: 'name', render: (_: any, __: any, idx: number) => <Input defaultValue={milestones[idx]?.name} size="small" /> },
            { title: '% Giá trị', dataIndex: 'percentage', key: 'percentage', width: 100, render: (_: any, __: any, idx: number) => <InputNumber defaultValue={milestones[idx]?.percentage} min={0} max={100} size="small" style={{ width: '100%' }} suffix="%" /> },
            { title: 'Mô tả', dataIndex: 'description', key: 'description', render: (_: any, __: any, idx: number) => <Input defaultValue={milestones[idx]?.description} size="small" placeholder="Mô tả..." />, responsive: ['md' as const] },
            {
                title: '', key: 'action', width: 50,
                render: (_: any, record: PaymentMilestone) => (
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeMilestone(record.key)} />
                ),
            },
        ];

        const totalPercent = milestones.reduce((sum, m) => sum + m.percentage, 0);

        return (
            <Card
                title={<Space><DollarOutlined /> Mốc Thanh Toán</Space>}
                extra={<Button icon={<PlusOutlined />} onClick={addMilestone} size="small">Thêm đợt</Button>}
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Table
                    dataSource={milestones}
                    columns={milestoneColumns}
                    rowKey="key"
                    pagination={false}
                    scroll={{ x: 500 }}
                    footer={() => (
                        <div style={{ textAlign: 'right', fontWeight: 500, color: totalPercent === 100 ? '#52c41a' : '#ff4d4f' }}>
                            <CheckCircleOutlined /> Tổng: {totalPercent}% {totalPercent !== 100 && '(Phải bằng 100%)'}
                        </div>
                    )}
                />
            </Card>
        );
    };

    // Step 3: Attachments
    const renderStep3 = () => (
        <Card title={<Space><UploadOutlined /> Tài Liệu Đính Kèm</Space>} bordered={false} style={{ marginBottom: 24 }}>
            <Upload.Dragger multiple>
                <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 32, color: '#1890ff' }} /></p>
                <p className="ant-upload-text">Kéo thả hoặc bấm để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ PDF, Word, Excel, Hình ảnh. Tối đa 20MB mỗi file.</p>
            </Upload.Dragger>

            <Divider />

            <Card title="Cài Đặt Bổ Sung" size="small" style={{ marginTop: 16 }}>
                <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item name="penaltyClause" label="Điều khoản phạt">
                            <TextArea rows={2} placeholder="Mô tả điều khoản phạt chậm tiến độ..." />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="notes" label="Ghi chú">
                            <TextArea rows={2} placeholder="Ghi chú thêm..." />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Card>
    );

    const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

    return (
        <div>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        {!isMobile && 'Quay lại'}
                    </Button>
                    <Title level={4} style={{ margin: 0 }}>Tạo Hợp Đồng Mới</Title>
                </Space>
                <Space>
                    <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>
                        {!isMobile && 'Lưu nháp'}
                    </Button>
                </Space>
            </Row>

            <Steps
                current={currentStep}
                items={steps}
                style={{ marginBottom: 32 }}
                size={isMobile ? 'small' : 'default'}
                direction={isMobile ? 'vertical' : 'horizontal'}
            />

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                {stepRenderers[currentStep]()}

                <Row justify="space-between" style={{ marginTop: 16 }}>
                    <Button disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)}>
                        Quay lại
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button type="primary" onClick={() => setCurrentStep((s) => s + 1)}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                            Tạo hợp đồng
                        </Button>
                    )}
                </Row>
            </Form>
        </div>
    );
};

export default ContractCreate;
