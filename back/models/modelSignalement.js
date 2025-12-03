import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const Signalement = sequelize.define('Signalement', {
    id_signalement: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    timestamps: true,
    updatedAt: false
})

export default Signalement