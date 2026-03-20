# Contributing to stack-api

Thanks for taking the time to contribute! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/30jannik06/stack-api.git
cd stack-api
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure

```
stack-api/
├── app/
│   ├── api/
│   │   ├── discord/    # Discord endpoints
│   │   ├── github/     # GitHub endpoints
│   │   ├── npm/        # NPM endpoints
│   │   ├── twitch/     # Twitch endpoints
│   │   ├── steam/      # Steam endpoints
│   │   └── health/     # Health check
│   ├── discord/        # Discord preview page
│   ├── github/         # GitHub preview page
│   ├── npm/            # NPM preview page
│   ├── twitch/         # Twitch preview page
│   ├── steam/          # Steam preview page
│   └── page.tsx        # Landing page
├── .env.example
├── vercel.json
└── next.config.mjs
```

## Adding a New Service

1. Create the API route under `app/api/<service>/`
2. Create the preview page under `app/<service>/page.tsx`
3. Add the endpoints to the landing page `app/page.tsx`
4. Update `.env.example` if new environment variables are needed
5. Update `README.md` with the new endpoints

## Guidelines

- **TypeScript** – all files must be `.ts` or `.tsx`, no `any` where avoidable
- **Error handling** – every route must return proper error responses with `{ error: string }`
- **Cache headers** – always set `Cache-Control` on responses
- **Formatting** – run `npm run format` before committing

## Scripts

| Command          | Description          |
| ---------------- | -------------------- |
| `npm run dev`    | Start dev server     |
| `npm run build`  | Build for production |
| `npm run lint`   | Run ESLint           |
| `npm run format` | Run Prettier         |

## Pull Request Checklist

- [ ] TypeScript types correct
- [ ] Error handling on all code paths
- [ ] `Cache-Control` header set
- [ ] `.env.example` updated if needed
- [ ] `README.md` updated
- [ ] `npm run lint` passes
- [ ] `npm run format` run

## Reporting Bugs

Open an issue using the **Bug Report** template.

## Suggesting Features

Open an issue using the **Feature Request** template.
