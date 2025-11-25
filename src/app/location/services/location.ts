import { locationRepository } from '../repositories/location';
import { LocationAttributes } from '../../../models/Location';

export const locationService = {
  async createLocation(data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return locationRepository.create(data);
  },

  async getAllLocations(userId: string) {
    return locationRepository.findAllByUser(userId);
  },

  async getLocationById(id: string, userId: string) {
    return locationRepository.findById(id, userId);
  },

  async updateLocation(id: string, userId: string, data: Partial<LocationAttributes>) {
    return locationRepository.update(id, userId, data);
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
};
