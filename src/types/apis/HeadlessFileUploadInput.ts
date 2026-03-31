/**
 * Interface cho file upload input trong GraphQL
 * Chuẩn hóa theo backend HeadlessFileUpload class
 */
export interface HeadlessFileUploadInput {
    /**
     * ID của file (ObjectId)
     */
    file_id?: string;
    
    /**
     * Tên file
     */
    name?: string;
    
    /**
     * Meta data cho file
     */
    alt?: string;
    
    /**
     * Link đầy đủ nếu copy từ domain khác
     */
    url?: string;
    
    /**
     * Loại file
     */
    file_type?: string;
    
    /**
     * MIME type của file (e.g., 'image/png', 'application/pdf')
     */
    mine_type?: string;
    
    /**
     * Đường dẫn file
     */
    file_path?: string;
}
