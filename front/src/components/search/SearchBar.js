import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ menuBurger }) => {
    const [villeSearch, setVilleSearch] = useState([]);
    const [inputVille, setInputVille] = useState("");
    const [previsu, setPrevisu] = useState(false);
    const containerFermer = useRef(null);

    const searchVille = async (e) => {
        e.preventDefault();
        if (!inputVille) return; // rien à chercher


        await fetch(`http://localhost:5000/api/weather/${encodeURIComponent(inputVille)}`)
            .then((res) => res.json())
            .then((data) => setVilleSearch(data))
            .catch((err) => console.error(err));

        setPrevisu(true);


    };

    useEffect(() => {
        // Fonction pour détecter les clics en dehors
        const handleClickOutside = (event) => {
            if (containerFermer.current && !containerFermer.current.contains(event.target)) {
                setPrevisu(false);
            }
        };

        // Ajouter l'écouteur sur tout le document
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    console.log(villeSearch)
    return (
        <form action="" onSubmit={searchVille} className="form-search">
            <input type="text" id="headerSearch" onChange={(e) => setInputVille(e.target.value)} placeholder="Entrer une ville" />
            {previsu && (
                <ul ref={containerFermer} className="liste-search">
                    {villeSearch.map((uneVille, index) => (
                        <li key={index} ><Link onClick={(e) => { setPrevisu(false); if (menuBurger) menuBurger(); }} to={`/prevision/${uneVille.name.toLowerCase()}`} state={{ lat: uneVille.lat, lon: uneVille.lon }}>{uneVille.name}, {uneVille.country} <img src={`../assets/drapeaux/${uneVille.country.toLowerCase()}.svg`} alt="" /><br /><span>{uneVille.state}</span></Link></li>//
                    ))}
                </ul>
            )}
            <div><img src="../assets/picto/icon_search.png" onClick={searchVille} alt="picto loupe" /></div>
        </form>
    )
}

export default SearchBar