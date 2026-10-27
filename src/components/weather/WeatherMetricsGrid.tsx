/*
  SkyPulse - Weather Metrics Grid
  Grid of weather metrics widgets (AQI, UV, Wind, Humidity, Pressure)
*/

import { useWeatherFetching } from "@/hooks/useWeather";

type WeatherUnit = "celsius" | "fahrenheit";

interface WeatherMetricsGridProps {
  lat?: number;
  lon?: number;
  unit?: WeatherUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  lat,
  lon,
  unit = "celsius",
}) => {
  const {
    data: weatherData,
    loading,
    error,
  } = useWeatherFetching(lat ?? 0, lon ?? 0, unit);

  // Default metric data when no API data available
  const defaultMetrics = [
    { label: "AQI", value: "N/A", unit: "", icon: "cloud" },
    { label: "UV Index", value: "0", unit: "", icon: "sun" },
    { label: "Wind", value: "0", unit: "km/h", icon: "wind" },
    { label: "Humidity", value: "0", unit: "%", icon: "cloud-rain" },
    { label: "Pressure", value: "1013", unit: "hPa", icon: "cloud" },
  ];

  if (error && !weatherData) {
    return (
      <div className="grid grid-cols-2 gap-4 py-12">
        {defaultMetrics.map((metric, i) => (
          <div key={i} className="p-4 rounded-xl bg-[var(--card)] backdrop-blur border border-border/40">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {metric.label}
            </div>
            <div className="text-2xl font-bold text-gray-300">{metric.value}{metric.unit}</div>
            <Icon name={metric.icon} className="h-4 w-4 text-gray-500 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (loading && !weatherData) {
    return (
      <div className="grid grid-cols-2 gap-4 py-12">
        {Array.from({ length: 5 }, () => (
          <div key={Math.random().toString(36).slice(2)} className="h-12 w-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl animate-bounce" />
        ))}
      </div>
    );
  }

  // Extract metrics from weather data
  const metrics = useMemo(() => {
    if (!weatherData?.current) return defaultMetrics;

    return [
      {
        label: "AQI",
        value: weatherData.current.aqi ?? "N/A",
        unit: "",
        icon: "cloud",
      },
      {
        label: "UV Index",
        value: weatherData.current.uv_index ?? "0",
        unit: "",
        icon: "sun",
      },
      {
        label: "Wind",
        value: Math.round(weatherData.current.wind_speed) ?? "0",
        unit: "km/h",
        icon: "wind",
      },
      {
        label: "Humidity",
        value: weatherData.current.humidity ?? "0",
        unit: "%",
        icon: "cloud-rain",
      },
      {
        label: "Pressure",
        value: weatherData.current.pressure ?? "1013",
        unit: "hPa",
        icon: "cloud",
      },
    ];
  }, [weatherData?.current]);

  return (
    <section className="py-6 bg-[var(--card)]/80 backdrop-blur-md border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl bg-[var(--card)] backdrop-blur border border-border/40 transition-colors hover:border-amber-500/30 ${
                index % 2 === 0 ? "border-l-4 border-amber-500/30" : ""
              }`}
              aria-label={`${metric.label}: ${metric.value}${metric.unit}`}
            >
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {metric.label}
              </div>
              <div className="text-2xl font-bold text-white">
                {metric.value}{metric.unit}
              </div>
              <Icon name={metric.icon} className="h-4 w-4 text-gray-300 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Icon component
const Icon: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className }) => {
  const iconMap: Record<string, React.ReactElement> = {
    "sun": <Sun className={className} />,
    "moon-stars": <MoonStars className={className} />,
    "cloud-rain": <CloudRain className={className} />,
    "snowflake": <Snowflake className={className} />,
    "wind": <Wind className={className} />,
    "cloud": <Sun className={`${className} opacity-60`} />,
    "cloud-fog": <Sun className={`${className} opacity-50`} />,
    "default": <Sun className={className} />,
  };
  return iconMap[name] || iconMap.default;
};

Icon.displayName = "Icon";