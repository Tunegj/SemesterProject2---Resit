import { fetchPets } from "../services/pets.ts";

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

export function homePage(): string {
  const successMessage = registrationSuccessMessage();

  if (successMessage) {
    setTimeout(() => {
      window.history.replaceState(null, "", "#/");
    }, 0);
  }

  setTimeout(loadPets, 0);

  return `
    <section class="min-h-screen bg-[#FAFAF7] p-6">

      ${successMessage}
  
        <p class="mt-4 text-[#2c2c2c]">
        SPA is running!</p>

        <div id="pets-test" class="mt-6 text-[#2c2c2c]">
        Loading pets...
        </div>
    </section>
    `;
}

/**
 * Loads pets from the API and displays them in the #pets-test container.
 */
async function loadPets(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>("#pets-test");

  if (!container) return;

  try {
    const pets = await fetchPets();

    container.innerHTML = `
      <p>Loaded ${pets.length} pets from the API.</p>

      <ul>
        ${pets
          .slice(0, 5)
          .map(
            (pet) => `
          <li>
            ${pet.name} - ${pet.breed}
          </li>
        `,
          )
          .join("")}
      </ul>
    `;
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <p class="text-red-700">
        Could not load pets.
      </p>
    `;
  }
}
