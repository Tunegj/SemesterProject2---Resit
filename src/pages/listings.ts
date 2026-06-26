import { fetchPets } from "../services/pets.ts";
import { petCard } from "../components/petCard.ts";
import type { Pet } from "../types/pet.ts";

function normalizeSearchValue(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function petMatchesSearch(pet: Pet, searchTerm: string): boolean {
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  if (!normalizedSearchTerm) return true;

  const searchableValues: unknown[] = [
    pet.name,
    pet.species,
    pet.breed,
    pet.gender,
    pet.size,
    pet.color,
    pet.description,
    pet.location,
    pet.adoptionStatus,
  ];

  return searchableValues.some(
    (value) =>
      typeof value === "string" &&
      normalizeSearchValue(value).includes(normalizedSearchTerm),
  );
}

/**
 * Generates the HTML string for the listings page, which displays a list of pets available for adoption. The page includes a header with a title and description, and a container for the pet listings. The listings container has an aria-busy attribute to indicate loading status, and a status message that updates based on the number of pets available or any errors encountered during data fetching.
 * @returns An HTML string representing the listings page.
 */
export function listingsPage(): string {
  return `
  <section aria-labelledby="listings-heading">
    <header class="mb-8">
      <h1 
      id="listings-heading"
      class="text-3xl font-bold text-[#2d6a6a]"
      >
        Pets available for Adoption
      </h1>

      <p class="mt-3 text-[#2c2c2c]">
        Browse through our list of adorable pets looking for a loving home.
      </p>
    </header>

    <div class="mb-8 max-w-xl">
      <label 
      for="pet-search"
      class="mb-2 block font-semibold text-[#2c2c2c]"
      >
        Search Pets
      </label>
      <input
        id="pet-search"
        data-pet-search-input
        type="search"
        placeholder="Search by name, breed, location..."
        autoComplete="off"
        class="
        w-full rounded-lg border border-gray-300 bg-white px-4 py-3
        text-[#2c2c2c]
        placeholder:text-gray-500
        focus:border-[#2d6a6a]
        focus:outline-none
        focus:ring-2
        focus:ring-[#2d6a6a]
        focus:ring-offset-2
    "
      />
    </div>
    
    <div data-listings-container aria-busy="true">
      <p
      data-listings-status
      role="status"
      aria-live="polite"
      class="text-center text-[#2c2c2c]"
      >
        Loading pets...
      </p>

      <div
      data-pet-list
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      ></div>
    </div>
  </section>
  `;
}

/**
 * Initializes the listings page by fetching the list of pets availble for adoption and rendering them in the pet list container. It also sets up errro handling and updates the status message based on the number of pets available or any errors encountered during data fetching. Additionally, it adds event listeners to handle image loading errors for each pet card.
 * This function should be called when the listings page is loaded to ensure that the pet data is fetched and displayed correctly.
 */
export async function initListingsPage(): Promise<void> {
  const listingsContainer = document.querySelector<HTMLElement>(
    "[data-listings-container]",
  );

  const listingsStatus = document.querySelector<HTMLParagraphElement>(
    "[data-listings-status]",
  );

  const petList = document.querySelector<HTMLElement>("[data-pet-list]");

  const petSearchInput = document.querySelector<HTMLInputElement>(
    "[data-pet-search-input]",
  );

  if (!listingsContainer || !listingsStatus || !petList || !petSearchInput)
    return;

  try {
    const pets = await fetchPets();

    const renderPets = (petsToRender: Pet[], searchTerm = ""): void => {
      petList.innerHTML = "";

      if (petsToRender.length === 0) {
        listingsStatus.textContent = searchTerm
          ? `No pets found matching "${searchTerm}".`
          : "No pets available for adoption at the moment.";

        return;
      }

      petList.innerHTML = petsToRender.map((pet) => petCard(pet)).join("");

      petList
        .querySelectorAll<HTMLImageElement>("[data-pet-image]")
        .forEach((image) => {
          image.addEventListener(
            "error",
            () => {
              image.hidden = true;

              const fallback = image.nextElementSibling;

              if (fallback instanceof HTMLElement) {
                fallback.hidden = false;
              }
            },
            { once: true },
          );
        });

      listingsStatus.textContent = searchTerm
        ? `${petsToRender.length} ${petsToRender.length === 1 ? "pet matches" : "pets match"} "${searchTerm}".`
        : `${petsToRender.length} pets available for adoption.`;
    };

    renderPets(pets);

    petSearchInput.addEventListener("input", () => {
      const searchTerm = petSearchInput.value.trim().replace(/\s+/g, " ");

      const filteredPets = pets.filter((pet) =>
        petMatchesSearch(pet, searchTerm),
      );

      renderPets(filteredPets, searchTerm);
    });
  } catch (error) {
    console.error(error);

    listingsStatus.textContent =
      error instanceof Error
        ? error.message
        : "Unable to load pets. Please try again later.";
  } finally {
    listingsContainer.setAttribute("aria-busy", "false");
  }
}
