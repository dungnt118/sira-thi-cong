import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Space, Typography, message, Tooltip, Radio, Grid, QRCode } from 'antd';
import {
    CopyOutlined, DownloadOutlined, GlobalOutlined,
    QrcodeOutlined, CheckOutlined, BankOutlined,
    ShareAltOutlined
} from '@ant-design/icons';
import {
    SUPPORTED_BANKS, findBank, generateVietQRString,
    removeVietnameseTones, BankInfo
} from '@/utils/vietqr';

const { Text, Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface VietQRSectionProps {
    bankName?: string;
    accountNo?: string;
    accountName?: string;
    amount?: number;
    description?: string;
    requestId?: string;
}

const VietQRSection: React.FC<VietQRSectionProps> = ({
    bankName, accountNo, accountName, amount, description, requestId
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.sm;

    const [selectedBank, setSelectedBank] = useState<BankInfo | undefined>(undefined);
    const [qrType, setQrType] = useState<'online' | 'offline'>('online');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Tự động nhận diện ngân hàng khi props thay đổi
    useEffect(() => {
        const detected = findBank(bankName);
        setSelectedBank(detected);
    }, [bankName]);

    if (!accountNo) {
        return (
            <Card size="small" style={{ border: '1px dashed #d9d9d9', textAlign: 'center', padding: '16px 0', background: '#fafafa' }}>
                <Text type="secondary" italic>Không thể tạo VietQR do thiếu thông tin số tài khoản thụ hưởng.</Text>
            </Card>
        );
    }

    const cleanDesc = description ? removeVietnameseTones(description) : '';
    const cleanName = accountName ? removeVietnameseTones(accountName).toUpperCase() : '';

    // Lấy thông tin ngân hàng đang chọn
    const bankShortName = selectedBank?.shortName || '';
    const bankBin = selectedBank?.bin || '';

    // Tạo link ảnh VietQR Online (VietQR.io API)
    // Định dạng: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact2.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
    const onlineQrUrl = bankShortName
        ? `https://img.vietqr.io/image/${bankShortName}-${accountNo}-compact2.png?amount=${amount || 0}&addInfo=${encodeURIComponent(cleanDesc)}&accountName=${encodeURIComponent(cleanName)}`
        : '';

    // Tạo chuỗi VietQR Offline (EMVCo)
    let offlineQrValue = '';
    if (bankBin) {
        try {
            offlineQrValue = generateVietQRString({
                bankBin,
                accountNo,
                amount,
                description: cleanDesc
            });
        } catch (error) {
            console.error('Failed to generate offline VietQR string:', error);
        }
    }

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success(`Đã sao chép ${fieldName}`);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            message.error('Không thể sao chép');
        });
    };

    const handleCopyQrLink = () => {
        if (!accountNo) return;
        const publicPayUrl = `${window.location.origin}/public/pay/${requestId || 'temp'}?b=${encodeURIComponent(bankShortName || bankName || '')}&a=${encodeURIComponent(accountNo)}&n=${encodeURIComponent(cleanName)}&m=${amount || 0}&d=${encodeURIComponent(cleanDesc)}`;
        handleCopy(publicPayUrl, 'Liên kết thanh toán công khai');
    };

    const handleDownload = async () => {
        const qrFilename = `VietQR_${bankShortName || 'Bank'}_${accountNo}_${amount || 0}.png`;
        
        if (qrType === 'online' && onlineQrUrl) {
            try {
                const response = await fetch(onlineQrUrl);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = qrFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                message.success('Tải ảnh QR thành công!');
            } catch (error) {
                // Hỗ trợ fallback nếu bị chặn CORS
                window.open(onlineQrUrl, '_blank');
                message.info('Ảnh QR đã được mở ở tab mới. Vui lòng nhấn chuột phải và chọn Lưu hình ảnh.');
            }
        } else {
            // Tải ảnh QR Offline từ canvas
            const canvas = document.getElementById('offline-qrcode-canvas')?.querySelector('canvas');
            if (canvas) {
                try {
                    const blobUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = qrFilename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    message.success('Tải ảnh QR thành công!');
                } catch (err) {
                    message.error('Không thể tải ảnh QR offline');
                }
            } else {
                message.error('Không tìm thấy ảnh QR để tải');
            }
        }
    };

    return (
        <Card 
            size="small" 
            title={
                <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>✨ VietQR Chuyển Khoản Nhanh</span>
                    <Radio.Group 
                        value={qrType} 
                        onChange={(e) => setQrType(e.target.value)} 
                        size="small"
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="online">
                            <Space><GlobalOutlined />Online</Space>
                        </Radio.Button>
                        <Radio.Button value="offline">
                            <Space><QrcodeOutlined />Offline</Space>
                        </Radio.Button>
                    </Radio.Group>
                </Space>
            }
            style={{ 
                border: '1px solid #1890ff', 
                borderRadius: 8, 
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.08)',
                overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, alignItems: 'center' }}>
                
                {/* Khu vực hiển thị QR Code */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minWidth: 200,
                    padding: 8,
                    background: '#fcfcfc',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0'
                }}>
                    {qrType === 'online' ? (
                        onlineQrUrl ? (
                            <img 
                                src={onlineQrUrl} 
                                alt="VietQR" 
                                style={{ 
                                    width: 190, 
                                    height: 'auto', 
                                    borderRadius: 4, 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    marginBottom: 12
                                }} 
                            />
                        ) : (
                            <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#ff4d4f' }}>
                                <Space direction="vertical" size="small">
                                    <BankOutlined style={{ fontSize: 32 }} />
                                    <Text type="danger" style={{ fontSize: 12 }}>Chưa chọn ngân hàng hoặc không khớp mã Napas</Text>
                                </Space>
                            </div>
                        )
                    ) : (
                        // Chế độ Offline
                        offlineQrValue ? (
                            <div id="offline-qrcode-canvas" style={{ padding: 12, background: '#fff', borderRadius: 4, marginBottom: 12, border: '1px solid #f0f0f0' }}>
                                <QRCode 
                                    value={offlineQrValue} 
                                    size={160} 
                                    bordered={false}
                                />
                            </div>
                        ) : (
                            <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#ff4d4f' }}>
                                <Space direction="vertical" size="small">
                                    <QrcodeOutlined style={{ fontSize: 32 }} />
                                    <Text type="danger" style={{ fontSize: 12 }}>Chưa chọn ngân hàng thụ hưởng</Text>
                                </Space>
                            </div>
                        )
                    )}

                    <Space size="small">
                        <Button 
                            size="small" 
                            type="primary" 
                            ghost 
                            icon={<DownloadOutlined />} 
                            onClick={handleDownload}
                            disabled={qrType === 'online' ? !onlineQrUrl : !offlineQrValue}
                        >
                            Tải ảnh QR
                        </Button>
                        <Button 
                            size="small" 
                            icon={<ShareAltOutlined />} 
                            onClick={handleCopyQrLink}
                        >
                            Copy Link QR
                        </Button>
                    </Space>
                </div>

                {/* Khu vực thông tin & thao tác nhanh */}
                <div style={{ flex: 1, width: '100%' }}>
                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>Ngân hàng thụ hưởng nhận diện:</Text>
                        <Select 
                            showSearch
                            style={{ width: '100%', marginTop: 4 }}
                            placeholder="Chọn ngân hàng để tạo QR chính xác"
                            optionFilterProp="children"
                            value={selectedBank?.bin}
                            onChange={(value) => {
                                const bank = SUPPORTED_BANKS.find(b => b.bin === value);
                                setSelectedBank(bank);
                            }}
                            filterOption={(input, option) => {
                                const label = String(option?.children || '').toLowerCase();
                                return label.includes(input.toLowerCase());
                            }}
                        >
                            {SUPPORTED_BANKS.map((b) => (
                                <Option key={b.bin} value={b.bin}>
                                    {b.shortName} — {b.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div style={{ background: '#fafafa', padding: '8px 12px', borderRadius: 6, border: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Số tài khoản</Text>
                                <Text strong style={{ fontSize: 14 }}>{accountNo}</Text>
                            </div>
                            <Button 
                                size="small" 
                                type="link" 
                                icon={copiedField === 'stk' ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                                onClick={() => handleCopy(accountNo, 'stk')}
                            >
                                Copy
                            </Button>
                        </div>
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Tên người nhận</Text>
                                <Text strong style={{ fontSize: 12 }}>{cleanName || '—'}</Text>
                            </div>
                            {cleanName && (
                                <Button 
                                    size="small" 
                                    type="link" 
                                    icon={copiedField === 'name' ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                                    onClick={() => handleCopy(cleanName, 'name')}
                                >
                                    Copy
                                </Button>
                            )}
                        </div>
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Số tiền chuyển</Text>
                                <Text strong style={{ fontSize: 14, color: '#ff4d4f' }}>
                                    {amount ? amount.toLocaleString('vi-VN') + ' VND' : '—'}
                                </Text>
                            </div>
                            {amount ? (
                                <Button 
                                    size="small" 
                                    type="link" 
                                    icon={copiedField === 'amount' ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                                    onClick={() => handleCopy(amount.toString(), 'amount')}
                                >
                                    Copy
                                </Button>
                            ) : null}
                        </div>
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Nội dung chuyển khoản</Text>
                                <Text style={{ fontSize: 12 }}>{cleanDesc || '—'}</Text>
                            </div>
                            {cleanDesc && (
                                <Button 
                                    size="small" 
                                    type="link" 
                                    icon={copiedField === 'desc' ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                                    onClick={() => handleCopy(cleanDesc, 'desc')}
                                >
                                    Copy
                                </Button>
                            )}
                        </div>
                    </div>

                    {bankBin && (
                        <div style={{ marginTop: 12 }}>
                            <Button 
                                type="primary" 
                                block
                                icon={<GlobalOutlined />} 
                                style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: '500', height: 38 }}
                                onClick={() => {
                                    const appUrl = `https://qr.vietqr.co/2/${bankBin}/${accountNo}?amount=${amount || 0}&memo=${encodeURIComponent(cleanDesc)}`;
                                    window.open(appUrl, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                Mở App Ngân hàng (Thanh toán di động)
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </Card>
    );
};

export default VietQRSection;
