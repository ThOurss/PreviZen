import { createDatabase } from './db/createDatabase.js';
import { Sequelize } from 'sequelize';
import { DB, USER, PASSWORD, HOST, dialect, port } from './config/db.config.js';
//import UserModel from './models/user.model.js';

async function startApp() {
    await createDatabase();  // création de la BDD si elle n'existe pas

    // connexion à la BDD nouvellement créée
    const sequelize = new Sequelize(DB, USER, PASSWORD, { host: HOST, dialect, port });

    // initialisation des modèles
    //UserModel(sequelize);

    // synchronisation des tables
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');
}

startApp();
