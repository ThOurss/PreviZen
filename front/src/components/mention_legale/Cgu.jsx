import "../../style/rgpd.css";

// --- CONFIGURATION ---
const APP_NAME = "PreviZen";
const CONTACT_EMAIL = "theo.villeneuve30@gmail.com";
const LAST_UPDATE = new Date().toLocaleDateString("fr-FR");

const Cgu = () => {
  return (
    <div className="rgpd-container">
      {/* En-tête */}
      <header className="rgpd-header">
        <h1>Conditions Générales d'Utilisation</h1>
        <p className="rgpd-date">Dernière mise à jour : {LAST_UPDATE}</p>
      </header>

      {/* Contenu */}
      <div className="rgpd-content">
        <section className="rgpd-section">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour
            objet de définir les modalités de mise à disposition des services de
            l'application <strong>{APP_NAME}</strong> et les conditions
            d'utilisation du service par l'Utilisateur.
          </p>
          <p>
            Tout accès et/ou utilisation de l'application suppose l'acceptation
            et le respect de l'ensemble des termes des présentes Conditions.
          </p>
        </section>

        <section className="rgpd-section">
          <h2>2. Description du Service</h2>
          <p>L'application {APP_NAME} permet aux utilisateurs de :</p>
          <ul>
            <li>Créer un compte personnel et sécurisé.</li>
            <li>Rechercher des villes via un système de géolocalisation.</li>
            <li>
              Consulter les prévisions météorologiques en temps réel et à venir.
            </li>
          </ul>
        </section>

        <section className="rgpd-section">
          <h2>3. Responsabilité liée aux données météo</h2>
          <div className="rgpd-alert">
            <strong>Clause de non-responsabilité importante :</strong>
            <br />
            Les données météorologiques affichées sur l'application proviennent
            de services tiers (notamment OpenWeatherMap). Bien que nous nous
            efforcions de fournir des informations précises,{" "}
            <strong>
              {APP_NAME} ne garantit pas l'exactitude, la fiabilité ou
              l'exhaustivité des prévisions météorologiques.
            </strong>
          </div>
          <p>
            En conséquence, l'éditeur ne saurait être tenu responsable des
            dommages directs ou indirects résultant de l'utilisation des
            informations météorologiques (ex: sortie annulée, intempéries non
            prévues).
          </p>
        </section>

        <section className="rgpd-section">
          <h2>4. Compte Utilisateur</h2>
          <p>
            L'accès à certaines fonctionnalités nécessite la création d'un
            compte. L'Utilisateur est responsable :
          </p>
          <ul>
            <li>
              De la sincérité des informations fournies lors de l'inscription.
            </li>
            <li>Du maintien de la confidentialité de son mot de passe.</li>
            <li>De toute activité effectuée depuis son compte.</li>
          </ul>
          <p>
            Nous nous réservons le droit de suspendre ou supprimer tout compte
            ne respectant pas les présentes CGU (propos injurieux, tentatives de
            piratage, etc.).
          </p>
        </section>

        <section className="rgpd-section">
          <h2>5. Propriété Intellectuelle</h2>
          <p>
            L'ensemble des éléments de l'application (code source, design,
            logos, base de données) est la propriété exclusive de l'éditeur,
            sauf mention contraire (ex: icônes météo libres de droits ou données
            OpenWeather).
          </p>
          <p>
            Toute reproduction ou copie non autorisée du code ou du design est
            interdite.
          </p>
        </section>

        <section className="rgpd-section">
          <h2>6. Disponibilité du Service</h2>
          <p>
            L'éditeur s'efforce de permettre l'accès à l'application 24 heures
            sur 24, 7 jours sur 7, sauf en cas de force majeure ou d'un
            événement hors du contrôle de l'éditeur (panne chez l'hébergeur,
            maintenance, coupure API tierce).
          </p>
        </section>

        <section className="rgpd-section">
          <h2>7. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige
            non résolu à l'amiable, les tribunaux français seront seuls
            compétents.
          </p>
        </section>

        {/* Pied de page contact */}
        <div className="contact-box">
          <p>Une question sur ces conditions ?</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
            Écrivez-nous à : {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cgu;
