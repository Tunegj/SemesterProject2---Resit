export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Defines the API endpoints for the application. Each endpoint is represented as a string or a function that returns a string.
 * The endpoints are organized in a way that allows for easy access and maintenance. The `as const` assertion ensures that the types of the endpoints are preserved as literal types, providing better type safety when using these endpoints throughout the application.
 */
export const API_ENDPOINTS = {
  pets: "/pets",
  petsById: (id: string) => `/pets/${id}`,
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
} as const;
