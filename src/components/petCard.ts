import type { Pet } from "../types/pet";
import { escapeHtml } from "../utils/escapeHtml";

/**
 * Capitalizes the first letter of each word in a string. If the input is not a valid string, it returns a fallback value.
 * @param value - The string to capitalize.
 * @param fallback - The fallback string to return if the input is not a valid string.
 * @returns The capitalized string or the fallback value.
 */
function capitalizeFirstLetter(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value
    .trim()
    .split(/\s+/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Generates an HTML string representing a pet card with the provided pet data. The card includes the pet's image, name, species, breed, age, size, and location. If the image fails to load or is not available, a fallback message is displayed.
 * @param pet - The pet data to display in the card.
 * @returns An HTML string representing the pet card.
 */
export function petCard(pet: Pet): string {
  const name = escapeHtml(capitalizeFirstLetter(pet.name, "Unnamed Pet"));
  const breed = escapeHtml(capitalizeFirstLetter(pet.breed, "Unknown Breed"));
  const size = escapeHtml(capitalizeFirstLetter(pet.size, "Unknown Size"));
  const location = escapeHtml(
    capitalizeFirstLetter(pet.location, "Unknown Location"),
  );

  const imageUrl = pet.image?.url?.trim();
  const imageAlt = escapeHtml(pet.image?.alt?.trim() || `Photo of ${name}`);

  const species = escapeHtml(
    capitalizeFirstLetter(pet.species, "Unknown Species"),
  );
  const age =
    typeof pet.age === "number"
      ? `${pet.age} ${pet.age === 1 ? "year" : "years"}`
      : "Unknown Age";

  const imageMarkup = imageUrl
    ? `
    <div class="h-56 bg-gray-200">
        <img
            src="${escapeHtml(imageUrl)}"
            alt="${imageAlt}"
            class="h-56 w-full object-cover"
            loading="lazy"
            data-pet-image
        />
        
        <div data-image-fallback hidden>
            <div
                class="flex h-56 items-center justify-center text-sm text-gray-600"
                role="img"
                aria-label="Image not available for ${name}"
            >
                Image not available
            </div>
        </div>
    </div>
            `
    : `
        <div
        class="flex h-56 items-center justify-center bg-gray-200 text-sm text-gray-600"
        role="img"
        aria-label="No image available for ${name}"
        >
        Image not available
        </div>
        `;

  return `
        <article class="overflow-hidden rounded-lg bg-white shadow-sm
        transition-shadow duration-200 hover:shadow-lg
        focus-within:ring-2
        focus-within:ring-offset-2
        focus-within:ring-[#2d6a6a]">
            <a
                href="#/listing?id=${encodeURIComponent(pet.id)}"
                class="block focus:outline-none"
            >
                ${imageMarkup}

                <div class="space-y-2 p-5">
                    <h2 class="text-xl font-bold text-[#2d6a6a]">
                        ${name}
                    </h2>

                    <p class="text-[#2c2c2c]">
                        ${species} · ${breed}
                    </p>

                    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#2c2c2c]">
                        <div>
                            <dt class="font-semibold">Age</dt>
                            <dd>${age}</dd>
                        </div>

                        <div>
                            <dt class="font-semibold">Size</dt>
                            <dd>${size}</dd>
                        </div>

                        <div>
                            <dt class="font-semibold">Location</dt>
                            <dd>${location}</dd>
                        </div>
                    </dl>
                </div>
            </a>
        </article>
        `;
}
