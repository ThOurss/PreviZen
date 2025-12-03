import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const Alerte = sequelize.define('Alerte', {
    id_alerte: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
})

export default Alerte