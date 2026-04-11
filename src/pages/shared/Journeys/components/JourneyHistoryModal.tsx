import React, { useState, useEffect } from 'react';
import { Modal, Timeline, Card, Tag, Typography, Space, Row, Col, Avatar, Divider, Tooltip, Empty, Alert, Badge } from 'antd';
import { 
    HistoryOutlined, RocketOutlined, CheckCircleOutlined, 
    ArrowRightOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { journeyStepLogService } from '../../../../services/core-contracts/services/journeyStepLog.service';
import { IJourneyStepLog } from '../../../../services/core-contracts/types/journeyStepLog.types';

const { Text } = Typography;

export const HEADER_STEP_CONFIG = [
    { key: 'lead_new', label: 'Tiếp nhận' },
    { key: 'consult_contact', label: 'Tư vấn & Hẹn lịch' },
    { key: 'site_survey', label: 'Khảo sát' },
    { key: 'solution_design', label: 'Thiết kế giải pháp' },
    { key: 'quotation', label: 'Báo giá' },
    { key: 'contract', label: 'Hợp đồng' },
    { key: 'execution', label: 'Thi công' },
    { key: 'final_acceptance', label: 'Nghiệm thu' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'maintenance', label: 'Bảo trì' },
    { key: 'warranty', label: 'Bảo hành' },
    { key: 'after_sales', label: 'Chăm sóc' }
] as const;


export const SLA_CONFIG: Record<string, { label: string; color: string }> = {
    ontime: { label: 'Đúng hạn', color: 'success' },
    on_time: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
    paused: { label: 'Tạm dừng', color: 'default' },
    completed: { label: 'Hoàn tất', color: 'blue' },
};

export const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
    enter_step: { label: 'Vào bước', color: 'blue' },
    exit_step: { label: 'Rời bước', color: 'default' },
    transition: { label: 'Chuyển bước', color: 'cyan' },
    pause_step: { label: 'Tạm dừng', color: 'orange' },
    resume_step: { label: 'Tiếp tục', color: 'green' },
    complete_step: { label: 'Hoàn thành', color: 'success' },
    reopen_step: { label: 'Mở lại', color: 'red' },
    sla_snapshot: { label: 'Snapshot SLA', color: 'purple' }
};

export const TRIGGER_SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
    manual: { label: 'Thủ công', color: 'geekblue' },
    workflow: { label: 'Workflow', color: 'gold' },
    system: { label: 'Hệ thống', color: 'volcano' },
    api: { label: 'API', color: 'cyan' },
};

