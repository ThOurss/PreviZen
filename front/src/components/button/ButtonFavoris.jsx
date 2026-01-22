import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

// 👇 Ajout de 'onDelete' dans les props reçues
const FavoriteButton = ({
  villeActuelle,
  listeFavorisBDD,
  refreshFavoris,
  onDelete,
}) => {
  //variable d’état
  const [currentFavoriId, setCurrentFavoriId] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasManuallyChanged = useRef(false);
  const prevLat = useRef(null);
  const prevLon = useRef(null);

  const userCookie = Cookies.get("user_infos");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const lat = villeActuelle?.lat || villeActuelle?.coord?.lat;
  const lon = villeActuelle?.lon || villeActuelle?.coord?.lon;
  const nom = villeActuelle?.name || villeActuelle?.nom_ville;
  const pays =
    villeActuelle?.sys?.country ||
    villeActuelle?.pays ||
    villeActuelle?.country;

  useEffect(() => {
    if (!lat || !lon) return;

    if (prevLat.current !== lat || prevLon.current !== lon) {
      hasManuallyChanged.current = false;
      prevLat.current = lat;
      prevLon.current = lon;
    }

    if (hasManuallyChanged.current) return;

    if (user) {
      if (listeFavorisBDD && listeFavorisBDD.length > 0) {
        const favoriTrouve = listeFavorisBDD.find(
          (fav) =>
            Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001,
        );
        setCurrentFavoriId(favoriTrouve ? favoriTrouve.id_favori : null);
      } else {
        setCurrentFavoriId(null);
      }
    } else {
      const ls = JSON.parse(localStorage.getItem("favoris_guest")) || [];
      const existe = ls.some(
        (fav) =>
          Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001,
      );
      setCurrentFavoriId(existe ? "guest" : null);
    }
  }, [lat, lon, listeFavorisBDD, user]);

  // ==============================================
  //  GESTION DU CLIC
  // ==============================================
  const handleToggle = async () => {
    if (loading || !lat || !lon) return;

    setLoading(true);
    hasManuallyChanged.current = true;

    if (user) {
      try {
        if (currentFavoriId) {
          // --- SUPPRESSION ---
          const res = await fetch("http://localhost:5000/favoris", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: currentFavoriId }),
          });

          if (res.ok) {
            setCurrentFavoriId(null);

            // On rafraichit la liste globale (optionnel si on delete visuellement)
            if (refreshFavoris) refreshFavoris();

            // ICI : On prévient le parent de supprimer la ville de l'écran
            // On passe l'ID OpenWeather (villeActuelle.id) pour que le parent sache qui supprimer
            if (onDelete) onDelete(villeActuelle.id);
          }
        } else {
          // --- AJOUT ---
          const res = await fetch("http://localhost:5000/favoris", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              nom_ville: nom,
              pays: pays,
              lat: lat,
              lon: lon,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setCurrentFavoriId(data.id_favori);
            if (refreshFavoris) refreshFavoris();
          }
        }
      } catch (err) {
        console.error("Erreur API", err);
        hasManuallyChanged.current = false;
      }
    } else {
      // GESTION INVITÉ
      let ls = JSON.parse(localStorage.getItem("favoris_guest")) || [];
      if (currentFavoriId === "guest") {
        ls = ls.filter(
          (fav) =>
            !(
              Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001
            ),
        );
        setCurrentFavoriId(null);

        // Suppression visuelle immédiate pour l'invité aussi
        if (onDelete) onDelete(villeActuelle.id);
      } else {
        ls.push({ nom_ville: nom, pays: pays, lat: lat, lon: lon });
        setCurrentFavoriId("guest");
      }
      localStorage.setItem("favoris_guest", JSON.stringify(ls));
      if (refreshFavoris) refreshFavoris();
    }

    setLoading(false);
  };

  const isFavorite = currentFavoriId !== null;

  return (
    <button
      className="btn-add-ville"
      onClick={handleToggle}
      disabled={loading}
      title={isFavorite ? "Supprimer des favoris" : "Ajouter au favoris"}
    >
      <img
        src={
          isFavorite
            ? "../assets/picto/bouton-supprimer.png"
            : "../assets/picto/cercle.png"
        }
        alt={isFavorite ? "Retirer des favoris" : "Ajouter des favoris"}
        style={{ opacity: loading ? 0.5 : 1 }}
      />
    </button>
  );
};

export default FavoriteButton;
