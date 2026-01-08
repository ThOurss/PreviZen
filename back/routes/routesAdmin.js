import { Router } from 'express';
import { deleteUser, getAllUserByRole, updateUser } from '../controller/controllerAdmin.js';
import isModerateur from '../middleware/isModerateur.js';
import isAdmin from '../middleware/isAdmin.js';


const router = Router();
router.get('/dashboard/users', isModerateur, getAllUserByRole)
router.get('/dashboard/moderateur', isAdmin, getAllUserByRole)
router.patch('/dashboard/users/:id', isModerateur, updateUser);
router.patch('/dashboard/moderateur/:id', isAdmin, updateUser);
router.put('/dashboard/users/delete/:id', isModerateur, deleteUser)
router.put('/dashboard/moderateur/delete/:id', isAdmin, deleteUser)
export default router;