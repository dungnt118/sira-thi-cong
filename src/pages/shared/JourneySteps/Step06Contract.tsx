import React, { useState } from 'react';
import { Card, Form, Input, Button, Result, Space, Divider, Typography, Tag, Descriptions, Row, Col, InputNumber } from 'antd';
import { SaveOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { mockContracts } from '../../../data/journeyMockData';
import { FilePdfOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

export interface Step06ContractProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step06Contract: React.FC<Step06ContractProps> = ({ journeyId, isEditable = false, onSave, onEditStateChange }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const contract = mockContracts.find(c => c.journey_id === journeyId);
    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
        setIsEditing(false);
        if (onEditStateChange) onEditStateChange(false);
    };

    const renderReadOnly = () => {
        if (!contract) {
            return (
                <Result
                    status="info"
                    title="Hợp đồng chưa được khởi tạo"
                    subTitle="Vui lòng đợi bộ phận Pháp chế / Sale soạn thảo hợp đồng dựa trên báo giá đã duyệt."
                />
            );
        }

        return (
            <div style={{ padding: '0 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <Title level={4} style={{ margin: '0 0 4px 0' }}>Số HĐ: {contract.contract_no}</Title>
                        <Space>
                            <Tag color={contract.status === 'signed' ? 'success' : 'processing'} icon={contract.status === 'signed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                                {contract.status === 'signed' ? 'Đã ký kết' : 'Đang trình ký'}
                            </Tag>
                            <Text type="secondary">Ngày ký: {contract.sign_date}</Text>
                        </Space>
                    </div>
                    <Button icon={<FilePdfOutlined />} type="dashed">Xem bản PDF</Button>
                </div>

                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Giá trị hợp đồng" span={2}>
                        <Text strong type="danger">{formatVND(contract.value)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đại diện KH">Khách hàng (Chủ đầu tư)</Descriptions.Item>
                    <Descriptions.Item label="Đại diện BAC">Giám đốc chi nhánh</Descriptions.Item>
                    <Descriptions.Item label="Thời hạn thực hiện"> Theo tiến độ thi công</Descriptions.Item>
                    <Descriptions.Item label="Hình thức thanh toán"> Chuyển khoản / Tiền mặt</Descriptions.Item>
                </Descriptions>

                <Divider />
                <div style={{ textAlign: 'center', background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
                    <Text italic>Hợp đồng điện tử đã được xác thực qua hệ thống PrimeSign.</Text>
                </div>
            </div>
        );
    };

    const renderEditable = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
                contract_no: contract?.contract_no,
                sign_date: contract?.sign_date,
                value: contract?.value,
                notes: ''
            }}
        >
            <Divider orientation="left">Điều chỉnh thông tin hợp đồng</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Số hợp đồng" name="contract_no" rules={[{ required: true }]}>
                        <Input placeholder="VD: BAC-2026-001" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Ngày ký" name="sign_date" rules={[{ required: true }]}>
                        <Input placeholder="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Giá trị hợp đồng (VNĐ)" name="value" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Ghi chú bổ sung" name="notes">
                <TextArea rows={4} placeholder="Nhập ghi chú hoặc kết quả thực hiện của công việc này..." />
            </Form.Item>
            <Space style={{ marginTop: 16 }}>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu & Cập nhật</Button>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
            </Space>
        </Form>
    );

    return (
        <Card
            title={isEditing ? "Thực hiện: Ký kết hợp đồng" : "Chi tiết bước: Ký kết hợp đồng"}
            variant="borderless"
            className="ky-card"
            extra={isEditable && (
                <Button
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const newEdit = !isEditing;
                        setIsEditing(newEdit);
                        if (onEditStateChange) onEditStateChange(newEdit);
                    }}
                >
                    {isEditing ? "Xem lại" : "Cập nhật"}
                </Button>
            )}
        >
            {!isEditable && (
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Bạn đang ở chế độ Chỉ đọc (Chưa có quyền KeyRole hoặc chưa được phân công).</Text>
                </div>
            )}
            {isEditing ? renderEditable() : renderReadOnly()}
        </Card>
    );
};

export default Step06Contract;

