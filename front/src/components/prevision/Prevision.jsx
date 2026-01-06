import "../../style/prevision.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatDay, formatDateComplete } from "../../utils/formatDate.js";
import PrevisionForecast from "./PrevisionForecast.jsx";
import MapPrevi from "../map/Map.jsx";
import Cookies from "js-cookie";
import FavoriteButton from "../button/ButtonFavoris.jsx";
// 👇 Assure-toi que ce nom correspond bien à ton fichier (WeatherFeed ou WeatherSocial)
import WeatherSocial from "../social/WeatherSocial.jsx";

const Prevision = () => {
  const [listeVillesAffichees, setListeVillesAffichees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 NOUVEAU STATE : Stocke l'ID API de la ville dont le chat est ouvert
  const [activeFeedVilleId, setActiveFeedVilleId] = useState(null);

  const { ville } = useParams();
  const location = useLocation();
  const { lat, lon } = location.state || {};

  const [mesFavorisBDD, setMesFavorisBDD] = useState([]);
  const userCookie = Cookies.get("user_infos");
  const user = useMemo(
    () => (userCookie ? JSON.parse(userCookie) : null),
    [userCookie]
  );

  // 1. CHARGER FAVORIS
  const fetchFavorisBDD = useCallback(async () => {
    try {
      let data = [];
      if (user) {
        const res = await fetch("http://localhost:5000/favoris", {
          credentials: "include",
        });
        if (res.ok) data = await res.json();
      } else {
        data = JSON.parse(localStorage.getItem("favoris_guest")) || [];
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
        fetch(
          `http://localhost:5000/api/weather/forecast/${latitude}/${longitude}`
        ),
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
      } else if (ville) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/weather?q=${ville}`
          );
          const data = await res.json();
          if (data.coord)
            villesAFetcher.push({ lat: data.coord.lat, lon: data.coord.lon });
        } catch (e) {
          console.error(e);
        }
      } else {
        villesAFetcher = favorisActuels.map((fav) => ({
          lat: fav.lat,
          lon: fav.lon,
        }));
      }

      const resultats = await Promise.all(
        villesAFetcher.map((coords) =>
          fetchFullCityData(coords.lat, coords.lon)
        )
      );

      const villesFinales = resultats.filter((item) => item !== null);
      setListeVillesAffichees(villesFinales);

      // 👇 LOGIQUE D'OUVERTURE AUTOMATIQUE
      // Si on n'affiche qu'une seule ville (Recherche), on ouvre le chat direct
      if (villesFinales.length === 1) {
        setActiveFeedVilleId(villesFinales[0].current.id);
      } else {
        // Sinon (Liste de favoris), on laisse tout fermé par défaut pour ne pas surcharger
        setActiveFeedVilleId(null);
      }

      setLoading(false);
    };

    init();
  }, [lat, lon, ville, fetchFavorisBDD]);

  // DELETE CITY HANDLER
  const handleCityDelete = (openWeatherId) => {
    const isModeDashboardFavoris = !ville && (!lat || !lon);

    if (isModeDashboardFavoris) {
      setListeVillesAffichees((prevList) =>
        prevList.filter((item) => item.current.id !== openWeatherId)
      );
    } else {
      console.log("Ville retirée des favoris en mode détail.");
    }
  };

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

        // On récupère l'ID unique de la ville (donné par l'API Météo)
        const currentVilleId = current.id;

        return (
          <div key={currentVilleId || index} className="container-prevision">
            <section className="ville-container">
              <section className="prevision-ville">
                <h2>
                  {current.name}, {current.sys.country}
                  <FavoriteButton
                    villeActuelle={current}
                    listeFavorisBDD={mesFavorisBDD}
                    refreshFavoris={fetchFavorisBDD}
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

              {/* SECTION 2 : PRÉVISIONS SEMAINE */}
              <section className="prevision-jour">
                <h2>Prévisions</h2>
                <section className="forecast-container">
                  {forecast.list.map((unePrevi, i) => (
                    <PrevisionForecast
                      key={i}
                      formatDay={formatDay}
                      formatDayComplete={formatDateComplete}
                      unePrevi={unePrevi}
                      timezone={forecast.city.timezone}
                    />
                  ))}
                </section>
              </section>
            </section>

            <section className="social-section" style={{ marginTop: "30px" }}>
              {/* Bouton Toggle : Visible seulement si on a PLUSIEURS villes */}
              {listeVillesAffichees.length > 1 && (
                <button
                  onClick={() =>
                    setActiveFeedVilleId(
                      activeFeedVilleId === currentVilleId
                        ? null
                        : currentVilleId
                    )
                  }
                  className="btn-toggle-social"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor:
                      activeFeedVilleId === currentVilleId
                        ? "#e2e6ea"
                        : "#f8f9fa",
                  }}
                >
                  {activeFeedVilleId === currentVilleId
                    ? `Masquer les signalements`
                    : `Voir les signalements à ${current.name} `}
                </button>
              )}

              {/* Le Composant Social */}
              {/* S'affiche si :
                                1. C'est la seule ville affichée
                                2. OU si l'ID correspond à celui qu'on a cliqué
                            */}
              {(listeVillesAffichees.length === 1 ||
                activeFeedVilleId === currentVilleId) && (
                <div className="feed-wrapper animate-fade-in">
                  <WeatherSocial
                    id_ville={currentVilleId} // ID unique
                    nom_ville={current.name} // Nom pour l'affichage
                  />
                </div>
              )}
            </section>
          </div>
        );
      })}
    </main>
  );
};

export default Prevision;
