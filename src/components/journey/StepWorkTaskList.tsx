import React from 'react';
import { List, Typography, Space, Tag, Select, Badge, Empty, Button } from 'antd';
import { 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    CloseCircleOutlined,
    AuditOutlined 
} from '@ant-design/icons';
import { IWorkTask } from '../../services/core-contracts/types/workTask.types';

const { Text } = Typography;

export interface StepWorkTaskListProps {
    tasks: IWorkTask[];
    loading?: boolean;
    reportCounts?: Record<string, number>;
    onStatusUpdate?: (taskId: string, status: string) => void;
    onCreateReport?: (task: IWorkTask) => void;
    onViewReports?: (task: IWorkTask) => void;
    readOnly?: boolean;
}

export const StepWorkTaskList: React.FC<StepWorkTaskListProps> = ({
    tasks,
    loading = false,
    reportCounts = {},
    onStatusUpdate,
    onCreateReport,
    onViewReports,
    readOnly = false
}) => {
    return (
        <List
            loading={loading}
            dataSource={tasks}
            locale={{ emptyText: <Empty description="Chưa có công việc nào ở bước này" /> }}
            renderItem={(task) => (
                <List.Item
                    actions={[
                        onCreateReport && (
                            <Button 
                                key="report"
                                type="link" 
                                icon={<AuditOutlined />} 
                                size="small"
                                onClick={() => onCreateReport(task)}
                            >
                                Báo cáo
                            </Button>
                        )
                    ].filter(Boolean)}
                >
                    <List.Item.Meta
                        avatar={
                            task.status === 'finished' ? (
                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                            ) : task.status === 'skipped' ? (
                                <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                            ) : (
                                <ClockCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />
                            )
                        }
                        title={(
                            <Space wrap>
                                <Text strong>{task.title || 'Công việc chưa đặt tên'}</Text>
                                {task.is_required && <Tag color="red" style={{ fontSize: 10 }}>Bắt buộc</Tag>}
                                {onStatusUpdate && (
                                    <Select
                                        size="small"
                                        value={task.status || 'pending'}
                                        onChange={(val) => onStatusUpdate(task._id, val)}
                                        style={{ minWidth: 80 }}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={readOnly}
                                        options={[
                                            { label: 'Chờ', value: 'pending' },
                                            { label: 'Xong', value: 'finished' },
                                            { label: 'Bỏ qua', value: 'skipped' },
                                        ]}
                                    />
                                )}
                                {reportCounts[task._id] > 0 && (
                                    <Badge 
                                        count={reportCounts[task._id]} 
                                        style={{ backgroundColor: '#1890ff', cursor: onViewReports ? 'pointer' : 'default' }}
                                        onClick={(e) => {
                                            if (onViewReports) {
                                                e.stopPropagation();
                                                onViewReports(task);
                                            }
                                        }}
                                        title="Xem báo cáo"
                                    />
                                )}
                            </Space>
                        )}
                        description={(
                            <Space direction="vertical" size={2}>
                                <Text type="secondary" style={{ fontSize: 13 }}>{task.description || 'Chưa có mô tả'}</Text>
                                {task.note && <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>Ghi chú: {task.note}</Text>}
                            </Space>
                        )}
                    />
                </List.Item>
            )}
        />
    );
};
