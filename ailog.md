## AI LOG

17.06.2026: Couldn't get the API to work, so used ChatGpt to find the error.
outcome: I had the wrong URL in the .env file, and also I had a typo in the id of the element I was testing with. After fixing these, the API calls worked as expected.

20.06.2026: Spent hours trying to figure out why Tailwind wasn't working. Finally reached the conclusion that the Tailwind v4 + Vite v8 setup was not processing Tailwind correctly in the project.
Fix: I switched to Tailwind v3 and configured tailwind.config.js to include the correct content paths, index.css to import Tailwind's base, components, and utilities and removed import tailwindcss from @tailwindcss/vite from vite.config.ts. After these changes, Tailwind started working as expected.

21.06.2026: Trouble shooting why my hamb.menu was not working, tested with console logs to see if the event listener was being added and if the click event was being registered - when I saw initHeader was doing its job correctly I pasted the file into ChatGPT and asked for help.
Outcome: I had hidden both in the HTML element and in the CSS, so when I removed the hidden class from the CSS, the hamburger menu started working as expected.

25.06.2026:
Couldn't get my logoutSuccessMessage to work, so I pasted the code into ChatGPT and asked for help.
Outcome: I had put the window.location.hash = "#/login?loggedOut=true"; after logout() in the logout event listener, which caused the page to reload before the message could be displayed. I moved the line before logout() and now the message is displayed correctly.
