
export const formatDay = (timestamp, timezone) => {
    // 1. Calcul du timestamp décalé

    const date = new Date((timestamp + timezone) * 1000);

    //Formatage de la date

    const dateString = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        timeZone: 'UTC'
    }).format(date)

    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
};

export const formatDateComplete = (timestamp, timezone) => {
    // 1. Calcul du timestamp décalé
    const date = new Date((timestamp + timezone) * 1000);
    //Formatage de la date
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',   // "30"
        month: 'long',
        timeZone: 'UTC'
    }).format(date) // Ex: "9 décembre"
};


