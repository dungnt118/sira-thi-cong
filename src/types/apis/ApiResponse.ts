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

/**
 * Interface generic cho response đơn từ API
 * @template T - Type của data trả về
 */
export interface ApiResponse<T> {
  data?: T | null;
  code?: ApiResponseCode;
  message?: string;
}

/**
 * Interface generic cho response dạng list từ API
 * @template T - Type của mỗi item trong list data
 */
export interface ApiListResponse<T> {
  data?: T[] | null;
  code?: ApiResponseCode;
  message?: string;
  page?: number;
  records?: number;
  pages?: number;
  hasMore?: boolean;
}
