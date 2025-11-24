import Sequelize from 'sequelize';
import { DB, USER, PASSWORD, HOST, dialect, port } from '../config/db.config.js';

const sequelize = new Sequelize('', USER, PASSWORD, {
    host: HOST,
    dialect,
    port,
});

export async function createDatabase() {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);
        console.log(`✅ Base de données "${DB}" créée ou déjà existante`);
    } catch (err) {
        console.error('❌ Impossible de créer la base de données :', err);
    } finally {
        await sequelize.close();
    }
}
