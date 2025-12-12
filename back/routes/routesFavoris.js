import express from 'express';
import { addFavori, getFavoris } from '../controller/controllerFavorie.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/addFavoris', auth, addFavori);
router.get('/getAll', auth, getFavoris);
export default router