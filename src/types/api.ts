export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

/**
 * Represents the structure of an error response from the API. This interface is used to handle and display error messages returned by the API.
 */
export interface ApiErrorResponse {
  errors?: {
    message: string;
  }[];
  message?: string;
}
