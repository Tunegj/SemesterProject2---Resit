import { isAdmin, isAuthenticated, logout } from "../services/auth.ts";
import { logo } from "./logo";

interface NavigationLink {
  path: string;
  label: string;
}

let hasEscapeListener = false;

/**
 * Closes the mobile navigation menu by hiding it and updating the menu button's attributes.
 */
function closeMobileNavigationMenu(
  menuButton: HTMLButtonElement,
  mobileNavigation: HTMLElement,
  returnFocus = false,
): void {
  mobileNavigation.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");

  if (returnFocus) {
    menuButton.focus();
  }
}

/**
 * Handles Escape presses by closing the open mobile navigation
 * and returning focus to the menu button.
 */
function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key !== "Escape") {
    return;
  }

  const menuButton = document.querySelector<HTMLButtonElement>(
    "[data-mobile-menu-button]",
  );
  const mobileNavigation =
    document.querySelector<HTMLElement>("#mobile-navigation");

  if (!menuButton || !mobileNavigation || mobileNavigation.hidden) {
    return;
  }

  closeMobileNavigationMenu(menuButton, mobileNavigation, true);
}

/**
 * Checks whether a navigation path matches the current route.
 */
function isActiveLink(path: string): boolean {
  const currentRoute = window.location.hash.split("?")[0] || "#/";

  return currentRoute === path;
}

/**
 * Creates a navifation link and marks it as current when active.
 */
function navLink(path: string, label: string): string {
  const active = isActiveLink(path);

  const baseClasses =
    "inline-block border-b-4 px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 whitespace-nowrap";

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

/**
 * Returns the links available for the current authentication state.
 */
function getNavigationLinks(
  authenticated: boolean,
  admin: boolean,
): NavigationLink[] {
  const links: NavigationLink[] = [
    {
      path: "#/",
      label: "Home",
    },
  ];

  if (authenticated) {
    links.push({
      path: "#/profile",
      label: "Profile",
    });
  } else {
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

  links.push({
    path: "#/listings",
    label: "View All Pets",
  });

  if (admin) {
    links.push({
      path: "#/create",
      label: "Create Listing",
    });
  }

  return links;
}

/**
 * Creates the navigation list items, including logout when authenticated.
 * */
function navigationItems(): string {
  const authenticated = isAuthenticated();
  const admin = authenticated && isAdmin();

  const links = getNavigationLinks(authenticated, admin)
    .map(({ path, label }) => `<li>${navLink(path, label)}</li>`)
    .join("");

  if (!authenticated) {
    return links;
  }

  return `
  ${links}

  <li>
    <button
      type="button"
      class="block w-full rounded-md border-b-4 border-transparent px-3 py-3 text-left text-base font-semibold text-[#2c2c2c] transition-colors hover:border-[#7bae7f] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 lg:text-center"
      data-action="logout"
    >
      Logout
    </button>
  </li>
`;
}

/**
 * Creates the shared responsive application header.
 */
export function header(): string {
  const items = navigationItems();

  return `
    <header class="border-b border-gray-200 bg-[#FAFAF7]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6"> 
        <nav
          class="flex items-center justify-between gap-6 px-2 py-5"
          aria-label="Main navigation"
        >
          <div class="shrink-0">
            ${logo()}
          </div>

          <ul class="hidden items-center justify-end gap-2 lg:flex xl:gap-6">
            ${items}
          </ul>

          <button 
            type="button" 
            class="shrink-0 rounded-md p-2 text-3xl text-[#2c2c2c] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] lg:hidden"
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
          class="border-t border-gray-200 py-4 lg:hidden"
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

/**
 * Initializes mobile-navigation and logout interactions.
 * The global Escape key listener is only added once, even if this function is called multiple times.
 */
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
        closeMobileNavigationMenu(menuButton, mobileNavigation);
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='logout']")
    .forEach((logoutButton) => {
      logoutButton.addEventListener("click", () => {
        window.location.hash = "#/login?loggedOut=true";
        logout();
      });
    });

  if (!hasEscapeListener) {
    document.addEventListener("keydown", handleEscapeKey);
    hasEscapeListener = true;
  }
}
