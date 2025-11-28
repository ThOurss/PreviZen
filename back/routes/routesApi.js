import { Router } from "express";
const router = Router();
import { getWeather } from "../controller/controllerHome.js";

router.get("/weather", getWeather);

export default router;
