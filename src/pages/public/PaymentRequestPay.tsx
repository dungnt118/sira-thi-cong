import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, Typography, Spin, Space, Badge, Divider, Layout } from 'antd';
import { SafetyCertificateOutlined, CreditCardOutlined, InfoCircleOutlined } from '@ant-design/icons';
import VietQRSection from '../shared/Expenditures/components/VietQRSection';
import { paymentRequestService } from '@/services/core-contracts/services/paymentRequest.service';
import type { IPaymentRequest } from '@/services/core-contracts/types/paymentRequest.types';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const PublicPaymentRequestPay: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<Partial<IPaymentRequest> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadPaymentRequest = async () => {
            if (!id) return;
            try {
                // Thử fetch dữ liệu qua API (nếu người dùng có session)
                const data = await paymentRequestService.findPaymentRequestDto(id);
                if (data) {
                    setRequest(data);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.warn('API fetch unauthorized or failed. Falling back to URL metadata query params:', error);
            }

            // Fallback: Giải mã thông tin thụ hưởng từ URL Query params (đối với khách vãng lai chưa đăng nhập)
            const bankName = searchParams.get('b');
            const accountNo = searchParams.get('a');
            const accountName = searchParams.get('n');
            const amountStr = searchParams.get('m');
            const description = searchParams.get('d');

            if (accountNo && bankName) {
                const mockRequest: Partial<IPaymentRequest> = {
                    _id: id,
                    code: id.startsWith('PYCCT') ? id : undefined,
                    beneficiary_bank_name_snapshot: decodeURIComponent(bankName),
                    beneficiary_account_number_snapshot: decodeURIComponent(accountNo),
                    beneficiary_name_snapshot: accountName ? decodeURIComponent(accountName) : undefined,
                    amount: amountStr ? Number(amountStr) : undefined,
                    payment_content: description ? decodeURIComponent(description) : 'Thanh toán yêu cầu chi',
                    status: 'approved' // Giả lập trạng thái đã duyệt cho giao diện public thanh toán
                };
                setRequest(mockRequest);
            } else {
                setErrorMessage('Không thể tải thông tin thanh toán công khai. Liên kết thiếu thông tin thụ hưởng.');
            }
            setLoading(false);
        };

        loadPaymentRequest();
    }, [id, searchParams]);

    const getStatusTag = (status?: string) => {
        switch (status) {
            case 'draft': return <Badge status="default" text="Nháp" />;
            case 'pending_approval': return <Badge status="warning" text="Chờ duyệt" />;
            case 'approved': return <Badge status="processing" text="Chờ thanh toán" />;
            case 'paid': return <Badge status="success" text="Đã thanh toán" />;
            case 'rejected': return <Badge status="error" text="Từ chối" />;
            case 'cancelled': return <Badge status="default" text="Đã hủy" />;
            default: return <Badge status="processing" text="Đã duyệt" />;
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'radial-gradient(circle, #f9fafb 0%, #f3f4f6 100%)' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text type="secondary">Đang tải hóa đơn thanh toán...</Text>
                </Space>
            </div>
        );
    }

    if (errorMessage || !request) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 24, background: '#f8fafc' }}>
                <Card style={{ maxWidth: 450, width: '100%', textAlign: 'center', borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                    <InfoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
                    <Title level={4}>Lỗi Thanh Toán</Title>
                    <Text type="danger">{errorMessage || 'Không tìm thấy thông tin phiếu chi.'}</Text>
                </Card>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 16px' }}>
                <Card 
                    style={{ 
                        maxWidth: 620, 
                        width: '100%', 
                        borderRadius: 16, 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', marginBottom: 12 }}>
                            <CreditCardOutlined style={{ fontSize: 32 }} />
                        </div>
                        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
                            HÓA ĐƠN THANH TOÁN
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Mã phiếu: <b>{request.code || request._id || '—'}</b>
                        </Text>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* Summary Info */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text type="secondary">Nội dung chi:</Text>
                            <Text strong style={{ color: '#334155', textAlign: 'right', maxWidth: '70%' }}>
                                {request.payment_content || 'Thanh toán hóa đơn'}
                            </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text type="secondary">Trạng thái:</Text>
                            {getStatusTag(request.status)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                            <Text type="secondary" strong>Số tiền cần thanh toán:</Text>
                            <Text strong style={{ fontSize: 20, color: '#ef4444' }}>
                                {request.amount ? request.amount.toLocaleString('vi-VN') : '0'} VND
                            </Text>
                        </div>
                    </div>

                    {/* VietQR Section */}
                    {request.beneficiary_account_number_snapshot && (
                        <div style={{ marginTop: 8 }}>
                            <VietQRSection 
                                bankName={request.beneficiary_bank_name_snapshot}
                                accountNo={request.beneficiary_account_number_snapshot}
                                accountName={request.beneficiary_name_snapshot}
                                amount={request.amount}
                                description={request.code || 'CHUYEN KHOAN'}
                                requestId={request._id}
                            />
                        </div>
                    )}
                </Card>
            </Content>
            <Footer style={{ textAlign: 'center', background: 'transparent', padding: '12px 24px', color: '#94a3b8', fontSize: 12 }}>
                <Space>
                    <SafetyCertificateOutlined />
                    <span>Hệ thống chuyển khoản tự động bảo mật qua tiêu chuẩn VietQR & Napas247</span>
                </Space>
            </Footer>
        </Layout>
    );
};

export default PublicPaymentRequestPay;
