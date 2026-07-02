/** * Validates whether a given string is a valid UUID (Universally Unique Identifier) format.
 * @param id - The string to validate as a UUID.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function isValidListingId(id: string): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return uuidPattern.test(id);
}
