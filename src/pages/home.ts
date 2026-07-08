import { fetchPets } from "../services/pets.ts";
import { petCard } from "../components/petCard.ts";

/** Generate the HTML string for a success message displayed on the home page when a user has registered successfully. The message is shown based on the URL query parameter "registered". */
function registrationSuccessMessage(): string {
  const queryString = window.location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(queryString);

  if (params.get("registered") !== "true") {
    return "";
  }

  return `
    <p
    class="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-center text-green-800"
    role="status"
    aria-live="polite"
    >
      Registration successful! You are now logged in.
    </p>
  `;
}

/**
 * Generates the HTML string for the home page, which includes a success message if the user has registered successfully and a container for displaying pets. The page also includes a loading message while the pets are being fetched from the API.
 * @returns An HTML string representing the home page.
 */
export function homePage(): string {
  const successMessage = registrationSuccessMessage();

  if (successMessage) {
    setTimeout(() => {
      window.history.replaceState(null, "", "#/");
    }, 0);
  }

  return `

    <section aria-labelledby="home-heading">
      ${successMessage}
  
      <div 
      class="grid items-center gap-10 rounded-2xl bg-[#eef5f1] px-6 py-12 md:px-10 lg:grid-cols-2 lg:px-14 lg:py-16"
      >
        <div>
          <p class="font-semibold uppercase tracking-wide *:text-[#2d6a6a]">Give a Pet a Furever Home</p>

          <h1
          id= "home-heading"
          class="mt-3 text-4xl font-bold leading-tight text-[#2c2c2c] sm:text-5xl">
          Give a pet the loving home it deserves. Adopt, don't shop!
          </h1>

          <p class="mt-5 max-w-xl text-lg leading-relaxed text-[#2c2c2c]">
         Browse pets looking for their forever homes and find the companion who is right for you.
          </p>

          <a
          href="#/listings"
          class="mt-8 inline-flex items-center justify-center rounded-xl bg-[#2d6a6a] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#245858] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6a6a]"
          >
            Browse Pets
          </a>
        </div>

        <div
        class="overflow-hidden rounded-xl shadow-sm"
        >
          <img
          src="../public/hero-image.webp"
          alt="A human hand touching the paw of a cat."
          class="h-72 w-full object-cover sm:h-80 lg:h-[26rem]">
      

          <p class="mt-4 text-xl font-semibold text-[#2d6a6a]">
          Your new best friend is waiting for you!
          </p>
        </div>
      </div>
     
      <section 
      class="mt-16"
      aria-labelledby="featured-pets-heading"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
            id="featured-pets-heading"
            class="text-3xl font-bold text[#2d6a6a]"
            >
              Featured Pets
            </h2>

            <p class="mt-3 text-[#2c2c2c]">
              Check out some of the pets that are currently looking for their forever homes.
            </p>
          </div>

          <a
            href="#/listings"
            class="font-semibold text-[#2d6a6a] underline underline-offset-4 hover:text[#245858] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6a6a]"
          >
            View All Pets
          </a>
        </div>

        <div
        data-featured-pets-container
        aria-busy="true"
        class="mt-8"
        >
          <p
          data-featured-pets-status
          role="status"
          aria-live="polite"
          class="text-[#2c2c2c]"
          >
            Loading featured pets...
          </p>
        
          <div
          data-featured-pets-list
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
          </div>
        </div>
      </section>
    </section>
    `;
}

/**
 * Loads pets from the API and displays them in the #pets-test container.
 */
export function initHomePage(): void {
  void loadFeaturedPets();
}

async function loadFeaturedPets(): Promise<void> {
  const container = document.querySelector<HTMLElement>(
    "[data-featured-pets-container]",
  );
  const status = document.querySelector<HTMLParagraphElement>(
    "[data-featured-pets-status]",
  );
  const petList = document.querySelector<HTMLElement>(
    "[data-featured-pets-list]",
  );

  if (!container || !status || !petList) {
    return;
  }

  try {
    const pets = await fetchPets();

    const availablePets = pets.filter(
      (pet) => pet.adoptionStatus?.trim().toLowerCase() === "available",
    );

    const featuredPets = (
      availablePets.length > 0 ? availablePets : pets
    ).slice(0, 3);

    if (featuredPets.length === 0) {
      status.textContent = "There are currently no pets to display.";
      return;
    }

    petList.innerHTML = featuredPets.map((pet) => petCard(pet)).join("");
    status.textContent = "";

    petList
      .querySelectorAll<HTMLImageElement>("[data-pet-image]")
      .forEach((img) => {
        img.addEventListener("error", () => {
          img.hidden = true;

          const fallback = img.parentElement?.querySelector<HTMLElement>(
            "[data-image-fallback]",
          );

          if (fallback) {
            fallback.hidden = false;
          }
        });
      });
  } catch (error) {
    console.error("Error loading featured pets:", error);

    petList.replaceChildren();
    status.textContent =
      "Failed to load featured pets. Please try again later.";
    status.classList.add("text-red-600");
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}
