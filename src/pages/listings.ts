import { fetchPets } from "../services/pets.ts";
import { petCard } from "../components/petCard.ts";
import type { Pet } from "../types/pet.ts";

/**
 * Normalizes a search value by trimming whitespace, replacing multiple spaces with a single space, and converting to lowercase.
 * @param value - The search value to normalize.
 * @returns The normalized search value.
 */
function normalizeSearchValue(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Checks if a pet matches the given search term.
 * @param pet - The pet to check.
 * @param searchTerm - The search term to match against.
 * @returns True if the pet matches the search term, false otherwise.
 */
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
 * Retrieves unique, normalized filter values from an array of values.
 * @param values - The array of values to process.
 * @returns An array of unique, normalized filter values.
 */
function getFilterValues(values: unknown[]): string[] {
  const normalizedValues = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);

  return [...new Set(normalizedValues)].sort((a, b) => a.localeCompare(b));
}

/**
 * Formats a filter label by capitalizing the first letter of each word.
 * @param value - The filter value to format.
 * @returns The formatted filter label.
 */
function formatFilterLabel(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function populateFilterOptions(
  selectElement: HTMLSelectElement,
  values: unknown[],
): void {
  const filterValues = getFilterValues(values);

  filterValues.forEach((value) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = formatFilterLabel(value);

    selectElement.append(option);
  });
}

/**
 * Checks if a value matches a selected filter value.
 * @param value - The value to check.
 * @param selectedValue - The selected filter value to match against.
 * @returns True if the value matches the selected filter value, false otherwise.
 */
function matchesFilter(value: unknown, selectedValue: string): boolean {
  if (!selectedValue) return true;

  return (
    typeof value === "string" && value.trim().toLowerCase() === selectedValue
  );
}

/**
 * Checks if a pet matches the selected filter values for species, size, gender, and adoption status.
 * @param pet - The pet to check.
 * @param species - The selected species filter value.
 * @param size - The selected size filter value.
 * @param gender - The selected gender filter value.
 * @param adoptionStatus - The selected adoption status filter value.
 * @returns True if the pet matches all selected filter values, false otherwise.
 */
function petMatchesFilters(
  pet: Pet,
  species: string,
  size: string,
  gender: string,
  adoptionStatus: string,
): boolean {
  return (
    matchesFilter(pet.species, species) &&
    matchesFilter(pet.size, size) &&
    matchesFilter(pet.gender, gender) &&
    matchesFilter(pet.adoptionStatus, adoptionStatus)
  );
}

/**
 * Converts a string representation of a date to a timestamp (number of milliseconds since the Unix epoch).
 * @param value - The string representation of the date.
 * @returns The timestamp as a number, or null if the input is not a valid date string.
 */
function getCreatedTimestamp(value: unknown): number | null {
  if (typeof value !== "string") return null;

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? null : timestamp;
}

/**
 * Sorts an array of pets based on the specified sort option.
 * @param petsToSort - The array of pets to sort.
 * @param sortOption - The sort option to use ("name-asc", "newest", or "oldest").
 * @returns A new array of pets sorted according to the specified sort option.
 */
