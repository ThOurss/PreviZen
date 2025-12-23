import '../../style/prevision.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { formatDay, formatDateComplete } from '../../utils/formatDate.js';
import PrevisionForecast from './PrevisionForecast.jsx';
import MapPrevi from '../map/Map.jsx';
import Cookies from 'js-cookie';
import FavoriteButton from '../button/ButtonFavoris.jsx';

const Prevision = () => {
    const [listeVillesAffichees, setListeVillesAffichees] = useState([]);
    const [loading, setLoading] = useState(true);

    const { ville } = useParams();
    const location = useLocation();
    const { lat, lon } = location.state || {};

    const [mesFavorisBDD, setMesFavorisBDD] = useState([]);
    const userCookie = Cookies.get('user_infos');
    const user = useMemo(() => userCookie ? JSON.parse(userCookie) : null, [userCookie]);

    // 1. CHARGER FAVORIS
    const fetchFavorisBDD = useCallback(async () => {
        try {
            let data = [];
            if (user) {
                const res = await fetch('http://localhost:5000/favoris', { credentials: 'include' });
                if (res.ok) data = await res.json();
            } else {
                data = JSON.parse(localStorage.getItem('favoris_guest')) || [];
            }
            setMesFavorisBDD(data);
            return data;
        } catch (err) {
            console.error("Erreur favoris", err);
            return [];
        }
    }, [user]);

    // 2. FETCH DATA CITY
    const fetchFullCityData = async (latitude, longitude) => {
        try {
            const [resWeather, resForecast] = await Promise.all([
                fetch(`http://localhost:5000/api/weather/${latitude}/${longitude}`),
                fetch(`http://localhost:5000/api/weather/forecast/${latitude}/${longitude}`)
            ]);

            const weather = await resWeather.json();
            const forecast = await resForecast.json();

            return { current: weather, forecast: forecast };
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // 3. EFFECT INITIAL
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setListeVillesAffichees([]);

            const favorisActuels = await fetchFavorisBDD();
            let villesAFetcher = [];

            if (lat && lon) {
                villesAFetcher.push({ lat, lon });
            }
            else if (ville) {
                try {
                    const res = await fetch(`http://localhost:5000/api/weather?q=${ville}`);
                    const data = await res.json();
                    if (data.coord) villesAFetcher.push({ lat: data.coord.lat, lon: data.coord.lon });
                } catch (e) { console.error(e); }
            }
            else {
                villesAFetcher = favorisActuels.map(fav => ({ lat: fav.lat, lon: fav.lon }));
            }

            const resultats = await Promise.all(
                villesAFetcher.map(coords => fetchFullCityData(coords.lat, coords.lon))
            );

            setListeVillesAffichees(resultats.filter(item => item !== null));
            setLoading(false);
        };

        init();
    }, [lat, lon, ville, fetchFavorisBDD]);



    // Cette fonction est appelée par l'enfant quand on clique sur supprimer
    const handleCityDelete = (openWeatherId) => {
        // Est-ce qu'on est sur la page "prevision mes favoris" (Dashboard) ?
        // On le sait si 'ville' est vide ET qu'on a pas de coordonnées GPS dans le state
        const isModeDashboardFavoris = !ville && (!lat || !lon);

        if (isModeDashboardFavoris) {
            // Si oui, on retire la ville du tableau pour qu'elle disparaisse de l'écran
            setListeVillesAffichees(prevList =>
                prevList.filter(item => item.current.id !== openWeatherId)
            );
        } else {
            // Si on est sur une page spécifique (ex: /prevision/Paris), 
            // on ne fait rien de spécial, le bouton changera juste d'état (cœur vide)
            console.log("Ville retirée des favoris, mais on la garde affichée car vous êtes sur sa page détail.");
        }
    };

console.log(listeVillesAffichees)
    // ===========================================
    // RENDU
    // ===========================================
    if (loading) return <div className="loading">Chargement...</div>;

    if (listeVillesAffichees.length === 0) {
        return <div className="no-data">Aucune ville à afficher.</div>;
    }

    return (
        <main id="sect-prevision">
            {listeVillesAffichees.map((item, index) => {
                const { current, forecast } = item;

                return (
                    <div key={index} className="ville-container" >
                        <section className="prevision-ville">
                            <h2>
                                {current.name}, {current.sys.country}
                                <FavoriteButton
                                    villeActuelle={current}
                                    listeFavorisBDD={mesFavorisBDD}
                                    refreshFavoris={fetchFavorisBDD}

                                    // 👇 On passe la fonction au bouton
                                    onDelete={handleCityDelete}
                                />
                            </h2>
                            <MapPrevi
                                key={current.name}
                                ville={current}
                                zoom={9}
                                formatDay={formatDay}
                                formatDateComplete={formatDateComplete}
                            />
                        </section>

                        <section className="prevision-jour">
                            <h2>Prévisions </h2>
                            <section className="forecast-container">
                                {forecast.list.map((unePrevi, i) => (
                                    <PrevisionForecast
                                        key={i}
                                        formatDay={formatDay}
                                        formatDayComplete={formatDateComplete}
                                        unePrevi={unePrevi}
                                    />
                                ))}
                            </section>
                        </section>


                    </div>
                );
            })}
        </main>
    );
}

export default Prevision;