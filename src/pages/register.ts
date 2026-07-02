import { registerUser } from "../services/register.ts";
import { loginUser } from "../services/login.ts";
import { saveAuth } from "../services/auth.ts";

/** * Generates the HTML string for the register page, which includes a form for users to enter their username, email, password, and confirm password. The form includes validation error messages for each field, as well as a general registration error message for failed registration attempts. The page also provides a link to the login page for users who already have an account.
 * @returns An HTML string representing the register page.
 */
export function registerPage(): string {
  return `
  <section 
  class="mx-auto w-full max-w-sm"
  aria-labelledby="register-heading"
  >
    <h1 id="register-heading" class="text-center text-3xl font-bold text-[#2c2c2c]">
      Register
    </h1>

    <form 
    class="mt-8"
    data-register-form
    novalidate
    >
      <div class="space-y-5 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label for="register-name"
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Username
          </label>

          <input
          id="register-name"
          name="name"
          type="text"
          autocomplete="username"
          placeholder="Choose a username"
          required
          aria-describedby="register-name-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />
          <p
          id="register-name-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="name"
          aria-live="polite"
          ></p>

          <p class="mt-1 text-xs text-gray-600">
          Your username cannot contain spaces.
          </p>
        </div>


        <div>
          <label for="register-email" 
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Email
          </label>

          <input
          id="register-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="Enter your email"
          required
          aria-describedby="register-email-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="register-email-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="email"
          aria-live="polite"
          ></p>
        </div>

        <div>
          <label for="register-password"
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Password
          </label>

          <input
          id="register-password"
          name="password"
          type="password"
          autocomplete="new-password"
          placeholder="Enter your password"
          required
          minlength="8"
          aria-describedby="register-password-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="register-password-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="password"
          aria-live="polite"
          ></p>
        </div>

        <div>
          <label for="register-confirm-password"
          class="block text-sm font-medium text-[#2c2c2c]"
          >
            Confirm Password
          </label>
          <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Confirm your password"
          required
          aria-describedby="register-confirm-password-error"
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a6a]"
          />

          <p
          id="register-confirm-password-error"
          class="mt-2 text-sm text-[#C95A5A]"
          data-error-for="confirmPassword"
          aria-live="polite"
          ></p>
        </div>

      </div>

      <p
      class="mt-4 text-center text-sm text-[#C95A5A]"
      data-register-error
      role="alert"
      aria-live="assertive"
      ></p>

      <button
      type="submit"
      class="mx-auto mt-6 block rounded-lg bg-[#2d6a6a] px-10 py-3 font-semibold text-white transition-colors hover:bg-[#245656] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#d1d5db] disabled:text-[#4b5563] disabled:hover:bg-[#d1d5db]"
      data-register-submit
      >
        Register
      </button>
    </form>

    <p class="mt-6 text-center leading-tight text-[#2c2c2c]">
    Already have an account?
    <br />
    Login
    <a
    href="#/login"
    class="font-medium text-[#2d6a6a] underline underline-offset-2"
    >here</a>
    </p>
  </section>
  `;
}

/** * Initializes the register page by setting up event listeners for the registration form submission. It handles form validation, displays error messages for invalid inputs, and manages the registration process by calling the registerUser function. If the registration is successful, it automatically logs in the user and saves the authentication token. If there are any errors during registration or login, it displays an appropriate error message.
 */
export function initRegisterPage(): void {
  const form = document.querySelector<HTMLFormElement>("[data-register-form]");

  if (!form) {
    return;
  }

  const nameInput = form.elements.namedItem("name");
  const emailInput = form.elements.namedItem("email");
  const passwordInput = form.elements.namedItem("password");
  const confirmPasswordInput = form.elements.namedItem("confirmPassword");

  const nameError = form.querySelector<HTMLParagraphElement>(
    "[data-error-for='name']",
  );

  const emailError = form.querySelector<HTMLParagraphElement>(
    "[data-error-for='email']",
  );

  const passwordError = form.querySelector<HTMLParagraphElement>(
    "[data-error-for='password']",
  );

  const confirmPasswordError = form.querySelector<HTMLParagraphElement>(
    "[data-error-for='confirmPassword']",
  );

  const registerError = form.querySelector<HTMLParagraphElement>(
    "[data-register-error]",
  );

  const submitButton = form.querySelector<HTMLButtonElement>(
    "[data-register-submit]",
  );

  if (
    !(nameInput instanceof HTMLInputElement) ||
    !(emailInput instanceof HTMLInputElement) ||
    !(passwordInput instanceof HTMLInputElement) ||
    !(confirmPasswordInput instanceof HTMLInputElement) ||
    !nameError ||
    !emailError ||
    !passwordError ||
    !confirmPasswordError ||
    !registerError ||
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

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    registerError.textContent = "";

    nameInput.removeAttribute("aria-invalid");
    emailInput.removeAttribute("aria-invalid");
    passwordInput.removeAttribute("aria-invalid");
    confirmPasswordInput.removeAttribute("aria-invalid");

    const username = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let hasValidationErrors = false;

    if (!username) {
      nameError.textContent = "Please enter a username.";
      nameInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (/\s/.test(username)) {
      nameError.textContent = "Username cannot contain spaces.";
      nameInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (!email) {
      emailError.textContent = "Please enter your email.";
      emailInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (!emailInput.validity.valid) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (!email.toLowerCase().endsWith("@stud.noroff.no")) {
      emailError.textContent = "Email must be a stud.noroff.no address.";
      emailInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (!password) {
      passwordError.textContent = "Please enter a password.";
      passwordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (password.length < 8) {
      passwordError.textContent =
        "Password must be at least 8 characters long.";
      passwordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (!confirmPassword) {
      confirmPasswordError.textContent = "Please confirm your password.";
      confirmPasswordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      confirmPasswordInput.setAttribute("aria-invalid", "true");
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      const firstInvalidInput = form.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("[aria-invalid='true']");

      firstInvalidInput?.focus();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Registering...";

    let registrationSuccessful = false;

    try {
      await registerUser({
        name: username,
        email,
        password,
      });

      registrationSuccessful = true;

      const user = await loginUser({
        email,
        password,
      });

      const authSaved = saveAuth(user.accessToken, {
        name: user.name,
        email: user.email,
      });

      if (!authSaved) {
        window.location.hash = "#/login?registered=true&autoLoginFailed=true";
        return;
      }

      window.location.hash = "#/?registered=true";
    } catch (error) {
      if (registrationSuccessful) {
        window.location.hash = "#/login?registered=true&autoLoginFailed=true";
        return;
      }

      registerError.textContent =
        error instanceof Error
          ? error.message
          : "Unable to register. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Register";
      isSubmitting = false;
    }
  });
}
