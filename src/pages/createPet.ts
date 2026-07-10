import type { PetPayload } from "../types/pet.ts";
import { addPet } from "../services/pets.ts";

/**
 * Generates the HTML for the "Create Pet Listing" page.
 * @returns The Create Pet page markup
 */
export function createPetPage(): string {
  return `
    <section aria-labelledby="create-pet-heading">
      <header>
        <h1
          id="create-pet-heading"
          class="text-3xl font-bold text-[#2d6a6a]"
        >
          Create Pet Listing
        </h1>

        <p class="mt-4 text-[#2c2c2c]">
          Add a new pet to the adoption list.
        </p>
      </header>

      <form
        data-create-pet-form
        class="mt-8 space-y-6"
        novalidate
        aria-busy="false"
      >
        <div 
          data-create-pet-fields 
          class="grid gap-6 md:grid-cols-2"
        >
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
              required
              aria-describedby="pet-name-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />

            <p id="pet-name-error" class="mt-1 text-sm text-[#C95A5A] hidden"></p>
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
              required
              aria-describedby="pet-species-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />
            <p id="pet-species-error" class="mt-1 text-sm text-[#C95A5A] hidden"></p>
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
              required
              aria-describedby="pet-breed-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />
            <p id="pet-breed-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>

          <div>
            <label
              for="pet-age"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Age
              <span data-age-required aria-hidden="true">*</span>
            </label>
            
            <input
              id="pet-age"
              name="age"
              type="number"
              min="1"
              step="1"
              required
              aria-describedby="pet-age-help pet-age-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]  disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            />

            <p id="pet-age-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          

            <div class="mt-3 flex items-center gap-2">
              <input
                id="pet-age-unknown"
                name="ageUnknown"
                type="checkbox"
                data-age-unknown
                class="h-4 w-4 accent-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2"
              />

              <label
                for="pet-age-unknown"
                class="text-[#2c2c2c]"
              >
                Age Unknown
              </label>
            </div>

            <p id="pet-age-help" class="mt-2 text-sm text-gray-600">
              If the pet's age is unknown, check the box above. Otherwise, enter the age in years.
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
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="unknown">Unknown</option>
            </select>
            <p id="pet-gender-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>

          <div>
            <label
              for="pet-size"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
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
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <p id="pet-size-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>

          <div>
            <label
              for="pet-color"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Color
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-color"
              name="color"
              type="text"
              required
              aria-describedby="pet-color-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />
            <p id="pet-color-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
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
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </select>
            <p id="pet-adoption-status-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>

          <div>
            <label
              for="pet-location"
              class="mb-2 block font-semibold text-[#2c2c2c]"
            >
              Location
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="pet-location"
              name="location"
              type="text"
              required
              aria-describedby="pet-location-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />
            <p id="pet-location-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
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
              required
              placeholder="https://example.com/image.jpg"
              aria-describedby="pet-image-url-error"
              class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
            />
            <p id="pet-image-url-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
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
                required
                placeholder="A description of the image"
                aria-describedby="pet-image-alt-error"
                class="w-full rounded-md border border-gray-400 bg-white px-4 py-3 text-[#2c2c2c] focus:border-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
              />
              <p id="pet-image-alt-error" class="mt-1 text-sm text-[#C95A5A] hidden">
              </p>
              <p class="mt-2 text-sm text-gray-600">
                Provide a URL to an image of the pet and a brief description of what the image depicts.
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
            ></textarea>
            <p id="pet-description-error" class="mt-1 text-sm text-[#C95A5A] hidden">
            </p>
          </div>
        </div>

      

        <p
          data-create-pet-status
          role="status"
          aria-live="polite"
          class="hidden"
        ></p>

        <button
          type="submit"
          class="rounded-xl bg-[#2d6a6a] px-4 py-3 font-semibold text-white transition hover:bg-[#245858] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
        >
          Create Pet Listing
        </button>
      </form>
    </section> 
    `;
}

/**
 * Initializes the "Create Pet form, including validation,
 * age handling, submission state, and API feedback.
 */
