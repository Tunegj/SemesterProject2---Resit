export const STORAGE_KEYS = {
  token: "fureverhome:accessToken",
  user: "fureverhome:user",
} as const;

export interface StoredUser {
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    (user.name === undefined || typeof user.name === "string") &&
    (user.email === undefined || typeof user.email === "string") &&
    (user.role === undefined || typeof user.role === "string") &&
    (user.isAdmin === undefined || typeof user.isAdmin === "boolean")
  );
}

/**
 * Helper functions to manage the access token in local storage, save, get and delete.
 **/
export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.token, token.trim());
}

export function getToken(): string | null {
  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (!token?.trim()) {
    clearToken();
    return null;
  }
  return token;
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
}

/**
 * Allows components to subscribe to authentication state changes. The provided callback will be called whenever the authentication state changes (e.g., when a user logs in or out).
 * @param callback - A function that will be called when the authentication state changes.
 */
export function setUser(user: StoredUser): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

/**
 * Retrieves the stored user information from local storage. If the stored data is invalid or cannot be parsed, it will be removed from local storage and null will be returned.
 * @returns The stored user information or null if not found or invalid.
 */
export function getUser(): StoredUser | null {
  const storedUser = localStorage.getItem(STORAGE_KEYS.user);

  if (!storedUser) {
    return null;
  }

  try {
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
  localStorage.removeItem(STORAGE_KEYS.user);
}
