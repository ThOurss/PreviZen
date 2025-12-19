import { User, Role, Pays, Civilite } from "../models/index.js"
export const getAllUserByRole = async (req, res) => {
    try {
        const { role } = req.query; // ex: "admin" ou "user"

        // On prépare les options de la requête
        const options = {
            attributes: ['id_User', 'username', 'firstname', 'email'], // On choisit ce qu'on veut afficher
            include: [
                {
                    model: Role,// L'équivalent du JOIN
                    as: 'role',
                    attributes: ['id_role', 'nom'], // On veut juste le nom du rôle
                }, {
                    model: Pays,
                    as: 'pays',
                    attributes: ['id_pays', 'nom_fr']
                }, {
                    model: Civilite,
                    as: 'civilite',
                    attributes: ['id_civilite', 'nom']
                }
            ]
        };

        // Si un rôle est demandé dans l'URL (?role=admin), on ajoute le filtre
        if (role) {
            // On dit : "Dans le modèle Role inclus, la colonne 'nom' doit être égale à 'role'"
            options.include[0].where = { nom: role };
        }

        // Exécution de la requête (User.findAll remplace db.query)
        const users = await User.findAll(options);

        res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
}