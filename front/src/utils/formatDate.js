

export const formatDay = (timestamp) => {
    // 1. Convertir le timestamp (secondes) en millisecondes pour JS (* 1000)
    const date = new Date(timestamp * 1000);

    // 2. Utiliser l'outil de formatage natif de JS
    const options = { weekday: 'long' }; // 'long' = Lundi, 'short' = Lun

    // 3. Retourner en français
    // On met une majuscule au début (car JS renvoie "lundi")
    const jour = date.toLocaleDateString('fr-FR', options);
    return jour.charAt(0).toUpperCase() + jour.slice(1);
};

export const formatDateComplete = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long'
    }); // Ex: "9 décembre"
};