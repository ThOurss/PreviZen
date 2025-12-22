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
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        firstname,
        username,
        email,
        role_id,
        pays_id,
        civilite_id
    } = req.body;
    console.log(username)
    try {
        // 2. Vérif si l'user existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // 3. On construit l'objet de mise à jour dynamiquement
        // On n'ajoute la propriété QUE si elle est présente dans la requête
        const updateData = {};

        // Champs Textes
        if (firstname) updateData.firstname = firstname;
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        // Champs Selects (Clés étrangères)
        // On vérifie que ce n'est pas vide ou undefined
        if (role_id) updateData.id_role = role_id;
        if (pays_id) updateData.id_pays = pays_id;
        if (civilite_id) updateData.id_civilite = civilite_id;

        // Sécurité : Si rien n'est envoyé
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucune donnée valide à modifier." });
        }
        console.log(updateData)
        // 4. L'UPDATE SQL
        // Sequelize va faire : UPDATE users SET ... WHERE id = ...
        await User.update(updateData, { where: { id_User: id } });

        res.status(200).json({ message: "Mise à jour réussie !" });

    } catch (error) {
        console.error("Erreur Update User :", error);
        res.status(500).json({ error: "Erreur serveur lors de la modification." });
    }
}