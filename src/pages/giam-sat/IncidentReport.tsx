import {
    ArrowLeftOutlined,
    BoxPlotOutlined,
    CheckCircleOutlined,
    CloudOutlined,
    ExclamationCircleOutlined,
    MailOutlined,
    QuestionCircleOutlined,
    SendOutlined,
    ToolOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Modal,
    Select,
    Spin,
    Typography,
    message,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { incidentReportService } from '@/services/core-contracts/services/incidentReport.service';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import {
    ICreateIncidentReportInput,
    IncidentReportSeverityEnum2,
    IncidentReportTypeEnum2,
} from '@/services/core-contracts/types/incidentReport.types';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { useAuth } from '@/hooks/useAuth';
import { buildFilter } from '@/utils/filterBuilder';

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Wave 5 W5-03 — Báo cáo sự cố (Giám sát).
 * REWRITE: thay mock `mockProjects` bằng `journeyService.queryJourneysDto()`
 * filter theo journey hiện đang in_progress + assigned cho user.
 * Submit gọi `incidentReportService.createIncidentReport`.
 */

const INCIDENT_TYPES: Array<{ value: IncidentReportTypeEnum2; label: React.ReactNode }> = [
    { value: 'material_shortage', label: <span><BoxPlotOutlined /> Thiếu vật tư</span> },
    { value: 'technical', label: <span><ToolOutlined /> Sự cố kỹ thuật</span> },
    { value: 'weather', label: <span><CloudOutlined /> Thời tiết xấu</span> },
    { value: 'equipment', label: <span><ToolOutlined /> Hỏng thiết bị</span> },
    { value: 'safety', label: <span><WarningOutlined /> An toàn lao động</span> },
    { value: 'other', label: <span><QuestionCircleOutlined /> Khác</span> },
];

interface FormValues {
    journey_id: string;
    type: IncidentReportTypeEnum2;
    severity: IncidentReportSeverityEnum2;
    title: string;
    description: string;
}

const IncidentReport: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const [form] = Form.useForm<FormValues>();

    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [loadingJourneys, setLoadingJourneys] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sentModal, setSentModal] = useState(false);

    /* ─── Fetch eligible journeys ─────────────────────────── */

    const fetchJourneys = useCallback(async () => {
        setLoadingJourneys(true);
        try {
            const res = await journeyService.queryJourneysDto(buildFilter({
                sortBy: [{ id: 'createdAt', desc: true }],
                limit: 100,
            }));
            // Filter to active execution journeys only
            const all = res?.data || [];
            const active = all.filter(j => {
                const step = (j as any).current_step;
                return step === 'execution' || step === 'maintenance' || step === 'warranty';
            });
            setJourneys(active.length > 0 ? active : all);
        } catch (e) {
            message.error('Không tải được danh sách công trình.');
        } finally {
            setLoadingJourneys(false);
        }
    }, []);

    useEffect(() => { fetchJourneys(); }, [fetchJourneys]);

    /* ─── Pre-fill journey from query param ──────────────── */

    useEffect(() => {
        const j = searchParams.get('journey_id');
        if (j) form.setFieldsValue({ journey_id: j });
    }, [searchParams, form]);

    /* ─── Submit ─────────────────────────────────────────── */

    const handleSubmit = async (values: FormValues) => {
        setSubmitting(true);
        try {
            const journey = journeys.find(j => j._id === values.journey_id);
            const stepCode = (journey as any)?.current_step ?? 'execution';
            const input: ICreateIncidentReportInput = {
                journey_id: values.journey_id,
                journey_step_code: stepCode,
                type: values.type,
                severity: values.severity,
                title: values.title,
                description: values.description,
                status: 'open',
                priority: values.severity === 'urgent' ? 'high' : 'medium',
                is_resolved: false,
                reported_by: user?.username ?? user?.userName ?? user?._id,
            };
            await incidentReportService.createIncidentReport(input);
            setSentModal(true);
            form.resetFields();
        } catch (e: any) {
            message.error(e?.message || 'Không thể gửi báo cáo sự cố.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ─── Render ─────────────────────────────────────────── */

    const journeyOptions = journeys.map(j => ({
        value: j._id,
        label: `${j.journey_code ?? j._id.slice(-6)} – ${(j as any).name ?? (j as any).journey_name ?? j.customer_full_name ?? 'Công trình'}`,
    }));

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/admin/gs/dashboard')} />
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} /> Báo cáo Sự cố
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>Thông báo ngay cho PM</Text>
                </div>
            </div>

            <Alert
                message="Báo cáo ngay khi gặp sự cố. PM sẽ nhận thông báo qua hộp duyệt."
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginBottom: 16, borderRadius: 10 }}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ severity: 'normal' }}>
                <Card style={{ borderRadius: 12, marginBottom: 12 }}>
                    <Form.Item
                        name="journey_id"
                        label="Công trình *"
                        rules={[{ required: true, message: 'Vui lòng chọn công trình' }]}
                    >
                        <Select
                            placeholder={loadingJourneys ? 'Đang tải...' : 'Chọn công trình đang thi công'}
                            options={journeyOptions}
                            size="large"
                            loading={loadingJourneys}
                            showSearch
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            notFoundContent={loadingJourneys ? <Spin size="small" /> : 'Không có công trình nào'}
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại sự cố *"
                        rules={[{ required: true, message: 'Vui lòng chọn loại sự cố' }]}
                    >
                        <Select placeholder="Chọn loại sự cố" options={INCIDENT_TYPES} size="large" />
                    </Form.Item>

                    <Form.Item
                        name="severity"
                        label="Mức độ *"
                        rules={[{ required: true }]}
                    >
                        <Select size="large" options={[
                            { value: 'normal', label: <span><WarningOutlined /> Bình thường – Cần xử lý trong hôm nay</span> },
                            { value: 'urgent', label: <span><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Khẩn cấp – Cần xử lý ngay</span> },
                        ]} />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Tiêu đề *"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề ngắn' }]}
                    >
                        <Input
                            placeholder="VD: Hết BACPU lớp phủ tầng 3"
                            size="large"
                            maxLength={120}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả chi tiết *"
                        rules={[{ required: true, min: 10, message: 'Vui lòng mô tả ít nhất 10 ký tự' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết sự cố. VD: Hết BACPU lớp phủ, chỉ còn ~5kg không đủ cho lớp thứ 2 (cần ~20kg để hoàn thành tầng 3)"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </Card>

                <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    block
                    size="large"
                    loading={submitting}
                    icon={<SendOutlined />}
                    style={{ height: 50, borderRadius: 12, fontSize: 15 }}
                >
                    Gửi báo cáo sự cố ngay
                </Button>
            </Form>

            <Modal
                title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Đã gửi báo cáo sự cố</span>}
                open={sentModal}
                onCancel={() => { setSentModal(false); navigate('/admin/gs/dashboard'); }}
                footer={[
                    <Button key="another" onClick={() => setSentModal(false)}>Báo cáo khác</Button>,
                    <Button
                        key="ok"
                        type="primary"
                        onClick={() => { setSentModal(false); navigate('/admin/gs/dashboard'); }}
                    >
                        Về trang chủ
                    </Button>,
                ]}
                centered
            >
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 48, color: '#1890ff' }}><MailOutlined /></div>
                    <Text strong>PM đã nhận được thông báo</Text>
                    <br />
                    <Text type="secondary">Báo cáo đã được lưu vào hệ thống. PM sẽ phản hồi qua workflow.</Text>
                </div>
            </Modal>
        </div>
    );
};

export default IncidentReport;
