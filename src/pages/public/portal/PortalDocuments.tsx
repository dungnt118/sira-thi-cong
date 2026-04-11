import React, { useEffect, useState } from 'react';
import { Card, Image, Typography, Tag, Button, Modal, Space, Empty } from 'antd';
import { FileOutlined, PictureOutlined, DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import PortalPageHeader from '../../../components/portal/PortalPageHeader';
import { useLocalStorageData } from '../../../hooks/useLocalStorageData';
import { demoDataService } from '../../../services/core-graphql/localstorage/demoDataService';
import { syncJourneyPortalSummary } from '../../../services/core-graphql/localstorage/portalDocumentService';
import { mockJourneys, mockJourneyTemplates } from '../../../data/journeyMockData';
import { mockPortalDocuments } from '../../../data/portalMockData';
import type { Journey, JourneyTemplate } from '../../../types/journey';
import type { PortalDocument } from '../../../types/portal';

const { Text } = Typography;

const PortalDocuments: React.FC = () => {
    const { journeyCode, token } = useParams<{ journeyCode?: string; token?: string }>();
    const portalKey = journeyCode || token;
    const [journeys, setJourneys] = useLocalStorageData<Journey[]>(demoDataService.KEYS.JOURNEYS, mockJourneys);
    const [journeyTemplates] = useLocalStorageData<JourneyTemplate[]>(demoDataService.KEYS.JOURNEY_TEMPLATES, mockJourneyTemplates);
    const [portalDocuments] = useLocalStorageData<PortalDocument[]>(demoDataService.KEYS.PORTAL_DOCUMENTS, mockPortalDocuments);
    const [selectedDoc, setSelectedDoc] = useState<PortalDocument | null>(null);

    const currentJourney = journeys.find((item) => item.journey_code === portalKey || String((item as any)._id || item.id || "") === String(portalKey) || item.portal_token === portalKey);
    const syncedJourney = currentJourney ? syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates).journey : null;

    useEffect(() => {
        if (!currentJourney) return;
        const syncResult = syncJourneyPortalSummary(journeys, currentJourney, portalDocuments, journeyTemplates);
        if (syncResult.changed) setJourneys(syncResult.journeys);
    }, [currentJourney, journeyTemplates, journeys, portalDocuments, setJourneys]);

    if (!syncedJourney) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy dữ liệu.</div>;

    const visibleDocuments = portalDocuments.filter((item) => item.journey_id === syncedJourney.id && item.is_visible !== false).sort((left, right) => {
        const leftSort = left.sort_order ?? 0;
        const rightSort = right.sort_order ?? 0;
        if (leftSort !== rightSort) return leftSort - rightSort;
        return left.published_at.localeCompare(right.published_at);
    });
    const imageDocuments = visibleDocuments.filter((item) => item.file_type === 'image');
    const fileDocuments = visibleDocuments.filter((item) => item.file_type !== 'image');
    const selectedUrl = selectedDoc?.download_url || selectedDoc?.url || '';
    const viewerUrl = selectedUrl ? 'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(selectedUrl) : '';

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
            <PortalPageHeader title='Tài liệu & Hình ảnh' subtitle={syncedJourney.request_title} token={syncedJourney.journey_code || portalKey || ''} icon={<FolderOpenOutlined />} />

            <Card title={<span><PictureOutlined /> Hình ảnh ({imageDocuments.length})</span>} style={{ borderRadius: 12, marginBottom: 16 }}>
                {imageDocuments.length === 0 ? (
                    <Empty description='Chưa có hình ảnh được công bố' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    <Image.PreviewGroup>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                            {imageDocuments.map((img) => (
                                <div key={img.id}>
                                    <Image src={img.url || img.thumbnail_url} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }} />
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
                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>{doc.file_name}</div>
                                <Space size={4}>
                                    <Tag style={{ fontSize: 10 }}>{doc.file_type.toUpperCase()}</Tag>
                                    <Tag style={{ fontSize: 10 }}>{doc.published_context}</Tag>
                                    <Text type='secondary' style={{ fontSize: 11 }}>{doc.published_at}</Text>
                                </Space>
                            </div>
                            <Button size='small' icon={<FileOutlined />} onClick={() => setSelectedDoc(doc)}>Xem</Button>
                        </div>
                    ))
                )}
            </Card>

            <Modal
                title={'Xem tài liệu: ' + (selectedDoc?.file_name || '')}
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
                        <Image src={selectedDoc.url || selectedDoc.thumbnail_url} alt={selectedDoc.file_name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                ) : selectedUrl ? (
                    <iframe src={viewerUrl} title={selectedDoc.file_name} width='100%' height='100%' style={{ border: 'none', background: '#f5f5f5' }} />
                ) : (
                    <Empty description='Tài liệu này chưa có đường dẫn preview' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 80 }} />
                )}
            </Modal>
        </div>
    );
};

export default PortalDocuments;
