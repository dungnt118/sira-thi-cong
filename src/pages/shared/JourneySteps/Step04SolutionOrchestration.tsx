import React, { useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Progress, Space, Divider, Tag, Button, List, Tooltip, InputNumber } from 'antd';
import { 
  BarChartOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined, 
  SafetyCertificateOutlined, 
  AuditOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useJourneyEstimateFlow } from '../../../hooks/journey/useJourneyEstimateFlow';

const { Title, Text } = Typography;

interface BucketBlockProps {
  title: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
  note?: string;
  onChange?: (val: number) => void;
  isEditable?: boolean;
}

const BucketBlock: React.FC<BucketBlockProps> = ({ title, amount, color, icon, note, onChange, isEditable }) => (
  <Card size="small" style={{ borderLeft: `4px solid ${color}`, height: '100%' }}>
    <Space direction="vertical" style={{ width: '100%' }} size={0}>
      <Space>
        {icon}
        <Text strong type="secondary" style={{ fontSize: 12 }}>{title}</Text>
      </Space>
      <div style={{ margin: '8px 0' }}>
        {isEditable ? (
          <InputNumber
            value={amount}
            onChange={(val) => onChange?.(val || 0)}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{ width: '100%' }}
            size="small"
          />
        ) : (
          <Title level={4} style={{ margin: 0 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</Title>
        )}
      </div>
      {note && <Text type="secondary" style={{ fontSize: 11 }}>{note}</Text>}
    </Space>
  </Card>
);

export const Step04SolutionOrchestration: React.FC<{ journeyId: string }> = ({ journeyId }) => {
  const { journey, estimate, loading, saveEstimate, readinessScore, refresh } = useJourneyEstimateFlow(journeyId);
  const [isEditing, setIsEditing] = useState(false);

  const getBucketValue = (code: string) => {
    return estimate?.standardized_buckets?.find(b => b.bucket_code === code)?.amount || 0;
  };

  const totalCost = estimate?.standardized_buckets?.reduce((acc, b) => acc + (b.amount || 0), 0) || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Project Snapshot */}
      <Card size="small" title={<Space><DashboardOutlined /> <Text strong>Project Snapshot</Text></Space>}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Diện tích (m2)" value={journey?.area_m2 || 0} suffix="m²" valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col span={8}>
            <Statistic title="Thời gian thi công" value={journey?.execution_days || 0} suffix="ngày" valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Mức độ phức tạp" 
              value={journey?.complexity_level || 'standard'} 
              valueStyle={{ fontSize: 18 }}
              formatter={(val) => <Tag color={val === 'standard' ? 'blue' : 'orange'}>{val.toString().toUpperCase()}</Tag>}
            />
          </Col>
        </Row>
      </Card>

      {/* 2. Estimated Cost Partition (6 Buckets) */}
      <Card 
        size="small" 
        title={<Space><BarChartOutlined /> <Text strong>Cost Partition (Estimating Buckets)</Text></Space>}
        extra={
          <Space>
            <Button size="small" icon={<SyncOutlined spin={loading} />} onClick={refresh}>Refresh</Button>
            <Button size="small" type="primary" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit Buckets'}</Button>
          </Space>
        }
      >
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <BucketBlock title="Vật tư (Materials)" amount={getBucketValue('01_materials')} color="#52c41a" icon={<ThunderboltOutlined style={{color: '#52c41a'}} />} />
          </Col>
          <Col span={8}>
            <BucketBlock title="Nhân công (Labor)" amount={getBucketValue('02_labor_total')} color="#1890ff" icon={<ThunderboltOutlined style={{color: '#1890ff'}} />} />
          </Col>
          <Col span={8}>
            <BucketBlock title="Máy thi công" amount={0} color="#faad14" icon={<ThunderboltOutlined style={{color: '#faad14'}} />} note="Bao gồm khấu hao thiết bị" />
          </Col>
          <Col span={8}>
            <BucketBlock title="Thầu phụ (Subcon)" amount={0} color="#722ed1" icon={<ThunderboltOutlined style={{color: '#722ed1'}} />} />
          </Col>
          <Col span={8}>
            <BucketBlock title="Chi phí gián tiếp" amount={getBucketValue('07_management_cost')} color="#eb2f96" icon={<ThunderboltOutlined style={{color: '#eb2f96'}} />} note="Quản lý & vận hành" />
          </Col>
          <Col span={8}>
            <BucketBlock title="Lợi nhuận (Profit)" amount={getBucketValue('09_profit')} color="#fa541c" icon={<DollarOutlined style={{color: '#fa541c'}} />} />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          {/* 3. Financial Bound */}
          <Card size="small" title={<Space><SafetyCertificateOutlined /> <Text strong>Financial Bound</Text></Space>} style={{ height: '100%' }}>
            <Statistic title="Tổng giá trị dự toán" value={totalCost} precision={0} valueStyle={{ color: '#cf1322' }} prefix={<DollarOutlined />} />
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Tỷ suất LN mục tiêu:</Text>
                <Text strong>15%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Ngưỡng giá sàn:</Text>
                <Text>90% Target</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          {/* 6. Readiness Score */}
          <Card size="small" title={<Space><CheckCircleOutlined /> <Text strong>Readiness Score</Text></Space>} style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Progress type="dashboard" percent={readinessScore} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
            <List size="small" split={false}>
              <List.Item><Space><CheckCircleOutlined style={{color: journey?.area_m2 ? '#52c41a' : '#d9d9d9'}} /> Thông tin mặt bằng</Space></List.Item>
              <List.Item><Space><CheckCircleOutlined style={{color: estimate ? '#52c41a' : '#d9d9d9'}} /> Cấu trúc chi phí (Buckets)</Space></List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      {/* 4. Traceability & 5. Audit Trail */}
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title={<Space><ThunderboltOutlined /> <Text strong>Traceability Path</Text></Space>}>
             <Space direction="vertical">
               <Tag color="cyan">Site Report #2024-001</Tag>
               <Tag color="cyan">Survey Data (Completed)</Tag>
             </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title={<Space><AuditOutlined /> <Text strong>Audit Trail</Text></Space>}>
            <Text type="secondary" style={{ fontSize: 12 }}>Last update: {(estimate as any)?.updatedTime ? new Date((estimate as any).updatedTime).toLocaleString() : 'N/A'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>Updated by: {(estimate as any)?.updatedBy || 'System'}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Step04SolutionOrchestration;
