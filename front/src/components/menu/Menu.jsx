import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import SearchBar from "../search/SearchBar.jsx";

const Menu = ({
  isConnected,
  setIsConnected,
  user,
  isAdmin,
  setIsAdmin,
  isModerateur,
  setIsModerateur,
}) => {
  //variable d’état
  const [open, setOpen] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const menuBurger = () => {
    setOpen((open) => !open);
  };
  const location = useLocation();

  //fonction se deconnecter
  const confirmLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    Cookies.remove("user_infos");
    setIsConnected(false);
    setIsAdmin(false);
    setIsModerateur(false);
    setShowConfirm(false); // On ferme la modale
    setOpen(false);
    window.location.href = "/connexion";
  };

  const linkProfil = user ? "/profil" : "/connexion";
  // Fonction afficher la modal pour confirmer la deconnection
  const handleLogoutClick = () => {
    setShowConfirm(true); // On ouvre juste la modal
  };

  return (
    <nav className="menu">
      <ul className="menu-laptop">
        <li>
          <Link to="/" className="roboto-regular">
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/prevision" className="roboto-regular">
            Favoris
          </Link>
        </li>
        {isAdmin || isModerateur ? (
          // L'utilisateur est ADMIN / Modérateur
          <li>
            <Link to="/admin/dashboard">Tableau de bord</Link>
          </li>
        ) : (
          ""
        )}
        <li>
          <Link to={linkProfil}>Profil</Link>
        </li>
        {/* <li><Link to="/alert" className="roboto-regular">Alerte</Link></li> */}
        {isConnected ? (
          <li title="Se deconnecter">
            <Link
              onClick={handleLogoutClick}
              className="roboto-regular link-connexion"
            >
              <img src="/assets/picto/sortie.png" alt="se deconnecter" />
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/connexion" className="roboto-regular link-connexion">
              <img
                src="/assets/picto/utilisateur.png"
                alt="Se connecter / s’inscrire"
              />
            </Link>
          </li>
        )}
      </ul>
      {!open && (
        <div href="#" id="openBurger" onClick={menuBurger}>
          <span className="burger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      )}

      <div className={`menu-tab-mobile ${open ? "actif" : ""}`}>
        <div className="bgc-menu"></div>
        <div className="menu-fixed">
          <div className="head-menu">
            <h2>Menu</h2>
            <button onClick={menuBurger}>
              <img
                src="/assets/picto/croix.png"
                alt="Croix pour la fermeture du menu"
              />
            </button>
          </div>
          {location.pathname !== "/" && (
            <div className="search-mobile">
              <SearchBar menuBurger={menuBurger} />
            </div>
          )}

          <ul>
            <li>
              <Link to="/" className="roboto-regular">
                <img src="../assets/picto/home.png" alt="Accès à l’accueil" />
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/prevision"
                onClick={menuBurger}
                className="roboto-regular"
              >
                <img src="../assets/picto/coeur.png" alt="Accès page favoris" />
                Favoris
              </Link>
            </li>
            {isAdmin || isModerateur ? (
              // L'utilisateur est ADMIN / Modérateur
              <li>
                <Link to="/admin/dashboard" onClick={menuBurger}>
                  <img
                    src="/assets/picto/tableau-de-bord.png"
                    alt="Accès tableau de bord"
                  />
                  Tableau de bord
                </Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <Link to={linkProfil} onClick={menuBurger}>
                <img
                  src="/assets/picto/utilisateur.png"
                  alt="Accès au profil utilisateur"
                />
                Profil
              </Link>
            </li>
            {isConnected ? (
              <li>
                <Link onClick={handleLogoutClick} className="roboto-regular">
                  <img src="/assets/picto/sortie.png" alt="Se déconnecter" />
                  Se déconnecter
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/connexion"
                  onClick={menuBurger}
                  className="roboto-regular"
                >
                  <img
                    src="/assets/picto/utilisateur.png"
                    alt="Se connecter / s’inscrire"
                  />
                  connexion / inscription
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Déconnexion</h3>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>

            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>
                Oui, me déconnecter
              </button>

              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Menu;
