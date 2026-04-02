import React, { useState, useEffect } from 'react';
import { Spin, Button, Result, Space, Typography, Card } from 'antd';
import { DownloadOutlined, ReloadOutlined, FullscreenOutlined, FilePdfOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface PdfViewerProps {
    /** URL của file PDF (nên bao gồm cả fragment #toolbar=1 nếu muốn hiện toolbar) */
    url: string;
    /** Tiêu đề hiển thị (cho accessibility) */
    title?: string;
    /** Chiều cao của khung xem */
    height?: string | number;
    /** Callback khi có lỗi tải */
    onError?: () => void;
}

/**
 * Trình xem PDF "Chuẩn" sử dụng tính năng native của trình duyệt.
 * Hỗ trợ Loading state, Error handling và các nút thao tác cơ bản.
 */
export const PdfViewer: React.FC<PdfViewerProps> = ({ 
    url, 
    title = 'Tài liệu PDF', 
    height = '72vh',
    onError 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(0);

    // Timeout để xử lý trường hợp iframe không kích hoạt onLoad/onError (ví dụ bị chặn bởi CSP hoặc X-Frame-Options)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                // Nếu sau 8s vẫn đang loading, có thể có vấn đề (CORS, CSP, hoặc backend error).
                // Chuyển sang trạng thái lỗi để hiển thị nút tải về fallback.
                setHasError(true);
                setIsLoading(false);
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, [isLoading, key]);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleInternalError = () => {
        setIsLoading(false);
        setHasError(true);
        if (onError) onError();
    };

    const reload = () => {
        setIsLoading(true);
        setHasError(false);
        setKey(prev => prev + 1);
    };

    // Chuẩn hóa height để dùng trong style
    const containerHeight = typeof height === 'number' ? `${height}px` : height;

    return (
        <Card 
            size="small" 
            variant="outlined"
            styles={{ body: { padding: 0, position: 'relative', overflow: 'hidden' } }}
            style={{ 
                width: '100%', 
                height: containerHeight, 
                background: '#f0f2f5', 
                borderRadius: 8,
                border: '1px solid #d9d9d9'
            }}
        >
            {isLoading && (
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.9)',
                    zIndex: 10,
                    transition: 'opacity 0.3s'
                }}>
                    <Space direction="vertical" align="center">
                        <Spin size="large" indicator={<FilePdfOutlined style={{ fontSize: 32 }} spin />} />
                        <Text strong style={{ color: '#1890ff' }}>Đang chuẩn bị tài liệu...</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Vui lòng đợi trong giây lát</Text>
                    </Space>
                </div>
            )}

            {hasError ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Result
                        status="info"
                        title="Không thể hiển thị PDF trực tiếp"
                        subTitle="Hệ thống hoặc trình duyệt không cho phép xem file này ngay tại đây. Bạn có thể tải về để xem nhanh hơn."
                        extra={[
                            <Button type="primary" key="download" href={url} target="_blank" icon={<DownloadOutlined />} size="large">
                                Tải xuống / Mở tab mới
                            </Button>,
                            <Button key="retry" icon={<ReloadOutlined />} onClick={reload}>
                                Thử lại
                            </Button>
                        ]}
                    />
                </div>
            ) : (
                <iframe
                    key={key}
                    title={title}
                    src={url}
                    width="100%"
                    height="100%"
                    style={{ 
                        display: 'block',
                        border: 'none',
                        width: '100%',
                        height: '100%',
                        minHeight: '400px'
                    }}
                    onLoad={handleLoad}
                    onError={handleInternalError}
                    // Loại bỏ sandbox để trình xem PDF native của trình duyệt hoạt động tốt nhất
                />
            )}
            
            {/* Bottom mini-toolbar for quick access */}
            {!isLoading && !hasError && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: 12, 
                    right: 24, 
                    zIndex: 5,
                    display: 'flex',
                    gap: 8
                }}>
                    <Button 
                        type="default"
                        shape="round"
                        size="small" 
                        icon={<FullscreenOutlined />} 
                        href={url} 
                        target="_blank"
                        style={{ 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            fontWeight: 500
                        }}
                    >
                        Xem toàn màn hình
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default PdfViewer;
