import { Op } from "sequelize";
import { Role } from "../models/index.js";

export const getAllRoles = async (req, res) => {
    try {

        const list = await Role.findAll({
            where: {
                id_role: {
                    [Op.notIn]: [1, 4]
                }
            }
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};