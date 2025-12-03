import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

// C'est la table qui fera le lien entre User et conversation
const UserConversation = sequelize.define('UserConversation', {
    id_user_conversation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'user_conversation', timestamps: false
});

export default UserConversation;