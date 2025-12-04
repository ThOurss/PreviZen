import express from 'express';
import { createUser } from '../controller/controllerUser.js';

const router = express.Router();

router.post('/register', createUser); // La route qui déclenche le controller

export default router;