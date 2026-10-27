/*
  SkyPulse - Tailwind Configuration
  Tailwind CSS v3.4.1 with custom color palette for weather application
*/

/* Color palette optimized for weather conditions */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom properties for glassmorphism and dark mode */
:root {
  --bg: #0a0a0f;
  --card: #12121a;
  --card-hover: #1a1a24;
  --primary: #f59e0b;
  --primary-foreground: #1e293b;
  --secondary: #64748b;
  --muted: #94a3b8;
  --accent-rain: #3b82f6;
  --accent-snow: #e2e8f0;
  --accent-wind: #94a3b8;
  --accent-fog: #a0aec0;
}

/* Dark mode base */
.dark {
  --bg: #0a0a0f;
  --card: #12121a;
}

/* Base styles */
body {
  background-color: var(--bg);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Glassmorphism utilities */
.glass {
  background: var(--card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--card);
}

::-webkit-scrollbar-thumb {
  background: var(--muted);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Button styles */
.btn-primary {
  @apply bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors;
}

.btn-secondary {
  @apply bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors;
}