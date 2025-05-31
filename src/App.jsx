import { useState, useEffect } from 'react'
import Header from './components/Header'
import Intro from './components/Intro'
import RepoList from './components/RepoList'
import LiveIssues from './components/LiveIssues'
import Footer from './components/Footer'
import config from './utils/config'
import './styles/App.css'

function App() {
  const [theme, setTheme] = useState('light')
  const [repos, setRepos] = useState([])
  const [filteredRepos, setFilteredRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showIssues, setShowIssues] = useState(false)
  
  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.body.setAttribute('data-theme', savedTheme)
    
    // Fetch repositories
    fetchRepos()
  }, [])
  
  useEffect(() => {
    // Add class to body when sidebar is active
    if (showIssues) {
      document.body.classList.add('sidebar-active')
    } else {
      document.body.classList.remove('sidebar-active')
    }
  }, [showIssues])
  
  const fetchRepos = async () => {
    try {
      setLoading(true)
      const response = await fetch(config.api.repos(config.githubUsername))
      if (!response.ok) throw new Error('Failed to fetch repositories')
      
      const data = await response.json()
      setRepos(data)
      setFilteredRepos(data)
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.body.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredRepos(repos)
      return
    }
    
    const filtered = repos.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredRepos(filtered)
  }
  
  const toggleIssuesPanel = () => {
    setShowIssues(!showIssues)
  }

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Intro />
      
      <main>
        <div id="status" aria-live="polite" role="status" className="status">
          {loading ? 'Loading...' : ''}
        </div>
        
        <section className="repo-controls" aria-label="Repository controls">
          <input
            type="search"
            id="repo-search-input"
            placeholder="Search repositories..."
            aria-label="Search repositories"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </section>
        
        <RepoList repos={filteredRepos} loading={loading} />
      </main>
      
      <LiveIssues show={showIssues} toggleIssuesPanel={toggleIssuesPanel} />
      <Footer />
    </>
  )
}

export default App