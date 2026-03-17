import React, { useState } from 'react';
import {
    Card, Button, Tag, Select, Space, Row, Col, Typography,
    Badge, Avatar, Tooltip, Empty, Modal, Input, Alert
} from 'antd';
import {
    UnorderedListOutlined, FilterOutlined, UserOutlined,
    MessageOutlined, ExclamationCircleOutlined, SwapRightOutlined,
    CheckCircleOutlined, InfoCircleFilled, WarningFilled, 
    ExclamationCircleFilled, MinusCircleFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/localstorage/demoDataService';
import { mockJourneys as defaultJourneys } from '../../../data/journeyMockData';
import type { Journey, SlaStatus, PriorityLevel } from '../../../types/journey';

const { Text } = Typography;

const STEP_ORDER = ['INTAKE', 'SURVEY', 'QUOTATION', 'CONTRACT', 'CONSTRUCTION', 'PAYMENT'];
const STEP_LABELS: Record<string, string> = {
    INTAKE: 'Tiếp nhận', SURVEY: 'Khảo sát', QUOTATION: 'Dự toán',
    CONTRACT: 'Ký kết', CONSTRUCTION: 'Thi công', PAYMENT: 'Thanh toán',
};
const STEP_COLORS: Record<string, string> = {
    INTAKE: '#13c2c2', SURVEY: '#1890ff', QUOTATION: '#722ed1',
    CONTRACT: '#2f54eb', CONSTRUCTION: '#fa8c16', PAYMENT: '#52c41a',
};
const SLA_BADGE: Record<SlaStatus, string> = { ontime: '#52c41a', at_risk: '#fa8c16', overdue: '#ff4d4f' };
const PRIORITY_ICON: Record<PriorityLevel, React.ReactNode> = { 
    low: <MinusCircleFilled style={{ color: '#d9d9d9' }} />, 
    medium: <InfoCircleFilled style={{ color: '#1890ff' }} />, 
    high: <WarningFilled style={{ color: '#fa8c16' }} />, 
    critical: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} /> 
};

