import { locationRepository } from '../repositories/location';
import { LocationAttributes } from '../../../models/Location';
import { locationFilesRepository}  from '../repositories/locationFiles';

export const locationService = {
  async createLocation(data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    const location = await locationRepository.create(data);
    await locationFilesRepository.associateFilesWithLocation(data.photos || [], location.id);
    return location;
  },

  async getAllLocations(userId: string) {
    return locationRepository.findAllByUser(userId);
  },

  async getLocationById(id: string, userId: string) {
    return locationRepository.findById(id, userId);
  },

  async updateLocation(id: string, userId: string, data: Partial<LocationAttributes>) {

    try {
      const location = await locationRepository.findById(id, userId);
      if (!location) {
        throw new Error('Location not found');
      }

      // remove photos from uploads if photos are removed from location
      // TODO - Promise mapping for better performance
      // TODO - move to a background job for better performance
      if (data.photos && location.photos) {
        const photosToRemove = location.photos.filter(photo => !data.photos!.includes(photo));
        const fs = await import('fs');
        const path = await import('path');
        for (const photo of photosToRemove) {
          const photoPath = path.join(import.meta.dirname, '../../../../uploads', photo);
          if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
          }

          await locationFilesRepository.deleteByFilename(photo);
        }
      }

      await locationFilesRepository.associateFilesWithLocation(data.photos || [], id);

      return locationRepository.update(id, userId, data);

    } catch (error) {
      throw error;
    }
  },

  async deleteLocation(id: string, userId: string) {
    return locationRepository.delete(id, userId);
  },

  async getActiveParking(userId: string) {
    return locationRepository.findActiveParking(userId);
  },

  async stopParking(id: string, userId: string) {
    return locationRepository.update(id, userId, { isActive: false });
  },

  async saveLocationFiles(filenames: string[], files: Express.Multer.File[]) {
    return locationFilesRepository.saveLocationFiles(filenames, files);
  },

};
