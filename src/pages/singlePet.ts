import { fetchPetById } from "../services/pets.ts";
import { escapeHtml } from "../utils/escapeHtml.ts";
import { backButton, initBackButton } from "../components/backButton.ts";
import { isPetOwner } from "../services/auth.ts";
import { getPetIdFromHash } from "../utils/getPetIdFromHash.ts";
import { isValidListingId } from "../utils/isValidListingId.ts";

/** * Retrieves a display-friendly text for a given value, falling back to a specified string if the value is not a valid string.
 * @param value - The value to retrieve display text for.
 * @param fallback - The fallback string to use if the value is not valid.
 * @returns A string suitable for display, either the trimmed value or the fallback.
 */
function getDisplayText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;

  const trimmedValue = value.trim();

  return trimmedValue || fallback;
}

/** * Retrieves a display-friendly age string for a given value, falling back to "Unknown age" if the value is not a valid number.
 * @param value - The value to retrieve display age for.
 * @returns A string representing the age, or "Unknown age" if the value is not valid.
 */
function getDisplayAge(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return "Unknown age";
  }

  return `${value} ${value === 1 ? "year" : "years"}`;
}

/** * Generates a fallback image element for a pet when no image is available.
 * @param petname - The name of the pet.
 * @returns An HTML string representing the fallback image element.
 */
function imageFallback(petname: string): string {
  return `
    <div
        class="flex min-h-64 items-center justify-center bg-gray-100 px-6 text-center text-[#2c2c2c]"
        role="img"
        aria-label="No image available for ${escapeHtml(petname)}"
    >
        No image available
    </div>
    `;
}

/** * Generates the HTML for the single pet listing page, including a back button and placeholders for pet details.
 * @returns An HTML string representing the single pet listing page.
 */
export function singleListingPage(): string {
  return `
  <section aria-labelledby="single-listing-heading">
    <div
    data-single-listing-container
    aria-busy="true"
    >
    ${backButton()}
   
      
      <p
      data-single-listing-status
      role="status"
      aria-live="polite"
      class="mt-4 text-[#2c2c2c]"
      >
        Loading pet details...
      </p>
    
      <div
      data-single-listing-content
      class="mt-8"
      >
         <h1
        id="single-listing-heading"
        data-single-listing-heading
        class="text-3xl font-bold text-[#2d6a6a]"
      >
        Pet Details
      </h1></div>
    </div>
  </section>
  `;
}

/** * Initializes the single pet listing page by fetching the pet details based on the ID from the URL and populating the page with the retrieved data.
 * It also sets up the back button functionality and handles error scenarios.
 */
