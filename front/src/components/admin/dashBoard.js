import { Link } from "react-router-dom"
import "../../style/dashboard.css"
const DashBoard = () => {
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
                            <h3>
                                Gestion des utilisateurs
                            </h3>
                            <p>Voir et supprimer des utilisateurs</p>
                        </div>
                    </Link>

                </section>
                <section>
                    <Link to='moderateur'>
                        <div className="div-svg">
                            <img src="../assets/picto/parametres.png" alt="picto parametre" />
                        </div>
                        <div>
                            <h3>

                                Gestion des modérateurs
                            </h3>
                            <p>Voir et supprimer des modérateurs</p>
                        </div>
                    </Link>

                </section>
            </section>
        </main>

    )
}
export default DashBoard