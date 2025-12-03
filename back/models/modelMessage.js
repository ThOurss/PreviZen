import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Message = sequelize.define('Message', {
    id_message: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

}, {
    timestamps: true,
    updatedAt: false
})
export default Message