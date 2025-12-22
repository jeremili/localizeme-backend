import { Sequelize } from 'sequelize';
import path from 'path';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(import.meta.dirname, '../../data/localizeme.sqlite'),
  logging: false,
  dialectOptions: {
    // Enable foreign keys in SQLite
    foreignKeys: true,
  },
});

export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Temporarily disable foreign keys for schema alterations
    await sequelize.query('PRAGMA foreign_keys = OFF;');

    await sequelize.sync({ alter: true });

    // Re-enable foreign keys after sync
    await sequelize.query('PRAGMA foreign_keys = ON;');

    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
