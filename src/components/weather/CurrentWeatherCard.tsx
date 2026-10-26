/*
  SkyPulse - Weather SaaS Application
  File: /components/weather/CurrentWeatherCard.tsx
  Description: Primary hero card with current weather conditions and dynamic background styling
*/

import { useState } from "react";
import { Sun, MoonStars, CloudRain, Snowflake, Wind, Sunrise, Sunset } from "lucide-react";

type WeatherUnit = "celsius" | "fahrenheit";
type WeatherCondition = string;

interface CurrentWeatherCardProps {
  weather: {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    wind_gust?: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    aqi?: number;
    condition: WeatherCondition;
    description: string;
    icon: string;
    time: string;
    locationName: string;
  };
  unit: WeatherUnit;
  onToggleUnit: () => void;
}

const unitLabel = (unit: WeatherUnit): string => unit === "celsius" ? "°C" : "°F";

const getWindDirectionLabel = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

// Dynamic background based on weather condition
const getWeatherBackground = (condition: WeatherCondition): string => {
  const backgrounds: Record<WeatherCondition, string> = {
    "clear-day": "from-yellow-500/20 to-orange-500/20 via-amber-500/20",
    "clear-night": "from-indigo-900/30 to-violet-900/30 via-purple-900/30",
    "partly-cloudy-day": "from-blue-200/10 to-cyan-200/10 via-white/5",
    "partly-cloudy-night": "from-indigo-800/30 to-violet-800/30 via-purple-800/30",
    "rain": "from-blue-400/20 to-indigo-500/30 via-purple-400/20",
    "snow": "from-blue-100/20 to-cyan-200/20 via-white/30",
    "wind": "from-gray-200/10 to-gray-400/20",
    "fog": "from-gray-300/20 to-gray-300/20 via-neutral-300/20",
    "cloudy": "from-gray-300/10 to-gray-400/10",
    "mostly-cloudy": "from-gray-300/10 to-gray-400/10",
    "default": "from-gray-950/30 to-gray-950/30 via-gray-900/30",
  };
  return backgrounds[condition] || backgrounds.default;
};

// Dynamic text color based on condition
const getWeatherTextColor = (condition: WeatherCondition): string => {
  const colors: Record<WeatherCondition, string> = {
    "clear-day": "text-yellow-400",
    "clear-night": "text-slate-200",
    "partly-cloudy-day": "text-blue-600",
    "partly-cloudy-night": "text-slate-300",
    "rain": "text-blue-300",
    "snow": "text-cyan-300",
    "wind": "text-gray-300",
    "fog": "text-gray-400",
    "cloudy": "text-gray-300",
    "mostly-cloudy": "text-gray-300",
  };
  return colors[condition] || colors.default;
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
  onToggleUnit,
}) => {
  const [isFahrenheit, setIsFahrenheit] = useState(unit === "fahrenheit");

  const tempDisplay = isFahrenheit
    ? Math.round(weather.temperature * 9/5 + 32)
    : Math.round(weather.temperature);

  const feelsLikeDisplay = isFahrenheit
    ? Math.round(weather.feels_like * 9/5 + 32)
    : Math.round(weather.feels_like);

  // Determine day/night based on time
  const hour = new Date(weather.time).getHours();
  const isNight = hour >= 20 || hour < 6;

  const conditionKey = isNight
    ? weather.condition.replace("day", "night")
    : weather.condition;

  const background = getWeatherBackground(conditionKey);
  const textColor = getWeatherTextColor(conditionKey);

  return (
    <section className="py-8 bg-[var(--card)] backdrop-blur-lg border-l-4 ${
      isNight ? "border-indigo-600" : "border-amber-500"
    } relative overflow-hidden">
      <div className="absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Temperature Card - Main */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <div className="px-6 py-8 rounded-2xl ${
              isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
            } backdrop-blur xl:rounded-xl">
              <div className="text-4xl font-bold ${
                textColor
              } mb-1 ${isFahrenheit ? "text-[3xl]" : "text-[4xl]"}">
                {tempDisplay}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                Feels like {feelsLikeDisplay}°{isFahrenheit ? "F" : "C"}
              </div>
              <p className="text-gray-500 text-sm">{weather.description}</p>
            </div>
          </div>

          {/* Location */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="px-6 py-8 rounded-2xl ${
              isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
            } backdrop-blur xl:rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300 font-medium">
                  {weather.locationName}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(weather.time).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Weather Condition Icon */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 flex items-center justify-center">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center ${
              isNight
                ? "bg-indigo-950/40 text-indigo-400"
                : "bg-amber-950/30 text-amber-400"
            }">
              <weatherIcon
                name={weather.icon}
                size={60}
                className={textColor}
              />
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-7xl mx-auto">
          {/* Humidity */}
          <div className="p-4 rounded-xl ${
            isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
          } backdrop-blur transition-colors hover:bg-opacity-80">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Humidity
            </div>
            <div className="text-3xl font-bold ${
              textColor
            }">{weather.humidity}%</div>
          </div>

          {/* Wind */}
          <div className="p-4 rounded-xl ${
            isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
          } backdrop-blur transition-colors hover:bg-opacity-80">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Wind
            </div>
            <div className="text-3xl font-bold">{weather.wind_speed} {getWindDirectionLabel(
              weather.wind_direction
            )}</div>
            <Wind className="h-4 w-4 text-gray-400 mt-1" />
          </div>

          {/* UV Index */}
          <div className="p-4 rounded-xl ${
            isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
          } backdrop-blur transition-colors hover:bg-opacity-80">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              UV Index
            </div>
            <div className="text-3xl font-bold">
              {weather.uv_index}
              <span className="text-xs opacity-60">UV</span>
            </div>
          </div>

          {/* Pressure */}
          <div className="p-4 rounded-xl ${
            isNight ? "bg-indigo-950/30" : "bg-amber-950/20"
          } backdrop-blur transition-colors hover:bg-opacity-80">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Pressure
            </div>
            <div className="text-3xl font-bold">{weather.pressure} hPa</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-2 pt-8 border-t ${
          isNight ? "border-indigo-600/30" : "border-amber-500/30"
        }">
          <button
            onClick={onToggleUnit}
            className={`flex-1 rounded-lg px-4 py-2 transition-colors ${
              isFahrenheit
                ? "bg-[var(--primary)] text-white hover:bg-opacity-90"
                : "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-opacity-90"
            }`}
            aria-label="Switch to Fahrenheit"
          >
            {isFahrenheit ? "Switch to °C" : "Switch to °F"}
          </button>
        </div>
      </div>
    </section>
  );
};

// Weather icon component
const weatherIcon: React.FC<{
  name: string;
  size?: number;
  className?: string;
}> = ({ name, size = 40, className }) => {
  const iconMap: Record<string, React.ReactElement> = {
    "sun": <Sun className={`${className} h-[${size}px] w-[${size}px]`} />,
    "moon-stars": <MoonStars className={`${className} h-[${size}px] w-[${size}px]`} />,
    "cloud-rain": <CloudRain className={`${className} h-[${size}px] w-[${size}px]`} />,
    "snowflake": <Snowflake className={`${className} h-[${size}px] w-[${size}px]`} />,
    "wind": <Wind className={`${className} h-[${size}px] w-[${size}px]`} />,
    "default": <Sun className={`${className} h-[${size}px] w-[${size}px]`} />,
  };
  return iconMap[name] || iconMap.default;
};

weatherIcon.displayName = "weatherIcon";