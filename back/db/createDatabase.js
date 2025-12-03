// import Sequelize from 'sequelize';
// import { DB, USER, PASSWORD, HOST, dialect, port } from '../config/db.config.js';

// const sequelize = new Sequelize('', USER, PASSWORD, {
//     host: HOST,
//     dialect,
//     port,
// });
import { sequelize } from "../config/db.config.js";

export async function createDatabase() {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${sequelize.config.database}\`;`);
        console.log(`✅ Base de données "${sequelize.config.database}" créée ou déjà existante`);
    } catch (err) {
        console.error('❌ Impossible de créer la base de données :', err);
    }
}
