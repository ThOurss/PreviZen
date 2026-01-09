import { Pays } from "../models/index.js";

export const getAllPays = async (req, res) => {
    try {

        const list = await Pays.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};