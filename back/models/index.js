import { Sequelize } from "sequelize";
import { HOST, USER, PASSWORD, DB, dialect, port } from "../config/db.config.js";
const sequelize = new Sequelize(
    DB,
    USER,
    PASSWORD,
    {
        host: HOST,
        dialect,
        port
    }
);

// Test de connexion
sequelize.authenticate()
    .then(() => console.log("MySQL connecté avec succès !"))
    .catch(err => console.error("Impossible de se connecter :", err));

export default sequelize;
