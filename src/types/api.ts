export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface ApiErrorResponse {
  errors?: {
    message: string;
  }[];
  message?: string;
}
