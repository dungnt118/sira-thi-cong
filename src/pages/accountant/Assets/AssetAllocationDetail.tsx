import React, { useState, useMemo } from 'react';
import {
    Card, Row, Col, Typography, Tag, Button,
    Space, Steps, message, Modal,
    Alert, Descriptions, Result
} from 'antd';
import {
    ArrowLeftOutlined, CheckCircleOutlined,
    ClockCircleOutlined, WarningOutlined, SignatureOutlined,
    CarOutlined, HomeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorageData from '../../../hooks/useLocalStorageData';
import {
    AssetAllocation, AssetAllocationStatus, AssetAllocationSignature
} from '../../../types/v3';
import SiraSignaturePad from '../../../components/common/SignaturePad';

const { Title, Text } = Typography;

const AssetAllocationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // We initialize allocations
    const [allocations, setAllocations] = useLocalStorageData<AssetAllocation[]>('ASSET_ALLOCATIONS', []);
    const [cachedSignatures, setCachedSignatures] = useLocalStorageData<Record<string, string>>('CACHED_SIGNATURES', {});

    const order = useMemo(() => allocations.find(o => o.id === id || o.code === id), [allocations, id]);

    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signingRole, setSigningRole] = useState<'KT' | 'borrower' | null>(null);

    if (!order) {
        return <Result status="404" title="Không tìm thấy phiếu" subTitle="Phiếu cấp phát tài sản này không tồn tại hoặc đã bị xóa." />;
    }

    const getStatusInfo = (status: AssetAllocationStatus) => {
        switch (status) {
            case 'REQUESTED': return { color: 'processing', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> };
            case 'APPROVED': return { color: 'cyan', text: 'Đã duyệt', icon: <CheckCircleOutlined /> };
            case 'RECEIVED': return { color: 'blue', text: 'Đang sử dụng', icon: <CarOutlined /> };
            case 'RETURNED': return { color: 'success', text: 'Đã hoàn trả', icon: <HomeOutlined /> };
            case 'COMPLETED': return { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> };
            case 'REJECTED': return { color: 'error', text: 'Từ chối', icon: <WarningOutlined /> };
            default: return { color: 'default', text: status, icon: null };
        }
    };

    const steps = [
        { title: 'Yêu cầu mượn' },
        { title: 'Kế toán duyệt xuất' },
        { title: 'Người mượn Ký nhận' },
        { title: 'Đang sử dụng' },
    ];

    const getCurrentStep = (status: AssetAllocationStatus) => {
        if (status === 'REQUESTED') return 0;
        if (status === 'APPROVED') return 1;
        if (status === 'RECEIVED') return 2;
        if (status === 'RETURNED' || status === 'COMPLETED') return 3;
        return 0;
    };

    const handleSign = (dataUrl: string) => {
        const roleToSign = signingRole;
        if (!roleToSign) return;

        setCachedSignatures({
            ...cachedSignatures,
            [roleToSign]: dataUrl
        });

        const signature: AssetAllocationSignature = {
            role: roleToSign as any,
            userName: roleToSign === 'KT' ? 'Kế toán' : order.requestedBy,
            userId: `user-${roleToSign}`,
            signedAt: new Date().toISOString(),
            signatureDataUrl: dataUrl
        };

        let nextStatus: AssetAllocationStatus = order.status;
        if (order.status === 'REQUESTED' && roleToSign === 'KT') nextStatus = 'APPROVED';
        if (order.status === 'APPROVED' && roleToSign === 'borrower') nextStatus = 'RECEIVED';

        const updatedOrder: AssetAllocation = {
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

        setAllocations(allocations.map(o => o.id === order.id ? updatedOrder : o));

        if (nextStatus === 'RECEIVED') {
            const currentAssetsStr = localStorage.getItem('ASSETS');
            if (currentAssetsStr) {
                try {
                    const assets = JSON.parse(currentAssetsStr);
                    const newAssets = assets.map((a: any) => a.id === order.assetId ? { ...a, status: 'IN_USE', assignedTo: order.requestedBy } : a);
                    localStorage.setItem('ASSETS', JSON.stringify(newAssets));
                } catch (e) { }
            }
        }

        setTimeout(() => {
            setIsSignatureModalOpen(false);
            setSigningRole(null);
        }, 100);

        message.success(`Đã ký xác nhận thành công`);
    };

    const handleUseCachedSignature = (role: string) => {
        const cached = cachedSignatures[role];
        if (cached) {
            setSigningRole(role as any);
            handleSign(cached);
        }
    };

    return (
        <div style={{ width: '100%', padding: '0 24px' }}>
            <Card bordered={false} className="order-detail-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/kt/assets/allocation-history')} />
                        <div>
                            <Text type="secondary">Chi tiết Phiếu Yêu cầu mượn Tài sản</Text>
                            <Title level={4} style={{ margin: 0 }}>{order.code}</Title>
                        </div>
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
                            <Descriptions.Item label="Ngày yêu cầu">{new Date(order.requestDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusInfo(order.status).color} icon={getStatusInfo(order.status).icon}>
                                    {getStatusInfo(order.status).text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Người yêu cầu / mượn">{order.requestedBy}</Descriptions.Item>
                            <Descriptions.Item label="Dự án sử dụng">{order.projectName || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày trả dự kiến">{order.expectedReturnDate ? new Date(order.expectedReturnDate).toLocaleDateString('vi-VN') : '—'}</Descriptions.Item>
                            <Descriptions.Item label="Ghi chú mượn">{order.notes || 'Không có ghi chú'}</Descriptions.Item>
                        </Descriptions>

                        <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fafafa' }}>
                            <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>Thông tin tài sản</Text>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Tên tài sản"><Text strong>{order.assetName}</Text></Descriptions.Item>
                                <Descriptions.Item label="Mã/Serial tài sản">{order.assetCode}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Col>

                    <Col span={8}>
                        <Card title={<Space><SignatureOutlined /> Quy trình Ký nhận</Space>} size="small">
                            {/* ACCOUNTANT */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>1. Kế toán duyệt xuất</Text>
                                {order.signatures?.find((s) => s.role === 'KT') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s) => s.role === 'KT')?.signatureDataUrl} style={{ height: 60 }} />
                                    </div>
                                ) : (
                                    <>
                                        <Button block type={order.status === 'REQUESTED' ? 'primary' : 'dashed'} disabled={order.status !== 'REQUESTED'} size="small" style={{ marginTop: 8 }} icon={<CheckCircleOutlined />} onClick={() => { setSigningRole('KT'); setIsSignatureModalOpen(true); }}>
                                            Kế toán Ký Duyệt
                                        </Button>
                                        {cachedSignatures['KT'] && (
                                            <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, textAlign: 'center' }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>Dùng nhanh chữ ký Kế toán:</Text><br />
                                                <img src={cachedSignatures['KT']} style={{ height: 40, cursor: 'pointer' }} onClick={() => handleUseCachedSignature('KT')} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* BORROWER */}
                            <div style={{ marginBottom: 20 }}>
                                <Text strong>2. Người mượn xác nhận nhận</Text>
                                {order.signatures?.find((s) => s.role === 'borrower') ? (
                                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                                        <img src={order.signatures.find((s) => s.role === 'borrower')?.signatureDataUrl} style={{ height: 60 }} />
                                    </div>
                                ) : (
                                    <>
                                        <Button block type={order.status === 'APPROVED' ? 'primary' : 'dashed'} disabled={order.status !== 'APPROVED'} size="small" style={{ marginTop: 8 }} icon={<CarOutlined />} onClick={() => { setSigningRole('borrower'); setIsSignatureModalOpen(true); }}>
                                            Người mượn Ký nhận
                                        </Button>
                                    </>
                                )}
                            </div>

                            {order.status === 'RECEIVED' && (
                                <Alert
                                    message="Đang sử dụng"
                                    type="success"
                                    showIcon
                                    style={{ marginTop: 12 }}
                                />
                            )}
                        </Card>

                        <Card title="Lịch sử xử lý" size="small" style={{ marginTop: 16 }}>
                            {order.history?.map((h: any, i: number) => (
                                <div key={i} style={{ fontSize: 12, marginBottom: 10 }}>
                                    <Text strong>{h.status}</Text> tác động bởi <Text>{h.updatedBy}</Text>
                                    <div style={{ color: '#999' }}>{new Date(h.updatedAt).toLocaleString('vi-VN')}</div>
                                    {h.comment && <div style={{ fontStyle: 'italic' }}>— {h.comment}</div>}
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Modal
                title={`Ký tên xác nhận: ${signingRole === 'KT' ? 'KẾ TOÁN' : 'NGƯỜI MƯỢN'}`}
                open={isSignatureModalOpen}
                onCancel={() => setIsSignatureModalOpen(false)}
                footer={null}
                width={450}
            >
                <SiraSignaturePad
                    onSave={handleSign}
                    title={signingRole === 'KT' ? 'Chữ ký của Kế toán' : 'Chữ ký của Người mượn'}
                    description="Vui lòng ký vào khung bên dưới và bấm Xác nhận"
                />
            </Modal>
        </div>
    );
};

export default AssetAllocationDetail;
