import express from 'express';
import { login, logout } from '../controller/controllerAuth.js';
import auth from '../middleware/auth.js';
const router = express.Router();


router.post('/login', login); // route pour la connection 
router.post('/logout', auth, logout); // route pour la deconnection 

export default router;