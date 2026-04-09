import {
    ArrowLeftOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DownloadOutlined, EyeOutlined,
    FilePdfOutlined,
    HomeOutlined,
    SignatureOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    Grid,
    Modal,
    Result,
    Row,
    Space,
    Spin,
    Steps,
    Table, Tag,
    Typography,
    message
} from 'antd';
import html2pdf from 'html2pdf.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import { PdfViewer } from '../../../components/common/PdfViewer';
import SignaturePad from '../../../components/common/SignaturePad';
import { useAuth } from '../../../hooks/useAuth';
import { stockOrderService } from '../../../services/core-contracts/services/stockOrder.service';
import type {
    ISignaturesItem,
    IStockOrder,
    SignaturesRoleEnum,
    StockOrderStatusEnum
} from '../../../services/core-contracts/types/stockOrder.types';
import { ACCESS_TOKEN, UPLOAD_URL, get, getFileLink } from '../../../services/storeService';
import {
    classifyJourneyFile,
    getJourneyFileDisplayName,
    resolveJourneyFileHref,
    resolvePdfPreviewHref,
    type JourneyFileKind,
} from '../../../utils/journeyDocumentFileDisplay';
import StockOrderPrintable from './components/StockOrderPrintable';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type SigningRoleUi = 'kt' | 'warehouse' | 'gs';

const SIGN_STEP_ORDER: Record<SigningRoleUi, number> = { kt: 2, warehouse: 3, gs: 4 };

function stockOrderSigByRole(order: IStockOrder | null, role: SignaturesRoleEnum) {
    return order?.signatures?.find((s) => s.role === role);
}

/** Bản ghi cũ chỉ có `signature_image` (ghi đè mỗi lần ký) — ánh xạ tạm sang cột KT khi đã duyệt và chưa có dòng kt trong `signatures`. */
function legacyKtSignatureDataUrl(order: IStockOrder): string | undefined {
    if (order.signatures?.some((s) => s.role === 'kt')) return undefined;
    // @ts-ignore
    if (!order.signature_image) return undefined;
    if (['approved', 'dispatched', 'received', 'completed', 'discrepancy'].includes(order.status || '')) {
        // @ts-ignore
        return order.signature_image;
    }
    return undefined;
}

const StockOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<IStockOrder | null>(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [signingRole, setSigningRole] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<{
        kind: JourneyFileKind;
        url: string;
        name: string;
    } | null>(null);

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

    if (loading && !order) {
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

    const ResponsiveSteps = () => {
        const current = getCurrentStep(order.status);

        if (!isMobile) {
            return (
                <Steps
                    current={current}
                    items={steps}
                    style={{ marginBottom: 40 }}
                />
            );
        }

        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 8px',
                marginBottom: 32,
                padding: '0 8px'
            }}>
                {steps.map((step, index) => {
                    const isActive = index === current;
                    const isDone = index < current;

                    let bgColor = '#fff';
                    let borderColor = 'rgba(0, 0, 0, 0.25)';
                    let textColor = 'rgba(0, 0, 0, 0.45)';
                    let iconNode: React.ReactNode = index + 1;

                    if (isActive) {
                        borderColor = '#1890ff';
                        textColor = 'rgba(0, 0, 0, 0.85)';
                        bgColor = '#e6f7ff';
                    } else if (isDone) {
                        borderColor = '#1890ff';
                        textColor = 'rgba(0, 0, 0, 0.85)';
                        iconNode = <CheckCircleOutlined style={{ color: '#1890ff' }} />;
                    }

                    return (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: '1 0 30%',
                            minWidth: '100px',
                            opacity: isDone || isActive ? 1 : 0.6
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: `1px solid ${borderColor}`,
                                backgroundColor: bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8,
                                fontSize: 12,
                                color: isActive ? '#1890ff' : 'inherit',
                                flexShrink: 0
                            }}>
                                {iconNode}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: textColor, whiteSpace: 'nowrap' }}>
                                {step.title}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Chuyển đổi DataURL sang File để upload
    const dataUrlToFile = (dataUrl: string, fileName: string) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    };

    // Upload chữ ký lên server để lấy URL lưu trữ (thông tin file chuẩn từ Headless API)
    const uploadSignatureFile = async (dataUrl: string, role: string): Promise<string> => {
        const file = dataUrlToFile(dataUrl, `signature_${role}.png`);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'signatures/stock-orders');

        const uploadUrl = get(UPLOAD_URL) || '/api/file/upload';
        const token = get(ACCESS_TOKEN);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload lỗi: ${response.status}`);
        }

        const result = await response.json();
        const data = result.result || result;

        const fileRef = data.file_path || data.file_id || data.url;
        if (!fileRef) {
            throw new Error('Server không trả về mã định danh file hợp lệ');
        }
        return fileRef;
    };

    // Upload file PDF minh chứng lên server
    const uploadPdfFile = async (blob: Blob, fileName: string): Promise<any> => {
        const formData = new FormData();
        formData.append('file', blob, fileName);
        formData.append('folder', 'signatures/stock-orders/pdf');

        const uploadUrl = get(UPLOAD_URL) || '/api/file/upload';
        const token = get(ACCESS_TOKEN);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload PDF lỗi: ${response.status}`);
        }

        const result = await response.json();
        return result.result || result;
    };

    const MaterialListMobile = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {(order.items || []).map((item, index) => (
                    <Card
                        key={index}
                        size="small"
                        styles={{ body: { padding: '8px 12px' } }}
                        style={{ borderRadius: 6, border: '1px solid #f0f0f0' }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: '#262626' }}>
                            {item.material_name}
                        </div>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: 11 }}>ĐVT:</Text>
                                <div style={{ fontSize: 12 }}>{item.unit?.toUpperCase()}</div>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Đơn giá:</Text>
                                <div style={{ fontSize: 12 }}>{(item.unit_cost || 0).toLocaleString()}đ</div>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Yêu cầu:</Text>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.requested_quantity || 0}</div>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Thực xuất:</Text>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#1890ff' }}>{item.issued_quantity || 0}</div>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Thực nhận:</Text>
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: (item.received_quantity !== undefined && item.received_quantity < (item.issued_quantity || 0)) ? '#ff4d4f' : '#52c41a'
                                }}>
                                    {item.received_quantity !== undefined ? item.received_quantity : '—'}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
        );
    };
    const handleSign = async (dataUrl: string, strokeData: any) => {

        setLoading(true);
        try {
            const uploadedRef = await uploadSignatureFile(dataUrl, signingRole!);

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

            const newEntry: ISignaturesItem = {
                role: roleKey as SignaturesRoleEnum,
                step_order: SIGN_STEP_ORDER[roleKey],
                signature_image: uploadedRef,
                signature_stroke_data: strokeData,
                signed_at: nowIso,
                signed_by: signerRef
            };
            const prevSigs = order.signatures || [];
            const signatures: ISignaturesItem[] = [
                ...prevSigs.filter((s) => s.role !== roleKey),
                newEntry
            ];

            await stockOrderService.updateStockOrder(id!, {
                status: nextStatus,
                signatures,
                signed_at: nowIso,
                signed_by: signerRef as any
            });

            message.success(`Đã ký xác nhận thành công với vai trò ${signingRole!.toUpperCase()}`);
            setIsSignatureModalOpen(false);
            fetchOrder();
        } catch (error) {
            console.error('Lỗi khi ký:', error);
            message.error('Không thể hoàn tất quá trình ký duyệt');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        console.log('Finalize button clicked');
        if (!id || !order) return;

        const msgKey = 'finalizing_order';
        message.loading({ content: 'Bắt đầu quá trình lưu trữ...', key: msgKey, duration: 0 });
        setLoading(true);

        const element = document.getElementById('stock-order-printable-hidden');
        if (!element) {
            message.error({ content: 'Lỗi: Không tìm thấy vùng dữ liệu in ấn', key: msgKey, duration: 3 });
            setLoading(false);
            return;
        }

        try {
            const opt = {
                margin: 10,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            // Sử dụng worker API của html2pdf một cách tường minh
            html2pdf().from(element).set(opt).toPdf().output('blob').then(async (pdfBlob: Blob) => {
                const fileName = `BAC-${order.code || id}-FINAL.pdf`;

                // 2. Upload lên server
                const fileData = await uploadPdfFile(pdfBlob, fileName);

                // 3. Cập nhật record với status completed và pdf_files
                const prevPdfs = order.pdf_files || [];
                await stockOrderService.updateStockOrder(id, {
                    status: 'completed',
                    pdf_files: [...prevPdfs, fileData]
                });

                message.success({ content: 'Đã hoàn tất phiếu và lưu trữ minh chứng thành công!', key: msgKey, duration: 3 });
                fetchOrder();
            }).catch((err: any) => {
                console.error('HTML2PDF Error:', err);
                message.error({ content: 'Lỗi khi tạo file PDF minh chứng', key: msgKey, duration: 4 });
            }).finally(() => {
                setLoading(false);
            });
        } catch (error) {
            console.error('Lỗi tổng quan:', error);
            message.error({ content: 'Lỗi hệ thống khi xử lý hoàn tất', key: msgKey, duration: 4 });
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('stock-order-printable');
        if (element && order) {
            const fileName = `BAC-${order.code || order._id}.pdf`;
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

    const openFilePreview = (file: HeadlessFileUpload) => {
        const kind = classifyJourneyFile(file);
        const url = kind === 'pdf' ? resolvePdfPreviewHref(file) : resolveJourneyFileHref(file);

        if (!url) {
            message.warning('Không tìm thấy đường dẫn file hợp lệ');
            return;
        }
        setFilePreview({
            kind,
            url,
            name: getJourneyFileDisplayName(file)
        });
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
        <div style={{ width: '100%', padding: isMobile ? '0 0 16px' : '0 4px' }}>
            {/* Hidden component for PDF generation when Modal is closed */}
            <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
                <div id="stock-order-printable-hidden">
                    <StockOrderPrintable order={order} />
                </div>
            </div>

            <Card bordered={false} className="order-detail-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
                    <Space style={{ marginBottom: 8, maxWidth: '100%' }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/${role?.toLowerCase()}/inventory/history`)} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{order.type === 'out' ? 'Phiếu Xuất Kho' : 'Phiếu Nhập Kho'}</Text>
                            <Title
                                level={4}
                                style={{
                                    margin: 0,
                                    fontSize: 'clamp(14px, 4.5vw, 18px)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: isMobile ? 'calc(100vw - 172px)' : '200px'
                                }}
                            >
                                {order.code || order._id}
                            </Title>
                        </div>
                    </Space>
                    <Space wrap>
                        <Button icon={<EyeOutlined />} onClick={() => setIsPrintModalOpen(true)}>
                            Xem bản ký
                        </Button>
                        {order.status === 'received' && (
                            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleFinalize}>
                                Hoàn tất & Lưu trữ PDF
                            </Button>
                        )}
                        {order.pdf_files && order.pdf_files.length > 0 && (
                            <Button icon={<DownloadOutlined />} onClick={() => openFilePreview(order.pdf_files![0])}>
                                Xem minh chứng PDF
                            </Button>
                        )}
                    </Space>
                </div>

                <ResponsiveSteps />

                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={16}>
                        <div
                            style={{
                                background: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: 12,
                                padding: 20,
                                marginBottom: 24
                            }}
                        >
                            <Row gutter={[32, 20]}>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Mã phiếu</Text>
                                        <Text strong style={{ fontSize: 15 }}>{order.code || '—'}</Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Trạng thái</Text>
                                        <Tag
                                            color={getStatusInfo(order.status).color}
                                            icon={getStatusInfo(order.status).icon}
                                            style={{ alignSelf: 'flex-start', margin: 0, borderRadius: 10, padding: '0 12px' }}
                                        >
                                            {getStatusInfo(order.status).text}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Dự án / Công trình</Text>
                                        <Text strong style={{ color: '#1890ff' }}>
                                            {order.journey_code ? `[${order.journey_code}] ${order.journey_name}` : (order.source === 'distributor' ? 'Nhà phân phối' : 'Khác')}
                                        </Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Loại phiếu</Text>
                                        <Text strong>{order.type === 'out' ? 'Xuất kho' : 'Nhập kho'}</Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Người tạo</Text>
                                        <Text strong>{(order as any).createdBy?.full_name || (order as any).requested_by?.full_name || (order as any).createdBy || 'Hệ thống'}</Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Thời gian tạo</Text>
                                        <Text strong>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}
                                        </Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Ngày cập nhật</Text>
                                        <Text strong>
                                            {(order as any).updatedAt ? new Date((order as any).updatedAt).toLocaleString('vi-VN') : (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—')}
                                        </Text>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Ghi chú</Text>
                                        <Text>{order.notes || 'Không có ghi chú'}</Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Danh sách vật tư</Text>
                        {isMobile ? (
                            <MaterialListMobile />
                        ) : (
                            <Table
                                dataSource={order.items || []}
                                columns={itemColumns}
                                pagination={false}
                                size="small"
                                rowKey={(r: any, i) => `${r.material_id || i}-${i}`}
                                scroll={{ x: 'max-content' }}
                            />
                        )}
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Card
                            title={<Space><SignatureOutlined /> Quy trình Ký duyệt</Space>}
                            size="small"
                            className="signature-process-card"
                        >
                            {/* PM / REQUESTER */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>1. Người lập (PM)</Text>
                                <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>Đã xác nhận hệ thống</Text>
                                    {stockOrderSigByRole(order, 'pm')?.signature_image && (
                                        <div style={{ marginTop: 8 }}>
                                            <img src={getFileLink(stockOrderSigByRole(order, 'pm')!.signature_image)} style={{ height: 50 }} alt="PM ký" />
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
                                        {(stockOrderSigByRole(order, 'kt')?.signature_image || legacyKtSignatureDataUrl(order)) && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={getFileLink(stockOrderSigByRole(order, 'kt')?.signature_image || legacyKtSignatureDataUrl(order))}
                                                    style={{ height: 50 }}
                                                    alt="Kế toán ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        block
                                        type="primary"
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => { setSigningRole('kt'); setIsSignatureModalOpen(true); }}
                                        disabled={role?.toUpperCase() !== 'KT'}
                                    >
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
                                        {stockOrderSigByRole(order, 'warehouse')?.signature_image && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={getFileLink(stockOrderSigByRole(order, 'warehouse')!.signature_image)}
                                                    style={{ height: 50 }}
                                                    alt="Thủ kho ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        block
                                        type={order.status === 'approved' ? 'primary' : 'default'}
                                        disabled={order.status !== 'approved' || role?.toUpperCase() !== 'KT'}
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        icon={<CarOutlined />}
                                        onClick={() => { setSigningRole('warehouse'); setIsSignatureModalOpen(true); }}
                                    >
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
                                        {stockOrderSigByRole(order, 'gs')?.signature_image && (
                                            <div style={{ marginTop: 8 }}>
                                                <img
                                                    src={getFileLink(stockOrderSigByRole(order, 'gs')!.signature_image)}
                                                    style={{ height: 50 }}
                                                    alt="Giám sát ký"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        block
                                        type={order.status === 'dispatched' ? 'primary' : 'default'}
                                        disabled={order.status !== 'dispatched' || role?.toUpperCase() !== 'GS'}
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        icon={<HomeOutlined />}
                                        onClick={() => { setSigningRole('gs'); setIsSignatureModalOpen(true); }}
                                    >
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
                width={isMobile ? 'calc(100vw - 24px)' : 450}
            >
                <SignaturePad
                    onSave={(dataUrl, strokeData) => handleSign(dataUrl, strokeData)}
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
                width={isMobile ? 'calc(100vw - 24px)' : 850}
                style={{ top: 20 }}
                centered={false}
            >
                <div style={{ padding: '20px 0', background: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
                    <StockOrderPrintable order={order} />
                </div>
            </Modal>

            {/* File preview modal reuse from JourneyDocumentsTab */}
            <Modal
                open={!!filePreview}
                title={filePreview?.name}
                onCancel={() => setFilePreview(null)}
                width={filePreview?.kind === 'pdf' ? 'min(1200px, 96vw)' : isMobile ? 'calc(100vw - 24px)' : 720}
                style={{ top: 0, paddingBottom: 0, margin: '0 auto' }}
                styles={{
                    content:
                        filePreview?.kind === 'pdf'
                            ? {
                                height: '100dvh',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 0,
                                borderRadius: 0,
                                overflow: 'hidden',
                            }
                            : {},
                    header:
                        filePreview?.kind === 'pdf'
                            ? {
                                padding: '12px 16px',
                                marginBottom: 0,
                                borderBottom: '1px solid #f0f0f0',
                                flexShrink: 0,
                            }
                            : {},
                    body:
                        filePreview?.kind === 'pdf'
                            ? {
                                flex: 1,
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                            }
                            : { padding: '16px 24px' },
                }}
                destroyOnHidden
                footer={null}
            >
                {filePreview?.kind === 'pdf' && filePreview.url ? (
                    <PdfViewer url={filePreview.url} title={filePreview.name} height="100%" />
                ) : null}
                {filePreview?.kind === 'image' && filePreview.url ? (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={filePreview.url}
                            alt={filePreview.name}
                            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain' }}
                        />
                    </div>
                ) : null}
                {filePreview?.kind === 'other' && filePreview.url ? (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Text>
                            Định dạng này không xem trực tiếp trên trình duyệt. Hãy tải file về và mở bằng ứng dụng
                            phù hợp.
                        </Text>
                        <Button type="primary" href={filePreview.url} target="_blank" icon={<DownloadOutlined />}>
                            Tải file về
                        </Button>
                    </Space>
                ) : null}
            </Modal>
        </div>
    );
};

export default StockOrderDetail;
