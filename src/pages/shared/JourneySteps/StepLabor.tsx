import React, { useState, useEffect, useMemo } from 'react';
import { 
    Card, Table, Tag, Typography, Button, Space, Timeline, 
    Statistic, Row, Col, InputNumber, Select, 
    Empty, message, Spin
} from 'antd';
import { 
    TeamOutlined, UserOutlined, ClockCircleOutlined, EditOutlined, 
    EyeOutlined, SaveOutlined, PlusOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import { mockLaborPlans as defaultLaborPlans } from '../../../data/journeyMockData';
import { workerService } from '../../../services/core-contracts/services/worker.service';
import { workerTeamService } from '../../../services/core-contracts/services/workerTeam.service';
import { IWorker } from '../../../services/core-contracts/types/worker.types';
import { IWorkerTeam } from '../../../services/core-contracts/types/workerTeam.types';

const { Text } = Typography;
const { Option } = Select;

export interface StepLaborProps {
    journeyId: string;
    isEditable?: boolean;
}

const StepLabor: React.FC<StepLaborProps> = ({ journeyId, isEditable = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Data from LocalStorage (Plans are still mocked locally)
    const [allLaborPlans, setAllLaborPlans] = useLocalStorageData<any[]>(demoDataService.KEYS.LABOR_PLANS || 'LABOR_PLANS', defaultLaborPlans);
    
    // Remote data
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [teams, setTeams] = useState<IWorkerTeam[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [workersRes, teamsRes] = await Promise.all([
                workerService.queryContent(),
                workerTeamService.queryContent()
            ]);
            setWorkers(workersRes.data || []);
            setTeams(teamsRes.data || []);
        } catch (error: any) {
            message.error('Lỗi khi tải dữ liệu thợ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const laborPlan = useMemo(() => {
        let plan = allLaborPlans.find(p => p.journey_id === journeyId);
        if (!plan) {
            // Create a default empty plan if not exists
            plan = {
                journey_id: journeyId,
                total_workers: 0,
                teams: [],
                daily_tracking: []
            };
        }
        return plan;
    }, [allLaborPlans, journeyId]);

    const [editingTeams, setEditingTeams] = useState<any[]>([]);

    useEffect(() => {
        if (isEditing) {
            setEditingTeams(laborPlan.teams || []);
        }
    }, [isEditing, laborPlan]);

    const handleAddLine = () => {
        setEditingTeams([...editingTeams, { id: `new-${Date.now()}`, type: 'team', name: '', leader: '', count: 1, costPerDay: 0 }]);
    };

    const handleRemoveLine = (id: string) => {
        setEditingTeams(editingTeams.filter(t => t.id !== id));
    };

    const handleSelectTeam = (idx: number, teamId: string) => {
        const team = teams.find(t => t._id === teamId);
        if (team) {
            const newTeams = [...editingTeams];
            newTeams[idx] = {
                ...newTeams[idx],
                teamId: team._id,
                name: team.teamName,
                leader: team.contactName,
                // Assuming team count might be different, but for now take member count or 1
                count: 1, 
            };
            setEditingTeams(newTeams);
        }
    };

    const handleSelectWorker = (idx: number, workerId: string) => {
        const worker = workers.find(w => w._id === workerId);
        if (worker) {
            const newTeams = [...editingTeams];
            newTeams[idx] = {
                ...newTeams[idx],
                workerId: worker._id,
                name: `Thợ: ${worker.name}`,
                leader: worker.name,
                count: 1,
                costPerDay: worker.costPerDay || 0,
            };
            setEditingTeams(newTeams);
        }
    };

    const handleSave = () => {
        const updatedPlan = {
            ...laborPlan,
            teams: editingTeams,
            total_workers: editingTeams.reduce((sum, t) => sum + (t.count || 0), 0)
        };
        
        const newAllPlans = allLaborPlans.filter(p => p.journey_id !== journeyId);
        setAllLaborPlans([...newAllPlans, updatedPlan]);
        
        setIsEditing(false);
        message.success('Đã lưu kế hoạch nhân công');
    };

    const teamColumns = [
        { title: 'Tên đội/Hạng mục', dataIndex: 'name', key: 'name' },
        { title: 'Phụ trách', dataIndex: 'leader', key: 'leader', render: (text: string) => <Space><UserOutlined />{text}</Space> },
        { title: 'Số lượng thợ', dataIndex: 'count', key: 'count', align: 'center' as const },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (s: string) => (
                <Tag color={s === 'completed' ? 'success' : 'processing'}>
                    {s === 'completed' ? 'Đã hoàn thành' : (s ? 'Đang thực hiện' : 'Chờ triển khai')}
                </Tag>
            )
        },
        { title: 'Bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Kết thúc (Dự kiến)', dataIndex: 'end_date', key: 'end_date' },
    ];

    if (loading && !isEditing) {
        return <div style={{ padding: 40, textAlign: 'center' }}><Spin /></div>;
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card 
                title={<span><TeamOutlined /> Kế hoạch điều phối nhân công</span>} 
                size="small"
                extra={isEditable && (
                    <Space>
                        {isEditing && (
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu kế hoạch</Button>
                        )}
                        <Button 
                            type={isEditing ? "default" : "primary"} 
                            icon={isEditing ? <EyeOutlined /> : <EditOutlined />}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Hủy bỏ" : "Điều phối mới"}
                        </Button>
                    </Space>
                )}
            >
                {isEditing ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddLine} block>
                                Thêm dòng điều phối (Chọn từ danh sách)
                            </Button>
                        </div>
                        
                        {editingTeams.map((line, idx) => (
                            <Card size="small" style={{ marginBottom: 8, background: '#fafafa' }} key={line.id}>
                                <Row gutter={12} align="middle">
                                    <Col span={6}>
                                        <Text strong>Loại hình:</Text>
                                        <Select 
                                            style={{ width: '100%' }} 
                                            value={line.teamId ? 'team' : (line.workerId ? 'worker' : '')}
                                            placeholder="Chọn loại"
                                            onChange={(val) => {
                                                const newTeams = [...editingTeams];
                                                newTeams[idx] = { ...newTeams[idx], type: val, teamId: undefined, workerId: undefined, name: '', leader: '' };
                                                setEditingTeams(newTeams);
                                            }}
                                        >
                                            <Option value="team">Đội thợ</Option>
                                            <Option value="worker">Thợ lẻ</Option>
                                        </Select>
                                    </Col>
                                    <Col span={10}>
                                        <Text strong>Chọn từ Master Data:</Text>
                                        {line.type === 'team' ? (
                                            <Select 
                                                style={{ width: '100%' }} 
                                                showSearch 
                                                placeholder="Chọn Đội"
                                                value={line.teamId}
                                                onChange={(val) => handleSelectTeam(idx, val)}
                                            >
                                                {teams.map(t => <Option key={t._id} value={t._id}>{t.teamName}</Option>)}
                                            </Select>
                                        ) : (
                                            <Select 
                                                style={{ width: '100%' }} 
                                                showSearch 
                                                placeholder="Chọn Thợ"
                                                value={line.workerId}
                                                onChange={(val) => handleSelectWorker(idx, val)}
                                            >
                                                {workers.map(w => <Option key={w._id} value={w._id}>{w.name} ({w.position})</Option>)}
                                            </Select>
                                        )}
                                    </Col>
                                    <Col span={4}>
                                        <Text strong>Số lượng (Ngày công):</Text>
                                        <InputNumber 
                                            min={1} 
                                            value={line.count} 
                                            style={{ width: '100%' }}
                                            onChange={(val) => {
                                                const newTeams = [...editingTeams];
                                                newTeams[idx].count = val;
                                                setEditingTeams(newTeams);
                                            }}
                                        />
                                    </Col>
                                    <Col span={2}>
                                        <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveLine(line.id)} style={{ marginTop: 22 }} />
                                    </Col>
                                </Row>
                                {line.name && (
                                    <div style={{ marginTop: 8 }}>
                                        <Tag color="blue">{line.name}</Tag>
                                        <Tag color="cyan">Người đại diện: {line.leader}</Tag>
                                        {(line.costPerDay || 0) > 0 && <Tag color="gold">Giá: {line.costPerDay.toLocaleString()}đ/ngày</Tag>}
                                    </div>
                                )}
                            </Card>
                        ))}
                        
                        {editingTeams.length === 0 && <Empty description="Chưa có dòng điều phối nào" />}
                    </div>
                ) : (
                    <>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Statistic title="Tổng nhân lực" value={laborPlan.total_workers || 0} prefix={<TeamOutlined />} suffix="công" />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Số lượng đơn vị" value={laborPlan.teams?.length || 0} />
                            </Col>
                            <Col span={8}>
                                <Statistic 
                                    title="Ước tính chi phí (Ngày)" 
                                    value={laborPlan.teams?.reduce((sum: number, t: any) => sum + (t.costPerDay || 0) * (t.count || 1), 0) || 0} 
                                    suffix=" VNĐ"
                                    valueStyle={{ color: '#cf1322' }}
                                />
                            </Col>
                        </Row>
                        <Table 
                            size="small" 
                            dataSource={laborPlan.teams || []} 
                            columns={teamColumns} 
                            pagination={false} 
                            rowKey={(record: any) => record.id || record.name}
                            locale={{ emptyText: <Empty description="Chưa có kế hoạch nhân công" /> }}
                        />
                    </>
                )}
            </Card>

            <Card title={<span><ClockCircleOutlined /> Nhật ký điểm danh / Chấm công</span>} size="small">
                {laborPlan.daily_tracking?.length > 0 ? (
                    <Timeline
                        items={laborPlan.daily_tracking.map((t: any) => ({
                            label: t.date,
                            children: (
                                <div>
                                    <Text strong>{t.worker_count} thợ</Text> - {t.note}
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Tổng ngày công: {t.days} ngày</div>
                                </div>
                            ),
                            color: 'blue'
                        }))}
                        mode="left"
                    />
                ) : (
                    <Empty description="Chưa có dữ liệu chấm công" />
                )}
            </Card>
        </Space>
    );
};

export default StepLabor;

