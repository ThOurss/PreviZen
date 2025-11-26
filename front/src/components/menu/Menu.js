import { Link } from "react-router-dom";
const Menu = () => {
    return (
        <nav className="menu">
            <ul>
                <li ><Link to="/" className="roboto-regular">Accueil</Link></li>
                <li ><Link to="/prevision" className="roboto-regular">Prévision</Link></li>
                <li><Link to="/alert" className="roboto-regular">Alerte</Link></li>
            </ul>
        </nav>

    );
}
export default Menu