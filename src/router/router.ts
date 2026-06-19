import { header } from "../components/header.ts";
import { homePage } from "../pages/home.ts";
import { notFoundPage } from "../pages/notFound.ts";
import { listingsPage } from "../pages/listings.ts";
import { createPetPage } from "../pages/createPet.ts";
import { loginPage } from "../pages/login.ts";
import { registerPage } from "../pages/register.ts";
import { profilePage } from "../pages/profile.ts";
import { singleListingPage } from "../pages/singlePet.ts";

const app = document.querySelector<HTMLDivElement>("#app");

export function initRouter(): void {
  if (!app) return;

  const route = window.location.hash || "#/";

  switch (route) {
    case "#/":
      app.innerHTML = header() + homePage();
      break;

    case "#/listings":
      app.innerHTML = header() + listingsPage();
      break;

    case "#/create":
      app.innerHTML = header() + createPetPage();
      break;

    case "#/login":
      app.innerHTML = header() + loginPage();
      break;

    case "#/register":
      app.innerHTML = header() + registerPage();
      break;

    case "#/profile":
      app.innerHTML = header() + profilePage();
      break;

    case "#/listing":
      app.innerHTML = header() + singleListingPage();
      break;

    default:
      app.innerHTML = header() + notFoundPage();
  }
}
