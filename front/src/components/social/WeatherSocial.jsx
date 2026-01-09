import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import "../../style/weathersocial.css";

// On reçoit id_ville (ex: 2988507) et nom_ville (ex: "Paris")
const WeatherSocial = ({ id_ville, nom_ville }) => {
  //variable d’état
  const [reports, setReports] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  //  Vérifier l'utilisateur connecté au montage
  useEffect(() => {
    const userCookie = Cookies.get("user_infos");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error("Cookie invalide");
      }
    }
  }, []);

  // Fonction pour charger les commentaires (stable avec useCallback)
  // (utile plus tard avec les historiques)
  const fetchReports = useCallback(async () => {
    if (!id_ville) return;
    setLoading(true);
    setError(null);
    try {
      // APPEL API avec l'ID unique
      const response = await fetch(
        `http://localhost:5000/liveupdate/?id_ville=${id_ville}`
      );
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        throw new Error("Erreur chargement");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le flux en direct.");
    } finally {
      setLoading(false);
    }
  }, [id_ville]); // Se relance uniquement si l'ID change

  // Charger les données quand id_ville change
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // //fonction qui gère l'envoi des commentaires
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch("http://localhost:5000/liveupdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newMessage,
          id_ville: id_ville, // L'ID unique
          nom_ville: nom_ville, // Le nom pour contexte
        }),
      });

      if (response.ok) {
        setNewMessage(""); // Reset input
        fetchReports(); // Rafraîchir la liste
      } else {
        alert("Erreur lors de la publication.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  };

  // date relative (ex: "il y a 5 min")
  const timeSince = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min";
    return Math.floor(seconds) + " s";
  };

  // --- RENDU JSX ---
  return (
    <div className="weather-feed-container animate-fade-in">
      <h3 className="feed-title"> Le Direct à {nom_ville}</h3>

      {/* --- ZONE DE SAISIE (Si connecté) --- */}
      {user ? (
        <form onSubmit={handlePublish} className="feed-form">
          <textarea
            className="feed-textarea"
            placeholder={`Qu'observez-vous à ${nom_ville} ? (Pluie, bouchons...)`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={280}
            rows={3}
          />
          <div className="form-footer">
            <span>{newMessage.length}/280</span>
            <button
              type="submit"
              className="btn-publish"
              disabled={!newMessage.trim()}
            >
              Publier
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p> Connectez-vous pour partager vos observations météo.</p>
        </div>
      )}

      {/* --- LISTE DES REPORTS --- */}
      <div className="feed-list">
        {loading && <div className="loading-feed">Chargement du direct...</div>}
        {error && <div className="error-feed">{error}</div>}

        {!loading && !error && reports.length === 0 && (
          <div className="empty-feed">
            Aucun signalement récent. Soyez le premier !
          </div>
        )}

        {reports.map((repo) => (
          <article key={repo.id_live} className="report-card animate-pop">
            <div className="report-header">
              {/* Avatar sinon rond gris */}
              <div
                className="author-avatar"
                style={
                  repo.author?.avatar
                    ? { backgroundImage: `url(${repo.author.avatar})` }
                    : {}
                }
              ></div>
              <span className="author-name">
                {repo.liveUser
                  ? repo.liveUser.username + " " + repo.liveUser.firstname
                  : "Anonyme"}
              </span>
              <span className="report-date">{timeSince(repo.createdAt)}</span>
            </div>
            <p className="report-content">{repo.contenu}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WeatherSocial;
