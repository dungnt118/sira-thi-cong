/**
 * Interface cho nội dung tham chiếu trong GraphQL
 * Chuẩn hóa theo backend HeadlessReferenceContent class
 */
export type HeadlessReferenceContent = {
    _id: string;
    schema?: string;
    schema_label?: string;
    display_name?: string;
    code?: string;
};


export type HeadlessReferenceContentInput = {
    _id: string;
    schema?: string;
    schema_label?: string;
    display_name?: string;
    code?: string;
};
