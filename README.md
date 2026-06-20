# SemesterProject2---Resit

## AI LOG

17.06.2026: Couldn't get the API to work, so used ChatGpt to find the error.
outcome: I had the wrong URL in the .env file, and also I had a typo in the id of the element I was testing with. After fixing these, the API calls worked as expected.

20.06.2026: Spent hours trying to figure out why Tailwind wasn't working. Finally reached the conclusion that the Tailwind v4 + Vite v8 setup was not processing Tailwind correctly in the project.
Fix: I switched to Tailwind v3 and configured tailwind.config.js to include the correct content paths, index.css to import Tailwind's base, components, and utilities and removed import tailwindcss from @tailwindcss/vite from vite.config.ts. After these changes, Tailwind started working as expected.
