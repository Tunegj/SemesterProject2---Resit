import { fetchPetById } from "../services/pets.ts";
import { escapeHtml } from "../utils/escapeHtml.ts";
import { backButton, initBackButton } from "../components/backButton.ts";
import { isPetOwner } from "../services/auth.ts";
import { getPetIdFromHash } from "../utils/getPetIdFromHash.ts";
import { isValidListingId } from "../utils/isValidListingId.ts";

/**
 *  Retrieves a display-friendly text for a given value.
 *  Returns the fallback when the value is not a non-empty string.
 *
 * @param value - The value to format.
 * @param fallback - The text to return when the value is invalid or empty.
 * @returns The trimmed string or the fallback text.
 */
function getDisplayText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;

  const trimmedValue = value.trim();

  return trimmedValue || fallback;
}

/**
 * Formats a pet's age for display.
 * Returns "Unknown age" when the value is not a valid positive number.
 *
 * @param value - The age value to format.
 * @returns The formatted age or "Unknown age".
 */
function getDisplayAge(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return "Unknown age";
  }

  return `${value} ${value === 1 ? "year" : "years"}`;
}

/**
 * Generates a fallback image markup for a pet when no valid image is available.
 * @param petName - The name of the pet.
 * @returns The HTML markup for the image fallback.
 */
function imageFallback(petName: string): string {
  return `
    <div
        class="flex min-h-64 items-center justify-center bg-gray-100 px-6 text-center text-[#2c2c2c]"
        role="img"
        aria-label="No image available for ${escapeHtml(petName)}"
    >
        No image available
    </div>
    `;
}

/**
 * Generates the initial markup for the single pet listing page.
 *
 * @returns The HTML markup for the loading state and pet details container.
 */
export function singleListingPage(): string {
  return `
  <section>
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
      ></div>
    </div>
  </section>
  `;
}

/**
 * Initializes the single pet listing page.
 * Retrieves the pet ID from te URL, validates it, fetches the pet data,
 * renders the pet details, and registers te image and share button listeners.
 *
 * @returns A promise that resolves when the page initialization is complete.
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
    listingStatus.setAttribute("role", "alert");

    listingStatus.textContent =
      "This pet listing could not be loaded because its ID is missing.";

    listingContainer.setAttribute("aria-busy", "false");
    return;
  }

  if (!isValidListingId(petId)) {
    listingContent.replaceChildren();
    listingStatus.setAttribute("role", "alert");

    listingStatus.textContent =
      "This pet listing could not be loaded because its ID is invalid.";

    listingContainer.setAttribute("aria-busy", "false");
    return;
  }

  try {
    const pet = await fetchPetById(petId);

    if (!listingContainer.isConnected) return;

    const showOwnerActions = isPetOwner(pet.owner?.email);

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
        class="overflow-hidden rounded-lg lg:flex lg:justify-center"
      >
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
          class="text-3xl font-bold text-[#2d6a6a]"
        >
          ${escapeHtml(petName)}
        </h1>

        <p class="mt-2 text-xl font-semibold text-[#2c2c2c]">
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
            aria-label="Copy link to this pet"
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
          aria-labelledby="single-listing-about-heading"
        >
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
          showOwnerActions
            ? `
        <div
        class="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row"
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

    listingImage?.addEventListener(
      "error",
      () => {
        if (!imageWrapper) return;

        imageWrapper.innerHTML = imageFallback(petName);
      },
      { once: true },
    );

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

        if (!copyUrlStatus.isConnected) return;

        copyUrlStatus.textContent = "URL copied to clipboard!";
      } catch (error) {
        console.error("Failed to copy URL to clipboard:", error);

        if (!copyUrlStatus.isConnected) return;

        copyUrlStatus.textContent =
          "Failed to copy URL. Please try again later.";
      }
    });

    listingStatus.textContent = "";
  } catch (error) {
    console.error(error);

    if (!listingContainer.isConnected) return;

    listingContent.replaceChildren();
    listingStatus.setAttribute("role", "alert");

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("not found")
    ) {
      listingStatus.textContent = "This pet listing could not be found.";
      return;
    }

    listingStatus.textContent =
      "Unable to load pet details. Please try again later.";
  } finally {
    if (listingContainer.isConnected) {
      listingContainer.setAttribute("aria-busy", "false");
    }
  }
}
