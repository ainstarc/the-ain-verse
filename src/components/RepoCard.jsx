import { 
  FaStar, FaCodeBranch, FaExclamationCircle, FaGithub, 
  FaExternalLinkAlt, FaExclamationTriangle, FaJs, FaHtml5, 
  FaCss3, FaPython, FaJava, FaPhp, FaCode
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import '../styles/RepoCard.css'

const RepoCard = ({ repo }) => {
  const [isLongDescription, setIsLongDescription] = useState(false)
  
  useEffect(() => {
    // Check if description is long
    if (repo.description && repo.description.length > 120) {
      setIsLongDescription(true)
    }
  }, [repo.description])
  
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
      case 'JavaScript': return <FaJs />;
      case 'HTML': return <FaHtml5 />;
      case 'CSS': return <FaCss3 />;
      case 'Python': return <FaPython />;
      case 'Java': return <FaJava />;
      case 'PHP': return <FaPhp />;
      default: return <FaCode />;
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
        <div className="repo-meta">
          <div className="repo-updated">
            {formatRelativeDate(repo.updated_at)}
          </div>
          {repo.language && (
            <div 
              className="language-circle" 
              style={{ backgroundColor: getLanguageColor(repo.language) }}
              title={repo.language}
            >
              {getLanguageIcon(repo.language)}
            </div>
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
    </article>
  )
}

export default RepoCard