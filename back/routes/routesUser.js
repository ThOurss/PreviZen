import express from 'express';
import { createUser, getUser, login, logout, pendingDelete, updateMdpUser, updateUser } from '../controller/controllerUser.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/register', createUser); // La route pour creer un user
router.post('/login', login); // route pour la connection 
router.post('/logout', logout); // route pour la deconnection 
router.get('/profil/:id', auth, getUser); // route pour recuperer les donnees d'un user
router.patch('/profil/update/:id', auth, updateUser) // route pour la modification des donnees user
router.patch('/profil/updatePassword/:id', auth, updateMdpUser); // route pour la modification du mot de passe user
router.patch('/profil/pendingDelete/:id', auth, pendingDelete); // route pour la demande de suppression de l'user

export default router;