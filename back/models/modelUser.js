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
            notEmpty: { msg: 'Veuillez renseigner votre nom' }
        },
        set(value) {
            this.setDataValue('username', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
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
            }, notEmpty: { msg: 'Veuillez renseigner votre prénom' }
        }, set(value) {
            this.setDataValue('firstname', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
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
            isEmail: {
                msg: 'Veuillez renseigner une adresse mail valide'
            }, // Validation automatique de l'email
            notNull: {
                msg: 'Veuillez renseigner votre adresse mail',
            },
            notEmpty: { msg: 'Veuillez renseigner votre mail' }
        },
        unique: { msg: 'Cette adresse email est déjà utilisée !' },
        set(value) {
            this.setDataValue('email', value.toLowerCase())
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Veuillez renseigner votre mot de passe',
            },
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

    },
    pending_delete: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    id_civilite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "La civilité est requise." },
            isInt: { msg: "La civilité doit être un identifiant valide." },

            async checkCiviliteExists(value) {

                const civilite = await sequelize.models.Civilite.findByPk(value);
                if (!civilite) {
                    throw new Error("Cette civilité n'existe pas.");
                }
            }
        }
    },

    //  VALIDATION PAYS
    id_pays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Le pays est requis." },
            isInt: { msg: "Le pays doit être un identifiant valide." },

            async checkPaysExists(value) {
                const pays = await sequelize.models.Pays.findByPk(value);
                if (!pays) {
                    throw new Error("Ce pays n'existe pas ou n'est plus disponible.");
                }
            }
        }
    },
    //  AJOUT DE LA COLONNE ID_ROLE
    id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,

    }

}, {// Options du modèle
    hooks: {
        // Ce hook se lance APRES la validation, mais AVANT l'enregistrement
        beforeCreate: async (user) => {
            if (!user.id_role) {
                user.id_role = 3;
            }
            if (!user.pending_delete) {
                user.pending_delete = 0
            }
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

    timestamps: false // si true ajoute automatiquement createdAt et updatedAt
});

export default User
