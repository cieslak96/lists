# Little List

A shared lists website for collecting places, plans, memories, reviews, and photos. The interface is in English. Lists and uploads are stored in this browser with `localStorage`.

## Run locally

Install the dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`) to open in your browser.

Series search uses the public TVmaze search API and includes a TVmaze attribution link. For movie search and TMDB's combined movie/series results, create an API key at [the TMDB developer site](https://developer.themoviedb.org/docs/getting-started), then paste it into the optional key field in the movie search dialog. It is saved only in this browser's local storage. Without a TMDB key, series search and manual title entry still work. Data is local to the browser and is not shared between devices yet.
