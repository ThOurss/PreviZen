import express from 'express';
import { addFavori, deleteFavori, getFavoris } from '../controller/controllerFavorie.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, addFavori); // route pour ajouter une ville en favoris
router.get('/', auth, getFavoris); // route pour recuperer les favoris de l'user connecter grâce a la fonction auth
router.delete('/', auth, deleteFavori) // route pour supprimer une ville en favoris
export default router