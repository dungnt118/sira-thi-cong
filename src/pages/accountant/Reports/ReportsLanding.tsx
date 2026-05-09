import React from 'react';
import { Card, Col, Row, Space, Typography } from 'antd';
import {
    AuditOutlined,
    LineChartOutlined,
    PieChartOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

/**
 * Wave 4 W4-03 — KT Reports landing.
 *
 * 4 reports cốt lõi cho KT:
 *   1. P&L tổng hợp (cross-journey)
 *   2. Cash Flow tổng hợp
 *   3. AR Aging (Tuổi nợ phải thu)
 *   4. AP Outstanding (Tuổi nợ phải trả)
 */

const REPORTS = [
    {
        path: '/admin/kt/reports/pnl',
        title: 'Báo cáo Lãi/Lỗ tổng hợp',
        description: 'P&L cross-journey: doanh thu, chi phí, lãi gộp theo từng công trình. Sort theo margin để phát hiện công trình cần can thiệp.',
        icon: <LineChartOutlined style={{ fontSize: 28, color: '#1890ff' }} />,
        bg: '#e6f7ff',
    },
    {
        path: '/admin/kt/reports/cashflow',
        title: 'Báo cáo Dòng tiền',
        description: 'Cash flow theo tháng/quý: thu vào, chi ra, dòng tiền ròng. Phát hiện sớm nguy cơ thâm hụt.',
        icon: <WalletOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
        bg: '#f6ffed',
    },
    {
        path: '/admin/kt/reports/ar-aging',
        title: 'Tuổi nợ phải thu (AR Aging)',
        description: 'Phân tích công nợ phải thu theo các khoảng tuổi: 0–30, 31–60, 61–90, >90 ngày. Highlight các khoản quá hạn.',
        icon: <AuditOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
        bg: '#fff7e6',
    },
    {
        path: '/admin/kt/reports/ap-outstanding',
        title: 'Công nợ phải trả (AP)',
        description: 'PaymentRequest đã duyệt nhưng chưa chi. Theo dõi nghĩa vụ thanh toán cho NCC, lương, thuế...',
        icon: <PieChartOutlined style={{ fontSize: 28, color: '#cf1322' }} />,
        bg: '#fff1f0',
    },
];

const ReportsLanding: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card title={<><LineChartOutlined /> Báo cáo Tài chính</>}>
            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                Báo cáo tổng hợp dữ liệu thực tế từ tất cả các công trình.
                Số liệu cập nhật real-time từ phiếu thu, hoá đơn, vật tư và khoản chi.
            </Text>

            <Row gutter={[16, 16]}>
                {REPORTS.map(r => (
                    <Col key={r.path} xs={24} sm={12} lg={12}>
                        <Card
                            hoverable
                            onClick={() => navigate(r.path)}
                            style={{ background: r.bg, height: '100%' }}
                            styles={{ body: { padding: 20 } }}
                        >
                            <Space align="start" size="middle">
                                {r.icon}
                                <Space direction="vertical" size={4}>
                                    <Title level={5} style={{ margin: 0 }}>{r.title}</Title>
                                    <Text type="secondary" style={{ fontSize: 13 }}>{r.description}</Text>
                                </Space>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default ReportsLanding;
