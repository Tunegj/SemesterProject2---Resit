## AI LOG

## 17.06.2026

Problem: Couldn't get the API to work, so used ChatGPT to find the error.

Outcome: I had the wrong URL in the .env file, and also I had a typo in the id of the element I was testing with. After fixing these, the API calls worked as expected.

## 20.06.2026

Problem: Spent hours trying to figure out why Tailwind wasn't working. Finally reached the conclusion that the Tailwind v4 + Vite v8 setup was not processing Tailwind correctly in the project.

Outcome: I switched to Tailwind v3 and configured tailwind.config.js to include the correct content paths,
index.css to import Tailwind's base, components, and utilities and removed import tailwindcss from @tailwindcss/vite from vite.config.ts.
After these changes, Tailwind started working as expected.

## 21.06.2026

Problem: Trouble shooting why my hamb.menu was not working, tested with console logs to see if the event listener was being added and if the click event was being registered -
when I saw initHeader was doing its job correctly I pasted the file into ChatGPT and asked for help.

Outcome: I had hidden both in the HTML element and in the CSS, so when I removed the hidden class from the CSS, the hamburger menu started working as expected.

## 25.06.2026

Problem: Couldn't get my logoutSuccessMessage to work, so I pasted the code into ChatGPT and asked for help.

Outcome: I had put the window.location.hash = "#/login?loggedOut=true"; after logout() in the logout event listener,
which caused the page to reload before the message could be displayed. I moved the line before logout() and now the message is displayed correctly.

## 02.07.2026

Problem: Creating a new pet returned a "session expired" error, even though I was logged in.
I pasted the code into ChatGPT and asked for help.

Outcome: I had forgotten to include the Authorization header to the createPet function in pets.ts.
I was also unable to access Noroff's API Key Tool because I had
forgotten my password and was waiting for a password reset response.
ChatGPT explained the available options, including using an existing valid API key previously issued to me,
provided it remained private and its use complied with the API and course requirements.
I used my existing API key and added the Authorization header to the createPet function, which fixed the problem.

## 08.07.2026

Problem: A black outline around the main content kept appearing when I redirected routes. Wasn't sure why, so I pasted the code into ChatGPT and asked for help.
Outcome: I had put focus:outline-none on the main element, which fixed the problem.

## 10.07.2026

Asked chat gpt to revise my JSDOCs, looked over its suggestions and implemented the changes I considered appropriate.
I also asked it to look over my indentations in the HTML code, as Prettier does not automatically indent HTML code correctly, and it suggested some changes I implemented.

## 10.07.2026

Problem: The deployed GitHub Pages returned 404 errors for JS, CSS and favicon files. I pasted the console to Chat GPT and asked for help.
There was a typo in the name of vite.config.ts, and Github Pages was using an older deployment workflow.
Outcome: Renamed the config file, changed the GitHub Pages deployment source to GitHub Actions. Prepared a new workflow to build the project and deploy the dist folder correctly.
After these changes, the project was deployed correctly and the 404 errors were gone.

## 11.07.2026

Problem: Asked ChatGPT to review my README.md and suggest improvements and make sure nothing was left out.
Outcome: Implemented some suggestions that I considered more professional and added some information about the project that I had forgotten to include.
