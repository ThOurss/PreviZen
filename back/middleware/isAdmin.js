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