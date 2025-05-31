import { bodyElement } from "./domElements.js";

let currentWeatherAnimationClass = null;
let stopAnimationButton = null;

const WEATHER_ANIMATION_CLASSES = {
  Rain: "weather-rain",
  "Light Rain": "weather-rain",
  "Heavy Rain": "weather-rain",
  Drizzle: "weather-rain",
  Thunderstorm: "weather-lightning",
  // Add more mappings: "Snow": "weather-snow", etc.
};

export function createStopAnimationButton() {
  if (document.getElementById("stop-weather-animation-btn")) return; // Already exists

  stopAnimationButton = document.createElement("button");
  stopAnimationButton.id = "stop-weather-animation-btn";
  stopAnimationButton.className = "stop-weather-animation-btn"; // For CSS styling
  stopAnimationButton.innerHTML = "&times; Stop Animation"; // Using &times; for a nicer 'X'
  stopAnimationButton.setAttribute("aria-label", "Stop weather animation");
  stopAnimationButton.style.display = "none"; // Hidden by default

  stopAnimationButton.onclick = () => {
    if (currentWeatherAnimationClass && bodyElement) {
      bodyElement.classList.remove(currentWeatherAnimationClass);
      currentWeatherAnimationClass = null;
    }
    if (stopAnimationButton) stopAnimationButton.style.display = "none";
    localStorage.setItem("weatherAnimationDisabled", "true"); // Persist preference
  };
  document.body.appendChild(stopAnimationButton);
}

export function applyWeatherAnimation(weatherCondition) {
  if (
    !bodyElement ||
    localStorage.getItem("weatherAnimationDisabled") === "true"
  ) {
    if (stopAnimationButton) stopAnimationButton.style.display = "none";
    if (currentWeatherAnimationClass && bodyElement) {
      // Ensure bodyElement check here too
      bodyElement.classList.remove(currentWeatherAnimationClass);
      currentWeatherAnimationClass = null;
    }
    return;
  }

  if (currentWeatherAnimationClass && bodyElement) {
    bodyElement.classList.remove(currentWeatherAnimationClass);
    currentWeatherAnimationClass = null;
  }

  const animationClass = WEATHER_ANIMATION_CLASSES[weatherCondition];

  if (animationClass && bodyElement) {
    bodyElement.classList.add(animationClass);
    currentWeatherAnimationClass = animationClass;
    if (stopAnimationButton) stopAnimationButton.style.display = "block";
  } else {
    if (stopAnimationButton) stopAnimationButton.style.display = "none";
  }
}
