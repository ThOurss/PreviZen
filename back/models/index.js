import User from "./modelUser.js";
import Role from "./modelRoles.js";
import Pays from "./modelPays.js";
import Civilite from "./modelCivilite.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from "../config/db.config.js";
import Alerte from "./modelAlerte.js";
import Signalement from "./modelSignalement.js";
import Conversation from "./modelConversation.js";
import Message from "./modelMessage.js";
import UserConversation from "./modelUserConversation.js";
import ConversationMessage from "./modelConversationMessage.js";
import Favori from "./modelFavoris.js";
// server.js ou models/index.js


// --- DÉFINITION DES RELATIONS ---

// 1. Un User appartient à un Role
// C'est cette ligne qui crée la colonne 'id_role' dans la table Users
User.belongsTo(Role, {
    foreignKey: 'id_role', // On force le nom de la colonne (sinon ce serait roleId)
    as: 'role'             // Alias pour les requêtes (user.role)
});

User.belongsTo(Civilite, {
    foreignKey: 'id_civilite',
    as: 'civilite'
})

User.belongsTo(Pays, {
    foreignKey: 'id_pays',
    as: 'pays'
})
Favori.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'favori'
});

User.belongsToMany(Conversation, {
    through: UserConversation,
    foreignKey: 'id_user',
    as: 'convUser'
})



Conversation.belongsToMany(User, {
    through: UserConversation,
    foreignKey: 'id_conversation',
    as: 'userConv'
})

Conversation.belongsToMany(Message, {
    through: ConversationMessage,
    foreignKey: 'id_conversation',
    as: 'messageConv'
})

Message.belongsToMany(Conversation, {
    through: ConversationMessage,
    foreignKey: 'id_message',
    as: 'convMessage'
})

Alerte.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'user'
})
Signalement.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'user'
})

// 2. Un Role a plusieurs Users

User.hasMany(Alerte, {
    foreignKey: 'id_user',
    as: 'alerte'
})
User.hasMany(Signalement, {
    foreignKey: 'id_user',
    as: 'signalement'
})
Role.hasMany(User, {
    foreignKey: 'id_role', // On répète la même clé pour être cohérent
    as: 'users'            // Alias (role.users)
});

Civilite.hasMany(User, {
    foreignKey: 'id_civilite',
    as: 'userCivilite'
})

Pays.hasMany(User, {
    foreignKey: 'id_pays',
    as: 'userPays'
})
User.hasMany(Favori, {
    foreignKey: 'id_user',
    as: 'favoriUser',
    onDelete: 'CASCADE'
});
const initRoles = async () => {
    try {
        // Liste des rôles à avoir
        const roles = ['admin', 'moderateur', 'user'];

        for (const roleName of roles) {
            await Role.findOrCreate({
                where: { nom: roleName }, // On vérifie si ce NOM existe
                defaults: { nom: roleName } // Sinon on le crée
            });
        }
        console.log('✅ Vérification des rôles terminée');
    } catch (e) {
        console.error('❌ Erreur seeding:', e);
    }
};

const initCivilite = async () => {
    try {
        // Liste des civilites à avoir
        const civilites = ['Monsieur', 'Madame', 'Autres'];

        for (const civiliteName of civilites) {
            await Civilite.findOrCreate({
                where: { nom: civiliteName }, // On vérifie si ce NOM existe
                defaults: { nom: civiliteName } // Sinon on le crée
            });
        }
        console.log('✅ Vérification des civilite terminée');
    } catch (e) {
        console.error('❌ Erreur seeding:', e);
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FONCTION D'IMPORT SQL ---
const importCountriesSQL = async () => {
    try {
        const count = await Pays.count();
        if (count === 0) {
            console.log('📜 Lecture du script SQL en cours...');

            // 1. On cherche le fichier (ajuste le chemin '../data/pays.sql' selon ton dossier)
            const sqlFilePath = path.join(__dirname, '../data/script_pays.sql');

            // 2. On lit le contenu du fichier
            const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

            // 3. On exécute le SQL brut
            await sequelize.query(sqlQuery);

            console.log('✅ Pays importés depuis le script SQL !');
        }
    } catch (e) {
        console.error('❌ Erreur import SQL :', e);
    }
};
export { User, Role, Civilite, Message, Conversation, Pays, Alerte, Favori, UserConversation, ConversationMessage, initRoles, initCivilite, importCountriesSQL, };