import '../../style/prevision.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDay, formatDateComplete } from '../../utils/formatDate.js';
import PrevisionForecast from './PrevisionForecast.js';
import MapPrevi from '../map/Map.js';
const Prevision = () => {
    const [villePrevi, setVillePrevi] = useState(null)
    const [forecastVille, setForecastVille] = useState(null)
    const location = useLocation();
    const { lat, lon } = location.state || {};
    useEffect(() => {
        if (lat && lon) {
            console.log()
            fetch(`http://localhost:5000/api/weather/${lat}/${lon}`)
                .then(res => res.json())
                .then(data => setVillePrevi(data))
                .catch(err => console.error(err));

            fetch(`http://localhost:5000/api/weather/forecast/${lat}/${lon}`)
                .then(res => res.json())
                .then(data => setForecastVille(data))
                .catch(err => console.error(err));
        } else {
            console.log('rien')
        }

    }, [lat, lon]);

    console.log("Coordonnées reçues :", lat, lon);
    console.log(villePrevi)
    console.log(forecastVille)
    if (!villePrevi || !forecastVille) {
        return <div className="loading">Chargement de la météo...</div>;
    }
    return (
        <main id="sect-prevision">
            <section className="prevision-ville">
                <h2>{villePrevi.name}</h2>
                <MapPrevi key={villePrevi.name} ville={villePrevi} zoom={9} formatDay={formatDay} formatDateComplete={formatDateComplete} />

            </section>
            {/* <section className="prevision-favoris">
                <h2>Favoris</h2>
            </section> */}
            <section className="prevision-jour">
                <h2>Prévision météo </h2>
                <section>
                    {forecastVille.list.map((unePrevi, index) => (

                        <PrevisionForecast key={index} formatDay={formatDay} formatDayComplete={formatDateComplete} unePrevi={unePrevi} />
                    ))}
                </section>

            </section>

        </main>

    )
}
export default Prevision