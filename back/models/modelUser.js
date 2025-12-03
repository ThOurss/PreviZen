import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';


const User = sequelize.define('User', {

    id_User: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false // Ce champ est obligatoire
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true // Validation automatique de l'email
        },
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 255],
                msg: "Le mot de passe doit contenir entre 8 et 255 caractères."
            },
            hasUppercase(value) {
                if (!/[A-Z]/.test(value)) {
                    throw new Error("Le mot de passe doit contenir au moins une lettre majuscule.");
                }
            },
            hasLowercase(value) {
                if (!/[a-z]/.test(value)) {
                    throw new Error("Le mot de passe doit contenir au moins une lettre minuscule.");
                }
            },
            hasDigit(value) {
                if (!/\d/.test(value)) {
                    throw new Error("Le mot de passe doit contenir au moins un chiffre.");
                }
            },
            hasSpecialChar(value) {
                if (!/[\W]/.test(value)) {
                    throw new Error("Le mot de passe doit contenir au moins un caractère spécial (ex: @, #, $, etc.).");
                }
            }
        }
    }

}, {
    // Options du modèle
    timestamps: false // Ajoute automatiquement createdAt et updatedAt
});

export default User
