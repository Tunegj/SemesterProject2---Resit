import { fetchPets } from "../services/pets.ts";
import { petCard } from "../components/petCard.ts";
import type { Pet } from "../types/pet.ts";

const PETS_PER_PAGE = 9;

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
 * Creates the pet listings page markup.
 */
export function listingsPage(): string {
  return `
  <section aria-labelledby="listings-heading">
    <header class="mb-8">
      <h1 
      id="listings-heading"
      class="text-3xl font-bold text-[#2d6a6a]"
      >
        Pets Available for Adoption
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
        autocomplete="off"
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

    <fieldset class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <legend class="sr-only">
        Filter and sort pets
      </legend>
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
  </fieldset>

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

      <nav
      data-pagination
      class="mt-8 hidden flex-col items-center gap-4"
      aria-label="Pet listings pagination"
      >

        <p
        data-pagination-summary
        class="text-sm text-[#2c2c2c]"
        aria-live="polite"
        ></p>
          

        <div
        class="flex flex-wrap items-center justify-center gap-2">
          <button
          type="button"
          data-page-previous
          class="rounded-lg border-2 border-[#2d6a6a] px-4 py-2
          font-semibold text-[#2d6a6a] transition-colors
          hover:bg-[#2d6a6a] hover:text-white
          focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2
          disabled:cursor-not-allowed disabled:border-gray-300
          disabled:bg-gray-300 disabled:text-gray-500"
          >
            Previous
          </button>

          <div
          data-page-buttons
          class="flex flex-wrap items-center justify-center gap-2"
          ></div>

          <button
          type="button"
          data-page-next
          class="rounded-lg border-2 border-[#2d6a6a] px-4 py-2
          font-semibold text-[#2d6a6a] transition-colors
          hover:bg-[#2d6a6a] hover:text-white
          focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2
          disabled:cursor-not-allowed disabled:border-gray-300
          disabled:bg-gray-300 disabled:text-gray-500"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  </section>
  `;
}

