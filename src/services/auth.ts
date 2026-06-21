import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
  type StoredUser,
} from "./storage.ts";

const AUTH_CHANGED_EVENT = "auth:changed";

/**
 * Dispatches a custom event to notify listeners about changes in authentication state.
 */
function notifyAuthChange(): void {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
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

export function saveAuth(token: string, user: StoredUser): void {
  saveToken(token);
  saveUser(user);
  notifyAuthChange();
}

export function logout(): void {
  removeToken();
  removeUser();
  notifyAuthChange();
}
