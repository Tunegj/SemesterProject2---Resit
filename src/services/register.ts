import { apiClient } from "../api/client.ts";
import { API_ENDPOINTS } from "../api/constants.ts";
import type { ApiResponse } from "../types/api.ts";
import type {
  RegisterCredentials,
  RegisterResponseUser,
} from "../types/auth.ts";

/**
 * Registers a new user with the provided credentials.
 * @param credentials - The registration credentials including name, email, password, and confirmPassword.
 * @returns A promise that resolves to the registered user's information.
 * @throws An error if the registration response is incomplete or invalid.
 */

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponseUser> {
  const response = await apiClient<ApiResponse<RegisterResponseUser>>(
    API_ENDPOINTS.auth.register,
    {
      method: "POST",
      body: credentials,
    },
  );

  const user = response?.data;

  if (
    !user ||
    typeof user.name !== "string" ||
    !user.name.trim() ||
    typeof user.email !== "string" ||
    !user.email.trim()
  ) {
    throw new Error(
      "The registration response was incomplete. Please try again",
    );
  }

  return user;
}
