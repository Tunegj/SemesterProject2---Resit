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
