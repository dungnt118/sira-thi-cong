import React, { useState, useEffect, useRef } from 'react';
import { Spin, Button, Result, Space, Typography, Card } from 'antd';
import { DownloadOutlined, ReloadOutlined, FullscreenOutlined, FilePdfOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface PdfViewerProps {
    /** URL của file PDF để tải về và hiển thị */
    url: string;
    /** Tiêu đề hiển thị (cho accessibility) */
    title?: string;
    /** Chiều cao của khung xem */
    height?: string | number;
    /** Callback khi có lỗi tải */
    onError?: () => void;
}

/**
 * Trình xem PDF – tải file về dưới dạng blob rồi tạo object URL để đưa vào iframe.
 * Cách này tránh các lỗi CORS / X-Frame-Options / Content-Disposition khi trình
 * duyệt cố tải URL gốc trực tiếp vào iframe.
 */
export const PdfViewer: React.FC<PdfViewerProps> = ({
    url,
    title = 'Tài liệu PDF',
    height = '72vh',
    onError,
}) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const prevBlobUrlRef = useRef<string | null>(null);

    // Fetch PDF → blob → object URL
    useEffect(() => {
        if (!url) {
            setHasError(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);
        setBlobUrl(null);

        let cancelled = false;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                if (cancelled) return;

                // Revoke URL cũ (nếu có) để tránh memory leak
                if (prevBlobUrlRef.current) {
                    URL.revokeObjectURL(prevBlobUrlRef.current);
                }

                const objectUrl = URL.createObjectURL(blob);
                prevBlobUrlRef.current = objectUrl;
                setBlobUrl(objectUrl);
                setIsLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                console.error('[PdfViewer] Không thể tải file PDF:', err);
                setHasError(true);
                setIsLoading(false);
                if (onError) onError();
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, retryKey]);

    // Revoke blob URL khi component unmount
    useEffect(() => {
        return () => {
            if (prevBlobUrlRef.current) {
                URL.revokeObjectURL(prevBlobUrlRef.current);
                prevBlobUrlRef.current = null;
            }
        };
    }, []);

    const reload = () => {
        setRetryKey(prev => prev + 1);
    };

    // When height is "100%", the Card should flex-grow inside its parent instead
    // of being capped to a pixel/viewport value.
    const isFlexFill = height === '100%';
    const containerHeight = isFlexFill ? undefined : (typeof height === 'number' ? `${height}px` : height);

    return (
        <Card
            size="small"
            variant="outlined"
            styles={{
                body: {
                    padding: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
            style={{
                width: '100%',
                ...(isFlexFill ? { flex: 1, minHeight: 0 } : { height: containerHeight }),
                background: 'transparent',
                borderRadius: 0,
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.92)',
                        zIndex: 10,
                    }}
                >
                    <Space direction="vertical" align="center">
                        <Spin size="large" indicator={<FilePdfOutlined style={{ fontSize: 32 }} spin />} />
                        <Text strong style={{ color: '#1890ff' }}>Đang tải tài liệu...</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Vui lòng đợi trong giây lát</Text>
                    </Space>
                </div>
            )}

            {/* Error state */}
            {hasError && !isLoading && (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Result
                        status="info"
                        title="Không thể hiển thị PDF"
                        subTitle="Hệ thống không thể tải file này. Bạn có thể tải về máy để xem."
                        extra={[
                            <Button
                                type="primary"
                                key="download"
                                href={url}
                                target="_blank"
                                icon={<DownloadOutlined />}
                                size="large"
                            >
                                Tải xuống / Mở tab mới
                            </Button>,
                            <Button key="retry" icon={<ReloadOutlined />} onClick={reload}>
                                Thử lại
                            </Button>,
                        ]}
                    />
                </div>
            )}

            {/* PDF iframe – chỉ render khi đã có blob URL */}
            {blobUrl && !hasError && (
                <iframe
                    key={retryKey}
                    title={title}
                    src={blobUrl}
                    style={{
                        display: 'block',
                        border: 'none',
                        width: '100%',
                        flex: 1,
                        minHeight: 0,
                    }}
                />
            )}

            {/* Mini toolbar */}
            {blobUrl && !isLoading && !hasError && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 24,
                        zIndex: 5,
                        display: 'flex',
                        gap: 8,
                    }}
                >
                    <Button
                        type="default"
                        shape="round"
                        size="small"
                        icon={<FullscreenOutlined />}
                        href={blobUrl}
                        target="_blank"
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            fontWeight: 500,
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
