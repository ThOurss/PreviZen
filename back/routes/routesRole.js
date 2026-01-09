import express from 'express';
import { getAllRoles } from '../controller/controllerRole.js';

const router = express.Router();

router.get('/getAll', getAllRoles) // route pour recuperer les roles moderateur et user
export default router;