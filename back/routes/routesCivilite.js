import express from 'express';
import { getAllCivilites } from '../controller/controllerCivilite.js';

const router = express.Router();

router.get('/getAll', getAllCivilites) // route pour recuperer toute les civilites
export default router;