import { createDatabase } from './db/createDatabase.js';
import express from "express";
import weatherRoutes from "./routes/routesAPI.js";
import userRoutes from "./routes/routesUser.js";
import civiliteRoutes from "./routes/routesCivilite.js";
import paysRoutes from './routes/routesPays.js';
import roleRoutes from './routes/routesRole.js'
import liveUpdateRoutes from './routes/routesLiveUpdate.js';
import favorisRoutes from './routes/routesFavoris.js'
import adminRoutes from './routes/routesAdmin.js';
import { User, Role, initRoles, initCivilite, importCountriesJSON } from './models/index.js';
import cors from "cors";
import { sequelize } from './config/db.config.js';
import cookieParser from 'cookie-parser';
import auth from './middleware/auth.js';
import isAdmin from './middleware/isAdmin.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // autorise toutes les origines (pour dev) (limiter au front-end local)
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", weatherRoutes);
app.use("/user", userRoutes);
app.use("/civilite", civiliteRoutes);
app.use('/pays', paysRoutes);
app.use('/role', roleRoutes);
app.use('/favoris', favorisRoutes);
app.use('/admin', auth, adminRoutes);
app.use('/liveupdate', liveUpdateRoutes);
app.listen(5000, () => console.log("Serveur sur 5000"));


async function startApp() {
    await createDatabase();

    await sequelize.authenticate();
    console.log(' Connexion Sequelize établie !');

    // synchronisation des tables

    await sequelize.sync();//{ alter: true }{ force: true }
    await initRoles();
    await initCivilite();
    await importCountriesJSON();
    console.log(' Tables synchronisées !!');
}

startApp();
