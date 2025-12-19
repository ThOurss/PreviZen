import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../style/connection_inscription.css"
import Cookies from 'js-cookie';

const ConnectionInscription = ({ setIsConnected }) => {
    const navigate = useNavigate()

    const [actif, setActif] = useState(true)
    const [oeilActif, setOeilActif] = useState({
        connection: true,
        inscription: true,
        confirmer: true,
    });
    const [inscriptionConfirm, setInscriptionConfirm] = useState(false)

    const [visible, setVisible] = useState(false)
    const toggleRequirement = () => {
        setVisible(prev => !prev);
    };

    const [civilites, setCivilites] = useState([]);


    // 3. État pour le choix de l'utilisateur
    const [choixCivilite, setChoixCivilite] = useState('');
    const [pays, setPays] = useState([]);
    // 2. État pour la langue (exemple)

    // 3. État pour le choix de l'utilisateur
    const [choixPays, setChoixPays] = useState('');
    const [errors, setErrors] = useState({});

    const toggle = (field) => {
        setOeilActif((prev) => ({ ...prev, [field]: !prev[field] }));
    };
    useEffect(() => {
        fetch('http://localhost:5000/civilite/getAll')
            .then(res => res.json())
            .then(data => setCivilites(data)) // On met le JSON dans le state
            .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        fetch('http://localhost:5000/pays/getAll')
            .then(res => res.json())
            .then(data => setPays(data)) // On met le JSON dans le state
            .catch(err => console.error(err));
    }, []);

    const submitInscription = async (e) => {
        let newErrors = {}
        e.preventDefault()
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.usernameInscription.trim() === '') {
            newErrors.usernameInscription = "Votre nom est requis";
        }
        if (data.firstnameInscription.trim() === '') {
            newErrors.firstnameInscription = "Votre prénom est requis";
        }
        if (data.emailInscription.trim() === '') {
            newErrors.emailInscription = "Votre adresse mail est requis";
        }
        if (data.passwordUserInscription.trim() === '') {
            newErrors.passwordUserInscription = "Vous devez renseigner un mot de passe ";
        }

        if (data.confirmerPasswordUser.trim() === '') {
            newErrors.confirmerPasswordUser = "Vous devez renseigner la confirmation du mot de passe ";
        }
        if (data.passwordUserInscription !== data.confirmerPasswordUser) {
            newErrors.confirmerPasswordUser = "Les mots de passe ne correspondent pas !";
        }
        if (data.paysList.trim() === "") {
            newErrors.paysList = "Votre pays de résidence est requis";
        }
        if (!data.civilite) {
            newErrors.civilite = "Veuillez sélectionner une civilité";
        }

        console.log(data)
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const dataToSend = {
            username: data.usernameInscription,
            firstname: data.firstnameInscription,
            email: data.emailInscription,
            password: data.passwordUserInscription,
            id_civilite: choixCivilite, // ex: 2 (Madame)
            id_pays: choixPays
        }
        console.log(dataToSend)

        try {
            const response = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend) // On envoie l'objet renommé
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Succès:', result);
                // Redirection ou message de succès
                setInscriptionConfirm(true)
            } else {
                newErrors = {}
                if (result.errors) {

                    //  correspondance : Backend Name -> Frontend Name

                    const errorMapping = {
                        username: 'usernameInscription',
                        email: 'emailInscription',
                        password: 'passwordUserInscription'
                    };

                    // boucle sur les erreurs reçues pour remplir newErrors

                    Object.keys(result.errors).forEach(backendField => {
                        const frontendField = errorMapping[backendField];
                        if (frontendField) {
                            newErrors[frontendField] = result.errors[backendField];
                        }
                    });
                } else {

                    console.log(result.message || "Une erreur est survenue");
                }
                console.log(newErrors)
                // On met à jour l'affichage
                setErrors(newErrors);
                return;
            }

        } catch (error) {
            console.error('Erreur Réseau:', error);
        }
    }

    const submitConnection = async (e) => {
        let newErrors = {}
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.emailConnection.trim() === '') {
            newErrors.emailConnection = "Votre adresse mail est requis";
        }
        if (data.passwordUserConnexion.trim() === '') {
            newErrors.passwordUserConnexion = "Vous devez renseigner un mot de passe ";
        }
        const isStayConnected = data.stayConnect === "on";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const dataToSend = {

            email: data.emailConnection,
            password: data.passwordUserConnexion,
            stayConnected: isStayConnected
        }

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                const cookieOptions = isStayConnected ? { expires: 30 } : {};

                // On stocke les infos NON SENSIBLES (pas le token, juste le nom/rôle)
                Cookies.set('user_infos', JSON.stringify(result), {
                    ...cookieOptions,
                    secure: false, // true en production
                    sameSite: 'strict'
                });

                // On met à jour l'état global de React
                setIsConnected(true);
                window.location.href = '/'
            } else {
                setErrors({ generalConnection: result.error || "Erreur de connexion" });

            }

        } catch (error) {
            console.error('Erreur Réseau:', error);
        }
    }
    return (
        <main className="connexion_inscription">
            <section className="choix-connection_inscription">
                <div className={`connection ${actif ? 'sectActive' : ''}`}  >
                    <button type="button" className="actif" onClick={() => setActif(true)}>
                        <span>Se connecter</span>
                    </button>
                </div>
                <div className={`inscription ${!actif ? 'sectActive' : ''}`} >
                    <button type="button" onClick={() => setActif(false)}>
                        <span>S'inscrire </span>
                    </button>
                </div>
            </section>
            <section className="contenu-connection_inscription">
                <section className={`contenu-connection container ${actif ? "actif" : ""}`}>
                    <div className="div-id">
                        <p>Identifiez-vous si vous avez déjà un compte via:</p>
                    </div>
                    <form action="" onSubmit={submitConnection}>
                        {errors.generalConnection && (
                            <div className="error" >
                                {errors.generalConnection}
                            </div>
                        )}
                        <div className="div-email">
                            <fieldset>
                                <legend>E-mail</legend>
                                <div>
                                    <input type="email" name="emailConnection" id="email-connection" required />
                                </div>
                            </fieldset>
                            {errors.emailConnection && <p className="error">{errors.emailConnection}</p>}
                        </div>
                        <div className="div-mdp">
                            <fieldset>
                                <legend>Mot de passe</legend>
                                <div>
                                    <input type={oeilActif.connection ? "password" : "text"} name="passwordUserConnexion" id="password-user-connexion" autoComplete="current-password" required />
                                    <img src="../assets/picto/oeil.png" alt="" className={`${oeilActif.connection ? 'oeilActif' : ''} `} onClick={() => toggle('connection')} />
                                    <img src="../assets/picto/oeil_close.png" alt="" className={`${!oeilActif.connection ? 'oeilActif' : ''} `} onClick={() => toggle('connection')} />
                                </div>
                            </fieldset>
                            {errors.passwordUserConnexion && <p className="error">{errors.passwordUserConnexion}</p>}
                        </div>
                        <button className="btn-connecter" type="submit">Se connecter</button>
                        <div className="connecter-oublier">
                            <div className="sect-connecter">
                                <input type="checkbox" name="stayConnect" id="stay-connect" />
                                <label htmlFor="stay-connect">Rester connecté</label>
                            </div>
                            <div className="sect-oublier">
                                <p>
                                    <Link>Mot de passe oublié</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </section>
                <section className={`contenu-inscription container ${!actif ? "actif" : ""}`}>
                    <form action="" onSubmit={submitInscription} id="formInscription">


                        <div className="div-firstname">
                            <fieldset>
                                <legend>Prénom *</legend>
                                <div>
                                    <input type="text" name="firstnameInscription" id="firstname-inscription" required />
                                </div>
                            </fieldset>
                            {errors.firstnameInscription && <p className="error">{errors.firstnameInscription}</p>}
                        </div>
                        <div className="div-username">
                            <fieldset>
                                <legend>Nom *</legend>
                                <div>
                                    <input type="text" name="usernameInscription" id="username-inscription" required />
                                </div>

                            </fieldset>
                            {errors.usernameInscription && <p className="error">{errors.usernameInscription}</p>}
                        </div>
                        <div className="div-civilite">
                            <div className="civilite-no-error">
                                <div>
                                    <p>Civilité :</p>
                                </div>
                                <div className="listeCivilite">
                                    {civilites.map((item) => (
                                        <div key={item.id_civilite} className="radio-group">
                                            <input
                                                type="radio"
                                                name="civilite"
                                                id={`civ-${item.id_civilite}`}
                                                value={item.id_civilite}
                                                onChange={(e) => setChoixCivilite(e.target.value)}
                                            />

                                            <label htmlFor={`civ-${item.id_civilite}`}>

                                                {item.nom}
                                            </label>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            {errors.civilite && <p className="error">{errors.civilite}</p>}
                        </div>
                        <div className="div-pays">
                            <div className="pays-no-error">
                                <div>
                                    <p>Pays :</p>
                                </div>
                                <div className="listePays">
                                    <select name="paysList" id="list-pays" onChange={(e) => setChoixPays(e.target.value)}>
                                        <option value="">-- Sélectionnez votre pays --</option>
                                        {pays.map((item) => (
                                            <option key={item.id_pays} value={item.id_pays} >{item.nom_fr}</option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                            {errors.paysList && <p className="error">{errors.paysList}</p>}
                        </div>
                        <div>

                        </div>
                        <div className="div-email">
                            <fieldset>
                                <legend>E-mail *</legend>
                                <div>
                                    <input type="email" name="emailInscription" id="email-inscription" required />
                                </div>
                            </fieldset>
                            {errors.emailInscription && <p className="error">{errors.emailInscription}</p>}
                        </div>
                        <div className="div-mdp">
                            <fieldset>
                                <aside className={`password-requirements ${visible ? 'visible' : ''}`} id="passRequirements">
                                    <label className="requirement" id="length">Minimum 8 caractères</label>
                                    <label className="requirement" id="lowercase">Au moins une minuscule</label>
                                    <label className="requirement" id="uppercase">Au moins une majuscule</label>
                                    <label className="requirement" id="number">Au moins un nombre</label>
                                    <label className="requirement" id="characters" >Au moins un caractère spécial :<br></br> (ex: @, #, $, etc.).</label>
                                </aside>
                                <legend className="legend-mdp">Mot de passe *
                                    <button type="button" className="infobulleMdp" onClick={toggleRequirement}>
                                        <img className="icon-info" src="../assets/picto/icon_info.png" alt="icon-info" />
                                    </button>
                                </legend>
                                <div>
                                    <input type={oeilActif.inscription ? "password" : "text"} name="passwordUserInscription" id="password-user-inscription" autoComplete="new-password" required />
                                    <img src="../assets/picto/oeil.png" alt="" className={`${oeilActif.inscription ? 'oeilActif' : ''} `} onClick={() => toggle('inscription')} />
                                    <img src="../assets/picto/oeil_close.png" alt="" className={`${!oeilActif.inscription ? 'oeilActif' : ''} `} onClick={() => toggle('inscription')} />
                                </div>
                            </fieldset>

                            {errors.passwordUserInscription && <p className="error">{errors.passwordUserInscription}</p>}
                        </div>
                        <div className="div-confirmer-mdp">
                            <fieldset>

                                <legend >Confirmer votre mot de passe *

                                </legend>
                                <div>
                                    <input type={`${oeilActif.confirmer ? 'password' : 'text'}`} name="confirmerPasswordUser" id="confirmer-password-user" autoComplete="off" required />
                                    <img src="../assets/picto/oeil.png" alt="" className={`${oeilActif.confirmer ? 'oeilActif' : ''} `} onClick={() => toggle('confirmer')} />
                                    <img src="../assets/picto/oeil_close.png" alt="" className={`${!oeilActif.confirmer ? 'oeilActif' : ''} `} onClick={() => toggle('confirmer')} />
                                </div>
                            </fieldset>
                            {errors.confirmerPasswordUser && <p className="error">{errors.confirmerPasswordUser}</p>}
                        </div>

                        <button type="submit" className="btn-inscription">s'inscrire</button>
                        <div className="message-informatif">
                            <p>* Champ obligatoire</p>
                        </div>
                    </form>
                </section>
            </section>
            {inscriptionConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Succès</h3>
                        <p>Vous êtes maintenant inscrit, veuillez vous connecter. </p>

                        <div className="modal-buttons">

                            <button
                                className="btn-valid"
                                onClick={() => { setInscriptionConfirm(false); setActif(true); document.querySelector('#formInscription').reset() }}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default ConnectionInscription