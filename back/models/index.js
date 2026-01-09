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
import Favori from "./modelFavoris.js";
import LiveUpdate from "./modelLiveUpdate.js";
// server.js ou models/index.js


// --- DÉFINITION DES RELATIONS ---

// C'est cette ligne qui crée la colonne 'id_role' dans la table Users
User.belongsTo(Role, {
    foreignKey: 'id_role',
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

LiveUpdate.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'liveUser'
})

Alerte.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'user'
})
Signalement.belongsTo(User, {
    foreignKey: 'id_user',
    as: 'user'
})


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
User.hasMany(LiveUpdate, {
    foreignKey: 'id_user',
    as: 'userLive'
})
User.hasMany(Favori, {
    foreignKey: 'id_user',
    as: 'favoriUser',
    onDelete: 'CASCADE'
});

// fonction pour initialiser les roles au lancement du serveur 
const initRoles = async () => {
    try {
        // Liste des rôles à avoir
        const roles = ['Admin', 'Moderateur', 'User', 'Delete'];

        for (const roleName of roles) {
            await Role.findOrCreate({
                where: { nom: roleName }, // On vérifie si ce NOM existe
                defaults: { nom: roleName } // Sinon on le crée
            });
        }
        console.log(' Vérification des rôles terminée');
    } catch (e) {
        console.error(' Erreur seeding:', e);
    }
};
// fonction pour initialiser les civilite au lancement du serveur 
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
        console.log(' Vérification des civilite terminée');
    } catch (e) {
        console.error(' Erreur seeding:', e);
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FONCTION D'IMPORT json des pays  ---
const importCountriesJSON = async () => {
    try {

        console.log(' Lecture du fichier JSON en cours...');

        // 1. On cherche le fichier 
        const jsonFilePath = path.join(__dirname, '../data/script_pays.json');

        // 2. On lit le contenu du fichier
        const sqlQuery = fs.readFileSync(jsonFilePath, 'utf8');
        const paysData = JSON.parse(sqlQuery);

        const formattedData = paysData.map((pays) => ({
            // Mappage des IDs (String "7" -> Int 7)
            id_pays: parseInt(pays.id_pays, 10),

            // Mappage des textes
            nom_fr: pays.nom_fr,
            nom_en: pays.nom_en,
            code_iso2: pays.code_iso2,
            code_iso3: pays.code_iso3,

            // Mappage du Booléen (String "0"/"1" -> Boolean false/true)
            isUE: pays.isUE === "1"
        }));

        await Pays.bulkCreate(formattedData, {
            // Si l'ID existe déjà, on met à jour ces champs :
            updateOnDuplicate: ["nom_fr", "nom_en", "code_iso2", "code_iso3", "isUE"]
        });

        console.log(' Pays importés depuis le fichier json !');

    } catch (e) {
        console.error(' Erreur import JSON :', e);
    }
};
export { User, Role, Civilite, LiveUpdate, Pays, Alerte, Favori, initRoles, initCivilite, importCountriesJSON, };