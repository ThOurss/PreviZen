import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

// C'est la table qui fera le lien entre conversation et message
const ConversationMessage = sequelize.define('ConversationMessage', {
    id_conversation_message: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'conversation_message',
    timestamps: false
});

export default ConversationMessage;