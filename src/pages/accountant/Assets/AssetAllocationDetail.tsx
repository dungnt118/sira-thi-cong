import {
    ArrowLeftOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DownloadOutlined, FilePdfOutlined,
    HomeOutlined,
    SignatureOutlined,
    ToolOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    Grid,
    Modal,
    Result,
    Row,
    Space,
    Spin,
    Steps,
    Tag,
    Typography,
    message
} from 'antd';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SignaturePad from '../../../components/common/SignaturePad';
import { useAuth } from '../../../hooks/useAuth';
import { assetService } from '../../../services/core-contracts/services/asset.service';
import { assetAllocationService } from '../../../services/core-contracts/services/assetAllocation.service';
import type { AssetAllocationStatusEnum, IAssetAllocation, ISignatureImageItem } from '../../../services/core-contracts/types/assetAllocation.types';
import { ACCESS_TOKEN, UPLOAD_URL, get, getFileLink } from '../../../services/storeService';
import AssetAllocationPrintable from './components/AssetAllocationPrintable';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AssetAllocationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<IAssetAllocation | null>(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [signingRole, setSigningRole] = useState<'accountant' | 'borrower' | null>(null);

    const fetchOrder = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await assetAllocationService.findAssetAllocationDto(id);
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

    const getStatusInfo = (status: AssetAllocationStatusEnum) => {
        switch (status) {
            case 'requested': return { color: 'processing', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> };
            case 'approved': return { color: 'cyan', text: 'Đã duyệt', icon: <CheckCircleOutlined /> };
            case 'received': return { color: 'blue', text: 'Đang mượn', icon: <CarOutlined /> };
            case 'returned': return { color: 'success', text: 'Đã hoàn trả', icon: <HomeOutlined /> };
            case 'completed': return { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> };
            case 'rejected': return { color: 'error', text: 'Từ chối', icon: <WarningOutlined /> };
            default: return { color: 'default', text: (status as string)?.toUpperCase(), icon: null };
        }
    };

    const steps = [
        { title: 'Yêu cầu mượn' },
        { title: 'Kế toán duyệt xuất' },
        { title: 'Người mượn Ký nhận' },
        { title: 'Đang sử dụng' },
    ];

    const getCurrentStep = (status: AssetAllocationStatusEnum) => {
        if (status === 'requested') return 0;
        if (status === 'approved') return 1;
        if (status === 'received') return 2;
        if (status === 'returned' || status === 'completed') return 3;
        return 0;
    };

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

    const uploadSignatureFile = async (dataUrl: string, role: string): Promise<string> => {
        const file = dataUrlToFile(dataUrl, `sig_${role}_${Date.now()}.png`);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'signatures/asset-allocations');

        const uploadUrl = get(UPLOAD_URL) || '/api/file/upload';
        const token = get(ACCESS_TOKEN);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        if (!response.ok) throw new Error(`Upload lỗi: ${response.status}`);
        const result = await response.json();
        const data = result.result || result;
        return data.file_path || data.file_id || data.url;
    };

    const handleSign = async (dataUrl: string) => {
        if (!order || !signingRole) return;
        setLoading(true);

        try {
            // 1. Upload signature to server
            const fileRef = await uploadSignatureFile(dataUrl, signingRole);

            // 2. Prepare signature item
            const newSignature: ISignatureImageItem = {
                role: signingRole,
                user_name: signingRole === 'accountant' ? 'Kế toán' : (order.requested_by?.displayName || order.requested_by || 'Người mượn'),
                user_id: user?._id || 'unknown',
                signed_at: new Date().toISOString(),
                signature_data_url: fileRef
            };

            // 3. Determine next status
            let nextStatus: AssetAllocationStatusEnum = order.status || 'requested';
            if (order.status === 'requested' && signingRole === 'accountant') nextStatus = 'approved';
            if (order.status === 'approved' && signingRole === 'borrower') nextStatus = 'received';

            const updatedSignatures = [...(order.signature_image || []), newSignature];

            // 4. Update Allocation Record
            await assetAllocationService.updateAssetAllocation(order._id, {
                status: nextStatus as any,
                signature_image: updatedSignatures
            });

            // 5. Automation: Update Asset status if finalized
            if (nextStatus === 'received' && order.asset_id) {
                await assetService.updateAsset(order.asset_id, {
                    status: 'in_use',
                    assigned_to: order.requested_by?.displayName || order.requested_by,
                    current_allocation_id: order._id
                });
            }

            message.success(`Đã ký xác nhận thành công`);
            await fetchOrder();
        } catch (e) {
            message.error('Lỗi khi ký xác nhận');
        } finally {
            setLoading(false);
            setIsSignatureModalOpen(false);
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('asset-allocation-printable');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `BienBan_${order?.code || 'ASSET'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (loading && !order) {
        return <div style={{ padding: 100, textAlign: 'center' }}><Spin size="large" tip="Đang tải phiếu..." /></div>;
    }

    if (!order) {
        return <Result status="404" title="Không tìm thấy phiếu" subTitle="Phiếu cấp phát tài sản này không tồn tại." />;
    }

    const currentStep = getCurrentStep(order.status || 'requested');

    return (
        <div style={{ width: '100%', padding: isMobile ? '0 0 24px' : '0 24px 40px' }}>
            <Card bordered={false} bodyStyle={{ padding: isMobile ? '16px 0' : '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isMobile ? 24 : 32, alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Space size="middle" style={{ minWidth: 0 }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/kt/assets/allocation-history')} />
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Phiếu Yêu cầu Cấp phát / Mượn Tài sản</Text>
                            <Title level={4} style={{ margin: 0 }}>{order.code || 'ALLOC-ORD'}</Title>
                        </div>
                    </Space>
                    <Space wrap style={isMobile ? { width: '100%' } : undefined}>
                        <Button icon={<FilePdfOutlined />} onClick={() => setIsPrintModalOpen(true)}>Xem Biên bản</Button>
                        {order.status === 'received' && (
                            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Tải PDF</Button>
                        )}
                    </Space>
                </div>

                <div style={{ overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 8 : 0 }}>
                    <Steps
                        current={currentStep}
                        items={steps}
                        size={isMobile ? 'small' : 'default'}
                        responsive={false}
                        style={{ marginBottom: isMobile ? 24 : 48, padding: isMobile ? 0 : '0 24px', minWidth: isMobile ? 480 : undefined }}
                    />
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card size="small" title="Thông tin chung" style={{ borderRadius: 12, marginBottom: 24 }}>
                            <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Ngày yêu cầu">{order.request_date ? dayjs(order.request_date).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    <Tag color={getStatusInfo(order.status || 'requested').color} icon={getStatusInfo(order.status || 'requested').icon}>
                                        {getStatusInfo(order.status || 'requested').text}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Người yêu cầu">{order.requested_by?.displayName || order.requested_by || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Hành trình sử dụng">{order.journey_name || '—'}</Descriptions.Item>
                                <Descriptions.Item label="Ngày trả dự kiến">{order.expected_return_date ? dayjs(order.expected_return_date).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
                                <Descriptions.Item label="Mục đích">{order.notes || 'Sử dụng cho công việc chuyên môn'}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card size="small" title="Tài sản bàn giao" style={{ borderRadius: 12 }}>
                            <div style={{ padding: 8 }}>
                                <Row gutter={[12, 12]} align="middle">
                                    <Col xs={24} sm={6} style={{ textAlign: isMobile ? 'center' : 'left' }}>
                                        <div style={{ width: 64, height: 64, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ToolOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={18}>
                                        <Title level={5} style={{ margin: 0 }}>{order.asset_name}</Title>
                                        <Text type="secondary">Mã hiệu: <Text strong>{order.asset_code}</Text></Text>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title={<Space><SignatureOutlined /> Xác nhận & Ký tên</Space>} style={{ borderRadius: 12, marginBottom: 24 }}>
                            {/* ACCOUNTANT */}
                            <div style={{ marginBottom: 24, padding: '12px', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                <Text strong style={{ display: 'block', marginBottom: 12 }}>1. Kế toán Duyệt xuất</Text>
                                {order.signature_image?.find(s => s.role === 'accountant') ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={getFileLink(order.signature_image.find(s => s.role === 'accountant')!.signature_data_url!)} style={{ height: 60 }} alt="KT Ký" />
                                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
                                            Đã duyệt: {dayjs(order.signature_image.find(s => s.role === 'accountant')!.signed_at).format('DD/MM/YY HH:mm')}
                                        </div>
                                    </div>
                                ) : (
                                    <Button block type={order.status === 'requested' ? 'primary' : 'dashed'} disabled={order.status !== 'requested'} icon={<CheckCircleOutlined />} onClick={() => { setSigningRole('accountant'); setIsSignatureModalOpen(true); }}>
                                        Duyệt & Ký tên
                                    </Button>
                                )}
                            </div>

                            {/* BORROWER */}
                            <div style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                <Text strong style={{ display: 'block', marginBottom: 12 }}>2. Người mượn Ký nhận</Text>
                                {order.signature_image?.find(s => s.role === 'borrower') ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={getFileLink(order.signature_image.find(s => s.role === 'borrower')!.signature_data_url!)} style={{ height: 60 }} alt="Borrower Ký" />
                                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
                                            Đã nhận: {dayjs(order.signature_image.find(s => s.role === 'borrower')!.signed_at).format('DD/MM/YY HH:mm')}
                                        </div>
                                    </div>
                                ) : (
                                    <Button block type={order.status === 'approved' ? 'primary' : 'dashed'} disabled={order.status !== 'approved'} icon={<CarOutlined />} onClick={() => { setSigningRole('borrower'); setIsSignatureModalOpen(true); }}>
                                        Xác nhận nhận TS
                                    </Button>
                                )}
                            </div>

                            {order.status === 'received' && (
                                <Alert message="Tài sản đã bàn giao thành công" type="success" showIcon style={{ marginTop: 24 }} />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* Signature Modal */}
            <Modal
                title={`KÝ XÁC NHẬN: ${signingRole === 'accountant' ? 'KẾ TOÁN' : 'NGƯỜI MƯỢN'}`}
                open={isSignatureModalOpen}
                onCancel={() => setIsSignatureModalOpen(false)}
                footer={null}
                width={isMobile ? 'calc(100vw - 24px)' : 450}
                destroyOnClose
            >
                <SignaturePad
                    onSave={handleSign}
                    title={signingRole === 'accountant' ? 'Chữ ký Kế toán' : 'Chữ ký Người nhận'}
                    description="Vui lòng ký vào khung bên dưới để xác nhận bàn giao tài sản"
                />
            </Modal>

            {/* Print Preview Modal */}
            <Modal
                title="Biên bản bàn giao tài sản"
                open={isPrintModalOpen}
                onCancel={() => setIsPrintModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPrintModalOpen(false)}>Đóng</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Tải xuống PDF</Button>
                ]}
                width={isMobile ? 'calc(100vw - 24px)' : 850}
                style={{ top: 20 }}
            >
                <div style={{ padding: '20px 0', background: '#f5f5f5', display: 'flex', justifyContent: 'center', minHeight: 600 }}>
                    <AssetAllocationPrintable order={order} />
                </div>
            </Modal>
        </div>
    );
};

export default AssetAllocationDetail;
