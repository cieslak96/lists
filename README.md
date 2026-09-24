# Little List

A shared lists website for collecting places, plans, memories, reviews, and photos. The interface is in English. Lists and uploads are stored in this browser with `localStorage`.

## Run locally

Install the dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`) to open in your browser.

Series search uses the public TVmaze search API and includes a TVmaze attribution link. For shared movie and series search on Vercel, add an environment variable named `TMDB_API_KEY` in **Project Settings → Environment Variables**, then redeploy. The `/api/tmdb-search` Vercel Function calls TMDB server-side, so the key stays out of the public source and browser bundle. Create a key at [the TMDB developer site](https://developer.themoviedb.org/docs/getting-started). For local development, you can paste a key into the optional field in the movie search dialog; that saves it in that browser only. Without a TMDB key, series search and manual title entry still work. Lists and memories remain local to each browser and are not synced yet.
