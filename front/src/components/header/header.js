import { useLocation } from "react-router-dom";
import Menu from "../menu/Menu.js"
import "../../style/header.css";


const Header = () => {
    const location = useLocation();
    return (
        <header className="style-header">
            <div className="div-style-header">
                <div className="header-div-logo">
                    <div>
                        <img src="assets/logo/logo_previzen_rounded_sans_nom.png" alt="logo previzen" />
                    </div>
                    <h1 >PreviZen</h1>
                </div>
                {location.pathname !== "/" && (
                    <form action="" className="form-search">
                        <input type="text" name="" id="" placeholder="Entrer une ville" />
                        <div><img src="assets/picto/icon_search.png" alt="picto loupe" /></div>
                    </form>
                )}

                <Menu />
            </div>

        </header>
    )
}
export default Header