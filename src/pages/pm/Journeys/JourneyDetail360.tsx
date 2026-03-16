import React, { useState } from 'react';
import {
    Card, Tabs, Tag, Button, Space, Typography, Row, Col,
    Badge, Statistic, Timeline, Descriptions, Modal,
    Form, Select, Input, Empty, Drawer, Alert, Checkbox, message, Steps
} from 'antd';
import {
    ArrowLeftOutlined, UserOutlined, FlagOutlined,
    SendOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
    ClockCircleOutlined, MessageOutlined,
    TeamOutlined, DollarOutlined,
    FormOutlined, PaperClipOutlined, StopOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mockJourneys, mockPortalThreads, mockJourneyTemplates } from '../../../data/journeyMockData';
import type { GoNoGoStatus, SlaStatus, PortalPublishStatus, PriorityLevel } from '../../../types/journey';
import { BlockerStrip } from '../../../components/journey/SharedModals';

const { Text, Title } = Typography;
const { TextArea } = Input;

const GO_NO_GO_CONFIG: Record<GoNoGoStatus, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'default' },
    go: { label: 'GO ✓', color: 'success' },
    no_go: { label: 'NO-GO ✗', color: 'error' },
    on_hold: { label: 'Tạm hoãn', color: 'warning' },
    pending: { label: 'Chờ xét', color: 'processing' },
};
const SLA_CONFIG: Record<SlaStatus, { label: string; color: string }> = {
    ontime: { label: 'Đúng hạn', color: 'success' },
    at_risk: { label: 'Có rủi ro', color: 'warning' },
    overdue: { label: 'Quá hạn', color: 'error' },
};
const PORTAL_CONFIG: Record<PortalPublishStatus, { label: string; color: string }> = {
    hidden: { label: 'Ẩn', color: 'default' },
    partial: { label: 'Một phần', color: 'blue' },
    published: { label: 'Đã publish', color: 'success' },
};
const PRIORITY_ICON: Record<PriorityLevel, string> = { low: '⚪', medium: '🔵', high: '🟠', critical: '🔴' };

