import { Router, Request, Response } from 'express';

const router = Router();

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'LocalizeMe App/1.0';

/**
 * GET /api/geocoding/search
 * Search for addresses matching a query
 * Query params: q (query string), limit (max results, default 5)
 */
router.get('/search', async (req: Request, res: Response) => {
  const { q, limit = '5' } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geocoding search error:', error);
    const message = error instanceof Error ? error.message : 'Failed to search address';
    res.status(500).json({ error: message });
  }
});

/**
 * GET /api/geocoding/reverse
 * Reverse geocode coordinates to get address
 * Query params: lat (latitude), long (longitude)
 */
router.get('/reverse', async (req: Request, res: Response) => {
  const { lat, long } = req.query;

  if (!lat || !long || typeof lat !== 'string' || typeof long !== 'string') {
    res.status(400).json({ error: 'Query parameters "lat" and "long" are required' });
    return;
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch address';
    res.status(500).json({ error: message });
  }
});

export default router;
