import { Op } from "sequelize";
import { Role } from "../models/index.js";

export const getAllRoles = async (req, res) => {
    try {

        const list = await Role.findAll({
            where: {
                id_role: {
                    [Op.ne]: 1
                }
            }
        });
        res.json(list); // <-- Envoie du JSON, pas du HTML !
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};