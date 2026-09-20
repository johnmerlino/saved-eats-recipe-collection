# Saved Eats — Recipe Collection

Every recipe from the Instagram **Eats** saved collection, in one searchable app.

- **116 original creator recipes** — taken straight from post captions or the creator's own website. Never invented.
- **226 copycat reconstructions** — clearly badged, each with links to similar published recipes. Creative reconstructions live only here, never mixed with creator recipes.
- **3 archived posts** that couldn't become recipes (kept for browsing with their original Instagram links).

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)-style components
- [Supabase](https://supabase.com/) (Postgres) — the `recipes` table, seeded from `seed/recipes.csv`
- Deployed on [Vercel](https://vercel.com/)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

## Database

Schema lives in `seed/schema.sql`; the full seed data in `seed/recipes.csv`
(generated from the original dataset by `seed/build_seed.py`).
