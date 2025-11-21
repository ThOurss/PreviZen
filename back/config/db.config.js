import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './env.config.js';

export const HOST = DB_HOST;
export const USER = DB_USER;
export const PASSWORD = DB_PASSWORD;
export const DB = DB_NAME;
export const dialect = "mysql";
export const port = DB_PORT;
