import Location, { LocationAttributes } from '../../models/Location';

export const locationRepository = {
  async create(data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    return Location.create(data);
  },

  async findAllByUser(userId: string): Promise<Location[]> {
    return Location.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  },

  async findById(id: string, userId: string): Promise<Location | null> {
    return Location.findOne({ where: { id, userId } });
  },

  async update(id: string, userId: string, data: Partial<LocationAttributes>): Promise<Location | null> {
    const location = await Location.findOne({ where: { id, userId } });
    if (!location) return null;
    return location.update(data);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const deleted = await Location.destroy({ where: { id, userId } });
    return deleted > 0;
  },

  async findActiveParking(userId: string): Promise<Location | null> {
    return Location.findOne({
      where: { userId, type: 'parking', isActive: true },
      order: [['createdAt', 'DESC']],
    });
  },
};
