import { Router } from 'express';
import { deleteUser, getAllUserByRole, updateUser } from '../controller/controllerAdmin.js';
import isModerateur from '../middleware/isModerateur.js';
import isAdmin from '../middleware/isAdmin.js';


const router = Router();
router.get('/dashboard/users', isModerateur, getAllUserByRole) // Route pour récupérer tout les users (par un moderateur ou admin)
router.get('/dashboard/moderateur', isAdmin, getAllUserByRole)  // Route pour récupérer tout les moderateurs (que admin)
router.patch('/dashboard/users/:id', isModerateur, updateUser);  // Route pour modifier un user (par un moderateur ou admin)
router.patch('/dashboard/moderateur/:id', isAdmin, updateUser); // Route pour modifier un moderateur (que admin)
router.put('/dashboard/users/delete/:id', isModerateur, deleteUser) // Route pour supprimer un user (par un moderateur ou admin)
router.put('/dashboard/moderateur/delete/:id', isAdmin, deleteUser) // Route poursupprimer un moderateur (que admin)
export default router;