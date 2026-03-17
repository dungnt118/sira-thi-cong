import React, { useState } from 'react';
import { Card, Button, List, Tag, Typography, Modal, Checkbox, message, Empty, Divider } from 'antd';
import { InboxOutlined, CameraOutlined, FileDoneOutlined, HistoryOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface MaterialTicket {
    id: string;
    code: string;
    projectCode: string;
    projectName: string;
    supplier: string;
    items: { name: string; quantity: string; unit: string }[];
    status: 'PENDING' | 'RECEIVED' | 'REJECTED';
    deliverDate: string;
}

export const MaterialReceipt: React.FC = () => {
    const [tickets, setTickets] = useState<MaterialTicket[]>([
        {
            id: 'TKT-001',
            code: 'PXK-20260317-01',
            projectCode: 'DA-001',
            projectName: 'Sơn sửa chung cư Morning Star',
            supplier: 'Kho Tổng BAC',
            items: [
                { name: 'Sơn Dulux 5 in 1 (18L)', quantity: '5', unit: 'Thùng' },
                { name: 'Cọ lăn sơn (25cm)', quantity: '10', unit: 'Cái' },
                { name: 'Bạt che bụi (5mx5m)', quantity: '4', unit: 'Tấm' }
            ],
            status: 'PENDING',
            deliverDate: '2026-03-17'
        }
    ]);

    const [selectedTicket, setSelectedTicket] = useState<MaterialTicket | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const handleOpenReview = (ticket: MaterialTicket) => {
        setSelectedTicket(ticket);
        setCheckedItems([]);
        setModalOpen(true);
    };

    const handleConfirm = () => {
        if (checkedItems.length < selectedTicket!.items.length) {
            message.warning('Vui lòng kiểm đếm đủ tất cả các mặt hàng');
            return;
        }
        
        setTickets(tickets.map(t => t.id === selectedTicket!.id ? { ...t, status: 'RECEIVED' } : t));
        setModalOpen(false);
        message.success('Đã ký nhận vật tư thành công. Dữ liệu đã được cập nhật vào kho hiện trường.');
    };

    return (
        <div className="material-receipt">
            <div style={{ marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0 }}>Vật tư & Giao nhận</Title>
                <Text type="secondary">Xác nhận vật tư chuyển đến công trường</Text>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <Button type="primary" icon={<InboxOutlined />} className="gs-tab-btn">Chờ nhận</Button>
                <Button icon={<HistoryOutlined />} className="gs-tab-btn">Lịch sử</Button>
            </div>

            <List
                dataSource={tickets.filter(t => t.status === 'PENDING')}
                locale={{ emptyText: <Empty description="Không có vật tư nào chờ nhận" /> }}
                renderItem={(item) => (
                    <Card 
                        size="small" 
                        className="gs-card" 
                        style={{ marginBottom: 12, borderLeft: '4px solid #fa8c16' }}
                        hoverable
                        onClick={() => handleOpenReview(item)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 700 }}>{item.code}</div>
                            <Tag color="orange">Đang giao</Tag>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{item.projectCode}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{item.projectName}</div>
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12 }}>
                                <Text type="secondary">Nguồn: </Text><strong>{item.supplier}</strong>
                            </div>
                            <Button size="small" type="primary">Kiểm nhận</Button>
                        </div>
                    </Card>
                )}
            />

            <Modal
                title="Kiểm nhận & Ký nhận vật tư"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width="100%"
                style={{ maxWidth: 600, top: 20 }}
                bodyStyle={{ paddingBottom: 20 }}
            >
                {selectedTicket && (
                    <div>
                        <div style={{ background: '#fff7e6', padding: '12px', borderRadius: 8, marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, color: '#fa8c16' }}>{selectedTicket.code}</div>
                            <div style={{ fontSize: 12 }}>{selectedTicket.projectName}</div>
                        </div>

                        <Title level={5} style={{ marginTop: 0 }}>Danh sách hàng hóa:</Title>
                        <Checkbox.Group 
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
                            value={checkedItems}
                            onChange={(vals) => setCheckedItems(vals as string[])}
                        >
                            {selectedTicket.items.map((item, idx) => (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '10px',
                                    background: '#f8f9fa',
                                    borderRadius: 6
                                }}>
                                    <Checkbox value={item.name}>
                                        <Text strong>{item.name}</Text>
                                        <div style={{ fontSize: 12, color: '#888' }}>Số lượng: {item.quantity} {item.unit}</div>
                                    </Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>

                        <div style={{ marginTop: 24 }}>
                            <Title level={5}>Chụp bằng chứng nhận hàng:</Title>
                            <Button block icon={<CameraOutlined />} size="large" style={{ height: 60, borderStyle: 'dashed' }}>
                                Chụp ảnh kiện hàng / Phiếu ký tay
                            </Button>
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <Title level={5}>Ký nhận điện tử:</Title>
                            <div style={{ 
                                height: 120, 
                                background: '#f5f5f5', 
                                borderRadius: 8, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '1px solid #d9d9d9',
                                color: '#bfbfbf',
                                cursor: 'crosshair'
                            }}>
                                [ Khung ký tên của Giám sát ]
                            </div>
                        </div>

                        <Button 
                            type="primary" 
                            block 
                            size="large" 
                            icon={<FileDoneOutlined />} 
                            style={{ marginTop: 24, height: 50 }}
                            onClick={handleConfirm}
                        >
                            Xác nhận & Hoàn tất
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MaterialReceipt;
