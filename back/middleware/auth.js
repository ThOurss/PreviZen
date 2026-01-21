import jwt from 'jsonwebtoken';
import { SECRET_JWT } from '../config/db.config.js';

export default (req, res, next) => {
    try {

        // 1. Récupération du token depuis le COOKIE
        const token = req.cookies.auth_token;

        // 2. Si pas de token, on bloque tout de suite
        if (!token) {
            return res.status(401).json({ error: 'Non authentifié (Pas de token)' });
        }

        // 3. Vérification de la signature
        const decodedToken = jwt.verify(token, SECRET_JWT);

        // 4. On transmet les infos décodées aux routes suivantes
        // req.auth sera accessible dans les controllers
        req.auth = {
            userId: decodedToken.userId,
            role: decodedToken.role
        };

        // 5. Tout est bon, on passe à la suite
        next();

    } catch (error) {
        // Si le token est expiré ou falsifié
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};