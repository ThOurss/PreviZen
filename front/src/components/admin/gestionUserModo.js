import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';

const GestionUserModo = () => {
    const { role } = useParams();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fonction asynchrone pour faire la requête
        const fetchUsersByRole = async () => {
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
        };

        fetchUsersByRole();

        // D. IMPORTANT : Le tableau de dépendances [role]
        // Cela dit à React : "Si l'URL change (ex: on passe de /users à /moderateurs),
        // alors RELANCE tout ce useEffect immédiatement."
    }, [role, navigate]);
    console.log(users)
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
                        <div>pays:<span>{user.pays.nom_fr}</span></div>
                    </section>
                ))}
            </section>
        </main>
    )
}
export default GestionUserModo