const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * A simple API client function that fetches data from the specified endpoint and returns it as a typed object.
 */
export async function apiClient<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
