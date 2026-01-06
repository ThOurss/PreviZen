import { Link } from "react-router-dom";
import "../../style/footer.css";
const Footer = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link to="/contact">Nous contacter</Link>
        </li>
        <li>
          <Link to="/rgpd">Politique de Confidentialité</Link>
        </li>
        <li>
          <Link to="/cgu">Conditions générales d’utilisation</Link>
        </li>
      </ul>
    </footer>
  );
};
export default Footer;
