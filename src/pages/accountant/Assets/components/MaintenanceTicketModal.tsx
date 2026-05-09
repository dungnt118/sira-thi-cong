import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message, Row, Col, Grid } from 'antd';
import { assetMaintenanceTicketService } from '../../../../services/core-contracts/services/assetMaintenanceTicket.service';
import type { ICreateAssetMaintenanceTicketInput, AssetMaintenanceTicketStatusEnum } from '../../../../services/core-contracts/types/assetMaintenanceTicket.types';
import dayjs from 'dayjs';

const { Option } = Select;
const { useBreakpoint } = Grid;

interface MaintenanceTicketModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: any;
    assetId?: string;
}

const STATUS_OPTIONS: { value: AssetMaintenanceTicketStatusEnum, label: string }[] = [
    { value: 'planned', label: 'Lên kế hoạch' },
    { value: 'in_progress', label: 'Đang bảo trì' },
    { value: 'completed', label: 'Hoàn tất' },
    { value: 'cancelled', label: 'Đã hủy' }
];

const MaintenanceTicketModal: React.FC<MaintenanceTicketModalProps> = ({ 
    open, onCancel, onSuccess, initialValues, assetId 
}) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    maintenance_date: initialValues.maintenance_date ? dayjs(initialValues.maintenance_date) : null,
                    completed_at: initialValues.completed_at ? dayjs(initialValues.completed_at) : null
                });
            } else if (assetId) {
                form.setFieldsValue({ asset_id: assetId, status: 'planned', maintenance_date: dayjs() });
            }
        }
    }, [open, initialValues, assetId]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload: ICreateAssetMaintenanceTicketInput = {
                ...values,
                maintenance_date: values.maintenance_date?.toISOString(),
                completed_at: values.completed_at?.toISOString()
            };

            if (initialValues?._id) {
                await assetMaintenanceTicketService.updateAssetMaintenanceTicket(initialValues._id, payload);
                message.success('Cập nhật phiếu bảo trì thành công');
            } else {
                await assetMaintenanceTicketService.createAssetMaintenanceTicket(payload);
                message.success('Tạo phiếu bảo trì thành công');
            }
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi lưu phiếu bảo trì:', error);
            message.error('Không thể lưu phiếu bảo trì');
        }
    };

    return (
        <Modal
            title={initialValues ? "Cập nhật Phiếu Bảo trì" : "Tạo Phiếu Bảo trì mới"}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            width={isMobile ? 'calc(100vw - 24px)' : 600}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item name="asset_id" label="ID Tài sản" hidden>
                    <Input />
                </Form.Item>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="code" label="Mã phiếu bảo trì">
                            <Input placeholder="Tự động nếu để trống" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                            <Select>
                                {STATUS_OPTIONS.map(opt => (
                                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="maintenance_date" label="Ngày bảo trì" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="cost_amount" label="Chi phí dự kiến/thực tế (đ)">
                            <InputNumber 
                                style={{ width: '100%' }} 
                                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={v => v!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="maintenance_partner_id" label="Đối tác bảo trì (Partner ID)">
                    <Input placeholder="Nhập mã đối tác hoặc tên đơn vị" />
                </Form.Item>

                <Form.Item name="notes" label="Ghi chú về tình trạng hư hỏng / nội dung sửa chữa">
                    <Input.TextArea rows={4} placeholder="Mô tả chi tiết tình trạng..." />
                </Form.Item>
                
                {form.getFieldValue('status') === 'completed' && (
                    <Form.Item name="completed_at" label="Ngày hoàn tất thực tế">
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default MaintenanceTicketModal;
