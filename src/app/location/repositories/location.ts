import Location, { LocationAttributes } from '../../../models/Location';
import LocationFiles from '../../../models/LocationFiles';


export const create = async (data: Omit<LocationAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
  return Location.create(data);
};

export const findAllByUser = async (userId: string): Promise<Location[]> => {
  return Location.findAll({
    where: { userId },
    include: [
      {
        model: LocationFiles,
        as: 'files',
        attributes: ['filename']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const findById = async (id: string, userId: string): Promise<Location | null> => {
  return Location.findOne({
    where: { id, userId },
    include: [
      {
        model: LocationFiles,
        as: 'files',
        attributes: ['filename']
      }
    ]
  });
};

export const update = async (id: string, userId: string, data: Partial<LocationAttributes>): Promise<Location | null> => {
  const location = await Location.findOne({ where: { id, userId } });
  if (!location) return null;
  return location.update(data);
};

export const deleteLocation = async (id: string, userId: string): Promise<boolean> => {
  const deleted = await Location.destroy({ where: { id, userId } });
  return deleted > 0;
};

export const findActiveParking = async (userId: string): Promise<Location | null> => {
  return Location.findOne({
    where: { userId, type: 'parking', isActive: true },
    order: [['createdAt', 'DESC']],
  });
};
