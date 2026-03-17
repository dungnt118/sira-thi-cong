import React, { useState } from 'react';
import { Card, Image, Typography, Tag, Button, Row, Col, Space, Modal } from 'antd';
import { FileOutlined, PictureOutlined, DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { mockJourneys } from '../../../data/journeyMockData';

const { Text, Title } = Typography;

const PortalDocuments: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const journey = mockJourneys.find(j => j.portal_token === token);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const mockDocs = [
        { id: '1', file_name: 'Báo cáo khảo sát.pdf', file_type: 'pdf', published_context: 'Khảo sát', published_at: '2026-02-15' },
        { id: '2', file_name: 'Báo giá CT-2026-001.pdf', file_type: 'pdf', published_context: 'Dự toán', published_at: '2026-02-20' },
        { id: '3', file_name: 'Hợp đồng HD-001.pdf', file_type: 'pdf', published_context: 'Hợp đồng', published_at: '2026-02-28' },
    ];

    const mockImages = [
        { id: 'img-1', file_name: 'Ảnh hiện trạng 1.jpg', published_context: 'Khảo sát', published_at: '2026-02-15', url: 'https://picsum.photos/400/300?random=1' },
        { id: 'img-2', file_name: 'Ảnh hiện trạng 2.jpg', published_context: 'Khảo sát', published_at: '2026-02-15', url: 'https://picsum.photos/400/300?random=2' },
        { id: 'img-3', file_name: 'Ảnh thi công 1.jpg', published_context: 'Thi công', published_at: '2026-03-08', url: 'https://picsum.photos/400/300?random=3' },
    ];

    if (!journey) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                    <Col><Title level={5} style={{ margin: 0 }}><FolderOpenOutlined /> Tài liệu & Hình ảnh</Title></Col>
                    <Col>
                        <Space>
                            <Button size="small" onClick={() => navigate(`/portal/${token}`)}>Tổng quan</Button>
                            <Button size="small" onClick={() => navigate(`/portal/${token}/timeline`)}>Timeline</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Gallery */}
            <Card title={<span><PictureOutlined /> Hình ảnh ({mockImages.length})</span>} style={{ borderRadius: 12, marginBottom: 16 }}>
                <Image.PreviewGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {mockImages.map(img => (
                            <div key={img.id}>
                                <Image
                                    src={img.url}
                                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }}
                                />
                                <Text type="secondary" style={{ fontSize: 10, display: 'block', textAlign: 'center', marginTop: 2 }}>
                                    {img.published_context}
                                </Text>
                            </div>
                        ))}
                    </div>
                </Image.PreviewGroup>
            </Card>

            {/* Documents */}
            <Card title={<span><FileOutlined /> Tài liệu ({mockDocs.length})</span>} style={{ borderRadius: 12 }}>
                {mockDocs.map(doc => (
                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>{doc.file_name}</div>
                            <Space size={4}>
                                <Tag style={{ fontSize: 10 }}>{doc.file_type.toUpperCase()}</Tag>
                                <Tag style={{ fontSize: 10 }}>{doc.published_context}</Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>{doc.published_at}</Text>
                            </Space>
                        </div>
                        <Button size="small" icon={<FileOutlined />} onClick={() => setSelectedDoc(doc)}>Xem</Button>
                    </div>
                ))}
            </Card>

            {/* Document Preview Modal (DLG-21) */}
            <Modal
                title={`Xem tài liệu: ${selectedDoc?.file_name}`}
                open={!!selectedDoc}
                onCancel={() => setSelectedDoc(null)}
                footer={[
                    <Button key="close" onClick={() => setSelectedDoc(null)}>Đóng</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />}>Tải xuống</Button>
                ]}
                width={800}
                styles={{ body: { height: '60vh', padding: 0 } }}
            >
                {selectedDoc && (
                    <iframe
                        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=`}
                        title={selectedDoc.file_name}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', background: '#f5f5f5' }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PortalDocuments;
