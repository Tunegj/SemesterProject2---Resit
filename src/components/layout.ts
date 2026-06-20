import { header } from "./header";

export function layout(pageContent: string): string {
  return `
    <div class="min-h-screen bg-[#FAFAF7]">
      ${header()}

      <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        ${pageContent}
      </main>

      <footer class="border-t border-gray-200 bg-white">
        <div class="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>&copy; ${new Date().getFullYear()} FureverHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;
}
