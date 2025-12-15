import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const FavoriteButton = ({ villeActuelle, listeFavorisBDD }) => {
    // Note : j'ai retiré 'refreshFavoris' des props car on suppose qu'il n'existe pas

    const [currentFavoriId, setCurrentFavoriId] = useState(null);
    const [loading, setLoading] = useState(false);

    // 👇 1. LE DRAPEAU "MODE MANUEL"
    // Si true, cela veut dire que l'utilisateur a modifié l'état manuellement.
    // On ignorera alors les mises à jour venant de la listeFavorisBDD (car elle est périmée).
    const hasManuallyChanged = useRef(false);

    // Pour détecter si on a changé de ville
    const prevLat = useRef(null);
    const prevLon = useRef(null);

    const userCookie = Cookies.get('user_infos');
    const user = userCookie ? JSON.parse(userCookie) : null;

    const lat = villeActuelle?.lat || villeActuelle?.coord?.lat;
    const lon = villeActuelle?.lon || villeActuelle?.coord?.lon;
    const nom = villeActuelle?.name || villeActuelle?.nom_ville;
    const pays = villeActuelle?.sys?.country || villeActuelle?.pays || villeActuelle?.country;

    // ==============================================
    // 1. SYNCHRONISATION INTELLIGENTE
    // ==============================================
    useEffect(() => {
        if (!lat || !lon) return;

        // A. DÉTECTION CHANGEMENT DE VILLE
        // Si on change de ville, on remet le "Mode Manuel" à false pour écouter la BDD
        if (prevLat.current !== lat || prevLon.current !== lon) {
            hasManuallyChanged.current = false;
            prevLat.current = lat;
            prevLon.current = lon;
        }

        // B. PROTECTION
        // Si on est en "Mode Manuel" (on a cliqué), on ne laisse PAS la vieille liste BDD
        // écraser notre état actuel. On sort de la fonction.
        if (hasManuallyChanged.current) {
            return;
        }

        // C. LOGIQUE CLASSIQUE (Seulement si on n'a pas touché au bouton)
        if (user) {
            if (listeFavorisBDD && listeFavorisBDD.length > 0) {
                const favoriTrouve = listeFavorisBDD.find(fav =>
                    Math.abs(fav.lat - lat) < 0.001 &&
                    Math.abs(fav.lon - lon) < 0.001
                );
                setCurrentFavoriId(favoriTrouve ? favoriTrouve.id_favori : null);
            } else {
                setCurrentFavoriId(null);
            }
        } else {
            // Logique invité inchangée
            const ls = JSON.parse(localStorage.getItem('favoris_guest')) || [];
            const existe = ls.some(fav =>
                Math.abs(fav.lat - lat) < 0.001 &&
                Math.abs(fav.lon - lon) < 0.001
            );
            setCurrentFavoriId(existe ? 'guest' : null);
        }

    }, [lat, lon, listeFavorisBDD, user]); // On garde les dépendances


    // ==============================================
    // 2. GESTION DU CLIC (Mise à jour Optimiste)
    // ==============================================
    const handleToggle = async () => {
        if (loading || !lat || !lon) return;

        setLoading(true);

        // 👇 ACTIVATION DU MODE MANUEL
        // À partir de maintenant, on ignore la prop listeFavorisBDD pour cette ville
        hasManuallyChanged.current = true;

        if (user) {

            try {
                console.log(currentFavoriId)
                if (currentFavoriId) {
                    // --- SUPPRESSION ---
                    console.log(currentFavoriId)
                    const res = await fetch('http://localhost:5000/favoris', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ id: currentFavoriId })
                    });

                    if (res.ok) {
                        // On met à jour l'état local NOUS-MÊME, sans attendre le parent
                        setCurrentFavoriId(null);
                    }
                } else {
                    // --- AJOUT ---
                    const res = await fetch('http://localhost:5000/favoris', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            nom_ville: nom,
                            pays: pays,
                            lat: lat,
                            lon: lon
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        console.log(data)
                        // On met à jour l'état local avec l'ID reçu de l'API
                        setCurrentFavoriId(data.id_favori);
                    }
                }
            } catch (err) {
                console.error("Erreur API", err);
                // Optionnel : En cas d'erreur, on repasse hasManuallyChanged à false 
                // pour réessayer la sync BDD au prochain rendu
                hasManuallyChanged.current = false;
            }
        } else {
            // (Code Invité identique à avant...)
            let ls = JSON.parse(localStorage.getItem('favoris_guest')) || [];
            if (currentFavoriId === 'guest') {
                ls = ls.filter(fav => !(Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001));
                setCurrentFavoriId(null);
            } else {
                ls.push({ nom_ville: nom, pays: pays, lat: lat, lon: lon });
                setCurrentFavoriId('guest');
            }
            localStorage.setItem('favoris_guest', JSON.stringify(ls));
        }

        setLoading(false);
    };

    const isFavorite = currentFavoriId !== null;

    return (
        <button className='btn-add-ville' onClick={handleToggle} disabled={loading}>
            <img
                src={isFavorite ? '../assets/picto/bouton-supprimer.png' : '../assets/picto/cercle.png'}
                alt={isFavorite ? "Retirer" : "Ajouter"}
                style={{ opacity: loading ? 0.5 : 1 }}
            />
        </button>
    );
};

export default FavoriteButton;