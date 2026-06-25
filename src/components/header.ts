import { isAdmin, isAuthenticated, logout } from "../services/auth.ts";
import { logo } from "./logo";

interface NavigationLink {
  path: string;
  label: string;
}

/**
 * Determines if the given path is the active link based on the current route in the URL hash. It compares the provided path with the current route and returns true if they match, indicating that the link is active.
 * @param path - The path to check against the current route.
 * @returns A boolean indicating whether the given path is the active link.
 */
function isActiveLink(path: string): boolean {
  const currentRoute = window.location.hash.split("?")[0] || "#/";

  return currentRoute === path;
}

/**
 * Generates an HTML string for a navigation link with the given path and label. The link is styled based on whether it is the active link.
 * @param path - The path for the navigation link.
 * @param label - The label for the navigation link.
 * @returns An HTML string representing the navigation link.
 */
function navLink(path: string, label: string): string {
  const active = isActiveLink(path);

  const baseClasses =
    "inline-block border-b-4 px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 whitespace-nowrap";

  const stateClasses = active
    ? "border-[#2d6a6a] text-[#2d6a6a]  whitespace-nowrap"
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
 * Generates an array of navigation links based on the user's authentication and admin status. The links include Home, Login, Register, Profile, Create Pet, and Edit Pet, depending on the user's state.
 * @returns An array of NavigationLink objects representing the navigation links for the header.
 */
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
      {
        path: "#/listings",
        label: "View All Pets",
      },
    );
  }

  if (isAuthenticated()) {
    links.push({
      path: "#/profile",
      label: "Profile",
    });
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

/**
 * Generates the HTML string for the navigation items in the header, including links for Home, Login, Register, Profile, Create Pet, and Edit Pet, based on the user's authentication and admin status. If the user is authenticated, a Logout button is also included.
 * @returns An HTML string representing the navigation items for the header.
 */
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
    <header class="border-b border-gray-200 bg-[#FAFAF7]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6"> 
        <nav
          class="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-5"
          aria-label="Main navigation"
        >
          <div class="justify-self-start">
                ${logo()}
          </div>

          <ul class="hidden items-center justify-center gap-10 justify-self-center md:flex ">
            ${items}
          </ul>

          <button 
            type="button" 
            class= "justify-self-end rounded-md p-2 text-3xl text-[#2c2c2c] hover:text-[#2d6a6a] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] md:hidden"
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
          class="border-t border-gray-200 py-4 md:hidden"
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
        window.location.hash = "#/login?loggedOut=true";
        logout();
      });
    });

  document.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      !menuButton ||
      !mobileNavigation ||
      mobileNavigation.hidden
    ) {
      return;
    }

    mobileNavigation.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  });
}
