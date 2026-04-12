import React, { useState, useEffect, useMemo } from 'react';
import {
    Card, Form, Input, Button, Result, Space, Divider,
    Typography, Progress, Timeline, Image, Row, Col,
    Alert, InputNumber, App, Spin, Empty, Avatar, Tag
} from 'antd';
import {
    SaveOutlined, EditOutlined, EyeOutlined, RocketOutlined,
    BuildOutlined, CheckCircleOutlined, PictureOutlined,
    LoadingOutlined, UserOutlined, PlusOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

import { siteReportService } from '../../../services/core-contracts/services/siteReport.service';
import { ISiteReport } from '../../../services/core-contracts/types/siteReport.types';
import { UploadFiles } from '../../../components/files/UploadFiles';
import { getFileLink } from '@/services/storeService';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

export interface Step08ConstructProps {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
    onEditStateChange?: (isEditing: boolean) => void;
}

export const Step08Construct: React.FC<Step08ConstructProps> = ({
    journeyId,
    isEditable = false,
    onSave,
    onEditStateChange
}) => {
    const { isAdmin } = useAuth();
    const { message, notification } = App.useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [reports, setReports] = useState<ISiteReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const reportTaskId = searchParams.get('reportTaskId') || '';

    const visibleReports = useMemo(
        () => (reportTaskId ? reports.filter((report) => report.worktaskId === reportTaskId) : reports),
        [reports, reportTaskId]
    );
    const latestReport = visibleReports.length > 0 ? visibleReports[visibleReports.length - 1] : null;
    const lastProgress = Number(latestReport?.progress_pct) || 0;

    // Sync form values when entering edit mode - Top level hook
    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({ progress: lastProgress });
        }
    }, [isEditing, lastProgress, form]);

    const fetchReports = async () => {
        if (!journeyId) return;
        setIsLoading(true);
        try {
            const response = await siteReportService.querySiteReportsDto({
                group: {
                    id: 'journey_id',
                    operation: 'eq',
                    value: journeyId,
                    children: [],
                    propType: 'OBJECTID' as any
                },
                sorted: [{ id: 'createdAt', desc: false }]
            });
            setReports(response.data || []);
        } catch (error) {
            console.error('Failed to fetch site reports:', error);
            message.error('Không thể tải nhật ký thi công');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [journeyId]);

    const handleFinish = async (values: any) => {
        if (!journeyId) return;
        setIsSubmitting(true);
        try {
            const response = await siteReportService.createSiteReport({
                journey_id: journeyId,
                journey_step_code: 'execution',
                content: values.notes,
                progress_pct: Number(values.progress),
                title: `Nhật ký ngày ${new Date().toLocaleDateString('vi-VN')}`,
                medias: values.medias || []
            });

            if (response) {
                message.success('Đã lưu nhật ký mới thành công');
                setIsEditing(false);
                if (onEditStateChange) onEditStateChange(false);
                form.resetFields();
                await fetchReports();
                if (onSave) onSave(values);
            } else {
                throw new Error('Không nhận được phản hồi từ hệ thống');
            }
        } catch (error: any) {
            console.error('Failed to save site report:', error);
            notification.error({
                message: 'Lỗi lưu nhật ký',
                description: error?.message || 'Không thể kết nối đến máy chủ hoặc dữ liệu không hợp lệ.',
                placement: 'top'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Memoize timeline items for performance and safety
    const timelineItems = useMemo(() => {
        try {
            if (!visibleReports || visibleReports.length === 0) return [];

            return visibleReports.slice().reverse().map((report, idx) => {
                if (!report) return null;

                const reportId = typeof report._id === 'string' ? report._id : `report-${idx}-${Math.random()}`;
                const dateObj = report.createdAt ? new Date(report.createdAt) : null;
                const isValidDate = dateObj && !isNaN(dateObj.getTime());
                const dateStr = isValidDate ? dateObj.toLocaleDateString('vi-VN') : 'N/A';
                const timeStr = isValidDate ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

                // Extra defensive handling for complex fields
                const creator = (report.createdBy && typeof report.createdBy === 'object') ? report.createdBy : null;
                const creatorTitle = creator?.title || (typeof report.createdBy === 'string' ? report.createdBy : 'Thành viên BAC');
                const progress = typeof report.progress_pct === 'number' ? report.progress_pct : (Number(report.progress_pct) || 0);

                return {
                    key: String(reportId),
                    label: (
                        <div style={{ textAlign: 'right', paddingRight: 8 }}>
                            <Text strong>{dateStr}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>{timeStr}</Text>
                        </div>
                    ),
                    color: progress >= 100 ? 'green' : 'blue',
                    children: (
                        <Card
                            size="small"
                            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16 }}
                            title={
                                <Space>
                                    <Avatar
                                        size="small"
                                        icon={<UserOutlined />}
                                        src={typeof creator?.avatar === 'string' ? getFileLink(creator.avatar) : undefined}
                                    />
                                    <Text strong>{String(creatorTitle)}</Text>
                                    <Tag color="cyan">{progress}%</Tag>
                                </Space>
                            }
                        >
                            <div style={{ padding: '4px 0' }}>
                                <Paragraph style={{ margin: 0 }}>{String(report.content || 'Không có nội dung')}</Paragraph>
                            </div>

                            {report.medias && Array.isArray(report.medias) && report.medias.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <Space wrap>
                                        {report.medias.filter(Boolean).map((img: any, i: number) => {
                                            const imgSrc = getFileLink(img.file_path || img.url || img);
                                            if (!imgSrc) return null;
                                            return (
                                                <Image
                                                    key={`img-${i}`}
                                                    width={80}
                                                    height={60}
                                                    src={imgSrc}
                                                    fallback="https://via.placeholder.com/80x60?text=No+Image"
                                                    style={{ borderRadius: 4, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                                                />
                                            );
                                        })}
                                    </Space>
                                </div>
                            )}
                        </Card>
                    )
                };
            }).filter(Boolean);
        } catch (err) {
            console.error("Timeline render process error:", err);
            return [];
        }
    }, [visibleReports]);

    const overallProgress = Number(latestReport?.progress_pct) || 0;

    const renderReadOnly = () => {
        if (isLoading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải nhật ký..." />
                </div>
            );
        }

        if (visibleReports.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span>
                            {reportTaskId ? 'Chưa có nhật ký nào gắn với công việc này.' : 'Chưa có nhật ký thi công nào được ghi nhận.'} <br />
                            {!reportTaskId ? 'Quá trình thi công sẽ bắt đầu sau khi tạm ứng được xác nhận.' : null}
                        </span>
                    }
                >
                    {reportTaskId && (
                        <Button
                            style={{ marginRight: 8 }}
                            onClick={() => {
                                const nextParams = new URLSearchParams(searchParams);
                                nextParams.delete('reportTaskId');
                                setSearchParams(nextParams);
                            }}
                        >
                            Xem toàn bộ nhật ký
                        </Button>
                    )}
                    {isEditable && (
                        <Button type="primary" onClick={() => {
                            setIsEditing(true);
                            if (onEditStateChange) onEditStateChange(true);
                        }}>Bắt đầu nhật ký đầu tiên</Button>
                    )}
                </Empty>
            );
        }

        return (
            <div style={{ padding: '0 12px' }}>
                {reportTaskId ? (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message="Đang lọc nhật ký theo công việc"
                        action={
                            <Button
                                size="small"
                                onClick={() => {
                                    const nextParams = new URLSearchParams(searchParams);
                                    nextParams.delete('reportTaskId');
                                    setSearchParams(nextParams);
                                }}
                            >
                                Xem tất cả
                            </Button>
                        }
                    />
                ) : null}
                <div style={{ marginBottom: 24, padding: 16, background: '#f0f2f5', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                    <Row align="middle" gutter={24}>
                        <Col xs={24} sm={4} style={{ textAlign: 'center' }}>
                            <RocketOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        </Col>
                        <Col xs={24} sm={20}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                                <Title level={4} style={{ margin: 0 }}>Tiến độ tổng thể</Title>
                                <Text strong style={{ fontSize: 20, color: '#1890ff' }}>{overallProgress}%</Text>
                            </div>
                            <Progress
                                percent={overallProgress}
                                status={overallProgress >= 100 ? "success" : "active"}
                                strokeWidth={12}
                                strokeColor={overallProgress >= 100 ? '#52c41a' : '#1890ff'}
                            />
                        </Col>
                    </Row>
                </div>

                <Divider orientation="left">
                    <Title level={5} style={{ margin: 0 }}>
                        <ClockCircleOutlined /> Lịch sử nhật ký hiện trường
                    </Title>
                </Divider>

                <Timeline
                    mode="left"
                    pending={overallProgress < 100 ? "Đang tiếp tục thi công..." : false}
                    items={timelineItems as any}
                />

                {overallProgress >= 100 && (
                    <Alert
                        message="Thi công hoàn tất"
                        description="Hạng mục đã hoàn thành 100% khối lượng. Đang chuẩn bị các bước Nghiệm thu & Bàn giao."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginTop: 24, borderRadius: 8 }}
                    />
                )}
            </div>
        );
    };

    const renderEditable = () => {
        return (
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ progress: lastProgress, medias: [] }}>
                <Divider orientation="left" plain>
                    <Title level={5} style={{ margin: 0 }}><PlusOutlined /> Ghi nhận nhật ký mới</Title>
                </Divider>

                <Row gutter={24}>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Cập nhật tiến độ (%)"
                            name="progress"
                            rules={[
                                { required: true, message: 'Nhập % tiến độ' },
                                {
                                    validator: async (_, value) => {
                                        if (value !== undefined && value < lastProgress) {
                                            throw new Error(`Tiến độ không được thấp hơn mức cũ (${lastProgress}%)`);
                                        }
                                        if (value > 100) {
                                            throw new Error('Tiến độ không được vượt quá 100%');
                                        }
                                    }
                                }
                            ]}
                        >
                            <InputNumber
                                min={lastProgress}
                                max={100}
                                step={1}
                                precision={0}
                                style={{ width: '100%' }}
                                addonAfter="%"
                                placeholder={`Tiến độ hiện tại: ${lastProgress}%`}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Alert
                            type="info"
                            showIcon
                            message={`Tiến độ hiện tại đang ở mức ${lastProgress}%. Vui lòng cập nhật con số mới sau ca thi công.`}
                            style={{ marginBottom: 24 }}
                        />
                    </Col>
                </Row>

                <Form.Item label="Nội dung công việc hôm nay" name="notes" rules={[{ required: true, message: 'Vui lòng mô tả công việc' }]}>
                    <TextArea rows={5} placeholder="Ví dụ: Đã hoàn thành lắp đặt hệ khung xương, đi dây điện âm trần..." />
                </Form.Item>

                <Form.Item
                    label="Hình ảnh & Video hiện trường (Tối đa 100MB/file)"
                    name="medias"
                    extra="Hỗ trợ tải lên nhiều ảnh và video (.mp4, .mov, .png, .jpg)"
                >
                    <UploadFiles fileSizeLimit={100} />
                </Form.Item>

                <Divider />

                <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                        setIsEditing(false);
                        onEditStateChange?.(false);
                    }}>Hủy bỏ</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={isSubmitting ? <LoadingOutlined /> : <PlusOutlined />}
                        loading={isSubmitting}
                    >
                        Lưu nhật ký & Cập nhật tiến độ
                    </Button>
                </Space>
            </Form>
        );
    };

    return (
        <Card
            title={
                <Space>
                    <BuildOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: 16 }}>{isEditing ? "Ghi nhận tiến độ thi công" : "Nhật ký thi công dự án"}</span>
                </Space>
            }
            variant="borderless"
            className="ky-card-detail"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: 12 }}
            extra={(isEditable || isAdmin) && (
                <Button
                    type={isEditing ? "default" : "primary"}
                    icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                    onClick={() => {
                        const newEdit = !isEditing;
                        setIsEditing(newEdit);
                        if (onEditStateChange) onEditStateChange(newEdit);
                    }}
                >
                    {isEditing ? "Xem nhật ký" : "Cập nhật tiến độ"}
                </Button>
            )}
        >
            {(!isEditable && !isAdmin) && (
                <Alert
                    message="Chế độ xem"
                    description="Bạn chỉ có quyền xem nhật ký thi công này. Các cập nhật tiến độ chỉ dành cho Giám sát hoặc PM."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            )}
            {isEditing ? renderEditable() : renderReadOnly()}
        </Card>
    );
};

export default Step08Construct;
