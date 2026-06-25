// This file contains TypeScript interfaces related to authentication, including login and registration credentials and responses.

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  name: string;
  email: string;
  accessToken: string;
  avatar?: {
    url: string;
    alt: string;
  } | null;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseUser {
  name: string;
  email: string;
}
