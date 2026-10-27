/*
  SkyPulse - Custom React Hooks
  Hooks for weather data, geolocation, and search management
*/

import { useEffect, useState, useCallback } from "react";
import { useWeatherFetching } from "./useWeather";
import { useDebouncedSearch } from "./useDebouncedSearch";

// Types
type WeatherUnit = "celsius" | "fahrenheit";

type LocationResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string | null;
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
  const { data, loading, error } = useWeatherFetching(lat, lon, unit);

  return { data, loading, error };
};

export type { CurrentWeather, HourlyForecast, DailyForecast, WeatherAlert };