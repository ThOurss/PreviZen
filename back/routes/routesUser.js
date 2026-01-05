import express from 'express';
import { createUser, getUser, login, logout, pendingDelete, updateMdpUser, updateUser } from '../controller/controllerUser.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/register', createUser); // La route qui déclenche le controller
router.post('/login', login);
router.post('/logout', logout)
router.get('/profil/:id', auth, getUser)
router.patch('/profil/update/:id', auth, updateUser)
router.patch('/profil/updatePassword/:id', auth, updateMdpUser)
router.patch('/profil/pendingDelete/:id', auth, pendingDelete)

// router.get('/profile', , (req, res) => {
//     // Ton controller de profil
// });


// // --- ROUTES ADMIN (auth + isAdmin) ---
// // Il faut être connecté ET être admin pour voir tous les utilisateurs
// // L'ordre est CRUCIAL : D'abord on vérifie qui c'est (auth), ensuite ses droits (isAdmin)
// router.get('/all', auth, isAdmin, getAllUsers);

export default router;