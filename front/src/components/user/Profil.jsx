import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Profil = ({ user }) => {
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Sécurité : Si pas d'user connecté, on ne fait rien
    if (!user || !user.userId) return;

    const fetchProfile = async () => {
      try {
        // On appelle l'API avec l'ID de l'user connecté
        const userCookie = Cookies.get("user_infos");

        if (!userCookie) {
          // Pas connecté ? On renvoie au login
          navigate("/connexion");
          return;
        }
        const response = await fetch(
          `http://localhost:5000/user/profil/${user.userId}`,
          {
            method: "GET",

            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFullProfile(data);
        }
      } catch (err) {
        console.error("Erreur chargement profil", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // On relance si l'user change

  // --- Rendu ---
  if (loading) return <div>Chargement du profil...</div>;
  if (!fullProfile) return <div>Impossible de charger les informations.</div>;

  console.log(fullProfile);

  return (
    <main id="user-profil">
      <h2>Votre Profil</h2>

      <section className="information-user">
        <form action="">
          <div>
            <fieldset>
              <legend>Prénom</legend>
              <div>
                <input type="text" />
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>Nom</legend>
              <div>
                <input type="text" />
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>Email</legend>
              <div>
                <input type="text" />
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>Civilite</legend>
              <div>
                <div>
                  <label htmlFor="">Monsieur</label>
                  <input type="radio" name="" id="" />
                </div>
                <div>
                  <label htmlFor="">Madame</label>
                  <input type="radio" name="" id="" />
                </div>
                <div>
                  <label htmlFor="">Autres</label>
                  <input type="radio" name="" id="" />
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </section>
    </main>
  );
};
export default Profil;
