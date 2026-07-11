import { initHeader } from "../components/header.ts";
import { layout, initLayout } from "../components/layout.ts";
import { homePage, initHomePage } from "../pages/home.ts";
import { notFoundPage } from "../pages/notFound.ts";
import { listingsPage, initListingsPage } from "../pages/listings.ts";
import { createPetPage, initCreatePetPage } from "../pages/createPet.ts";
import { loginPage, initLoginPage } from "../pages/login.ts";
import { registerPage, initRegisterPage } from "../pages/register.ts";
import { profilePage } from "../pages/profile.ts";
import {
  singleListingPage,
  initSingleListingPage,
} from "../pages/singlePet.ts";
import { editPetPage, initEditPetPage } from "../pages/editPet.ts";
import { isAuthenticated } from "../services/auth.ts";

const app = document.querySelector<HTMLDivElement>("#app");

/**
 * Returns the current route without any query parameters.
 */
function getRoute(): string {
  const hash = window.location.hash || "#/";

  return hash.split("?")[0];
}

const protectedRoutes = ["#/profile", "#/create", "#/edit"];
const guestRoutes = ["#/login", "#/register"];

let hasRenderedInitialRoute = false;

/** Moves focus to the main content after a SPA route change.
 */

function focusMainContent(): void {
  requestAnimationFrame(() => {
    const mainContent = document.querySelector<HTMLElement>("#main-content");

    mainContent?.focus({});
  });
}

const pageTitles: Record<string, string> = {
  "#/": "Home | FureverHome",
  "#/listings": "Available Pets | FureverHome",
  "#/listing": "Pet Details | FureverHome",
  "#/create": "Create Listing | FureverHome",
  "#/edit": "Edit Listing | FureverHome",
  "#/login": "Login | FureverHome",
  "#/register": "Register | FureverHome",
  "#/profile": "Profile | FureverHome",
};

function updatePageTitle(route: string): void {
  document.title = pageTitles[route] ?? "Page Not Found | FureverHome";
}
/**
 * Renders and initializes the page matching the current route.
 * Redirects users who do not have access to protected or guest-only routes.
 */
export function renderRoute(): void {
  if (!app) return;

  const route = getRoute();

  const isProtectedRoute = protectedRoutes.includes(route);
  const isGuestRoute = guestRoutes.includes(route);

  if (isProtectedRoute && !isAuthenticated()) {
    window.location.hash = "#/login?reason=protected";
    return;
  }

  if (isGuestRoute && isAuthenticated()) {
    window.location.hash = "#/";
    return;
  }

  updatePageTitle(route);

  switch (route) {
    case "#/":
      app.innerHTML = layout(homePage());
      initHomePage();
      break;

    case "#/listings":
      app.innerHTML = layout(listingsPage());
      initListingsPage();
      break;

    case "#/create":
      app.innerHTML = layout(createPetPage());
      initCreatePetPage();
      break;

    case "#/edit":
      app.innerHTML = layout(editPetPage());
      initEditPetPage();
      break;

    case "#/login":
      app.innerHTML = layout(loginPage());
      initLoginPage();
      break;

    case "#/register":
      app.innerHTML = layout(registerPage());
      initRegisterPage();
      break;

    case "#/profile":
      app.innerHTML = layout(profilePage());
      break;

    case "#/listing":
      app.innerHTML = layout(singleListingPage());
      initSingleListingPage();
      break;

    default:
      app.innerHTML = layout(notFoundPage());
  }

  initHeader();
  initLayout();

  if (hasRenderedInitialRoute) {
    focusMainContent();
  }

  hasRenderedInitialRoute = true;
}

/**
 * Starts the router and listens for route and authentication changes.
 */
export function initRouter(): void {
  renderRoute();

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("auth:changed", renderRoute);
}
