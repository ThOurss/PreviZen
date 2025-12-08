import express from 'express';
import { createUser, login, logout } from '../controller/controllerInscription.js';

const router = express.Router();

router.post('/register', createUser); // La route qui déclenche le controller
router.post('/login', login);
router.post('/logout', logout)

export default router;