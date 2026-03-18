import React, { useState, useMemo } from 'react';
import { 
    Card, Row, Col, Typography, Table, Tag, Button, 
    Space, Steps, message, Modal, 
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
import SiraSignaturePad from '@components/common/SignaturePad';
import StockOrderPrintable from './components/StockOrderPrintable';
import html2pdf from 'html2pdf.js';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StockOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [stockOrders, setStockOrders] = useLocalStorageData<StockOrder[]>('STOCK_ORDERS', []);
    const [cachedSignatures, setCachedSignatures] = useLocalStorageData<Record<string, string>>('CACHED_SIGNATURES', {});

    const order = useMemo(() => stockOrders.find(o => o.id === id || o.code === id), [stockOrders, id]);
    
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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
        const roleToSign = signingRole;
        if (!roleToSign) {
            return;
        }

        // Cache the signature for reuse
        setCachedSignatures({
            ...cachedSignatures,
            [roleToSign]: dataUrl
        });

        const signature: StockOrderSignature = {
            role: roleToSign as any,
            userName: roleToSign === 'pm' ? 'PM Nguyễn Văn A' : roleToSign === 'accountant' ? 'Kế toán Phạm Thị A' : roleToSign === 'warehouse' ? 'Thủ kho Nguyễn Văn C' : 'Giám sát Lê Văn B',
            userId: `user-${roleToSign}`,
            signedAt: new Date().toISOString(),
            signatureDataUrl: dataUrl
        };

        let nextStatus: StockOrderStatus = order.status;
        if (order.status === 'REQUESTED' && roleToSign === 'accountant') nextStatus = 'APPROVED';
        if (order.status === 'APPROVED' && roleToSign === 'warehouse') nextStatus = 'DISPATCHED';
        if (order.status === 'DISPATCHED' && roleToSign === 'supervisor') nextStatus = 'RECEIVED';

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
                    comment: `Đã ký xác nhận vai trò ${roleToSign}`
                }
            ]
        };

        setStockOrders(stockOrders.map(o => o.id === order.id ? updatedOrder : o));
        
        // Use a slight delay or order change to ensure state updates don't trip each other
        setTimeout(() => {
            setIsSignatureModalOpen(false);
            setSigningRole(null);
        }, 100);

        message.success(`Đã ký xác nhận thành công với vai trò ${roleToSign}`);
    };

    const handleUseCachedSignature = (role: string) => {
        const cached = cachedSignatures[role];
        if (cached) {
            setSigningRole(role as any);
            handleSign(cached);
        }
    };

    const handleFinalize = () => {
        const updatedOrder: StockOrder = {
            ...order,
            status: 'COMPLETED',
            history: [
                ...(order.history || []),
                {
                    status: 'COMPLETED',
                    updatedBy: 'Hệ thống',
                    updatedAt: new Date().toISOString(),
                    comment: 'Đã hoàn tất phiếu và lưu trữ PDF'
                }
            ],
            pdfUrl: `/files/signed-orders/${order.code}.pdf` // Mock URL
        };
        setStockOrders(stockOrders.map(o => o.id === order.id ? updatedOrder : o));
        message.success('Đã hoàn tất phiếu và đồng bộ tệp PDF chữ ký');
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('stock-order-printable');
        if (element) {
            const opt = {
                margin: 0, 
                filename: `SIRA-${order.code}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            // Using Worker API to ensure filename is forced via jsPDF directly
            html2pdf()
                .from(element)
                .set(opt)
                .toPdf()
                .get('pdf')
                .then((pdf: any) => {
                    pdf.save(`SIRA-${order.code}.pdf`);
                });
        } else {
            message.error('Không tìm thấy vùng in');
        }
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'materialName', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
        { title: 'Yêu cầu (PM)', dataIndex: 'requestedQuantity', key: 'req', align: 'right' as const },
        { title: 'Thực xuất (Kho)', dataIndex: 'issuedQuantity', key: 'iss', align: 'right' as const, render: (v: number) => <Text strong style={{ color: '#1890ff' }}>{v}</Text> },
        { 
            title: 'Thực nhận (GS)', 
            dataIndex: 'receivedQuantity', 
            key: 'rec', 
            align: 'right' as const,
            render: (v: number, record: { issuedQuantity: number }) => v !== undefined ? (
                <Text strong style={{ color: v < record.issuedQuantity ? '#ff4d4f' : '#52c41a' }}>{v}</Text>
            ) : <Text type="secondary">—</Text>
        },
        { title: 'Đơn giá', dataIndex: 'unitCost', key: 'cost', align: 'right' as const, render: (v: number) => v.toLocaleString() + 'đ' }
    ];

    return (
        <div style={{ width: '100%', padding: '0 24px' }}>
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
                        <Button icon={<EyeOutlined />} onClick={() => setIsPrintModalOpen(true)}>
                            Xem bản ký
                        </Button>
                        {order.status === 'RECEIVED' && (
                            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleFinalize}>
                                Hoàn tất & Lưu trữ PDF
                            </Button>
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
                            rowKey={(r: any, i) => `${r.materialId || i}-${i}`}
                        />
                    </Col>

                    <Col span={8}>
                        <Card title={<Space><SignatureOutlined /> Quy trình Ký duyệt & Chốt sổ</Space>} size="small">
                            {/* PM / REQUESTER (Show either original or new signature button) */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>1. Người lập (PM)</Text>
                                {order.signatures?.find((s: StockOrderSignature) => s.role === 'pm') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s: StockOrderSignature) => s.role === 'pm')?.signatureDataUrl} style={{ height: 60 }} />
                                        <div style={{ fontSize: 11, color: '#888' }}>Đã ký lúc {new Date(order.signatures.find((s: StockOrderSignature) => s.role === 'pm')!.signedAt).toLocaleString()}</div>
                                    </div>
                                ) : (
                                    <>
                                        <Button block type="dashed" size="small" style={{ marginTop: 8 }} icon={<SignatureOutlined />} onClick={() => { setSigningRole('pm'); setIsSignatureModalOpen(true); }}>
                                            PM Ký xác nhận
                                        </Button>
                                        {cachedSignatures['pm'] && (
                                            <div style={{ marginTop: 8, padding: 8, background: '#f9f9f9', borderRadius: 4, textAlign: 'center' }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>Chữ ký PM cũ (Click dùng nhanh):</Text><br/>
                                                <img src={cachedSignatures['pm']} style={{ height: 40, cursor: 'pointer' }} onClick={() => handleUseCachedSignature('pm')} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* ACCOUNTANT */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>2. Kế toán duyệt</Text>
                                {order.signatures?.find((s: StockOrderSignature) => s.role === 'accountant') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s: StockOrderSignature) => s.role === 'accountant')?.signatureDataUrl} style={{ height: 60 }} />
                                    </div>
                                ) : (
                                    <>
                                        <Button block type={order.status === 'REQUESTED' ? 'primary' : 'default'} disabled={order.status !== 'REQUESTED'} size="small" style={{ marginTop: 8 }} icon={<CheckCircleOutlined />} onClick={() => { setSigningRole('accountant'); setIsSignatureModalOpen(true); }}>
                                            Kế toán Duyệt & Ký
                                        </Button>
                                        {cachedSignatures['accountant'] && (
                                            <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>Dùng nhanh chữ ký Kế toán:</Text><br/>
                                                <img src={cachedSignatures['accountant']} style={{ height: 40, cursor: 'pointer' }} onClick={() => handleUseCachedSignature('accountant')} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* WAREHOUSE */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>3. Thủ kho xuất</Text>
                                {order.signatures?.find((s: StockOrderSignature) => s.role === 'warehouse') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s: StockOrderSignature) => s.role === 'warehouse')?.signatureDataUrl} style={{ height: 60 }} />
                                    </div>
                                ) : (
                                    <>
                                        <Button block type={order.status === 'APPROVED' ? 'primary' : 'default'} disabled={order.status !== 'APPROVED'} size="small" style={{ marginTop: 8 }} icon={<CarOutlined />} onClick={() => { setSigningRole('warehouse'); setIsSignatureModalOpen(true); }}>
                                            Kho Xuất & Ký
                                        </Button>
                                        {cachedSignatures['warehouse'] && (
                                            <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                                <img src={cachedSignatures['warehouse']} style={{ height: 40, cursor: 'pointer' }} onClick={() => handleUseCachedSignature('warehouse')} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* SUPERVISOR */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>4. Giám sát nhận</Text>
                                {order.signatures?.find((s: StockOrderSignature) => s.role === 'supervisor') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s: StockOrderSignature) => s.role === 'supervisor')?.signatureDataUrl} style={{ height: 60 }} />
                                    </div>
                                ) : (
                                    <>
                                        <Button block type={order.status === 'DISPATCHED' ? 'primary' : 'default'} disabled={order.status !== 'DISPATCHED'} size="small" style={{ marginTop: 8 }} icon={<HomeOutlined />} onClick={() => { setSigningRole('supervisor'); setIsSignatureModalOpen(true); }}>
                                            GS Nhận & Ký
                                        </Button>
                                        {cachedSignatures['supervisor'] && (
                                            <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                                <img src={cachedSignatures['supervisor']} style={{ height: 40, cursor: 'pointer' }} onClick={() => handleUseCachedSignature('supervisor')} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

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
                            {order.history?.map((h: any, i: number) => (
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
                <SiraSignaturePad 
                    onSave={handleSign} 
                    title={`Chữ ký của ${signingRole === 'accountant' ? 'Kế toán' : signingRole === 'warehouse' ? 'Thủ kho' : 'Giám sát'}`}
                    description="Vui lòng ký vào khung bên dưới và bấm Xác nhận" 
                />
            </Modal>

            {/* Modal Xem bản ký */}
            <Modal
                title={null}
                open={isPrintModalOpen}
                onCancel={() => setIsPrintModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPrintModalOpen(false)}>
                        Đóng
                    </Button>,
                    <Button key="print" icon={<FilePdfOutlined />} onClick={() => window.print()}>
                        In ấn
                    </Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
                        Tải PDF
                    </Button>
                ]}
                width={850}
                style={{ top: 20 }}
                centered={false}
            >
                <div style={{ padding: '20px 0', background: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
                    <StockOrderPrintable order={order} />
                </div>
            </Modal>
        </div>
    );
};

export default StockOrderDetail;
