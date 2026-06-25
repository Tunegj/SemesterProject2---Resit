import { loginUser } from "../services/login.ts";
import { saveAuth } from "../services/auth.ts";

/**
 * Generates the HTML string for the login page, which includes a form for users to enter their email and password. The page also displays a success message if the user has logged out successfully, and provides links to register for a new account if they don't have one. The form includes validation error messages for email and password fields, as well as a general login error message for failed login attempts.
 * @returns An HTML string representing the login page.
 */
export function loginPage(): string {
  const successMessage = logoutSuccessMessage();

  if (successMessage) {
    setTimeout(() => {
      window.history.replaceState(null, "", "#/login");
    }, 0);
  }

  return `
  <section 
  class="mx-auto w-full max-w-sm"
  aria-labelledby="login-heading"
  >
    <h1 id="login-heading" class="text-center text-3xl font-bold text-[#2c2c2c]">
      Login
    </h1>

    ${successMessage}

    <form 
    class="mt-8"
    data-login-form
    novalidate
    >
      <div class="space-y-5 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label for="login-email" 
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Email
          </label>

          <input
          id="login-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="Enter your email"
          required
          aria-describedby="login-email-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="login-email-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="email"
          aria-live="polite"
          ></p>
        </div>

        <div>
          <label for="login-password"
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Password
          </label>

          <input
          id="login-password"
          name="password"
          type="password"
          autocomplete="current-password"
          placeholder="Enter your password"
          required
          minlength="8"
          aria-describedby="login-password-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="login-password-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="password"
          aria-live="polite"
          ></p>
        </div>
      </div>

      <p
      class="mt-4 text-center text-sm text-[#C95A5A]"
      data-login-error
      role="alert"
      aria-live="assertive"
      ></p>

      <button
      type="submit"
      class="mx-auto mt-6 block rounded-lg bg-[#2d6a6a] px-10 py-3 font-semibold text-white transition-colors hover:bg-[#245656] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#d1d5db] disabled:text-[#4b5563] disabled:hover:bg-[#d1d5db]"
      data-login-submit
      >
        Login
      </button>
    </form>

    <p class="mt-6 text-center leading-tight text-[#2c2c2c]">
    Don't have an account?
    <br />
    Register
    <a
    href="#/register"
    class="font-medium text-[#2d6a6a] underline underline-offset-2"
    >here</a>
    </p>
  </section>
  `;
}

/**
 * Generates the HTML string for the logout success message, which is displayed when the user has logged out successfully. The message is shown based on the URL query parameter "loggedOut".
 * @returns An HTML string representing the logout success message, or an empty string if the user has not logged out.
 */
function logoutSuccessMessage(): string {
  const queryString = window.location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(queryString);

  if (params.get("loggedOut") !== "true") {
    return "";
  }

  return `
    <p
    class="mt-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-center text-green-800"
    role="status"
    aria-live="polite"
    >
      You have been logged out successfully.
    </p>
  `;
}

/**
 * Initializes the login page by setting up event listeners for the login form submission. It handles form validation, displays error messages for invalid inputs, and manages the login process by calling the loginUser function. If the login is successful, it saves the authentication token and redirects the user to the home page. If there are any errors during login, it displays an appropriate error message.
 */
export function initLoginPage(): void {
  const form = document.querySelector<HTMLFormElement>("[data-login-form]");

  if (!form) {
    return;
  }

  const emailInput = form.elements.namedItem("email");
  const passwordInput = form.elements.namedItem("password");

  const emailError = form.querySelector<HTMLElement>(
    "[data-error-for='email']",
  );

  const passwordError = form.querySelector<HTMLElement>(
    "[data-error-for='password']",
  );

  const loginError = form.querySelector<HTMLElement>("[data-login-error]");

  const submitButton = form.querySelector<HTMLButtonElement>(
    "[data-login-submit]",
  );

  if (
    !(emailInput instanceof HTMLInputElement) ||
    !(passwordInput instanceof HTMLInputElement) ||
    !emailError ||
    !passwordError ||
    !loginError ||
    !submitButton
  ) {
    return;
  }

  let isSubmitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";

    emailInput.removeAttribute("aria-invalid");
    passwordInput.removeAttribute("aria-invalid");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasValidationErrors = false;

    if (!email) {
      emailError.textContent = "Email is required.";
      emailInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (!emailInput.validity.valid) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (!password) {
      passwordError.textContent = "Password is required.";
      passwordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (password.length < 8) {
      passwordError.textContent =
        "Password must be at least 8 characters long.";
      passwordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      const firstInvalidInput = form.querySelector<HTMLInputElement>(
        "[aria-invalid='true']",
      );
      firstInvalidInput?.focus();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
      const user = await loginUser({
        email,
        password,
      });

      const authSaved = saveAuth(user.accessToken, {
        name: user.name,
        email: user.email,
      });

      if (!authSaved) {
        throw new Error(
          "Your login session could not be saved. Please try again.",
        );
      }

      window.location.hash = "#/";
    } catch (error) {
      loginError.textContent =
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Login";
      isSubmitting = false;
    }
  });
}
