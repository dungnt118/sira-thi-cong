import React from 'react';
import { Typography, Table } from 'antd';
import { StockOrder, StockOrderItem } from '@/types/v3';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface StockOrderPrintableProps {
    order: StockOrder;
}

const StockOrderPrintable: React.FC<StockOrderPrintableProps> = ({ order }) => {
    const isOutbound = order.type === 'OUT';
    
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên vật tư',
            dataIndex: 'materialName',
            key: 'materialName',
        },
        {
            title: 'ĐVT',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
        },
        {
            title: 'Số lượng',
            dataIndex: isOutbound ? 'issuedQuantity' : 'quantity',
            key: 'quantity',
            width: 100,
            align: 'right' as const,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'unitCost',
            key: 'unitCost',
            width: 120,
            align: 'right' as const,
            render: (val: number) => val?.toLocaleString(),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 130,
            align: 'right' as const,
            render: (record: StockOrderItem) => {
                const qty = isOutbound ? record.issuedQuantity : record.quantity;
                return (qty * record.unitCost)?.toLocaleString();
            },
        },
    ];

    const getSignature = (role: string) => {
        return order.signatures?.find(s => s.role === role);
    };

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
                    <div style={{ fontSize: 12 }}>Địa chỉ: 123 Đường ABC, Quận XYZ, Hà Nội</div>
                    <div style={{ fontSize: 12 }}>MST: 0101234567</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Mã phiếu: {order.code}</div>
                    <div style={{ fontSize: 12 }}>Ngày lập: {dayjs(order.createdAt).format('DD/MM/YYYY')}</div>
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
                    <Text strong>{isOutbound ? 'Dự án: ' : 'Nhà cung cấp: '}</Text>
                    <Text>{isOutbound ? (order.projectName || '---') : (order.source || '---')}</Text>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <Text strong>Địa chỉ/Diễn giải: </Text>
                    <Text>{order.notes || '---'}</Text>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <Text strong>Trạng thái phiếu: </Text>
                    <Text>{order.status}</Text>
                </div>
            </div>

            {/* Items Table */}
            <Table
                dataSource={order.items}
                columns={columns}
                pagination={false}
                size="small"
                bordered
                rowKey="materialId"
                style={{ marginBottom: 20 }}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={5} align="right">
                            <Text strong>Tổng cộng:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                            <Text strong color="red">{order.totalValue?.toLocaleString()} VNĐ</Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, textAlign: 'center' }}>
                <div style={{ width: '23%' }}>
                    <Text strong>NGƯỜI LẬP (PM)</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {getSignature('pm')?.signatureDataUrl && (
                            <img src={getSignature('pm')?.signatureDataUrl} alt="PM sign" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>{getSignature('pm')?.userName || '(Ký, họ tên)'}</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>KẾ TOÁN</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {getSignature('accountant')?.signatureDataUrl && (
                            <img src={getSignature('accountant')?.signatureDataUrl} alt="Accountant sign" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>{getSignature('accountant')?.userName || '(Ký, họ tên)'}</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>THỦ KHO</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {getSignature('warehouse')?.signatureDataUrl && (
                            <img src={getSignature('warehouse')?.signatureDataUrl} alt="Warehouse sign" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>{getSignature('warehouse')?.userName || '(Ký, họ tên)'}</div>
                </div>
                <div style={{ width: '23%' }}>
                    <Text strong>NGƯỜI NHẬN (GS)</Text>
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {getSignature('supervisor')?.signatureDataUrl && (
                            <img src={getSignature('supervisor')?.signatureDataUrl} alt="GS sign" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                    <div style={{ fontSize: 12 }}>{getSignature('supervisor')?.userName || '(Ký, họ tên)'}</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', textAlign: 'center', fontSize: 10, color: '#888', borderTop: '1px solid #eee', paddingTop: 10 }}>
                Phiếu được khởi tạo tự động từ hệ thống Quản lý Thi công SIRA
            </div>
        </div>
    );
};

export default StockOrderPrintable;
