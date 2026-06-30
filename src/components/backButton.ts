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
