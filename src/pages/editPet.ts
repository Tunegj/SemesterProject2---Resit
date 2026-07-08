import { fetchPetById, updatePet, deletePet } from "../services/pets.ts";
import { getPetIdFromHash } from "../utils/getPetIdFromHash.ts";
import { isValidListingId } from "../utils/isValidListingId.ts";
import type { Pet, PetPayload } from "../types/pet.ts";
import { escapeHtml } from "../utils/escapeHtml.ts";
import { isPetOwner } from "../services/auth.ts";
import { backButton, initBackButton } from "../components/backButton.ts";

export function editPetPage(): string {
  return `
    <section aria-labelledby="edit-pet-heading">
    ${backButton()}

      <header class="mb-8">
        <h1 id="edit-pet-heading" class="text-3xl font-bold text-[#2d6a6a]">
          Edit Pet
        </h1>
        <p class="mt-4 text-[#2c2c2c]">
          Update the details of this pet
        </p>
      </header>

      <div 
      data-edit-pet-container
      aria-busy="true"
      >
        <p
        data-edit-pet-load-status
        role="status"
        aria-live="polite"
        class="text-[#2c2c2c]"
        >
          Loading pet details...
        </p>
      
        <div data-edit-pet-form-container
        class="mt-8"></div>
      </div>
    </section>
    `;
}

