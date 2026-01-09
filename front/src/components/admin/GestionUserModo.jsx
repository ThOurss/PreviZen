import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../../style/gestionusermodo.css";

const GestionUserModo = () => {
  //variable d’état
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const [rolesList, setRolesList] = useState([]);
  const [paysList, setPaysList] = useState([]);
  const [civilitesList, setCivilitesList] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    username: "",
    email: "",
    role_id: "",
    pays_id: "",
    civilite_id: "",
  });
  const [errors, setErrors] = useState({});

  // fonction pour recuperer les utilisateur en fonction de leur role
  const fetchUsersByRole = useCallback(async () => {
    setLoading(true); // On affiche le chargement au début

    try {
      // On récupère le cookie pour avoir le token
      const userCookie = Cookies.get("user_infos");

      if (!userCookie) {
        // Pas connecté ? On renvoie au login
        navigate("/connexion");
        return;
      }

      //  On construit l'URL avec le Query Param (?role=...)
      // difference entre user et moderateur
      if (role === "user") {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/users?role=${role}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            alert("Session expirée ou droits insuffisants");
            navigate("/");
            return;
          }
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();

        setUsers(data); // On met à jour la liste
      } else {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/moderateur?role=${role}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            alert("Session expirée ou droits insuffisants");
            navigate("/");
            return;
          }
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();

        setUsers(data); // On met à jour la liste
      }
    } catch (error) {
      console.error("Erreur API :", error);
    } finally {
      setLoading(false); // On enlève le chargement, échec ou succès
    }
  }, [role, navigate]);
  useEffect(() => {
    //fonction pour recuperer les roles/civilites/pays pour la modification des users
    const fetchSelectOptions = async () => {
      try {
        // Exemple : On charge tout en parallèle
        // Adapte les URLs selon ton backend
        const [resRoles, resPays, resCiv] = await Promise.all([
          fetch("http://localhost:5000/role/getAll"),
          fetch("http://localhost:5000/pays/getAll"),
          fetch("http://localhost:5000/civilite/getAll"),
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

  useEffect(() => {
    if (userToUpdate) {
      setFormData({
        firstname: userToUpdate.firstname,
        username: userToUpdate.username,
        email: userToUpdate.email,

        // GESTION DES CLÉS ÉTRANGÈRES
        // Si user.role existe , on prend son ID. Sinon chaîne vide.
        role_id: userToUpdate.role ? userToUpdate.role.id_role : "",

        // Pareil pour pays et civilité
        pays_id: userToUpdate.pays ? userToUpdate.pays.id_pays : "",
        civilite_id: userToUpdate.civilite
          ? userToUpdate.civilite.id_civilite
          : "",
      });
    }
  }, [userToUpdate]);
  //fonction pour mettre a jour l'état de formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction pour sauvegarder les modifications
  const handleSubmit = async (e) => {
    e.preventDefault(); // On bloque le rechargement de la page

    let newErrors = {};
    if (formData.username.trim() === "") {
      newErrors.username = "Le nom est requis";
    }
    if (formData.firstname.trim() === "") {
      newErrors.firstname = "Le prénom est requis";
    }
    if (formData.email.trim() === "") {
      newErrors.email = "L'adresse mail est requis";
    }
    if (formData.pays_id === "") {
      newErrors.pays_id = "Le pays de résidence est requis";
    }
    if (!formData.civilite_id) {
      newErrors.civilite_id = "Une civilité est requis";
    }
    if (!formData.role_id) {
      newErrors.role_id = "Un role est requis";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      // Récupération du Token
      const userCookie = Cookies.get("user_infos");
      if (!userCookie) {
        navigate("/connexion");
        return;
      }

      // Envoi de la requête au Backend
      // On utilise l'ID de l'user qu'on est en train de modifier
      if (role === "user") {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/users/${userToUpdate.id_User}`,
          {
            method: "PATCH", // On utilise PATCH pour modifier
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData), // On envoie nos states (inputs + selects)
          }
        );

        //Gestion de la réponse
        if (response.ok) {
          // Succès !
          setConfirmUpdate(true);
        } else {
          // Erreur serveur
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || "Impossible de modifier"}`);
        }
      } else {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/moderateur/${userToUpdate.id_User}`,
          {
            method: "PATCH", // On utilise PATCH pour modifier
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData), // On envoie nos states (inputs + selects)
          }
        );

        // 3. Gestion de la réponse
        if (response.ok) {
          // Succès !
          setConfirmUpdate(true);
        } else {
          // Erreur serveur
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || "Impossible de modifier"}`);
        }
      }
    } catch (error) {
      console.error("Erreur technique :", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };

  //fonction pour supprimer un user
  const handleSubmitDelete = async (e) => {
    e.preventDefault();

    if (window.confirm("Êtes-vous sûr ?")) {
      if (role === "user") {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/users/delete/${userToDelete.id_User}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          // Succès !
          setConfirmDelete(true);
        } else {
          // Erreur serveur
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || "Impossible de modifier"}`);
        }
      } else {
        const response = await fetch(
          `http://localhost:5000/admin/dashboard/moderateur/delete/${userToDelete.id_User}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          // Succès !
          setConfirmDelete(true);
        } else {
          // Erreur serveur
          const errorData = await response.json();
          alert(`Erreur : ${errorData.message || "Impossible de modifier"}`);
        }
      }
    }
  };

  // --- Rendu ---
  if (loading) return <p>Chargement en cours...</p>;

  return (
    <main id="gestion-user-modo">
      {role === "user" ? (
        <h2>Gestions des utilisateurs</h2>
      ) : (
        <h2>Gestions des modérateurs</h2>
      )}
      {users.length !== 0 ? (
        <section className="grid-admin-users">
          {users.map((user, index) => (
            <section key={index}>
              <div>
                Prénom:<span>{user.firstname}</span>
              </div>
              <div>
                Nom:<span>{user.username}</span>
              </div>
              <div>
                Email:<span>{user.email}</span>
              </div>
              <div>
                Civilite:<span>{user.civilite.nom}</span>
              </div>
              <div>
                pays:<span>{user.pays.nom_fr}</span>
              </div>
              <div>
                role:<span>{user.role.nom}</span>
              </div>
              {user.pending_delete === 1 && (
                <div>
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    L'utilisateur a demandé de supprimer son compte
                  </p>
                </div>
              )}
              <div className="btn-gestion-user">
                <div>
                  <button
                    className="btn-update"
                    type="button"
                    onClick={() => setUserToUpdate(user)}
                  >
                    Modifier
                  </button>
                </div>

                <form action="" method="post" onSubmit={handleSubmitDelete}>
                  {role === "user" ? (
                    <button
                      type="submit"
                      className="btn btn-danger"
                      onClick={() => {
                        setUserToDelete(user);
                      }}
                    >
                      Supprimer l'utilisateur
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-danger"
                      onClick={() => {
                        setUserToDelete(user);
                      }}
                    >
                      Supprimer le modérateur
                    </button>
                  )}
                </form>
              </div>
            </section>
          ))}
          {userToUpdate && (
            <div className="modal-overlay modal-gestion-user">
              <div className="modal-content">
                <h3>
                  Modification de {userToUpdate.firstname}{" "}
                  {userToUpdate.firstname}
                </h3>

                <section>
                  <form action="" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="updateFirstname">Prénom:</label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        id="updateFirstname"
                      />
                    </div>
                    {errors.firstname && (
                      <p className="error">{errors.firstname}</p>
                    )}
                    <div>
                      <label htmlFor="updateUsername">Nom:</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        id="updateUsername"
                      />
                    </div>
                    {errors.username && (
                      <p className="error">{errors.username}</p>
                    )}
                    <div>
                      <label htmlFor="updateEmail">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        id="updateEmail"
                      />
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}
                    <div>
                      <label htmlFor="updatePays">Pays:</label>
                      <select
                        name="pays_id" //  Très important
                        value={formData.pays_id}
                        onChange={handleChange}
                        id="updatePays"
                      >
                        <option value="">-- Choisir --</option>
                        {paysList.map((unPays) => (
                          <option key={unPays.id_pays} value={unPays.id_pays}>
                            {unPays.nom_fr} {/* ex: Monsieur, Madame */}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.pays_id && (
                      <p className="error">{errors.pays_id}</p>
                    )}
                    <div>
                      <label htmlFor="updateCivilite"> Civilite:</label>
                      <select
                        name="civilite_id" //  Très important
                        value={formData.civilite_id}
                        onChange={handleChange}
                        id="updateCivilite"
                      >
                        <option value="">-- Choisir --</option>
                        {civilitesList.map((civ) => (
                          <option key={civ.id_civilite} value={civ.id_civilite}>
                            {civ.nom} {/* ex: Monsieur, Madame */}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.civilite_id && (
                      <p className="error">{errors.civilite_id}</p>
                    )}
                    <div>
                      <label htmlFor="updateRole">Role:</label>
                      <select
                        name="role_id" //  Très important
                        value={formData.role_id}
                        onChange={handleChange}
                        id="updateRole"
                      >
                        <option value="">-- Choisir --</option>
                        {rolesList.map((unRole) => (
                          <option key={unRole.id_role} value={unRole.id_role}>
                            {unRole.nom} {/* ex: Monsieur, Madame */}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.role_id && (
                      <p className="error">{errors.role_id}</p>
                    )}
                    <div className="modal-buttons">
                      <button className="btn-valid" type="submit">
                        Sauvegarder
                      </button>

                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setUserToUpdate(null);
                          setErrors({});
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          )}
          {confirmUpdate && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Succès</h3>
                {role === "user" ? (
                  <p>L’utilisateur a bien été modifié. </p>
                ) : (
                  <p>Le modérateur a bien été modifié. </p>
                )}

                <div className="modal-buttons">
                  <button
                    className="btn-valid"
                    onClick={() => {
                      setUserToUpdate(null);
                      fetchUsersByRole();
                      setConfirmUpdate(false);
                    }}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          )}
          {confirmDelete && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Succès</h3>
                {role === "user" ? (
                  <p>L’utilisateur a bien été supprimé du site. </p>
                ) : (
                  <p>Le modérateur a bien été supprimé du site. </p>
                )}

                <div className="modal-buttons">
                  <button
                    className="btn-valid"
                    onClick={() => {
                      setUserToDelete(null);
                      fetchUsersByRole();
                      setConfirmDelete(false);
                    }}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div>
          {role === "user" ? (
            <p style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
              Il n'y a aucun utilisateur sur le site{" "}
            </p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
              Il n'y a aucun modérateur sur le site{" "}
            </p>
          )}
        </div>
      )}
    </main>
  );
};
export default GestionUserModo;
