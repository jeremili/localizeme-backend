import * as locationRepository from '../repositories/location';
import { LocationAttributes } from '../../../models/Location';
import { locationFilesRepository}  from '../repositories/locationFiles';
import { PromiseMap } from '../../../libs/utils';

export const createLocation = async (data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>) => {
  const location = await locationRepository.create(data);
  if (data.files && data.files.length > 0) {
    const filenames = data.files.map((file: { filename: string }) => file.filename);
    await locationFilesRepository.associateFilesWithLocation(filenames, location.id);
  }
  return location;
};
export const getAllLocations = async (userId: string) => {
  return locationRepository.findAllByUser(userId);
};

export const getLocationById = async (id: string, userId: string) => {
  return locationRepository.findById(id, userId);
};

export const updateLocation = async (id: string, userId: string, data: Partial<LocationAttributes>) => {
  try {
    const location = await locationRepository.findById(id, userId);
    if (!location) {
      throw new Error('Location not found');
    }

    // remove files from uploads if files are removed from location
    // TODO - move to a background job for better performance
    const files = data.files?.map((file: { filename: string }) => file.filename);
    if (data.files && location.files) {
      const existingFiles = location.files.map((file: { filename: string }) => file.filename);
      const filesToRemove = existingFiles.filter((file: string) => !files?.includes(file));
      const fs = await import('fs');
      const path = await import('path');
      await PromiseMap(filesToRemove, async (file) => {
        const filePath = path.join(import.meta.dirname, '../../../../uploads', file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await locationFilesRepository.deleteByFilename(file);
      }, { concurrency: 5 });
    }

    if (files && files.length > 0) {
      await locationFilesRepository.associateFilesWithLocation(files, id);
    }

    await locationRepository.update(id, userId, data);

    return locationRepository.findById(id, userId);

  } catch (error) {
    throw error;
  }
};

export const deleteLocation = async (id: string, userId: string) => {
  return locationRepository.deleteLocation(id, userId);
};

export const getActiveParking = async (userId: string) => {
  return locationRepository.findActiveParking(userId);
};

export const stopParking = async (id: string, userId: string) => {
  return locationRepository.update(id, userId, { isActive: false });
};

export const saveLocationFiles = async (filenames: string[], files: Express.Multer.File[]) => {
  return locationFilesRepository.saveLocationFiles(filenames, files);
};
