import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const Menu = () => {
    const [open, setOpen] = useState();
    const menuBurger = () => {
        setOpen(open => !open);
    }
    const location = useLocation();
    return (
        <nav className="menu">
            <ul className="menu-laptop">
                <li ><Link to="/" className="roboto-regular">Accueil</Link></li>
                <li ><Link to="/prevision" className="roboto-regular">Prévision</Link></li>
                <li><Link to="/alert" className="roboto-regular">Alerte</Link></li>
                <li><Link to="/connexion" className="roboto-regular link-connexion"><img src="../assets/picto/utilisateur.png" alt="picto utilisateur" /></Link></li>

            </ul>
            {
                !open && (
                    <div href="#" id="openBurger" onClick={menuBurger}>
                        <span className="burger-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                )
            }



            <div className={`menu-tab-mobile ${open ? 'actif' : ''}`}>
                <div className="bgc-menu"></div>
                <div className="menu-fixed">
                    <div className="head-menu">
                        <h2>Menu</h2>
                        <button onClick={menuBurger}><img src="assets/picto/croix.png" alt="Croix pour la fermeture du menu" /></button>
                    </div>
                    {location.pathname !== "/" && (
                        <div className="search-mobile">
                            <form action="" >
                                <input type="text" name="" id="" placeholder="Entrer une ville" />
                                <div><img src="assets/picto/icon_search.png" alt="picto loupe" /></div>
                            </form>
                        </div>
                    )}

                    <ul>
                        <li ><Link to="/" className="roboto-regular"><img src="assets/picto/home.png" alt="" />Accueil</Link></li>
                        <li ><Link to="/prevision" className="roboto-regular"><img src="assets/picto/previsions.png" alt="" />Prévision</Link></li>
                        <li><Link to="/alert" className="roboto-regular"><img src="assets/picto/cloche.png" alt="" />Alerte</Link></li>
                        <li><Link to="/connexion" className="roboto-regular"><img src="assets/picto/utilisateur.png" alt="picto utilisateur" />connexion / inscription</Link></li>
                    </ul>
                </div>

            </div>


        </nav>


    );
}
export default Menu