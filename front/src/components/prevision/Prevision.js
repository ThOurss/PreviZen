import '../../style/prevision.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDay, formatDateComplete } from '../../utils/formatDate.js';
import PrevisionForecast from './PrevisionForecast.js';
import MapPrevi from '../map/Map.js';
import Cookies from 'js-cookie';
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

    const addToFavoris = async (villeActuelle) => {
        // 1. On récupère l'utilisateur depuis le cookie
        const userCookie = Cookies.get('user_infos');
        const user = userCookie ? JSON.parse(userCookie) : null;
        console.log('here')
        if (user) {
            // 🟦 CAS 1 : UTILISATEUR CONNECTÉ (On envoie à la BDD)
            try {
                // Note : Pas besoin de headers 'Authorization' car le token 
                // est dans le cookie HttpOnly géré par le navigateur.
                // Par contre, 'credentials: include' est OBLIGATOIRE.
                console.log(villeActuelle)
                const dataToSend = {
                    nom_ville: villeActuelle.name,
                    pays: villeActuelle.sys.country,
                    lat: villeActuelle.coord.lat,
                    lon: villeActuelle.coord.lon

                }
                const response = await fetch('http://localhost:5000/favoris/addFavoris', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // 👈 C'est ça qui transporte ton token Auth !
                    body: JSON.stringify(dataToSend)
                });
                console.log(response)
                if (response.ok) {
                    alert("Sauvegardé sur votre compte !");
                } else {
                    alert("Erreur lors de la sauvegarde.");
                }
            } catch (err) {
                console.error(err);
            }

        } else {
            // 🟧 CAS 2 : INVITÉ (On utilise le LocalStorage du navigateur)

            const favorisExistants = JSON.parse(localStorage.getItem('favoris_guest')) || [];

            // On vérifie les doublons avec lat/lon
            const existeDeja = favorisExistants.find(v =>
                v.lat === villeActuelle.lat && v.lon === villeActuelle.lon
            );

            if (!existeDeja) {
                favorisExistants.push(villeActuelle);
                localStorage.setItem('favoris_guest', JSON.stringify(favorisExistants));
                alert("Sauvegardé dans votre navigateur !");
            } else {
                alert("Déjà dans vos favoris !");
            }
        }
    };

    console.log("Coordonnées reçues :", lat, lon);
    console.log(villePrevi)
    console.log(forecastVille)

    if (!villePrevi || !forecastVille) {
        return <div className="loading">Chargement de la météo...</div>;
    }
    return (
        <main id="sect-prevision">
            <section className="prevision-ville">
                <h2>{villePrevi.name} <button className='btn-add-ville' onClick={() => addToFavoris(villePrevi)}><img src="../assets/picto/cercle.png" alt="" /></button></h2>
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