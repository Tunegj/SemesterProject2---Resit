import { initHeader } from "../components/header.ts";
import { layout, initLayout } from "../components/layout.ts";
import { homePage } from "../pages/home.ts";
import { notFoundPage } from "../pages/notFound.ts";
import { listingsPage } from "../pages/listings.ts";
import { createPetPage } from "../pages/createPet.ts";
import { loginPage } from "../pages/login.ts";
import { registerPage } from "../pages/register.ts";
import { profilePage } from "../pages/profile.ts";
import { singleListingPage } from "../pages/singlePet.ts";
import { editPetPage } from "../pages/editPet.ts";
import { isAdmin, isAuthenticated } from "../services/auth.ts";

const app = document.querySelector<HTMLDivElement>("#app");

function getRoutes(): string {
  const hash = window.location.hash || "#/";

  return hash.split("?")[0];
}

function focusMainContent(): void {
  requestAnimationFrame(() => {
    const mainContent = document.querySelector<HTMLElement>("#main-content");

    mainContent?.focus({
      preventScroll: true,
    });
  });
}

export function renderRoute(): void {
  if (!app) return;

  const route = getRoutes();

  const adminRoutes = ["#/create", "#/edit", "#/delete"];
  const guestRoutes = ["#/login", "#/register"];

  const isAdminRoute = adminRoutes.includes(route);
  const isGuestRoute = guestRoutes.includes(route);

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
      break;

    case "#/create":
      app.innerHTML = layout(createPetPage());
      break;

    case "#/edit":
      app.innerHTML = layout(editPetPage());
      break;

    case "#/login":
      app.innerHTML = layout(loginPage());
      break;

    case "#/register":
      app.innerHTML = layout(registerPage());
      break;

    case "#/profile":
      app.innerHTML = layout(profilePage());
      break;

    case "#/listing":
      app.innerHTML = layout(singleListingPage());
      break;

    default:
      app.innerHTML = layout(notFoundPage());
  }

  initHeader();
  initLayout();
  focusMainContent();
}

export function initRouter(): void {
  renderRoute();

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("auth:changed", renderRoute);
}
