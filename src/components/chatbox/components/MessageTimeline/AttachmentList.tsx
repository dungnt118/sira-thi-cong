import { DownloadOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { getFileLink } from '../../../../services/storeService';
import type { IHeadlessFileUpload } from '../../contentConversation.types';
import { formatFileSize, getAttachmentUrl, getFileIcon } from '../../utils/chatboxUtils';
import './AttachmentList.less';

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;

const isImageAttachment = (attachment: IHeadlessFileUpload): boolean => {
    if (attachment.file_type === 'image') return true;
    if (attachment.mime_type?.startsWith('image/')) return true;
    const name = attachment.name ?? attachment.url ?? attachment.file_path ?? '';
    return IMAGE_EXT.test(name);
};

const resolveAttachmentUrl = (attachment: IHeadlessFileUpload): string | null => {
    if (attachment.url) return attachment.url;
    if (attachment.file_path) return getFileLink(attachment.file_path) || null;
    if (attachment.file_id) return getFileLink(attachment.file_id) || null;
    return null;
};

interface IAttachmentListProps {
    attachments: IHeadlessFileUpload[];
}

export default function AttachmentList({ attachments }: IAttachmentListProps) {
    const handleDownload = (attachment: IHeadlessFileUpload) => {
        const url = resolveAttachmentUrl(attachment);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <ul className="attachment-list" role="list" aria-label="Đính kèm">
            {attachments.map((attachment, index) => {
                const key = attachment.file_id ?? attachment.file_path ?? String(index);
                const isImage = isImageAttachment(attachment);
                const src = resolveAttachmentUrl(attachment);

                if (isImage && src) {
                    return (
                        <li key={key} className="attachment-item attachment-item--image">
                            <div className="attachment-image-thumb-wrap">
                                <Image
                                    src={src}
                                    alt={attachment.name ?? 'Ảnh đính kèm'}
                                    className="attachment-image-thumb"
                                    style={{ maxWidth: 96, maxHeight: 96, objectFit: 'contain' }}
                                    preview={{ mask: 'Xem ảnh' }}
                                />
                            </div>
                            <div className="attachment-image-footer">
                                <span className="attachment-name" title={attachment.name ?? undefined}>
                                    {attachment.name || 'Ảnh không tên'}
                                </span>
                                {attachment.size != null && attachment.size > 0 && (
                                    <span className="attachment-size">{formatFileSize(attachment.size)}</span>
                                )}
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleDownload(attachment);
                                    }}
                                    className="attachment-download"
                                />
                            </div>
                        </li>
                    );
                }

                return (
                    <li key={key} className="attachment-item">
                        <span className="attachment-icon" aria-hidden>
                            {getFileIcon(attachment.mime_type, attachment.file_type)}
                        </span>
                        <div className="attachment-info">
                            <span className="attachment-name" title={attachment.name ?? undefined}>
                                {attachment.name || getAttachmentUrl(attachment) || 'Tệp không tên'}
                            </span>
                            {attachment.size != null && attachment.size > 0 && (
                                <span className="attachment-size">{formatFileSize(attachment.size)}</span>
                            )}
                        </div>
                        <Button
                            type="text"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(attachment)}
                            className="attachment-download"
                        />
                    </li>
                );
            })}
        </ul>
    );
}
