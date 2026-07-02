/**
 * Generates the HTML for a back button with an optional label.
 * @param label - The text to display on the button. Defaults to "Back".
 * @returns A string containing the HTML for the back button.
 */

export function backButton(label = "Back"): string {
  return `
    <button
        type="button"
        data-back-button
        class="mb-6 inline-flex items-center gap-2 font-semibold text-[#2c2c2c] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#2d6a6a]"
    >
        <span aria-hidden="true">←</span>
        ${label}
    </button>
    `;
}

/**
 * Initializes the back button functionality. When the button is clicked, it navigates back in the browser history if possible.
 * If there is no history to go back to, it redirects to a fallback hash (default is "#/").
 * @param fallbackHash - The hash to redirect to if there is no history. Defaults to "#/".
 */
export function initBackButton(fallbackHash = "#/"): void {
  const button =
    document.querySelector<HTMLButtonElement>("[data-back-button]");

  if (!button) return;

  button.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.hash = fallbackHash;
  });
}
