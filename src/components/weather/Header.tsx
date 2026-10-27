/*
  SkyPulse - Header Component
  Header component with search bar, location selector, and unit toggle
*/

import { useState, useEffect } from "react";
import { Search, LocationPin, Sun, MoonStars, Settings, ChevronDown, X } from "lucide-react";

type WeatherUnit = "celsius" | "fahrenheit";

interface HeaderProps {
  onLocationSelect: (location: { name: string; lat: number; lon: number }) => void;
  onUnitToggle: (unit: WeatherUnit) => void;
  initialUnit?: WeatherUnit;
  recentSearches?: string[];
  onRecentSearchSelect?: (search: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLocationSelect,
  onUnitToggle,
  initialUnit = "celsius",
  recentSearches = [],
  onRecentSearchSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, updateDebouncedSearch] = useDebouncedSearch(searchQuery, 300);
  const [unit, setUnit] = useState<WeatherUnit>(initialUnit);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearchQuery(value);
    updateDebouncedSearch(value); // Track search history
    onRecentSearchSelect?.(value);
  };

  // Handle search submit (enter key or search button)
  const handleSearchSubmit = () => {
    const value = searchQuery.trim();
    if (value) {
      // Geocode the search location or use Open-Meteo search
      // For now, we'll try to use the search as a location name
      // In a full implementation, this would call a geocoding API
      onLocationSelect?.({ name: value, lat: 0, lon: 0 });
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setIsSearchOpen(true);
    onRecentSearchSelect?.(search);
  };

  // Convert unit label
  const unitLabel = unit === "celsius" ? "°F" : "°C";

  return (
    <header className="border-b bg-[var(--sidebar-bg)]/80 backdrop-blur-md border-b-border/40 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left section: Title and actions */}
          <div className="flex items-center gap-3">
            <Sun className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              SkyPulse
            </span>
          </div>

          {/* Right section: Search and controls */}
          <div className="flex items-center gap-3">
            {/* Unit toggle button */}
            <button
              onClick={() => setUnit(unit === "celsius" ? "fahrenheit" : "celsius")}
              className={`relative flex items-center gap-2 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`Switch to ${unitLabel}`}
            >
              {unit === "celsius" ? (
                <span className="text-sm font-medium">C</span>
              ) : (
                <span className="text-sm font-medium">F</span>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" />
              <input
                type="text"
                placeholder="Search city or location..."
                value={debouncedSearch}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-full border border-border/40 bg-transparent focus:outline-none focus:ring-2 focus-ring-[var(--primary)] transition-colors placeholder-gray-400/50 ${
                  isSearchOpen ? "bg-[var(--card)]" : "bg-transparent"
                }`}
                aria-label="Search city or location"
              />
            </div>

            {/* Search toggle button */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                isSearchOpen
                  ? "bg-[var(--card)] text-[var(--foreground)] border border-border/40"
                  : "text-gray-400 hover:bg-[var(--card)] hover:border-border/40"
              }`}
              aria-label="Toggle search"
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>

            {/* Recent searches (if available) */}
            {recentSearches.length > 0 && (
              <div className="hidden sm:block absolute right-0 mt-2 w-48 rounded-md bg-[var(--card)] border border-border/20 shadow-sm z-10 w-44 animate-in fade-in-0 ${
                isSearchOpen ? "data-[state]=open" : ""
              }">
                <div className="px-2 py-1">
                  <p className="text-xs text-gray-500 capitalize">Recent</p>
                  <ul className="space-y-1 pl-2">
                    {recentSearches
                      .slice(0, 5)
                      .map((search) => (
                        <li
                          key={search}
                          className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          {search}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Debounced search hook would be imported from useWeather
// For this component, we define a local version
const useDebouncedSearch = <T>(
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