function editPetForm(pet: Pet): string {
  const ageIsUnknown = pet.age === 0;
  const normalizedGender = pet.gender?.trim().toLowerCase() ?? "";
  const normalizedSize = pet.size?.trim().toLowerCase() ?? "";
  const normalizedAdoptionStatus =
    pet.adoptionStatus?.trim().toLowerCase() ?? "";

  const knownGenders = ["female", "male", "unknown"];
  const knownSizes = ["small", "medium", "large"];
  const knownAdoptionStatuses = ["available", "pending", "adopted"];

  const hasValidGender = knownGenders.includes(normalizedGender);
  const hasValidSize = knownSizes.includes(normalizedSize);
  const hasValidAdoptionStatus = knownAdoptionStatuses.includes(
    normalizedAdoptionStatus,
  );

  return `

    <form
    data-edit-pet-form
    class="space-y-6"
    novalidate
    >
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <label 
            for="pet-name"
            class="mb-2 block font-semibold text-[#2c2c2c]"
          >
            Name
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="pet-name"
            name="name"
            type="text"
            value="${escapeHtml(pet.name ?? "")}"
            required
            class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="pet-name-error"
          class="mt-1 hidden text-sm text-[#C95A5A]"
          ></p>
        </div>

        <div>
          <label
            for="pet-species"
            class="mb-2 block font-semibold text-[#2c2c2c]"
          >
            Species
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="pet-species"
            name="species"
            type="text"
            value="${escapeHtml(pet.species ?? "")}"
            required
            class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="pet-species-error"
          class="mt-1 hidden text-sm text-[#C95A5A]"
          ></p>
        </div>

        <div>
          <label
            for="pet-breed"
            class="mb-2 block font-semibold text-[#2c2c2c]"
          >
            Breed
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="pet-breed"
            name="breed"
            type="text"
            value="${escapeHtml(pet.breed ?? "")}"
            required
            class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="pet-breed-error"
          class="mt-1 hidden text-sm text-[#C95A5A]"
          ></p>
        </div>

        <div>
          <label
            for="pet-age"
            class="mb-2 block font-semibold text-[#2c2c2c]"
          >
            Age
            <span aria-hidden="true" data-age-required ${ageIsUnknown ? "hidden" : ""}>*</span>
          </label>
          <input
            id="pet-age"
            name="age"
            type="number"
            min="1"
            step="1"
            value="${ageIsUnknown ? "" : String(pet.age)}"
            ${ageIsUnknown ? "disabled" : "required"}
            aria-describedby="pet-age-error pet-age-help"
            class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="pet-age-error"
          class="mt-1 hidden text-sm text-[#C95A5A]"
          ></p>
      

          <div class="mt-3 flex items-center gap-2">
            <input
            id="pet-age-unknown"
            name="ageUnknown"
            type="checkbox"
            data-age-unknown
            ${ageIsUnknown ? "checked" : ""}
            class="h-4 w-4 accent-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
            />

            <label
            for="pet-age-unknown"
            class="text-[#2c2c2c]"
            >
              Age unknown
            </label>
          </div>

          <p id="pet-age-help" class="mt-2 text-sm text-gray-600">
            If the pet's age is unknown, check the box above. Otherwise, enter the pet's age in years.
          </p>
          </div>
    
          <div>
            <label
            for="pet-gender"
            class="mb-2 block font-semibold text-[#2c2c2c]"
            >
            Gender
              <span aria-hidden="true">*</span>
            </label>

            <select
            id="pet-gender"
            name="gender"
            required
            aria-describedby="pet-gender-error"
            class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            >
              <option value="">Select Gender</option>
              ${
                normalizedGender && !hasValidGender
                  ? `<option value="${escapeHtml(normalizedGender)}" selected>
                ${escapeHtml(pet.gender)}
                </option>`
                  : ""
              }
              <option value="female" ${normalizedGender === "female" ? "selected" : ""}>Female</option>
              <option value="male" ${normalizedGender === "male" ? "selected" : ""}>Male</option>
              <option value="unknown" ${normalizedGender === "unknown" ? "selected" : ""}>Unknown</option>
            </select>
            <p id="pet-gender-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>

          <div>
            <label for="pet-size" class="mb-2 block font-semibold text-[#2c2c2c]">
              Size
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="pet-size"
              name="size"
              required
              aria-describedby="pet-size-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            >
              <option value="">Select Size</option>
              ${
                normalizedSize && !hasValidSize
                  ? `<option value="${escapeHtml(normalizedSize)}" selected>
                ${escapeHtml(pet.size)}
                </option>`
                  : ""
              }
              <option value="small" ${normalizedSize === "small" ? "selected" : ""}>
                Small
              </option>
              <option value="medium" ${normalizedSize === "medium" ? "selected" : ""}>
                Medium
              </option>
              <option value="large" ${normalizedSize === "large" ? "selected" : ""}>
                Large
              </option>
            </select>

            <p id="pet-size-error" class="mt-1 hidden text-sm text-[#C95A5A]"></p>
          </div>

          <div>
            <label for="pet-color" class="mb-2 block font-semibold text-[#2c2c2c]">
              Color
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-color"
              name="color"
              type="text"
              value="${escapeHtml(pet.color ?? "")}"
              required
              aria-describedby="pet-color-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />

            <p id="pet-color-error" class="mt-1 hidden text-sm text-[#C95A5A]"></p>
          </div>

          <div>
            <label
              for="pet-adoption-status"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Adoption Status
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="pet-adoption-status"
              name="adoptionStatus"
              required
              aria-describedby="pet-adoption-status-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            >  
              <option value="">Select Adoption Status</option>
              ${
                normalizedAdoptionStatus && !hasValidAdoptionStatus
                  ? `<option value="${escapeHtml(normalizedAdoptionStatus)}" selected>
                ${escapeHtml(pet.adoptionStatus)}
                </option>`
                  : ""
              }
              <option
                value="available"
                ${normalizedAdoptionStatus === "available" ? "selected" : ""}
              >
                Available
              </option>
              <option
                value="pending"
                ${normalizedAdoptionStatus === "pending" ? "selected" : ""}
              >
                Pending
              </option>
              <option
                value="adopted"
                ${normalizedAdoptionStatus === "adopted" ? "selected" : ""}
              >
                Adopted
              </option>
            </select>

            <p
              id="pet-adoption-status-error"
              class="mt-1 hidden text-sm text-[#C95A5A]"
            ></p>
          </div>

          <div>
            <label for="pet-location" class="mb-2 block font-semibold text-[#2c2c2c]">
              Location
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-location"
              name="location"
              type="text"
              value="${escapeHtml(pet.location ?? "")}"
              required
              aria-describedby="pet-location-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />

            <p id="pet-location-error" class="mt-1 hidden text-sm text-[#C95A5A]"></p>
          </div>

          <div>
            <label
              for="pet-image-url"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Image URL
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-image-url"
              name="imageUrl"
              type="url"
              value="${escapeHtml(pet.image?.url ?? "")}"
              required
              placeholder="https://example.com/image.jpg"
              aria-describedby="pet-image-url-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />

            <p
              id="pet-image-url-error"
              class="mt-1 hidden text-sm text-[#C95A5A]"
            ></p>
          </div>

          <div>
            <label
              for="pet-image-alt"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Image Alt Text
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-image-alt"
              name="imageAlt"
              type="text"
              value="${escapeHtml(pet.image?.alt ?? "")}"
              required
              placeholder="A description of the image"
              aria-describedby="pet-image-alt-error pet-image-alt-help"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />

            <p
              id="pet-image-alt-error"
              class="mt-1 hidden text-sm text-[#C95A5A]"
            ></p>

            <p id="pet-image-alt-help" class="mt-2 text-sm text-gray-600">
              Provide a brief description of what the image depicts.
            </p>
          </div>

          <div class="md:col-span-2">
            <label
              for="pet-description"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Description
              <span aria-hidden="true">*</span>
            </label>

            <textarea
              id="pet-description"
              name="description"
              rows="6"
              required
              aria-describedby="pet-description-error"
              class="w-full resize-y rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            >${escapeHtml(pet.description ?? "")}</textarea>

            <p
              id="pet-description-error"
              class="mt-1 hidden text-sm text-[#C95A5A]"
            ></p>
          </div>
        </div>
        <p
          data-edit-pet-submit-status
          role="status"
          aria-live="polite"
          class="hidden"
        ></p>

        <button
          type="submit"
          class="rounded-xl bg-[#2d6a6a] px-4 py-3 font-semibold text-white transition hover:bg-[#245858] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
        >
          Save Changes
        </button>
    </form>

    <section
    class="mt-12 border-t border-[#C95A5A] pt-8"
    aria-labelledby="delete-pet-heading"
    >
      <h2
      id="delete-pet-heading"
      class="text-2xl font-bold text-[#C95A5A]"
      >
      Delete Listing
      </h2>

      <p class="mt-3 max-w-2xl text-[#2c2c2c]">
        Permanently delete this listing. This action cannot be undone.
      </p>
    
    <button
    type="button"
    data-open-delete-modal
    class="mt-5 rounded-xl bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
    >
      Delete Listing
    </button>
    </section>

    <dialog
    data-delete-pet-modal
    aria-labelledby="delete-modal-heading"
    aria-describedby="delete-modal-description"
    class="w-[calc(100%-2rem)] max-w-lg rounded-lg p-0 shadow-xl backdrop:bg-black/50"
    >
      <div class="p-6">
        <h2
        id="delete-modal-heading"
        class="text-2xl font-bold text-red-700"
        >
          Delete ${escapeHtml(pet.name ?? "this pet")}?
        </h2>

        <p
        id="delete-modal-description"
        class="mt-4 text-[#2c2c2c]"
        >
          Are you sure you want to permanently delete this listing? This action cannot be undone.
        </p>

        <p
       data-delete-pet-status
       role="status"
        aria-live="polite"
        class="mt-4 hidden"
        ></p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            data-cancel-delete
            class="rounded-xl bg-gray-200 px-4 py-3 font-semibold text-[#2c2c2c] transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            data-confirm-delete
            class="rounded-xl bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </dialog>
  `;
}

