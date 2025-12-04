import { createDatabase } from './db/createDatabase.js';
import express from "express";
import weatherRoutes from "./routes/routesAPI.js";
import userRoutes from "./routes/routesUser.js";
import { User, Role, initRoles, initCivilite, importCountriesSQL } from './models/index.js';
import cors from "cors";
import { sequelize } from './config/db.config.js';

const app = express();
app.use(cors()); // autorise toutes les origines (pour dev)
app.use(express.json());

app.use("/api", weatherRoutes);
app.use("/user", userRoutes)
app.listen(5000, () => console.log("Serveur sur 5000"));


async function startApp() {
    await createDatabase();  // création de la BDD si elle n'existe pas



    // initialisation des modèles
    //UserModel(sequelize);

    // synchronisation des tables

    await sequelize.sync({ force: true });
    await initRoles();
    await initCivilite();
    await importCountriesSQL();
    console.log('✅ Tables synchronisées');
}

startApp();
