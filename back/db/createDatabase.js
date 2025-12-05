import mysql from 'mysql2/promise'; // On utilise le driver directement
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/env.config.js'

export async function createDatabase() {
    try {
        // 1. On se connecte au SERVEUR MySQL (sans préciser de BDD)
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT
        });

        // 2. On crée la base si elle n'existe pas
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);

        console.log(`✅ Base de données "${DB_NAME}" vérifiée/créée avec succès.`);

        // 3. On ferme cette connexion temporaire
        await connection.end();

    } catch (err) {
        console.error('❌ Erreur critique lors de la création de la BDD :', err);
        process.exit(1); // On arrête tout si on ne peut pas créer la base
    }
}