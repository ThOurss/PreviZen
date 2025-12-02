import "../../style/home.css";
import { useEffect, useState, useRef } from "react";
import MapPrevi from "../map/Map.js";
import { Link } from "react-router-dom";

const Home = () => {
    const [villes, setVille] = useState(null);
    const [villeSearch, setVilleSearch] = useState([]);// résultats
    const [inputVille, setInputVille] = useState("");
    const [previsu, setPrevisu] = useState(false);
    const containerFermer = useRef(null)
    useEffect(() => {
        fetch("http://localhost:5000/api/weather")
            .then(res => res.json())
            .then(data => setVille(data))
            .catch(err => console.error(err));
    }, []);

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
    // if (!weather) return <p>Chargement...</p>;
    console.log(villeSearch)
    return (
        <main className="section-home">
            <section className="search-home">
                <h2>Bienvenue sur PreviZen</h2>
                <div className="phrase-accroche">
                    <p>Obtenez les dernières mises à jour météo pour votre ville et plus encore !</p>
                </div>
                <form action="">
                    <div className="input-loupe">
                        <input type="text" id="homeSearch" onChange={(e) => setInputVille(e.target.value)} placeholder="Entrer une ville" />
                        {previsu && (
                            <ul ref={containerFermer}>
                                {villeSearch.map((uneVille, index) => (
                                    <li key={index}><Link to={`/prevision/${uneVille.name.toLowerCase()}`}>{uneVille.name}, {uneVille.country} <img src={`../assets/drapeaux/${uneVille.country.toLowerCase()}.svg`} alt="" /></Link></li>
                                ))}
                            </ul>
                        )}
                    </div>


                    <button type="button" onClick={searchVille}>rechercher</button>

                </form>
            </section>
            {villes && (
                <section ref={containerFermer} className="section-dif-ville">
                    <h2>Explorer les villes</h2>
                    <section className="differente-ville">
                        {villes.map(ville => (

                            <MapPrevi key={ville.name} ville={ville} />

                        ))}

                    </section>
                </section>
            )}

        </main>

    )
}
export default Home