export const formatDuration = (minutes: number | undefined) => {
    if (!minutes && minutes !== 0) return '0 phút';
    if (minutes < 60) return `${minutes} phút`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}p` : `${h}h`;
};

interface JourneyHistoryModalProps {
    open: boolean;
    onCancel: () => void;
    journeyId?: string;
    journeyCode?: string;
}

export const JourneyHistoryModal: React.FC<JourneyHistoryModalProps> = ({
    open,
    onCancel,
    journeyId,
    journeyCode
}) => {
    const [stepLogs, setStepLogs] = useState<IJourneyStepLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    useEffect(() => {
        if (open && journeyId) {
            fetchJourneyStepLogs();
        }
    }, [open, journeyId]);

    const fetchJourneyStepLogs = async () => {
        if (!journeyId) return;
        setIsLoadingLogs(true);
        try {
            const res = await journeyStepLogService.queryJourneyStepLogsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId },
                sorted: [{ id: 'createdAt', desc: true }]
            } as any);
            setStepLogs(res.data || []);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <HistoryOutlined />
                    <span>Lịch sử chuyển bước: {journeyCode}</span>
                </Space>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={850}
            styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '24px' } }}
        >
            {isLoadingLogs ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <RocketOutlined spin style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                    <div style={{ color: '#8c8c8c' }}>Đang tải lịch sử...</div>
                </div>
            ) : stepLogs.length === 0 ? (
                <Empty description="Chưa có lịch sử chuyển bước" />
            ) : (
                <Timeline
                    mode="left"
                    items={stepLogs.map((log) => {
                        const stepMeta = HEADER_STEP_CONFIG.find(s => s.key === log.step_code);
                        const stepLabel = stepMeta?.label || log.step_code;
                        const fromStepLabel = HEADER_STEP_CONFIG.find(s => s.key === log.from_step_code)?.label || log.from_step_code;
                        const toStepLabel = HEADER_STEP_CONFIG.find(s => s.key === log.to_step_code)?.label || log.to_step_code;

                        const slaConfig = SLA_CONFIG[log.sla_status as string] || { label: log.sla_status, color: 'default' };
                        const eventTypeConfig = EVENT_TYPE_CONFIG[log.event_type as string] || { label: log.event_type, color: 'default' };
                        const triggerConfig = TRIGGER_SOURCE_CONFIG[log.trigger_source as string] || { label: log.trigger_source, color: 'default' };

                        const deadline = log.start_time && log.sla_hours_snapshot
                            ? dayjs(log.start_time).add(log.sla_hours_snapshot, 'hour')
                            : null;

                        const isOverdue = deadline && (log.end_time ? dayjs(log.end_time).isAfter(deadline) : dayjs().isAfter(deadline));

                        return {
                            color: slaConfig.color,
                            children: (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            <CalendarOutlined style={{ marginRight: 4 }} />
                                            {dayjs(log.event_time || (log as any).createdAt).format('HH:mm DD/MM/YYYY')}
                                        </Text>
                                    </div>
                                    <Card
                                        styles={{ body: { padding: '12px 16px' } }}
                                        style={{
                                            marginBottom: 16,
                                            borderRadius: 8,
                                            borderLeft: `4px solid ${slaConfig.color === 'success' || slaConfig.color === 'green' ? '#52c41a' : (slaConfig.color === 'error' || slaConfig.color === 'red' ? '#ff4d4f' : '#1890ff')}`,
                                            background: '#fff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                        }}
                                    >
                                        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                            <Col>
                                                <Space size={8}>
                                                    <Tag color={eventTypeConfig.color} style={{ margin: 0, borderRadius: 10 }}>
                                                        {eventTypeConfig.label}
                                                    </Tag>
                                                    <Text strong style={{ fontSize: 15 }}>{stepLabel}</Text>
                                                    {log.sla_hours_snapshot && (
                                                        <Badge
                                                            count={`${log.sla_hours_snapshot}h`}
                                                            style={{ backgroundColor: '#6366f1', color: '#fff', fontSize: '11px', height: '18px', lineHeight: '18px' }}
                                                        />
                                                    )}
                                                </Space>
                                            </Col>
                                            <Col>
                                                <Tag color={slaConfig.color} icon={<CheckCircleOutlined />} style={{ margin: 0, borderRadius: 10 }}>
                                                    {slaConfig.label}
                                                </Tag>
                                            </Col>
                                        </Row>

                                        {log.from_step_code && log.to_step_code && (
                                            <div style={{ marginBottom: 12, padding: '4px 12px', background: '#fafafa', borderRadius: 6, display: 'inline-block' }}>
                                                <Space size={8}>
                                                    <Text type="secondary" style={{ fontSize: 13 }}>{fromStepLabel}</Text>
                                                    <ArrowRightOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
                                                    <Text strong style={{ fontSize: 13 }}>{toStepLabel}</Text>
                                                </Space>
                                            </div>
                                        )}

                                        <Row gutter={[24, 12]} style={{ marginBottom: 12 }}>
                                            <Col span={8}>
                                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Bắt đầu</Text>
                                                <Space size={4}>
                                                    <CalendarOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                                                    <Text style={{ fontSize: 13 }}>{log.start_time ? dayjs(log.start_time).format('DD/MM/YYYY HH:mm') : '---'}</Text>
                                                </Space>
                                            </Col>
                                            <Col span={8}>
                                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Thời hạn</Text>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Space size={4}>
                                                        <Text type="secondary" style={{ fontSize: 11, width: 45 }}>Hạn:</Text>
                                                        <Text style={{ fontSize: 13, color: isOverdue ? '#ff4d4f' : '#8c8c8c', fontWeight: isOverdue ? 600 : 400 }}>
                                                            {deadline ? deadline.format('DD/MM/YYYY HH:mm') : '---'}
                                                        </Text>
                                                    </Space>
                                                    <Space size={4}>
                                                        <Text type="secondary" style={{ fontSize: 11, width: 45 }}>{log.end_time ? 'Thực:' : 'Hiện tại:'}</Text>
                                                        <Text style={{ fontSize: 13, color: log.end_time ? '#52c41a' : '#1890ff', fontWeight: 500 }}>
                                                            {log.end_time ? dayjs(log.end_time).format('DD/MM/YYYY HH:mm') : dayjs().format('DD/MM/YYYY HH:mm')}
                                                        </Text>
                                                    </Space>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Thời lượng thực</Text>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                                                        {formatDuration(
                                                            log.duration_minutes || (log.start_time ? dayjs().diff(dayjs(log.start_time), 'minute') : 0)
                                                        )}
                                                    </Text>
                                                    {deadline && (
                                                        <Space size={4}>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>Biến động:</Text>
                                                            {(() => {
                                                                const nowOrEnd = log.end_time ? dayjs(log.end_time) : dayjs();
                                                                const diffMins = nowOrEnd.diff(deadline, 'minute');
                                                                if (Math.abs(diffMins) < 1) return <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Đúng hạn</Text>;
                                                                const isLate = diffMins > 0;
                                                                return (
                                                                    <Text style={{ fontSize: 12, color: isLate ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
                                                                        {isLate ? 'Trễ ' : 'Sớm '}{formatDuration(Math.abs(diffMins))}
                                                                    </Text>
                                                                );
                                                            })()}
                                                        </Space>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Divider style={{ margin: '12px 0' }} />

                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Space size={12}>
                                                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                                    <div>
                                                        <Text style={{ fontSize: 13, display: 'block', lineHeight: 1.2 }}>{log.actor_user || 'Hệ thống'}</Text>
                                                        <Space size={4}>
                                                            <Tag color={triggerConfig.color} style={{ fontSize: 10, lineHeight: '14px', height: 16, margin: 0 }}>
                                                                {triggerConfig.label}
                                                            </Tag>
                                                        </Space>
                                                    </div>
                                                </Space>
                                            </Col>
                                            <Col>
                                                {log.note && (
                                                    <Tooltip title={log.note}>
                                                        <Text type="secondary" ellipsis style={{ maxWidth: 200, fontSize: 12, fontStyle: 'italic' }}>
                                                            "{log.note}"
                                                        </Text>
                                                    </Tooltip>
                                                )}
                                            </Col>
                                        </Row>

                                        {log.metadata?.breach_reason && (
                                            <Alert
                                                message={`Lý do chậm: ${log.metadata.breach_reason}`}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: 12, fontSize: 12, padding: '4px 12px' }}
                                            />
                                        )}
                                    </Card>
                                </div>
                            )
                        };
                    })}
                />
            )}
        </Modal>
    );
};
