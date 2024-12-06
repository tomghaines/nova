<div align="center">

# birdy.ai
![Static Badge](https://img.shields.io/badge/Next.js%20-%20%23000000?style=for-the-badge&logo=nextdotjs&logoColor=%23ffffff&link=https%3A%2F%2Fnextjs.org%2F)
![React](https://img.shields.io/badge/react-%2320232a.svg?link=https://react.dev/&style=for-the-badge&logo=react&logoColor=%2361DAFB)![Static Badge](https://img.shields.io/badge/shadcn%20-%20%23212121?style=for-the-badge&logo=shadcnui&link=https%3A%2F%2Fui.shadcn.com%2F)![Static Badge](https://img.shields.io/badge/TypeScript%20-%20%233178C6?style=for-the-badge&logo=typescript&logoColor=%23ffffff&link=https%3A%2F%2Fwww.typescriptlang.org%2F)![Static Badge](https://img.shields.io/badge/Vitest%20-%20%23ACD268?style=for-the-badge&logo=vitest&logoColor=%23ffffff&link=https%3A%2F%2Fvitest.dev%2F)![Static Badge](https://img.shields.io/badge/tailwindcss%20-%20%2338B2AC?style=for-the-badge&logo=tailwindcss&logoColor=%23ffffff&link=https%3A%2F%2Ftailwindcss.com%2F)![Static Badge](https://img.shields.io/badge/Supabase%20-%20%233ECF8E?style=for-the-badge&logo=supabase&logoColor=%23ffffff&link=https%3A%2F%2Fsupabase.com%2F)

</div>

## Getting Started

### Installation

1. Clone the Repository:

```bash
git clone https://github.com/kayyueth/birdy_ai
cd birdy_ai
```

2. Install Dependencies:

```bash
npm install
```

### Environment Variables

To configure the application, create and populate the environment variables:

1. Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

2. Populate the new `.env.local` file with the following variables:

| Variable                        | Description                             |
| ------------------------------- | ----------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase Project URL.              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project API key.          |
| `OPENAI_KEY`                    | Your OpenAI API key.                    |
| `APIFY_TOKEN `                  | Your Apify API token.                   |
| `COINDAR_API `                  | Your CoinDar API URL with access token. |
| `MAILCHIMP_API_KEY `            | Your MailChimp API key.                 |
| `MAILCHIMP_SERVER_PREFIX`       | Your MailChimp server prefix.           |

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

## Contributors
- George Burt • [GitHub](https://github.com/georgeeburt) • [LinkedIn](https://www.linkedin.com/in/george-burt/)
- Tom Haines • [GitHub](https://github.com/tomghaines) • [LinkedIn](https://www.linkedin.com/in/tom-haines-5755462b4/)
- Kay Yu • [GitHub](https://github.com/kayyueth)
- Mel Zhou • [GitHub](http://github.com/waterlily-lychi-zhou)