import { themeToggleButton } from './domElements.js'; // bodyElement is used in weatherAnimationManager
import { THEME_STORAGE_KEY } from './config.js';
import { createStopAnimationButton, applyWeatherAnimation } from './weatherAnimationManager.js';

const MOON_PHASE_EMOJIS = [
  '🌑', // New Moon
  '🌒', // Waxing Crescent
  '🌓', // First Quarter
  '🌔', // Waxing Gibbous
  '🌕', // Full Moon
  '🌖', // Waning Gibbous
  '🌗', // Last Quarter
  '🌘', // Waning Crescent
];

const WEATHER_EMOJIS = {
  "Clouds": { day: '☁️', night: '☁️' },
  "Partly Cloudy": { day: '🌥️', night: '☁️' },
  "Overcast": { day: '☁️', night: '☁️' },
  "Few Clouds": { day: '🌤️', night: '☁️'},
  "Scattered Clouds": { day: '🌥️', night: '☁️'},
  "Broken Clouds": { day: '☁️', night: '☁️'},
  "Rain": { day: '🌦️', night: '🌧️' },
  "Light Rain": { day: '🌦️', night: '🌧️' },
  "Heavy Rain": { day: '🌧️', night: '🌧️' },
  "Drizzle": { day: '🌦️', night: '🌧️' },
  "Snow": { day: '🌨️', night: '🌨️' },
  "Light Snow": { day: '🌨️', night: '🌨️' },
  "Thunderstorm": { day: '⛈️', night: '⛈️' },
  "Fog": { day: '🌫️', night: '🌫️' },
  "Mist": { day: '🌫️', night: '🌫️' },
  "Haze": { day: '🌫️', night: '🌫️' }
};

function getMoonPhaseEmoji() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  const day = today.getDate();
  if (month < 3) {
    year--;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = Math.floor(a / 4);
  const c = 2 - a + b;
  const e = Math.floor(365.25 * (year + 4716));
  const f = Math.floor(30.6001 * (month + 1));
  const jd = c + day + e + f - 1524.5;
  const daysSinceNewMoon = jd - 2451549.5;
  const moonAge = daysSinceNewMoon % 29.53058867;
  const phaseIndex = Math.floor((moonAge / 29.53058867) * 8 + 0.5) % 8;
  return MOON_PHASE_EMOJIS[phaseIndex];
}

async function fetchWeatherData(lat, lon) {
  console.log(`Simulating weather fetch for lat: ${lat}, lon: ${lon}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const conditions = [
        "Clear", "Clouds", "Rain", "Snow", "Fog", "Partly Cloudy",
        "Overcast", "Thunderstorm", "Drizzle", "Few Clouds", "Light Rain"
      ];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      resolve(randomCondition);
    }, 1000);
  });
}

function getWeatherEmoji(weatherCondition, isDayTime) {
  if (weatherCondition === "Clear") {
    return isDayTime ? "☀️" : getMoonPhaseEmoji();
  }
  if (weatherCondition) {
    const emojiMapping = WEATHER_EMOJIS[weatherCondition];
    if (typeof emojiMapping === 'object' && emojiMapping !== null) {
      return isDayTime ? emojiMapping.day : emojiMapping.night;
    } else if (typeof emojiMapping === 'string') {
      return emojiMapping;
    }
  }
  return isDayTime ? "☀️" : getMoonPhaseEmoji();
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);

  if (themeToggleButton) {
    let initialIcon = isDark ? getMoonPhaseEmoji() : "☀️";
    themeToggleButton.textContent = initialIcon;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherCondition = await fetchWeatherData(latitude, longitude);
          themeToggleButton.textContent = getWeatherEmoji(weatherCondition, !isDark); // !isDark determines if it's daytime context
          applyWeatherAnimation(weatherCondition); // Apply animation based on fetched weather
        } catch (error) {
          console.error("Error fetching weather data:", error);
          applyWeatherAnimation(null); // Clear animation on error
        }
      }, (error) => {
        console.warn("Geolocation permission denied or error:", error.message);
        applyWeatherAnimation(null); // Clear animation if no location
      });
    } else {
      console.warn("Geolocation is not supported by this browser.");
      applyWeatherAnimation(null); // Clear animation if no geolocation
    }
    themeToggleButton.setAttribute("aria-pressed", isDark.toString());
    themeToggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function toggleTheme() {
  const currentThemeIsDark = document.body.classList.contains("dark-theme");
  const newTheme = currentThemeIsDark ? "light" : "dark";
  // Clear weather animation preference if theme changes, or handle as desired
  // localStorage.removeItem('weatherAnimationDisabled');
  applyTheme(newTheme);
}

export function loadInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  let initialTheme = "light";
  if (savedTheme) {
    initialTheme = savedTheme;
  } else if (prefersDarkScheme) {
    initialTheme = "dark";
  }
  
  createStopAnimationButton(); // Create the button once on load
  applyTheme(initialTheme); 

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  } else {
    console.warn("Theme toggle button (#theme-toggle) not found. Theme switching via UI will not be available.");
  }
}
