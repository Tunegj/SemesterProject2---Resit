/**
 * Creates the shared application footer with the current year.
 */

export function footer(): string {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="border-t border-gray-200 bg-[#FAFAF7]">
        <div
            class="mx-auto w-full max-w-6xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8"
        >
        <p>
            &copy; ${currentYear} FureverHome. All rights reserved.
        </p>
        </div>
    </footer>
    `;
}
