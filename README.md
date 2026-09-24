# Little List

A shared lists website for collecting places, plans, memories, reviews, and photos. The interface is in English. Signed-in users share one Supabase-backed list state.

## Supabase setup

In the Supabase Dashboard for this project, open **SQL Editor** and run [`supabase-setup.sql`](./supabase-setup.sql). The app uses email and password, and both the app and database restrict access to `cieslak.96@proton.me` and `christopher.ry.lewis@gmail.com`. Email confirmation is enabled in Auth settings. Supabase's default email sender only delivers to project team members and has a low rate limit; to send signup confirmation emails to other addresses, configure custom SMTP in Supabase Auth settings.

On the first sign-in, if this browser already has saved lists, the app copies them into the shared database. Once shared data exists, it is loaded from Supabase on sign-in. The browser still keeps a local cached copy. Photos currently live in that JSON state, so large photo collections may eventually need Supabase Storage.

## Run locally

Install the dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`) to open in your browser.

Series search uses the public TVmaze search API and includes a TVmaze attribution link. For shared movie and series search on Vercel, add an environment variable named `TMDB_API_KEY` in **Project Settings → Environment Variables**, then redeploy. The `/api/tmdb-search` Vercel Function calls TMDB server-side, so the key stays out of the public source and browser bundle. Create a key at [the TMDB developer site](https://developer.themoviedb.org/docs/getting-started). For local development, you can paste a key into the optional field in the movie search dialog; that saves it in that browser only. Without a TMDB key, series search and manual title entry still work.
