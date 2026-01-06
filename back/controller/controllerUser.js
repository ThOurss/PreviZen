import { SECRET_JWT } from '../config/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Civilite, Pays, User } from '../models/index.js';

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

export const getUser = async (req, res) => {

    try {

        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: "Veuillez vous connecter" });
        }

        const users = await User.findByPk(id, {
            attributes: ['id_User', 'username', 'firstname', 'email', 'pending_delete'], // On choisit ce qu'on veut afficher
            include: [
                {
                    model: Pays,
                    as: 'pays',
                    attributes: ['id_pays', 'nom_fr']
                }, {
                    model: Civilite,
                    as: 'civilite',
                    attributes: ['id_civilite', 'nom']
                }
            ]
        });
        if (!users) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }

}
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        firstname,
        username,
        email,
        pays_id,
        civilite_id
    } = req.body;

    try {
        // 2. Vérif si l'user existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // 3. On construit l'objet de mise à jour dynamiquement
        // On n'ajoute la propriété QUE si elle est présente dans la requête
        const updateData = {};

        // Champs Textes
        if (firstname) updateData.firstname = firstname;
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        // Champs Selects (Clés étrangères)
        // On vérifie que ce n'est pas vide ou undefined
        if (pays_id) updateData.id_pays = pays_id;
        if (civilite_id) updateData.id_civilite = civilite_id;

        // Sécurité : Si rien n'est envoyé
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucune donnée valide à modifier." });
        }

        // 4. L'UPDATE SQL
        // Sequelize va faire : UPDATE users SET ... WHERE id = ...
        await User.update(updateData, { where: { id_User: id } });

        res.status(200).json({ message: "Mise à jour réussie !" });

    } catch (error) {
        console.error("Erreur Update User :", error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

            const fieldErrors = {};


            error.errors.forEach(e => {
                fieldErrors[e.path] = e.message;
            });

            return res.status(400).json({ errors: fieldErrors });
        }

        res.status(500).json({ message: 'Erreur serveur' });
    }
}
export const updateMdpUser = async (req, res) => {
    const { id } = req.params;
    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = req.body;
    try {

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }
        // 2. Vérif si l'user existe

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe actuel incorrect." });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Mot de passe mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur Update User :", error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

            const fieldErrors = {};


            error.errors.forEach(e => {
                fieldErrors[e.path] = e.message;
            });

            return res.status(400).json({ errors: fieldErrors });
        }

        res.status(500).json({ message: 'Erreur serveur' });
    }
}

export const pendingDelete = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    try {
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        await User.update({ pending_delete: 1 }, { where: { id_User: id } });
        res.status(200).json({ message: "Demande de suppression envoyé !" });
    } catch (error) {
        console.error("Erreur Update User :", error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {

            const fieldErrors = {};


            error.errors.forEach(e => {
                fieldErrors[e.path] = e.message;
            });

            return res.status(400).json({ errors: fieldErrors });
        }

        res.status(500).json({ message: 'Erreur serveur' });
    }

}