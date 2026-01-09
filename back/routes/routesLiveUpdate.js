import express from 'express';
import { getCityReports, createReport } from '../controller/controllerLiveUpdate.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCityReports); // route pour recuperer tout les commentaires d'une ville


router.post('/', auth, createReport); // route pour creer un commentaire d'une ville

export default router;