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

/**
 * Clears the stored authentication information (token and user) from local storage.
 */
function clearStoredAuth(): void {
  clearToken();
  clearUser();
}

export function isPetOwner(ownerEmail: unknown): boolean {
  const currentUser = getAuthenticatedUser();

  if (!currentUser?.email || typeof ownerEmail !== "string") {
    return false;
  }

  const currentUserEmail = currentUser.email.trim().toLowerCase();
  const petOwnerEmail = ownerEmail.trim().toLowerCase();

  return Boolean(
    currentUserEmail && petOwnerEmail && currentUserEmail === petOwnerEmail,
  );
}

/** Retrieves the currently authenticated user from local storage. If there is no valid token or user information, it clears the stored authentication and returns null.
 * @returns The currently authenticated user as a StoredUser object, or null if not authenticated.
 */
export function getAuthenticatedUser(): StoredUser | null {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    clearStoredAuth();
    return null;
  }

  return user;
}

/** Checks if the user is currently logged in by verifying the presence of a valid authenticated user.
 * @returns A boolean indicating whether the user is logged in or not.
 */
export function isLoggedIn(): boolean {
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
  return isAuthenticated();
}

/** Saves the authentication token and user information to local storage. If the token is empty or invalid, it clears the stored authentication and notifies listeners about the change. If the token and user are valid, it saves them to local storage and notifies listeners about the change.
 * @param token - The authentication token to be saved.
 * @param user - The user information to be saved.
 * @returns A boolean indicating whether the authentication information was saved successfully or not.
 */
export function saveAuth(token: string, user: StoredUser): boolean {
  const cleanedToken = token.trim();

  if (!cleanedToken) {
    clearStoredAuth();
    notifyAuthChange();
    return false;
  }

  try {
    setToken(cleanedToken);
    setUser(user);

    const savedUser = getAuthenticatedUser();

    if (!savedUser) {
      notifyAuthChange();
      return false;
    }

    notifyAuthChange();
    return true;
  } catch {
    clearStoredAuth();
    notifyAuthChange();
    return false;
  }
}

/** Logs out the currently authenticated user by clearing the stored authentication information and notifying listeners about the change.
 */
export function logout(): void {
  clearStoredAuth();
  notifyAuthChange();
}
