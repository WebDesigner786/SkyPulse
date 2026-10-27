/*
  SkyPulse - 7-Day Forecast
  7-day extended forecast with daily cards and mini charts
*/

import { useWeatherFetching } from "@/hooks/useWeather";
import { Sun, MoonStars, CloudRain, Snowflake, Wind } from "lucide-react";

type WeatherUnit = "celsius" | "fahrenheit";

interface SevenDayForecastProps {
  lat?: number;
  lon?: number;
  unit?: WeatherUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  lat,
  lon,
  unit = "celsius",
}) => {
  const {
    data: weatherData,
    loading,
    error,
  } = useWeatherFetching(lat ?? 0, lon ?? 0, unit);

  // Format day name from date
  const formatDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Convert temperature based on unit
  const convertTemp = (temp: number, unit: WeatherUnit): number => {
    return unit === "celsius" ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
  };

  return (
    <section className="py-8 bg-[var(--card)]/80 backdrop-blur-md border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            7-Day Forecast
          </h2>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-300 p-4 rounded-md mb-6 animate-slide-in">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && !weatherData && (
          <div className="grid grid-cols-7 gap-2 py-12">
            {Array.from({ length: 7 }, () => (
              <div className="h-20 w-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl animate-bounce" />
            ))}
          </div>
        )}

        {/* 7-Day Forecast Grid */}
        {weatherData?.daily?.map((day, index) => (
          <div
            key={index}
            className={`flex-1 rounded-xl p-4 border border-border/40 transition-all hover:scale-[1.02] group-hover:scale-[1.03] ${
              weatherData.current
                ? `bg-[var(--primary)]/10 border-amber-500/50`
                : "bg-gray-800/30 border-gray-600/30"
            }`}
            aria-label={`7-day forecast for ${day.day}: ${day.temperature_max}°${unit === "celsius" ? "C" : "F"} high, ${day.temperature_min}°${unit === "celsius" ? "C" : "F"} low`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-300 capitalize">
                {formatDayName(day.date)}
              </span>
              {/* Today indicator */}
              {index === 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[1pt]">
                  Today
                </span>
              )}
            </div>

            {/* Temperature range */}
            <div className="flex items-baseline gap-2 mb-2">
              <div className={`text-xl font-bold ${
                unit === "celsius" ? "text-amber-300" : "text-cyan-300"
              }`}>
                {convertTemp(day.temperature_max, unit)}°{unitLabel(unit)}
              </div>
              <div className="text-2xl opacity-60">
                /
              </div>
              <div className={`text-xl font-bold ${
                unit === "celsius" ? "text-cyan-300" : "text-amber-300"
              }`}>
                {convertTemp(day.temperature_min, unit)}°{unitLabel(unit)}
              </div>
            </div>

            {/* Condition icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              weatherData.current
                ? `bg-[var(--primary)]/20`
                : "bg-gray-800/30"
            }">
              <WeatherIcon name={day.icon} className="h-5 w-5 text-amber-300" />
            </div>

            {/* Condition description */}
            <p className="text-xs text-gray-400 line-clamp-1">
              {day.condition}
            </p>

            {/* Rain probability */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{day.precipitation_probability_max}% rain chance</span>
              <div className="w-16 h-0.5 rounded-full bg-gray-700/50 overflow-hidden">
                <div
                  className={`h-full bg-amber-500 rounded-full transition-all duration-500 ${
                    day.precipitation_probability_max > 50
                      ? "bg-red-500"
                      : "bg-amber-300"
                  }`}
                  style={{ width: `${day.precipitation_probability_max}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* No data message */}
        {!weatherData && !loading && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Search for a location to see the 7-day forecast
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