export async function initSingleListingPage(): Promise<void> {
  initBackButton("#/listings");
  const listingContainer = document.querySelector<HTMLElement>(
    "[data-single-listing-container]",
  );

  const listingStatus = document.querySelector<HTMLParagraphElement>(
    "[data-single-listing-status]",
  );

  const listingContent = document.querySelector<HTMLElement>(
    "[data-single-listing-content]",
  );

  if (!listingContainer || !listingStatus || !listingContent) return;

  const petId = getPetIdFromHash();

  if (!petId) {
    listingContent.replaceChildren();

    listingStatus.textContent =
      "This pet listing could not be loaded because its ID is missing.";

    listingContainer.setAttribute("aria-busy", "false");
    return;
  }

  if (!isValidListingId(petId)) {
    listingContent.replaceChildren();

    listingStatus.textContent =
      "This pet listing could not be loaded because its ID is invalid.";

    listingContainer.setAttribute("aria-busy", "false");
    return;
  }

  try {
    const pet = await fetchPetById(petId);
    const showAdminActions = isPetOwner(pet.owner?.email);

    const petName = getDisplayText(pet.name, "Pet details");
    const breed = getDisplayText(pet.breed, "Unknown breed");
    const petAge = getDisplayAge(pet.age);
    const petSize = getDisplayText(pet.size, "Size not provided");
    const petColor = getDisplayText(pet.color, "Color not provided");
    const petLocation = getDisplayText(pet.location, "Location not provided");
    const petDescription = getDisplayText(
      pet.description,
      "No description available for this pet.",
    );
    const imageUrl = getDisplayText(pet.image?.url, "");
    const imageAlt = getDisplayText(pet.image?.alt, `Photo of ${petName}`);

    listingContent.innerHTML = `
    <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      <div 
      data-single-listing-image-wrapper
      class="overflow-hidden rounded-lg lg:flex lg:justify-center">
        ${
          imageUrl
            ? `
          <img
              data-single-listing-image
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(imageAlt)}"
              class="h-auto w-full object-cover lg:max-h-[32rem] lg:w-auto lg:max-w-full lg:object-contain"
              loading="lazy"
          />
          `
            : imageFallback(petName)
        }
      </div>

      <div class="mt-6 lg:mt-0">
        <h1
        id="single-listing-heading"
        class="text-3xl font-bold text-[#2d6a6a]">
          ${escapeHtml(petName)}
        </h1>

        <p class="mt-2 text-xl font-semibold text-[2c2c2c]">
          ${escapeHtml(breed)}
        </p>

  


        <dl class="mt-6">

          <div class="border-b border-gray-200 py-4">
            <dt class="font-semibold text-[#2d6a6a]">Age</dt>

            <dd class="mt-1 text-[#2c2c2c]">${escapeHtml(petAge)}</dd>
          </div>

          <div class="border-b border-gray-200 py-4">
            <dt class="font-semibold text-[#2d6a6a]">Size</dt>

            <dd class="mt-1 text-[#2c2c2c]">${escapeHtml(petSize)}</dd>
          </div>

          <div class="border-b border-gray-200 py-4">
            <dt class="font-semibold text-[#2d6a6a]">Color</dt>

            <dd class="mt-1 text-[#2c2c2c]">${escapeHtml(petColor)}</dd>
          </div>

          <div class="border-b border-gray-200 py-4">
            <dt class="font-semibold text-[#2d6a6a]">Location</dt>

            <dd class="mt-1 text-[#2c2c2c]">${escapeHtml(petLocation)}</dd>
          </div>
        </dl>


        <div class="border-b border-gray-200 py-4">
          <button
            type="button"
            data-copy-url-button
            class="inline-flex items-center gap-2 rounded text-sm font-medium text-[#2c2c2c] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6a6a]"
          >
            <span aria-hidden="true">🔗</span>
            Share
          </button>
        
          <p
          data-copy-url-status
          role="status"
          aria-live="polite"
          class="mt-2 text-sm text-[#2c2c2c]"
          ></p>
        </div>

        <section 
        class="mt-8"
        aria-labelledby="single-listing-about-heading">
          <h2
          id="single-listing-about-heading"
          class="text-2xl font-bold text-[#2d6a6a]"
          >
            About ${escapeHtml(petName)}
          </h2>

          <p class="mt-4 leading-relaxed text-[#2c2c2c]">
            ${escapeHtml(petDescription)}
          </p>
        </section>

        ${
          showAdminActions
            ? `
        <div
        class="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row"
        aria-label="Pet management actions"
        >
          <a
          href="#/edit?id=${encodeURIComponent(petId)}"
          class="inline-flex items-center justify-center rounded-lg bg-[#2d6a6a] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#245858] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6a6a]"
          >
            Edit Pet
          </a>
        </div>
        `
            : ""
        }
      </div>
    </div>
    `;

    const listingImage = listingContent.querySelector<HTMLImageElement>(
      "[data-single-listing-image]",
    );

    const imageWrapper = listingContent.querySelector<HTMLElement>(
      "[data-single-listing-image-wrapper]",
    );

    listingImage?.addEventListener("error", () => {
      if (!imageWrapper) return;

      imageWrapper.innerHTML = imageFallback(petName);
    });

    const copyUrlButton = listingContent.querySelector<HTMLButtonElement>(
      "[data-copy-url-button]",
    );

    const copyUrlStatus = listingContent.querySelector<HTMLParagraphElement>(
      "[data-copy-url-status]",
    );

    copyUrlButton?.addEventListener("click", async () => {
      if (!copyUrlStatus) return;

      if (!navigator.clipboard) {
        copyUrlStatus.textContent = "Copying is not supported in this browser.";
        return;
      }

      try {
        await navigator.clipboard.writeText(window.location.href);

        copyUrlStatus.textContent = "URL copied to clipboard!";
      } catch (error) {
        console.error("Failed to copy URL to clipboard:", error);

        copyUrlStatus.textContent =
          "Failed to copy URL. Please try again later.";
      }
    });

    listingStatus.textContent = "";
  } catch (error) {
    console.error(error);

    listingContent.replaceChildren();

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("not found")
    ) {
      listingStatus.textContent = "This pet listing could not be found.";
      return;
    }

    listingStatus.textContent =
      error instanceof Error
        ? error.message
        : "Unable to load pet details. Please try again later.";
  } finally {
    listingContainer.setAttribute("aria-busy", "false");
  }
}
