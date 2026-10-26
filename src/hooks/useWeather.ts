/*
  SkyPulse - Weather SaaS Application
  File: /hooks/useWeather.ts
  Description: Custom React hooks for weather data, geolocation, and search management
*/

import { useEffect, useState, useCallback } from "react";

// Types import would be from ../lib/weather
// For now, redefining minimal types inline

type WeatherUnit = "celsius" | "fahrenheit";

type LocationResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string | null;
};

type CurrentWeather = {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  visibility: number;
  uv_index: number;
  condition: string;
  description: string;
  icon: string;
};

type HourlyForecast = {
  time: string;
  temperature: number;
  precipitation_probability: number;
  condition: string;
  icon: string;
};

type DailyForecast = {
  day: string;
  date: string;
  temperature_max: number;
  temperature_min: number;
  precipitation_probability_max: number;
  condition: string;
  icon: string;
};

// Hook 1: Geolocation detection
export const useGeolocation = (enabled: boolean = true) => {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported by this browser");
      setLoading(false);
      return;
    }

    setLoading(true);

    const success = (position: GeolocationPosition) => {
      const coords = position.coords;
      setLocation({
        name: "Current Location",
        lat: coords.latitude,
        lon: coords.longitude,
        country: "",
        state: null,
      });
      setLoading(false);
      setError(null);
    };

    const failure = (err: GeolocationPositionError) => {
      console.error("Geolocation error:", err);
      setError("Unable to retrieve location. Using default city.");
      setLocation(null);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, failure, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    });
  }, [enabled]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setLocation({
          name: "Current Location",
          lat: coords.latitude,
          lon: coords.longitude,
          country: "",
          state: null,
        });
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation refresh error:", err);
        setError("Unable to retrieve location");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, error, loading, refresh };
};

// Hook 2: Debounced search
export const useDebouncedSearch = <T>(
  value: T,
  delay: number = 300
): [T, (value: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  const updateValue = useCallback((newValue: T) => {
    setDebouncedValue(newValue);
  }, []);

  return [debouncedValue, updateValue];
};

// Hook 3: Weather data fetching with caching state
export const useWeatherFetching = (
  lat: number,
  lon: number,
  unit: WeatherUnit = "celsius"
) => {
  const [data, setData] = useState<{
    current: CurrentWeather | null;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    alerts: WeatherAlert[];
    loading: boolean;
    error: string | null;
  }>({
    current: null,
    hourly: [],
    daily: [],
    alerts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (isNaN(lat) || isNaN(lon)) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: "Invalid coordinates provided",
      }));
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      setData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&
current_weather=true&
hourly=temperature_2m,precipitation_probability,weathercode,wind_speed,winddirection&
daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,weathercode&
timezone=auto&
alerts=true`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!cancelled) {
          const currentWeather = data.current_weather
            ? mapOpenMeteoCurrent(data.current_weather)
            : null;

          const hourlyForecast = (data.hourly || []).map(
            (t: any, i: number) => ({
              time: t.time[i],
              temperature: t.temperature_2m[i],
              precipitation_probability: t.precipitation_probability[i],
              condition: mapWeatherCode(t.weathercode[i]),
              icon: getWeatherIcon(mapWeatherCode(t.weathercode[i])),
            })
          );

          const dailyForecast = (data.daily || []).map(
            (d: any, i: number) => ({
              day: new Date(d.time[i]).toLocaleDateString("en-US", { weekday: "short" }),
              date: d.time[i],
              temperature_max: d.temperature_2m_max[i],
              temperature_min: d.temperature_2m_min[i],
              precipitation_probability_max: d.precipitation_probability_max[i],
              condition: mapWeatherCode(d.weathercode[i]),
              icon: getWeatherIcon(mapWeatherCode(d.weathercode[i])),
              sunrise: d.sunrise[i],
              sunset: d.sunset[i],
            })
          );

          const alerts: WeatherAlert[] = (data.alerts || []).map(
            (alert: any) => ({
              id: alert.id || Math.random().toString(36).substr(2, 9),
              title: alert.event || "Weather Alert",
              description: alert.description || "",
              severity: alert.severity || "moderate",
              start_time: alert.start_date || alert.time || "",
              end_time: alert.end_date || "",
              area: alert.area || undefined,
            })
          );

          setData({
            current: currentWeather,
            hourly: hourlyForecast,
            daily: dailyForecast,
            alerts,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Weather fetch error:", err);
          setData(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to fetch weather data",
          }));
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [lat, lon, unit]);

  return data;
};

// Helper: Map Open-Meteo current weather
const mapOpenMeteoCurrent = (data: any): CurrentWeather => ({
  temperature: data.temperature,
  feels_like: data.apparent_temperature || data.temperature,
  humidity: data.relative_humidity_2m || 0,
  wind_speed: data.windspeed,
  wind_direction: data.winddirection || 0,
  pressure: data.pressure || 1013,
  visibility: data.visibility || 10000,
  uv_index: data.uv_index || 0,
  condition: mapWeatherCode(data.weathercode),
  description: getWeatherDescription(mapWeatherCode(data.weathercode)),
  icon: getWeatherIcon(mapWeatherCode(data.weathercode)),
  time: data.time || new Date().toISOString(),
});

// Helper: Get weather description from condition
const getWeatherDescription = (condition: string): string => {
  const descriptions: Record<string, string> = {
    "clear-day": "Clear sky",
    "clear-night": "Clear night",
    "partly-cloudy-day": "Partly cloudy",
    "partly-cloudy-night": "Partly cloudy",
    "rain": "Rain",
    "snow": "Snow",
    "wind": "Wind",
    "fog": "Fog",
    "cloudy": "Cloudy",
    "mostly-cloudy": "Mostly cloudy",
  };
  return descriptions[condition] || "Weather conditions";
};

// Helper: Get weather icon name
const getWeatherIcon = (condition: string): string => {
  const icons: Record<string, string> = {
    "clear-day": "sun",
    "clear-night": "moon-stars",
    "partly-cloudy-day": "cloud-sun",
    "partly-cloudy-night": "cloud-moon",
    "rain": "cloud-rain",
    "snow": "snowflake",
    "wind": "wind",
    "fog": "cloud-fog",
    "cloudy": "cloud",
    "mostly-cloudy": "cloud",
  };
  return icons[condition] || "cloud";
};

export type { CurrentWeather, HourlyForecast, DailyForecast, WeatherAlert };