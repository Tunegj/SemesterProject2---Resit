export const STORAGE_KEYS = {
  token: "fureverhome:accessToken",
  user: "fureverhome:user",
} as const;

export interface StoredUser {
  name: string;
  email: string;
}

/**
 * Type guard to check if a value conforms to the StoredUser interface. This is used to validate the structure of the user data retrieved from local storage.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a valid StoredUser object or not.
 */
function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.name === "string" &&
    user.name.trim().length > 0 &&
    typeof user.email === "string" &&
    user.email.trim().length > 0
  );
}

/**
 * Helper functions to manage the access token in local storage, save, get and delete.
 **/
export function setToken(token: string): void {
  const cleanToken = token.trim();

  if (!cleanToken) {
    clearToken();
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.token, cleanToken);
  } catch {
    clearToken();
  }
}

export function getToken(): string | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (!token?.trim()) {
      clearToken();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.token);
  } catch {
    // Handle potential errors, e.g., quota exceeded or storage access issues
  }
}

/**
 * Stores the user profile in local storage.
 * @param user - The user information to store.
 */
export function setUser(user: StoredUser): void {
  try {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } catch {
    clearUser();
  }
}

/**
 * Retrieves the stored user information from local storage. If the stored data is invalid or cannot be parsed, it will be removed from local storage and null will be returned.
 * @returns The stored user information or null if not found or invalid.
 */
export function getUser(): StoredUser | null {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!storedUser) {
      return null;
    }

    const parsedUser: unknown = JSON.parse(storedUser);

    if (!isStoredUser(parsedUser)) {
      clearUser();
      return null;
    }

    return parsedUser;
  } catch {
    clearUser();
    return null;
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.user);
  } catch {
    // Handle potential errors, e.g., quota exceeded or storage access issues
  }
}
