import { useLocation, Link } from "react-router-dom";
import Menu from "../menu/Menu.jsx";
import "../../style/header.css";

import SearchBar from "../search/SearchBar.jsx";

const Header = ({
  isConnected,
  setIsConnected,
  user,
  isAdmin,
  setIsAdmin,
  isModerateur,
  setIsModerateur,
}) => {
  const location = useLocation();

  return (
    <header className="style-header">
      <div className="div-style-header">
        <Link to="/">
          <div className="header-div-logo">
            <div>
              <img
                src="/assets/logo/logo_previzen_rounded_sans_nom.png"
                alt="logo previzen"
              />
            </div>
            <h1>PreviZen</h1>
          </div>
        </Link>

        {location.pathname !== "/" && <SearchBar />}

        <Menu
          isConnected={isConnected}
          user={user}
          setIsConnected={setIsConnected}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          isModerateur={isModerateur}
          setIsModerateur={setIsModerateur}
        />
      </div>
    </header>
  );
};
export default Header;
