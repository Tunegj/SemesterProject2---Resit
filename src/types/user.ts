export interface UserProfile {
  name: string;
  email: string;
  role?: string;
  avatar?: {
    url: string;
    alt: string;
  } | null;
}
