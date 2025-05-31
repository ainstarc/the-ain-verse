import { FaHeart, FaCat, FaMagic } from 'react-icons/fa'
import '../styles/Footer.css'

const Footer = ({ className }) => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={className}>
      <p>
        Made with <FaHeart className="footer-icon heart" />, <FaCat className="footer-icon" />, and
        a pinch of AI <FaMagic className="footer-icon" /> magic (shoutout
        to <a className="ai-links" href="https://openai.com/chatgpt">ChatGPT</a> &
        <a className="ai-links" href="https://github.com/features/copilot">Copilot</a>).
      </p>
      <p>
        &copy; {currentYear} Ain. All the <span className="folder-icon">📂</span> tabs are
        still open.
      </p>
    </footer>
  )
}

export default Footer