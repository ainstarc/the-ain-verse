import { useState, useEffect } from 'react'
import { 
  FaStar, FaCodeBranch, FaExclamationCircle, FaGithub, 
  FaExternalLinkAlt, FaExclamationTriangle, FaJs, FaHtml5, 
  FaCss3, FaPython, FaJava, FaPhp, FaCode, FaExclamationCircle as FaError
} from 'react-icons/fa'
import '../styles/RepoCard.css'

const RepoCard = ({ repo }) => {
  const [isLongDescription, setIsLongDescription] = useState(false)
  const [languages, setLanguages] = useState([])
  const [isLoadingLangs, setIsLoadingLangs] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // Check if description is long
    if (repo.description && repo.description.length > 120) {
      setIsLongDescription(true)
    }
    
    // Fetch top languages
    const fetchLanguages = async () => {
      try {
        setIsLoadingLangs(true)
        setError(null)
        const response = await fetch(repo.languages_url)
        
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.message && errorData.message.includes("API rate limit exceeded")) {
            setError("GitHub API rate limit exceeded. Try again later.")
          } else {
            setError(`Error: ${errorData.message || response.statusText}`)
          }
          return
        }
        
        const data = await response.json()
        // Convert to array of [language, bytes] pairs and sort by bytes
        const langArray = Object.entries(data).sort((a, b) => b[1] - a[1])
        // Take top 3 languages
        setLanguages(langArray.slice(0, 3))
      } catch (error) {
        console.error("Error fetching languages:", error)
        setError("Failed to load languages")
      } finally {
        setIsLoadingLangs(false)
      }
    }
    
    fetchLanguages()
  }, [repo.description, repo.languages_url])
  
  const formatRelativeDate = (dateString) => {
    const updateDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = currentDate - updateDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
  }
  
  // Format repository name with word breaks at hyphens and camelCase
  const formatRepoName = (name) => {
    return name
      .replace(/-/g, '-\u200B')
      .replace(/([a-z])([A-Z])/g, '$1\u200B$2')
  }
  
  // Get language icon
  const getLanguageIcon = (language) => {
    if (!language) return <FaCode />
    
    // Using only FontAwesome icons to avoid import issues
    switch(language) {
      case 'JavaScript': return <FaJs />
      case 'HTML': return <FaHtml5 />
      case 'CSS': return <FaCss3 />
      case 'Python': return <FaPython />
      case 'Java': return <FaJava />
      case 'PHP': return <FaPhp />
      default: return <FaCode />
    }
  }
  
  // Get language color with theme awareness
  const getLanguageColor = (language) => {
    if (!language) return 'var(--text-secondary-color)'
    
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Go: '#00ADD8',
      Rust: '#dea584',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB'
    }
    
    return colors[language] || 'var(--accent-color)'
  }
  
  return (
    <article className="repo-card">
      <div className="repo-header">
        <h3 className="repo-name">{formatRepoName(repo.name)}</h3>
        <div className="repo-links">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="repo-icon-link"
            title="View on GitHub"
          >
            <FaGithub />
          </a>
          {repo.homepage && (
            <a 
              href={repo.homepage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-icon-link"
              title="Visit GitHub Pages"
            >
              <FaExternalLinkAlt />
            </a>
          )}
          {repo.has_issues && repo.open_issues_count > 0 && (
            <a 
              href={`${repo.html_url}/issues`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-icon-link"
              title="View Issues"
            >
              <FaExclamationTriangle />
            </a>
          )}
        </div>
      </div>
      
      <div className={`repo-description ${isLongDescription ? 'long-text' : ''}`}>
        {repo.description || 'No description provided'}
      </div>
      
      <div className="repo-footer">
        <div className="repo-updated">
          Updated {formatRelativeDate(repo.updated_at)}
        </div>
        
        <div className="repo-stats-container">
          <div className="repo-languages">
            {isLoadingLangs ? (
              <span className="loading-languages">Loading...</span>
            ) : error ? (
              <span 
                className="language-error theme-aware" 
                title={error}
                onClick={() => error.includes("API rate limit") && setError("API rate limit exceeded. Click for a new cat message!")}
              >
                <FaError /> {error.includes("API rate limit") ? "🐱 Cat Attack!" : "Error"}
              </span>
            ) : (
              languages.map(([lang, bytes]) => (
                <div 
                  key={lang}
                  className="language-circle" 
                  style={{ backgroundColor: getLanguageColor(lang) }}
                  title={`${lang}: ${Math.round(bytes / 1024)} KB`}
                >
                  {getLanguageIcon(lang)}
                </div>
              ))
            )}
          </div>
          
          <div className="repo-stats">
            <div className="repo-stat" title="Stars">
              <FaStar />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="repo-stat" title="Forks">
              <FaCodeBranch />
              <span>{repo.forks_count}</span>
            </div>
            <div className="repo-stat" title="Issues">
              <FaExclamationCircle />
              <span>{repo.open_issues_count}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RepoCard