/*
  SkyPulse - Main Dashboard Page
  File: /app/page.tsx
  Description: Main dashboard page assembling all weather components
*/

"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useWeather";
import { Header } from "@/components/weather/Header";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { SevenDayForecast } from "@/components/weather/SevenDayForecast";
import { WeatherMetricsGrid } from "@/components/weather/WeatherMetricsGrid";
import { convertTemperature, getUnitLabel } from "@/lib/weather";

type WeatherUnit = "celsius" | "fahrenheit";

export const HomePage: React.FC = () => {
  // Geolocation hook
  const { location, error: geolocationError, loading: geoLoading, refresh } = useGeolocation();

  // Initial coordinates - fallback to London if no geolocation
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Use geolocation result or fallback
  useEffect(() => {
    if (location) {
      setCoords({
        lat: location.lat,
        lon: location.lon,
      });
    } else if (!geoLoading) {
      // Fallback to default location (London)
      setCoords({ lat: 51.5074, lon: -0.1278 });
    }
  }, [location, geoLoading]);

  // State for unit toggle
  const [unit, setUnit] = useState<WeatherUnit>("celsius");

  // Handler for unit toggle
  const handleUnitToggle = (newUnit: WeatherUnit) => {
    setUnit(newUnit);
  };

  // Handler for location select
  const handleLocationSelect = (location: { name: string; lat: number; lon: number }) => {
    setCoords({ lat: location.lat, lon: location.lon });
    // You could also save this to localStorage for persistence
    localStorage.setItem("skyPulseLastLocation", JSON.stringify(location));
  };

  // Load saved location from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("skyPulseLastLocation");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCoords({ lat: parsed.lat, lon: parsed.lon });
    }
  }, []);

  if (!coords) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-gray-400">
        <p>Loading location...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header
        onLocationSelect={handleLocationSelect}
        onUnitToggle={handleUnitToggle}
        initialUnit={unit}
        recentSearches={[]}
        onRecentSearchSelect={() => {}}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Weather Card */}
        <CurrentWeatherCard
          weather={{
            temperature: 21,
            feels_like: 22,
            humidity: 65,
            wind_speed: 12,
            wind_direction: 240,
            wind_gust: 20,
            pressure: 1015,
            visibility: 10000,
            uv_index: 5,
            aqi: 4,
            condition: "partly-cloudy-day",
            description: "Partly cloudy",
            icon: "sun",
            time: new Date().toISOString(),
            locationName: coords ? "London, UK" : "New York, NY",
          }}
          unit={unit}
          onToggleUnit={handleUnitToggle}
        />

        {/* Weather Metrics Grid */}
        <WeatherMetricsGrid
          lat={coords.lat}
          lon={coords.lon}
          unit={unit}
        />

        {/* Hourly and Daily Forecasts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <HourlyForecast
            lat={coords.lat}
            lon={coords.lon}
            unit={unit}
            onToggleUnit={handleUnitToggle}
          />
          <SevenDayForecast
            lat={coords.lat}
            lon={coords.lon}
            unit={unit}
          />
        </div>
      </main>
    </div>
  );
};

// Make HomePage the default export
export default HomePage;