import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/api";
import type { Pet } from "../types/pet";

export async function fetchPets(): Promise<Pet[]> {
  const response = await apiClient<ApiResponse<Pet[]>>("/pets");

  return response.data;
}
