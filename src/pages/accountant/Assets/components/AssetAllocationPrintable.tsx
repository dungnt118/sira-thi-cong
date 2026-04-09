import { Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import type { IAssetAllocation } from '../../../../services/core-contracts/types/assetAllocation.types';
import { getFileLink } from '../../../../services/storeService';

const { Text, Title } = Typography;

interface AssetAllocationPrintableProps {
    order: IAssetAllocation;
}

function signatureUrlByRole(order: IAssetAllocation, role: 'accountant' | 'borrower') {
    const sig = order.signature_image?.find((s) => s.role === role);
    return sig?.signature_data_url;
}

const AssetAllocationPrintable: React.FC<AssetAllocationPrintableProps> = ({ order }) => {
    return (
        <div id="asset-allocation-printable" style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            background: '#fff',
            fontFamily: '"Times New Roman", Times, serif',
            color: '#000',
            lineHeight: 1.5,
            margin: '0 auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>CÔNG TY CP ĐẦU TƯ & XÂY DỰNG BAC</div>
                    <div style={{ fontSize: 12 }}>Địa chỉ: Lô 2, KCN Hà Bình Phương, Thường Tín, Hà Nội</div>
                    <div style={{ fontSize: 12 }}>Điện thoại: 024.3333.6666</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Mã phiếu: {order.code || order._id}</div>
                    <div style={{ fontSize: 12 }}>Ngày lập: {dayjs(order.request_date).format('DD/MM/YYYY')}</div>
                </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <Title level={3} style={{ margin: 0, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    BIÊN BẢN BÀN GIAO TÀI SẢN
                </Title>
                <Text italic>(Handover Protocol)</Text>
            </div>

            {/* General Info */}
            <div style={{ marginBottom: 30 }}>
                <div style={{ marginBottom: 10 }}>
                    <Text strong>Người nhận bàn giao: </Text>
                    <Text>{order.requested_by?.displayName || order.requested_by || '---'}</Text>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <Text strong>Bộ phận / Dự án: </Text>
                    <Text>{order.journey_name || '---'}</Text>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <Text strong>Lý do mượn / Cấp phát: </Text>
                    <Text>{order.notes || 'Sử dụng cho công việc chuyên môn'}</Text>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <Text strong>Thời hạn mượn dự kiến: </Text>
                    <Text>{order.expected_return_date ? dayjs(order.expected_return_date).format('DD/MM/YYYY') : 'Không thời hạn'}</Text>
                </div>
            </div>

            {/* Assets Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', width: '50px' }}>STT</th>
                        <th style={{ border: '1px solid #000', padding: '8px' }}>Tên tài sản / Thiết bị</th>
                        <th style={{ border: '1px solid #000', padding: '8px', width: '150px' }}>Mã hiệu / Serial</th>
                        <th style={{ border: '1px solid #000', padding: '8px', width: '100px' }}>Số lượng</th>
                        <th style={{ border: '1px solid #000', padding: '8px', width: '150px' }}>Tình trạng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>1</td>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>{order.asset_name}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{order.asset_code}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>01</td>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>Hoạt động tốt</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginBottom: 30 }}>
                <Text italic>Chúng tôi cam kết bảo quản và sử dụng tài sản đúng mục đích, tuân thủ các quy định về an toàn thiết bị của Công ty.</Text>
            </div>

            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 50, textAlign: 'center' }}>
                <div style={{ width: '45%' }}>
                    <Text strong>KẾ TOÁN XÁC NHẬN</Text>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {signatureUrlByRole(order, 'accountant') && (
                            <img src={getFileLink(signatureUrlByRole(order, 'accountant') as string)} alt="Accountant" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
                <div style={{ width: '45%' }}>
                    <Text strong>NGƯỜI NHẬN TÀI SẢN</Text>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {signatureUrlByRole(order, 'borrower') && (
                            <img src={getFileLink(signatureUrlByRole(order, 'borrower') as string)} alt="Borrower" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', textAlign: 'center', fontSize: 10, color: '#888', borderTop: '1px solid #eee', paddingTop: 10 }}>
                Biên bản được khởi tạo từ hệ thống Quản lý BAC- {dayjs().format('DD/MM/YYYY HH:mm')}
            </div>
        </div>
    );
};

export default AssetAllocationPrintable;
