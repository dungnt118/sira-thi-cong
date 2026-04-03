import React, { useState, useMemo, useEffect } from 'react';
import {
    Card, Row, Col, Typography, Table, Tag, Button,
    Space, Steps, message, Modal,
    Alert, Descriptions, Result, Spin
} from 'antd';
import {
    ArrowLeftOutlined, FilePdfOutlined, CheckCircleOutlined,
    ClockCircleOutlined, WarningOutlined, SignatureOutlined,
    CarOutlined, HomeOutlined, DownloadOutlined, EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import type {
    IStockOrder,
    IStockOrderSignatureItem,
    StockOrderSignatureRole,
    StockOrderStatusEnum
} from '../../../services/core-contracts/types/stockOrder.types';
import SiraSignaturePad from '../../../components/common/SignaturePad';
import StockOrderPrintable from './components/StockOrderPrintable';
import html2pdf from 'html2pdf.js';

const { Title, Text } = Typography;

type SigningRoleUi = 'kt' | 'warehouse' | 'gs';

const SIGN_STEP_ORDER: Record<SigningRoleUi, number> = { kt: 2, warehouse: 3, gs: 4 };

function stockOrderSigByRole(order: IStockOrder | null, role: StockOrderSignatureRole) {
    return order?.signatures?.find((s) => s.role === role);
}

/** Bản ghi cũ chỉ có `signature_image` (ghi đè mỗi lần ký) — ánh xạ tạm sang cột KT khi đã duyệt và chưa có dòng kt trong `signatures`. */
function legacyKtSignatureDataUrl(order: IStockOrder): string | undefined {
    if (order.signatures?.some((s) => s.role === 'kt')) return undefined;
    if (!order.signature_image) return undefined;
    if (['approved', 'dispatched', 'received', 'completed', 'discrepancy'].includes(order.status || '')) {
        return order.signature_image;
    }
    return undefined;
}

const StockOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<IStockOrder | null>(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [signingRole, setSigningRole] = useState<string | null>(null);

    const fetchOrder = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await stockOrderService.findStockOrderDto(id);
            if (res) {
                setOrder(res);
            }
        } catch (error) {
            message.error('Không thể tải chi tiết phiếu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: 100, textAlign: 'center' }}>
                <Spin size="large" tip="Đang tải thông tin phiếu..." />
            </div>
        );
    }

    if (!order) {
        return <Result status="404" title="Không tìm thấy phiếu" subTitle="Phiếu nhập/xuất này không tồn tại hoặc đã bị xóa." />;
    }

    const getStatusInfo = (status?: string) => {
        const s = status || 'draft';
        switch (s) {
            case 'draft': return { color: 'default', text: 'Nháp', icon: <ClockCircleOutlined /> };
            case 'requested': return { color: 'processing', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> };
            case 'approved': return { color: 'cyan', text: 'Đã duyệt', icon: <CheckCircleOutlined /> };
            case 'dispatched': return { color: 'purple', text: 'Đang giao', icon: <CarOutlined /> };
            case 'received': return { color: 'blue', text: 'Đã nhận', icon: <HomeOutlined /> };
            case 'completed': return { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> };
            case 'discrepancy': return { color: 'error', text: 'Thiếu hụt', icon: <WarningOutlined /> };
            case 'cancelled': return { color: 'error', text: 'Đã hủy', icon: <WarningOutlined /> };
            default: return { color: 'default', text: s.toUpperCase(), icon: null };
        }
    };

    const steps = [
        { title: 'Lập yêu cầu', description: 'PM' },
        { title: 'Duyệt phiếu', description: 'Kế toán' },
        { title: 'Xuất kho', description: 'Kho' },
        { title: 'Nhận hàng', description: 'Giám sát' },
        { title: 'Hoàn tất', description: 'Lưu trữ' }
    ];

    const getCurrentStep = (status?: string) => {
        const s = status || 'draft';
        if (s === 'draft' || s === 'requested') return 0;
        if (s === 'approved') return 1;
        if (s === 'dispatched') return 2;
        if (s === 'received' || s === 'discrepancy') return 3;
        if (s === 'completed') return 4;
        return 0;
    };

    const handleSign = async (dataUrl: string) => {
        if (!signingRole || !id) return;

        try {
            let nextStatus: StockOrderStatusEnum = (order.status || 'requested') as any;
            if (order.status === 'requested' && signingRole === 'kt') nextStatus = 'approved';
            if (order.status === 'approved' && signingRole === 'warehouse') nextStatus = 'dispatched';
            if (order.status === 'dispatched' && signingRole === 'gs') nextStatus = 'received';

            const roleKey = signingRole as SigningRoleUi;
            const nowIso = new Date().toISOString();
            const signerRef =
                (user as any)?.username ||
                (user as any)?.email ||
                (user as any)?._id ||
                undefined;

            const newEntry: IStockOrderSignatureItem = {
                role: roleKey as StockOrderSignatureRole,
                step_order: SIGN_STEP_ORDER[roleKey],
                signature_data_url: dataUrl,
                signed_at: nowIso,
                signed_by: signerRef
            };
            const prevSigs = order.signatures || [];
            const signatures: IStockOrderSignatureItem[] = [
                ...prevSigs.filter((s) => s.role !== roleKey),
                newEntry
            ];

            await stockOrderService.updateStockOrder(id, {
                status: nextStatus,
                signatures,
                signature_image: dataUrl,
                signed_at: nowIso,
                signed_by: signerRef as any
            });

            message.success(`Đã ký xác nhận thành công với vai trò ${signingRole.toUpperCase()}`);
            setIsSignatureModalOpen(false);
            fetchOrder();
        } catch (error) {
            message.error('Lỗi khi ký xác nhận');
        }
    };

    const handleFinalize = async () => {
        if (!id) return;
        try {
            await stockOrderService.updateStockOrder(id, { status: 'completed' });
            message.success('Đã hoàn tất phiếu và lưu trữ');
            fetchOrder();
        } catch (error) {
            message.error('Lỗi khi hoàn tất phiếu');
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('stock-order-printable');
        if (element && order) {
            const fileName = `SIRA-${order.code || order._id}.pdf`;
            const opt = {
                margin: 10,
                filename: fileName,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            const msgKey = 'pdf_gen_loading';
            message.loading({ content: 'Đang khởi tạo bản in...', key: msgKey, duration: 0 });

            html2pdf()
                .from(element)
                .set(opt)
                .toPdf()
                .output('blob')
                .then((blob: Blob) => {
                    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(pdfBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                        message.success({ content: 'Đã tải xuống thành công!', key: msgKey, duration: 2 });
                    }, 100);
                })
                .catch((err: any) => {
                    message.error({ content: 'Lỗi khi tạo PDF', key: msgKey, duration: 4 });
                });
        }
    };

    const itemColumns = [
        { title: 'Vật tư', dataIndex: 'material_name', key: 'name' },
        { title: 'ĐVT', dataIndex: 'unit', key: 'unit', render: (u: string) => u?.toUpperCase() },
        { title: 'Yêu cầu', dataIndex: 'requested_quantity', key: 'req', align: 'right' as const },
        { title: 'Thực xuất', dataIndex: 'issued_quantity', key: 'iss', align: 'right' as const, render: (v: number) => <Text strong style={{ color: '#1890ff' }}>{v || 0}</Text> },
        {
            title: 'Thực nhận',
            dataIndex: 'received_quantity',
            key: 'rec',
            align: 'right' as const,
            render: (v: number, record: any) => v !== undefined ? (
                <Text strong style={{ color: v < (record.issued_quantity || 0) ? '#ff4d4f' : '#52c41a' }}>{v}</Text>
            ) : <Text type="secondary">—</Text>
        },
        { title: 'Đơn giá', dataIndex: 'unit_cost', key: 'cost', align: 'right' as const, render: (v: number) => (v || 0).toLocaleString() + 'đ' }
    ];

    return (
        <div style={{ width: '100%', padding: '0 24px' }}>
            <Card bordered={false} className="order-detail-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/kt/inventory')} />
                        <div>
                            <Text type="secondary">{order.type === 'out' ? 'Phiếu Xuất Kho' : 'Phiếu Nhập Kho'}</Text>
                            <Title level={4} style={{ margin: 0 }}>{order.code || order._id}</Title>
                        </div>
                    </Space>
                    <Space>
                        <Button icon={<EyeOutlined />} onClick={() => setIsPrintModalOpen(true)}>
                            Xem bản ký
                        </Button>
                        {order.status === 'received' && (
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
                            <Descriptions.Item label="Ngày tạo">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusInfo(order.status).color} icon={getStatusInfo(order.status).icon}>
                                    {getStatusInfo(order.status).text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Dự án/Hành trình" span={2}>
                                {order.journey_code ? `[${order.journey_code}] ${order.journey_name}` : (order.source === 'distributor' ? 'Nhà phân phối' : 'Khác')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>{order.notes || 'Không có ghi chú'}</Descriptions.Item>
                        </Descriptions>

                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Danh sách vật tư</Text>
                        <Table
                            dataSource={order.items || []}
                            columns={itemColumns}
                            pagination={false}
                            size="small"
                            rowKey={(r: any, i) => `${r.material_id || i}-${i}`}
                        />
                    </Col>

                    <Col span={8}>
                        <Card title={<Space><SignatureOutlined /> Quy trình Ký duyệt</Space>} size="small">
                            {/* PM / REQUESTER */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>1. Người lập (PM)</Text>
                                <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>Đã xác nhận hệ thống</Text>
                                    {stockOrderSigByRole(order, 'pm')?.signature_data_url && (
                                        <div style={{ marginTop: 8 }}>
                                            <img src={stockOrderSigByRole(order, 'pm')!.signature_data_url} style={{ height: 50 }} alt="PM ký" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ACCOUNTANT */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>2. Kế toán duyệt</Text>
                                {order.status !== 'requested' ? (
                                    <div style={{ marginTop: 8, textAlign: 'center', background: '#f6ffed', padding: 8, borderRadius: 4 }}>
                                        <Tag color="success">ĐÃ DUYỆT</Tag>
                                        {(stockOrderSigByRole(order, 'kt')?.signature_data_url || legacyKtSignatureDataUrl(order)) && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={stockOrderSigByRole(order, 'kt')?.signature_data_url || legacyKtSignatureDataUrl(order)}
                                                    style={{ height: 50 }}
                                                    alt="Kế toán ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button block type="primary" size="small" style={{ marginTop: 8 }} icon={<CheckCircleOutlined />} onClick={() => { setSigningRole('kt'); setIsSignatureModalOpen(true); }}>
                                        Kế toán Duyệt & Ký
                                    </Button>
                                )}
                            </div>

                            {/* WAREHOUSE */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>3. Thủ kho xuất</Text>
                                {['dispatched', 'received', 'completed'].includes(order.status || '') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center', background: '#f6ffed', padding: 8, borderRadius: 4 }}>
                                        <Tag color="success">ĐÃ XUẤT KHO</Tag>
                                        {stockOrderSigByRole(order, 'warehouse')?.signature_data_url && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={stockOrderSigByRole(order, 'warehouse')!.signature_data_url}
                                                    style={{ height: 50 }}
                                                    alt="Thủ kho ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button block type={order.status === 'approved' ? 'primary' : 'default'} disabled={order.status !== 'approved'} size="small" style={{ marginTop: 8 }} icon={<CarOutlined />} onClick={() => { setSigningRole('warehouse'); setIsSignatureModalOpen(true); }}>
                                        Kho Xuất & Ký
                                    </Button>
                                )}
                            </div>

                            {/* SUPERVISOR */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>4. Giám sát nhận</Text>
                                {['received', 'completed'].includes(order.status || '') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center', background: '#f6ffed', padding: 8, borderRadius: 4 }}>
                                        <Tag color="success">ĐÃ NHẬN HÀNG</Tag>
                                        {stockOrderSigByRole(order, 'gs')?.signature_data_url && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={stockOrderSigByRole(order, 'gs')!.signature_data_url}
                                                    style={{ height: 50 }}
                                                    alt="Giám sát ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button block type={order.status === 'dispatched' ? 'primary' : 'default'} disabled={order.status !== 'dispatched'} size="small" style={{ marginTop: 8 }} icon={<HomeOutlined />} onClick={() => { setSigningRole('gs'); setIsSignatureModalOpen(true); }}>
                                        GS Nhận & Ký
                                    </Button>
                                )}
                            </div>

                            {(order.status === 'received' || order.status === 'completed') && (
                                <Alert
                                    message={order.status === 'completed' ? "Phiếu đã được lưu trữ an toàn" : "Đang chờ Kế toán chốt & lưu trữ PDF"}
                                    type={order.status === 'completed' ? "success" : "info"}
                                    showIcon
                                    style={{ marginTop: 12 }}
                                />
                            )}
                        </Card>

                        {order.notes && (
                            <Card title="Ghi chú hệ thống" size="small" style={{ marginTop: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>{order.notes}</Text>
                            </Card>
                        )}
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
                    title={`Chữ ký của ${signingRole === 'kt' ? 'Kế toán' : signingRole === 'warehouse' ? 'Thủ kho' : 'Giám sát'}`}
                    description="Vui lòng ký vào khung bên dưới và bấm Xác nhận"
                />
            </Modal>

            <Modal
                title={null}
                open={isPrintModalOpen}
                onCancel={() => setIsPrintModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPrintModalOpen(false)}>Đóng</Button>,
                    <Button key="print" icon={<FilePdfOutlined />} onClick={() => window.print()}>In ấn</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Tải PDF</Button>
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
