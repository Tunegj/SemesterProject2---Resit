import { apiClient } from "../api/client";
import { API_ENDPOINTS } from "../api/constants";
import type { ApiResponse } from "../types/api";
import type { Pet, PetPayload } from "../types/pet";

/**
 * Fetches the list of pets from the API.
 * @returns A promise that resolves to an array of Pet objects.
 * @throws An error if the API response is invalid or if the request fails.
 */
export async function fetchPets(): Promise<Pet[]> {
  const response = await apiClient<ApiResponse<Pet[]>>(API_ENDPOINTS.pets);

  if (!Array.isArray(response.data)) {
    throw new Error("The Pets data received from the server is invalid.");
  }

  return response.data;
}

/** Fetches a single pet by its ID from the API.
 * @param id - The ID of the pet to fetch.
 * @returns A promise that resolves to a Pet object.
 * @throws An error if the API response is invalid or if the request fails.
 */
export async function fetchPetById(id: string): Promise<Pet> {
  const response = await apiClient<ApiResponse<Pet>>(
    API_ENDPOINTS.petsById(id),
  );

  const petData: unknown = response.data;

  if (!petData || typeof petData !== "object" || Array.isArray(petData)) {
    throw new Error("The Pet data received from the server is invalid.");
  }

  return petData as Pet;
}

/** Adds a new pet to the API.
 * @param petData - The data of the pet to add.
 * @returns A promise that resolves to the added Pet object.
 * @throws An error if the API response is invalid or if the request fails.
 */
export async function addPet(petData: PetPayload): Promise<Pet> {
  const response = await apiClient<ApiResponse<Pet>>(API_ENDPOINTS.pets, {
    method: "POST",
    auth: true,
    body: petData,
  });

  return response.data;
}

/** Updates an existing pet in the API.
 * @param id - The ID of the pet to update.
 * @param petData - The data of the pet to update.
 * @returns A promise that resolves to the updated Pet object.
 * @throws An error if the API response is invalid or if the request fails.
 */
export async function updatePet(id: string, petData: PetPayload): Promise<Pet> {
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

/** Deletes a pet from the API by its ID.
 * @param id - The ID of the pet to delete.
 * @returns A promise that resolves when the pet is deleted.
 * @throws An error if the request fails.
 */
export async function deletePet(id: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.petsById(id), {
    method: "DELETE",
    auth: true,
  });
}
