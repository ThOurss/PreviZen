import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, API_KEY, DB_DIALECT } from './env.config.js';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    dialectOptions: {
        multipleStatements: true
    }
});

// export const HOST = DB_HOST;
// export const USER = DB_USER;
// export const PASSWORD = DB_PASSWORD;
// export const DB = DB_NAME;
// export const dialect = "mysql";
// export const port = DB_PORT;
export const KEY_API = API_KEY;