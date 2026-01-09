import { Civilite } from "../models/index.js";

export const getAllCivilites = async (req, res) => {
    try {

        const list = await Civilite.findAll({
            order: [
                ['id_civilite', 'ASC'] // Tri alphabétique sur le nom français
            ]
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};