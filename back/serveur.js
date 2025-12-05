import { createDatabase } from './db/createDatabase.js';
import express from "express";
import weatherRoutes from "./routes/routesAPI.js";
import userRoutes from "./routes/routesUser.js";
import civiliteRoutes from "./routes/routesCivilite.js";
import paysRoutes from './routes/routesPays.js'
import { User, Role, initRoles, initCivilite, importCountriesSQL } from './models/index.js';
import cors from "cors";
import { sequelize } from './config/db.config.js';

const app = express();
app.use(cors()); // autorise toutes les origines (pour dev)
app.use(express.json());

app.use("/api", weatherRoutes);
app.use("/user", userRoutes);
app.use("/civilite", civiliteRoutes);
app.use('/pays', paysRoutes)
app.listen(5000, () => console.log("Serveur sur 5000"));


async function startApp() {
    await createDatabase();


    await sequelize.authenticate();
    console.log('✅ Connexion Sequelize établie !');



    // initialisation des modèles
    //UserModel(sequelize);

    // synchronisation des tables

    await sequelize.sync();//{ alter: true }{ force: true }
    await initRoles();
    await initCivilite();
    await importCountriesSQL();
    console.log('✅ Tables synchronisées');
}

startApp();
