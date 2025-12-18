import { Router } from 'express';
import { getAllUserByRole } from '../controller/controllerAdmin.js';


const router = Router();
router.get('/dashboard/users', getAllUserByRole)
export default router;