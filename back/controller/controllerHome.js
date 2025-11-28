import axios from "axios";
import { KEY_API } from "../config/db.config.js";

export const getWeather = async (req, res) => {
    try {
        const cities = ["New York", "Tokyo", "Londres", "Paris", "Shanghai", "Dubaï"];
        const promises = cities.map(city => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY_API}&units=metric&lang=fr`;
            return axios.get(url).then(response => response.data);
        });

        // utilisation de axios.get()
        const weatherData = await Promise.all(promises);

        // Renvoie un array avec les données météo de chaque ville
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à OpenWeatherMap" });
    }
};
