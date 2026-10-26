/*
  SkyPulse - Weather SaaS Application
  File: /lib/weather.ts
  Description: API layer for weather data fetching with Open-Meteo integration
*/

export type WeatherCondition =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "rain"
  | "snow"
  | "sleet"
  | "wind"
  | "fog"
  | "cloudy"
  | "mostly-cloudy";

export type WeatherUnit = "celsius" | "fahrenheit";

// Location result from geocoding
export type LocationResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string | null;
};

// Current weather data
export type CurrentWeather = {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number; // degrees
  wind_gust?: number;
  pressure: number;
  visibility: number;
  uv_index: number;
  aqi?: number; // Air Quality Index
  condition: WeatherCondition;
  description: string;
  icon: string;
  time: string;
};

// Hourly forecast data
export type HourlyForecast = {
  time: string;
  temperature: number;
  temperature_2m?: number;
  precipitation_probability: number;
  precipitation?: number;
  condition: WeatherCondition;
  icon: string;
};

// Daily forecast data
export type DailyForecast = {
  day: string;
  date: string;
  temperature_max: number;
  temperature_min: number;
  temperature_mean?: number;
  precipitation_probability_max: number;
  condition: WeatherCondition;
  icon: string;
  sunrise?: string;
  sunset?: string;
};

// Weather alerts
export type WeatherAlert = {
  id: string;
  title: string;
  description: string;
  severity: "minor" | "moderate" | "severe" | "extreme";
  start_time: string;
  end_time: string;
  area?: string;
};

// Weather metrics grid items
export type WeatherMetrics = {
  label: string;
  value: string | number;
  unit: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
};

// Forecast response from Open-Meteo
export type ForecastResponse = {
  current_weather?: CurrentWeather;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
  };
  alerts?: WeatherAlert[];
  generationtime_ms: number;
  utc_offset_seconds: number;
};

// Unit conversion helpers
export const convertTemperature = (
  value: number,
  from: WeatherUnit,
  to: WeatherUnit
): number => {
  if (from === to) return value;
  if (from === "celsius" && to === "fahrenheit") {
    return (value * 9/5) + 32;
  }
  if (from === "fahrenheit" && to === "celsius") {
    return (value - 32) * 5/9;
  }
  return value;
};

export const getUnitLabel = (unit: WeatherUnit): string => {
  return unit === "celsius" ? "°C" : "°F";
};

export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

// Format time string to readable format
export const formatTime = (timeStr: string, unit: WeatherUnit): string => {
  const date = new Date(timeStr);
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

// Get weather condition icon CSS class
export const getWeatherIcon = (condition: WeatherCondition): string => {
  const icons: Record<WeatherCondition, string> = {
    "clear-day": "sun",
    "clear-night": "moon-stars",
    "partly-cloudy-day": "cloud-sun",
    "partly-cloudy-night": "cloud-moon",
    "rain": "cloud-rain",
    "snow": "snowflake",
    "sleet": "cloud-rain",
    "wind": "wind",
    "fog": "cloud-fog",
    "cloudy": "cloud",
    "mostly-cloudy": "cloud",
  };
  return icons[condition] || "cloud";
};

// Map Open-Meteo weather codes to our condition types
export const mapWeatherCode = (code: number): WeatherCondition => {
  const codeMap: Record<number, WeatherCondition> = {
    0: "clear-day",       // Clear sky
    1: "partly-cloudy-day", // Mainly clear
    2: "partly-cloudy-day", // Partly cloudy
    3: "cloudy",          // Overcast
    45: "fog",            // Fog
    48: "fog",            // Depositing rime fog
    51: "rain",           // Light drizzle
    53: "rain",           // Moderate drizzle
    55: "rain",           // Dense drizzle
    56: "rain",           // Light freezing drizzle
    57: "rain",           // Dense freezing drizzle
    61: "rain",           // Slight rain
    63: "rain",           // Moderate rain
    65: "rain",           // Heavy rain
    66: "snow",           // Light freezing rain
    67: "snow",           // Heavy freezing rain
    71: "snow",           // Slight snow fall
    73: "snow",           // Moderate snow fall
    75: "snow",           // Heavy snow fall
    77: "snow",           // Snow grains
    80: "rain",           // Rain showers
    81: "rain",           // Rain showers moderate
    82: "rain",           // Rain showers violent
    85: "snow",           // Slight snow showers
    86: "snow",           // Heavy snow showers
    95: "thunderstorm",   // Thunderstorm
    96: "thunderstorm",   // Thunderstorm with slight hail
    99: "thunderstorm",   // Thunderstorm with heavy hail
  };
  return codeMap[code] || "cloudy";
};