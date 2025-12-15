import '../../style/prevision.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom'; // 👈 Ajout de useParams et Link
import { formatDay, formatDateComplete } from '../../utils/formatDate.js';
import PrevisionForecast from './PrevisionForecast.js';
import MapPrevi from '../map/Map.js';
import Cookies from 'js-cookie';
import FavoriteButton from '../button/ButtonFavoris.js';

const Prevision = () => {
    // 1. Récupération des paramètres (URL ou State de navigation)
    const { ville } = useParams(); // Pour l'accès via /prevision/Paris
    const location = useLocation();
    const { lat, lon } = location.state || {}; // Pour l'accès via clic géolocalisé

    const [villePrevi, setVillePrevi] = useState(null);
    const [forecastVille, setForecastVille] = useState(null);
    const [mesFavorisBDD, setMesFavorisBDD] = useState([]);
    const [loading, setLoading] = useState(true); // 👈 Gestion du chargement

    const userCookie = Cookies.get('user_infos');
    const user = useMemo(() => {
        return userCookie ? JSON.parse(userCookie) : null;
    }, [userCookie]);

    // =========================================================
    // 2. RECUPERATION DES FAVORIS (User + Guest)
    // =========================================================
    const fetchFavoris = useCallback(async () => {
        try {
            let data = [];
            if (user) {
                // Mode Connecté
                const res = await fetch('http://localhost:5000/favoris', {
                    credentials: 'include'
                });
                if (res.ok) {
                    data = await res.json();
                }
            } else {
                // Mode Invité (LocalStorage)
                data = JSON.parse(localStorage.getItem('favoris_guest')) || [];
            }
            setMesFavorisBDD(data);
        } catch (err) {
            console.error("Erreur chargement favoris", err);
        }
    }, [user]);

    // =========================================================
    // 3. EFFECT PRINCIPAL : Orchestre le chargement de la page
    // =========================================================
    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            setVillePrevi(null); // Reset pour éviter d'afficher l'ancienne ville

            // A. On charge toujours les favoris en premier
            await fetchFavoris();

            // B. Cas 1 : Coordonnées disponibles (via state navigation)
            if (lat && lon) {
                try {
                    // Météo Actuelle
                    const resWeather = await fetch(`http://localhost:5000/api/weather/${lat}/${lon}`);
                    const dataWeather = await resWeather.json();
                    setVillePrevi(dataWeather);

                    // Prévisions
                    const resForecast = await fetch(`http://localhost:5000/api/weather/forecast/${lat}/${lon}`);
                    const dataForecast = await resForecast.json();
                    setForecastVille(dataForecast);
                } catch (err) {
                    console.error(err);
                }
            }
            // C. Cas 2 : Nom de ville dans l'URL (ex: /prevision/Paris)
            else if (ville) {
                try {
                    // ⚠️ ADAPTER LA ROUTE : Assure-toi que ton back gère la recherche par nom
                    // Exemple : GET /api/weather?q=Paris
                    const nomDecoded = decodeURIComponent(ville);
                    const resWeather = await fetch(`http://localhost:5000/api/weather?q=${nomDecoded}`);

                    if (resWeather.ok) {
                        const dataWeather = await resWeather.json();
                        setVillePrevi(dataWeather);

                        // Une fois qu'on a la ville par nom, on récupère ses coords pour le forecast
                        const { coord } = dataWeather;
                        if (coord) {
                            const resForecast = await fetch(`http://localhost:5000/api/weather/forecast/${coord.lat}/${coord.lon}`);
                            setForecastVille(await resForecast.json());
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            // D. Cas 3 : Ni coords ni nom -> On reste sur la liste des favoris (villePrevi reste null)

            setLoading(false);
        };

        loadPageData();

    }, [lat, lon, ville, fetchFavoris]); // Dépendances mises à jour


    // =========================================================
    // 4. RENDU VISUEL
    // =========================================================

    if (loading) {
        return <div className="loading">Chargement de la météo...</div>;
    }

    // CAS : Affichage de la liste des favoris (Dashboard)
    // On affiche ceci si aucune ville n'est chargée
    if (!villePrevi) {
        return (
            <main id="sect-prevision-favoris">
                <section className="prevision-favoris-list">
                    <h2>Mes Favoris</h2>
                    {mesFavorisBDD.length === 0 ? (
                        <p>Vous n'avez pas encore de favoris.</p>
                    ) : (
                        <div className="grid-favoris">
                            {mesFavorisBDD.map((fav, index) => (
                                <Link
                                    to={`/prevision/${fav.nom_ville}`}
                                    key={index}
                                    className="card-favori"
                                >
                                    <h3>{fav.nom_ville}</h3>
                                    <span>{fav.pays}</span>
                                    {/* Tu pourrais ajouter une mini météo ici si tu veux */}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        );
    }

    // CAS : Affichage Détail Ville + Prévisions
    return (
        <main id="sect-prevision">
            <section className="prevision-ville">
                <h2>
                    {villePrevi.name}
                    {/* Le bouton reçoit maintenant la liste complète à jour */}
                    <FavoriteButton
                        villeActuelle={villePrevi}
                        listeFavorisBDD={mesFavorisBDD}
                        refreshFavoris={fetchFavoris}
                    />
                </h2>

                <MapPrevi
                    key={villePrevi.name}
                    ville={villePrevi}
                    zoom={9}
                    formatDay={formatDay}
                    formatDateComplete={formatDateComplete}
                />
            </section>

            {forecastVille && (
                <section className="prevision-jour">
                    <h2>Prévision météo</h2>
                    <section className="forecast-container">
                        {forecastVille.list.map((unePrevi, index) => (
                            <PrevisionForecast
                                key={index}
                                formatDay={formatDay}
                                formatDayComplete={formatDateComplete}
                                unePrevi={unePrevi}
                            />
                        ))}
                    </section>
                </section>
            )}
        </main>
    );
};

export default Prevision;