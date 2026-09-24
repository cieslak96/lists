export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const query = typeof request.query.query === 'string' ? request.query.query.trim() : '';
  const apiKey = process.env.TMDB_API_KEY;

  if (!query) {
    return response.status(400).json({ error: 'A search query is required.' });
  }

  if (!apiKey) {
    return response.status(503).json({ error: 'TMDB_API_KEY is not configured on Vercel.' });
  }

  try {
    const url = new URL('https://api.themoviedb.org/3/search/multi');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('query', query);
    url.searchParams.set('include_adult', 'false');

    const tmdbResponse = await fetch(url);
    if (!tmdbResponse.ok) {
      return response.status(502).json({ error: 'TMDB search failed.' });
    }

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return response.status(200).json(await tmdbResponse.json());
  } catch {
    return response.status(502).json({ error: 'Could not reach TMDB.' });
  }
}
