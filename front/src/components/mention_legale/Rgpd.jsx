import "../../style/rgpd.css";

// --- CONFIGURATION ---
const APP_NAME = "PreviZen";
const CONTACT_EMAIL = "theo.villeneuve30@gmail.com";
const COMPANY_NAME = "PreviZen Inc.";
const LAST_UPDATE = new Date().toLocaleDateString("fr-FR"); // Date du jour automatique

const Rgpd = () => {
  return (
    <div className="rgpd-container">
      {/* En-tête */}
      <header className="rgpd-header">
        <h1>Politique de Confidentialité</h1>
        <p className="privacy-date">Dernière mise à jour : {LAST_UPDATE}</p>
      </header>

      {/* Contenu */}
      <div className="rgpd-content">
        <section className="rgpd-section">
          <h2>1. Introduction</h2>
          <p>
            La présente politique vise à vous informer sur la manière dont
            l'application <strong>{APP_NAME}</strong>
            collecte, utilise et protège vos données personnelles, conformément
            au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </section>

        <section className="rgpd-section">
          <h2>2. Responsable du traitement</h2>
          <p>Le responsable du traitement des données est :</p>
          <ul>
            <li>
              <strong>Identité :</strong> {COMPANY_NAME}
            </li>
            <li>
              <strong>Contact :</strong> {CONTACT_EMAIL}
            </li>
          </ul>
        </section>

        <section className="rgpd-section">
          <h2>3. Données collectées</h2>
          <p>
            Dans le cadre de l'utilisation de l'application, nous sommes amenés
            à collecter les catégories de données suivantes :
          </p>
          <ul>
            <li>
              <strong>Données d'identité :</strong> Nom, Prénom, Civilité.
            </li>
            <li>
              <strong>Données de contact :</strong> Email, Pays.
            </li>
            <li>
              <strong>Données techniques :</strong> Logs de connexion, adresse
              IP.
            </li>
            <li>
              <strong>Données météorologiques :</strong> Historique des villes
              recherchées.
            </li>
          </ul>
          <div className="rgpd-alert">
            <strong>Note importante :</strong> Vos mots de passe ne sont jamais
            stockés en clair. Ils sont sécurisés via un algorithme de hachage
            complexe avant d'être enregistrés en base de données.
          </div>
        </section>

        <section className="rgpd-section">
          <h2>4. Finalités du traitement</h2>
          <p>Vos données sont collectées pour :</p>
          <ol>
            <li>
              La gestion de votre compte utilisateur et l'authentification.
            </li>
            <li>
              L'obtention des prévisions météo locales (via nos partenaires).
            </li>
            <li>
              L'élaboration de statistiques anonymes (répartition par pays).
            </li>
            <li>La sécurité de l'application.</li>
          </ol>
        </section>

        <section className="rgpd-section">
          <h2>5. Partage des données</h2>
          <p>
            Vos données personnelles sont confidentielles. Elles ne sont
            partagées qu'avec les services tiers indispensables au
            fonctionnement :
          </p>
          <ul>
            <li>
              <strong>OpenWeatherMap / API Gouv :</strong> Uniquement vos
              coordonnées géographiques (Latitude/Longitude) ou le nom de la
              ville.{" "}
              <strong>
                Aucune donnée personnelle (Nom, Email) n'est transmise à ces
                services.
              </strong>
            </li>
            <li>
              <strong>L'équipe technique :</strong> Pour la maintenance du
              serveur.
            </li>
          </ul>
        </section>

        <section className="rgpd-section">
          <h2>6. Vos droits et l'Anonymisation (Droit à l'oubli)</h2>
          <p>
            Conformément au RGPD, vous pouvez demander à tout moment la
            suppression de votre compte. Nous appliquons alors une procédure
            stricte d'<strong>anonymisation irréversible</strong> :
          </p>
          <ul>
            <li>Votre nom est remplacé par "Anonyme".</li>
            <li>Votre email est remplacé par une chaîne aléatoire unique .</li>
            <li>Vos données sensibles sont définitivement supprimées.</li>
            <li>
              Seul le pays peut être conservé à des fins statistiques globales,
              sans lien avec votre identité.
            </li>
          </ul>
        </section>

        <section className="rgpd-section">
          <h2>7. Cookies et Traceurs</h2>
          <p>
            Cette application utilise un stockage local (Token
            d'authentification) pour maintenir votre session active. Aucun
            cookie publicitaire tiers n'est utilisé.
          </p>
        </section>

        {/* Pied de page contact */}
        <div className="contact-box">
          <p>Une question sur vos données ?</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
            Contactez notre DPO à : {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Rgpd;
