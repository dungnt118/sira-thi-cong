import React, { useState } from 'react';
import { Card, Image, Typography, Tag, Button, Modal, Space, Empty, Spin } from 'antd';
import { FileOutlined, PictureOutlined, DownloadOutlined, FolderOpenOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';
import { usePortalJourney } from '../../../hooks/usePortalJourney';
import { usePortalDocuments } from '../../../hooks/usePortalDocuments';
import { IPortalDocument } from '../../../services/core-contracts/types/portalDocument.types';
import dayjs from 'dayjs';

const { Text } = Typography;

const PortalDocuments: React.FC = () => {
    const { journeyId, token } = useParams<{ journeyId?: string; token?: string }>();
    const portalKey = journeyId || token;
    const { journey, isLoading: isLoadingJourney } = usePortalJourney(portalKey);
    const { documents, isLoading: isLoadingDocs } = usePortalDocuments(journey?._id);
    const [selectedDoc, setSelectedDoc] = useState<IPortalDocument | null>(null);

    const isLoading = isLoadingJourney || (journey && isLoadingDocs);

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#38bdf8' }} spin />} />
            </div>
        );
    }

    if (!journey) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    const visibleDocuments = documents.filter((item) => item.is_visible !== false).sort((left, right) => {
        const leftSort = left.sort_order ?? 0;
        const rightSort = right.sort_order ?? 0;
        if (leftSort !== rightSort) return leftSort - rightSort;
        return (left.published_at?.toString() || '').localeCompare(right.published_at?.toString() || '');
    });

    const imageDocuments = visibleDocuments.filter((item) => item.file_type === 'image');
    const fileDocuments = visibleDocuments.filter((item) => item.file_type !== 'image');

    const getDocUrl = (doc: IPortalDocument) => doc.files?.[0]?.url || doc.thumbnail_url || '';
    const getDocName = (doc: IPortalDocument) => doc.files?.[0]?.name || doc.published_context || 'Tài liệu';

    const selectedUrl = selectedDoc ? getDocUrl(selectedDoc) : '';
    const viewerUrl = selectedUrl ? 'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(selectedUrl) : '';

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <PortalPageHeader 
                title='Tài liệu & Hình ảnh' 
                subtitle={journey.request_title || 'Chi tiết công trình'} 
                token={journey._id || portalKey || ''} 
                icon={<FolderOpenOutlined />} 
            />

            <Card title={<span><PictureOutlined /> Hình ảnh ({imageDocuments.length})</span>} style={{ borderRadius: 12, marginBottom: 16 }}>
                {imageDocuments.length === 0 ? (
                    <Empty description='Chưa có hình ảnh được công bố' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    <Image.PreviewGroup>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                            {imageDocuments.map((img) => (
                                <div key={img._id}>
                                    <Image src={getDocUrl(img)} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }} />
                                    <Text type='secondary' style={{ fontSize: 10, display: 'block', textAlign: 'center', marginTop: 2 }}>{img.published_context}</Text>
                                </div>
                            ))}
                        </div>
                    </Image.PreviewGroup>
                )}
            </Card>

            <Card title={<span><FileOutlined /> Tài liệu ({fileDocuments.length})</span>} style={{ borderRadius: 12 }}>
                {fileDocuments.length === 0 ? (
                    <Empty description='Chưa có tài liệu được công bố' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    fileDocuments.map((doc) => (
                        <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>{getDocName(doc)}</div>
                                <Space size={4}>
                                    <Tag style={{ fontSize: 10 }}>{doc.file_type?.toUpperCase()}</Tag>
                                    <Tag style={{ fontSize: 10 }}>{doc.published_context}</Tag>
                                    <Text type='secondary' style={{ fontSize: 11 }}>{doc.published_at ? dayjs(doc.published_at).format('DD/MM/YYYY') : ''}</Text>
                                </Space>
                            </div>
                            <Button size='small' icon={<FileOutlined />} onClick={() => setSelectedDoc(doc)}>Xem</Button>
                        </div>
                    ))
                )}
            </Card>

            <Modal
                title={'Xem tài liệu: ' + (selectedDoc ? getDocName(selectedDoc) : '')}
                open={!!selectedDoc}
                onCancel={() => setSelectedDoc(null)}
                footer={[
                    <Button key='close' onClick={() => setSelectedDoc(null)}>Đóng</Button>,
                    <Button key='download' type='primary' icon={<DownloadOutlined />} disabled={!selectedUrl} onClick={() => { if (selectedUrl) window.open(selectedUrl, '_blank', 'noopener,noreferrer'); }}>Tải xuống</Button>,
                ]}
                width={800}
                styles={{ body: { height: '60vh', padding: 0 } }}
            >
                {!selectedDoc ? null : selectedDoc.file_type === 'image' ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#f5f5f5' }}>
                        <Image src={getDocUrl(selectedDoc)} alt={getDocName(selectedDoc)} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                ) : selectedUrl ? (
                    <iframe src={viewerUrl} title={getDocName(selectedDoc)} width='100%' height='100%' style={{ border: 'none', background: '#f5f5f5' }} />
                ) : (
                    <Empty description='Tài liệu này chưa có đường dẫn preview' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 80 }} />
                )}
            </Modal>
        </div>
    );
};

export default PortalDocuments;
