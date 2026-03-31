export enum ApiResponseCode {
  SUCCESS = 0,
  FAILURE = 1,
  NOT_AUTHORIZE = 2,
  EXISTED = 3,
  NOT_FOUND = 4,
  INTERNAL_ERROR = 5,
  SILENCE_FAILURE = 6,
  ACCEPTED = 202,
}

export interface ApiResponse<T = any> {
  code: ApiResponseCode | number;
  message?: string;
  data?: T | null;
  total?: number;
}

export interface ApiListResponse<T = any> extends ApiResponse<T[]> {
  page?: number;
  pages?: number;
  records?: number;
}

export interface IndexedContentItem {
  _id: string;
  _content_id?: string;
  _schema_name?: string;
  [key: string]: any;
}
