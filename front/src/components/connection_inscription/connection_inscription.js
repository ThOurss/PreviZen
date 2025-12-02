import { useState } from "react"
import { Link } from "react-router-dom"
import "../../style/connection_inscription.css"

const ConnectionInscription = () => {
    const [actif, setActif] = useState(true)
    const [oeilActif, setOeilActif] = useState(true);

    // const setOeilActif() {

    //     if (!oeilActif) {
    //         document.querySelector('#passwordUser').type === "text"
    //         oeilActif === false
    //     } else {
    //         document.querySelector('#passwordUser').type === "password"
    //         oeilActif === true
    //     }
    // }
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
                    <form action="">
                        <div className="div-email">
                            <fieldset>
                                <legend>E-mail</legend>
                                <div>
                                    <input type="email" name="" id="" />
                                </div>
                            </fieldset>
                        </div>
                        <div className="div-mdp">
                            <fieldset>
                                <legend>Mot de passe</legend>
                                <div>
                                    <input type="password" name="" id="passwordUser" />
                                    <img src="../assets/picto/oeil.png" alt="" className={`${oeilActif ? 'oeilActif' : ''} `} onClick={() => setOeilActif(false)} />
                                    <img src="../assets/picto/oeil_close.png" alt="" className={`${!oeilActif ? 'oeilActif' : ''} `} onClick={() => setOeilActif(true)} />
                                </div>
                            </fieldset>
                        </div>
                        <button className="btn-connecter">Se connecter</button>
                        <div className="connecter-oublier">
                            <div className="sect-connecter">
                                <input type="checkbox" name="" id="stayConnect" />
                                <label htmlFor="stayConnect">Rester connecté</label>
                            </div>
                            <div className="sect-oublier">
                                <p>
                                    <Link>Mot de passe oublié</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </section>
                <section className={`contenu-inscription container ${!actif ? "actif" : ""}`}></section>
            </section>
        </main>
    )
}

export default ConnectionInscription