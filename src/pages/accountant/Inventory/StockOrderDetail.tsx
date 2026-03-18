import React, { useState, useMemo } from 'react';
import { 
    Card, Row, Col, Typography, Table, Tag, Button, 
    Space, Divider, Steps, message, Modal, 
    Alert, Descriptions, Result
} from 'antd';
import { 
    ArrowLeftOutlined, FilePdfOutlined, CheckCircleOutlined,
    ClockCircleOutlined, WarningOutlined, SignatureOutlined,
    CarOutlined, HomeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorageData from '@hooks/useLocalStorageData';
import { 
    StockOrder, StockOrderStatus, StockOrderSignature, UserRole 
} from '@/types/v3';
import SignaturePad from '@components/common/SignaturePad';

const { Title, Text } = Typography;

const StockOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [stockOrders, setStockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);

    const order = useMemo(() => stockOrders.find(o => o.id === id || o.code === id), [stockOrders, id]);
    
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signingRole, setSigningRole] = useState<UserRole | 'warehouse' | null>(null);

    if (!order) {
        return <Result status="404" title="Không tìm thấy phiếu" subTitle="Phiếu nhập/xuất này không tồn tại hoặc đã bị xóa." />;
    }

    const getStatusInfo = (status: StockOrderStatus) => {
        switch (status) {
            case 'DRAFT': return { color: 'default', text: 'Nháp', icon: <ClockCircleOutlined /> };
            case 'REQUESTED': return { color: 'processing', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> };
            case 'APPROVED': return { color: 'cyan', text: 'Đã duyệt', icon: <CheckCircleOutlined /> };
            case 'DISPATCHED': return { color: 'purple', text: 'Đang giao', icon: <CarOutlined /> };
            case 'RECEIVED': return { color: 'blue', text: 'Đã nhận', icon: <HomeOutlined /> };
            case 'COMPLETED': return { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> };
            case 'DISCREPANCY': return { color: 'error', text: 'Thiếu hụt', icon: <WarningOutlined /> };
            case 'CANCELLED': return { color: 'error', text: 'Đã hủy', icon: <WarningOutlined /> };
            default: return { color: 'default', text: status, icon: null };
        }
    };

    const steps = [
        { title: 'Lập yêu cầu', description: 'PM' },
        { title: 'Duyệt phiếu', description: 'Kế toán' },
        { title: 'Xuất kho', description: 'Kho' },
        { title: 'Nhận hàng', description: 'Giám sát' },
        { title: 'Hoàn tất', description: 'Lưu trữ' }
    ];

    const getCurrentStep = (status: StockOrderStatus) => {
        if (status === 'DRAFT' || status === 'REQUESTED') return 0;
        if (status === 'APPROVED') return 1;
        if (status === 'DISPATCHED') return 2;
        if (status === 'RECEIVED' || status === 'DISCREPANCY') return 3;
        if (status === 'COMPLETED') return 4;
        return 0;
    };

    const handleSign = (dataUrl: string) => {
        if (!signingRole) return;

        const signature: StockOrderSignature = {
            role: signingRole as any,
            userName: signingRole === 'pm' ? 'PM Nguyễn Văn A' : signingRole === 'accountant' ? 'Kế toán Phạm Thị A' : 'Giám sát Lê Văn B',
            userId: 'user-123',
            signedAt: new Date().toISOString(),
            signatureDataUrl: dataUrl
        };

        let nextStatus: StockOrderStatus = order.status;
        if (order.status === 'REQUESTED' && signingRole === 'accountant') nextStatus = 'APPROVED';
        if (order.status === 'APPROVED' && signingRole === 'warehouse') nextStatus = 'DISPATCHED';
        if (order.status === 'DISPATCHED' && signingRole === 'supervisor') nextStatus = 'RECEIVED';

        const updatedOrder: StockOrder = {
            ...order,
            status: nextStatus as any,
            signatures: [...(order.signatures || []), signature],
            history: [
                ...(order.history || []),
                {
                    status: nextStatus as any,
                    updatedBy: signature.userName,
                    updatedAt: signature.signedAt,
                    comment: `Đã ký xác nhận vai trò ${signingRole}`
                }
            ]
        };

        setStockOrders(stockOrders.map(o => o.id === order.id ? updatedOrder : o));
        setIsSignatureModalOpen(false);
        message.success(`Đã ký xác nhận thành công với vai trò ${signingRole}`);
    };

    const handleFinalize = () => {
        const updatedOrder: StockOrder = {
            ...order,
            status: 'COMPLETED',
            history: [
                ...(order.history || []),
                {
                    status: 'COMPLETED',
                    updatedBy: 'Kế toán Phạm Thị A',
                    updatedAt: new Date().toISOString(),
                    comment: 'Đã hoàn tất phiếu và lưu trữ hồ sơ'
                }
            ],
            pdfUrl: `/files/signed-orders/${order.code}.pdf` // Mock URL
        };
        setStockOrders(stockOrders.map(o => o.id === order.id ? updatedOrder : o));
        message.success('Đã hoàn tất phiếu và đồng bộ tệp PDF chữ ký');
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'materialName', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
        { title: 'Yêu cầu (PM)', dataIndex: 'requestedQuantity', key: 'req', align: 'right' as const },
        { title: 'Thực xuất (Kho)', dataIndex: 'issuedQuantity', key: 'iss', align: 'right' as const, render: (v: number) => <Text strong color="blue">{v}</Text> },
        { 
            title: 'Thực nhận (GS)', 
            dataIndex: 'receivedQuantity', 
            key: 'rec', 
            align: 'right' as const,
            render: (v: number, record: any) => v !== undefined ? (
                <Text strong color={v < record.issuedQuantity ? 'red' : 'green'}>{v}</Text>
            ) : <Text type="secondary">—</Text>
        },
        { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', align: 'right' as const, render: (v: number) => v.toLocaleString() + 'đ' }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Card bordered={false} className="order-detail-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/accountant/inventory')} />
                        <div>
                            <Text type="secondary">{order.type === 'OUT' ? 'Phiếu Xuất Kho' : 'Phiếu Nhập Kho'}</Text>
                            <Title level={4} style={{ margin: 0 }}>{order.code}</Title>
                        </div>
                    </Space>
                    <Space>
                        {order.status === 'RECEIVED' && (
                            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleFinalize}>
                                Hoàn tất & Lưu trữ PDF
                            </Button>
                        )}
                        {order.pdfUrl && (
                            <Button icon={<FilePdfOutlined />}>Tải PDF Bản Ký</Button>
                        )}
                    </Space>
                </div>

                <Steps 
                    current={getCurrentStep(order.status)} 
                    items={steps} 
                    style={{ marginBottom: 40 }}
                />

                <Row gutter={24}>
                    <Col span={16}>
                        <Descriptions bordered size="small" column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Ngày tạo">{order.createdAt}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusInfo(order.status).color} icon={getStatusInfo(order.status).icon}>
                                    {getStatusInfo(order.status).text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Dự án/Nguồn" span={2}>
                                {order.projectName || (order.source === 'DISTRIBUTOR' ? 'Nhà phân phối' : 'Nguồn khác')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>{order.notes || 'Không có ghi chú'}</Descriptions.Item>
                        </Descriptions>

                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Danh sách vật tư</Text>
                        <Table 
                            dataSource={order.items} 
                            columns={itemColumns} 
                            pagination={false} 
                            size="small"
                            rowKey={(r, i) => `${r.materialId}-${i}`}
                        />
                    </Col>

                    <Col span={8}>
                        <Card title={<Space><SignatureOutlined /> Chữ ký xác nhận</Space>} size="small">
                            {order.signatures?.map((sig, idx) => (
                                <div key={idx} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>{sig.userName}</Text>
                                        <Tag>{sig.role.toUpperCase()}</Tag>
                                    </div>
                                    <div style={{ textAlign: 'center', margin: '8px 0', background: '#fff' }}>
                                        <img src={sig.signatureDataUrl} alt="signature" style={{ maxWidth: '100%', height: 60 }} />
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 11 }}>Đã ký: {new Date(sig.signedAt).toLocaleString('vi-VN')}</Text>
                                </div>
                            ))}

                            <Divider style={{ margin: '12px 0' }} />
                            
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {order.status === 'REQUESTED' && (
                                    <Button block icon={<CheckCircleOutlined />} onClick={() => { setSigningRole('accountant'); setIsSignatureModalOpen(true); }}>
                                        Kế toán Duyệt & Ký
                                    </Button>
                                )}
                                {order.status === 'APPROVED' && (
                                    <Button block icon={<CarOutlined />} onClick={() => { setSigningRole('warehouse'); setIsSignatureModalOpen(true); }}>
                                        Thủ kho Xuất & Ký
                                    </Button>
                                )}
                                {order.status === 'DISPATCHED' && (
                                    <Button block type="primary" icon={<HomeOutlined />} onClick={() => { setSigningRole('supervisor'); setIsSignatureModalOpen(true); }}>
                                        Giám sát Nhận & Ký
                                    </Button>
                                )}
                            </Space>

                            {order.status === 'RECEIVED' && (
                                <Alert 
                                    message="Đang chờ Kế toán chốt & lưu trữ PDF" 
                                    type="info" 
                                    showIcon 
                                    style={{ marginTop: 12 }}
                                />
                            )}
                        </Card>

                        <Card title="Lịch sử xử lý" size="small" style={{ marginTop: 16 }}>
                            {order.history?.map((h, i) => (
                                <div key={i} style={{ fontSize: 12, marginBottom: 10 }}>
                                    <Text strong>{h.status}</Text> por <Text>{h.updatedBy}</Text>
                                    <div style={{ color: '#999' }}>{new Date(h.updatedAt).toLocaleString()}</div>
                                    {h.comment && <div style={{ fontStyle: 'italic' }}>— {h.comment}</div>}
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Modal
                title={`Ký tên xác nhận: ${signingRole?.toUpperCase()}`}
                open={isSignatureModalOpen}
                onCancel={() => setIsSignatureModalOpen(false)}
                footer={null}
                width={450}
            >
                <SignaturePad 
                    onSave={handleSign} 
                    title={`Chữ ký của ${signingRole === 'accountant' ? 'Kế toán' : signingRole === 'warehouse' ? 'Thủ kho' : 'Giám sát'}`}
                    description="Vui lòng ký vào khung bên dưới và bấm Xác nhận" 
                />
            </Modal>
        </div>
    );
};

export default StockOrderDetail;
