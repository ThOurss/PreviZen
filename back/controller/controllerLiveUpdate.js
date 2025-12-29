
import { LiveUpdate, User } from '../models/index.js';

// GET: Récupérer les signalements d'une ville
export const getCityReports = async (req, res) => {
    // On attend l'ID API dans l'URL (ex: /api/reports?id_ville=2988507)
    const { id_ville } = req.query;
    console.log(id_ville)
    if (!id_ville) {
        return res.status(400).json({ message: "ID de ville manquant" });
    }

    try {
        const msg = await LiveUpdate.findAll({
            where: { ville_id: id_ville }, // Filtre précis
            include: [
                {
                    model: User,
                    as: 'liveUser', // Doit matcher le "as" du belongsTo
                    attributes: ['id_user', 'username', 'firstname'] // On ne renvoie que le public
                }
            ],
            order: [['createdAt', 'DESC']], // Les plus récents en premier (style feed Insta)
            limit: 50 // Sécurité : on charge pas tout l'historique d'un coup
        });

        res.json(msg);
    } catch (error) {
        console.error("Erreur getCityReports:", error);
        res.status(500).json({ error: "Erreur serveur lors du chargement du flux." });
    }
};

// POST: Créer un signalement (Protégé)
export const createReport = async (req, res) => {
    // req.user.id vient de ton middleware d'auth
    // req.body contient { content, id_ville, nom_ville }
    try {

        // Validation basique côté serveur
        if (!req.body.content || !req.body.content.trim()) {
            return res.status(400).json({ message: "Le message ne peut pas être vide." });
        }

        const newMsg = await LiveUpdate.create({
            contenu: req.body.content.trim(),
            ville_id: req.body.id_ville,
            nom_ville: req.body.nom_ville,
            id_user: req.auth.userId
        });

        // Optionnel : renvoyer le report créé avec les infos de l'auteur pour affichage direct
        const fullReport = await LiveUpdate.findByPk(newMsg.id_live, {
            include: [{ model: User, as: 'liveUser', attributes: ['username', 'firstname'] }]
        });

        res.status(201).json(fullReport);
    } catch (error) {
        console.error("Erreur createReport:", error);
        res.status(500).json({ error: "Impossible de publier le signalement." });
    }
};