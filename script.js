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

async function searchCity(){
    const city = document.getElementById("cityInput").value;
    
     if (!city) {
        alert("Skriv in en stad först!");
        return;
    }

    const data = await getWeatherInformation(city);

    if(!data) return;
   
const condition = data.current.condition.text;

document.getElementById("cityInformation").innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <h3>${data.location.region}</h3>
    <img src="https:${data.current.condition.icon}" alt="weather-Icon">
    <p>${data.current.temp_c}°C</p>
    <p>${data.current.condition.text}</p>
    <p>${data.current.vis_km} km</p>
    <p>${data.current.humidity}</p>
    <p>${data.current.wind_kph} kph</p>
    <p>${data.current.precip_mm} mm</p>
    <p>${data.location.localtime}</p>
`;

console.log(data);

document.body.style.background =
  weatherGradients[condition] ||
  "linear-gradient(180deg, #bdc3c7 0%, #2c3e50 100%)";

}