/**
 * Loads the pets and initializes search, filter, sorting and pagination.
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

  const pagination = document.querySelector<HTMLElement>("[data-pagination]");
  const paginationSummary = document.querySelector<HTMLParagraphElement>(
    "[data-pagination-summary]",
  );
  const pageButtons = document.querySelector<HTMLElement>(
    "[data-page-buttons]",
  );
  const pagePreviousButton = document.querySelector<HTMLButtonElement>(
    "[data-page-previous]",
  );
  const pageNextButton =
    document.querySelector<HTMLButtonElement>("[data-page-next]");

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
    !resetListingsButton ||
    !pagination ||
    !paginationSummary ||
    !pageButtons ||
    !pagePreviousButton ||
    !pageNextButton
  ) {
    return;
  }

  const setPaginationVisibility = (isVisible: boolean): void => {
    pagination.classList.toggle("hidden", !isVisible);
    pagination.classList.toggle("flex", isVisible);
  };

  let currentPage = 1;

  try {
    const pets = await fetchPets();

    if (!listingsContainer.isConnected) {
      return;
    }

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
      petList.replaceChildren();

      const totalPets = petsToRender.length;
      const hasActiveCriteria = Boolean(searchTerm) || hasActiveFilters;

      if (totalPets === 0) {
        currentPage = 1;

        setPaginationVisibility(false);
        paginationSummary.textContent = "";
        pageButtons.replaceChildren();

        listingsStatus.textContent = hasActiveCriteria
          ? `No pets match your search or selected filters.`
          : "No pets available for adoption at the moment.";

        return;
      }

      const totalPages = Math.ceil(totalPets / PETS_PER_PAGE);

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      const startIndex = (currentPage - 1) * PETS_PER_PAGE;
      const endIndex = Math.min(startIndex + PETS_PER_PAGE, totalPets);

      const petsForCurrentPage = petsToRender.slice(startIndex, endIndex);

      petList.innerHTML = petsForCurrentPage
        .map((pet) => petCard(pet))
        .join("");

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

      if (totalPages > 1) {
        setPaginationVisibility(true);
        paginationSummary.textContent =
          `Page ${currentPage} of ${totalPages}` +
          ` | Showing ${startIndex + 1}-${endIndex} of ${totalPets} pets.`;

        pagePreviousButton.disabled = currentPage === 1;
        pageNextButton.disabled = currentPage === totalPages;

        pageButtons.innerHTML = Array.from(
          { length: totalPages },
          (_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            const stateClasses = isCurrentPage
              ? "border-[#2d6a6a] bg-[#2d6a6a] text-white"
              : "border-[#2d6a6a] bg-white text-[#2d6a6a] hover:bg-[#2d6a6a] hover:text-white";

            return `
              <button 
              type="button"
              data-page-number="${pageNumber}" 
              aria-label="Go to page ${pageNumber}"
              ${isCurrentPage ? 'aria-current="page"' : ""}
              class="min-w-10 rounded-lg border-2 px-3 py-2
              font-semibold transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 ${stateClasses}"
              >
              ${pageNumber}
              </button>`;
          },
        ).join("");
      } else {
        setPaginationVisibility(false);
        paginationSummary.textContent = "";
        pageButtons.replaceChildren();
      }

      if (hasActiveFilters) {
        listingsStatus.textContent = `${totalPets} ${
          totalPets === 1 ? "matching pet found" : "matching pets found"
        }.`;
      } else if (searchTerm) {
        listingsStatus.textContent = `${totalPets} ${
          totalPets === 1 ? "pet matches" : "pets match"
        } "${searchTerm}".`;
      } else {
        listingsStatus.textContent = `${totalPets} pets available for adoption.`;
      }
    };

    const focusCurrentPageButton = (): void => {
      requestAnimationFrame(() => {
        const currentPageButton = pageButtons.querySelector<HTMLButtonElement>(
          `[aria-current="page"]`,
        );

        currentPageButton?.focus();
      });
    };

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

    const resetToFirstPageAndUpdate = (): void => {
      currentPage = 1;
      updateDisplayedPets();
    };

    updateDisplayedPets();

    petSearchInput.addEventListener("input", resetToFirstPageAndUpdate);
    speciesFilter.addEventListener("change", resetToFirstPageAndUpdate);
    sizeFilter.addEventListener("change", resetToFirstPageAndUpdate);
    genderFilter.addEventListener("change", resetToFirstPageAndUpdate);
    statusFilter.addEventListener("change", resetToFirstPageAndUpdate);
    petSort.addEventListener("change", resetToFirstPageAndUpdate);

    pagePreviousButton.addEventListener("click", () => {
      if (currentPage <= 1) {
        return;
      }

      currentPage -= 1;
      updateDisplayedPets();
    });

    pageNextButton.addEventListener("click", () => {
      currentPage += 1;
      updateDisplayedPets();
    });

    pageButtons.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const pageButton =
        target.closest<HTMLButtonElement>("[data-page-number]");

      if (!pageButton) {
        return;
      }

      const pageNumber = Number(pageButton.dataset.pageNumber);

      if (Number.isNaN(pageNumber) || pageNumber < 1) {
        return;
      }

      currentPage = pageNumber;

      updateDisplayedPets();
      focusCurrentPageButton();
    });

    resetListingsButton.addEventListener("click", () => {
      petSearchInput.value = "";
      speciesFilter.value = "";
      genderFilter.value = "";
      sizeFilter.value = "";
      statusFilter.value = "";
      petSort.value = "";

      currentPage = 1;
      updateDisplayedPets();

      petSearchInput.focus();
    });
  } catch (error) {
    console.error("Error loading pets:", error);

    if (!listingsContainer.isConnected) {
      return;
    }

    petList.replaceChildren();
    setPaginationVisibility(false);
    paginationSummary.textContent = "";
    pageButtons.replaceChildren();

    listingsStatus.setAttribute("role", "alert");
    listingsStatus.classList.add("text-red-600");
    listingsStatus.textContent = "Unable to load pets. Please try again later.";
  } finally {
    if (listingsContainer.isConnected) {
      listingsContainer.setAttribute("aria-busy", "false");
    }
  }
}
