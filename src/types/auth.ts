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