function initEditPetForm(petId: string): void {
  const form = document.querySelector<HTMLFormElement>("[data-edit-pet-form]");

  if (!form) return;

  const submitStatus = document.querySelector<HTMLParagraphElement>(
    "[data-edit-pet-submit-status]",
  );

  const nameInput = form.querySelector<HTMLInputElement>("#pet-name");
  const speciesInput = form.querySelector<HTMLInputElement>("#pet-species");
  const breedInput = form.querySelector<HTMLInputElement>("#pet-breed");
  const ageInput = form.querySelector<HTMLInputElement>("#pet-age");
  const ageUnknownCheckbox =
    form.querySelector<HTMLInputElement>("[data-age-unknown]");
  const requiredIndicator = form.querySelector<HTMLElement>(
    "[data-age-required]",
  );
  const genderSelect = form.querySelector<HTMLSelectElement>("#pet-gender");
  const sizeSelect = form.querySelector<HTMLSelectElement>("#pet-size");
  const colorInput = form.querySelector<HTMLInputElement>("#pet-color");
  const adoptionStatusSelect = form.querySelector<HTMLSelectElement>(
    "#pet-adoption-status",
  );
  const locationInput = form.querySelector<HTMLInputElement>("#pet-location");
  const imageUrlInput = form.querySelector<HTMLInputElement>("#pet-image-url");
  const imageAltInput = form.querySelector<HTMLInputElement>("#pet-image-alt");
  const descriptionTextarea =
    form.querySelector<HTMLTextAreaElement>("#pet-description");

  const nameError = form.querySelector<HTMLElement>("#pet-name-error");
  const speciesError = form.querySelector<HTMLElement>("#pet-species-error");
  const breedError = form.querySelector<HTMLElement>("#pet-breed-error");
  const ageError = form.querySelector<HTMLElement>("#pet-age-error");
  const genderError = form.querySelector<HTMLElement>("#pet-gender-error");
  const sizeError = form.querySelector<HTMLElement>("#pet-size-error");
  const colorError = form.querySelector<HTMLElement>("#pet-color-error");
  const adoptionStatusError = form.querySelector<HTMLElement>(
    "#pet-adoption-status-error",
  );
  const locationError = form.querySelector<HTMLElement>("#pet-location-error");
  const imageUrlError = form.querySelector<HTMLElement>("#pet-image-url-error");
  const imageAltError = form.querySelector<HTMLElement>("#pet-image-alt-error");
  const descriptionError = form.querySelector<HTMLElement>(
    "#pet-description-error",
  );

  const submitButton = form.querySelector<HTMLButtonElement>(
    "button[type='submit']",
  );

  const deleteModal = document.querySelector<HTMLDialogElement>(
    "[data-delete-pet-modal]",
  );
  const openDeleteModalButton = document.querySelector<HTMLButtonElement>(
    "[data-open-delete-modal]",
  );
  const cancelDeleteButton = document.querySelector<HTMLButtonElement>(
    "[data-cancel-delete]",
  );
  const confirmDeleteButton = document.querySelector<HTMLButtonElement>(
    "[data-confirm-delete]",
  );
  const deleteStatus = document.querySelector<HTMLParagraphElement>(
    "[data-delete-pet-status]",
  );

  if (
    !ageInput ||
    !ageUnknownCheckbox ||
    !requiredIndicator ||
    !nameInput ||
    !speciesInput ||
    !breedInput ||
    !genderSelect ||
    !sizeSelect ||
    !colorInput ||
    !adoptionStatusSelect ||
    !locationInput ||
    !imageUrlInput ||
    !imageAltInput ||
    !descriptionTextarea ||
    !nameError ||
    !ageError ||
    !speciesError ||
    !breedError ||
    !genderError ||
    !sizeError ||
    !colorError ||
    !adoptionStatusError ||
    !locationError ||
    !imageUrlError ||
    !imageAltError ||
    !descriptionError ||
    !submitStatus ||
    !submitButton ||
    !deleteModal ||
    !openDeleteModalButton ||
    !cancelDeleteButton ||
    !confirmDeleteButton ||
    !deleteStatus
  ) {
    return;
  }

  const defaultDeleteButtonText =
    confirmDeleteButton.textContent?.trim() || "Yes, Delete Listing";

  type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  const clearFieldError = (
    field: FormField,
    errorElement: HTMLElement,
  ): void => {
    field.removeAttribute("aria-invalid");
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  };

  const showFieldError = (
    field: FormField,
    errorElement: HTMLElement,
    message: string,
  ): void => {
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  };

  const clearAllFieldErrors = (): void => {
    clearFieldError(nameInput, nameError);
    clearFieldError(speciesInput, speciesError);
    clearFieldError(breedInput, breedError);
    clearFieldError(ageInput, ageError);
    clearFieldError(genderSelect, genderError);
    clearFieldError(sizeSelect, sizeError);
    clearFieldError(colorInput, colorError);
    clearFieldError(adoptionStatusSelect, adoptionStatusError);
    clearFieldError(locationInput, locationError);
    clearFieldError(imageUrlInput, imageUrlError);
    clearFieldError(imageAltInput, imageAltError);
    clearFieldError(descriptionTextarea, descriptionError);
  };

  const defaultSubmitText = submitButton.textContent?.trim() ?? "Save Changes";

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const parsedUrl = new URL(value);

      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  const clearAgeError = (): void => {
    clearFieldError(ageInput, ageError);
  };

  const updateAgeField = (): void => {
    const ageIsUnknown = ageUnknownCheckbox.checked;

    ageInput.disabled = ageIsUnknown;
    ageInput.required = !ageIsUnknown;
    requiredIndicator.hidden = ageIsUnknown;

    if (ageIsUnknown) {
      ageInput.value = "";
      clearAgeError();
    }
  };

  ageUnknownCheckbox.addEventListener("change", updateAgeField);

  updateAgeField();

  openDeleteModalButton.addEventListener("click", () => {
    deleteStatus.textContent = "";
    deleteStatus.className = "mt-4 hidden";

    deleteModal.showModal();
  });

  cancelDeleteButton.addEventListener("click", () => {
    deleteModal.close();
  });

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      deleteModal.close();
    }
  });

  confirmDeleteButton.addEventListener("click", async () => {
    confirmDeleteButton.disabled = true;
    confirmDeleteButton.textContent = "Deleting...";

    cancelDeleteButton.disabled = true;
    openDeleteModalButton.disabled = true;
    submitButton.disabled = true;

    deleteStatus.textContent = "";
    deleteStatus.className = "mt-4 hidden";

    try {
      await deletePet(petId);

      deleteStatus.textContent =
        "This pet listing has been deleted successfully.";

      deleteStatus.className =
        "mt-4 rounded-md border border-green-700 bg-green-50 p-4 text-green-800";

      window.setTimeout(() => {
        window.location.hash = "#/listings";
      }, 800);
    } catch (error) {
      deleteStatus.textContent =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the pet listing. Please try again later.";

      deleteStatus.className =
        "mt-4 rounded-md border border-red-700 bg-red-50 p-4 text-red-800";

      confirmDeleteButton.disabled = false;
      confirmDeleteButton.textContent = defaultDeleteButtonText;

      cancelDeleteButton.disabled = false;
      openDeleteModalButton.disabled = false;
      submitButton.disabled = false;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitStatus.textContent = "";
    submitStatus.className = "hidden";
    clearAllFieldErrors();

    let hasValidationErrors = false;

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, nameError, "Please enter the pet's name.");
      hasValidationErrors = true;
    }

    if (!speciesInput.value.trim()) {
      showFieldError(
        speciesInput,
        speciesError,
        "Please enter the pet's species.",
      );
      hasValidationErrors = true;
    }

    if (!breedInput.value.trim()) {
      showFieldError(breedInput, breedError, "Please enter the pet's breed.");
      hasValidationErrors = true;
    }

    if (!ageUnknownCheckbox.checked) {
      if (!ageInput.value.trim()) {
        showFieldError(ageInput, ageError, "Please enter the pet's age.");
        hasValidationErrors = true;
      } else if (
        !Number.isFinite(ageInput.valueAsNumber) ||
        ageInput.valueAsNumber < 1 ||
        !Number.isInteger(ageInput.valueAsNumber)
      ) {
        showFieldError(
          ageInput,
          ageError,
          "Age must be a whole number of 1 or more.",
        );
        hasValidationErrors = true;
      }
    }

    if (!genderSelect.value) {
      showFieldError(
        genderSelect,
        genderError,
        "Please select the pet's gender.",
      );
      hasValidationErrors = true;
    }

    if (!sizeSelect.value) {
      showFieldError(sizeSelect, sizeError, "Please select the pet's size.");
      hasValidationErrors = true;
    }

    if (!colorInput.value.trim()) {
      showFieldError(colorInput, colorError, "Please enter the pet's color.");
      hasValidationErrors = true;
    }

    if (!adoptionStatusSelect.value) {
      showFieldError(
        adoptionStatusSelect,
        adoptionStatusError,
        "Please select the pet's adoption status.",
      );
      hasValidationErrors = true;
    }

    if (!locationInput.value.trim()) {
      showFieldError(
        locationInput,
        locationError,
        "Please enter the pet's location.",
      );
      hasValidationErrors = true;
    }

    const imageUrl = imageUrlInput.value.trim();

    if (!imageUrl) {
      showFieldError(
        imageUrlInput,
        imageUrlError,
        "Please enter the pet's image URL.",
      );
      hasValidationErrors = true;
    } else if (!isValidHttpUrl(imageUrl)) {
      showFieldError(
        imageUrlInput,
        imageUrlError,
        "Please enter a valid URL starting with http:// or https://.",
      );
      hasValidationErrors = true;
    }

    if (!imageAltInput.value.trim()) {
      showFieldError(
        imageAltInput,
        imageAltError,
        "Please enter a description for the pet's image.",
      );
      hasValidationErrors = true;
    }

    if (!descriptionTextarea.value.trim()) {
      showFieldError(
        descriptionTextarea,
        descriptionError,
        "Please enter a description for the pet.",
      );
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      const firstInvalidField = form.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("[aria-invalid='true']");

      firstInvalidField?.focus();
      return;
    }

    const age = ageUnknownCheckbox.checked ? 0 : ageInput.valueAsNumber;

    const petData: PetPayload = {
      name: nameInput.value.trim(),
      species: speciesInput.value.trim(),
      breed: breedInput.value.trim(),
      age,
      gender: genderSelect.value,
      size: sizeSelect.value,
      color: colorInput.value.trim(),
      description: descriptionTextarea.value.trim(),
      adoptionStatus:
        adoptionStatusSelect.value as PetPayload["adoptionStatus"],
      location: locationInput.value.trim(),
      image: {
        url: imageUrl,
        alt: imageAltInput.value.trim(),
      },
    };

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";
    openDeleteModalButton.disabled = true;

    try {
      const updatedPet = await updatePet(petId, petData);

      submitStatus.textContent = `${updatedPet.name} has been updated successfully.`;

      submitStatus.className =
        "rounded-md border border-green-700 bg-green-50 p-4 text-green-800";

      window.setTimeout(() => {
        window.location.hash = `#/listing?id=${updatedPet.id}`;
      }, 800);
    } catch (error) {
      submitStatus.textContent =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while updating the pet. Please try again later.";

      submitStatus.className =
        "rounded-md border border-red-700 bg-red-50 p-4 text-red-800";

      submitButton.disabled = false;
      submitButton.textContent = defaultSubmitText;
      openDeleteModalButton.disabled = false;
    }
  });
}

