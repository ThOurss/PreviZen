import { Router } from 'express';
import { deleteUser, getAllUserByRole, updateUser } from '../controller/controllerAdmin.js';


const router = Router();
router.get('/dashboard/users', getAllUserByRole)
router.patch('/dashboard/users/:id', updateUser);
router.put('/dashboard/users/delete/:id', deleteUser)
export default router;