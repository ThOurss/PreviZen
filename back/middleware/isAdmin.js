export default (req, res, next) => {
    try {
        // On récupère le rôle que auth.js a décodé juste avant
       
        const role = req.auth.role;

        // Si ce n'est pas un admin (ID 1)
        if (role !== 1) {
            return res.status(403).json({ error: "Accès interdit : Droits d'administration requis" });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const fetchProfile = async () => {
//     const response = await fetch('http://localhost:5000/user/profile', {
//         method: 'GET',
//         credentials: 'include' // Indispensable pour envoyer le cookie au middleware !
//     });

//     if (response.status === 401) {
//         // Le middleware a dit "Non". Le token est invalide ou expiré.
//         console.log("Session expirée");
        
//         // 1. On nettoie le cookie visuel frontend
//         Cookies.remove('user_infos');
        
//         // 2. On met à jour l'app et on redirige
//         setIsConnected(false);
//         navigate('/login');
//         return;
//     }
    
//     // ... suite du code ...
// };