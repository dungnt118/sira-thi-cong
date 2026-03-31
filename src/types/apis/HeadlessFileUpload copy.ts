/**
 * Interface cho file upload response từ Headless API
 */
export interface HeadlessFileUpload {
    file_id?: string;
    name?: string;
    file_path?: string;
    file_type?: string;
    mime_type?: string;
    url?: string;
    size?: number;
    created_at?: string;
    updated_at?: string;
} 