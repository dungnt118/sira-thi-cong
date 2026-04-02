import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

export type JourneyFileKind = 'pdf' | 'image' | 'video' | 'other';

function getExtension(pathOrName?: string): string {
    if (!pathOrName) return '';
    const base = pathOrName.split('?')[0].split('/').pop() || '';
    const i = base.lastIndexOf('.');
    return i >= 0 ? base.slice(i + 1).toLowerCase() : '';
}

/** Phân loại file đính kèm JourneyDocument theo mime, file_type hoặc phần mở rộng. */
export function classifyJourneyFile(file: HeadlessFileUpload): JourneyFileKind {
    const mime = (file.mime_type || file.file_type || '').toLowerCase();
    if (mime.includes('pdf') || mime === 'application/pdf') return 'pdf';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    const ext = getExtension(file.name) || getExtension(file.url);
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'ogv'].includes(ext)) return 'video';
    return 'other';
}

export function getJourneyFileDisplayName(file: HeadlessFileUpload): string {
    const n = file.name?.trim();
    if (n) return n;
    const fromUrl = file.url?.split('?')[0].split('/').pop();
    if (fromUrl) {
        try {
            return decodeURIComponent(fromUrl);
        } catch {
            return fromUrl;
        }
    }
    return 'Tệp đính kèm';
}
