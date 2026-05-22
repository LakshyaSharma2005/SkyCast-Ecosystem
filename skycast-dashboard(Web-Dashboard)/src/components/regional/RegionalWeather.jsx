import React, { useState, useEffect } from "react";

// ⚡ HELPER COMPONENT MOVED OUTSIDE: React is now happy and performance is restored!
const ApiCard = ({ title, icon, value, unit, colorClass, badgeColor }) => (
  <div className="card stat-card">
    <div className="stat-top">
      <div className="stat-label">{title}</div>
      <div className="stat-icon">{icon}</div>
    </div>
    <div
      className="stat-val"
      style={{ color: colorClass ? `var(--${colorClass})` : "white" }}
    >
      {value}{" "}
      <span className="stat-unit" style={{ color: "var(--theme-muted)" }}>
        {unit}
      </span>
    </div>
    <div className="stat-sub">
      <span
        className="stat-badge"
        style={{
          background: `var(--${badgeColor}-dim)`,
          color: `var(--${badgeColor})`,
        }}
      >
        API
      </span>
      <span>Open-Meteo Live</span>
    </div>
  </div>
);

// ⚡ MAIN COMPONENT
const RegionalWeather = () => {
  const [weather, setWeather] = useState(null);
  const [locationText, setLocationText] = useState("Locating...");

  useEffect(() => {
    // Default fallback coordinates (Kota, Rajasthan)
    const fallbackLat = 25.18;
    const fallbackLon = 75.83;

    const fetchWeatherData = async (lat, lon, locName) => {
      try {
        // Fetching all 8 metrics from Open-Meteo
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,surface_pressure,wind_speed_10m,uv_index,visibility&timezone=auto`,
        );
        const data = await response.json();

        if (data && data.current) {
          setWeather({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            feelsLike: data.current.apparent_temperature,
            wind: data.current.wind_speed_10m,
            pressure: data.current.surface_pressure,
            uv: data.current.uv_index,
            clouds: data.current.cloud_cover,
            // Convert visibility from meters to kilometers
            visibility: (data.current.visibility / 1000).toFixed(1),
          });
          setLocationText(locName);
        }
      } catch (error) {
        console.error("Failed to fetch regional weather:", error);
        setLocationText("Offline");
      }
    };

    // Wrapper function so we can call it immediately AND on an interval
    const initFetch = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            fetchWeatherData(
              position.coords.latitude,
              position.coords.longitude,
              "Local Region",
            ),
          () =>
            fetchWeatherData(fallbackLat, fallbackLon, "Kota Region (Default)"),
        );
      } else {
        fetchWeatherData(fallbackLat, fallbackLon, "Kota Region (Default)");
      }
    };

    initFetch();

    // Auto-refresh the regional API data every 15 minutes silently in the background
    const interval = setInterval(initFetch, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until the API responds
  if (!weather) return null;

  return (
    <>
      <div className="section-title">
        <span className="section-icon">🌍</span> Regional Weather (
        {locationText})
      </div>

      <div className="grid">
        {/* ROW 1: The original 4 metrics */}
        <ApiCard
          title="Outdoor Temp"
          icon="🌡️"
          value={weather.temp}
          unit="°C"
          colorClass="cyan"
          badgeColor="cyan"
        />
        <ApiCard
          title="Outdoor Humidity"
          icon="💧"
          value={weather.humidity}
          unit="%"
          colorClass="pink"
          badgeColor="pink"
        />
        <ApiCard
          title="Wind Speed"
          icon="💨"
          value={weather.wind}
          unit="km/h"
          badgeColor="amber"
        />
        <ApiCard
          title="Surface Pressure"
          icon="⏱️"
          value={weather.pressure}
          unit="hPa"
          badgeColor="blue"
        />

        {/* ROW 2: The new 4 advanced metrics */}
        <ApiCard
          title="Feels Like"
          icon="🤒"
          value={weather.feelsLike}
          unit="°C"
          badgeColor="amber"
        />
        <ApiCard
          title="UV Index"
          icon="☀️"
          value={weather.uv}
          unit=""
          badgeColor="amber"
        />
        <ApiCard
          title="Cloud Cover"
          icon="☁️"
          value={weather.clouds}
          unit="%"
          colorClass="blue"
          badgeColor="blue"
        />
        <ApiCard
          title="Visibility"
          icon="👁️"
          value={weather.visibility}
          unit="km"
          colorClass="green"
          badgeColor="green"
        />
      </div>
    </>
  );
};

export default RegionalWeather;