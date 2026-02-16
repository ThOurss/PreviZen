import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, API_KEY, DB_DIALECT, JWT_SECRET } from './env.config.js';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: DB_DIALECT,
    port: DB_PORT,
    dialectOptions: {
        multipleStatements: true
    }
});

export const KEY_API = API_KEY;
export const SECRET_JWT = JWT_SECRET;