import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Role = sequelize.define("Role", {
    id_role: {
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



export default Role;

