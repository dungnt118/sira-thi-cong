export type PortalDocumentType = 'pdf' | 'doc' | 'image' | 'other';

export type PortalDocumentContextType = 'survey' | 'quotation' | 'contract' | 'progress' | 'payment' | 'general';

export interface PortalDocument {
    id: string;
    journey_id: string;
    journey_code?: string;
    context_type: PortalDocumentContextType;
    published_context: string;
    file_name: string;
    file_type: PortalDocumentType;
    published_at: string;
    sort_order?: number;
    is_visible?: boolean;
    url?: string;
    download_url?: string;
    thumbnail_url?: string;
}
