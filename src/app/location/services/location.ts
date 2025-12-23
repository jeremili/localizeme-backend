import { locationRepository } from '../repositories/location';
import { LocationAttributes } from '../../../models/Location';
import { locationFilesRepository}  from '../repositories/locationFiles';

export const locationService = {
  async createLocation(data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    const location = await locationRepository.create(data);
    if (data.files && data.files.length > 0) {
      const filenames = data.files.map((file: { filename: string }) => file.filename);
      await locationFilesRepository.associateFilesWithLocation(filenames, location.id);
    }
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

      // remove files from uploads if files are removed from location
      // TODO - Promise mapping for better performance
      // TODO - move to a background job for better performance
      const files = data.files?.map((file: { filename: string }) => file.filename);
      if (data.files && location.files) {
        const existingFiles = location.files.map((file: { filename: string }) => file.filename);
        const filesToRemove = existingFiles.filter((file: string) => !files?.includes(file));
        const fs = await import('fs');
        const path = await import('path');
        for (const file of filesToRemove) {
          const filePath = path.join(import.meta.dirname, '../../../../uploads', file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          await locationFilesRepository.deleteByFilename(file);
        }
      }

      if (files && files.length > 0) {
        await locationFilesRepository.associateFilesWithLocation(files, id);
      }

      await locationRepository.update(id, userId, data);

      return locationRepository.findById(id, userId);

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
