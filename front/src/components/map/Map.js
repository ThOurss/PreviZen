import { MapContainer, TileLayer } from 'react-leaflet';
import { Link, useLocation } from "react-router-dom";

const MapPrevi = ({ ville, layer = "rain", zoom, formatDay, formatDateComplete }) => {
    const location = useLocation();
    return (
        <article>
            <MapContainer center={[ville.coord.lat, ville.coord.lon]} zoom={zoom} className='map-container'>
                {/* Fond OpenStreetMap */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Couche météo via backend */}
                {/* <TileLayer
                    url={`http://localhost:5000/api/tiles/${layer}/{z}/{x}/{y}`}
                    opacity={0.6}
                /> */}

            </MapContainer>
            {location.pathname === "/" && (
                <div className="data-ville">
                    <h3> <Link to={`/prevision/${ville.name.toLowerCase()}`} state={{ lat: ville.coord.lat, lon: ville.coord.lon }}>{ville.name}</Link>  </h3>
                    <div className="temp-previ">
                        <p>{Math.round(ville.main.temp)} °C, {ville.weather[0].description} </p>

                    </div>
                </div>
            )}
            {location.pathname !== "/" && (
                <div className="data-ville">
                    <div className="img-temp">
                        <img src={`https://openweathermap.org/img/wn/${ville.weather[0].icon}@2x.png`} alt="" />
                    </div>
                    <h3><span>{formatDay(ville.dt)}</span> <span>{formatDateComplete(ville.dt)}</span></h3>

                    <div className="temp-previ">
                        <p>{ville.weather[0].description}, {Math.round(ville.main.temp)} °C </p>

                    </div>
                </div>
            )}


        </article >


    );
}
export default MapPrevi