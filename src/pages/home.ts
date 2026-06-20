import { fetchPets } from "../services/pets.ts";

export function homePage(): string {
  setTimeout(loadPets, 0);
  return `

  <div class="bg-red-500 p-8 text-white">
  TAILWIND TEST
</div>
    <main class="min-h-screen bg-[#FAFAF7] p-6">
  
        <p class="mt-4 text-[#2c2c2c]">
        SPA is running!</p>

        <div id="pets-test" class="mt-6 text-[#2c2c2c]">
        Loading pets...
        </div>
    </main>
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
