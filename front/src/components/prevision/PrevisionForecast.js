const PrevisionForecast = ({ formatDay, formatDayComplete, unePrevi }) => {
    return (
        <article className="forecast-previ">
            <div className="div-img">
                <img src={`https://openweathermap.org/img/wn/${unePrevi.weather[0].icon}@2x.png`} alt="" />
            </div>
            <h3><span>{formatDay(unePrevi.dt)} {formatDayComplete(unePrevi.dt)}</span> <span>{unePrevi.weather[0].description}</span></h3>
            <div className="temperature">
                <p>{Math.round(unePrevi.temp.day)} °C</p>
            </div>
        </article>
    )
}
export default PrevisionForecast