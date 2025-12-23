import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';


const LiveUpdate = sequelize.define("LiveUpdate", {
    id_live: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    contenu: {
        type: DataTypes.STRING(280),
        allowNull: false
    },

    ville_id: {
        type: DataTypes.INTEGER, // L'ID unique de l'API Météo 
        allowNull: false
    },
    nom_ville: {
        type: DataTypes.STRING, // Juste pour info (ex: "Paris")
        allowNull: false
    }
}, {
    tableName: 'liveUpdate',
    timestamps: true
});

export default LiveUpdate