import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Space, Typography, Card, message } from 'antd';
import { ClearOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SiraSignaturePadProps {
    onSave: (dataUrl: string) => void;
    title?: string;
    description?: string;
}

const SiraSignaturePad: React.FC<SiraSignaturePadProps> = ({ onSave, title, description }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
    };

    const handleSave = () => {
        try {
            if (!sigCanvas.current) {
                return;
            }

            if (sigCanvas.current.isEmpty()) {
                message.warning("Vui lòng ký tên trước khi xác nhận");
                return;
            }

            const canvas = sigCanvas.current.getCanvas();
            if (!canvas) {
                message.error("Lỗi: Không thể trích xuất khung ký");
                return;
            }

            const dataUrl = canvas.toDataURL('image/png');

            if (dataUrl && dataUrl.length > 500) { 
                onSave(dataUrl);
            } else {
                message.warning("Vui lòng ký tên lại");
            }
        } catch (error) {
            console.error("SignaturePad Error:", error);
            message.error("Lỗi hệ thống khi lưu chữ ký");
        }
    };

    return (
        <Card size="small" style={{ border: '1px solid #d9d9d9', background: '#fafafa' }}>
            <div style={{ marginBottom: 8 }}>
                <Text strong>{title || 'Ký tên xác nhận'}</Text>
                {description && <div style={{ fontSize: 12, color: '#888' }}>{description}</div>}
            </div>
            
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 4, marginBottom: 12 }}>
                <SignatureCanvas 
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        width: 400,
                        height: 200,
                        className: 'signature-canvas'
                    }}
                />
            </div>

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button size="small" icon={<ClearOutlined />} onClick={clear}>
                    Xóa
                </Button>
                <Button size="small" type="primary" icon={<CheckOutlined />} onClick={handleSave}>
                    Xác nhận chữ ký
                </Button>
            </Space>
        </Card>
    );
};

export default SiraSignaturePad;
