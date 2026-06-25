import { fetchPets } from "../services/pets.ts";
import { petCard } from "../components/petCard.ts";

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
 * Initializes the listings page by fetching the list of pets available for adoption and rendering them in the pet list container. It also sets up error handling and updates the status message based on the number of pets available or any errors encountered during data fetching. Additionally, it adds event listeners to handle image loading errors for each pet card.
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

  if (!listingsContainer || !listingsStatus || !petList) return;

  try {
    const pets = await fetchPets();

    if (pets.length === 0) {
      listingsStatus.textContent =
        "No pets available for adoption at the moment.";
      return;
    }

    petList.innerHTML = pets.map((pet) => petCard(pet)).join("");

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

    listingsStatus.textContent = `${pets.length} pets available for adoption.`;
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
