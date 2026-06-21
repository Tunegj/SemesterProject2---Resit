const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface StoredUser {
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
}

/**
 * Helper functions to manage the access token in local storage, save, get and delete.
 **/
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Allows components to subscribe to authentication state changes. The provided callback will be called whenever the authentication state changes (e.g., when a user logs in or out).
 * @param callback - A function that will be called when the authentication state changes.
 */
export function saveUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieves the stored user information from local storage. If the stored data is invalid or cannot be parsed, it will be removed from local storage and null will be returned.
 * @returns The stored user information or null if not found or invalid.
 */
export function getUser(): StoredUser | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}
