import { User } from '../models/index.js';

export const createUser = async (req, res) => {
    try {

        console.log("Données reçues :", req.body);

        const newUser = await User.create(req.body);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};