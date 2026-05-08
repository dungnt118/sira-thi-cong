import React from 'react';
import { Result, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

/**
 * UX-03 (Wave 3.5) — ErrorBoundary để bảo vệ các route component khỏi crash
 * dẫn đến trang trắng (user thường nhầm là 404).
 *
 * Wrap các page nhạy cảm với data fetch hoặc tính toán phức tạp:
 *   <ErrorBoundary><ActionCenter /></ErrorBoundary>
 */

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    /** Optional fallback title — mặc định "Đã xảy ra lỗi khi tải trang". */
    fallbackTitle?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Always log to console for debugging.
        // eslint-disable-next-line no-console
        console.error('[ErrorBoundary] Caught render error:', error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        // Force re-mount route — simplest reliable recovery.
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const { fallbackTitle = 'Đã xảy ra lỗi khi tải trang' } = this.props;
            return (
                <Result
                    status="error"
                    title={fallbackTitle}
                    subTitle="Trang không thể hiển thị do gặp lỗi không mong muốn. Bạn có thể tải lại trang để thử lại."
                    extra={
                        <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleReload}>
                            Tải lại trang
                        </Button>
                    }
                >
                    {this.state.error && (
                        <div className="desc" style={{ textAlign: 'left', maxWidth: 720, margin: '0 auto' }}>
                            <Paragraph>
                                <Text strong style={{ fontSize: 13 }}>Chi tiết lỗi (kỹ thuật):</Text>
                            </Paragraph>
                            <Paragraph copyable={{ text: this.state.error.stack || this.state.error.message }}>
                                <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                                    {this.state.error.message}
                                </Text>
                            </Paragraph>
                        </div>
                    )}
                </Result>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
