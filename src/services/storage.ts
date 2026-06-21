const TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const AUTH_CHANGED_EVENT = "auth:changed";

export interface StoredUser {
  name?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
}

/**
 * Dispatches a custom event to notify listeners about changes in authentication state.
 */
function notifyAuthChange(): void {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
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

/**
 * Helper functions to manage the access token in local storage, save, get and delete.
 **/
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Checks if the user is currently authenticated by verifying the presence of a valid access token in local storage.
 * @returns A boolean indicating whether the user is authenticated or not.
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/** Checks if the currently authenticated user has administrative privileges based on the stored user information in local storage.
 * @returns A boolean indicating whether the user has admin privileges or not.
 */
export function isAdmin(): boolean {
  const user = getUser();

  if (!user) {
    return false;
  }

  return user.role?.toLowerCase() === "admin" || user.isAdmin === true;
}

/** Clears the stored access token and user information from local storage, effectively logging the user out. It also dispatches an event to notify listeners about the change in authentication state.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}
