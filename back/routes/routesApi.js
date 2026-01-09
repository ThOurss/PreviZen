import { Router } from "express";

import { getMap, getPreviByLonLat, getPreviByVille, getPreviForecast, getWeather } from "../controller/controllerHome.js";
const router = Router();
router.get("/weather", getWeather); // route pour recuperer les données des 6 villes choisi
router.get("/weather/:ville", getPreviByVille) // route pour recuperer les données d'une ville
router.get("/weather/:lat/:lon", getPreviByLonLat) // route pour recuperer les données d'une ville par sa longitude et latitude
router.get('/weather/forecast/:lat/:lon', getPreviForecast) // Route pour récupérer les données prévisionnelles d'une ville
router.get("/tiles/:layer/:z/:x/:y", getMap); // Route pour appliquer une couche météo (pas utilisé actuellement)
export default router;
