import type { Pet } from "../types/pet";
import { escapeHtml } from "../utils/escapeHtml";

/**
 * Capitalizes the first letter of each word in a string.
 * Returns the provided fallback when the value is not a non-empty string.
 *
 * @param value - The value to capitalize.
 * @param fallback - The text to return when the value is invalid or empty.
 * @returns The capitalized string or the fallback.
 */
function capitalizeWords(value: unknown, fallback: string): string {
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
 * Generates the HTML markup for a pet card.
 *
 * @param pet - The pet data to display in the card.
 * @param headingLevel - The heading level to use for the pet's name.
 * @returns The HTML markup for the pet card.
 */
export function petCard(pet: Pet, headingLevel: "h2" | "h3" = "h2"): string {
  const name = escapeHtml(capitalizeWords(pet.name, "Unnamed Pet"));
  const breed = escapeHtml(capitalizeWords(pet.breed, "Unknown Breed"));
  const size = escapeHtml(capitalizeWords(pet.size, "Unknown Size"));
  const location = escapeHtml(
    capitalizeWords(pet.location, "Unknown Location"),
  );

  const normalizedStatus =
    typeof pet.adoptionStatus === "string"
      ? pet.adoptionStatus.trim().toLowerCase()
      : "";

  const statusLabel = escapeHtml(capitalizeWords(normalizedStatus, "Unknown"));

  const statusClasses = {
    available: "bg-[#4CAF50] text-[#2c2c2c]",
    pending: "bg-[#F59E0B] text-[#2c2c2c]",
    adopted: "bg-[#7C8595] text-white",
  } as const;

  const statusClass =
    statusClasses[normalizedStatus as keyof typeof statusClasses] ??
    "bg-gray-300 text-gray-700";

  const petId =
    typeof pet.id === "string" && pet.id.trim() ? pet.id.trim() : "";

  const imageUrl =
    typeof pet.image?.url === "string" ? pet.image.url.trim() : "";
  const imageAlt =
    typeof pet.image?.alt === "string" && pet.image.alt.trim()
      ? escapeHtml(pet.image?.alt?.trim())
      : `Photo of ${name}`;

  const species = escapeHtml(capitalizeWords(pet.species, "Unknown Species"));
  const age =
    typeof pet.age === "number" && Number.isFinite(pet.age) && pet.age > 0
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
        <article 
            class="h-full overflow-hidden rounded-lg bg-white shadow-sm
            transition-shadow duration-200 hover:shadow-lg
            focus-within:ring-2
            focus-within:ring-offset-2
            focus-within:ring-[#2d6a6a]"
        >
            
            <a
                href="${petId ? `#/listing?id=${encodeURIComponent(petId)}` : "#/listings"}"
                aria-label="View details for ${name}"
                class="block h-full focus:outline-none"
            >
               <div class="relative">
                    ${imageMarkup}

                    <span
                        class="absolute right-3 bottom-3 z-10 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}"
                        aria-label="Adoption status: ${statusLabel}"
                    >
                        ${statusLabel}
                    </span>
                </div>

                <div class="space-y-2 break-words p-5">
                    <${headingLevel} class="text-xl font-bold text-[#2d6a6a]">
                        ${name}
                    </${headingLevel}>

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

                        <div class="col-span-2">
                            <dt class="font-semibold">Location</dt>
                            <dd>${location}</dd>
                        </div>
                    </dl>
                </div>
            </a>
        </article>
        `;
}
