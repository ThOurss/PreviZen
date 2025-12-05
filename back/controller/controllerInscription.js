import { User } from '../models/index.js';

export const createUser = async (req, res) => {
    try {



        const newUser = await User.create(req.body);

        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

            const fieldErrors = {};


            error.errors.forEach(e => {
                fieldErrors[e.path] = e.message;
            });

            return res.status(400).json({ errors: fieldErrors });
        }

        res.status(500).json({ message: 'Erreur serveur' });
    }
};