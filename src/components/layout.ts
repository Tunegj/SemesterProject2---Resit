import { header } from "./header";
import { footer } from "./footer";

/**
 * Initializes the layout of the application by setting up event listeners for accessibility features, such as skipping to the main content.
 *  This function should be called once when the application starts to ensure that the layout is properly initialized and accessible.
 */
export function initLayout(): void {
  const skipButton = document.querySelector<HTMLButtonElement>(
    "[data-skip-to-main]",
  );

  const mainContent = document.querySelector<HTMLElement>("#main-content");

  skipButton?.addEventListener("click", () => {
    mainContent?.focus();
  });
}

/**
 * Generates the HTML layout for the application, including the header, main content area, and footer. The provided page content is inserted into the main content area.
 * @param pageContent - The HTML string representing the content of the current page to be displayed in the main content area.
 * @returns An HTML string representing the complete layout of the application.
 */
export function layout(pageContent: string): string {
  return `
    <button
      type="button"
      class="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-[#2d6a6a] px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
      data-skip-to-main
      >
      Skip to main content
    </button>

    <div class="flex min-h-screen flex-col bg-[#FAFAF7]">
      ${header()}

      <main 
        id="main-content"
        class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        tabindex="-1"
      >
      ${pageContent}
      </main>

      ${footer()}
    </div>
  `;
}
