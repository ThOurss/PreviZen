import { Link, useNavigate } from "react-router-dom";
import "../../style/dashboard.css";
import { useEffect } from "react";
import Cookies from "js-cookie";
const DashBoard = (isAdmin) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user_infos");

    if (!userCookie) {
      // Pas connecté ? On renvoie au login
      navigate("/connexion");
      return;
    }
    const userObj = JSON.parse(userCookie);

    if (userObj.role === 3) {
      navigate("/");
      return;
    }
  });

  return (
    <main className="main-dashboard-admin">
      <h2>Tableau de bord</h2>

      <section className="grid-dashboard-admin">
        <section>
          <Link to="user">
            <div className="div-svg">
              <img src="../assets/picto/parametres.png" alt="picto parametre" />
            </div>
            <div>
              <h3>Gestion des utilisateurs</h3>
              <p>Voir et supprimer des utilisateurs</p>
            </div>
          </Link>
        </section>

        {isAdmin.isAdmin ? (
          <section>
            <Link to="moderateur">
              <div className="div-svg">
                <img
                  src="../assets/picto/parametres.png"
                  alt="picto parametre"
                />
              </div>
              <div>
                <h3>Gestion des modérateurs</h3>
                <p>Voir et supprimer des modérateurs</p>
              </div>
            </Link>
          </section>
        ) : (
          ""
        )}
      </section>
    </main>
  );
};
export default DashBoard;
