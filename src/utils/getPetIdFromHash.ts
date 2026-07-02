/** * Retrieves the pet listing ID from the URL hash query parameters.
 * @returns The pet listing ID as a string, or null if not found.
 */
export function getPetIdFromHash(): string | null {
  const queryString = window.location.hash.split("?")[1] ?? "";
  const petId = new URLSearchParams(queryString).get("id");

  return petId?.trim() || null;
}
