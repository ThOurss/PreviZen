import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from "react-router-dom";

const MapPrevi = ({ ville, layer = "rain" }) => {
    return (
        <article>
            <MapContainer center={[ville.coord.lat, ville.coord.lon]} zoom={7} className='map-container'>
                {/* Fond OpenStreetMap */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Couche météo via backend */}
                {/* <TileLayer
                    url={`http://localhost:5000/api/tiles/${layer}/{z}/{x}/{y}`}
                    opacity={0.6}
                /> */}

            </MapContainer>
            <div className="data-ville">
                <h3> <Link to={`/prevision/${ville.name.toLowerCase()}`} state={{ lat: ville.coord.lat, lon: ville.coord.lon }}>{ville.name}</Link>  </h3>
                <div className="temp-previ">
                    <p>{Math.round(ville.main.temp)} °C, {ville.weather[0].description} </p>

                </div>
            </div>

        </article >


    );
}
export default MapPrevi