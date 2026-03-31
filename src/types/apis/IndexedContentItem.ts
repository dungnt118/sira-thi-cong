/**
 * Interface cho item được trả về từ search_indexed_content API
 */
export interface IndexedContentItem {
    itemId: string;
    title: string;
    code?: string;
    schema?: string;
    schema_label?: string;
    display_name?: string;
    [key: string]: any;
}

