import RepoCard from './RepoCard'
import '../styles/RepoList.css'

const RepoList = ({ repos, loading }) => {
  if (loading) {
    return (
      <section className="repo-list-container" aria-label="Repository list">
        <div className="loading">Loading repositories...</div>
      </section>
    )
  }
  
  if (!repos || repos.length === 0) {
    return (
      <section className="repo-list-container" aria-label="Repository list">
        <div className="no-repos">No repositories found</div>
      </section>
    )
  }
  
  return (
    <section className="repo-list-container" aria-label="Repository list">
      <div className="repo-list">
        {repos.map(repo => (
          <RepoCard 
            key={repo.id}
            repo={repo}
          />
        ))}
      </div>
    </section>
  )
}

export default RepoList