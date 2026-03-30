/**
 * Định nghĩa Filter chuẩn cho các query lấy danh sách (Collection)
 */
export interface GeneralCollectionFilter {
    /** Tìm kiếm theo từ khóa (name/code/...) */
    search?: string;
    
    /** Giới hạn số bản ghi */
    limit?: number;
    
    /** Bỏ qua số bản ghi (pagination) */
    skip?: number;
    
    /** Sắp xếp: { field: 1 | -1 } hoặc chuỗi "field ASC/DESC" */
    sort?: any;
    
    /** Filter phức tạp (Mongo-style hoặc tương đương backend nhận) */
    where?: any;
    
    /** Lọc theo danh sách ID cụ thể */
    _ids?: string[];

    /** Lọc theo ID đơn lẻ */
    _id?: string;

    /** Các trường filter bổ sung động */
    [key: string]: any;
}
