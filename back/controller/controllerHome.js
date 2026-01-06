import axios from "axios";
import { KEY_API } from "../config/db.config.js";

export const getWeather = async (req, res) => {
    try {

        const cities = [5128581, 1850147, 2643743, 2968815, 1796236, 292223];

        const promises = cities.map(ville => {
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${ville}&appid=${KEY_API}&units=metric&lang=fr`;
            return axios.get(url).then(response => response.data);
        });

        //https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}
        const weatherData = await Promise.all(promises);

        // Renvoie un array avec les données météo de chaque ville
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à OpenWeatherMap" });
    }
};
export const getPreviByVille = async (req, res) => {
    try {
        const { ville } = req.params;

        if (!ville) {
            return res.status(400).json({ error: "Veuillez fournir le nom d'une ville" });
        }

        const url = `http://api.openweathermap.org/geo/1.0/direct`
        const response = await axios.get(url, {
            params: { q: ville, appid: KEY_API, limit: 5 }
        });
        // const filtered = response.data.filter(
        //       c => c.name.toLowerCase() === ville.toLowerCase()
        //     );
        const data = response.data;

        if (!data.length) {
            return res.status(404).json({ error: "Aucune ville trouvée" });
        }
        // const previVille = data.map(c =>
        //     axios.get("https://api.openweathermap.org/data/2.5/weather", {
        //         params: {
        //             lat: c.lat,
        //             lon: c.lon,
        //             appid: KEY_API,
        //             units: "metric",
        //             lang: "fr"
        //         }
        //     }).then(resp => resp.data)
        // );
        // const promeseVille = await Promise.all(previVille);
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à OpenWeatherMap" });
    }

}
export const getPreviByLonLat = async (req, res) => {
    try {
        const { lat, lon } = req.params;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Veuillez fournir le nom d'une ville" });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather`
        const response = await axios.get(url, {
            params: { lat: lat, lon: lon, appid: KEY_API, units: 'metric', lang: 'fr' }
        });
        // const filtered = response.data.filter(
        //       c => c.name.toLowerCase() === ville.toLowerCase()
        //     );
        const data = response.data;

        // if (!data.length) {
        //     return res.status(404).json({ error: "Aucune ville trouvée" });
        // }
        // const previVille = data.map(c =>
        //     axios.get("https://api.openweathermap.org/data/2.5/weather", {
        //         params: {
        //             lat: c.lat,
        //             lon: c.lon,
        //             appid: KEY_API,
        //             units: "metric",
        //             lang: "fr"
        //         }
        //     }).then(resp => resp.data)
        // );
        // const promeseVille = await Promise.all(previVille);
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à OpenWeatherMap" });
    }

}
export const getPreviForecast = async (req, res) => {
    try {
        const { lat, lon } = req.params;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Veuillez fournir le nom d'une ville" });
        }

        const url = `https://api.openweathermap.org/data/2.5/forecast/daily`
        const response = await axios.get(url, {
            params: { lat: lat, lon: lon, cnt: 16, appid: KEY_API, units: 'metric', lang: 'fr' }
        });
        // const filtered = response.data.filter(
        //       c => c.name.toLowerCase() === ville.toLowerCase()
        //     );
        const data = response.data;

        data.list = data.list.slice(1)
        data.cnt = data.list.length
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'appel à OpenWeatherMap" });
    }

}
export const getMap = (req, res) => {
    const { layer, z, x, y } = req.params;
    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${KEY_API}`;
    res.redirect(url);
};
