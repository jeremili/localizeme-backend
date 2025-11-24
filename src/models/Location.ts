import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LocationAttributes {
  id: string;
  userId: string;
  type: 'parking' | 'magasin' | 'restaurant' | 'cafe' | 'bar' | 'hotel' | 'pharmacie' | 'station-service' | 'autre';
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  comment?: string;
  photos: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LocationCreationAttributes extends Optional<LocationAttributes, 'id' | 'name' | 'address' | 'rating' | 'comment' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'parking' | 'magasin' | 'restaurant' | 'cafe' | 'bar' | 'hotel' | 'pharmacie' | 'station-service' | 'autre';
  public name?: string;
  public address?: string;
  public latitude!: number;
  public longitude!: number;
  public rating?: number;
  public comment?: string;
  public photos!: string[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('parking', 'magasin', 'restaurant', 'cafe', 'bar', 'hotel', 'pharmacie', 'station-service', 'autre'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photos: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'locations',
    timestamps: true,
  }
);

export default Location;
