import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Favori = sequelize.define('Favori', {
    id_favori: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom_ville: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pays: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.FLOAT, // ou DECIMAL(10, 8) pour plus de précision
        allowNull: false
    },
    lon: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
    // id_user sera ajouté automatiquement par Sequelize grâce à la relation
}, {
    timestamps: false,
    indexes: [
        {
            unique: true, // Interdit les doublons
            fields: ['id_user', 'lat', 'lon'], // Sur la combinaison de ces 3 champs
            name: 'unique_user_ville_coords'
        }
    ]
});



export default Favori;