import { getAuthenticatedUser } from "../services/auth.ts";
import { escapeHtml } from "../utils/escapeHtml.ts";

export function profilePage(): string {
  const user = getAuthenticatedUser();

  const name = escapeHtml(user?.name ?? "Not available");
  const email = escapeHtml(user?.email ?? "Not available");

  return `
  <section aria-labelledby="account-heading">
    <header class="mb-8"> 
      <h1 
        id="account-heading" 
        class="text-3xl font-bold text-[#2d6a6a]"
        >
          Account
        </h1>

        <p class="mt-3 text-[#2c2c2c]">
          View your account information below. 
        </p>
    </header>

    <div
      class="max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-md"
    >
      <dl class="space-y-6">
        <div>
          <dt class="font-semibold text-[#2d6a6a]">
            Name
          </dt>

          <dd class="mt-1 text-[#2c2c2c]">
            ${name}
          </dd>
        </div>

        <div>
          <dt class="font-semibold text-[#2d6a6a]">
            Email
          </dt>
          
          <dd class="mt-1 text-[#2c2c2c]">
            ${email}
          </dd>
        </div>
      </dl>
    </div>
  </section>
  `;
}
