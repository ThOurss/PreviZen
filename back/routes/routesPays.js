import express from 'express';
import { getAllPays } from '../controller/controllerPays.js';

const router = express.Router();

router.get('/getAll', getAllPays)
export default router;