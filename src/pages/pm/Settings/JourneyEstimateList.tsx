import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, Row, Col, Popconfirm, message, Tag, List, Divider } from 'antd';
import { UnorderedListOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined, CheckCircleOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import journeyEstimateService from '../../../services/core-contracts/services/journeyEstimate.service';
import journeyService from '../../../services/core-contracts/services/journey.service';
import { IJourneyEstimate } from '../../../services/core-contracts/types/journeyEstimate.types';
import { IJourney } from '../../../services/core-contracts/types/journey.types';

const { Text, Title } = Typography;
const { Option } = Select;

export const JourneyEstimateList: React.FC = () => {
    const [estimates, setEstimates] = useState<IJourneyEstimate[]>([]);
    const [loading, setLoading] = useState(false);
    const [journeys, setJourneys] = useState<IJourney[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [viewingEstimate, setViewingEstimate] = useState<IJourneyEstimate | null>(null);
    const [form] = Form.useForm();

    const fetchEstimates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await journeyEstimateService.queryContent({
                sorted: [{ id: 'version_no', desc: true }]
            });
            setEstimates(res.data || []);
        } catch (error) {
            console.error('Fetch estimates error:', error);
            message.error('Không thể tải danh sách dự toán');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchJourneys = useCallback(async () => {
        try {
            const res = await journeyService.queryContent();
            setJourneys(res.data || []);
        } catch (error) {
            console.error('Fetch journeys error:', error);
        }
    }, []);

    useEffect(() => {
        fetchEstimates();
        fetchJourneys();
    }, [fetchEstimates, fetchJourneys]);

    const handleViewDetail = (record: IJourneyEstimate) => {
        setViewingEstimate(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await journeyEstimateService.deleteJourneyEstimate(id);
            message.success('Đã xóa bản ghi dự toán');
            fetchEstimates();
        } catch (error) {
            message.error('Không thể xóa dự toán');
        }
    };

    const formatVND = (val?: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    const getStatusTag = (status?: string) => {
        switch (status) {
            case 'approved': return <Tag color="success" icon={<CheckCircleOutlined />}>Đã duyệt</Tag>;
            case 'reviewing': return <Tag color="warning" icon={<ClockCircleOutlined />}>Đang duyệt</Tag>;
            case 'superseded': return <Tag color="default">Đã thay thế</Tag>;
            default: return <Tag color="processing">Bản nháp</Tag>;
        }
    };

    const columns = [
        { title: 'Mã Dự toán', dataIndex: 'code', key: 'code', width: 140 },
        { 
            title: 'Công trình / Hành trình', 
            dataIndex: 'journey_id', 
            key: 'journey_id',
            render: (id: string) => journeys.find(j => j._id === id)?.request_title || id
        },
        { title: 'Phiên bản', dataIndex: 'version_no', key: 'version_no', width: 100, align: 'center' as const },
        { 
            title: 'Chi phí trực tiếp', 
            key: 'direct_cost',
            render: (_: any, record: IJourneyEstimate) => formatVND(record.standardized_buckets?.find(b => b.bucket_code === '01_materials')?.amount || 0 + (record.labor_breakdown?.labor_total || 0))
        },
        { 
            title: 'Lợi nhuận dự kiến', 
            key: 'profit',
            render: (_: any, record: IJourneyEstimate) => (
                <Text type={record.validation_result?.is_feasible ? 'success' : 'danger'}>
                    {record.validation_result?.actual_profit_pct?.toFixed(2)}%
                </Text>
            )
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => getStatusTag(status)
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_: any, record: IJourneyEstimate) => (
                <Space>
                    <Button type="text" icon={<FileSearchOutlined />} onClick={() => handleViewDetail(record)} />
                    <Popconfirm title="Xóa bản ghi này?" onConfirm={() => handleDelete(record._id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card title="Quản lý Dự toán Nội bộ" className="pm-card">
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Danh sách các phương án dự toán chi phí nội bộ cho từng công trình. Dữ liệu này dùng để phân tích hiệu quả điểm hòa vốn và lợi nhuận trước khi gửi báo giá chính thức.</Text>
            </div>
            <Table 
                columns={columns} 
                dataSource={estimates} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 15 }} 
            />

            <Modal
                title={`Chi tiết Dự toán: ${viewingEstimate?.code}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>]}
                width={800}
                destroyOnClose
            >
                {viewingEstimate && (
                    <div>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Text type="secondary">Công trình:</Text> <br />
                                <Text strong>{journeys.find(j => j._id === viewingEstimate.journey_id)?.request_title || viewingEstimate.journey_id}</Text>
                            </Col>
                            <Col span={6}>
                                <Text type="secondary">Phiên bản:</Text> <br />
                                <Tag color="blue">{viewingEstimate.version_no}</Tag>
                            </Col>
                            <Col span={6}>
                                <Text type="secondary">Trạng thái:</Text> <br />
                                {getStatusTag(viewingEstimate.status)}
                            </Col>
                        </Row>

                        <Divider />

                        <Title level={5}>Phân rã chi phí (Standardized Buckets)</Title>
                        <List
                            size="small"
                            bordered
                            dataSource={viewingEstimate.standardized_buckets || []}
                            renderItem={item => (
                                <List.Item extra={<Text strong>{formatVND(item.amount)}</Text>}>
                                    <List.Item.Meta title={item.bucket_name} description={`Hệ số: ${item.rate_pct}%`} />
                                </List.Item>
                            )}
                        />

                        <Divider />

                        <Title level={5}>Kết quả thẩm định (Validation)</Title>
                        <Card size="small" style={{ background: viewingEstimate.validation_result?.is_feasible ? '#f6ffed' : '#fff2f0' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text type="secondary">Khả thi:</Text> <br />
                                    {viewingEstimate.validation_result?.is_feasible ? <Tag color="success">HỢP LỆ</Tag> : <Tag color="error">KHÔNG HỢP LỆ</Tag>}
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary">Lợi nhuận thực tế:</Text> <br />
                                    <Text strong style={{ fontSize: 18 }}>{viewingEstimate.validation_result?.actual_profit_pct?.toFixed(2)}%</Text>
                                </Col>
                                <Col span={8}>
                                    <Text type="secondary">Mục tiêu tối thiểu:</Text> <br />
                                    <Text strong>{viewingEstimate.validation_result?.target_profit_pct_min}%</Text>
                                </Col>
                            </Row>
                            {viewingEstimate.validation_result?.warning_note && (
                                <div style={{ marginTop: 12, borderTop: '1px solid #ddd', paddingTop: 8 }}>
                                    <Text type="danger"><InfoCircleOutlined /> {viewingEstimate.validation_result.warning_note}</Text>
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default JourneyEstimateList;
