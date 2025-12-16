// stockholm

const weatherGradients = {
  "Overcast": "linear-gradient(180deg, #6e7f80 0%, #9fb3b8 50%, #dbe7e4 100%)",
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
    }

    const condition = currentData.current.condition.text;
   




// --------------------- Current Weather

document.getElementById("cityInformation").innerHTML = `
    <h2>${currentData.location.name}, ${currentData.location.country}</h2>
    <h3>${currentData.location.region}</h3>
    <img src="https:${currentData.current.condition.icon}" alt="weather-Icon">
    <p>${currentData.current.temp_c}°C</p>
    <p>${currentData.current.condition.text}</p>
   
`;

document.getElementById("weatherInformation").innerHTML = `
    <p>${currentData.current.vis_km} km</p>
    <p>💧${currentData.current.humidity}%</p>
    <p>💨${currentData.current.wind_kph} kph</p>
    <p>${currentData.current.precip_mm} mm</p>
    <p>${currentData.location.localtime}</p>
`;

// --------------------- Weather forecast

const forecastContainer = document.getElementById("weatherForecast");
forecastContainer.innerHTML = "";

forecastData.forecast.forecastday.forEach(day => {
    forecastContainer.innerHTML += `
            <div class="forecast-day">
                <p>Date: ${day.date}</p>
                <img src="https:${day.day.condition.icon}" alt="forecast-icon">
                <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
                <p>💧 ${day.day.avghumidity}%</p>
                <p>🌧️ ${day.day.totalprecip_mm} mm</p>
                <p>💨 ${day.day.maxwind_kph} kph</p>
            </div>
        `;
});


document.body.style.background =
  weatherGradients[condition] ||
  "linear-gradient(180deg, #bdc3c7 0%, #2c3e50 100%)";

}


