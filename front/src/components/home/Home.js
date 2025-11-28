import "../../style/home.css";
import { useEffect, useState } from "react";

const Home = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/weather")
            .then(res => res.json())
            .then(data => setWeather(data))
            .catch(err => console.error(err));
    }, []);
    // if (!weather) return <p>Chargement...</p>;
    console.log(weather)
    return (
        <section className="section-home">
            <section className="search-home">
                <h2>Bienvenue sur PreviZen</h2>
                <div className="phrase-accroche">
                    <p>Obtenez les dernières mises à jour météo pour votre ville et plus encore !</p>
                </div>
                <form action="">
                    <div className="input-loupe">
                        <input type="text" name="" id="" placeholder="Entrer une ville" />

                    </div>

                    <button type="submit">rechercher</button>

                </form>
            </section>
            <section>
                <h2>Explorer les villes</h2>
                <section className="differente-ville">

                </section>
            </section>
        </section>

    )
}
export default Home