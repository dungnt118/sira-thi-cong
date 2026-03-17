import React, { useState } from 'react';
import {
    Card, Input, Tag, Typography, List, Row, Col, Select, Space, Button
} from 'antd';
import {
    SearchOutlined, FilterOutlined, EnvironmentOutlined, 
    RightOutlined, BuildOutlined, BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockProjects, getProjectProgress } from '../../data/mockData';

const { Title, Text } = Typography;
const { Search } = Input;

const MY_SUPERVISOR_ID = 'U002';

export const SupervisorProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const myProjects = mockProjects.filter(p => p.workerIds.includes(MY_SUPERVISOR_ID));
    
    const filteredProjects = myProjects.filter(p => {
        const matchesSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="supervisor-project-list">
            <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Dự án phụ trách ({myProjects.length})</Title>
                
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    <Search 
                        placeholder="Mã hoặc tên dự án..." 
                        onChange={e => setSearchTerm(e.target.value)}
                        allowClear
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    />
                    
                    <Row gutter={8}>
                        <Col span={18}>
                            <Select 
                                defaultValue="ALL" 
                                style={{ width: '100%' }} 
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'ALL', label: 'Tất cả trạng thái' },
                                    { value: 'IN_PROGRESS', label: 'Đang thi công' },
                                    { value: 'SCHEDULED', label: 'Sắp tới' },
                                    { value: 'COMPLETED', label: 'Đã xong' }
                                ]}
                            />
                        </Col>
                        <Col span={6}>
                            <Button icon={<FilterOutlined />} block />
                        </Col>
                    </Row>
                </Space>
            </div>

            <List
                dataSource={filteredProjects}
                renderItem={p => {
                    const pct = getProjectProgress(p);
                    const isUpcoming = p.status === 'SCHEDULED';
                    
                    return (
                        <Card
                            key={p.id}
                            className="gs-card"
                            style={{ marginBottom: 12, borderLeft: `4px solid ${isUpcoming ? '#1890ff' : '#fa8c16'}` }}
                            hoverable
                            onClick={() => navigate(`/supervisor/checklist/${p.id}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong style={{ fontSize: 15 }}>{p.code}</Text>
                                        <Tag color={isUpcoming ? 'blue' : 'orange'} style={{ fontSize: 10 }}>
                                            {isUpcoming ? 'Sắp tới' : 'Đang TC'}
                                        </Tag>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{p.name}</div>
                                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                        <EnvironmentOutlined /> {p.address.split(',').slice(0, 2).join(', ')}
                                    </div>
                                </div>
                                <RightOutlined style={{ color: '#ccc', marginTop: 10 }} />
                            </div>

                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: '#999' }}>Tiến độ</div>
                                        <div style={{ fontWeight: 600, color: '#fa8c16' }}>{pct}%</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, color: '#999' }}>Hạng mục</div>
                                        <div style={{ fontWeight: 600 }}>{p.steps.length}</div>
                                    </div>
                                </div>
                                
                                <Space>
                                    <Button 
                                        size="small" 
                                        icon={<BookOutlined />}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/diary/${p.id}`); }}
                                    >
                                        Nhật ký
                                    </Button>
                                    <Button 
                                        size="small" 
                                        type="primary"
                                        icon={<BuildOutlined />}
                                        style={{ background: isUpcoming ? '#1890ff' : '#fa8c16', border: 'none' }}
                                    >
                                        Chi tiết
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    );
                }}
            />
        </div>
    );
};

export default SupervisorProjectList;