const JourneyDetail360: React.FC = () => {
    const { journeyId } = useParams<{ journeyId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'request';
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.id === journeyId);
    const threads = mockPortalThreads.filter(t => t.journey_id === journeyId);
    
    // Resolve template/steps
    const template = mockJourneyTemplates.find(t => t.id === journey?.template_id);
    const journeySteps = template?.steps || [];
    const currentStepIndex = journeySteps.findIndex(s => s.step_code === journey?.current_step_code);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showActivityDrawer, setShowActivityDrawer] = useState(false);
    const [assignForm] = Form.useForm();
    const [priorityForm] = Form.useForm();

    if (!journey) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="Không tìm thấy hành trình" />
                <Button style={{ marginTop: 16 }} onClick={() => navigate('/pm/journeys')}>
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    const tabItems = [
        {
            key: 'request',
            label: <span><FormOutlined /> Yêu cầu</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Mã YC">{journey.service_request_code}</Descriptions.Item>
                    <Descriptions.Item label="Tên yêu cầu">{journey.request_title}</Descriptions.Item>
                    <Descriptions.Item label="Dịch vụ">{journey.requested_service}</Descriptions.Item>
                    <Descriptions.Item label="Nguồn khách">{journey.source_channel}</Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">{journey.customer_name}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{journey.customer_phone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{journey.customer_email || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ thi công">{journey.site_address || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả YC" span={2}>{journey.request_description || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Mức độ khẩn">{journey.urgency || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{journey.created_at.split('T')[0]}</Descriptions.Item>
                    <Descriptions.Item label="Người tạo">{journey.created_by}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'survey',
            label: <span>🔍 Khảo sát</span>,
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={8}><Statistic title="Trạng thái" value={journey.survey_status} /></Col>
                        <Col span={8}><Statistic title="Số khu vực" value={journey.area_count ?? '—'} /></Col>
                        <Col span={8}><Statistic title="Số ảnh/video" value={journey.survey_media_count ?? '—'} /></Col>
                    </Row>
                    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                        <Descriptions.Item label="Ngày KS">{journey.latest_survey_at?.split('T')[0] || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Giám sát">{journey.surveyor_name || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Chỉ số ẩm">{journey.moisture_summary || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Hiện trạng">{journey.current_condition_summary || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Giải pháp đề xuất" span={2}>{journey.proposed_solution_summary || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Nhu cầu nhân công">{journey.labor_need_note || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Nhu cầu vật tư">{journey.material_need_note || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Rủi ro hiện trường" span={2}>{journey.field_risk_summary || '—'}</Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: 'estimate',
            label: <span><DollarOutlined /> Dự toán</span>,
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={6}><Card size="small"><Statistic title="Tổng dự toán" value={journey.estimated_cost_total?.toLocaleString('vi-VN') || '—'} suffix="đ" /></Card></Col>
                        <Col span={6}><Card size="small"><Statistic title="Biên lợi nhuận" value={journey.estimated_margin_pct ? `${journey.estimated_margin_pct}%` : '—'} /></Card></Col>
                        <Col span={6}><Card size="small"><Statistic title="Phiên bản" value={journey.estimate_version_no ?? '—'} /></Card></Col>
                        <Col span={6}><Card size="small"><Badge status={journey.go_no_go_status === 'go' ? 'success' : 'default'} text={GO_NO_GO_CONFIG[journey.go_no_go_status].label} /></Card></Col>
                    </Row>
                    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                        <Descriptions.Item label="Nhân công">{journey.labor_estimate_total?.toLocaleString('vi-VN') || '—'}đ</Descriptions.Item>
                        <Descriptions.Item label="Vật tư">{journey.material_estimate_total?.toLocaleString('vi-VN') || '—'}đ</Descriptions.Item>
                        <Descriptions.Item label="Vận chuyển">{journey.transport_estimate_total?.toLocaleString('vi-VN') || '—'}đ</Descriptions.Item>
                        <Descriptions.Item label="Giàn giáo">{journey.scaffold_estimate_total?.toLocaleString('vi-VN') || '—'}đ</Descriptions.Item>
                        <Descriptions.Item label="Tổng dự toán">
                            <Text strong>{journey.estimated_cost_total?.toLocaleString('vi-VN') || '—'}đ</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tóm tắt Go/No-Go" span={2}>
                            {journey.go_no_go_summary || '—'}
                            {journey.go_no_go_status === 'draft' && (
                                <div style={{ marginTop: 8 }}>
                                    <Space>
                                        <Button size="small" type="primary">GO</Button>
                                        <Button size="small" danger>NO-GO</Button>
                                        <Button size="small">Tạm hoãn</Button>
                                    </Space>
                                </div>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: 'contract',
            label: <span>📄 Báo giá/HĐ</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Trạng thái báo giá"><Tag>{journey.quotation_status || '—'}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Phiên bản BG">{journey.quotation_version_no ?? '—'}</Descriptions.Item>
                    <Descriptions.Item label="Tổng báo giá">{journey.quotation_total?.toLocaleString('vi-VN') || '—'}đ</Descriptions.Item>
                    <Descriptions.Item label="Ngày gửi BG">{journey.quotation_sent_at?.split('T')[0] || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái HĐ"><Tag color={journey.contract_status === 'signed' ? 'success' : 'default'}>{journey.contract_status || '—'}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Số HĐ">{journey.contract_no || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Chữ ký HĐ">{journey.signature_status || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái cọc">{journey.deposit_status || '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'labor',
            label: <span><TeamOutlined /> Nhân công</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Giám sát phụ trách">{journey.supervisor_name || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Kế hoạch nhân lực">{journey.workforce_plan_status || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Số thợ nội bộ">{journey.internal_team_count ?? '—'}</Descriptions.Item>
                    <Descriptions.Item label="Cần outsource">{journey.outsource_required !== undefined ? (journey.outsource_required ? 'Có' : 'Không') : '—'}</Descriptions.Item>
                    <Descriptions.Item label="Rủi ro nhân công">{journey.labor_risk_summary || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày dự kiến bắt đầu">{journey.tentative_start_date || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Số ngày thi công">{journey.tentative_duration_days ?? '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'project',
            label: <span>🏗️ Dự án</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Trạng thái DA">{journey.project_status}</Descriptions.Item>
                    <Descriptions.Item label="Mã DA">{journey.project_code || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">{journey.plan_start || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">{journey.plan_end || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Tiến độ">{journey.progress_pct !== undefined ? `${journey.progress_pct}%` : '—'}</Descriptions.Item>
                    <Descriptions.Item label="Task bị block">{journey.blocked_task_count ?? '—'}</Descriptions.Item>
                    <Descriptions.Item label="Sự cố gần nhất">{journey.latest_incident_summary || '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'materials',
            label: <span>📦 Vật tư</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Trạng thái vật tư">{journey.material_need_status || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Vật tư chính">{journey.key_material_summary || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Cảnh báo cung ứng">{journey.procurement_alert_count ?? '—'}</Descriptions.Item>
                    <Descriptions.Item label="Nhu cầu tài sản">{journey.asset_need_summary || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Rủi ro tồn kho">{journey.stock_risk_summary || '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'payment',
            label: <span>💰 Thanh toán</span>,
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={6}><Card size="small"><Statistic title="Giá trị HĐ" value={journey.total_contract_value?.toLocaleString('vi-VN') || '—'} suffix="đ" /></Card></Col>
                        <Col span={6}><Card size="small"><Statistic title="Đã thu" value={journey.collected_amount?.toLocaleString('vi-VN') || '—'} suffix="đ" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                        <Col span={6}><Card size="small"><Statistic title="Còn lại" value={journey.outstanding_amount?.toLocaleString('vi-VN') || '—'} suffix="đ" valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
                        <Col span={6}><Card size="small"><Statistic title="Số mốc TT" value={journey.milestone_count ?? '—'} /></Card></Col>
                    </Row>
                    <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item label="Mốc TT tới">{journey.next_milestone_name || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Hạn TT tới">{journey.next_milestone_due || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú TT">{journey.last_payment_note || '—'}</Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: 'activity',
            label: <span><ClockCircleOutlined /> Log</span>,
            children: (
                <Timeline
                    items={journey.activities.map(a => ({
                        dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                        children: (
                            <div>
                                <div>
                                    <Text strong>{a.activity_action}</Text>
                                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 11 }}>{a.activity_time.split('T')[0]}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{a.activity_actor} · {a.activity_context}</Text>
                                <div style={{ fontSize: 13, marginTop: 2 }}>{a.activity_summary}</div>
                            </div>
                        ),
                    }))}
                />
            ),
        },
        {
            key: 'incidents',
            label: <span><ExclamationCircleOutlined /> Phát sinh</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Tổng sự cố">{journey.incident_count ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="Sự cố đang mở">{journey.open_incident_count ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="Loại sự cố gần nhất">{journey.latest_incident_type || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{journey.latest_incident_status || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Yêu cầu thay đổi">{journey.change_request_count ?? 0}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'documents',
            label: <span><PaperClipOutlined /> Tài liệu</span>,
            children: (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Số tài liệu">{journey.document_count ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="Còn thiếu">{journey.missing_document_count ?? 0}</Descriptions.Item>
                    <Descriptions.Item label="Loại TL gần nhất">{journey.latest_document_type || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{journey.latest_document_status || '—'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: 'portal',
            label: <span><MessageOutlined /> Portal/Chat {journey.unread_thread_count ? <Badge count={journey.unread_thread_count} size="small" /> : null}</span>,
            children: (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={6}><Statistic title="Publish Status" value={PORTAL_CONFIG[journey.portal_publish_status].label} /></Col>
                        <Col span={6}><Statistic title="Bước đã publish" value={journey.published_step_count ?? 0} /></Col>
                        <Col span={6}><Statistic title="Số thread" value={journey.thread_count ?? 0} /></Col>
                        <Col span={6}><Statistic title="Chưa đọc" value={journey.unread_thread_count ?? 0} valueStyle={{ color: journey.unread_thread_count ? '#ff4d4f' : '#52c41a' }} /></Col>
                    </Row>
                    {threads.length === 0 && <Empty description="Chưa có thread Portal" />}
                    {threads.map(t => (
                        <Card key={t.thread_id} size="small" style={{ marginBottom: 8, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Text strong>{t.context_label}</Text>
                                    <Tag style={{ marginLeft: 8 }} color={t.context_type === 'survey' ? 'blue' : 'default'}>{t.context_type}</Tag>
                                </div>
                                <div>
                                    <Badge status={t.status === 'open' ? 'processing' : t.status === 'closed' ? 'default' : 'warning'} text={t.status} />
                                    {t.unread_count > 0 && <Badge count={t.unread_count} size="small" style={{ marginLeft: 8 }} />}
                                </div>
                            </div>
                            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                {t.messages[t.messages.length - 1]?.message_body}
                            </div>
                        </Card>
                    ))}
                    <div style={{ marginTop: 16 }}>
                        <Space>
                            <Button
                                type="primary"
                                ghost
                                onClick={() => navigate(`/portal/${journey.portal_token}/threads`)}
                            >
                                Xem Portal Review
                            </Button>
                            <Button
                                onClick={() => setShowPublishModal(true)}
                                icon={<SendOutlined />}
                            >
                                Publish cập nhật mới
                            </Button>
                        </Space>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Back + Primary Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/pm/journeys')}>
                    Danh sách hành trình
                </Button>
                <Space wrap>
                    <Button icon={<UserOutlined />} onClick={() => setShowAssignModal(true)}>Phân công</Button>
                    <Button icon={<FlagOutlined />} onClick={() => setShowPriorityModal(true)}>Ưu tiên</Button>
                    <Button icon={<StopOutlined />} danger>Thêm Blocker</Button>
                    <Button icon={<ClockCircleOutlined />} onClick={() => setShowActivityDrawer(true)}>Lịch sử</Button>
                    <Button type="primary" icon={<SendOutlined />} onClick={() => setShowPublishModal(true)}>Publish Portal</Button>
                </Space>
            </div>

            {/* DLG-06 Blocker Strip */}
            {journey.blocker_count > 0 && (
                <BlockerStrip
                    blockers={[
                        { type: 'Customer Delay', summary: 'Khách hàng chưa chốt phương án thi công màng khò', owner: 'Sale', due: '2023-11-20' }
                    ]}
                />
            )}

            {/* Journey Header Card */}
            <Card style={{ marginBottom: 16, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a5f 0%, #1976D2 100%)', border: 'none' }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} md={16}>
                        <div style={{ marginBottom: 4 }}>
                            <Tag style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontWeight: 700 }}>
                                {journey.journey_code}
                            </Tag>
                            <Tag style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }}>
                                {journey.service_request_code}
                            </Tag>
                        </div>
                        <Title level={4} style={{ color: '#fff', margin: '4px 0' }}>{journey.customer_name} - {journey.customer_phone}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{journey.request_title}</Text>
                        <div style={{ marginTop: 8 }}>
                            <Space size="large">
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                    <UserOutlined /> Phụ trách: <Text strong style={{ color: '#fff' }}>{journey.owner_user}</Text>
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                    {PRIORITY_ICON[journey.priority]} Ưu tiên: <Text strong style={{ color: '#fff', textTransform: 'capitalize' }}>{journey.priority}</Text>
                                </Text>
                                {journey.site_address && (
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                        📍 {journey.site_address}
                                    </Text>
                                )}
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={8}>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Badge status={SLA_CONFIG[journey.sla_status].color as any} />
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>SLA</div>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 11 }}>{SLA_CONFIG[journey.sla_status].label}</div>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Tag
                                    color={GO_NO_GO_CONFIG[journey.go_no_go_status].color}
                                    style={{ fontSize: 11, margin: 0 }}
                                >
                                    {GO_NO_GO_CONFIG[journey.go_no_go_status].label}
                                </Tag>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>Go/No-Go</div>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Tag
                                    color={PORTAL_CONFIG[journey.portal_publish_status].color}
                                    style={{ fontSize: 11, margin: 0 }}
                                >
                                    {PORTAL_CONFIG[journey.portal_publish_status].label}
                                </Tag>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>Portal</div>
                            </Col>
                        </Row>
                        <div style={{ marginTop: 12, textAlign: 'right' }}>
                            {journey.blocker_count > 0 && (
                                <Tag color="error">⚠ {journey.blocker_count} Blocker</Tag>
                            )}
                            {journey.unread_portal_threads > 0 && (
                                <Tag color="orange">💬 {journey.unread_portal_threads} Chưa đọc</Tag>
                            )}
                        </div>
                    </Col>
                </Row>
                
                {journeySteps.length > 0 && (
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
                        <Steps
                            size="small"
                            current={currentStepIndex >= 0 ? currentStepIndex : 0}
                            items={journeySteps.map(s => ({
                                title: <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, whiteSpace: 'nowrap' }}>{s.step_name}</span>,
                            }))}
                            className="journey-dark-steps"
                        />
                        <style>{`
                            .journey-dark-steps .ant-steps-item-wait .ant-steps-item-icon {
                                background-color: rgba(255,255,255,0.1) !important;
                                border-color: rgba(255,255,255,0.2) !important;
                            }
                            .journey-dark-steps .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
                                color: rgba(255,255,255,0.4) !important;
                            }
                            .journey-dark-steps .ant-steps-item-wait .ant-steps-item-title::after {
                                background-color: rgba(255,255,255,0.2) !important;
                            }
                            .journey-dark-steps .ant-steps-item-process .ant-steps-item-icon {
                                background-color: #1890ff !important;
                                border-color: #1890ff !important;
                            }
                            .journey-dark-steps .ant-steps-item-process .ant-steps-item-title {
                                color: #fff !important;
                                font-weight: 600 !important;
                            }
                            .journey-dark-steps .ant-steps-item-finish .ant-steps-item-icon {
                                background-color: transparent !important;
                                border-color: rgba(255,255,255,0.6) !important;
                            }
                            .journey-dark-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
                                color: rgba(255,255,255,0.6) !important;
                            }
                            .journey-dark-steps .ant-steps-item-finish .ant-steps-item-title::after {
                                background-color: rgba(255,255,255,0.6) !important;
                            }
                        `}</style>
                    </div>
                )}
            </Card>

            {/* 360 Tabs & Activity Panel (Desktop) */}
            <Row gutter={16}>
                <Col xs={24} lg={18}>
                    <Card style={{ borderRadius: 10, height: '100%' }}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => setSearchParams({ tab: key })}
                            items={tabItems}
                            size="small"
                            tabBarStyle={{ marginBottom: 16 }}
                        />
                    </Card>
                </Col>
                <Col xs={0} lg={6}>
                    <Card style={{ borderRadius: 10, height: '100%' }} title={<span><ClockCircleOutlined /> Log hoạt động</span>} bodyStyle={{ padding: '12px 16px', maxHeight: 600, overflowY: 'auto' }}>
                        <Timeline
                            items={journey.activities.map(a => ({
                                children: (
                                    <div>
                                        <Text strong>{a.activity_action}</Text>
                                        <div style={{ fontSize: 11, color: '#999' }}>{a.activity_time.split('T')[0]} · {a.activity_actor}</div>
                                        <div style={{ fontSize: 12 }}>{a.activity_summary}</div>
                                        <div style={{ fontSize: 11, color: '#ccc', marginTop: 2 }}>{a.activity_context}</div>
                                    </div>
                                ),
                            }))}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Modal Assign Owner */}
            <Modal
                title="Phân công phụ trách"
                open={showAssignModal}
                onCancel={() => setShowAssignModal(false)}
                onOk={() => { assignForm.resetFields(); setShowAssignModal(false); }}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Form form={assignForm} layout="vertical">
                    <Form.Item label="Người phụ trách mới" name="owner_user_id" rules={[{ required: true }]}>
                        <Select placeholder="Chọn PM/Sale">
                            <Select.Option value="u-pm-01">Nguyễn Văn PM</Select.Option>
                            <Select.Option value="u-pm-02">Phạm Thúy PM</Select.Option>
                            <Select.Option value="u-sale-01">Trần Thị Sale</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Lý do thay đổi" name="reason">
                        <TextArea rows={3} placeholder="Ghi chú lý do..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Change Priority */}
            <Modal
                title="Đổi mức ưu tiên"
                open={showPriorityModal}
                onCancel={() => setShowPriorityModal(false)}
                onOk={() => { priorityForm.resetFields(); setShowPriorityModal(false); }}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form form={priorityForm} layout="vertical" initialValues={{ priority: journey.priority }}>
                    <Form.Item label="Mức ưu tiên" name="priority" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="low">⚪ Thấp</Select.Option>
                            <Select.Option value="medium">🔵 Trung bình</Select.Option>
                            <Select.Option value="high">🟠 Cao</Select.Option>
                            <Select.Option value="critical">🔴 Khẩn cấp</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Publish to Portal (DLG-04) */}
            <Modal
                title="Publish lên Customer Portal"
                open={showPublishModal}
                onCancel={() => setShowPublishModal(false)}
                onOk={() => {
                    message.success("Publish thành công!");
                    setShowPublishModal(false);
                }}
                okText="Publish ngay"
                cancelText="Hủy"
                width={500}
            >
                <div>
                    <Alert type="info" message="Khách hàng sẽ thấy các thay đổi mới trên Portal sau khi bạn publish." style={{ marginBottom: 16 }} />
                    <Form layout="vertical" initialValues={{ notify_customer: true, attach_documents: ['report.pdf'] }}>
                        <Form.Item label="Những nội dung sẽ được cập nhật lên Portal" name="publish_scope" rules={[{ required: true }]}>
                            <Select mode="multiple" placeholder="Chọn nội dung publish" defaultValue={['overview', 'timeline', 'docs']}>
                                <Select.Option value="overview">Tổng quan hành trình</Select.Option>
                                <Select.Option value="timeline">Timeline các bước</Select.Option>
                                <Select.Option value="docs">Tài liệu và hình ảnh</Select.Option>
                                <Select.Option value="invoice">Báo giá / Hóa đơn</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Tài liệu đính kèm" name="attach_documents">
                            <Select mode="multiple" placeholder="Chọn file">
                                <Select.Option value="report.pdf">Báo cáo khảo sát_final.pdf</Select.Option>
                                <Select.Option value="quote.pdf">Báo giá_v2.pdf</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ghi chú hiển thị cho khách hàng (Tùy chọn)" name="customer_note">
                            <TextArea rows={3} placeholder="Ví dụ: Xin chào anh/chị, em đã gửi báo giá chi tiết, anh chị xem qua nhé..." />
                        </Form.Item>
                        <Form.Item name="notify_customer" valuePropName="checked">
                            <Checkbox>Gửi thông báo SMS/Zalo-ZNS cho khách hàng</Checkbox>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            {/* Activity Drawer (mobile) */}
            <Drawer
                title="Lịch sử hoạt động"
                open={showActivityDrawer}
                onClose={() => setShowActivityDrawer(false)}
                placement="right"
                width={360}
            >
                <Timeline
                    items={journey.activities.map(a => ({
                        children: (
                            <div>
                                <Text strong>{a.activity_action}</Text>
                                <div style={{ fontSize: 11, color: '#999' }}>{a.activity_time.split('T')[0]} · {a.activity_actor}</div>
                                <div style={{ fontSize: 12 }}>{a.activity_summary}</div>
                            </div>
                        ),
                    }))}
                />
            </Drawer>
        </div>
    );
};

export default JourneyDetail360;
