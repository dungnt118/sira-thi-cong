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
  data?: T;
  total?: number;
}
