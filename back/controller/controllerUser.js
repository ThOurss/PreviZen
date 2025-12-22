import { SECRET_JWT } from '../config/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const login = async (req, res) => {
    try {
        const { email, password, stayConnected } = req.body;

        // 1. On cherche l'utilisateur par son email
        const user = await User.findOne({ where: { email: email } });

        // S'il n'existe pas -> Erreur
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // 2. On compare le mot de passe envoyé avec le hash en BDD
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // 3. Tout est bon ? On génère le Token
        // Le token contient l'ID et le Rôle (pour savoir s'il est admin plus tard)
        const tokenDuration = stayConnected ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        const token = jwt.sign(
            { userId: user.id_User, role: user.id_role },
            SECRET_JWT,
            { expiresIn: stayConnected ? '30d' : '24h' }
        );
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false, // Mettre 'true' en HTTPS
            sameSite: 'strict',
            tokenDuration: tokenDuration
        });
        // 4. On renvoie le token et les infos de l'utilisateur au front
        res.status(200).json({
            userId: user.id_User,
            username: user.username,
            role: user.id_role,
            token: token
        });

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

export const logout = (req, res) => {
    // On détruit le cookie sécurisé côté serveur
    res.clearCookie('auth_token');
    res.status(200).json({ message: "Déconnecté" });
};