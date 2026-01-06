import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/profil.css";
const Profil = ({ user }) => {
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    username: "",
    email: "",
    pays_id: "",
    civilite_id: "",
  });
  const [formMdp, setFormMdp] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [oeilActif, setOeilActif] = useState({
    current: true,
    new: true,
    confirm: true,
  });
  const [paysList, setPaysList] = useState([]);
  const [civilitesList, setCivilitesList] = useState([]);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [confirmUpdateMdp, setConfirmUpdateMdp] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const toggle = (field) => {
    setOeilActif((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const fetchProfile = useCallback(async () => {
    if (!user || !user.userId) return;
    try {
      // On appelle l'API avec l'ID de l'user connecté
      const userCookie = Cookies.get("user_infos");

      if (!userCookie) {
        // Pas connecté ? On renvoie au login
        navigate("/connexion");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/user/profil/${user.userId}`,
        {
          method: "GET",

          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFullProfile(data);
      }
    } catch (err) {
      console.error("Erreur chargement profil", err);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        // Exemple : On charge tout en parallèle
        // Adapte les URLs selon ton backend
        const [resPays, resCiv] = await Promise.all([
          fetch("http://localhost:5000/pays/getAll"),
          fetch("http://localhost:5000/civilite/getAll"),
        ]);

        setPaysList(await resPays.json());
        setCivilitesList(await resCiv.json());
      } catch (error) {
        console.error("Erreur chargement options", error);
      }
    };

    fetchSelectOptions();
    fetchProfile();
  }, [fetchProfile]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleMDP = (e) => {
    const { name, value } = e.target;
    setFormMdp((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (fullProfile) {
      setFormData({
        firstname: fullProfile.firstname || "", // Sécurité
        username: fullProfile.username || "",
        email: fullProfile.email || "",
        pays_id: fullProfile.pays ? fullProfile.pays.id_pays : "",
        civilite_id: fullProfile.civilite
          ? fullProfile.civilite.id_civilite
          : "",
      });
    }
  }, [fullProfile]);
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      // 1. Récupération du Token
      const userCookie = Cookies.get("user_infos");
      if (!userCookie) {
        navigate("/connexion");
        return;
      }

      // 2. Envoi de la requête au Backend
      // On utilise l'ID de l'user qu'on est en train de modifier
      const response = await fetch(
        `http://localhost:5000/user/profil/update/${user.userId}`,
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
        const errorData = await response.json();
        // Erreur serveur
        newErrors = {};

        if (errorData.errors) {
          //  correspondance : Backend Name -> Frontend Name
          const errorMapping = {
            username: "username",
            email: "email",
            firstname: "firstname",
            pays_id: "pays_id",
          };
          // boucle sur les erreurs reçues pour remplir newErrors
          Object.keys(errorData.errors).forEach((backendField) => {
            const frontendField = errorMapping[backendField];

            if (frontendField) {
              newErrors[frontendField] = errorData.errors[backendField];
            }
          });
        } else {
          console.log(response.message || "Une erreur est survenue");
        }

        // On met à jour l'affichage
        setErrors(newErrors);
        return;
      }
    } catch (error) {
      console.error("Erreur technique :", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };

  const handleSubmitMdp = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (formMdp.currentPassword.trim() === "") {
      newErrors.currentPassword = "Le mot de passe est requis";
    }
    if (formMdp.newPassword.trim() === "") {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    }
    if (formMdp.confirmPassword.trim() === "") {
      newErrors.confirmPassword =
        "La confirmation du nouveau mot de passe est requis";
    }

    if (formMdp.newPassword !== formMdp.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas !";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      // 1. Récupération du Token
      const userCookie = Cookies.get("user_infos");
      if (!userCookie) {
        navigate("/connexion");
        return;
      }

      // 2. Envoi de la requête au Backend
      // On utilise l'ID de l'user qu'on est en train de modifier
      const response = await fetch(
        `http://localhost:5000/user/profil/updatePassword/${user.userId}`,
        {
          method: "PATCH", // On utilise PATCH pour modifier
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formMdp), // On envoie nos states (inputs + selects)
        }
      );

      // 3. Gestion de la réponse
      if (response.ok) {
        // Succès !

        setConfirmUpdateMdp(true);
      } else {
        const errorData = await response.json();
        // Erreur serveur
        newErrors = {};

        if (errorData.errors) {
          //  correspondance : Backend Name -> Frontend Name
          const errorMapping = {
            password: "newPassword",
          };
          // boucle sur les erreurs reçues pour remplir newErrors
          Object.keys(errorData.errors).forEach((backendField) => {
            const frontendField = errorMapping[backendField];

            if (frontendField) {
              newErrors[frontendField] = errorData.errors[backendField];
            }
          });
        } else {
          newErrors.generalConnection =
            errorData.message || "Erreur de connexion";
        }

        // On met à jour l'affichage
        setErrors(newErrors);
        return;
      }
    } catch (error) {
      console.error("Erreur technique :", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };
  const handleSubmitDelete = async (e) => {
    e.preventDefault();

    let newErrors = {};

    try {
      // 1. Récupération du Token
      const userCookie = Cookies.get("user_infos");
      if (!userCookie) {
        navigate("/connexion");
        return;
      }

      // 2. Envoi de la requête au Backend
      // On utilise l'ID de l'user qu'on est en train de modifier
      const response = await fetch(
        `http://localhost:5000/user/profil/pendingDelete/${user.userId}`,
        {
          method: "PATCH", // On utilise PATCH pour modifier
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      // 3. Gestion de la réponse
      if (response.ok) {
        // Succès !

        setConfirmPending(true);
        setConfirmDelete(false);
      } else {
        const errorData = await response.json();
        // Erreur serveur
        newErrors = {};

        newErrors.generalConnection =
          errorData.message || "Erreur de connexion";

        // On met à jour l'affichage
        setErrors(newErrors);
        return;
      }
    } catch (error) {
      console.error("Erreur technique :", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };
  console.log(fullProfile);
  // --- Rendu ---
  if (loading) return <div>Chargement du profil...</div>;
  if (!fullProfile) return <div>Impossible de charger les informations.</div>;
  const isDeletionPending = fullProfile.pending_delete === 1 ? true : false;
  return (
    <main id="user-profil">
      <h2>Votre Profil</h2>

      <section className="information-user">
        <h3>1.Coordonnées</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="div-firstname style-div">
            <fieldset>
              <legend>Prénom</legend>
              <div>
                <input
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
            </fieldset>{" "}
            {errors.firstname && <p className="error">{errors.firstname}</p>}
          </div>
          <div className="div-username  style-div">
            <fieldset>
              <legend>Nom</legend>
              <div>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </fieldset>
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="div-email style-div">
            <fieldset>
              <legend>Email</legend>
              <div>
                <input
                  name="email"
                  type="mail"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </fieldset>{" "}
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="div-civilite style-div">
            <p>Civilite:</p>

            <div className="liste-civilite">
              {civilitesList.map((uneCivilite) => (
                <div key={uneCivilite.id_civilite}>
                  <label htmlFor={uneCivilite.nom}>{uneCivilite.nom}</label>
                  <input
                    type="radio"
                    name="civilite_id"
                    value={uneCivilite.id_civilite}
                    id={uneCivilite.nom}
                    checked={
                      String(formData.civilite_id) ===
                      String(uneCivilite.id_civilite)
                    }
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            {errors.civilite_id && (
              <p className="error">{errors.civilite_id}</p>
            )}
          </div>
          <div className="div-pays style-div">
            <p>Pays:</p>
            <div className="liste-pays">
              <select
                name="pays_id"
                id=""
                value={formData.pays_id}
                onChange={handleChange}
              >
                <option value="">-- Choisir --</option>
                {paysList.map((unPays) => (
                  <option key={unPays.id_pays} value={unPays.id_pays}>
                    {unPays.nom_fr} {/* ex: Monsieur, Madame */}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.pays_id && <p className="error">{errors.pays_id}</p>}

          <div className="modal-buttons">
            <button className="btn-valid" type="submit">
              Sauvegarder
            </button>
          </div>
        </form>

        {confirmUpdate && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Succès</h3>
              <div>
                <p>Vos informations on bien était modifier</p>
              </div>

              <div className="modal-buttons">
                <button
                  className="btn-valid"
                  onClick={() => {
                    fetchProfile();
                    setConfirmUpdate(false);
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <hr />
      <section className="information-securite">
        <h3>2.Sécurité</h3>
        <form action="" onSubmit={handleSubmitMdp}>
          <div className="style-div div-mdp">
            <fieldset>
              <legend>Mot de passe actuel</legend>
              <div>
                <input
                  type={oeilActif.current ? "password" : "text"}
                  name="currentPassword"
                  id="currentPassword"
                  value={formMdp.currentPassword}
                  onChange={handleMDP}
                />
                <img
                  src="../assets/picto/oeil.png"
                  alt=""
                  className={`${oeilActif.current ? "oeilActif" : ""} `}
                  onClick={() => toggle("current")}
                />
                <img
                  src="../assets/picto/oeil_close.png"
                  alt=""
                  className={`${!oeilActif.current ? "oeilActif" : ""} `}
                  onClick={() => toggle("current")}
                />
              </div>
            </fieldset>
            {errors.currentPassword && (
              <p className="error">{errors.currentPassword}</p>
            )}
          </div>

          <div className="style-div div-mdp">
            <fieldset>
              <legend>Nouveau mot de passe </legend>
              <div>
                <input
                  type={oeilActif.new ? "password" : "text"}
                  name="newPassword"
                  id="newPassword"
                  value={formMdp.newPassword}
                  onChange={handleMDP}
                />
                <img
                  src="../assets/picto/oeil.png"
                  alt=""
                  className={`${oeilActif.new ? "oeilActif" : ""} `}
                  onClick={() => toggle("new")}
                />
                <img
                  src="../assets/picto/oeil_close.png"
                  alt=""
                  className={`${!oeilActif.new ? "oeilActif" : ""} `}
                  onClick={() => toggle("new")}
                />
              </div>
            </fieldset>
            {errors.newPassword && (
              <p className="error">{errors.newPassword}</p>
            )}
          </div>

          <div className="style-div div-mdp">
            <fieldset>
              <legend>Confirmation </legend>
              <div>
                <input
                  type={oeilActif.confirm ? "password" : "text"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formMdp.confirmPassword}
                  onChange={handleMDP}
                />
                <img
                  src="../assets/picto/oeil.png"
                  alt=""
                  className={`${oeilActif.confirm ? "oeilActif" : ""} `}
                  onClick={() => toggle("confirm")}
                />
                <img
                  src="../assets/picto/oeil_close.png"
                  alt=""
                  className={`${!oeilActif.confirm ? "oeilActif" : ""} `}
                  onClick={() => toggle("confirm")}
                />
              </div>
            </fieldset>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.generalConnection && (
            <p className="error">{errors.generalConnection}</p>
          )}
          <div className="modal-buttons">
            <button className="btn-valid" type="submit">
              Sauvegarder votre mot de passe
            </button>
          </div>
        </form>
        {confirmUpdateMdp && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Succès</h3>
              <div>
                <p>Votre mot de passe à bien était modifié</p>
              </div>

              <div className="modal-buttons">
                <button
                  className="btn-valid"
                  onClick={() => {
                    fetchProfile();
                    setConfirmUpdateMdp(false);
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <hr />
      <section className="demande-supp">
        <h3>3.Demande de suppression</h3>
        <div>
          <p>
            Vous êtes sur le point de demander la fermeture définitive de votre
            compte. Une fois la demande validée par nos services, toutes vos
            données seront irrévocablement effacées.
          </p>
          {isDeletionPending && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Votre demande de suppression est en cours de traitement.
            </p>
          )}
        </div>
        <form action="">
          <button
            type="button"
            className="btn-confirm"
            onClick={(e) => {
              e.preventDefault();
              setConfirmDelete(true);
            }}
            disabled={isDeletionPending}
          >
            Envoyer la demande de suppression
          </button>
        </form>
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirmation</h3>
              <div>
                <p>
                  Vous êtes sur le point de demander la fermeture définitive de
                  votre compte. Êtes-vous sûr ?
                </p>
              </div>
              <form action="" onSubmit={handleSubmitDelete}>
                <div className="modal-buttons">
                  <button className="btn-confirm" type="submit">
                    Confirmer la demande de suppression
                  </button>
                  <button
                    className="btn-cancel"
                    type="button"
                    onClick={() => {
                      setConfirmDelete(false);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {confirmPending && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Demande de suppression</h3>
              <div>
                <p>Votre demande de suppression a été envoyée.</p>
              </div>

              <div className="modal-buttons">
                <button
                  className="btn-valid"
                  type="button"
                  onClick={() => {
                    fetchProfile();
                    setConfirmPending(false);
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
export default Profil;
