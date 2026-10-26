# SkyPulse - Modern Weather SaaS Application

![SkyPulse Banner](https://img.shields.io/badge/SkyPulse-Weather%20SaaS-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)

## 🌤️ About SkyPulse

SkyPulse is a modern, production-grade Weather SaaS application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**. It provides real-time weather data, interactive forecasts, and comprehensive weather metrics through a sleek dark-mode glassmorphism interface.

## 🚀 Features

### Core Features
- **Real-time Current Weather** - Temperature, feels like, humidity, wind, UV index, AQI, pressure, visibility
- **24-Hour Hourly Forecast** - Horizontal scrollable timeline with condition icons
- **7-Day Extended Forecast** - Daily high/low ranges with mini bar charts
- **Weather Metrics Grid** - AQI, UV Index, Wind, Humidity, Pressure widgets

### UI/UX
- **Dark-mode default** with glassmorphism design
- **Responsive layout** - Mobile, Tablet, Desktop optimized
- **Dynamic backgrounds** - Weather-condition-specific color schemes
- **°C/°F toggle** - Smooth unit conversion animations
- **Geolocation detection** - Auto-detect user location with fallback

### SaaS Features
- **Search & Location Management** - Search any city worldwide
- **Recent searches** - Saved in localStorage
- **Interactive components** - Hover states, scaling animations
- **Error handling** - Robust fallback states

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Weather API**: Open-Meteo (Free, high-rate-limit)
- **Deployment**: Netlify / Vercel compatible

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   └── page.tsx           # Main dashboard page
├── components/
│   └── weather/           # Weather components
│       ├── Header.tsx     # Search, location, unit toggle
│       ├── CurrentWeatherCard.tsx  # Hero card
│       ├── HourlyForecast.tsx      # 24-hour slider
│       ├── SevenDayForecast.tsx   # 7-day forecast
│       └── WeatherMetricsGrid.tsx # Metrics widgets
├── hooks/                 # Custom React hooks
│   └── useWeather.ts    # Geolocation, debounced search, fetching
└── lib/                   # Utilities and types
    └── weather.ts       # Types, API helpers, conversions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WebDesigner786/SkyPulse.git

# Navigate to project
cd SaaS

# Install dependencies
npm install

# Run development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🌐 Deployment

### Netlify Deployment

1. Push code to GitHub (see deployment section)
2. Connect your GitHub repository to Netlify
3. Netlify auto-detects Next.js projects
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy!

### Vercel Deployment

1. Import project from GitHub
2. Vercel auto-configures Next.js
3. Deploy with one click

## 📦 API Integration

The application uses **Open-Meteo API** (free, no API key required):

```bash
# Current weather endpoint
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&longitude={lon}&
  current_weather=true&
  timezone=auto
```

## 🎨 Design

- **Theme**: Dark-mode default with glassmorphism
- **Color Scheme**: Amber/Yellow for clear, Blue for rain, Cyan for snow, Indigo for night
- **Typography**: System fonts, optimized line heights
- **Interactions**: Hover scaling, smooth transitions, loading skeletons

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Open-Meteo for free weather API
- Shadcn UI for component primitives
- Lucide for icons
- Next.js team for App Router