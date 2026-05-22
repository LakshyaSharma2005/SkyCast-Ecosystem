export const getWeatherEffect = (sensor, apiWeather) => {
  if (sensor.isRaining || apiWeather.isRaining) return "weather-rain";
  if (sensor.humidity > 85 || apiWeather.isFoggy)  return "weather-fog";
  return "weather-clear";
};

export const calculateTimeTheme = () => {
  const now         = new Date();
  const decimalTime = now.getHours() + now.getMinutes() / 60;
  if (decimalTime >= 5.5  && decimalTime < 9.0)  return "theme-morning";
  if (decimalTime >= 9.0  && decimalTime < 17.5) return "theme-day";
  if (decimalTime >= 17.5 && decimalTime < 19.5) return "theme-evening";
  return "theme-night";
};