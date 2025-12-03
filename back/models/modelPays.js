import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
const Pays = sequelize.define('pays', {
    id_pays: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom_fr: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    nom_en: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    code_iso2: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    code_iso3: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    isUE: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false
})
export default Pays