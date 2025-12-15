import express from 'express';
import { addFavori, deleteFavori, getFavoris } from '../controller/controllerFavorie.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, addFavori);
router.get('/', auth, getFavoris);
router.delete('/', auth, deleteFavori)
export default router