const JourneyKanbanCard: React.FC<{ journey: Journey; onClick: () => void }> = ({ journey: j, onClick }) => (
    <Card
        size="small"
        style={{
            marginBottom: 8, cursor: 'pointer', borderRadius: 8,
            border: `1px solid ${j.sla_status === 'overdue' ? '#ffa39e' : '#f0f0f0'}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        onClick={onClick}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <Text strong style={{ color: '#1976D2', fontSize: 12 }}>{j.journey_code}</Text>
            <span style={{ fontSize: 12 }}>{PRIORITY_ICON[j.priority]}</span>
        </div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, lineHeight: 1.3 }}>{j.customer_name}</div>
        <Text type="secondary" style={{ fontSize: 11 }}>{j.request_title}</Text>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {j.survey_status === 'completed' && <Tag style={{ fontSize: 10, margin: 0, padding: '0 4px' }} color="blue" icon={<CheckCircleOutlined />}>Khảo sát</Tag>}
            {j.estimate_status === 'ready' && <Tag style={{ fontSize: 10, margin: 0, padding: '0 4px' }} color="purple" icon={<CheckCircleOutlined />}>Dự toán</Tag>}
            {j.quote_status === 'approved' && <Tag style={{ fontSize: 10, margin: 0, padding: '0 4px' }} color="cyan" icon={<CheckCircleOutlined />}>Báo giá</Tag>}
            {j.contract_status === 'signed' && <Tag style={{ fontSize: 10, margin: 0, padding: '0 4px' }} color="green" icon={<CheckCircleOutlined />}>Hợp đồng</Tag>}
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={4}>
                <Avatar size={18} icon={<UserOutlined />} style={{ background: '#52c41a' }} />
                <Text style={{ fontSize: 11 }}>{j.owner_user.split(' ').slice(-1)[0]}</Text>
            </Space>
            <Space size={6}>
                {j.blocker_count > 0 && (
                    <Tooltip title={`${j.blocker_count} blocker`}>
                        <ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: 13 }} />
                    </Tooltip>
                )}
                {j.unread_portal_threads > 0 && (
                    <Tooltip title={`${j.unread_portal_threads} thread chưa đọc`}>
                        <Badge count={j.unread_portal_threads} size="small">
                            <MessageOutlined style={{ color: '#1976D2', fontSize: 13 }} />
                        </Badge>
                    </Tooltip>
                )}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: SLA_BADGE[j.sla_status] }} />
            </Space>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: '#999' }}>
            Cập nhật: {j.last_activity_at.split('T')[0]}
        </div>
    </Card>
);

const JourneyBoard: React.FC = () => {
    const navigate = useNavigate();
    const [mockJourneys, setMockJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, defaultJourneys);
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [filterOwner, setFilterOwner] = useState<string>('ALL');

    const filtered = mockJourneys.filter(j => {
        const matchP = filterPriority === 'ALL' || j.priority === filterPriority;
        const matchO = filterOwner === 'ALL' || j.owner_user === filterOwner;
        return matchP && matchO;
    });

    const uniqueOwners = [...new Set(mockJourneys.map(j => j.owner_user))];

    // DLG-02 State
    const [changeStepModal, setChangeStepModal] = useState<{ visible: boolean; journey?: Journey; newStep?: string }>({ visible: false });

    const handleDrop = (journey: Journey, newStepCode: string) => {
        if (journey.current_step_code === newStepCode) return;
        setChangeStepModal({ visible: true, journey, newStep: newStepCode });
    };

    const handleConfirmStepChange = () => {
        if (!changeStepModal.journey || !changeStepModal.newStep) return;
        
        const updatedJourneys = mockJourneys.map(j => 
            j.id === changeStepModal.journey?.id 
                ? { ...j, current_step_code: changeStepModal.newStep! } 
                : j
        );
        
        setMockJourneys(updatedJourneys);
        setChangeStepModal({ visible: false });
        Modal.success({
            title: 'Chuyển bước thành công',
            content: `Đã chuyển hành trình ${changeStepModal.journey.journey_code} sang bước ${STEP_LABELS[changeStepModal.newStep]}`,
        });
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Board Hành trình</h2>
                    <Text type="secondary">Kanban theo bước quy trình</Text>
                </div>
                <Space>
                    <Button icon={<UnorderedListOutlined />} onClick={() => navigate('/pm/journeys')}>Danh sách</Button>
                </Space>
            </div>

            {/* Filters */}
            <Card size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
                <Row gutter={12} align="middle">
                    <Col>
                        <FilterOutlined style={{ color: '#999' }} />
                        <Text type="secondary" style={{ marginLeft: 6 }}>Lọc:</Text>
                    </Col>
                    <Col>
                        <Select
                            size="small"
                            style={{ width: 140 }}
                            value={filterPriority}
                            onChange={setFilterPriority}
                            options={[
                                { value: 'ALL', label: 'Tất cả ưu tiên' },
                                { value: 'critical', label: <span><ExclamationCircleFilled style={{ color: '#ff4d4f' }} /> Khẩn cấp</span> },
                                { value: 'high', label: <span><WarningFilled style={{ color: '#fa8c16' }} /> Cao</span> },
                                { value: 'medium', label: <span><InfoCircleFilled style={{ color: '#1890ff' }} /> Trung bình</span> },
                                { value: 'low', label: <span><MinusCircleFilled style={{ color: '#d9d9d9' }} /> Thấp</span> },
                            ]}
                        />
                    </Col>
                    <Col>
                        <Select
                            size="small"
                            style={{ width: 160 }}
                            value={filterOwner}
                            onChange={setFilterOwner}
                            options={[
                                { value: 'ALL', label: 'Tất cả phụ trách' },
                                ...uniqueOwners.map(o => ({ value: o, label: o })),
                            ]}
                        />
                    </Col>
                    <Col flex="auto" />
                    <Col>
                        <Space size={4}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', display: 'inline-block' }} />
                            <Text style={{ fontSize: 11 }}>Đúng hạn</Text>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fa8c16', display: 'inline-block', marginLeft: 8 }} />
                            <Text style={{ fontSize: 11 }}>Rủi ro</Text>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d4f', display: 'inline-block', marginLeft: 8 }} />
                            <Text style={{ fontSize: 11 }}>Quá hạn</Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Board Columns */}
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, minHeight: 400 }}>
                {STEP_ORDER.map(stepCode => {
                    const stepJourneys = filtered.filter(j => j.current_step_code === stepCode);
                    return (
                        <div
                            key={stepCode}
                            style={{
                                minWidth: 240, width: 260, flexShrink: 0,
                                background: '#f5f5f5', borderRadius: 10, padding: 12,
                            }}
                        >
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: 10, paddingBottom: 8, borderBottom: `3px solid ${STEP_COLORS[stepCode]}`,
                            }}>
                                <Text strong style={{ color: STEP_COLORS[stepCode], fontSize: 13 }}>
                                    {STEP_LABELS[stepCode]}
                                </Text>
                                <Badge
                                    count={stepJourneys.length}
                                    style={{ background: STEP_COLORS[stepCode] }}
                                    showZero
                                />
                            </div>
                            {stepJourneys.length === 0 && (
                                <Empty description="Không có hành trình" imageStyle={{ height: 40 }} style={{ opacity: 0.4 }} />
                            )}
                            {stepJourneys.map(j => (
                                <div key={j.id} style={{ position: 'relative' }}>
                                    <JourneyKanbanCard
                                        journey={j}
                                        onClick={() => navigate(`/pm/journeys/${j.id}`)}
                                    />
                                    {/* Quick move action for demo purposes (simulating drag & drop) */}
                                    <div style={{ position: 'absolute', top: 4, right: 4 }}>
                                        <Tooltip title="Chuyển bước (Demo DLG-02)">
                                            <Button
                                                size="small"
                                                type="text"
                                                icon={<SwapRightOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const nextIdx = Math.min(STEP_ORDER.length - 1, STEP_ORDER.indexOf(stepCode) + 1);
                                                    handleDrop(j, STEP_ORDER[nextIdx]);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Board Summary Footer */}
            <Card size="small" style={{ borderRadius: 8, marginTop: 8 }}>
                <Row gutter={24}>
                    <Col>
                        <Text type="secondary" style={{ fontSize: 12 }}>Tổng hiển thị: <strong>{filtered.length}</strong> hành trình</Text>
                    </Col>
                    {STEP_ORDER.map(sc => {
                        const cnt = filtered.filter(j => j.current_step_code === sc).length;
                        if (!cnt) return null;
                        return (
                            <Col key={sc}>
                                <Text style={{ fontSize: 12, color: STEP_COLORS[sc] }}>{STEP_LABELS[sc]}: <strong>{cnt}</strong></Text>
                            </Col>
                        );
                    })}
                </Row>
            </Card>

            {/* DLG-02 Change Step Confirm */}
            <Modal
                title="Xác nhận chuyển bước"
                open={changeStepModal.visible}
                onOk={handleConfirmStepChange}
                onCancel={() => setChangeStepModal({ visible: false })}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                {changeStepModal.journey && changeStepModal.newStep && (
                    <div>
                        <p>Bạn đang chuyển hành trình <strong>{changeStepModal.journey.journey_code}</strong> ({changeStepModal.journey.customer_name})</p>
                        <p>
                            Từ: <Tag>{STEP_LABELS[changeStepModal.journey.current_step_code]}</Tag> <SwapRightOutlined /> Đến: <Tag color={STEP_COLORS[changeStepModal.newStep]}>{STEP_LABELS[changeStepModal.newStep]}</Tag>
                        </p>
                        <div style={{ marginTop: 16 }}>
                            <Text strong>Ghi chú chuyển bước (tùy chọn):</Text>
                            <Input.TextArea rows={3} placeholder="Lý do hoặc ghi chú nội bộ..." style={{ marginTop: 8 }} />
                        </div>
                        {changeStepModal.journey.blocker_count > 0 && (
                            <Alert
                                type="warning"
                                showIcon
                                message={`Hành trình này đang có ${changeStepModal.journey.blocker_count} blocker chưa xử lý. Hãy chắc chắn bạn muốn bỏ qua.`}
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default JourneyBoard;
