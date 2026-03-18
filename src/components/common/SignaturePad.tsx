import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Space, Typography, Card } from 'antd';
import { ClearOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    title?: string;
    description?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, title, description }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
    };

    const handleSave = () => {
        const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
        
        // Basic check: dataUrl should exist and not be a tiny empty PNG
        if (dataUrl && dataUrl.length > 500) { 
            console.log("Signature captured, size:", dataUrl.length);
            onSave(dataUrl);
        } else {
            message.warning("Vui lòng ký tên trước khi xác nhận");
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

export default SignaturePad;
