import { Router } from "express";

import { getMap, getPreviByLonLat, getPreviByVille, getWeather } from "../controller/controllerHome.js";
const router = Router();
router.get("/weather", getWeather);
router.get("/weather/:ville", getPreviByVille)
router.get("/weather/:lat/:lon", getPreviByLonLat)
router.get("/tiles/:layer/:z/:x/:y", getMap);
export default router;
