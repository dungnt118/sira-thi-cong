/**
 * Base interface for headless content model.
 */
export interface HeadlessContentModel {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}
