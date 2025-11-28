import { createDatabase } from './db/createDatabase.js';
import { Sequelize } from 'sequelize';
import { DB, USER, PASSWORD, HOST, dialect, port, KEY_API } from './config/db.config.js';
//import UserModel from './models/user.model.js';
import express from "express";
import weatherRoutes from "./routes/routesAPI.js";

import cors from "cors";


const app = express();
app.use(cors()); // autorise toutes les origines (pour dev)
app.use(express.json());

app.use("/api", weatherRoutes);

app.listen(5000, () => console.log("Serveur sur 5000"));


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
