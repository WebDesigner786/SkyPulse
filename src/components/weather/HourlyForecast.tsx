/*
  SkyPulse - Weather SaaS Application
  File: /components/weather/HourlyForecast.tsx
  Description: Horizontal interactive 24-hour forecast slider
*/

import { useMemo } from "react";
import { useWeatherFetching } from "@/hooks/useWeather";
import { useDebouncedSearch } from "@/hooks/useWeather";
import { Sun, MoonStars, CloudRain, Snowflake, Wind } from "lucide-react";

type WeatherUnit = "celsius" | "fahrenheit";

interface HourlyForecastProps {
  lat?: number;
  lon?: number;
  unit?: WeatherUnit;
  onToggleUnit?: (unit: WeatherUnit) => void;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  lat,
  lon,
  unit = "celsius",
  onToggleUnit,
}) => {
  const { data: weatherData, loading, error } = useWeatherFetching(
    lat ?? 0,
    lon ?? 0,
    unit
  );

  // Generate 24-hour forecast from hourly data
  const hourlyData = useMemo(() => {
    if (!weatherData?.hourly?.length) {
      // Return default/placeholder data if no data available
      const placeholder = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() + i * 60 * 60 * 1000);
        placeholder.push({
          time: time.toLocaleTimeString("en-US", { hour: "numeric", hour12: false }),
          temperature: 20 + Math.sin(i * 0.5) * 10,
          precipitation_probability: Math.random() * 50,
          condition: "partly-cloudy-day",
          icon: "sun",
        });
      }
      return placeholder;
    }

    const hours = weatherData.hourly.time.slice(0, 24);
    const temperatures = weatherData.hourly.temperature_2m
      ? weatherData.hourly.temperature_2m.slice(0, 24)
      : hours.map(() => Math.round(Math.random() * 30));
    const precipitationProbs = weatherData.hourly.precipitation_probability
      ? weatherData.hourly.precipitation_probability.slice(0, 24)
      : hours.map(() => Math.round(Math.random() * 50));

    return hours.map((time, i) => ({
      time: time,
      temperature: Math.round(temperatures[i]),
      precipitation_probability: precipitationProbs[i],
      condition: weatherData.hourly.weathercode
        ? mapWeatherCode(weatherData.hourly.weathercode[i])
        : "partly-cloudy-day",
      icon: getWeatherIcon(
        weatherData.hourly.weathercode
          ? mapWeatherCode(weatherData.hourly.weathercode[i])
          : "partly-cloudy-day"
      ),
    }));
  }, [weatherData]);

  const [searchQuery, updateSearch] = useDebouncedSearch("", 300);

  const unitLabel = unit === "celsius" ? "°F" : "°C";

  return (
    <section className="py-6 bg-[var(--card)]/80 backdrop-blur-md border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            24-Hour Forecast
          </h2>
          {onToggleUnit && (
            <button
              onClick={() => onToggleUnit(unit === "celsius" ? "fahrenheit" : "celsius")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                unit === "celsius"
                  ? "bg-[var(--primary)] text-white hover:bg-opacity-90"
                  : "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-opacity-90"
              }`}
              aria-label={`Switch to ${unitLabel}`}
            >
              {unit === "celsius" ? "°F" : "°C"}
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-300 p-4 rounded-md mb-6 animate-slide-in">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && !weatherData && (
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-6 w-12 bg-gradient-to-b from-gray-600 to-gray-400 rounded animate-bounce" />
            ))}
          </div>
        )}

        {/* Horizontal scrollable forecast */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-600 rounded-lg mb-6">
          <div className="inline-flex gap-3">
            {hourlyData.map((hour, index) => (
              <div
                key={index}
                className={`min-w-[80px] flex flex-col items-center gap-2 rounded-lg px-3 py-2 transition-all cursor-pointer hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                  weatherData && weatherData.current
                    ? `bg-[var(--primary)]/20`
                    : "bg-gray-800/30"
                }`}
                aria-label={`Hour ${index + 1}: ${hour.temperature}°${unitLabel}, ${hour.condition}`}
              >
                <div className="text-sm text-gray-300">{hour.time}</div>
                <div className="text-xl font-bold ${
                  unit === "celsius" ? "text-amber-300" : "text-cyan-300"
                }">
                  {hour.temperature}°{unitLabel[0]}
                </div>
                <div className="text-xs text-gray-400">{hour.precipitation_probability}% rain</div>
                <WeatherIcon name={hour.icon} className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>

        {/* No data message */}
        {!weatherData && !loading && (
          <p className="text-center text-gray-500 text-sm">
            Search for a location to see the forecast
          </p>
        )}
      </div>
    </section>
  );
};

// Weather icon component
const WeatherIcon: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className }) => {
  const iconMap: Record<string, React.ReactElement> = {
    "sun": <Sun className={className} />,
    "moon-stars": <MoonStars className={className} />,
    "cloud-rain": <CloudRain className={className} />,
    "snowflake": <Snowflake className={className} />,
    "wind": <Wind className={className} />,
    "cloud-sun": <Sun className={`${className} opacity-80`} />,
    "cloud-moon": <MoonStars className={`${className} opacity-80`} />,
    "cloud": <Sun className={`${className} opacity-60`} />,
    "default": <Sun className={className} />,
  };
  return iconMap[name] || iconMap.default;
};

WeatherIcon.displayName = "WeatherIcon";