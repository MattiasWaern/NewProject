// stockholm

const weatherGradients = {
  "Overcast": "linear-gradient(180deg, #6e7f80 0%, #9fb3b8 50%, #dbe7e4 100%)",
  "Cloudy": "linear-gradient(180deg, #bdc3c7 0%, #2c3e50 100%)",
  "Partly cloudy": "linear-gradient(180deg, #8ec5fc 0%, #cfd9df 50%, #fdfbfb 100%)",
  "Clear": "linear-gradient(180deg, #4facfe 0%, #00c6fb 60%, #e0f7ff 100%)",
  "Sunny": "linear-gradient(180deg, #fddb92 0%, #f6d365 50%, #fda085 100%)",
  "Rain": "linear-gradient(180deg, #4b6cb7 0%, #182848 100%)",
  "Light rain": "linear-gradient(180deg, #6a85b6 0%, #bac8e0 100%)",
  "Snow": "linear-gradient(180deg, #e6dada 0%, #274046 100%)"
};


async function getWeatherInformation(city) {
    const apiKey = 'da68076da8284c1c8c6231402251112';

    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.current.condition.text);
        return data;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function getWeatherForecast(city){
    const apiKey = 'da68076da8284c1c8c6231402251112';

    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no`
        );

    if (!response.ok) {
        throw new Error(`HTTP error! status. ${response.status}`)
    }

    const data = await response.json();
    return data;

    } catch (error){
        console.error("Error fetching weather forecast", error);
        return null;
    }
}

function formatDate(dateString){
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short'};
    return date.toLocaleDateString('sv-SE', options);
}

function getWeatherIcon(condition){
    const icons = {
        "Sunny": "fas fa-sun",
        "Clear": "fas fa-sun",
        "Partly cloudy": "fas fa-cloud-sun",
        "Cloudy": "fas fa-cloud",
        "Overcast": "fas fa-cloud",
        "Rain": "fas fa-cloud-rain",
        "Light rain": "fas fa-cloud-rain",
        "Snow": "fas fa-snowflake",
        "Light snow": "fas fa-snowflake"
    };
    return icons[condition] || "fas fa-cloud";
}



async function searchCity(){
    const city = document.getElementById("cityInput").value;
    
     if (!city) {
        alert("Skriv in en stad först!");
        return;
    }

    // Laddning
    document.getElementById('loading').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';

    try {
        const currentData = await getWeatherInformation(city);
        const forecastData = await getWeatherForecast(city);

        if(!currentData || !forecastData) {
            showError("Kunde inte hitta väderinformation för denna stad. Försök igen senare.")
            return;
        }
        const condition = currentData.current.condition.text;
    

    
   




// --------------------- Current Weather ---------------------

document.getElementById("cityInformation").innerHTML = `
    <div class="current-weather">
        <div class="location-info">
            <h2>${currentData.location.name}, ${currentData.location.country}</h2>
            <h3>${currentData.location.region}</h3>
            <div class="temp-display">
                <img src="https:${currentData.current.condition.icon}" alt="weather-Icon">
                <p>${Math.round(currentData.current.temp_c)}°C</p>
            </div>
            <p class="condition">${currentData.current.condition.text}</p>
        </div>

        <div class="weather-details">
            <div class="detail-item">
                <i class="fas fa-eye"></i>
                <p>Sikt</p>
                <p class="detail-value">${currentData.current.vis_km} km</p>
            </div>
            <div class="detail-item">
                <i class="fas fa-tint"></i>
                <p>Fuktighet</p>
                <p class="detail-value">${currentData.current.humidity}%</p>
            </div>
            <div class="detail-item">
                <i class="fas fa-wind"></i>
                <p>Vind</p>
                <p class="detail-value">${currentData.current.wind_kph}km/h</p>
            </div>
            <div class="detail-item">
                <i class="fas fa-cloud-rain"></i>
                <p>Nederbörd</p>
                <p class="detail-value">${currentData.current.precip_mm} mm</p>
            </div>
        </div>
    </div>
    <div class="time-info">
        <p>Senast uppdaterad: ${currentData.location.localtime}</p>
    </div>
`;



// --------------------- Weather forecast -----------------------

const forecastContainer = document.getElementById("weatherForecast");
forecastContainer.innerHTML = "";

forecastData.forecast.forecastday.forEach(day => {
    forecastContainer.innerHTML += `
        <div class="forecast-day">
            <p>${formatDate(day.date)}</p>
            <img src="https:${day.day.condition.icon}" alt="forecast-icon">

            <p class="forecast-temp">${Math.round(day.day.maxtemp_c)} ° / ${Math.round(day.day.mintemp_c)} °</p>
            <p>${day.day.condition.text}</p>
            <div class="forecast-details">
                <span> <i class="fas fa-tint"></i> ${day.day.avghumidity}%</span>

                <span> <i class="fas fa-cloud-rain"></i> ${day.day.totalprecip_mm}mm</span>

                <span> <i class="fas fa-wind"></i> ${day.day.maxwind_kph}km/h</span>
            </div>
        </div>
    `;
});


document.body.style.background =
    weatherGradients[condition] ||
    weatherGradients["Cloudy"];

} catch (error){
    console.error("Error", error);
    showError("Ett fel uppstod. Försök igen senare.");
} finally {
    document.getElementById('loading').style.display = 'none';
}

function showError(message){
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}


}

document.getElementById('searchButton').addEventListener('click', searchCity);

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchCity();
    }
});

window.addEventListener('load', function() {
    this.document.getElementById('cityInput').value = 'Stockholm';
    searchCity();
});



