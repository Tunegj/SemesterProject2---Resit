import {
  getToken,
  getUser,
  clearToken,
  clearUser,
  setToken,
  setUser,
  type StoredUser,
} from "./storage.ts";

const AUTH_CHANGED_EVENT = "auth:changed";

/**
 * Dispatches a custom event to notify listeners about changes in authentication state.
 */
function notifyAuthChange(): void {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

function clearStoredAuth(): void {
  clearToken();
  clearUser();
}

export function getAuthenticatedUser(): StoredUser | null {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  if (!token || !user) {
    clearStoredAuth();
    return null;
  }

  return user;
}

function isLoggedIn(): boolean {
  return getAuthenticatedUser() !== null;
}

/**
 * Checks if the user is currently authenticated by verifying the presence of a valid access token in local storage.
 * @returns A boolean indicating whether the user is authenticated or not.
 */
export function isAuthenticated(): boolean {
  return isLoggedIn();
}

/** Checks if the currently authenticated user has administrative privileges based on the stored user information in local storage.
 * @returns A boolean indicating whether the user has admin privileges or not.
 */
export function isAdmin(): boolean {
  const user = getAuthenticatedUser();

  if (!user) {
    return false;
  }

  return user.role?.toLowerCase() === "admin" || user.isAdmin === true;
}

export function saveAuth(token: string, user: StoredUser): boolean {
  const cleanedToken = token.trim();

  if (!cleanedToken) {
    clearStoredAuth();
    notifyAuthChange();
    return false;
  }

  setToken(cleanedToken);
  setUser(user);
  notifyAuthChange();

  return true;
}

export function logout(): void {
  clearStoredAuth();
  notifyAuthChange();
}
