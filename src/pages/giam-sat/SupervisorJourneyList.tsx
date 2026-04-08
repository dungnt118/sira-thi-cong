import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, Input, Tag, Typography, Row, Col, Space, Button,
    Progress, Spin, Empty, message, Badge, Divider
} from 'antd';
import {
    SearchOutlined, EnvironmentOutlined,
    BuildOutlined, BookOutlined,
    ClockCircleOutlined, UserOutlined, DeploymentUnitOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { journeyService } from '@/services/core-contracts/services/journey.service';
import { IJourney } from '@/services/core-contracts/types/journey.types';
import { FilterOperation, AND_OR } from '@/types/filters/GroupQueryFilter';

const { Title, Text } = Typography;
const { Search } = Input;

const JOURNEY_STEPS_CONFIG = [
    { key: 'lead_intake', label: 'Tiếp nhận', color: 'cyan' },
    { key: 'qualification', label: 'Thẩm định', color: 'blue' },
    { key: 'survey_planning', label: 'Lập lịch KS', color: 'geekblue' },
    { key: 'site_survey', label: 'Khảo sát', color: 'purple' },
    { key: 'survey_review', label: 'Duyệt KS', color: 'magenta' },
    { key: 'estimate_preparation', label: 'Lập dự toán', color: 'gold' },
    { key: 'quotation_preparation', label: 'Lập báo giá', color: 'orange' },
    { key: 'quotation_sent', label: 'Gửi báo giá', color: 'volcano' },
    { key: 'quotation_approved', label: 'Duyệt báo giá', color: 'green' },
    { key: 'contract_signing', label: 'Ký kết', color: 'lime' },
    { key: 'project_execution', label: 'Thi công', color: 'processing' },
    { key: 'handover_acceptance', label: 'Nghiệm thu', color: 'success' },
    { key: 'warranty_aftercare', label: 'Bảo hành', color: 'default' },
];

type FilterType = 'ACTIVE' | 'SURVEY' | 'EXECUTING' | 'COMPLETED' | 'ALL';

const TAB_CONFIG: { key: FilterType; label: string; filter: any }[] = [
    {
        key: 'ACTIVE',
        label: 'Có hiệu lực',
        filter: {
            group: {
                id: 'project_status',
                operation: FilterOperation.NOT_IN,
                value: ['completed', 'cancelled'],
                children: []
            }
        }
    },
    {
        key: 'SURVEY',
        label: 'Đang khảo sát',
        filter: {
            group: {
                id: 'current_step',
                operation: FilterOperation.IN,
                value: ['site_survey', 'survey_review'],
                children: []
            }
        }
    },
    {
        key: 'EXECUTING',
        label: 'Đang thi công',
        filter: {
            group: {
                id: 'project_status',
                operation: FilterOperation.EQUAL,
                value: 'active',
                children: []
            }
        }
    },
    {
        key: 'COMPLETED',
        label: 'Đã hoàn thành',
        filter: {
            group: {
                id: 'project_status',
                operation: FilterOperation.EQUAL,
                value: 'completed',
                children: []
            }
        }
    },
    {
        key: 'ALL',
        label: 'Tất cả',
        filter: { group: { children: [] } }
    }
];

export const SupervisorJourneyList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterType>('ACTIVE');
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchCounts = useCallback(async () => {
        try {
            const countPromises = TAB_CONFIG.map(async (tab) => {
                const count = await journeyService.countContent(tab.filter);
                return { key: tab.key, count };
            });
            const results = await Promise.all(countPromises);
            const countsMap = results.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.count }), {});
            setCounts(countsMap);
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    }, []);

    const fetchJourneys = async (search?: string, tabKey?: FilterType) => {
        setIsLoading(true);
        try {
            const currentTab = TAB_CONFIG.find(t => t.key === (tabKey || statusFilter));
            const filter: any = { ...currentTab?.filter };

            if (search) {
                filter.text = search;
            }

            const response = await journeyService.queryJourneysDto(filter);
            setJourneys(response.data || []);

            // Also refresh counts to keep badges updated
            fetchCounts();
        } catch (error) {
            console.error('Failed to fetch journeys:', error);
            message.error('Không thể tải danh sách công trình');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJourneys();
    }, [statusFilter]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchJourneys(value);
    };

    const renderJourneyCard = (j: IJourney) => {
        const isOwn = j.supervisor_users === user?._id || j.owner_user === user?._id;
        const progress = j.progress_pct || 0;
        const stepConfig = JOURNEY_STEPS_CONFIG.find(c => c.key === j.current_step);
        const statusColor = j.project_status === 'completed' ? 'green' : (j.project_status === 'active' ? (stepConfig?.color || 'orange') : 'default');

        return (
            <Card
                key={j._id}
                className="gs-premium-card"
                style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    borderLeft: `5px solid ${isOwn ? '#fa8c16' : '#d9d9d9'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}
                hoverable
                onClick={() => navigate(`/gs/journeys/${j._id}`)}
                styles={{ body: { padding: '16px' } }}
            >
                <Row gutter={16} align="middle">
                    <Col xs={18} sm={20}>
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <Text strong style={{ fontSize: 13, color: '#8c8c8c' }}>{j.journey_code || j._id.slice(-8)}</Text>
                                <Tag color={statusColor}>
                                    {stepConfig?.label || (j.current_step || 'Chưa xác định').replace(/_/g, ' ').toUpperCase()}
                                </Tag>
                                {isOwn && <Tag color="gold" icon={<UserOutlined />}>Phụ trách</Tag>}
                            </div>
                            <Title level={5} style={{ margin: 0, fontSize: 16 }}>{j.customer_full_name || 'Khách hàng'}</Title>
                            <Text type="secondary" ellipsis style={{ fontSize: 13, display: 'block', maxWidth: '90%' }}>
                                <EnvironmentOutlined style={{ marginRight: 6 }} /> {j.site_address || 'N/A'}
                            </Text>
                        </Space>
                    </Col>
                    <Col xs={6} sm={4} style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Progress
                                type="circle"
                                percent={progress}
                                size={45}
                                strokeColor={progress >= 100 ? '#52c41a' : '#fa8c16'}
                            />
                        </div>
                    </Col>
                </Row>

                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={16}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Cập nhật</Text>
                            <Text style={{ fontSize: 12 }}><ClockCircleOutlined /> {j.last_activity_at ? new Date(j.last_activity_at).toLocaleDateString('vi-VN') : 'N/A'}</Text>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Dịch vụ</Text>
                            <Text strong style={{ fontSize: 12 }}>{j.idx_serviceTypeId?.title || 'Dịch vụ lẻ'}</Text>
                        </div>
                    </Space>
                    <Space>
                        <Button
                            size="small"
                            icon={<BookOutlined />}
                            onClick={(e) => { e.stopPropagation(); navigate(`/gs/journeys/${j._id}?tab=GRP_08_CONSTRUCT`); }}
                        >
                            Nhật ký
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            icon={<BuildOutlined />}
                            style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/gs/journeys/${j._id}`); }}
                        >
                            Chi tiết
                        </Button>
                    </Space>
                </div>
            </Card>
        );
    };

    return (
        <div className="supervisor-journey-list" style={{ paddingBottom: 80, padding: '0 16px' }}>
            <div style={{ marginBottom: 24, paddingTop: 16 }}>
                <Title level={4}>Công trình</Title>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Search
                        placeholder="Tìm theo mã, khách hàng hoặc địa chỉ..."
                        onSearch={handleSearch}
                        onChange={e => !e.target.value && handleSearch('')}
                        allowClear
                        size="large"
                        enterButton={<SearchOutlined />}
                        style={{ borderRadius: 8, overflow: 'hidden' }}
                    />

                    <div style={{
                        display: 'flex',
                        gap: 12,
                        overflowX: 'auto',
                        padding: '20px 16px 12px 8px', // More top padding to ensure badges aren't clipped
                        margin: '0 -16px', // Full-width feel
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }}>
                        {TAB_CONFIG.map(tab => (
                            <Badge key={tab.key} count={counts[tab.key]} size="small" offset={[0, 0]} color="#fa8c16">
                                <Button
                                    shape="round"
                                    type={statusFilter === tab.key ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter(tab.key)}
                                    style={statusFilter === tab.key ? { backgroundColor: '#fa8c16', borderColor: '#fa8c16' } : {}}
                                >
                                    {tab.label}
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </Space>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin indicator={<DeploymentUnitOutlined spin style={{ fontSize: 32, color: '#fa8c16' }} />} tip="Đang tải dữ liệu..." />
                </div>
            ) : (
                <div style={{ minHeight: '400px' }}>
                    {journeys.length > 0 ? (
                        <>
                            <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                                <Text strong style={{ color: '#fa8c16' }}>DANH SÁCH ({journeys.length})</Text>
                            </Divider>
                            {journeys.map(j => renderJourneyCard(j))}
                        </>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical">
                                    <Text type="secondary">Không tìm thấy công trình nào</Text>
                                    <Button type="link" onClick={() => { setSearchTerm(''); setStatusFilter('ACTIVE'); }}>Xem tất cả đang mở</Button>
                                </Space>
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SupervisorJourneyList;

