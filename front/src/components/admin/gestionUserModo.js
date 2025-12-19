import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import '../../style/gestionusermodo.css'

const GestionUserModo = () => {
    const { role } = useParams();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userToUpdate, setUserToUpdate] = useState(null)
    const navigate = useNavigate();
    const [rolesList, setRolesList] = useState([]);
    const [paysList, setPaysList] = useState([]);
    const [civilitesList, setCivilitesList] = useState([]);
    const [formData, setFormData] = useState({
        firstname: '',
        username: '',
        email: '',
        role_id: '',
        pays_id: '',
        civilite_id: ''
    });
    const fetchUsersByRole = useCallback(async () => {
        setLoading(true); // On affiche le chargement au début

        try {
            // A. On récupère le cookie pour avoir le token
            const userCookie = Cookies.get('user_infos');

            if (!userCookie) {
                // Pas connecté ? On renvoie au login
                navigate('/connexion');
                return;
            }

            const userInfos = JSON.parse(userCookie);
            const token = userInfos.token; // ou userInfos.accessToken selon ton backend

            // B. On construit l'URL avec le Query Param (?role=...)
            // C'est ici que la magie opère : Front (:role) -> Back (?role)
            const response = await fetch(`http://localhost:5000/admin/dashboard/users?role=${role}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            // Gestion des erreurs HTTP (401, 403, 500...)
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert("Session expirée ou droits insuffisants");
                    navigate('/connexion');
                    return;
                }
                throw new Error('Erreur lors de la récupération des données');
            }

            const data = await response.json();
            setUsers(data); // On met à jour la liste

        } catch (error) {
            console.error("Erreur API :", error);
        } finally {
            setLoading(false); // On enlève le chargement, échec ou succès
        }
    }, [role, navigate]);
    useEffect(() => {
        const fetchSelectOptions = async () => {
            try {
                // Exemple : On charge tout en parallèle
                // Adapte les URLs selon ton backend
                const [resRoles, resPays, resCiv] = await Promise.all([
                    fetch('http://localhost:5000/role/getAll'),
                    fetch('http://localhost:5000/pays/getAll'),
                    fetch('http://localhost:5000/civilite/getAll')
                ]);

                setRolesList(await resRoles.json());
                setPaysList(await resPays.json());
                setCivilitesList(await resCiv.json());

            } catch (error) {
                console.error("Erreur chargement options", error);
            }
        };

        fetchSelectOptions();
        fetchUsersByRole();
    }, [fetchUsersByRole]);
    console.log(users)
    useEffect(() => {
        if (userToUpdate) {
            setFormData({
                firstname: userToUpdate.firstname,
                username: userToUpdate.username,
                email: userToUpdate.email,

                // 👇 GESTION DES CLÉS ÉTRANGÈRES
                // Si user.role existe (objet), on prend son ID. Sinon chaîne vide.
                role_id: userToUpdate.role ? userToUpdate.role.id_role : '',

                // Pareil pour pays et civilité
                pays_id: userToUpdate.pays ? userToUpdate.pays.id_pays : '',
                civilite_id: userToUpdate.civilite ? userToUpdate.civilite.id_civilite : ''
            });
        }
    }, [userToUpdate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Rendu ---
    if (loading) return <p>Chargement en cours...</p>;
    return (
        <main id="gestion-user-modo">
            {role === 'user' ? (
                <h2>Gestions des utilisateurs</h2>
            ) : (
                <h2>Gestions des modérateurs</h2>
            )}
            <section className="grid-admin-users">
                {users.map((user, index) => (
                    <section key={index}>
                        <div>Prénom:<span>{user.firstname}</span></div>
                        <div>Nom:<span>{user.username}</span></div>
                        <div>Email:<span>{user.email}</span></div>
                        <div>Civilite:<span>{user.civilite.nom}</span></div>
                        <div>pays:<span>{user.pays.nom_fr}</span></div>
                        <div>role:<span>{user.role.nom}</span></div>
                        <div className="btn-gestion-user">
                            <div><button className="btn-update" type="button" onClick={() => setUserToUpdate(user)}>Modifier</button>
                            </div>

                            <form action=""
                                method="post">
                                <input type="hidden" name="_token" value="" />

                                {role === 'user' ? (
                                    <button type="submit" className="btn btn-danger" onClick={() => { return window.confirm('Êtes vous sûrs ?') }}
                                    >Supprimer l'utilisateur
                                    </button>) :

                                    (<button type="submit" className="btn btn-danger"
                                        onClick={() => { return window.confirm('Êtes vous sûrs ?') }}>Supprimer le modérateur
                                    </button>)
                                }

                            </form>
                        </div>

                    </section>

                ))}
                {userToUpdate && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Modification de {userToUpdate.firstname} {userToUpdate.firstname}</h3>
                            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                            <section>
                                <form action="">
                                    <div>
                                        <label htmlFor="updateFirstname">Prénom:</label>
                                        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} id="updateFirstname" />

                                    </div>
                                    <div>
                                        <label htmlFor="updateUsername">
                                            Nom:
                                        </label>
                                        <input type="text" name="username" value={formData.username} onChange={handleChange} id="updateUsername" />

                                    </div>
                                    <div>


                                        <label htmlFor="updateEmail">
                                            Email:

                                        </label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} id="updateEmail" /></div>
                                    <div>
                                        <label htmlFor="updateCivilite"> Civilite:</label>
                                        <select
                                            name="civilite_id"       // ⚠️ Très important
                                            value={formData.civilite_id}
                                            onChange={handleChange}
                                            id="updateCivilite"
                                        >
                                            <option value="">-- Choisir --</option>
                                            {civilitesList.map(civ => (
                                                <option key={civ.id_civilite} value={civ.id_civilite}>
                                                    {civ.nom} {/* ex: Monsieur, Madame */}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="updatePays">Pays:</label>
                                        <select
                                            name="pays_id"       // ⚠️ Très important
                                            value={formData.pays_id}
                                            onChange={handleChange}
                                            id="updatePays"
                                        >
                                            <option value="">-- Choisir --</option>
                                            {paysList.map(unPays => (
                                                <option key={unPays.id_pays} value={unPays.id_pays}>
                                                    {unPays.nom_fr} {/* ex: Monsieur, Madame */}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="updateRole">Role:</label>
                                        <select
                                            name="role_id"       // ⚠️ Très important
                                            value={formData.role_id}
                                            onChange={handleChange}
                                            id="updateRole"
                                        >
                                            <option value="">-- Choisir --</option>
                                            {rolesList.map(unRole => (
                                                <option key={unRole.id_role} value={unRole.id_role}>
                                                    {unRole.nom} {/* ex: Monsieur, Madame */}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-buttons">

                                        <button
                                            className="btn-confirm"

                                        >
                                            Sauvegarder
                                        </button>


                                        <button
                                            className="btn-cancel"
                                            onClick={() => setUserToUpdate(null)}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>

                            </section>

                        </div>
                    </div>
                )}
            </section>

        </main>
    )
}
export default GestionUserModo