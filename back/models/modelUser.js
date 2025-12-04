import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
import bcrypt from "bcrypt";

const User = sequelize.define('User', {

    id_User: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Veuillez renseigner votre nom',
            },
        },
        set(value) {
            this.setDataValue('username', value)
        },
        get() {
            const rawValue = this.getDataValue('username');

            return rawValue ? rawValue.toUpperCase() : null;
        }
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Veuillez renseigner votre prénom',
            },
        }, set(value) {
            this.setDataValue('firstname', value)
        },
        get() {
            const rawValue = this.getDataValue('firstname');

            return rawValue ? rawValue.toUpperCase() : null;
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Validation automatique de l'email
            notNull: {
                msg: 'Veuillez renseigner votre adresse mail',
            },
        },
        unique: true,
        set(value) {
            this.setDataValue('email', value.toLowerCase())
        }
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

}, {// Options du modèle
    hooks: {
        // Ce hook se lance APRES la validation, mais AVANT l'enregistrement
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },

        beforeUpdate: async (user) => {
            // re-hache que si le mot de passe a été modifié !
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },

    timestamps: false // Ajoute automatiquement createdAt et updatedAt
});

export default User
