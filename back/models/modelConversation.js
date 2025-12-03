import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

const Conversation = sequelize.define('Conversation', {
    id_conversation: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    timestamps: false
})
export default Conversation