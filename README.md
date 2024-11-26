# birdy_ai

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/kayyueth/birdy_ai
cd birdy_ai
```

2. Install Dependencies:

```bash
npm install
```

## Environment Variables

To configure the application, create and populate the environment variables:

1.	Create a `.env.local` file in the root directory:
```bash
touch .env.local
```

2. Populate the new `.env.local` file with the following variables:

| Variable                         | Description                      |
| ---------------------------------| -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Your Supabase Project URL.       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Your Supabase Project API Key.   |

## Running the Project

Start the development server:
```bash
npm run dev
```

You can access the appplication in your browser at http://localhost:3000.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Lint the code with ESLint.
- `npm run format`: Format the code using Prettier.
- `npm run test`: Run Vitest testing suite.
- `npm run test:full`: Run the Vitest testing suite in verbose mode, showing all test names and passing tests.
- `npm run test:ui`: Run the Vitest interactive testing UI.
- `npm run test:watch`: Run Vitest testing suite in watch mode.
- `npm run test:coverage`: Run the Vitest testing suite with coverage reporting.