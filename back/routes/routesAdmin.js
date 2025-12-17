import express, { Router } from 'express';
import { dashBoard } from '../controller/controllerAdmin.js';


const router = Router();
router.get('/dashboard', dashBoard)
export default router;