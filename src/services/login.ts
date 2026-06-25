import { apiClient } from "../api/client.ts";
import { API_ENDPOINTS } from "../api/constants.ts";
import type { ApiResponse } from "../types/api.ts";
import type { LoginCredentials, LoginResponseUser } from "../types/auth.ts";

/**
 * Sends the user's login credentials to the API
 *
 * @param credentials - The user's email and password.
 * @returns The authenticated user data and access token
 * @throws An error if the login response is incomplete or if the API request fails.
 */
export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponseUser> {
  const response = await apiClient<ApiResponse<LoginResponseUser>>(
    API_ENDPOINTS.auth.login,
    {
      method: "POST",
      body: credentials,
    },
  );

  const user = response?.data;

  if (
    !user ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    typeof user.accessToken !== "string" ||
    !user.accessToken.trim()
  ) {
    throw new Error("The login response was incomplete. Please try again.");
  }
  return user;
}
