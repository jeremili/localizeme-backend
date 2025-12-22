import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';
import { locationService } from '../services/location';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(import.meta.dirname, '../../../../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv7()}${ext}`);
  },
});

const upload = multer({ storage });

const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error('User ID is required');
  }
  return userId;
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const locations = await locationService.getAllLocations(userId);
    res.json(locations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch locations';
    res.status(400).json({ error: message });
  }
});

router.get('/active-parking', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const parking = await locationService.getActiveParking(userId);
    res.json(parking);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch active parking';
    res.status(400).json({ error: message });
  }
});

router.get('/tags', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const locations = await locationService.getAllLocations(userId);
    const tagsSet = new Set<string>();
    locations.forEach(location => {
      location.tags?.forEach(tag => tagsSet.add(tag));
    });
    res.json(Array.from(tagsSet));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tags';
    res.status(400).json({ error: message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const location = await locationService.getLocationById(req.params.id, userId);
    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch location';
    res.status(400).json({ error: message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const location = await locationService.createLocation({ ...req.body, userId });
    res.status(201).json(location);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create location';
    res.status(400).json({ error: message });
  }
});

router.post('/upload', upload.array('photos', 10), async (req: Request, res: Response) => {
  try {
    getUserId(req);
    const files = req.files as Express.Multer.File[];
    const filenames = files.map(f => f.filename);

    await locationService.saveLocationFiles(filenames, files);

    res.json({ filenames });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload photos';
    res.status(400).json({ error: message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const location = await locationService.updateLocation(req.params.id, userId, req.body);
    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update location';
    res.status(400).json({ error: message });
  }
});

router.put('/:id/stop', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const location = await locationService.stopParking(req.params.id, userId);
    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to stop parking';
    res.status(400).json({ error: message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const deleted = await locationService.deleteLocation(req.params.id, userId);
    if (!deleted) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete location';
    res.status(400).json({ error: message });
  }
});

export default router;