export function initCreatePetPage(): void {
  const form = document.querySelector<HTMLFormElement>(
    "[data-create-pet-form]",
  );
  const statusMessage = document.querySelector<HTMLElement>(
    "[data-create-pet-status]",
  );

  const nameInput = document.querySelector<HTMLInputElement>("#pet-name");
  const speciesInput = document.querySelector<HTMLInputElement>("#pet-species");
  const breedInput = document.querySelector<HTMLInputElement>("#pet-breed");
  const genderSelect = document.querySelector<HTMLSelectElement>("#pet-gender");
  const ageInput = document.querySelector<HTMLInputElement>("#pet-age");
  const ageUnknownCheckbox =
    document.querySelector<HTMLInputElement>("[data-age-unknown]");
  const requiredIndicator = document.querySelector<HTMLElement>(
    "[data-age-required]",
  );
  const sizeSelect = document.querySelector<HTMLSelectElement>("#pet-size");
  const colorInput = document.querySelector<HTMLInputElement>("#pet-color");
  const adoptionStatusSelect = document.querySelector<HTMLSelectElement>(
    "#pet-adoption-status",
  );
  const locationInput =
    document.querySelector<HTMLInputElement>("#pet-location");
  const imageUrlInput =
    document.querySelector<HTMLInputElement>("#pet-image-url");
  const imageAltInput =
    document.querySelector<HTMLInputElement>("#pet-image-alt");
  const descriptionTextarea =
    document.querySelector<HTMLTextAreaElement>("#pet-description");

  const nameError = document.querySelector<HTMLElement>("#pet-name-error");
  const speciesError =
    document.querySelector<HTMLElement>("#pet-species-error");
  const breedError = document.querySelector<HTMLElement>("#pet-breed-error");
  const ageError = document.querySelector<HTMLElement>("#pet-age-error");
  const genderError = document.querySelector<HTMLElement>("#pet-gender-error");
  const sizeError = document.querySelector<HTMLElement>("#pet-size-error");
  const colorError = document.querySelector<HTMLElement>("#pet-color-error");
  const adoptionStatusError = document.querySelector<HTMLElement>(
    "#pet-adoption-status-error",
  );
  const locationError = document.querySelector<HTMLElement>(
    "#pet-location-error",
  );
  const imageUrlError = document.querySelector<HTMLElement>(
    "#pet-image-url-error",
  );
  const imageAltError = document.querySelector<HTMLElement>(
    "#pet-image-alt-error",
  );
  const descriptionError = document.querySelector<HTMLElement>(
    "#pet-description-error",
  );

  const submitButton = form?.querySelector<HTMLButtonElement>(
    "button[type='submit']",
  );

  if (
    !form ||
    !statusMessage ||
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
    !speciesError ||
    !breedError ||
    !ageError ||
    !genderError ||
    !sizeError ||
    !colorError ||
    !adoptionStatusError ||
    !locationError ||
    !imageUrlError ||
    !imageAltError ||
    !descriptionError ||
    !submitButton
  ) {
    return;
  }

  const formFields = [
    nameInput,
    speciesInput,
    breedInput,
    ageInput,
    ageUnknownCheckbox,
    genderSelect,
    sizeSelect,
    colorInput,
    adoptionStatusSelect,
    locationInput,
    imageUrlInput,
    imageAltInput,
    descriptionTextarea,
  ];

  const defaultSubmitText =
    submitButton.textContent?.trim() || "Create Pet Listing";

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

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const parsedUrl = new URL(value);

      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  const updateAgeField = (): void => {
    const ageIsUnknown = ageUnknownCheckbox.checked;

    ageInput.disabled = ageIsUnknown;
    ageInput.required = !ageIsUnknown;
    requiredIndicator.hidden = ageIsUnknown;

    if (ageIsUnknown) {
      ageInput.value = "";
      clearFieldError(ageInput, ageError);
    }
  };

  ageUnknownCheckbox.addEventListener("change", () => {
    updateAgeField();
    clearFieldError(ageInput, ageError);
  });

  updateAgeField();

  nameInput.addEventListener("input", () => {
    clearFieldError(nameInput, nameError);
  });

  speciesInput.addEventListener("input", () => {
    clearFieldError(speciesInput, speciesError);
  });

  breedInput.addEventListener("input", () => {
    clearFieldError(breedInput, breedError);
  });

  ageInput.addEventListener("input", () => {
    clearFieldError(ageInput, ageError);
  });

  genderSelect.addEventListener("change", () => {
    clearFieldError(genderSelect, genderError);
  });

  sizeSelect.addEventListener("change", () => {
    clearFieldError(sizeSelect, sizeError);
  });

  colorInput.addEventListener("input", () => {
    clearFieldError(colorInput, colorError);
  });

  adoptionStatusSelect.addEventListener("change", () => {
    clearFieldError(adoptionStatusSelect, adoptionStatusError);
  });

  locationInput.addEventListener("input", () => {
    clearFieldError(locationInput, locationError);
  });

  imageUrlInput.addEventListener("input", () => {
    clearFieldError(imageUrlInput, imageUrlError);
  });

  imageAltInput.addEventListener("input", () => {
    clearFieldError(imageAltInput, imageAltError);
  });

  descriptionTextarea.addEventListener("input", () => {
    clearFieldError(descriptionTextarea, descriptionError);
  });

  let isSubmitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const name = nameInput.value.trim();
    const species = speciesInput.value.trim();
    const breed = breedInput.value.trim();
    const color = colorInput.value.trim();
    const location = locationInput.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    const imageAlt = imageAltInput.value.trim();
    const description = descriptionTextarea.value.trim();

    nameInput.value = name;
    speciesInput.value = species;
    breedInput.value = breed;
    colorInput.value = color;
    locationInput.value = location;
    imageUrlInput.value = imageUrl;
    imageAltInput.value = imageAlt;
    descriptionTextarea.value = description;

    statusMessage.textContent = "";
    statusMessage.className = "hidden";
    clearAllFieldErrors();

    let hasValidationErrors = false;

    if (!name) {
      showFieldError(nameInput, nameError, "Please enter the pet's name.");
      hasValidationErrors = true;
    }

    if (!species) {
      showFieldError(
        speciesInput,
        speciesError,
        "Please enter the pet's species.",
      );
      hasValidationErrors = true;
    }

    if (!breed) {
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

    if (!color) {
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

    if (!location) {
      showFieldError(
        locationInput,
        locationError,
        "Please enter the pet's location.",
      );
      hasValidationErrors = true;
    }

    if (!imageUrl) {
      showFieldError(
        imageUrlInput,
        imageUrlError,
        "Please enter an image URL.",
      );
      hasValidationErrors = true;
    } else if (!isValidHttpUrl(imageUrl)) {
      showFieldError(
        imageUrlInput,
        imageUrlError,
        "Please enter a valid public image URL.",
      );
      hasValidationErrors = true;
    }

    if (!imageAlt) {
      showFieldError(
        imageAltInput,
        imageAltError,
        "Please enter a description for the image.",
      );
      hasValidationErrors = true;
    }

    if (!description) {
      showFieldError(
        descriptionTextarea,
        descriptionError,
        "Please enter a description for the pet.",
      );
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      const firstInvalidInput = form.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("[aria-invalid='true']");

      firstInvalidInput?.focus();
      return;
    }

    const age = ageUnknownCheckbox.checked ? 0 : ageInput.valueAsNumber;

    const petData: PetPayload = {
      name,
      species,
      breed,
      age,
      gender: genderSelect.value,
      size: sizeSelect.value,
      color,
      adoptionStatus:
        adoptionStatusSelect.value as PetPayload["adoptionStatus"],
      location,
      description,
      image: {
        url: imageUrl,
        alt: imageAlt,
      },
    };

    isSubmitting = true;
    form.setAttribute("aria-busy", "true");

    formFields.forEach((field) => {
      field.disabled = true;
    });

    submitButton.disabled = true;
    submitButton.textContent = "Creating...";

    try {
      const createdPet = await addPet(petData);

      if (!form.isConnected) return;

      statusMessage.textContent = `${createdPet.name} has been successfully added to the adoption list.`;

      statusMessage.className =
        "rounded-md border border-green-700 bg-green-50 p-4 text-green-800";

      window.setTimeout(() => {
        if (!form.isConnected) return;

        form.setAttribute("aria-busy", "false");
        window.location.hash = `#/listing?id=${encodeURIComponent(createdPet.id)}`;
      }, 800);
    } catch (error) {
      console.error("Failed to create pet listing:", error);

      if (!form.isConnected) return;

      statusMessage.textContent =
        "Unable to create pet listing. Please try again later.";

      statusMessage.className =
        "rounded-md border border-red-700 bg-red-50 p-4 text-red-800";

      formFields.forEach((field) => {
        field.disabled = false;
      });

      updateAgeField();

      form.setAttribute("aria-busy", "false");
      submitButton.disabled = false;
      submitButton.textContent = defaultSubmitText;
      isSubmitting = false;
    }
  });
}
