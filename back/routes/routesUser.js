import express from 'express';
import { createUser } from '../controller/controllerInscription.js';

const router = express.Router();

router.post('/register', createUser); // La route qui déclenche le controller

export default router;