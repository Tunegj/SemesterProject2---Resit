import { initHeader } from "../components/header.ts";
import { layout } from "../components/layout.ts";
import { homePage } from "../pages/home.ts";
import { notFoundPage } from "../pages/notFound.ts";
import { listingsPage } from "../pages/listings.ts";
import { createPetPage } from "../pages/createPet.ts";
import { loginPage } from "../pages/login.ts";
import { registerPage } from "../pages/register.ts";
import { profilePage } from "../pages/profile.ts";
import { singleListingPage } from "../pages/singlePet.ts";

const app = document.querySelector<HTMLDivElement>("#app");

function getRoutes(): string {
  const hash = window.location.hash || "#/";

  return hash.split("?")[0];
}

export function renderRoute(): void {
  if (!app) return;

  const route = getRoutes();

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
}

export function initRouter(): void {
  renderRoute();

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("auth:changed", renderRoute);
}
