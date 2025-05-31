import { useState, useEffect } from 'react'
import { FaGithub, FaInstagram, FaYoutube, FaTwitter, FaDiscord } from 'react-icons/fa'
import config from '../utils/config'
import '../styles/Header.css'

const Header = ({ theme, toggleTheme }) => {
  const [socialLinks, setSocialLinks] = useState(config.social)
  
  return (
    <header>
      <h1>Enter the Ain-Verse</h1>
      <div className="header-controls">
        <nav className="social-links" aria-label="Social media links">
          <a
            id="github-social"
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            id="instagram-social"
            className={!socialLinks.instagram || socialLinks.instagram === '#' ? 'hide' : ''}
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            id="youtube-social"
            className={!socialLinks.youtube || socialLinks.youtube === '#' ? 'hide' : ''}
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            id="twitter-social"
            className={!socialLinks.twitter || socialLinks.twitter === '#' ? 'hide' : ''}
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            id="discord-social"
            className={!socialLinks.discord || socialLinks.discord === '#' ? 'hide' : ''}
            href={socialLinks.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <FaDiscord />
          </a>
        </nav>
        <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}

export default Header