import { catCallElement, catAudioElement, catMoodIndicator } from './domElements.js';

export function initializeCatSound() {
  if (!catCallElement || !catAudioElement || !catMoodIndicator) {
    if (!catCallElement) console.warn("Cat call element (#cat-call) not found for sound effect.");
    if (!catAudioElement) console.warn("Cat sound audio element (#cat-sound) not found.");
    if (!catMoodIndicator) console.warn("Cat mood indicator element (#cat-mood-indicator) not found.");
    return;
  }

  if (catAudioElement.src) {
      catAudioElement.load();
  }

  let canPlaySound = true;
  const GENERAL_SOUND_COOLDOWN_MS = 500;

  const ANGRY_SOUND_FILES = [
    "sounds/cat-angry-1.mp3"
  ];

  const NORMAL_CAT_SOUNDS = [
    "sounds/cat-meow-1.mp3", "sounds/cat-meow-2.mp3", "sounds/cat-meow-3.mp3",
    "sounds/cat-meow-4.mp3", "sounds/cat-meow-5.mp3", "sounds/cat-meow-6.mp3",
    "sounds/cat-meow-7.mp3", "sounds/cat-growl.mp3", "sounds/cat-growl-2.mp3",
    "sounds/cat-growl-3.mp3"
  ];

  const OTHER_RANDOM_SOUNDS = NORMAL_CAT_SOUNDS;

  let hoverTimestamps = [];
  const ANGER_THRESHOLD_COUNT = 5;
  const IDLE_EMOJI_TIMEOUT_MS = 5000;
  const ANGER_TIME_WINDOW_MS = 10000;

  function getCatBehaviorVolume() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 9) return 0.8;
    if (currentHour >= 18 && currentHour < 22) return 0.9;
    if (currentHour >= 22 || currentHour < 5) return 0.3;
    return 0.5;
  }

  let idleEmojiTimeoutId = null;
  function setIdleEmoji() {
    if (catMoodIndicator) catMoodIndicator.textContent = "💤";
    if (catCallElement) {
      catCallElement.style.fontWeight = '';
      catCallElement.style.color = 'var(--cat-mood-idle-color)';
      catCallElement.style.textTransform = 'none';
    }
  }

  function resetIdleEmojiTimer() {
    if (idleEmojiTimeoutId) clearTimeout(idleEmojiTimeoutId);
    idleEmojiTimeoutId = setTimeout(setIdleEmoji, IDLE_EMOJI_TIMEOUT_MS);
  }

  function triggerCatSound() {
    if (!canPlaySound) return;
    if (idleEmojiTimeoutId) clearTimeout(idleEmojiTimeoutId);

    canPlaySound = false;
    const currentTime = Date.now();
    hoverTimestamps.push(currentTime);
    hoverTimestamps = hoverTimestamps.filter((ts) => currentTime - ts < ANGER_TIME_WINDOW_MS);

    let soundToPlay;
    let currentMoodEmoji = catMoodIndicator.textContent;
    let currentMoodColor = catCallElement.style.color || 'var(--cat-mood-default-color)';

    if (hoverTimestamps.length > ANGER_THRESHOLD_COUNT) {
      soundToPlay = ANGRY_SOUND_FILES[Math.floor(Math.random() * ANGRY_SOUND_FILES.length)];
      currentMoodEmoji = "😾";
      currentMoodColor = 'var(--cat-mood-angry-color)';
      if (catCallElement) { catCallElement.style.fontWeight = 'bold'; catCallElement.style.textTransform = 'uppercase'; }
    } else {
      if (catCallElement) { catCallElement.style.fontWeight = ''; catCallElement.style.textTransform = 'none'; }
      if (OTHER_RANDOM_SOUNDS.length > 0) {
        soundToPlay = OTHER_RANDOM_SOUNDS[Math.floor(Math.random() * OTHER_RANDOM_SOUNDS.length)];
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 9) { currentMoodEmoji = "😺✨"; currentMoodColor = 'var(--cat-mood-playful-color)'; }
        else if (currentHour >= 18 && currentHour < 22) { currentMoodEmoji = "😼🌙"; currentMoodColor = 'var(--cat-mood-alert-color)'; }
        else { currentMoodEmoji = "🐾"; currentMoodColor = 'var(--cat-mood-default-color)'; }
      } else { soundToPlay = null; }
    }

    if (catMoodIndicator) catMoodIndicator.textContent = currentMoodEmoji;
    if (catCallElement) catCallElement.style.color = currentMoodColor;

    if (soundToPlay) {
      catAudioElement.src = soundToPlay;
      catAudioElement.oncanplaythrough = () => {
        catAudioElement.volume = getCatBehaviorVolume();
        catAudioElement.currentTime = 0;
        catAudioElement.play().catch((error) => console.warn("Could not play cat sound:", error));
        catAudioElement.oncanplaythrough = null;
      };
      catAudioElement.load();
    }
    setTimeout(() => { canPlaySound = true; }, GENERAL_SOUND_COOLDOWN_MS);
    resetIdleEmojiTimer();
  }

  resetIdleEmojiTimer();
  catCallElement.addEventListener("mouseenter", triggerCatSound);
  catCallElement.addEventListener("click", triggerCatSound);
}
