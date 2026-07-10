import { loginUser } from "../services/login.ts";
import { saveAuth } from "../services/auth.ts";

/**
 * Generates the markup for the login page.
 * @returns The login page HTML, including form validation and route feedback areas.
 */
export function loginPage(): string {
  const feedbackMessage = loginFeedbackMessage();

  return `
  <section 
    class="mx-auto w-full max-w-sm"
    aria-labelledby="login-heading"
  >
    <h1 id="login-heading" class="text-center text-3xl font-bold text-[#2c2c2c]">
      Login
    </h1>

    ${feedbackMessage}

    <form 
      class="mt-8"
      data-login-form
      novalidate
      aria-busy="false"
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
            inputmode="email"
            autocapitalize="none"
            spellcheck="false"
            placeholder="Enter your email"
            required
            aria-describedby="login-email-error"
            class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
            id="login-email-error"
            class="mt-2 text-sm text-[#C95A5A]"
            data-error-for="email"
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
          ></p>
        </div>
      </div>

      <p
        class="mt-4 text-center text-sm text-[#C95A5A]"
        data-login-error
        role="alert"
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
      <a
        href="#/register"
        class="font-medium text-[#2d6a6a] underline underline-offset-2"
      >
        Create an account
      </a>
    </p>
  </section>
  `;
}

/**
 * Generates feedback markup from the current login-route query parameters.
 *
 * @returns Feedback HTML for logut or protected route redirects,
 * or an empty string when no feedback is needed.
 */
function loginFeedbackMessage(): string {
  const queryString = window.location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(queryString);

  if (params.get("loggedOut") === "true") {
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

  if (params.get("reason") === "protected") {
    return `
    <p
      class="mt-6 rounded-md border border-[#C95A5A] bg-[#FEE2E2] px-4 py-3 text-center text-[#C95A5A]"
      role="alert"
    >
      You must be logged in to access that page.
    </p>
  `;
  }

  return "";
}

/**
 * Initializes login page behavior.
 * Handles query-parameter cleanup, field validation, form submission,
 * authentication storage, error feedback and successful login redirection.
 */
export function initLoginPage(): void {
  const feedbackMessage = loginFeedbackMessage();

  if (feedbackMessage) {
    window.history.replaceState(null, "", "#/login");
  }

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

  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.removeAttribute("aria-invalid");
    loginError.textContent = "";
  });

  passwordInput.addEventListener("input", () => {
    passwordError.textContent = "";
    passwordInput.removeAttribute("aria-invalid");
    loginError.textContent = "";
  });

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

    emailInput.value = email;

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
    form.setAttribute("aria-busy", "true");

    emailInput.disabled = true;
    passwordInput.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
      const user = await loginUser({
        email,
        password,
      });

      if (!form.isConnected) return;

      const authSaved = saveAuth(user.accessToken, {
        name: user.name,
        email: user.email,
      });

      if (!authSaved) {
        console.error(
          "Login successful, but failed to save authentication token.",
        );

        loginError.textContent =
          "Your login session could not be saved. Please try again.";
        return;
      }

      window.location.hash = "#/";
    } catch (error) {
      console.error("Login failed:", error);

      if (!form.isConnected) return;

      loginError.textContent =
        "Unable to log in. Please check your email and password and try again.";
    } finally {
      if (form.isConnected) {
        form.setAttribute("aria-busy", "false");

        emailInput.disabled = false;
        passwordInput.disabled = false;
        submitButton.disabled = false;
        submitButton.textContent = "Login";

        isSubmitting = false;
      }
    }
  });
}
