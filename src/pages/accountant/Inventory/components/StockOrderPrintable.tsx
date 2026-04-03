import React from 'react';
import { Typography, Table } from 'antd';
import type { IStockOrder, IItemsItem } from '../../../../services/core-contracts/types/stockOrder.types';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface StockOrderPrintableProps {
    order: IStockOrder;
}

function signatureUrlByRole(order: IStockOrder, role: 'pm' | 'kt' | 'warehouse' | 'gs') {
    return order.signatures?.find((s) => s.role === role)?.signature_data_url;
}

function legacyKtSignatureDataUrl(order: IStockOrder): string | undefined {
    if (order.signatures?.some((s) => s.role === 'kt')) return undefined;
    if (!order.signature_image) return undefined;
    if (['approved', 'dispatched', 'received', 'completed', 'discrepancy'].includes(order.status || '')) {
        return order.signature_image;
    }
    return undefined;
}

const StockOrderPrintable: React.FC<StockOrderPrintableProps> = ({ order }) => {
    const isOutbound = order.type === 'out';
    
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Vật tư',
            dataIndex: 'material_name',
            key: 'name',
        },
        {
            title: 'ĐVT',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
            render: (u: string) => u?.toUpperCase()
        },
        {
            title: 'Số lượng',
            dataIndex: isOutbound ? 'issued_quantity' : 'quantity',
            key: 'quantity',
            width: 100,
            align: 'right' as const,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'unit_cost',
            key: 'cost',
            width: 120,
            align: 'right' as const,
            render: (val: number) => (val || 0).toLocaleString(),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 130,
            align: 'right' as const,
            render: (record: IItemsItem) => {
                const qty = isOutbound ? (record.issued_quantity || 0) : (record.quantity || 0);
                return (qty * (record.unit_cost || 0))?.toLocaleString();
            },
        },
    ];

    return (
        <div id="stock-order-printable" style={{
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
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>CÔNG TY CP ĐẦU TƯ & XÂY DỰNG SIRA</div>
                    <div style={{ fontSize: 12 }}>Địa chỉ: Lô 2, KCN Hà Bình Phương, Thường Tín, Hà Nội</div>
                    <div style={{ fontSize: 12 }}>Điện thoại: 024.3333.6666</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Mã phiếu: {order.code || order._id}</div>
                    <div style={{ fontSize: 12 }}>Ngày lập: {dayjs(order.created_at).format('DD/MM/YYYY')}</div>
                </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <Title level={3} style={{ margin: 0, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {isOutbound ? 'PHIẾU XUẤT KHO' : 'PHIẾU NHẬP KHO'}
                </Title>
                <Text italic>(Liên 1: Lưu tại kho - Liên 2: Giao người nhận)</Text>
            </div>

            {/* General Info */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 5 }}>
                    <Text strong>{isOutbound ? 'Dự án / Hành trình: ' : 'Nhà cung cấp / Nguồn: '}</Text>
                    <Text>{isOutbound ? (order.journey_name || order.journey_code || '---') : (order.supplier || order.source || '---')}</Text>
                </div>
                {order.journey_code && (
                    <div style={{ marginBottom: 5 }}>
                        <Text strong>Mã hành trình: </Text>
                        <Text>{order.journey_code}</Text>
                    </div>
                )}
                <div style={{ marginBottom: 5 }}>
                    <Text strong>Ghi chú: </Text>
                    <Text>{order.notes || '---'}</Text>
                </div>
            </div>

            {/* Items Table */}
            <Table
                dataSource={order.items || []}
                columns={columns}
                pagination={false}
                size="small"
                bordered
                rowKey="material_id"
                style={{ marginBottom: 20 }}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={5} align="right">
                            <Text strong>Tổng cộng:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                            <Text strong>{(order.total_value || 0).toLocaleString()} VNĐ</Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {/* Signatures — khớp nested `signatures` + fallback `signature_image` (KT) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, textAlign: 'center' }}>
                <div style={{ width: '23%' }}>
                    <Text strong>NGƯỜI LẬP (PM)</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {signatureUrlByRole(order, 'pm') && (
                            <img src={signatureUrlByRole(order, 'pm')} alt="PM" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>KẾ TOÁN</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {(signatureUrlByRole(order, 'kt') || legacyKtSignatureDataUrl(order)) && (
                            <img
                                src={signatureUrlByRole(order, 'kt') || legacyKtSignatureDataUrl(order)}
                                alt="Kế toán"
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                            />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>THỦ KHO</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {signatureUrlByRole(order, 'warehouse') && (
                            <img src={signatureUrlByRole(order, 'warehouse')} alt="Thủ kho" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>NGƯỜI NHẬN</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {signatureUrlByRole(order, 'gs') && (
                            <img src={signatureUrlByRole(order, 'gs')} alt="Giám sát" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>(Ký, họ tên)</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', textAlign: 'center', fontSize: 10, color: '#888', borderTop: '1px solid #eee', paddingTop: 10 }}>
                Phiếu được khởi tạo tự động từ hệ thống Quản lý SIRA
            </div>
        </div>
    );
};

export default StockOrderPrintable;
