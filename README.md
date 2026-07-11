# FureverHome

FureverHome is a responsive pet adoption single-page application created for the Noroff Semester Project 2 Resit.

The application allows visitors to browse pets availabel for adoption and view detailed information about each pet.
Registered users can create, edit and delete their own pet listings through protected routes.

The project was built using TypeScript, Vite, Tailwind CSS, a hash-based SPA router and the Noroff Pets API.

## Features

- Browse pets available for adoption
- View detailed information about each pet
- Pagination on the pet listings page
- Register and log in with a Noroff account
- Protected routes for authenticated users
- Create new pet listings
- Edit existing pet listings
- Delete pet listings using an accessible confirmation modal
- View stored account information.
- Responsive navigation with a mobile menu
- Form validation with accessible error messages
- Loading, empty, success and error states
- Keyboard accessible navigation and forms
- Dynamic page titles for SPA routes
- Responsive layouts for mobile, tablet and desktop screens

## Tech Stack

- HTML5 - Semantic page structure
- TypeScript - Applicaton logic and type safety
- Tailwind CSS - Responsive styling and layout
- Vite - Development server and production build tool
- Noroff Pets API - Pet listings and authentication
- Hash-based SPA router - Client-side navigation without a front-end framework
- Iconify - Interface icons
- GitHub Pages - Production deployment
- GitHub Actions - Automated deployment workflow

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Tunegj/SemesterProject2---Resit.git
```

2. Open the project folder

```bash
cd SemesterProject2---Resit
```

3. Install dependencies:

```bash
npm install
```

## Running the Application

Start the local development server:

```bash
npm run dev
```

Vite will display the local development server URL in the terminal. Open the URL in your web browser to view the application.

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root of the project and add the Noroff API base URL:

VITE_API_BASE_URL=https://v2.api.noroff.dev

The application reads this value through:

import.meta.env.VITE_API_BASE_URL

The .env file should not be committed if it contains private or environment-specific information.

## Accessibility

Accessibility is a key consideration in the design and development of FureverHome.

The project includes:

- Semantic HTML structure
- A skip link that moves focus to the main content
- Visible keyboard focus indicators
- Logical keyboard navigation and tab order
- Accessible mobile navigation
- Aria-current for active navigation links
- Accessible form labels and validation messages
- Focus management after SPA navigation
- Focus movement to the first invalid form field
- An accessible delete confirmation modal with focus trapping
- Focus restoration after the modal closes
- Descriptive alternative text for meaningful images
- Sufficient color contrast
- Responsive layouts that support different screeen sizes

The required pages were tested using keyboard-only navigation and WAVE.
Identified accessibility issues were fixed before submission.

## Testing

The app was tested throughout development using both automated tools and manual testing.

Testing included:

- HTML validation
- WAVE accessibility testing
- Lighthouse audits
- Keyboard-only navigation
- Responsice testing across mobile, tablet and desktop screen sizes
- Form validation testing
- Authentication and route protection testing
- API loading, success, empty and error states
- DUplicate submission and deleteion prevention
- Production build and deployment testing

### HTML Validation

All required pages passed HTML validation without errors.
The validatior only reported information maessages about HTML5 self-closing tag syntax.

### Accessibility Testing

The following pages were tested using WAVE:

- Home
- Listings
- Single Pet
- Login
- Register
- Create Pet
- Edit Pet

A contrast issue affecting the adoption status badge over the image was identified and fixed.

Keyboard-only testing was also completed for:

- Skip link navigation
- Desktop and mobile navigation
- Forms and validation
- SPA focus management
- Delete confirmation modal
- Focus trapping and restoration
- Visible focus indicators
- Logical tab order

### Lighthouse

Lighthouse audits produced approximately the following scores:

- Performance: 70-100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Testing screenshots are available in the docs/testing folder.

## AI usage

ChatGPT was used as a learning and development aid throughout the project.

It supported me in tasks such as:

- Explaining concepts and syntax
- Reviewing existing code for accessibility, maintainability and general errors in syntax
- Suggesting small improvements to validation and error handling
- Reviewing README and project documentation

AI generated suggestions were reviewed, adapted, and tested before being added to the project.
I did not use AI to generate any code that was added to the project without first reviewing and testing it.
The final implementation decisions and code remain my own responsibility.

See AI-LOG.md for a detailed log of how I used ChatGPT to help me solve problems and improve my code.

## Deployment

The application is deployed using GitHub Pages and GitHub Actions.

The deployment workflow:

1. Installs the project dependencies
2. Builds the project using Vite
3. Uploads the generated dist folder.
4. Deploys the production build to GitHub Pages.

The Vite configuration includes the repository base path so that JavaScript, CSS, images, and favicon files load correctly on Github Pages.

Before deployment, a production build can be tested locally with:

```bash
npm run build
npm run preview
```

### Live site

[Live site](https://tunegj.github.io/SemesterProject2---Resit/#/)

### Repository

[Repository](https://github.com/Tunegj/SemesterProject2---Resit)

## Author

Tone Gjerde

Noroff Frontend Development student.

[GitHub Profile](https://github.com/Tunegj)
