import { logo } from "./logo";

function isActiveLink(path: string): boolean {
  return window.location.hash === path;
}

function navLink(path: string, label: string): string {
  const active = isActiveLink(path);

  const baseClasses =
    "inline-block border-b-4 px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2";

  const stateClasses = active
    ? "border-[#2d6a6a] text-[#2d6a6a]"
    : "border-transparent text-[#2c2c2c] hover:border-[#7bae7f] hover:text-[#2d6a6a]";
  return `
    <a
      href="${path}"
      class="${baseClasses} ${stateClasses}"
    ${active ? 'aria-current="page"' : ""}
    >
      ${label}
    </a>
  `;
}

export function header(): string {
  return `
    <header class="border-b border-gray-200 bg-white shadow-sm"> 
        <nav
            class="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-5"
            aria-label="Main navigation">
            <div class="justify-self-start">
                ${logo()}
            </div>


            <ul class="hidden items-center justify-center gap-10 justify-self-center sm:flex">
                <li>${navLink("#/", "Home")}</li>
                <li>${navLink("#/login", "Login")}</li>
                <li>${navLink("#/register", "Register")}</li>
            </ul>

              <button 
                type="button" 
                class= "justify-self-end rounded-md p-2 text-3xl text-[#2c2c2c] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] sm:hidden" 
                aria-label="Open menu" >
                ☰
            </button>
        </nav>
    </header>
    `;
}
