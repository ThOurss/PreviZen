import { Op } from 'sequelize';
import { Favori } from '../models/index.js';
export const addFavori = async (req, res) => {
    try {
        const { nom_ville, pays, lat, lon } = req.body;
        const userId = req.auth.userId;

        const latClean = Number(parseFloat(lat).toFixed(4));
        const lonClean = Number(parseFloat(lon).toFixed(4));

        // On utilise findOrCreate pour éviter les doublons
        const [favori, created] = await Favori.findOrCreate({
            where: { id_user: userId, lat: latClean, lon: lonClean },
            defaults: { nom_ville, pays }
        });

        if (!created) return res.status(200).json({ message: "Déjà en favori" });
        res.status(201).json({ message: "Ajouté aux favoris", id_favori: favori.id_favori });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getFavoris = async (req, res) => {
    try {
        // On récupère l'ID de l'utilisateur connecté (via le middleware auth)
        const userId = req.auth.userId;

        // On cherche tous les favoris de cet utilisateur
        const mesFavoris = await Favori.findAll({
            where: { id_user: userId }
        });

        // On renvoie la liste (tableau JSON)
        res.status(200).json(mesFavoris);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Impossible de récupérer les favoris" });
    }
};

export const deleteFavori = async (req, res) => {
    try {
        const { id } = req.body; // 👈 On attend maintenant un ID, plus de lat/lon
        const userId = req.auth.userId;

        // On supprime en vérifiant l'ID ET l'userId (sécurité)
        const rowsDeleted = await Favori.destroy({
            where: {
                id_favori: id,
                id_user: userId
            }
        });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Favori introuvable" });
        }

        res.status(200).json({ message: "Retiré des favoris" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
