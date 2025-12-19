import express from 'express';
import { getAllRoles } from '../controller/controllerRole.js';

const router = express.Router();

router.get('/getAll', getAllRoles)
export default router;