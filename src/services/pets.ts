import { apiClient } from "../api/client";
import { API_ENDPOINTS } from "../api/constants";
import type { ApiResponse } from "../types/api";
import type { Pet } from "../types/pet";

export async function fetchPets(): Promise<Pet[]> {
  const response = await apiClient<ApiResponse<Pet[]>>("/pets");

  return response.data;
}

export async function fetchPetById(id: string): Promise<Pet> {
  const response = await apiClient<ApiResponse<Pet>>(
    API_ENDPOINTS.petsById(id),
  );

  return response.data;
}

export async function addPet(petData: unknown): Promise<Pet> {
  const response = await apiClient<ApiResponse<Pet>>(API_ENDPOINTS.pets, {
    method: "POST",
    auth: true,
    body: petData,
  });

  return response.data;
}

export async function updatePet(id: string, petData: unknown): Promise<Pet> {
  const response = await apiClient<ApiResponse<Pet>>(
    API_ENDPOINTS.petsById(id),
    {
      method: "PUT",
      auth: true,
      body: petData,
    },
  );

  return response.data;
}

export async function deletePet(id: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.petsById(id), {
    method: "DELETE",
    auth: true,
  });
}