function sortPets(petsToSort: Pet[], sortOption: string): Pet[] {
  const sortedPets = [...petsToSort];

  if (sortOption === "name-asc") {
    return sortedPets.sort((petA, petB) => {
      const nameA = typeof petA.name === "string" ? petA.name.trim() : "";
      const nameB = typeof petB.name === "string" ? petB.name.trim() : "";

      if (!nameA && !nameB) return 0;
      if (!nameA) return 1;
      if (!nameB) return -1;

      return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
    });
  }

  if (sortOption === "newest" || sortOption === "oldest") {
    return sortedPets.sort((petA, petB) => {
      const createdA = getCreatedTimestamp(petA.created);
      const createdB = getCreatedTimestamp(petB.created);

      if (createdA === null && createdB === null) return 0;
      if (createdA === null) return 1;
      if (createdB === null) return -1;

      return sortOption === "newest"
        ? createdB - createdA
        : createdA - createdB;
    });
  }

  return sortedPets;
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

    <div
    class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    aria-label="Filter and sort pets"
    >
      <div>
        <label
        for="filter-species"
        class="mb-2 block font-semibold text-[#2c2c2c]"
        >
          Species
        </label>
        
        <select
        id="filter-species"
        data-species-filter
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3
        text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none
        focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
        >
          <option value="">All Species</option>
        </select>
      </div>

      <div>
        <label
        for="filter-size"
        class="mb-2 block font-semibold text-[#2c2c2c]"
        >
          Size
        </label>

        <select
        id="filter-size"
        data-size-filter
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3
        text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none
        focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
        >
          <option value="">All Sizes</option>
        </select>
      </div>

      <div>
        <label
        for="filter-gender"
        class="mb-2 block font-semibold text-[#2c2c2c]"
        >
        Gender
        </label>

        <select
        id="filter-gender"
        data-gender-filter
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3
        text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none
        focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
        >
          <option value="">
          All Genders</option>
        </select>
      </div>

      <div>
        <label
        for="filter-adoption-status"
        class="mb-2 block font-semibold text-[#2c2c2c]"
        >
          Adoption Status
        </label>

        <select
        id="filter-adoption-status"
        data-adoption-status-filter
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3
        text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none
        focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
        >
          <option value="">All Statuses</option>
          </select>
      </div>

    <div>
      <label
      for="sort-pets"
      class="mb-2 block font-semibold text-[#2c2c2c]"
      >
        Sort By
      </label>

      <select
      id="sort-pets"
      data-pet-sort
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3
      text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none
      focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
      >
        <option value="">Default</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  </div>

  <div class="mb-8">
    <button
    type="button"
    data-reset-filters
    class="
    rounded-lg border-2 border-[#2d6a6a] px-4 py-2
    font-semibold text-[#2d6a6a] 
    transition-colors duration-200
    hover:bg-[#2d6a6a] hover:text-white
    focus:outline-none focus:ring-2
    focus:ring-[#2d6a6a] focus:ring-offset-2
    "
    >
      Reset Filters
    </button>
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

  const speciesFilter = document.querySelector<HTMLSelectElement>(
    "[data-species-filter]",
  );

  const sizeFilter =
    document.querySelector<HTMLSelectElement>("[data-size-filter]");

  const genderFilter = document.querySelector<HTMLSelectElement>(
    "[data-gender-filter]",
  );

  const statusFilter = document.querySelector<HTMLSelectElement>(
    "[data-adoption-status-filter]",
  );

  const petSort = document.querySelector<HTMLSelectElement>("[data-pet-sort]");

  const resetListingsButton = document.querySelector<HTMLButtonElement>(
    "[data-reset-filters]",
  );

  if (
    !listingsContainer ||
    !listingsStatus ||
    !petList ||
    !petSearchInput ||
    !speciesFilter ||
    !sizeFilter ||
    !genderFilter ||
    !statusFilter ||
    !petSort ||
    !resetListingsButton
  ) {
    return;
  }
  try {
    const pets = await fetchPets();

    populateFilterOptions(
      speciesFilter,
      pets.map((pet) => pet.species),
    );

    populateFilterOptions(
      sizeFilter,
      pets.map((pet) => pet.size),
    );

    populateFilterOptions(
      genderFilter,
      pets.map((pet) => pet.gender),
    );

    populateFilterOptions(
      statusFilter,
      pets.map((pet) => pet.adoptionStatus),
    );

    const renderPets = (
      petsToRender: Pet[],
      searchTerm = "",
      hasActiveFilters = false,
    ): void => {
      petList.innerHTML = "";

      const hasActiveCriteria = Boolean(searchTerm) || hasActiveFilters;

      if (petsToRender.length === 0) {
        listingsStatus.textContent = hasActiveCriteria
          ? `No pets match your search or selected filters.`
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

      if (hasActiveFilters) {
        listingsStatus.textContent = `${petsToRender.length} ${
          petsToRender.length === 1
            ? "matching pet found"
            : "matching pets found"
        }.`;
      } else if (searchTerm) {
        listingsStatus.textContent = `${petsToRender.length} ${
          petsToRender.length === 1 ? "pet matches" : "pets match"
        } "${searchTerm}".`;
      } else {
        listingsStatus.textContent = `${petsToRender.length} pets available for adoption.`;
      }
    };

    renderPets(pets);

    const updateDisplayedPets = (): void => {
      const searchTerm = petSearchInput.value.trim().replace(/\s+/g, " ");

      const selectedSpecies = speciesFilter.value;
      const selectedSize = sizeFilter.value;
      const selectedGender = genderFilter.value;
      const selectedStatus = statusFilter.value;

      const hasActiveFilters = Boolean(
        selectedSpecies || selectedSize || selectedGender || selectedStatus,
      );

      const filteredPets = pets.filter(
        (pet) =>
          petMatchesSearch(pet, searchTerm) &&
          petMatchesFilters(
            pet,
            selectedSpecies,
            selectedSize,
            selectedGender,
            selectedStatus,
          ),
      );

      const sortedPets = sortPets(filteredPets, petSort.value);

      renderPets(sortedPets, searchTerm, hasActiveFilters);
    };

    updateDisplayedPets();

    petSearchInput.addEventListener("input", updateDisplayedPets);
    speciesFilter.addEventListener("change", updateDisplayedPets);
    sizeFilter.addEventListener("change", updateDisplayedPets);
    genderFilter.addEventListener("change", updateDisplayedPets);
    statusFilter.addEventListener("change", updateDisplayedPets);
    petSort.addEventListener("change", updateDisplayedPets);

    resetListingsButton.addEventListener("click", () => {
      petSearchInput.value = "";
      speciesFilter.value = "";
      genderFilter.value = "";
      sizeFilter.value = "";
      statusFilter.value = "";
      petSort.value = "";

      updateDisplayedPets();

      petSearchInput.focus();
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
