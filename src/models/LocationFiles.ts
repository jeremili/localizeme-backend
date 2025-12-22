import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LocationFilesAttributes {
  uuid: string;
  locationId?: string;
  filename: string;
  fileSize?: number;
  fileMimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface LocationFilesCreationAttributes extends Optional<LocationFilesAttributes, 'uuid' | 'filename' | 'createdAt' | 'updatedAt'> {}

class LocationFiles extends Model<LocationFilesAttributes, LocationFilesCreationAttributes> implements LocationFilesAttributes {
  public uuid!: string;
  public locationId?: string;
  public filename!: string;
  public fileSize?: number;
  public fileMimeType?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
}
LocationFiles.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fileMimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'location_files',
    timestamps: true,
  }
);

export default LocationFiles;
