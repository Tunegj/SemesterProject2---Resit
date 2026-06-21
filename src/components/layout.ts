import { header } from "./header";
import { footer } from "./footer";

export function layout(pageContent: string): string {
  return `
    <div class="flex min-h-screen flex-col bg-[#FAFAF7]">
      ${header()}

      <main 
        id="main-content"
        class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      ${pageContent}
      </main>

      ${footer()}
    </div>
  `;
}
