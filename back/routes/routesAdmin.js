import { Router } from 'express';
import { getAllUserByRole, updateUser } from '../controller/controllerAdmin.js';


const router = Router();
router.get('/dashboard/users', getAllUserByRole)
router.patch('/dashboard/users/:id', updateUser);
export default router;