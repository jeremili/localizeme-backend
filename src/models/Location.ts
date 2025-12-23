import { DataTypes, Model, Optional } from 'sequelize';
import { v7 as uuidv7 } from 'uuid';
import { sequelize } from '../config/database';
import LocationFiles from './LocationFiles';

export interface LocationAttributes {
  id: string;
  userId: string;
  type: string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  tags?: string[];
  comment?: string;
  isActive: boolean;
  files?: LocationFiles[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface LocationCreationAttributes extends Optional<LocationAttributes, 'id' | 'name' | 'address' | 'rating' | 'comment' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: string;
  public userId!: string;
  public type!: string;
  public name?: string;
  public address?: string;
  public latitude!: number;
  public longitude!: number;
  public rating?: number;
  public tags?: string[];
  public comment?: string;
  public isActive!: boolean;
  public files?: LocationFiles[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv7(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
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
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
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

// Associations
Location.hasMany(LocationFiles, {
  foreignKey: 'locationId',
  as: 'files',
});

export default Location;
