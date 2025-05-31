import { useState, useEffect, useRef } from "react";
import "../styles/Intro.css";

const Intro = () => {
  const [catMood, setCatMood] = useState("🐾");
  const pokeCountRef = useRef(0);
  const isAngryRef = useRef(false);
  const angryTimeoutRef = useRef(null);
  const isSoundPlayingRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  // Track user interaction with the site
  useEffect(() => {
    const handleUserInteraction = () => {
      hasUserInteractedRef.current = true;
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const handleCatInteraction = (e) => {
    if (!hasUserInteractedRef.current) return;
    // Don't do anything if sound is already playing
    if (isSoundPlayingRef.current) return;

    // Set flag that sound is playing to prevent multiple interactions
    isSoundPlayingRef.current = true;

    // Check if cat is already angry
    if (isAngryRef.current) {
      setCatMood("😾");

      // Only try to play sound if user has interacted with the site
      if (hasUserInteractedRef.current) {
        const catSound = document.getElementById("cat-sound");
        // Play angry sound - randomly select one of the angry sounds
        const angrySounds = [
          "cat-angry-1.mp3",
          "cat-growl-2.mp3",
          "cat-growl-3.mp3",
          "cat-growl-1.mp3",
        ];
        const randomAngrySound =
          angrySounds[Math.floor(Math.random() * angrySounds.length)];
        catSound.src = `sounds/${randomAngrySound}`;

        const playPromise = catSound.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }

        // Add event listener to detect when sound finishes
        catSound.onended = () => {
          isSoundPlayingRef.current = false;
        };
      } else {
        // If no sound played, reset the flag after a short delay
        setTimeout(() => {
          isSoundPlayingRef.current = false;
        }, 500);
      }
      return;
    }

    // Increment poke count
    pokeCountRef.current += 1;

    // Check if cat should get angry (6th poke)
    if (pokeCountRef.current >= 6) {
      // Cat gets angry
      isAngryRef.current = true;
      setCatMood("😾");

      // Only try to play sound if user has interacted with the site
      if (hasUserInteractedRef.current) {
        const catSound = document.getElementById("cat-sound");
        catSound.src = `sounds/cat-angry-1.mp3`;

        const playPromise = catSound.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }

        // Add event listener to detect when sound finishes
        catSound.onended = () => {
          isSoundPlayingRef.current = false;
        };
      } else {
        // If no sound played, reset the flag after a short delay
        setTimeout(() => {
          isSoundPlayingRef.current = false;
        }, 500);
      }

      // Set timeout to reset anger after 10 seconds
      if (angryTimeoutRef.current) {
        clearTimeout(angryTimeoutRef.current);
      }

      angryTimeoutRef.current = setTimeout(() => {
        isAngryRef.current = false;
        pokeCountRef.current = 0;
        setCatMood("🐾");
      }, 10000);
    } else {
      // Not angry yet
      // Change cat mood indicator to random (except angry)
      const moods = ["😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿"];
      setCatMood(moods[Math.floor(Math.random() * moods.length)]);

      // Only try to play sound if user has interacted with the site
      if (hasUserInteractedRef.current) {
        const catSound = document.getElementById("cat-sound");
        // Play random meow sound
        const meowSounds = [
          "cat-meow-1.mp3",
          "cat-meow-2.mp3",
          "cat-meow-3.mp3",
          "cat-meow-4.mp3",
          "cat-meow-5.mp3",
          "cat-meow-6.mp3",
          "cat-meow-7.mp3",
        ];
        const randomMeowSound =
          meowSounds[Math.floor(Math.random() * meowSounds.length)];
        catSound.src = `sounds/${randomMeowSound}`;

        const playPromise = catSound.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }

        // Add event listener to detect when sound finishes
        catSound.onended = () => {
          isSoundPlayingRef.current = false;
        };
      } else {
        // If no sound played, reset the flag after a short delay
        setTimeout(() => {
          isSoundPlayingRef.current = false;
        }, 500);
      }

      // Reset mood after a while
      setTimeout(() => {
        if (!isAngryRef.current) {
          setCatMood("🐾");
        }
      }, 3000);
    }
  };

  // Get style based on cat mood
  const getCatCallStyle = () => {
    if (isAngryRef.current) {
      return { color: "var(--cat-mood-angry-color, #e74c3c)" };
    } else if (catMood !== "🐾") {
      return { color: "var(--cat-mood-playful-color, #3498db)" };
    }
    return { color: "var(--cat-mood-default-color, inherit)" };
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (angryTimeoutRef.current) {
        clearTimeout(angryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="intro">
      <p>
        Hey there! Welcome to the Ain-Verse — my digital playground where ideas
        multiply faster than I can finish them, tabs are always way too many,
        and the code is as unpredictable as a cat&#8217;s mood. Most of this
        magic happens thanks to my "love interests" —
        <a className="ai-links" href="https://openai.com/chatgpt">
          ChatGPT
        </a>{" "}
        and
        <a className="ai-links" href="https://github.com/features/copilot">
          Copilot
        </a>
        — who I&#8217;m constantly tweaking, bossing around, and blaming when
        things go sideways.
      </p>
      <p>
        Dive in, explore my projects, catch the socials (coming soon), and
        don&#8217;t forget to tell your cat I said
        <span
          id="cat-call"
          onClick={handleCatInteraction}
          onMouseEnter={handleCatInteraction}
          style={getCatCallStyle()}
        >
          PSPSPSPS
        </span>
        <span id="cat-mood-indicator">{catMood}</span>— because everyone
        deserves some love.
      </p>

      <audio id="cat-sound" src="sounds/cat-meow-1.mp3" preload="auto"></audio>
    </section>
  );
};

export default Intro;
