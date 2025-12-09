import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
const Prevision = () => {
    const [villePrevi, setVillePrevi] = useState(null)
    const location = useLocation();
    const { lat, lon } = location.state || {};
    useEffect(() => {
        if (lat && lon) {
            console.log()
            fetch(`http://localhost:5000/api/weather/${lat}/${lon}`)
                .then(res => res.json())
                .then(data => setVillePrevi(data))
                .catch(err => console.error(err));
        } else {
            console.log('rien')
        }

    }, [lat, lon]);
    console.log("Coordonnées reçues :", lat, lon);
    console.log(villePrevi)
    if (!villePrevi) {
        return <div className="loading">Chargement de la météo...</div>;
    }
    return (
        <main id="sect-prevision">
            <h2>{villePrevi.name}</h2>
            <img src={`https://openweathermap.org/img/wn/${villePrevi.weather[0].icon}@2x.png`} alt="" />
            <p>{ }</p>
        </main>

    )
}
export default Prevision