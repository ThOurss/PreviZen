import { Favori } from '../models/index.js';
export const addFavori = async (req, res) => {

    try {

        const { nom_ville, pays, lat, lon } = req.body;

        const userId = req.auth.userId;

        // 1. (Optionnel) Vérifier si ce favori existe déjà pour cet user
        const existe = await Favori.findOne({
            where: { id_user: userId, lat: lat, lon: lon }
        });

        if (existe) {
            return res.status(400).json({ message: "Ville déjà en favoris" });
        }

        // 2. Création
        const nouveauFavori = await Favori.create({
            id_user: userId,
            nom_ville,
            pays,
            lat,
            lon
        });

        res.status(201).json(nouveauFavori);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFavoris = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const mesFavoris = await Favori.findAll({
            where: { id_user: userId }
        });

        res.json(mesFavoris);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};