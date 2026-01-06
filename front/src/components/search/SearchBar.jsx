import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ menuBurger }) => {
  const [villeSearch, setVilleSearch] = useState([]);
  const [inputVille, setInputVille] = useState("");
  const [previsu, setPrevisu] = useState(false);
  const [erreur, setErreur] = useState({});
  const containerFermer = useRef(null);

  const searchVille = async (e) => {
    e.preventDefault();
    if (!inputVille) return; // rien à chercher
    try {
      console.log(inputVille);
      const response = await fetch(
        `http://localhost:5000/api/weather/${encodeURIComponent(inputVille)}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVilleSearch(data);
        setPrevisu(true);
        setErreur(null);
      } else {
        const errorData = await response.json();
        setPrevisu(true);

        setErreur(errorData.error);
      }
    } catch (error) {
      console.error("Erreur technique :", error);
    }
  };

  useEffect(() => {
    // Fonction pour détecter les clics en dehors
    const handleClickOutside = (event) => {
      if (
        containerFermer.current &&
        !containerFermer.current.contains(event.target)
      ) {
        setPrevisu(false);
      }
    };

    // Ajouter l'écouteur sur tout le document
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form action="" onSubmit={searchVille} className="form-search">
      <input
        type="text"
        id="headerSearch"
        onChange={(e) => setInputVille(e.target.value)}
        placeholder="Entrer une ville"
      />
      {previsu && (
        <ul ref={containerFermer} className="liste-search">
          {villeSearch.map((uneVille, index) => (
            <li key={index}>
              <Link
                to={`/prevision/${uneVille.name.toLowerCase()}`}
                state={{ lat: uneVille.lat, lon: uneVille.lon }}
                onClick={(e) => {
                  setPrevisu(false);
                  if (menuBurger) menuBurger();
                }}
              >
                {uneVille.name}, {uneVille.country}{" "}
                <img
                  src={`/assets/drapeaux/${uneVille.country.toLowerCase()}.svg`}
                  alt=""
                />
                <br />
                <span>{uneVille.state}</span>
              </Link>
            </li> //
          ))}
          {erreur && <li>{erreur}</li>}
        </ul>
      )}
      <div>
        <img
          src="/assets/picto/icon_search.png"
          onClick={searchVille}
          alt="picto loupe"
        />
      </div>
    </form>
  );
};

export default SearchBar;
