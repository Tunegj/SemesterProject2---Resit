import { isAdmin, isAuthenticated, removeToken } from "../services/storage";
import { logo } from "./logo";

interface NavigationLink {
  path: string;
  label: string;
}

function isActiveLink(path: string): boolean {
  const currentRoute = window.location.hash.split("?")[0] || "#/";

  return currentRoute === path;
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

function getNavigationLinks(): NavigationLink[] {
  const links: NavigationLink[] = [
    {
      path: "#/",
      label: "Home",
    },
  ];

  if (!isAuthenticated()) {
    links.push(
      {
        path: "#/login",
        label: "Login",
      },
      {
        path: "#/register",
        label: "Register",
      },
    );
  }

  if (isAuthenticated() && isAdmin()) {
    links.push(
      {
        path: "#/create",
        label: "Create Pet",
      },
      {
        path: "#/edit",
        label: "Edit Pet",
      },
    );
  }

  return links;
}

function navigationItems(): string {
  const links = getNavigationLinks()
    .map(({ path, label }) => `<li>${navLink(path, label)}</li>`)
    .join("");

  if (!isAuthenticated()) {
    return links;
  }

  return `
  ${links}

  <li>
    <button
      type="button"
      class="block w-full rounded-md border-b-4 border-transparent px-3 py-3 text-left text-base font-semibold text-[#2c2c2c] transition-colors hover:border-[#7bae7f] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 md:text-center"
      data-action="logout"
    >
      Logout
    </button>
  </li>
`;
}

export function header(): string {
  const items = navigationItems();

  return `
    <header class="border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6"> 
        <nav
          class="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-5"
          aria-label="Main navigation"
        >
          <div class="justify-self-start">
                ${logo()}
          </div>

          <ul class="hidden items-center justify-center gap-10 justify-self-center sm:flex">
            ${items}
          </ul>

          <button 
            type="button" 
            class= "justify-self-end rounded-md p-2 text-3xl text-[#2c2c2c] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] sm:hidden"
            data-mobile-menu-button 
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="mobile-navigation"
          >
            <span aria-hidden="true">☰</span>
            </button>
        </nav>

        <nav
          id="mobile-navigation"
          class="hidden border-t border-gray-200 py-4 md:hidden"
          aria-label="Mobile navigation"
          hidden
        >
          <ul class="flex flex-col gap-1">
            ${items}
          </ul>
        </nav>
      </div>
    </header>
    `;
}

export function initHeader(): void {
  const menuButton = document.querySelector<HTMLButtonElement>(
    "[data-mobile-menu-button]",
  );

  const mobileNavigation =
    document.querySelector<HTMLElement>("#mobile-navigation");

  menuButton?.addEventListener("click", () => {
    if (!mobileNavigation) {
      return;
    }

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu",
    );

    mobileNavigation.hidden = isOpen;
  });

  document
    .querySelectorAll<HTMLAnchorElement>("#mobile-navigation a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        if (!menuButton || !mobileNavigation) {
          return;
        }

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
        mobileNavigation.hidden = true;
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='logout']")
    .forEach((logoutButton) => {
      logoutButton.addEventListener("click", () => {
        removeToken();
        window.location.hash = "#/login";
      });
    });
}
