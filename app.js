// API Key and Base URL
const apiKey = "eb05dc05cf6b25948af1fe3f47a2ba0a"; //  OpenWeatherMap API key
const apiBaseURL = "https://api.openweathermap.org/data/2.5";

// Selecting Elements
const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");

const cityInput = document.getElementById("city");
const weatherInfoSection = document.getElementById("weather-info");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast");

// Function to Fetch Weather Data by City
const getWeatherByCity = async (city) => {
  try {
    const res = await fetch(
      `${apiBaseURL}/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    console.log(data); // Check the API response
    if (data.cod === 200) {
      displayWeatherData(data);
      getForecast(data.coord.lat, data.coord.lon);
    } else {
      alert("City not found!");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error); // Log the error
    alert("Error fetching weather data");
  }
};

// Function to Fetch Weather Data by Current Location
const getWeatherByCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `${apiBaseURL}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        if (data.cod === 200) {
          // Set the city name in the input field
          cityInput.value = data.name;

          // Display the weather and forecast data
          displayWeatherData(data);
          getForecast(latitude, longitude);
        } else {
          alert("Unable to fetch location-based weather data.");
        }
      } catch (error) {
        alert("Error fetching weather data for current location.");
      }
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

// Display Weather Data
const displayWeatherData = (data) => {
  document.getElementById("city-name").innerText = `${
    data.name
  } (${new Date().toLocaleDateString()})`;
  document.getElementById(
    "temp"
  ).innerText = `Temperature: ${data.main.temp}°C`;
  document.getElementById("wind").innerText = `Wind: ${data.wind.speed} M/S`;
  document.getElementById(
    "humidity"
  ).innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById("weather-desc").innerText =
    data.weather[0].description;
  document.getElementById(
    "weather-icon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherInfoSection.classList.remove("hidden");
  weatherInfoSection.classList.add("flex");
};

// Fetch 5-Day Forecast
const getForecast = async (lat, lon) => {
  try {
    const res = await fetch(
      `${apiBaseURL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    displayForecastData(data.list);
  } catch (error) {
    alert("Error fetching forecast data");
  }
};

// Display Forecast Data
const displayForecastData = (forecastList) => {
  forecastContainer.innerHTML = ""; // Clear previous forecast
  forecastList.forEach((forecast, index) => {
    if (index % 8 === 0) {
      // Forecast for every 24 hours (3-hour intervals * 8)
      const forecastCard = document.createElement("div");
      forecastCard.classList.add(
        "bg-gray-700",
        "text-white",
        "p-4",
        "rounded-lg",
        "shadow-md",
        "transition",
        "transform",
        "hover:scale-105",
        "hover:shadow-xl",
        "flex",
        "flex-col",
        "items-center",
        "justify-between" // Ensure content is evenly spaced
      );

      const forecastDate = new Date(forecast.dt_txt);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = forecastDate.toLocaleDateString("en-US", options);

      const temp = forecast.main.temp;
      const wind = forecast.wind.speed;
      const humidity = forecast.main.humidity;
      const icon = forecast.weather[0].icon;
      const description = forecast.weather[0].description;

      forecastCard.innerHTML = `
        <p class="font-semibold text-lg">${formattedDate}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon" class="w-12 h-12 mx-auto my-2">
        <p>Temp: ${temp}°C</p>
        <p>Wind: ${wind} M/S</p>
        <p>Humidity: ${humidity}%</p>
      `;

      forecastContainer.appendChild(forecastCard);
    }
  });
  forecastSection.classList.remove("hidden");
};

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeatherByCity(city);
  } else {
    alert("Please enter a city name");
  }
});

currentLocationBtn.addEventListener("click", getWeatherByCurrentLocation);
