import { getToken } from "../services/storage";
import { API_BASE_URL } from "./constants";
import type { ApiErrorResponse } from "../types/api";

/**
 * Defines the HTTP methods that can be used in the API client.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Defines the options that can be passed to the API client function.
 * - `method`: The HTTP method to use for the request (default is "GET").
 * - `body`: The body of the request, which will be stringified to JSON if provided.
 * - `auth`: A boolean indicating whether the request requires authentication (default is false). If true, the function will include the access token in the Authorization header.
 */
interface ApiClientOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
}

/**
 * A generic API client function that can be used to make HTTP requests to the backend API. It takes an endpoint and an options object, and returns a promise that resolves to the response data of type T.
 */

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in to perform this action.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await parseJsonSafely<ApiErrorResponse>(response);

    const message =
      errorData?.errors?.[0]?.message ||
      errorData?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return parseJsonSafely<T>(response) as Promise<T>;
}

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
}
