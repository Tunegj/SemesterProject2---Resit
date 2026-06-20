import { logo } from "./logo";

function isActiveLink(path: string): boolean {
  return window.location.hash === path;
}

function navLink(path: string, label: string): string {
  const active = isActiveLink(path);

  return `
    <a
      href="${path}"
      class="${active ? "nav-link nav-link-active" : "nav-link"}"
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


            <ul class="flex items-center justify-center gap-10 justify-self-center">
                <li>${navLink("#/", "Home")}</li>
                <li>${navLink("#/login", "Login")}</li>
                <li>${navLink("#/register", "Register")}</li>
            </ul>

              <button 
                type="button" 
                class= "justify-self-end rounded-md p-2 text-3xl text-[#2c2c2c] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] md:hidden" 
                aria-label="Open menu" >
                ☰
            </button>
        </nav>
    </header>
    `;
}
