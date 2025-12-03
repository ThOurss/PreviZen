import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Civilite = sequelize.define("Civilite", {
    id_civilite: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false
});



export default Civilite;

