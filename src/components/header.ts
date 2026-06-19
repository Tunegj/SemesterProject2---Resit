import { logo } from "./logo";

export function header() {
  return `
    <header class="border-b border-gray-200"> 
        <nav aria-label="Main navigation">
            ${logo()}

            <button type="button" aria-label="Open menu" >
             ☰
            </button>

            <ul>
                <li><a href = "#/">Home</a></li>
                <li><a href = "#/login">Login</a></li>
                <li><a href = "#/register">Register</a></li>
            </ul>
        </nav>
    </header>
    `;
}
