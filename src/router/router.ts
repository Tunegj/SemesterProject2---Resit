import { initHeader } from "../components/header.ts";
import { layout, initLayout } from "../components/layout.ts";
import { homePage } from "../pages/home.ts";
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
import { editPetPage } from "../pages/editPet.ts";
import { isAdmin, isAuthenticated } from "../services/auth.ts";

const app = document.querySelector<HTMLDivElement>("#app");

/** Retrieves the current route from the URL hash and returns it as a string. The route is determined by splitting the hash at the "?" character and taking the first part, which represents the path of the route. If there is no hash in the URL, it defaults to "#/".
 * @returns A string representing the current route based on the URL hash.
 */
function getRoutes(): string {
  const hash = window.location.hash || "#/";

  return hash.split("?")[0];
}

/** Focuses the main content area of the page by selecting the element with the ID "main-content" and calling the focus method on it. This is done to improve accessibility and ensure that keyboard users can easily navigate to the main content after a route change. The focus action is wrapped in a requestAnimationFrame to ensure it occurs after the DOM has been updated.
 */
function focusMainContent(): void {
  requestAnimationFrame(() => {
    const mainContent = document.querySelector<HTMLElement>("#main-content");

    mainContent?.focus({
      preventScroll: true,
    });
  });
}

/** Renders the appropriate page content based on the current route in the URL hash. It checks the user's authentication and admin status to determine if they have access to certain routes. If the user is not authorized to access a route, they are redirected to the login page or home page as appropriate. The function updates the innerHTML of the app container with the layout and page content, and initializes necessary components such as the header and layout. It also sets up event listeners for accessibility features.
 */
export function renderRoute(): void {
  if (!app) return;

  const route = getRoutes();

  const authenticatedRoutes = ["#/profile"];
  const adminRoutes = ["#/create", "#/edit", "#/delete"];
  const guestRoutes = ["#/login", "#/register"];

  const isAdminRoute = adminRoutes.includes(route);
  const isGuestRoute = guestRoutes.includes(route);
  const isAuthenticatedRoute = authenticatedRoutes.includes(route);

  if (isAuthenticatedRoute && !isAuthenticated()) {
    window.location.hash = "#/login";
    return;
  }

  if (isAdminRoute && !isAuthenticated()) {
    window.location.hash = "#/login";
    return;
  }

  if (isAdminRoute && !isAdmin()) {
    window.location.hash = "#/";
    return;
  }

  if (isGuestRoute && isAuthenticated()) {
    window.location.hash = "#/";
    return;
  }

  switch (route) {
    case "#/":
      app.innerHTML = layout(homePage());
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
  focusMainContent();
}

/** Initializes the router by rendering the current route and setting up event listeners for hash changes and authentication changes. When the URL hash changes or the authentication state changes, the renderRoute function is called to update the page content accordingly.
 */
export function initRouter(): void {
  renderRoute();

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("auth:changed", renderRoute);
}