export async function initEditPetPage(): Promise<void> {
  const container = document.querySelector<HTMLElement>(
    "[data-edit-pet-container]",
  );

  const status = document.querySelector<HTMLParagraphElement>(
    "[data-edit-pet-load-status]",
  );

  const formContainer = document.querySelector<HTMLDivElement>(
    "[data-edit-pet-form-container]",
  );

  if (!container || !status || !formContainer) return;

  const petId = getPetIdFromHash();

  const backPath =
    petId && isValidListingId(petId)
      ? `#/listing?id=${encodeURIComponent(petId)}`
      : "#/listings";

  initBackButton(backPath);

  if (!petId) {
    container.setAttribute("aria-busy", "false");
    status.textContent = "No pet ID provided in the URL.";
    status.classList.add("text-red-600");
    return;
  }

  if (!isValidListingId(petId)) {
    container.setAttribute("aria-busy", "false");
    status.textContent = "Invalid pet ID format.";
    status.classList.add("text-red-600");
    return;
  }

  try {
    const pet = await fetchPetById(petId);

    if (!isPetOwner(pet.owner?.email)) {
      container.setAttribute("aria-busy", "false");

      status.textContent =
        "You do not have permission to edit this pet. Only the owner can edit the pet details.";
      status.classList.add("text-[#C95A5A]");
      formContainer.replaceChildren();
      return;
    }

    container.setAttribute("aria-busy", "false");
    status.textContent = "";

    formContainer.innerHTML = editPetForm(pet);
    initEditPetForm(petId);
  } catch (error) {
    container.setAttribute("aria-busy", "false");
    status.classList.add("text-[#C95A5A]");

    if (error instanceof TypeError) {
      status.textContent =
        "Unable to connect to the server. Please check your internet connection.";
      return;
    }

    status.textContent =
      error instanceof Error
        ? error.message
        : "Unable to load pet details. Please try again later.";
  }
}
