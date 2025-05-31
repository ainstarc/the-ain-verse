import { useState, useEffect } from 'react'
import '../styles/Intro.css'

const Intro = () => {
  const [catMood, setCatMood] = useState('🐾')
  
  const handleCatCall = () => {
    // Play cat sound
    const catSound = document.getElementById('cat-sound')
    if (catSound) {
      // Randomly select a cat sound
      const soundIndex = Math.floor(Math.random() * 7) + 1
      catSound.src = `sounds/cat-meow-${soundIndex}.mp3`
      catSound.play()
      
      // Change cat mood indicator
      const moods = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
      setCatMood(moods[Math.floor(Math.random() * moods.length)])
      
      // Reset after a while
      setTimeout(() => {
        setCatMood('🐾')
      }, 3000)
    }
  }
  
  return (
    <section className="intro">
      <p>
        Hey there! Welcome to the Ain-Verse — my digital playground where ideas
        multiply faster than I can finish them, tabs are always way too many,
        and the code is as unpredictable as a cat&#8217;s mood. Most of this
        magic happens thanks to my "love interests" —
        <a className="ai-links" href="https://openai.com/chatgpt">ChatGPT</a> and
        <a className="ai-links" href="https://github.com/features/copilot">Copilot</a>
        — who I&#8217;m constantly tweaking, bossing around, and blaming when
        things go sideways.
      </p>
      <p>
        Dive in, explore my projects, catch the socials (coming soon), and
        don&#8217;t forget to tell your cat I said
        <em id="cat-call" onClick={handleCatCall} style={{cursor: 'pointer'}}> pspspsps </em>
        <span id="cat-mood-indicator">{catMood}</span>
        — because everyone deserves some love.
      </p>
      
      <audio id="cat-sound" src="sounds/cat-meow-1.mp3" preload="auto"></audio>
    </section>
  )
}

export default Intro