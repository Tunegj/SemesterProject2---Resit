export function loginPage(): string {
  return `
  <section 
  class="mx-auto w-full max-w-sm"
  aria-labelledby="login-heading"
    <h1 id="login-heading" class="text-center text-3xl font-bold text-[#2c2c2c]">
      Login
    </h1>

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
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-[#2d6a6a]"
          />

          <p
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
          class="mt-2 w-full rounded-md border border-[#2d6a6a] px-3 py-3 text-[#2c2c2c] shadow-sm focus:outline-none focus:ring-[#2d6a6a]"
          />

          <p
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
      class="mx-auto mt-6 block rounded-lg bg-[#2d6a6a] px-10 py-3 font-semibold text-white transition-colors hover:bg-[#245656] focus:outline-none focus:ring-2 focus:ring-[#2d6a6a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
