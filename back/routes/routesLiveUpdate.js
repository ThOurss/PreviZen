import express from 'express';
import { getCityReports, createReport } from '../controller/controllerLiveUpdate.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// URL publique pour lire (ex: /api/reports?cityId=...)
router.get('/', getCityReports);

// URL protégée pour écrire (nécessite un token valide)
router.post('/', auth, createReport);

export default router;