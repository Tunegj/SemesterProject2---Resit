/**
 * This file defines the TypeScript interfaces for the Pet data model used in the application.
 * It includes the structure of a Pet object, as well as related types such as PetImage and PetOwner.
 */

export interface PetImage {
  url: string;
  alt?: string;
}

interface PetOwner {
  name?: string;
  email?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  color: string;
  description: string;
  adoptionStatus: "available" | "pending" | "adopted";
  location: string;
  images: PetImage;
  created: string;
  updated: string;
  owner?: PetOwner;
}
